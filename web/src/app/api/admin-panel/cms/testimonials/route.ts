import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/cms/audit";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const url = new URL(req.url);
  const placement = url.searchParams.get("placement");
  const where = placement ? { placement: { has: placement } } : undefined;

  const rows = await prisma.testimonial.findMany({
    where,
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });
  return NextResponse.json({ testimonials: rows });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  if (typeof body.authorName !== "string" || !body.authorName.trim()) {
    return NextResponse.json({ error: "authorName required" }, { status: 400 });
  }
  if (typeof body.quote !== "string" || !body.quote.trim()) {
    return NextResponse.json({ error: "quote required" }, { status: 400 });
  }

  const created = await prisma.testimonial.create({
    data: {
      authorName: body.authorName.trim(),
      authorRole: typeof body.authorRole === "string" ? body.authorRole.trim() : null,
      authorAvatarUrl: typeof body.authorAvatarUrl === "string" ? body.authorAvatarUrl : null,
      quote: body.quote.trim(),
      rating: typeof body.rating === "number" ? body.rating : null,
      placement: Array.isArray(body.placement)
        ? (body.placement as unknown[]).filter((p): p is string => typeof p === "string")
        : [],
      order: typeof body.order === "number" ? body.order : 0,
      published: body.published === false ? false : true,
    },
  });

  await recordAudit({
    actorId: admin.sub,
    action: "testimonial.create",
    entity: "Testimonial",
    entityId: created.id,
    diff: { created: { authorName: created.authorName } },
  });

  return NextResponse.json({ testimonial: created }, { status: 201 });
}
