import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/cms/audit";
import { bustFaqCache } from "@/lib/cms/revalidate";
import { faqPlacements } from "@/lib/cms/faqs";

/**
 * Saves the FAQ order set by dragging (or the up/down buttons) on the list.
 * Body: { ids: string[] } — every FAQ id, in the new order. Each FAQ's
 * `order` becomes its index, so every page lists them in this order.
 */
export async function PUT(req: NextRequest) {
  const admin = await requireAdmin("content");
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as { ids?: unknown };
  const ids = Array.isArray(body.ids) ? body.ids.filter((x): x is string => typeof x === "string") : [];
  if (!ids.length || ids.length > 1000 || new Set(ids).size !== ids.length) {
    return NextResponse.json({ error: "ids must list each FAQ once" }, { status: 400 });
  }

  const rows = await prisma.faq.findMany({ select: { id: true, order: true, placement: true, placements: true } });
  const known = new Set(rows.map((r) => r.id));
  if (ids.length !== rows.length || ids.some((id) => !known.has(id))) {
    // Someone added or deleted an FAQ since this list was loaded.
    return NextResponse.json({ error: "The FAQ list changed. Reload the page and try again." }, { status: 409 });
  }

  const before = new Map(rows.map((r) => [r.id, r.order]));
  const changed = ids.map((id, order) => ({ id, order })).filter((x) => before.get(x.id) !== x.order);
  if (changed.length) {
    await prisma.$transaction(changed.map((x) => prisma.faq.update({ where: { id: x.id }, data: { order: x.order } })));
  }

  await recordAudit({
    actorId: admin.sub,
    action: "faq.reorder",
    entity: "Faq",
    entityId: null,
    diff: {
      before: rows
        .slice()
        .sort((a, b) => a.order - b.order)
        .map((r) => r.id),
      after: ids,
      changed: changed.length,
    },
  });

  bustFaqCache(rows.flatMap(faqPlacements));
  return NextResponse.json({ ok: true, changed: changed.length });
}
