"use client";

import { useRef, useState, type ReactNode } from "react";

type Group = { key: string; label: string; count: number };
type Item = { key: string; group: string; node: ReactNode };

/**
 * Field filter for the examples grid. Every card is in the server HTML (the
 * "All" view), so crawlers and no-JS visitors get the full list; the chips
 * only hide cards on the client.
 *
 * With `mobileInitial`, phones see that many cards of the "All" view first and
 * a "Show all" button; the rest stay in the markup, hidden with CSS below `sm`.
 */
export function GroupFilter({
  groups,
  items,
  allLabel,
  gridClassName,
  mobileInitial,
  noun = "examples",
}: {
  groups: Group[];
  items: Item[];
  allLabel: string;
  gridClassName: string;
  mobileInitial?: number;
  /** For the live region and the "Show all" button: "examples", "letters"… */
  noun?: string;
}) {
  const [active, setActive] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const chip = (on: boolean) =>
    `lc-btn-lift min-h-11 shrink-0 rounded-full px-3.5 text-[13px] font-semibold sm:px-[18px] sm:text-[15px] ${
      on ? "bg-[#111118] text-white" : "bg-white text-[#121226] hover:bg-[#e4dfff]"
    }`;
  const shown = active ? items.filter((i) => i.group === active) : items;
  const capped = !active && !expanded && typeof mobileInitial === "number" && items.length > mobileInitial;

  function showAll() {
    setExpanded(true);
    // Keyboard users land on the first card that just appeared.
    requestAnimationFrame(() => listRef.current?.querySelectorAll<HTMLElement>("li > a")[mobileInitial ?? 0]?.focus());
  }

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
        {active ? `Showing ${shown.length} ${active} ${noun}` : expanded ? `Showing all ${items.length} ${noun}` : ""}
      </p>
      <ul ref={listRef} className={gridClassName}>
        {shown.map((i, n) => (
          <li
            key={i.key}
            className={`flex [contain-intrinsic-size:auto_360px] [content-visibility:auto] ${capped && n >= (mobileInitial ?? 0) ? "max-sm:hidden" : ""}`}
          >
            {i.node}
          </li>
        ))}
      </ul>
      {capped ? (
        <div className="mt-4 flex justify-center sm:hidden">
          <button
            type="button"
            onClick={showAll}
            className="lc-btn-lift inline-flex min-h-12 items-center justify-center rounded-full bg-white px-6 text-[15px] font-semibold text-[#121226] hover:bg-[#e4dfff]"
          >
            Show all {items.length} {noun}
          </button>
        </div>
      ) : null}
    </>
  );
}
