import type { KeywordGroup } from "@/lib/seo/resume-keywords";

/**
 * Keyword cards by type. Keywords the sample resume already uses are filled
 * purple with a tick (the tick and the screen-reader note carry the meaning,
 * not the color alone).
 */
export function KeywordGroups({ groups, sampleOwner }: { groups: KeywordGroup[]; sampleOwner: string }) {
  const cols = groups.length >= 4 ? "lg:grid-cols-4" : groups.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-2";
  return (
    <div className={`grid items-start gap-2.5 sm:grid-cols-2 sm:gap-3.5 ${cols}`}>
      {groups.map((g) => (
        <section key={g.id} aria-labelledby={`kw-${g.id}`} className="lc-card rounded-[22px] p-[18px] sm:rounded-[26px] sm:p-6">
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
