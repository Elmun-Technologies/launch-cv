import { NextResponse, type NextRequest } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { recordAudit } from "@/lib/cms/audit";
import { slugify, uniqueSlug } from "@/lib/cms/slug";

export async function GET(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() ?? "";
  const status = url.searchParams.get("status") ?? "";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? "1"));
  const perPage = Math.min(100, Math.max(1, Number(url.searchParams.get("perPage") ?? "20")));

  const where: Record<string, unknown> = {};
  if (status) where.status = status;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
    ];
  }

  const [rows, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: [{ updatedAt: "desc" }],
      skip: (page - 1) * perPage,
      take: perPage,
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        status: true,
        publishedAt: true,
        scheduledFor: true,
        updatedAt: true,
        authorName: true,
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  return NextResponse.json({ posts: rows, total, page, perPage });
}

export async function POST(req: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const title = String(body.title ?? "").trim();
  if (!title) return NextResponse.json({ error: "title required" }, { status: 400 });

  const desiredSlug = String(body.slug ?? "").trim() || slugify(title);
  const slug = await uniqueSlug(desiredSlug, async (candidate) => {
    const found = await prisma.blogPost.findUnique({ where: { slug: candidate }, select: { id: true } });
    return Boolean(found);
  });

  const created = await prisma.blogPost.create({
    data: {
      slug,
      title,
      description: String(body.description ?? "").trim(),
      category: String(body.category ?? "Resume Tips").trim(),
      tags: Array.isArray(body.tags) ? (body.tags as unknown[]).filter((t): t is string => typeof t === "string") : [],
      readingTime: Number(body.readingTime ?? 5) || 5,
      authorName: String(body.authorName ?? "Launch CV Editorial").trim(),
      authorRole: body.authorRole != null ? String(body.authorRole) : null,
      authorBio: body.authorBio != null ? String(body.authorBio) : null,
      bodyMd: String(body.bodyMd ?? ""),
      faqs: body.faqs ?? undefined,
      coverUrl: body.coverUrl != null ? String(body.coverUrl) : null,
      coverAlt: body.coverAlt != null ? String(body.coverAlt) : null,
      seoTitle: body.seoTitle != null ? String(body.seoTitle) : null,
      seoDescription: body.seoDescription != null ? String(body.seoDescription) : null,
      ogImageUrl: body.ogImageUrl != null ? String(body.ogImageUrl) : null,
      status: "draft",
      authorId: admin.sub,
    },
  });

  await recordAudit({
    actorId: admin.sub,
    action: "blog.create",
    entity: "BlogPost",
    entityId: created.id,
    diff: { created: { id: created.id, slug: created.slug, title: created.title } },
  });

  // New post is a draft so /blog won't show it, but bust the list anyway in
  // case the editor publishes immediately after create.
  revalidatePath("/blog");
  revalidatePath("/sitemap.xml");
  return NextResponse.json({ post: created }, { status: 201 });
}
