import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { RESUME_EXAMPLES } from "@/lib/resume-examples";
import { COVER_LETTER_EXAMPLES } from "@/lib/cover-letter-examples";
import { contentUpdated } from "@/lib/content-dates";
import { getSiteUrl } from "@/lib/site";

/** Rebuilt hourly so new blog posts appear without a redeploy. */
export const revalidate = 3600;

type Freq = MetadataRoute.Sitemap[number]["changeFrequency"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = getSiteUrl();
  const page = (path: string, changeFrequency: Freq, priority: number, dateKey = path) => ({
    url: path === "/" ? baseUrl : `${baseUrl}${path}`,
    lastModified: contentUpdated(dateKey),
    changeFrequency,
    priority,
  });

  let posts: { slug: string; publishedAt: Date | null; updatedAt: Date }[] = [];
  try {
    posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { slug: true, publishedAt: true, updatedAt: true },
      orderBy: { updatedAt: "desc" },
    });
  } catch {
    // DB unreachable during build — the hourly revalidation fills these in.
  }
  const newestPost = posts[0]?.updatedAt ?? contentUpdated("/blog");

  return [
    page("/", "weekly", 1),
    page("/free-ats-check", "monthly", 0.9),
    page("/features", "monthly", 0.8),
    page("/features/jd-alignment", "monthly", 0.8),
    page("/features/resume-builder", "monthly", 0.8),
    page("/features/cover-letter", "monthly", 0.8),
    page("/features/interview-prep", "monthly", 0.8),
    page("/features/voice-input", "monthly", 0.7),
    page("/pricing", "monthly", 0.9),
    page("/compare/ats-resume-checkers", "monthly", 0.7),
    { url: `${baseUrl}/blog`, lastModified: newestPost, changeFrequency: "weekly" as const, priority: 0.8 },
    page("/about", "yearly", 0.6),
    page("/contact", "yearly", 0.5),
    page("/resume-templates", "monthly", 0.8),
    page("/resume-examples", "monthly", 0.8),
    ...RESUME_EXAMPLES.map((e) => page(`/resume-examples/${e.slug}`, "monthly", 0.8, "/resume-examples/*")),
    page("/cover-letter-examples", "monthly", 0.8),
    ...COVER_LETTER_EXAMPLES.map((c) => page(`/cover-letter-examples/${c.slug}`, "monthly", 0.7, "/cover-letter-examples/*")),
    // login/register are utility pages (noindex) — intentionally kept out of the sitemap.
    page("/legal/privacy", "yearly", 0.3),
    page("/legal/terms", "yearly", 0.3),
    ...posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt ?? p.publishedAt ?? newestPost,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
