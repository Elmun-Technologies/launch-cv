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
  /** Last-updated timestamp (ISO date), used for Article dateModified. */
  dateModified: string;
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
  /** Optional canonical URL override. Defaults to the post's own URL. */
  canonicalUrl?: string | null;
  /** Target keyword the post is optimized for (admin-only SEO aid). */
  focusKeyword?: string | null;
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

/** Retired URLs that still appear in stored post bodies, mapped to where they now 301. */
const LEGACY_LINKS: [RegExp, string][] = [
  [/\(\/features\/ats-score\/?\)/g, "(/free-ats-check)"],
  [/\(\/use-cases\/designers\/?\)/g, "(/resume-examples/ux-designer)"],
  [/\(\/use-cases\/[a-z-]*\/?\)/g, "(/resume-examples)"],
];

/**
 * Older posts embed illustrated "screenshots" of a product UI that no longer exists
 * (template names, a two-column layout, test claims). Drop them, and point links at
 * live URLs instead of redirects.
 */
export function cleanLegacyMarkdown(md: string): string {
  let out = md.replace(/^[ \t]*!\[[^\]]*\]\(\/images\/product\/[^)]+\)[ \t]*$/gm, "");
  out = out.replace(/!\[[^\]]*\]\(\/images\/product\/[^)]+\)/g, "");
  for (const [re, to] of LEGACY_LINKS) out = out.replace(re, to);
  return out.replace(/\n{3,}/g, "\n\n");
}

/** Drop a year from a title once it's in the past ("… in 2025", "(2025 Method)"), rather than leave it looking stale. */
export function stripStaleYear(title: string): string;
export function stripStaleYear(title: string | null): string | null;
export function stripStaleYear(title: string | null): string | null {
  if (!title) return title;
  const now = new Date().getUTCFullYear();
  return title
    .replace(/\s*\((20\d\d)(?:\s[^)]*)?\)/g, (m, y) => (Number(y) < now ? "" : m))
    .replace(/\s+in\s+(20\d\d)\b/g, (m, y) => (Number(y) < now ? "" : m))
    .trim();
}

export function rowToBlogPost(row: DbBlogPost): BlogPost {
  const dateSource = row.publishedAt ?? row.createdAt;
  return {
    slug: row.slug,
    title: stripStaleYear(row.title),
    description: row.description,
    date: dateSource.toISOString().slice(0, 10),
    dateModified: row.updatedAt.toISOString().slice(0, 10),
    readingTime: row.readingTime,
    category: row.category,
    tags: row.tags,
    author: {
      name: row.authorName,
      role: row.authorRole ?? "",
      bio: row.authorBio ?? "",
    },
    bodyMd: cleanLegacyMarkdown(row.bodyMd),
    faqs: isFaqArray(row.faqs) ? row.faqs : undefined,
    coverUrl: row.coverUrl,
    coverAlt: row.coverAlt,
    seoTitle: stripStaleYear(row.seoTitle),
    seoDescription: row.seoDescription,
    ogImageUrl: row.ogImageUrl,
    canonicalUrl: row.canonicalUrl,
    focusKeyword: row.focusKeyword,
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

/** Returns every published post, newest first. Empty array if DB unavailable. */
export async function getPublishedPosts(): Promise<BlogPost[]> {
  try {
    await promoteScheduled();
    const rows = await prisma.blogPost.findMany({
      where: { status: "published" },
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    });
    return rows.map(rowToBlogPost);
  } catch {
    return [];
  }
}

/** Returns slugs of every published post (for sitemap, generateStaticParams). */
export async function getPublishedSlugs(): Promise<string[]> {
  try {
    const rows = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { slug: true },
    });
    return rows.map((r) => r.slug);
  } catch {
    return [];
  }
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
  try {
    if (!opts.previewAllowed) await promoteScheduled();
    const row = await prisma.blogPost.findUnique({ where: { slug } });
    if (!row) return null;
    if (!opts.previewAllowed && row.status !== "published") return null;
    return rowToBlogPost(row);
  } catch {
    return null;
  }
}
