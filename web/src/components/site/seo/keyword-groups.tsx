import type { CSSProperties } from "react";
import type { KeywordGroup } from "@/lib/seo/resume-keywords";

/**
 * Keyword cards by type. Keywords the sample resume already uses are filled
 * purple with a tick (the tick and the screen-reader note carry the meaning,
 * not the color alone).
 */
export function KeywordGroups({ groups, sampleOwner }: { groups: KeywordGroup[]; sampleOwner: string }) {
  /*
   * One wrapping row instead of equal columns: each card grows in proportion
   * to its chip count, so a one-chip group sits as a narrow card beside a big
   * one rather than as a mostly empty column, and cards in a row share a height.
   */
  return (
    <div className="flex flex-wrap gap-2.5 sm:gap-3.5">
      {groups.map((g) => (
        <section
          key={g.id}
          aria-labelledby={`kw-${g.id}`}
          style={{ "--kw-grow": Math.max(g.items.length, 2), "--kw-basis": g.items.length > 6 ? "340px" : "220px" } as CSSProperties}
          className="lc-card min-w-0 basis-full rounded-[22px] p-[18px] sm:basis-(--kw-basis) sm:grow-(--kw-grow) sm:rounded-[26px] sm:p-6"
        >
          <h3 id={`kw-${g.id}`} className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#66647c]">
            {g.label} <span className="font-semibold normal-case tracking-normal">· {g.items.length}</span>
          </h3>
          <ul className="mt-3.5 flex flex-wrap gap-2">
            {g.items.map((k) => (
              <li
                key={k.term}
                className={`inline-flex items-center gap-1.5 rounded-full px-[11px] py-[7px] text-[13px] font-semibold sm:px-3.5 sm:py-[9px] sm:text-[14px] ${
                  k.inSample ? "bg-[#5440e8] text-white" : "bg-[#f1eff8] text-[#121226]"
                }`}
              >
                {k.inSample ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                ) : null}
                {k.term}
                {k.inSample ? <span className="sr-only"> (used in {sampleOwner} sample resume)</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
