import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";
import { RESUME_EXAMPLES } from "@/lib/resume-examples";
import { COVER_LETTER_EXAMPLES } from "@/lib/cover-letter-examples";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://launch-cv.com";

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/free-ats-check`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/features`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/features/jd-alignment`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/features/resume-builder`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/features/cover-letter`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/features/interview-prep`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/features/voice-input`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/compare/ats-resume-checkers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/resume-templates`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/resume-examples`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...RESUME_EXAMPLES.map((e) => ({
      url: `${baseUrl}/resume-examples/${e.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${baseUrl}/cover-letter-examples`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    ...COVER_LETTER_EXAMPLES.map((c) => ({
      url: `${baseUrl}/cover-letter-examples/${c.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    // login/register are utility pages (noindex) — intentionally kept out of the sitemap.
    { url: `${baseUrl}/legal/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${baseUrl}/legal/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { slug: true, publishedAt: true, updatedAt: true },
    });
    blogRoutes = posts.map((p) => ({
      url: `${baseUrl}/blog/${p.slug}`,
      lastModified: p.updatedAt ?? p.publishedAt ?? new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));
  } catch {
    // DB may be unreachable during build — fall back to no blog routes.
  }

  return [...staticRoutes, ...blogRoutes];
}
