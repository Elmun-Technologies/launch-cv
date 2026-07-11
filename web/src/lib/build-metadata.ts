import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Consistent marketing-page metadata: canonical URL, Open Graph, Twitter.
 * Use a short `title` segment; root layout template adds " | Launch CV".
 */
export function buildMarketingMetadata(input: {
  title: string;
  description: string;
  pathname: string;
  keywords?: string[];
  /**
   * Canonical URL override. Defaults to the absolute URL of `pathname`.
   * Set this when the page should point search engines at a different
   * source of truth (e.g. a syndicated / cross-posted article).
   */
  canonicalUrl?: string;
  /** Open Graph / Twitter card image. Falls back to the site default. */
  image?: string;
  /** Override the Open Graph `type` (defaults to "website"). */
  ogType?: "website" | "article";
  /** Override default indexing (e.g. internal / utility pages). */
  robots?: Metadata["robots"];
}): Metadata {
  const url = absoluteUrl(input.pathname);
  const canonical = input.canonicalUrl?.trim() || url;
  const ogTitle = `${input.title} | Launch CV`;
  const images = input.image
    ? [{ url: input.image, alt: input.title }]
    : undefined;
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical },
    openGraph: {
      url,
      title: ogTitle,
      description: input.description,
      type: input.ogType ?? "website",
      siteName: "Launch CV",
      locale: "en_US",
      ...(images ? { images } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: input.description,
      site: "@launchcv",
      ...(images ? { images: images.map((i) => i.url) } : {}),
    },
    robots: input.robots ?? { index: true, follow: true },
  };
}
