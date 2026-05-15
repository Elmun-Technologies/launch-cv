import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { recordAudit, type AuditAction } from "@/lib/cms/audit";
import { slugify, uniqueSlug } from "@/lib/cms/slug";
import { bustBlogCache } from "@/lib/cms/revalidate";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  const before = await prisma.blogPost.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "not_found" }, { status: 404 });

  // Build update payload from whitelisted fields
  const data: Record<string, unknown> = {};
  if (typeof body.title === "string") data.title = body.title.trim();
  if (typeof body.description === "string") data.description = body.description.trim();
  if (typeof body.category === "string") data.category = body.category.trim();
  if (Array.isArray(body.tags)) {
    data.tags = (body.tags as unknown[]).filter((t): t is string => typeof t === "string");
  }
  if (typeof body.readingTime === "number") data.readingTime = body.readingTime;
  if (typeof body.authorName === "string") data.authorName = body.authorName.trim();
  if (body.authorRole === null || typeof body.authorRole === "string") data.authorRole = body.authorRole;
  if (body.authorBio === null || typeof body.authorBio === "string") data.authorBio = body.authorBio;
  if (typeof body.bodyMd === "string") data.bodyMd = body.bodyMd;
  if (body.faqs !== undefined) data.faqs = body.faqs;
  if (body.coverUrl === null || typeof body.coverUrl === "string") data.coverUrl = body.coverUrl;
  if (body.coverAlt === null || typeof body.coverAlt === "string") data.coverAlt = body.coverAlt;
  if (body.seoTitle === null || typeof body.seoTitle === "string") data.seoTitle = body.seoTitle;
  if (body.seoDescription === null || typeof body.seoDescription === "string") data.seoDescription = body.seoDescription;
  if (body.ogImageUrl === null || typeof body.ogImageUrl === "string") data.ogImageUrl = body.ogImageUrl;

  // Slug change: re-uniqueify
  if (typeof body.slug === "string" && body.slug.trim() && body.slug.trim() !== before.slug) {
    const desired = slugify(body.slug.trim());
    data.slug = await uniqueSlug(desired, async (candidate) => {
      if (candidate === before.slug) return false;
      const found = await prisma.blogPost.findUnique({ where: { slug: candidate }, select: { id: true } });
      return Boolean(found);
    });
  }

  // Status transitions
  let action: AuditAction = "blog.update";
  if (typeof body.status === "string") {
    const next = body.status;
    if (next === "published") {
      data.status = "published";
      data.publishedAt = before.publishedAt ?? new Date();
      data.scheduledFor = null;
      action = "blog.publish";
    } else if (next === "scheduled") {
      const when = typeof body.scheduledFor === "string" ? new Date(body.scheduledFor) : null;
      if (!when || isNaN(when.getTime())) {
        return NextResponse.json({ error: "scheduledFor required for scheduled status" }, { status: 400 });
      }
      data.status = "scheduled";
      data.scheduledFor = when;
      action = "blog.schedule";
    } else if (next === "draft") {
      data.status = "draft";
      data.scheduledFor = null;
      if (before.status === "published") action = "blog.unpublish";
    } else if (next === "archived") {
      data.status = "archived";
      action = "blog.archive";
    }
  }

  const updated = await prisma.blogPost.update({ where: { id }, data });

  await recordAudit({
    actorId: admin.sub,
    action,
    entity: "BlogPost",
    entityId: id,
    diff: {
      before: { status: before.status, slug: before.slug, title: before.title },
      after: { status: updated.status, slug: updated.slug, title: updated.title },
    },
  });

  bustBlogCache(updated.slug, before.slug);
  return NextResponse.json({ post: updated });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const { id } = await params;
  const before = await prisma.blogPost.findUnique({ where: { id } });
  if (!before) return NextResponse.json({ error: "not_found" }, { status: 404 });

  await prisma.blogPost.delete({ where: { id } });
  await recordAudit({
    actorId: admin.sub,
    action: "blog.delete",
    entity: "BlogPost",
    entityId: id,
    diff: { deleted: { id, slug: before.slug, title: before.title } },
  });

  bustBlogCache(before.slug);
  return NextResponse.json({ ok: true });
}
