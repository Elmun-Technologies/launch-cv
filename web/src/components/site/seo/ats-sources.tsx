import type { AtsFact, AtsSource } from "@/lib/seo/ats-vendors";

const dateLabel = (iso: string) =>
  new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

const sourceId = (slug: string, i: number) => `source-${slug}-${i + 1}`;

/** Superscript-style source links ("1", "2") that jump to the Sources list. */
function SourceRefs({ slug, src, sources }: { slug: string; src: number[]; sources: AtsSource[] }) {
  return (
    <span className="ml-1 inline-flex gap-1 align-baseline">
      {src.map((i) => (
        <a
          key={i}
          href={`#${sourceId(slug, i)}`}
          aria-label={`Source ${i + 1}: ${sources[i]?.title ?? ""}`}
          className="inline-flex min-h-6 min-w-6 items-center justify-center rounded-full bg-[#f1eff8] px-1.5 text-[12px] font-bold text-[#3a2bb8] transition-colors hover:bg-[#e4dfff]"
        >
          {i + 1}
        </a>
      ))}
    </span>
  );
}

/** Grid of vendor facts, each citing its source. */
export function AtsFactGrid({ slug, facts, sources }: { slug: string; facts: AtsFact[]; sources: AtsSource[] }) {
  return (
    <ul className="grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-3">
      {facts.map((f) => (
        <li key={f.label} className="lc-card lc-reveal flex flex-col rounded-[22px] p-[18px] sm:rounded-3xl sm:p-6">
          <h3 className="text-[17px] font-extrabold leading-6 sm:text-[19px]">{f.label}</h3>
          <p className="mt-2 text-[15px] leading-[23px] text-[#4a4862]">
            {f.text}
            <SourceRefs slug={slug} src={f.src} sources={sources} />
          </p>
        </li>
      ))}
    </ul>
  );
}

/** Numbered list of sources with publisher and check date. */
export function AtsSourceList({ slug, sources }: { slug: string; sources: AtsSource[] }) {
  return (
    <ol className="lc-card rounded-[24px] px-5 py-1.5 sm:rounded-[28px] sm:px-7 sm:py-3">
      {sources.map((s, i) => (
        <li
          key={s.url}
          id={sourceId(slug, i)}
          className={`flex scroll-mt-6 gap-3.5 py-3.5 sm:py-4 ${i > 0 ? "border-t border-[#e2e0ea]" : ""}`}
        >
          <span className="lc-mono mt-0.5 w-6 flex-none text-[13px] text-[#5440e8]">{i + 1}.</span>
          <span className="min-w-0">
            <a
              href={s.url}
              rel="noopener"
              className="break-words text-[15px] font-semibold text-[#121226] underline decoration-[#5440e8]/30 underline-offset-[3px] transition-colors hover:text-[#5440e8] hover:decoration-[#5440e8] sm:text-[16px]"
            >
              {s.title}
            </a>
            <span className="mt-1 block text-[13px] text-[#66647c] sm:text-[14px]">
              {s.publisher} · Checked <time dateTime={s.checked}>{dateLabel(s.checked)}</time>
            </span>
          </span>
        </li>
      ))}
    </ol>
  );
}
