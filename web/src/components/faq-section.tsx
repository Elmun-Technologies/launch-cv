import Link from "next/link";
import { ChevronDown } from "lucide-react";

export type FaqEntry = { q: string; a: string };

/**
 * Build a schema.org FAQPage node from the same items rendered by
 * <FaqSection>. Keeping both derived from one array guarantees the visible
 * FAQ and the structured data never drift out of sync.
 */
export function buildFaqPageLd(items: FaqEntry[]) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

/**
 * Server-rendered FAQ accordion used across marketing pages (pricing,
 * features, use cases). Mirrors the native <details> pattern already on
 * /pricing so the answers are crawlable without JavaScript. Pass the same
 * `items` to buildFaqPageLd() to emit matching FAQPage JSON-LD.
 */
export function FaqSection({
  items,
  accent = "#1A56DB",
  eyebrow = "FAQ",
  heading = "Frequently asked questions",
  className = "border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24",
}: {
  items: FaqEntry[];
  accent?: string;
  eyebrow?: string;
  heading?: string;
  className?: string;
}) {
  return (
    <section className={className}>
      <div className="mx-auto max-w-[1100px] px-6">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="lc-overline" style={{ color: accent }}>
              {eyebrow}
            </p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">{heading}</h2>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#475569]">
              Still have a question?{" "}
              <Link href="/contact" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
                Email support
              </Link>{" "}
              — we reply within one business day.
            </p>
          </div>
          <div className="lg:col-span-8">
            <div className="divide-y divide-[#E2E8F0] rounded-xl border border-[#E2E8F0] bg-white">
              {items.map((f) => (
                <details key={f.q} className="group px-6 py-5">
                  <summary className="flex cursor-pointer items-center justify-between gap-4 text-[15px] font-semibold text-[#0F172A]">
                    {f.q}
                    <ChevronDown className="h-4 w-4 shrink-0 text-[#94A3B8] transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-3 text-[14px] leading-[1.7] text-[#475569]">{f.a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
