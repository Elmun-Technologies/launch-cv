import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { recordAudit, type AuditAction } from "@/lib/cms/audit";
import { slugify, uniqueSlug } from "@/lib/cms/slug";
import { bustBlogCache } from "@/lib/cms/revalidate";

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("content");
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json({ post });
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("content");
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
  if (body.canonicalUrl === null || typeof body.canonicalUrl === "string") data.canonicalUrl = body.canonicalUrl;
  if (body.focusKeyword === null || typeof body.focusKeyword === "string") data.focusKeyword = body.focusKeyword;

  // Slug change: re-uniqueify
  if (typeof body.slug === "string" && body.slug.trim() && body.slug.trim() !== before.slug) {
    const desired = slugify(body.slug.trim());
    data.slug = await uniqueSlug(desired, async (candidate) => {
      if (candidate === before.slug) return false;
      const found = await prisma.blogPost.findUnique({ where: { slug: candidate }, select: { id: true } });
      return Boolean(found);
    });
  }

  // Autosave only ever writes the content of a draft: it is refused for any
  // other status and can't change status, so it can never publish.
  const autosave = body.autosave === true;
  if (autosave) {
    if (before.status !== "draft") {
      return NextResponse.json({ error: "Autosave only applies to drafts.", code: "not_draft" }, { status: 409 });
    }
    const changed = Object.keys(data).filter(
      (k) => JSON.stringify(data[k]) !== JSON.stringify((before as Record<string, unknown>)[k]),
    );
    if (!changed.length) return NextResponse.json({ post: before });
    // Conditional on status so a publish landing in between can't be overwritten.
    const res = await prisma.blogPost.updateMany({ where: { id, status: "draft" }, data });
    if (res.count === 0) {
      return NextResponse.json({ error: "Autosave only applies to drafts.", code: "not_draft" }, { status: 409 });
    }
    const updated = await prisma.blogPost.findUnique({ where: { id } });
    await recordAutosaveAudit(admin.sub, id, changed);
    // Drafts aren't public, so no page cache to refresh.
    return NextResponse.json({ post: updated });
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

/**
 * Autosaves are audit-logged as "blog.autosave". A typing session saves every
 * few seconds, so saves by the same person on the same post within 10 minutes
 * share one entry: its diff lists every field changed, the save count and the
 * time of the last save.
 */
async function recordAutosaveAudit(actorId: string, postId: string, fields: string[]) {
  const since = new Date(Date.now() - 10 * 60_000);
  try {
    const recent = await prisma.auditLog.findFirst({
      where: { actorId, entity: "BlogPost", entityId: postId, createdAt: { gte: since } },
      orderBy: { createdAt: "desc" },
      select: { id: true, action: true, diff: true },
    });
    const now = new Date().toISOString();
    if (recent?.action === "blog.autosave") {
      const prev = (recent.diff ?? {}) as { fields?: string[]; saves?: number };
      await prisma.auditLog.update({
        where: { id: recent.id },
        data: {
          diff: {
            fields: [...new Set([...(prev.fields ?? []), ...fields])],
            saves: (prev.saves ?? 1) + 1,
            lastSavedAt: now,
          },
        },
      });
      return;
    }
  } catch (err) {
    console.error("[audit] autosave coalesce failed", err);
  }
  await recordAudit({
    actorId,
    action: "blog.autosave",
    entity: "BlogPost",
    entityId: postId,
    diff: { fields, saves: 1, lastSavedAt: new Date().toISOString() },
  });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin("content");
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
