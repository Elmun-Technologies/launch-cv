/**
 * v5 "Key facts" / TL;DR answer box. The `lc-key-facts` and
 * `lc-key-facts-lead` classes are referenced by each page's
 * SpeakableSpecification, so keep them.
 */
export function KeyFactsCard({ title = "Key facts", lead, facts }: { title?: string; lead?: string; facts?: string[] }) {
  if (!lead && (!facts || facts.length === 0)) return null;
  return (
    <section aria-label={title} className="lc-key-facts lc-card rounded-[24px] p-5 sm:p-7">
      <p className="text-[12px] font-bold tracking-[0.08em] text-[#5440e8]">{title.toUpperCase()}</p>
      {lead ? <p className="lc-key-facts-lead mt-2.5 text-[17px] font-semibold leading-7 text-[#121226]">{lead}</p> : null}
      {facts && facts.length > 0 ? (
        <ul className="mt-4 flex flex-col gap-2.5 border-t border-[#e2e0ea] pt-4">
          {facts.map((f, i) => (
            <li key={i} className="flex gap-3 text-[15px] leading-[24px] text-[#4a4862]">
              <span aria-hidden="true" className="mt-[3px] inline-flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-[#dcf5ea] text-[11px] font-bold text-[#0b7a4f]">
                ✓
              </span>
              <span>{f}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

/** Server-rendered FAQ accordion in the v5 style (native <details>, no JS). */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((f, i) => (
        <details key={f.q} open={i === 0} className="lc-faq group rounded-[24px] bg-white px-5 transition-shadow hover:shadow-[0_10px_30px_-18px_rgba(18,18,38,.3)] sm:px-6">
          <summary className="flex min-h-[44px] items-center justify-between gap-4 py-[18px] sm:py-[22px]">
            <span className="text-[16px] font-bold leading-6 sm:text-[18px]">{f.q}</span>
            <span className="lc-plus inline-flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-[#f1eff8] group-hover:bg-[#e4dfff]" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#121226" strokeWidth="2.2" strokeLinecap="round">
                <path d="M12 5v14M5 12h14" />
              </svg>
            </span>
          </summary>
          <p className="-mt-1 pb-[18px] text-[16px] leading-[26px] text-[#4a4862] sm:pb-[22px]">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
