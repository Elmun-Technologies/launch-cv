import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";

const body = z.object({
  email: z.string().email().max(254),
  role: z.enum(["owner", "admin", "editor", "support", "user"]),
});

/** Give an existing account a staff role (or remove it with "user"). Owner only, re-confirmed. */
export async function POST(req: Request) {
  const g = await adminApi("roles", { reauth: true });
  if (g.error) return g.error;
  const parsed = body.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Enter an email and a role." }, { status: 400 });
  const email = parsed.data.email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true, role: true, emailVerifiedAt: true } });
  if (!user) return NextResponse.json({ error: "No account with that email. Ask them to sign up first." }, { status: 404 });
  if (parsed.data.role !== "user" && !user.emailVerifiedAt) {
    return NextResponse.json({ error: "That account hasn't verified its email yet." }, { status: 400 });
  }
  if (user.id === g.staff.sub && parsed.data.role !== "owner") {
    const owners = await prisma.user.count({ where: { role: "owner" } });
    if (owners <= 1) return NextResponse.json({ error: "You're the only owner. Make someone else an owner first." }, { status: 400 });
  }
  await prisma.user.update({ where: { id: user.id }, data: { role: parsed.data.role } });
  await recordAudit({ actorId: g.staff.sub, action: "user.role.change", entity: "User", entityId: user.id, diff: { from: user.role, to: parsed.data.role }, ip: getClientIp(req) });
  return NextResponse.json({ ok: true });
}
