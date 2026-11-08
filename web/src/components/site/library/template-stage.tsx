"use client";

import { useState, type ReactNode } from "react";

type Item = { key: string; label: string; node: ReactNode };

/**
 * Templates hero paper: one real template preview (rendered on the server and
 * passed in), with a switcher that swaps which template is shown. The default
 * template is in the server HTML, so nothing above the fold waits for JS.
 */
export function TemplateStage({ items, initial, children }: { items: Item[]; initial: string; children?: ReactNode }) {
  const [active, setActive] = useState(initial);
  const current = items.find((t) => t.key === active) ?? items[0];
  return (
    <>
      <div className="absolute left-[22px] top-20 w-[calc(100%-44px)] max-w-[300px] -rotate-3 overflow-hidden rounded-lg shadow-[0_30px_60px_-24px_rgba(10,6,60,.6)] sm:left-10 sm:top-[120px] sm:w-[400px] sm:max-w-none lg:left-14 lg:top-[150px] lg:w-[460px]">
        {current?.node}
        <span className="absolute right-2.5 top-2.5 rounded-full bg-[#f1eff8] px-2 py-[3px] text-[10px] font-semibold text-[#66647c] sm:text-[11px]">
          Sample resume — names are illustrative
        </span>
      </div>
      {children}
      <div
        role="group"
        aria-label="Preview template"
        className="lc-float absolute right-4 top-4 hidden flex-col gap-1 rounded-[22px] bg-[#111118] p-1.5 sm:flex lg:right-7 lg:top-8"
      >
        {items.map((t) => (
          <button
            key={t.key}
            type="button"
            aria-pressed={t.key === active}
            onClick={() => setActive(t.key)}
            className={`min-h-11 rounded-2xl px-[18px] text-left text-[14px] font-semibold transition-colors ${
              t.key === active ? "bg-[#c9c0ff] text-[#111118]" : "text-white hover:bg-white/10"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
    </>
  );
}
