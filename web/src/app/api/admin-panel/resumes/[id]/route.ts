import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";

/** Delete one resume (support action). Needs the users permission and a fresh re-confirmation. */
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const g = await adminApi("users", { reauth: true });
  if (g.error) return g.error;
  const { id } = await params;
  const resume = await prisma.resume.findUnique({ where: { id }, select: { id: true, userId: true, title: true } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });
  await prisma.resume.delete({ where: { id } });
  await recordAudit({
    actorId: g.staff.sub,
    action: "resume.delete",
    entity: "Resume",
    entityId: id,
    diff: { ownerId: resume.userId },
    ip: getClientIp(req),
  });
  return NextResponse.json({ deleted: true });
}
