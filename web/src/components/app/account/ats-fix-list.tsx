"use client";

import { useState } from "react";
import { FixItem, PriorityBadge } from "@/components/ats-report-parts";
import type { FreeAtsFix } from "@/types/ai-results";

type Filter = "all" | FreeAtsFix["priority"];

/** Fixes shown before "+ N more lower-priority issues". */
const TOP = 6;

/**
 * Saved ATS report: the fixes ranked by impact, top six first with the rest
 * behind "+ N more", and All / High / Medium / Low filter pills. Printing
 * always lists every fix.
 */
export function AtsFixList({ fixes, totalFixes }: { fixes: FreeAtsFix[]; totalFixes: number }) {
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);
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
  const collapsed = filter === "all" && !expanded && shown.length > TOP;
  const more = shown.length - TOP;
  const total = Math.max(totalFixes, fixes.length);

  return (
    <section aria-labelledby="ats-fixes-title" className="lc-card rounded-[24px] p-5 sm:rounded-[28px] sm:p-7 print:shadow-none">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <h2 id="ats-fixes-title" className="text-[19px] font-extrabold tracking-[-0.01em] text-[#121226] sm:text-[22px]">
          {total} {total === 1 ? "issue" : "issues"}, ranked by impact
        </h2>
        {options.length > 2 ? (
          <div role="group" aria-label="Filter fixes by priority" className="flex flex-wrap gap-1.5 print:hidden">
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
      <ol id="ats-fix-items" className="mt-3.5">
        {shown.map(({ f, n }, i) => (
          <FixItem key={`${n}-${f.title}`} fix={f} n={n} printOnly={collapsed && i >= TOP} />
        ))}
      </ol>
      {collapsed ? (
        <button
          type="button"
          aria-expanded={false}
          aria-controls="ats-fix-items"
          onClick={() => setExpanded(true)}
          className="-ml-1 mt-1 inline-flex min-h-11 items-center rounded-full px-1 text-[14px] font-semibold text-[#4a4862] transition-colors hover:text-[#5440e8] focus-visible:rounded-full! print:hidden"
        >
          + {more} more lower-priority {more === 1 ? "issue" : "issues"}
        </button>
      ) : null}
    </section>
  );
}

/**
 * Phone view of the same fixes: "Fix these first" cards for the high-priority
 * ones (the top three when none are high), then the rest behind a button.
 */
export function AtsFixCards({ fixes }: { fixes: FreeAtsFix[] }) {
  const [all, setAll] = useState(false);
  const high = fixes.filter((f) => f.priority === "High");
  const first = high.length ? high : fixes.slice(0, 3);
  const rest = fixes.filter((f) => !first.includes(f));
  const list = all ? [...first, ...rest] : first;
  if (!fixes.length) return null;
  return (
    <section aria-labelledby="ats-first-title" className="mt-[22px]">
      <h2 id="ats-first-title" className="text-[19px] font-extrabold text-[#121226]">
        Fix these first
      </h2>
      <ol id="ats-fix-cards" className="mt-2.5 flex flex-col gap-2">
        {list.map((f, i) => (
          <li key={`${i}-${f.title}`} className="rounded-[20px] bg-white p-4">
            <div className="flex items-start justify-between gap-2.5">
              <p className="min-w-0 text-[15px] font-bold leading-[21px] text-[#121226]">{f.title}</p>
              <PriorityBadge priority={f.priority} />
            </div>
            {f.detail ? <p className="mt-1.5 text-[13px] leading-[19px] text-[#4a4862]">{f.detail}</p> : null}
            {f.fix ? (
              <p className="mt-2 text-[13px] leading-[19px] text-[#24223a]">
                <b className="text-[#0b7a4f]">Fix</b> {f.fix}
              </p>
            ) : null}
          </li>
        ))}
      </ol>
      {rest.length > 0 && !all ? (
        <button
          type="button"
          aria-expanded={false}
          aria-controls="ats-fix-cards"
          onClick={() => setAll(true)}
          className="mt-1 inline-flex min-h-11 items-center rounded-full px-1 text-[14px] font-semibold text-[#4a4862] hover:text-[#5440e8] focus-visible:rounded-full!"
        >
          + {rest.length} more {rest.length === 1 ? "issue" : "issues"}
        </button>
      ) : null}
    </section>
  );
}
