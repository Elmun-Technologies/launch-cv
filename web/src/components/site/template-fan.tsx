"use client";

import Link from "next/link";
import { useState, type ReactNode } from "react";

type Item = { key: string; label: string; node: ReactNode };

/**
 * The four real templates (rendered by the editor's own preview component),
 * fanned out like papers on a desk. The switcher lifts one to the front.
 */
export function TemplateFan({ items }: { items: Item[] }) {
  const [active, setActive] = useState(items[1]?.key ?? items[0]?.key);
  const POS = ["lg:left-[9%] lg:top-[92px] lg:-rotate-[8deg]", "lg:left-[29%] lg:top-[58px] lg:-rotate-[3deg]", "lg:left-[49%] lg:top-[74px] lg:rotate-[3deg]", "lg:left-[69%] lg:top-[112px] lg:rotate-[8deg]"];
  return (
    <div className="lc-reveal relative mt-10 overflow-hidden rounded-[28px] bg-[#e4dfff] lg:mt-12 lg:h-[600px] lg:rounded-[36px]">
      <div className="lc-fan flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-28 pt-10 lg:block lg:h-full lg:overflow-visible lg:p-0">
        {items.map((t, i) => (
          <Link
            key={t.key}
            href={`/resume-templates#${t.key}`}
            data-i={i}
            data-active={t.key === active}
            aria-label={`${t.label} template`}
            onMouseEnter={() => setActive(t.key)}
            onFocus={() => setActive(t.key)}
            className={`lc-paper block w-[240px] shrink-0 snap-center rounded-lg shadow-[0_24px_48px_-20px_rgba(36,24,120,.35)] lg:absolute lg:w-[22%] lg:max-w-[290px] ${POS[i] ?? ""} ${t.key === active ? "lg:z-20" : "lg:z-10"}`}
          >
            {t.node}
          </Link>
        ))}
      </div>
      <span aria-hidden="true" className="lc-poster absolute right-6 top-5 -rotate-6 rounded-full bg-[#ff7a33] px-[15px] py-[9px] text-[14px] text-[#111118] lg:right-16 lg:top-10">
        FREE PDF
      </span>
      <div role="group" aria-label="Template" className="absolute bottom-6 left-1/2 flex -translate-x-1/2 gap-1 rounded-full bg-[#111118] p-1.5 lg:bottom-10">
        {items.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={t.key === active}
            onClick={() => setActive(t.key)}
            className={`rounded-full px-3.5 py-2.5 text-[14px] font-semibold transition-colors sm:px-5 sm:py-3 sm:text-[15px] ${
              t.key === active ? "bg-[#c9c0ff] text-[#111118]" : "text-white hover:bg-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}
