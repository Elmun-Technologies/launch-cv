/**
 * Numbered list of external sources for SEO pages (competitor claims,
 * statistics). Each item opens in a new tab and says so to screen readers.
 */
export type SourceItem = { id: string; label: string; url: string; note?: string };

export function SourceList({ items, className = "" }: { items: SourceItem[]; className?: string }) {
  return (
    <ol className={`flex flex-col gap-2.5 ${className}`}>
      {items.map((s, i) => (
        <li key={s.id} id={`source-${s.id}`} className="flex scroll-mt-6 gap-3 text-[14px] leading-[22px] text-[#4a4862] sm:text-[15px]">
          <span className="lc-mono mt-px flex-none text-[12px] font-bold text-[#5440e8] sm:text-[13px]">{String(i + 1).padStart(2, "0")}</span>
          <span className="min-w-0 [overflow-wrap:anywhere]">
            {s.note ? <span className="block text-[#24223a]">{s.note}</span> : null}
            <a
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#5440e8] underline decoration-[#5440e8]/40 underline-offset-[3px] transition-colors hover:text-[#4430d6] hover:decoration-[#4430d6]"
            >
              {s.label}
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </span>
        </li>
      ))}
    </ol>
  );
}

/** Superscript footnote link pointing at a SourceList item on the same page. */
export function SourceRef({ id, n }: { id: string; n: number }) {
  return (
    <sup className="ml-0.5 text-[11px] font-bold">
      <a href={`#source-${id}`} className="rounded text-[#5440e8] hover:text-[#4430d6] hover:underline">
        <span className="sr-only">Source </span>
        {n}
      </a>
    </sup>
  );
}
