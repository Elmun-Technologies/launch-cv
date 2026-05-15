import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/cms/audit";
import { bustFaqCache } from "@/lib/cms/revalidate";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const before = await prisma.faq.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (typeof body.question === "string") data.question = body.question.trim();
  if (typeof body.answer === "string") data.answer = body.answer.trim();
  if (typeof body.placement === "string") data.placement = body.placement.trim();
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.published === "boolean") data.published = body.published;

  const updated = await prisma.faq.update({ where: { id }, data });
  await recordAudit({
    actorId: admin.sub,
    action: "faq.update",
    entity: "Faq",
    entityId: id,
    diff: { before: { published: before.published, placement: before.placement }, after: { published: updated.published, placement: updated.placement } },
  });
  bustFaqCache(updated.placement);
  if (before.placement !== updated.placement) bustFaqCache(before.placement);
  return NextResponse.json({ faq: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  const { id } = await params;
  const before = await prisma.faq.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await prisma.faq.delete({ where: { id } });
  await recordAudit({
    actorId: admin.sub,
    action: "faq.delete",
    entity: "Faq",
    entityId: id,
    diff: { deleted: { question: before.question } },
  });
  bustFaqCache(before.placement);
  return NextResponse.json({ ok: true });
}
