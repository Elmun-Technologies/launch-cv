import Link from "next/link";
import { ArrowRight } from "lucide-react";

export type RelatedLink = { href: string; title: string; desc: string };

/**
 * Per-feature accent hover colors. Kept as literal class strings so Tailwind's
 * source scanner emits them (dynamic class interpolation would be purged).
 */
const HOVER: Record<string, string> = {
  blue: "group-hover:text-[#2563EB]",
  orange: "group-hover:text-[#EA580C]",
  violet: "group-hover:text-[#2563EB]",
  teal: "group-hover:text-[#0D9488]",
  emerald: "group-hover:text-[#059669]",
  pink: "group-hover:text-[#DB2777]",
};

/**
 * Contextual internal-linking blocks shared across every /features/* page:
 *  - "Built for your role" → relevant /use-cases/* pages
 *  - "Further reading" → relevant blog posts (optional; some pages already
 *    render their own hand-tuned Further reading section)
 *
 * All anchors use descriptive, keyword-rich text for SEO.
 */
export function FeatureRelatedLinks({
  accent,
  useCases,
  reading,
}: {
  accent: keyof typeof HOVER;
  useCases: RelatedLink[];
  reading?: RelatedLink[];
}) {
  const hover = HOVER[accent] ?? HOVER.blue;

  return (
    <>
      {/* RELATED USE CASES */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">
            Built for your role
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {useCases.map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-start justify-between gap-4 rounded-xl border border-[#E2E8F0] bg-white p-6 transition hover:border-[#CBD5E1]"
              >
                <div>
                  <p className={`text-[16px] font-semibold text-[#0F172A] transition ${hover}`}>
                    {r.title}
                  </p>
                  <p className="mt-1 text-[13px] text-[#64748B]">{r.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-[#94A3B8] transition group-hover:text-[#334155]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FURTHER READING */}
      {reading && reading.length > 0 ? (
        <section className="border-t border-[#E2E8F0] bg-white py-16">
          <div className="mx-auto max-w-[1200px] px-6">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              Further reading
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {reading.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1]"
                >
                  <p className={`text-[14px] font-semibold text-[#0F172A] transition ${hover}`}>
                    {r.title}
                  </p>
                  <p className="mt-1 text-[13px] text-[#64748B]">{r.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
