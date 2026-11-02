import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/cms/audit";
import { bustFaqCache } from "@/lib/cms/revalidate";
import { readFaqPlacements } from "@/lib/cms/faqs";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin("content");
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const url = new URL(req.url);
  const placement = url.searchParams.get("placement");

  const rows = await prisma.faq.findMany({
    where: placement ? { OR: [{ placements: { has: placement } }, { placement }] } : undefined,
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });
  return NextResponse.json({ faqs: rows });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin("content");
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (typeof body.question !== "string" || !body.question.trim()) {
    return NextResponse.json({ error: "question required" }, { status: 400 });
  }
  if (typeof body.answer !== "string" || !body.answer.trim()) {
    return NextResponse.json({ error: "answer required" }, { status: 400 });
  }
  const placements = readFaqPlacements(body);
  if (!placements?.length) {
    return NextResponse.json({ error: "Pick at least one page for this FAQ." }, { status: 400 });
  }

  // New FAQs go to the end of the list unless an order is given.
  let order = typeof body.order === "number" && Number.isFinite(body.order) ? Math.trunc(body.order) : null;
  if (order === null) {
    const last = await prisma.faq.aggregate({ _max: { order: true } });
    order = (last._max.order ?? -1) + 1;
  }

  const created = await prisma.faq.create({
    data: {
      question: body.question.trim(),
      answer: body.answer.trim(),
      // The legacy column mirrors the first placement so older readers keep working.
      placement: placements[0],
      placements,
      order,
      published: body.published === false ? false : true,
    },
  });

  await recordAudit({
    actorId: admin.sub,
    action: "faq.create",
    entity: "Faq",
    entityId: created.id,
    diff: { created: { question: created.question, placements: created.placements, published: created.published } },
  });

  bustFaqCache(placements);
  return NextResponse.json({ faq: created }, { status: 201 });
}
