/** Shared FAQ item shape used across marketing pages and blog posts. */
export type FaqItem = { q: string; a: string };

/**
 * Build a schema.org FAQPage node for Google's FAQ rich result.
 *
 * Return the bare node (no `@context`) so callers can drop it straight into a
 * page's `@graph`. For a standalone `<JsonLd>` tag, spread it with
 * `{ "@context": "https://schema.org", ...faqPageLd(items) }`.
 *
 * Google only renders one FAQ rich result per page and expects the answers on
 * the page to match the markup verbatim, so pass the exact same `items` you
 * render in the visible FAQ section.
 */
export function faqPageLd(items: FaqItem[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}
