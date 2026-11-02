import { FaqIcon } from "@/components/site/ui";

/**
 * v5 FAQ accordion (details/summary, so it works without JavaScript). The first
 * item starts open, like the home page. Pair it with FAQPage JSON-LD on the page.
 */
export function FaqList({ faqs, className = "" }: { faqs: { q: string; a: string }[]; className?: string }) {
  return (
    <div className={`flex flex-col gap-1.5 sm:gap-2 ${className}`}>
      {faqs.map((f, i) => (
        <details
          key={f.q}
          open={i === 0}
          className="lc-faq group rounded-[22px] bg-white px-[18px] py-[18px] transition-shadow hover:shadow-[0_10px_30px_-18px_rgba(18,18,38,.3)] sm:rounded-3xl sm:px-6 sm:py-[22px]"
        >
          <summary className="flex min-h-[34px] items-center justify-between gap-3 sm:gap-4">
            <span className="text-[16px] font-bold sm:text-[18px]">{f.q}</span>
            <FaqIcon />
          </summary>
          <p className="mt-2.5 text-[15px] leading-6 text-[#4a4862] sm:mt-3 sm:text-[16px] sm:leading-[26px]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
