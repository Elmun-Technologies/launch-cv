import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/cms/audit";
import { bustTestimonialCache } from "@/lib/cms/revalidate";
import { readPermissionDate, readSource, testimonialPublishProblems } from "@/lib/cms/testimonials";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("content");
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });
  const { id } = await params;
  const row = await prisma.testimonial.findUnique({ where: { id } });
  if (!row) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ testimonial: row });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("content");
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
  if (body.permissionDate !== undefined) {
    const d = readPermissionDate(body.permissionDate);
    if (d === "invalid") {
      return NextResponse.json({ error: "Permission date must be a valid date, not in the future." }, { status: 400 });
    }
    data.permissionDate = d;
  }
  if (body.source !== undefined) data.source = readSource(body.source);

  // A published testimonial must keep its author, permission date and source on file.
  const next = { ...before, ...data } as typeof before;
  if (next.published) {
    const missing = testimonialPublishProblems(next);
    if (missing.length) {
      return NextResponse.json({ error: `Can't publish without: ${missing.join(", ")}.` }, { status: 400 });
    }
  }

  const updated = await prisma.testimonial.update({ where: { id }, data });
  await recordAudit({
    actorId: admin.sub,
    action: "testimonial.update",
    entity: "Testimonial",
    entityId: id,
    diff: {
      before: {
        published: before.published,
        permissionDate: before.permissionDate?.toISOString() ?? null,
        source: before.source,
      },
      after: {
        published: updated.published,
        permissionDate: updated.permissionDate?.toISOString() ?? null,
        source: updated.source,
      },
    },
  });
  // Bust both old and new placements to handle reassignments.
  bustTestimonialCache([...new Set([...before.placement, ...updated.placement])]);
  return NextResponse.json({ testimonial: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("content");
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
  bustTestimonialCache(before.placement);
  return NextResponse.json({ ok: true });
}
