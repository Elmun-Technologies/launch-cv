import { prisma } from "@/lib/prisma";
import type { BlogPost as DbBlogPost } from "@prisma/client";

/**
 * Public blog-post shape used by /blog and /blog/[slug] pages.
 * Stable across the static-file → DB migration.
 */
export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  date: string;
  readingTime: number;
  category: string;
  tags: string[];
  author: { name: string; role: string; bio: string };
  /**
   * Article body as Markdown. In the legacy schema this was an array of
   * { heading, body } sections; the CMS now stores a single Markdown string.
   * /blog/[slug] renders this via react-markdown.
   */
  bodyMd: string;
  faqs?: { q: string; a: string }[];
  coverUrl?: string | null;
  coverAlt?: string | null;
  seoTitle?: string | null;
  seoDescription?: string | null;
  ogImageUrl?: string | null;
};

function isFaqArray(v: unknown): v is Array<{ q: string; a: string }> {
  return (
    Array.isArray(v) &&
    v.every(
      (item) =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).q === "string" &&
        typeof (item as Record<string, unknown>).a === "string",
    )
  );
}

export function rowToBlogPost(row: DbBlogPost): BlogPost {
  const dateSource = row.publishedAt ?? row.createdAt;
  return {
    slug: row.slug,
    title: row.title,
    description: row.description,
    date: dateSource.toISOString().slice(0, 10),
    readingTime: row.readingTime,
    category: row.category,
    tags: row.tags,
    author: {
      name: row.authorName,
      role: row.authorRole ?? "",
      bio: row.authorBio ?? "",
    },
    bodyMd: row.bodyMd,
    faqs: isFaqArray(row.faqs) ? row.faqs : undefined,
    coverUrl: row.coverUrl,
    coverAlt: row.coverAlt,
    seoTitle: row.seoTitle,
    seoDescription: row.seoDescription,
    ogImageUrl: row.ogImageUrl,
  };
}

/**
 * Lazily promote any scheduled posts whose `scheduledFor` has passed.
 * Cheaper than running a cron — invoked on /blog and /blog/[slug] reads.
 */
async function promoteScheduled(): Promise<void> {
  try {
    await prisma.blogPost.updateMany({
      where: {
        status: "scheduled",
        scheduledFor: { lte: new Date() },
      },
      data: { status: "published", publishedAt: new Date() },
    });
  } catch {
    // ignore — best-effort
  }
}

/** Returns every published post, newest first. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  await promoteScheduled();
  const rows = await prisma.blogPost.findMany({
    where: { status: "published" },
    orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
  });
  return rows.map(rowToBlogPost);
}

/** Returns slugs of every published post (for sitemap, generateStaticParams). */
export async function getPublishedSlugs(): Promise<string[]> {
  const rows = await prisma.blogPost.findMany({
    where: { status: "published" },
    select: { slug: true },
  });
  return rows.map((r) => r.slug);
}

/**
 * Returns a single post by slug. Returns `null` if not found, unless
 * `previewAllowed` is true — in which case drafts and scheduled posts are
 * also returned. /blog/[slug] passes previewAllowed = true when a valid
 * signed preview token is present in the URL.
 */
export async function getPostBySlug(
  slug: string,
  opts: { previewAllowed?: boolean } = {},
): Promise<BlogPost | null> {
  if (!opts.previewAllowed) await promoteScheduled();
  const row = await prisma.blogPost.findUnique({ where: { slug } });
  if (!row) return null;
  if (!opts.previewAllowed && row.status !== "published") return null;
  return rowToBlogPost(row);
}
