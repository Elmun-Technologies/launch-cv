"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { VerbGroup } from "@/lib/seo/action-verbs";

/**
 * Filterable verb list. Every verb and example is in the server HTML (the
 * initial state shows all of them); filtering only hides cards in the browser.
 */
export function VerbExplorer({ groups }: { groups: VerbGroup[] }) {
  const id = useId();
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const timer = useRef<number | undefined>(undefined);

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      groups.map((g) => ({
        key: g.key,
        shown: active !== "all" && active !== g.key ? [] : g.verbs.filter((v) => !q || v.verb.toLowerCase().includes(q) || v.example.toLowerCase().includes(q)),
      })),
    [groups, active, q],
  );
  const shownCount = visible.reduce((n, g) => n + g.shown.length, 0);
  const isFiltered = active !== "all" || q.length > 0;

  async function copy(verb: string) {
    try {
      await navigator.clipboard.writeText(verb);
      setCopied(verb);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }

  const chip = (key: string, label: string) => {
    const on = active === key;
    return (
      <button
        key={key}
        type="button"
        aria-pressed={on}
        onClick={() => setActive(key)}
        className={`min-h-10 rounded-full px-4 text-[14px] font-semibold transition-colors lg:text-[15px] ${
          on ? "bg-[#111118] text-white" : "bg-white text-[#121226] hover:bg-[#e4dfff]"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div>
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div role="group" aria-label="Filter by skill area" className="flex flex-wrap gap-1.5">
          {chip("all", "All")}
          {groups.map((g) => chip(g.key, g.label))}
        </div>
        <div className="lg:w-[300px] lg:flex-none">
          <label htmlFor={`${id}-q`} className="sr-only">
            Search verbs and examples
          </label>
          <input
            id={`${id}-q`}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search verbs, e.g. “led” or “patients”"
            className="block min-h-12 w-full rounded-full border-[1.5px] border-[#e2e0ea] bg-white px-5 text-[16px] text-[#121226] transition-colors placeholder:text-[#66647c] hover:border-[#c9c0ff] focus:border-[#5440e8] sm:text-[15px]"
          />
        </div>
      </div>

      <p className="mt-3 text-[13px] text-[#4a4862]" aria-live="polite">
        {isFiltered ? `Showing ${shownCount} ${shownCount === 1 ? "verb" : "verbs"}.` : ""}
        {copied ? ` Copied “${copied}”.` : ""}
      </p>

      <div className="mt-3 grid items-start gap-2.5 md:grid-cols-2 lg:gap-3 xl:grid-cols-3">
        {groups.map((g, gi) => {
          const shown = visible[gi].shown;
          const shownSet = new Set(shown.map((v) => v.verb));
          return (
            <section key={g.key} id={g.key} hidden={shown.length === 0} aria-labelledby={`${id}-${g.key}`} className="lc-card scroll-mt-24 rounded-3xl p-[22px] lg:p-6">
              <div className="flex items-baseline justify-between gap-3">
                <h2 id={`${id}-${g.key}`} className="text-[20px] font-extrabold tracking-[-0.01em] lg:text-[22px]">
                  {g.label}
                </h2>
                <span className="flex-none rounded-full bg-[#f1eff8] px-2.5 py-1 text-[12px] font-bold text-[#4a4862]">
                  {g.verbs.length} verbs
                </span>
              </div>
              <p className="mt-1 text-[14px] text-[#66647c]">{g.blurb}</p>
              <ul className="mt-3">
                {g.verbs.map((v) => (
                  <li key={v.verb} hidden={!shownSet.has(v.verb)} className="border-t border-[#efedf7] py-2.5">
                    <button
                      type="button"
                      onClick={() => copy(v.verb)}
                      aria-label={`Copy “${v.verb}”`}
                      className="group inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#f1eff8] px-3 text-[15px] font-bold text-[#121226] transition-colors hover:bg-[#e4dfff]"
                    >
                      {v.verb}
                      <span aria-hidden="true" className="text-[12px] font-semibold text-[#5440e8]">
                        {copied === v.verb ? "Copied" : "Copy"}
                      </span>
                    </button>
                    <p className="mt-1.5 text-[14px] leading-[21px] text-[#4a4862]">{v.example}</p>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      {shownCount === 0 ? (
        <p className="mt-4 rounded-2xl bg-white p-4 text-[15px] text-[#4a4862]">
          No verbs match “{query.trim()}”.{" "}
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setActive("all");
            }}
            className="lc-link font-semibold text-[#5440e8]"
          >
            Show all verbs
          </button>
        </p>
      ) : null}
    </div>
  );
}
