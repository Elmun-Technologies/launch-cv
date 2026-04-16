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
  /** Override default indexing (e.g. investors / internal pages). */
  robots?: Metadata["robots"];
}): Metadata {
  const url = absoluteUrl(input.pathname);
  const ogTitle = `${input.title} | Launch CV`;
  return {
    title: input.title,
    description: input.description,
    keywords: input.keywords,
    alternates: { canonical: url },
    openGraph: {
      url,
      title: ogTitle,
      description: input.description,
      type: "website",
      siteName: "Launch CV",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: input.description,
      site: "@launchcv",
    },
    robots: input.robots ?? { index: true, follow: true },
  };
}
