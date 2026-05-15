import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/cms/audit";
import { bustFaqCache } from "@/lib/cms/revalidate";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const url = new URL(req.url);
  const placement = url.searchParams.get("placement");

  const rows = await prisma.faq.findMany({
    where: placement ? { placement } : undefined,
    orderBy: [{ placement: "asc" }, { order: "asc" }],
  });
  return NextResponse.json({ faqs: rows });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (typeof body.question !== "string" || !body.question.trim()) {
    return NextResponse.json({ error: "question required" }, { status: 400 });
  }
  if (typeof body.answer !== "string" || !body.answer.trim()) {
    return NextResponse.json({ error: "answer required" }, { status: 400 });
  }
  if (typeof body.placement !== "string" || !body.placement.trim()) {
    return NextResponse.json({ error: "placement required" }, { status: 400 });
  }

  const created = await prisma.faq.create({
    data: {
      question: body.question.trim(),
      answer: body.answer.trim(),
      placement: body.placement.trim(),
      order: typeof body.order === "number" ? body.order : 0,
      published: body.published === false ? false : true,
    },
  });

  await recordAudit({
    actorId: admin.sub,
    action: "faq.create",
    entity: "Faq",
    entityId: created.id,
    diff: { created: { question: created.question, placement: created.placement } },
  });

  bustFaqCache(created.placement);
  return NextResponse.json({ faq: created }, { status: 201 });
}
