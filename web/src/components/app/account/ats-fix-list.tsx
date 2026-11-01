"use client";

import { useState } from "react";
import { FixItem } from "@/components/ats-report-parts";
import type { FreeAtsFix } from "@/types/ai-results";

type Filter = "all" | FreeAtsFix["priority"];

/** Saved ATS report: every fix, with All / High / Medium / Low filter pills. */
export function AtsFixList({ fixes, totalFixes }: { fixes: FreeAtsFix[]; totalFixes: number }) {
  const [filter, setFilter] = useState<Filter>("all");
  const counts = {
    High: fixes.filter((f) => f.priority === "High").length,
    Medium: fixes.filter((f) => f.priority === "Medium").length,
    Low: fixes.filter((f) => f.priority === "Low").length,
  };
  const options: { key: Filter; label: string }[] = [
    { key: "all", label: `All ${fixes.length}` },
    ...(["High", "Medium", "Low"] as const).filter((p) => counts[p] > 0).map((p) => ({ key: p as Filter, label: `${p} · ${counts[p]}` })),
  ];
  // Keep the original numbering when a filter is on.
  const shown = fixes.map((f, i) => ({ f, n: i + 1 })).filter(({ f }) => filter === "all" || f.priority === filter);

  return (
    <section aria-labelledby="ats-fixes-title" className="lc-card rounded-[24px] p-5 sm:rounded-[28px] sm:p-7">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 id="ats-fixes-title" className="text-[19px] font-extrabold tracking-[-0.01em] text-[#121226] sm:text-[22px]">
          All {totalFixes} fixes
        </h2>
        {options.length > 2 ? (
          <div role="group" aria-label="Filter fixes by priority" className="flex flex-wrap gap-1.5">
            {options.map((o) => {
              const on = filter === o.key;
              return (
                <button
                  key={o.key}
                  type="button"
                  aria-pressed={on}
                  onClick={() => setFilter(o.key)}
                  className={`inline-flex min-h-11 items-center rounded-full px-3.5 text-[13px] font-bold transition-colors focus-visible:rounded-full! motion-reduce:transition-none ${
                    on ? "bg-[#111118] text-white" : "bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]"
                  }`}
                >
                  {o.label}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
      <ol className="mt-3.5">
        {shown.map(({ f, n }) => (
          <FixItem key={`${n}-${f.title}`} fix={f} n={n} />
        ))}
      </ol>
    </section>
  );
}
