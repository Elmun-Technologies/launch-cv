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
            <span
              className="lc-plus inline-flex h-8 w-8 flex-none items-center justify-center rounded-full bg-[#f1eff8] group-hover:bg-[#e4dfff] group-open:bg-[#111118] sm:h-[34px] sm:w-[34px]"
              aria-hidden="true"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="text-[#121226] group-open:text-white">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <p className="mt-2.5 text-[15px] leading-6 text-[#4a4862] sm:mt-3 sm:text-[16px] sm:leading-[26px]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
