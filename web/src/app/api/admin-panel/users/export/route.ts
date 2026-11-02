import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { USER_FILTERS, toUserRows, userListSelect, userListWhere } from "@/lib/admin-user-list";
import { csvResponse, toCsv } from "@/lib/admin-csv";
import { statusDisplay } from "@/lib/admin-billing";
import { planLabel, roleLabel } from "@/lib/admin-labels";
import { utcDayKey } from "@/lib/admin-dates";

/** Hard cap so one click can't pull an unbounded table into memory. */
const MAX_ROWS = 50_000;

const querySchema = z.object({
  q: z.string().trim().max(200).optional(),
  filter: z.enum(USER_FILTERS).default("all"),
});

/**
 * CSV of the users matching the list's search and filter. A bulk copy of
 * personal data, so it needs the users permission plus a fresh password +
 * code check, and every export is written to the audit log.
 */
export async function GET(req: Request) {
  const { staff, error } = await adminApi("users", { reauth: true });
  if (error) return error;

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    q: url.searchParams.get("q") || undefined,
    filter: url.searchParams.get("filter") || undefined,
  });
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const { q, filter } = parsed.data;

  const users = await prisma.user.findMany({
    where: userListWhere(q, filter),
    orderBy: { createdAt: "desc" },
    take: MAX_ROWS,
    select: userListSelect,
  });
  const rows = await toUserRows(users);

  await recordAudit({
    actorId: staff.sub,
    action: "user.export",
    entity: "User",
    diff: { rows: rows.length, filter, ...(q ? { search: q } : {}) },
    ip: getClientIp(req),
  });

  const csv = toCsv(
    ["id", "email", "name", "role", "plan", "status", "suspended", "resumes", "applications", "joined_utc"],
    rows.map((r) => [
      r.id,
      r.email,
      r.name,
      roleLabel(r.role),
      planLabel(r.plan),
      r.status === "none" ? "" : statusDisplay(r.status).label,
      r.suspended ? "yes" : "no",
      r.resumeCount,
      r.appCount,
      r.createdAt,
    ]),
  );
  return csvResponse(`launchcv-users-${filter}-${utcDayKey(new Date())}.csv`, csv);
}
