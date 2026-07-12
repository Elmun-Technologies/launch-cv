import { BlogFaq } from "@/components/blog-faq";
import type { FaqItem } from "@/lib/faq-ld";

/**
 * Marketing-page FAQ block. Renders the visible accordion (via `BlogFaq`) that
 * must stay in sync with the page's FAQPage JSON-LD — pass the exact same
 * `items` to `faqPageLd()` so Google's rich result matches the on-page text.
 */
export function FaqSection({
  items,
  eyebrow = "FAQ",
  heading = "Frequently asked questions",
  accent = "#1A56DB",
}: {
  items: FaqItem[];
  eyebrow?: string;
  heading?: string;
  /** Overline color; match the page's accent (e.g. #EA580C on ATS pages). */
  accent?: string;
}) {
  return (
    <section id="faq" className="py-20 sm:py-24">
      <div className="mx-auto max-w-[1200px] px-6">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="lc-overline" style={{ color: accent }}>
              {eyebrow}
            </p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">{heading}</h2>
          </div>
          <div className="lg:col-span-8">
            <BlogFaq items={items} />
          </div>
        </div>
      </div>
    </section>
  );
}
