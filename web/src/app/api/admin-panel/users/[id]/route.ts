import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/admin-api";
import { hasRecentReauth } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { z } from "zod";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { error } = await adminApi("users");
  if (error) return error;

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
      updatedAt: true,
      stripeCustomerId: true,
      emailVerifiedAt: true,
      subscription: {
        select: { status: true, stripePriceId: true, currentPeriodEnd: true, cancelAtPeriodEnd: true },
      },
      _count: { select: { resumes: true, jobApplications: true } },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    ...user,
    resumeCount: user._count.resumes,
    appCount: user._count.jobApplications,
    _count: undefined,
  });
}

const patchSchema = z.object({
  role: z.enum(["user", "owner", "admin", "editor", "support"]).optional(),
  name: z.string().min(1).optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { staff: admin, error } = await adminApi("users");
  if (error) return error;

  const { id } = await params;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data: Record<string, string> = {};
  if (parsed.data.name) data.name = parsed.data.name;
  if (parsed.data.role) {
    // Roles are the owner's call, and need a fresh password + code.
    if (admin.role !== "owner") return NextResponse.json({ error: "Only an owner can change roles." }, { status: 403 });
    if (!(await hasRecentReauth(admin.sub))) return NextResponse.json({ error: "Confirm it's you first.", code: "reauth_required" }, { status: 401 });
    if (id === admin.sub && parsed.data.role !== "owner") {
      const owners = await prisma.user.count({ where: { role: "owner" } });
      if (owners <= 1) return NextResponse.json({ error: "You're the only owner. Make someone else an owner first." }, { status: 400 });
    }
    data.role = parsed.data.role;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  const before = await prisma.user.findUnique({ where: { id }, select: { role: true } });
  if (!before) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const user = await prisma.user.update({ where: { id }, data });
  if (data.role && data.role !== before.role) {
    await recordAudit({ actorId: admin.sub, action: "user.role.change", entity: "User", entityId: id, diff: { from: before.role, to: data.role }, ip: getClientIp(req) });
  }

  return NextResponse.json({ id: user.id, email: user.email, role: user.role, name: user.name });
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { staff: admin, error } = await adminApi("users");
  if (error) return error;
  if (!(await hasRecentReauth(admin.sub))) {
    return NextResponse.json({ error: "Confirm it's you first.", code: "reauth_required" }, { status: 401 });
  }

  const { id } = await params;
  if (id === admin.sub) return NextResponse.json({ error: "You can't delete your own account here." }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  await prisma.user.delete({ where: { id } });
  await recordAudit({ actorId: admin.sub, action: "user.delete", entity: "User", entityId: id, ip: getClientIp(req) });

  return NextResponse.json({ deleted: true });
}
