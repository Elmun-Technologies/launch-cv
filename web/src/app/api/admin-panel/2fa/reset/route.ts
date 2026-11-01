import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";

const body = z.object({ userId: z.string().min(1).max(64) });

/** Clear a team member's authenticator (lost phone). They set it up again on next visit. Owner only. */
export async function POST(req: Request) {
  const g = await adminApi("roles", { reauth: true });
  if (g.error) return g.error;
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  await prisma.user.update({ where: { id: parsed.data.userId }, data: { totpSecret: null, totpEnabledAt: null, totpLastStep: null } });
  await recordAudit({ actorId: g.staff.sub, action: "admin.2fa.reset", entity: "User", entityId: parsed.data.userId, ip: getClientIp(req) });
  return NextResponse.json({ ok: true });
}
