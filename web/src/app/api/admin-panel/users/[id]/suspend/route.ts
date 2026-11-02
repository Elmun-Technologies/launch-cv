import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/admin-api";
import { isAdminUser } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";

const bodySchema = z.object({ suspended: z.boolean() });

/**
 * Suspend or restore an account. While User.suspendedAt is set, sign-in is
 * refused and lib/session.ts treats any existing cookie as signed out, so the
 * user loses access to every page and API at once. Nothing is deleted.
 */
export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { staff, error } = await adminApi("users", { reauth: true });
  if (error) return error;
  const { id } = await params;

  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  const { suspended } = parsed.data;

  if (id === staff.sub) return NextResponse.json({ error: "You can't suspend your own account." }, { status: 400 });

  const target = await prisma.user.findUnique({
    where: { id },
    select: { suspendedAt: true, role: true, email: true, emailVerifiedAt: true },
  });
  if (!target) return NextResponse.json({ error: "User not found" }, { status: 404 });
  // Staff accounts are the owner's call, like role changes.
  if (isAdminUser(target) && staff.role !== "owner") {
    return NextResponse.json({ error: "Only an owner can suspend or restore a staff account." }, { status: 403 });
  }

  if (!!target.suspendedAt === suspended) {
    return NextResponse.json({ suspended, suspendedAt: target.suspendedAt });
  }
  const after = await prisma.user.update({
    where: { id },
    data: { suspendedAt: suspended ? new Date() : null },
    select: { suspendedAt: true },
  });
  await recordAudit({
    actorId: staff.sub,
    action: suspended ? "user.suspend" : "user.unsuspend",
    entity: "User",
    entityId: id,
    diff: { from: { suspended: !!target.suspendedAt }, to: { suspended } },
    ip: getClientIp(req),
  });
  return NextResponse.json({ suspended, suspendedAt: after.suspendedAt });
}
