"use client";

import { useRef, useState, type ReactNode } from "react";

/**
 * A long link list that shows `initial` items on phones and a "Show all"
 * button. Every item stays in the server HTML; the extra ones are only hidden
 * with CSS below `sm`, so crawlers and no-JS visitors still get every link.
 */
export function ShowAllList({
  items,
  initial,
  noun,
  className,
  itemClassName = "",
}: {
  items: { key: string; node: ReactNode }[];
  initial: number;
  noun: string;
  className: string;
  itemClassName?: string;
}) {
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLUListElement>(null);
  const capped = !expanded && items.length > initial;

  function showAll() {
    setExpanded(true);
    requestAnimationFrame(() => listRef.current?.querySelectorAll<HTMLElement>("li a")[initial]?.focus());
  }

  return (
    <>
      <ul ref={listRef} className={className}>
        {items.map((i, n) => (
          <li key={i.key} className={`${itemClassName} ${capped && n >= initial ? "max-sm:hidden" : ""}`}>
            {i.node}
          </li>
        ))}
      </ul>
      <p className="sr-only" aria-live="polite">
        {expanded ? `Showing all ${items.length} ${noun}` : ""}
      </p>
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
