import type { Metadata } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Consistent marketing-page metadata: canonical URL, Open Graph, Twitter.
 * Use a short `title` segment; root layout template adds " | Launch CV".
 *
 * Pass `ogType: "article"` (with `article` dates/author) for blog posts, and
 * `image` for a page-specific social card. When `image` is omitted, Next.js
 * falls back to the nearest file-based `opengraph-image`.
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
  /** Open Graph / Twitter card image. Falls back to the file-based opengraph-image. */
  image?: string | null;
  /** Override the Open Graph `type` (defaults to "website"). */
  ogType?: "website" | "article";
  /** Article metadata, applied when `ogType` is "article". */
  article?: {
    publishedTime?: string;
    modifiedTime?: string;
    authors?: string[];
    section?: string;
    tags?: string[];
  };
  /** Override default indexing (e.g. internal / utility pages). */
  robots?: Metadata["robots"];
}): Metadata {
  const url = absoluteUrl(input.pathname);
  const canonical = input.canonicalUrl?.trim() || url;
  const ogTitle = `${input.title} | Launch CV`;
  // Only include an `images` key when we have one. Passing `images: undefined`
  // would suppress the nearest file-based `opengraph-image` that Next.js would
  // otherwise merge in, breaking social cards on pages without an explicit image.
  const imageProp = input.image ? { images: [{ url: input.image, alt: input.title }] } : {};

  const openGraph: Metadata["openGraph"] =
    input.ogType === "article"
      ? {
          url,
          title: ogTitle,
          description: input.description,
          type: "article",
          siteName: "Launch CV",
          locale: "en_US",
          ...imageProp,
          publishedTime: input.article?.publishedTime,
          modifiedTime: input.article?.modifiedTime ?? input.article?.publishedTime,
          authors: input.article?.authors,
          section: input.article?.section,
          tags: input.article?.tags,
        }
      : {
          url,
          title: ogTitle,
          description: input.description,
          type: "website",
          siteName: "Launch CV",
          locale: "en_US",
          ...imageProp,
        };

  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical },
    openGraph,
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: input.description,
      site: "@launchcv",
      ...imageProp,
    },
    robots: input.robots ?? { index: true, follow: true },
  };
}
