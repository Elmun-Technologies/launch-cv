import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/cms/audit";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  const { id } = await params;
  const row = await prisma.testimonial.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ testimonial: row });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const before = await prisma.testimonial.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const data: Record<string, unknown> = {};
  if (typeof body.authorName === "string") data.authorName = body.authorName.trim();
  if (body.authorRole === null || typeof body.authorRole === "string") data.authorRole = body.authorRole;
  if (body.authorAvatarUrl === null || typeof body.authorAvatarUrl === "string") data.authorAvatarUrl = body.authorAvatarUrl;
  if (typeof body.quote === "string") data.quote = body.quote.trim();
  if (body.rating === null || typeof body.rating === "number") data.rating = body.rating;
  if (Array.isArray(body.placement)) {
    data.placement = (body.placement as unknown[]).filter((p): p is string => typeof p === "string");
  }
  if (typeof body.order === "number") data.order = body.order;
  if (typeof body.published === "boolean") data.published = body.published;

  const updated = await prisma.testimonial.update({ where: { id }, data });
  await recordAudit({
    actorId: admin.sub,
    action: "testimonial.update",
    entity: "Testimonial",
    entityId: id,
    diff: { before: { published: before.published }, after: { published: updated.published } },
  });
  return NextResponse.json({ testimonial: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  const { id } = await params;
  const before = await prisma.testimonial.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "not_found" }, { status: 404 });
  await prisma.testimonial.delete({ where: { id } });
  await recordAudit({
    actorId: admin.sub,
    action: "testimonial.delete",
    entity: "Testimonial",
    entityId: id,
    diff: { deleted: { authorName: before.authorName } },
  });
  return NextResponse.json({ ok: true });
}
