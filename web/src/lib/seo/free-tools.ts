import { countVerbs } from "@/lib/seo/action-verbs";
import { faqPageLd, type FaqItem } from "@/lib/faq-ld";
import { absoluteUrl } from "@/lib/site";

/**
 * The public free tools (the /tools index, "More free tools" cards and
 * JSON-LD). Everything shown is computed from real data — the verb count
 * comes from the verb list itself.
 */

export type FreeToolKey = "ats" | "bullets" | "summary" | "words" | "verbs";
export type FreeTool = { key: FreeToolKey; href: string; name: string; blurb: string; kind: "AI" | "Instant" | "Guide" };

export const TOOLS_INDEX_PATH = "/tools";

export function freeTools(): FreeTool[] {
  return [
    { key: "ats", href: "/free-ats-check", name: "ATS resume checker", blurb: "A 0–100 score and a fix for each issue", kind: "AI" },
    { key: "bullets", href: "/tools/resume-bullet-point-generator", name: "Bullet point generator", blurb: "Duty in, result-first bullets out", kind: "AI" },
    { key: "summary", href: "/tools/resume-summary-generator", name: "Summary generator", blurb: "Three summaries from your own facts", kind: "AI" },
    { key: "words", href: "/tools/resume-word-counter", name: "Resume word counter", blurb: "Length, bullets and filler words", kind: "Instant" },
    { key: "verbs", href: "/resume-action-verbs", name: "Action verbs", blurb: `${countVerbs()} verbs by skill, with examples`, kind: "Guide" },
  ];
}

/** BreadcrumbList for Home → Free tools → page (the index itself stops at two). */
export function toolBreadcrumbLd(page?: { name: string; path: string }) {
  const items = [
    { name: "Home", path: "/" },
    { name: "Free tools", path: TOOLS_INDEX_PATH },
    ...(page ? [page] : []),
  ];
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: absoluteUrl(it.path) })),
  };
}

/** WebApplication (price 0) + BreadcrumbList + FAQPage for a free tool page. */
export function toolPageLd(input: { name: string; crumb: string; path: string; description: string; faqs: FaqItem[] }) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: input.name,
        url: absoluteUrl(input.path),
        description: input.description,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        browserRequirements: "Requires JavaScript",
        isAccessibleForFree: true,
        inLanguage: "en-US",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        publisher: { "@type": "Organization", name: "LaunchCV", url: absoluteUrl("/") },
      },
      toolBreadcrumbLd({ name: input.crumb, path: input.path }),
      faqPageLd(input.faqs),
    ],
  };
}
