import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/cms/audit";
import { bustFaqCache } from "@/lib/cms/revalidate";
import { faqPlacements, readFaqPlacements } from "@/lib/cms/faqs";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("content");
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const before = await prisma.faq.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (typeof body.question === "string") {
    if (!body.question.trim()) return NextResponse.json({ error: "question required" }, { status: 400 });
    data.question = body.question.trim();
  }
  if (typeof body.answer === "string") {
    if (!body.answer.trim()) return NextResponse.json({ error: "answer required" }, { status: 400 });
    data.answer = body.answer.trim();
  }
  const placements = readFaqPlacements(body);
  if (placements) {
    if (!placements.length) return NextResponse.json({ error: "Pick at least one page for this FAQ." }, { status: 400 });
    // The legacy column mirrors the first placement so older readers keep working.
    data.placements = placements;
    data.placement = placements[0];
  }
  if (typeof body.order === "number" && Number.isFinite(body.order)) data.order = Math.trunc(body.order);
  if (typeof body.published === "boolean") data.published = body.published;

  const updated = await prisma.faq.update({ where: { id }, data });
  const beforePlacements = faqPlacements(before);
  const afterPlacements = faqPlacements(updated);
  await recordAudit({
    actorId: admin.sub,
    action: "faq.update",
    entity: "Faq",
    entityId: id,
    diff: {
      before: { published: before.published, placements: beforePlacements, order: before.order },
      after: { published: updated.published, placements: afterPlacements, order: updated.order },
    },
  });
  bustFaqCache([...beforePlacements, ...afterPlacements]);
  return NextResponse.json({ faq: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("content");
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
    diff: { deleted: { question: before.question, placements: faqPlacements(before) } },
  });
  bustFaqCache(faqPlacements(before));
  return NextResponse.json({ ok: true });
}
