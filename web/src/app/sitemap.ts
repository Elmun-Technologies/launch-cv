import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { RESUME_EXAMPLES } from "@/lib/resume-examples";
import { COVER_LETTER_EXAMPLES } from "@/lib/cover-letter-examples";
import { SAMPLES_DATE_KEY, contentUpdated } from "@/lib/content-dates";
import { getSiteUrl } from "@/lib/site";
import { ATS_VENDORS } from "@/lib/seo/ats-vendors";
import { RESIGNATION_TEMPLATES } from "@/lib/seo/resignation-templates";

/** Programmatic SEO pages added by later modules (keywords per role, ATS vendors). */
const SEO_EXTRA_ROUTES: { path: string; priority: number; dateKey: string }[] = [
  { path: "/resume-keywords", priority: 0.8, dateKey: "/resume-keywords" },
  ...RESUME_EXAMPLES.map((e) => ({ path: `/resume-keywords/${e.slug}`, priority: 0.7, dateKey: "/resume-keywords/*" })),
  { path: "/ats", priority: 0.7, dateKey: "/ats" },
  ...ATS_VENDORS.map((v) => ({ path: `/ats/${v.slug}`, priority: 0.7, dateKey: "/ats/*" })),
  { path: "/resignation-letter", priority: 0.8, dateKey: "/resignation-letter" },
  ...RESIGNATION_TEMPLATES.map((t) => ({ path: `/resignation-letter/${t.slug}`, priority: 0.7, dateKey: "/resignation-letter/*" })),
];

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
    page("/editorial-process", "yearly", 0.5),
    page("/authors/nazir-elmurodov", "monthly", 0.5),
    page("/changelog", "weekly", 0.5),
    page("/ai-info", "monthly", 0.5),
    page("/resume-templates", "monthly", 0.8),
    page("/resume-examples", "monthly", 0.8),
    ...RESUME_EXAMPLES.map((e) => page(`/resume-examples/${e.slug}`, "monthly", 0.8, e.variants?.length ? SAMPLES_DATE_KEY : "/resume-examples/*")),
    page("/cover-letter-examples", "monthly", 0.8),
    ...COVER_LETTER_EXAMPLES.map((c) => page(`/cover-letter-examples/${c.slug}`, "monthly", 0.7, "/cover-letter-examples/*")),
    page("/resume-format", "monthly", 0.8),
    page("/what-is-a-good-ats-score", "monthly", 0.8),
    page("/resume-action-verbs", "monthly", 0.7),
    page("/resume-summary-examples", "monthly", 0.8),
    page("/how-to-write-a-resume", "monthly", 0.8),
    page("/resume-length", "monthly", 0.7),
    page("/cover-letter-template", "monthly", 0.8),
    page("/alternatives/jobscan", "monthly", 0.7),
    page("/tools", "monthly", 0.7),
    page("/tools/resume-bullet-point-generator", "monthly", 0.8),
    page("/tools/resume-summary-generator", "monthly", 0.8),
    page("/tools/resume-word-counter", "monthly", 0.7),
    page("/tools/job-description-keyword-scanner", "monthly", 0.8),
    page("/tools/resignation-letter-generator", "monthly", 0.8),
    ...SEO_EXTRA_ROUTES.map((r) => page(r.path, "monthly", r.priority, r.dateKey)),
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
