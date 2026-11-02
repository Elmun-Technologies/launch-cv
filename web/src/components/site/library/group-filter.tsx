"use client";

import { useState, type ReactNode } from "react";

type Group = { key: string; label: string; count: number };
type Item = { key: string; group: string; node: ReactNode };

/**
 * Field filter for the examples grid. Every card is in the server HTML (the
 * "All" view), so crawlers and no-JS visitors get the full list; the chips
 * only hide cards on the client.
 */
export function GroupFilter({
  groups,
  items,
  allLabel,
  gridClassName,
}: {
  groups: Group[];
  items: Item[];
  allLabel: string;
  gridClassName: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const chip = (on: boolean) =>
    `lc-btn-lift min-h-11 shrink-0 rounded-full px-3.5 text-[13px] font-semibold sm:px-[18px] sm:text-[15px] ${
      on ? "bg-[#111118] text-white" : "bg-white text-[#121226] hover:bg-[#e4dfff]"
    }`;
  const shown = active ? items.filter((i) => i.group === active) : items;
  return (
    <>
      <div role="group" aria-label="Filter by field" className="-mx-4 flex gap-1.5 overflow-x-auto px-4 pb-1 sm:mx-0 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0">
        <button type="button" aria-pressed={active === null} onClick={() => setActive(null)} className={chip(active === null)}>
          {allLabel}
        </button>
        {groups.map((g) => (
          <button key={g.key} type="button" aria-pressed={active === g.key} onClick={() => setActive(g.key)} className={chip(active === g.key)}>
            {g.label}
            <span className="hidden sm:inline"> · {g.count}</span>
          </button>
        ))}
      </div>
      <p className="sr-only" aria-live="polite">
        {active ? `Showing ${shown.length} ${active} examples` : ""}
      </p>
      <ul className={gridClassName}>
        {shown.map((i) => (
          <li key={i.key} className="flex [contain-intrinsic-size:auto_300px] [content-visibility:auto]">
            {i.node}
          </li>
        ))}
      </ul>
    </>
  );
}
