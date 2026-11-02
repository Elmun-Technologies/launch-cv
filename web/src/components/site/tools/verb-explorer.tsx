"use client";

import { useId, useMemo, useRef, useState } from "react";
import type { VerbGroup } from "@/lib/seo/action-verbs";

/**
 * Category cards, each a cloud of verb chips (Seo-ActionVerbs canvas). Every
 * verb is a real button in the server HTML; filtering only hides chips in the
 * browser. Clicking a chip copies it, marks it selected and shows its example
 * bullet under the cloud (the first verb's example until something is picked).
 */
export function VerbExplorer({ groups }: { groups: VerbGroup[] }) {
  const id = useId();
  const [active, setActive] = useState<string>("all");
  const [query, setQuery] = useState("");
  /** Selected verb per group. */
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [announce, setAnnounce] = useState("");
  const timer = useRef<number | undefined>(undefined);

  const q = query.trim().toLowerCase();
  const visible = useMemo(
    () =>
      groups.map((g) =>
        active !== "all" && active !== g.key
          ? []
          : g.verbs.filter((v) => !q || v.verb.toLowerCase().includes(q) || v.example.toLowerCase().includes(q)),
      ),
    [groups, active, q],
  );
  const shownCount = visible.reduce((n, g) => n + g.length, 0);
  const isFiltered = active !== "all" || q.length > 0;

  async function pick(groupKey: string, verb: string) {
    setPicked((p) => ({ ...p, [groupKey]: verb }));
    let ok = false;
    try {
      await navigator.clipboard.writeText(verb);
      ok = true;
    } catch {
      ok = false;
    }
    setAnnounce(ok ? `Copied “${verb}”.` : `Selected “${verb}”. Copying isn't available in this browser.`);
    window.clearTimeout(timer.current);
    timer.current = window.setTimeout(() => setAnnounce(""), 2500);
  }

  const filterChip = (key: string, label: string) => {
    const on = active === key;
    return (
      <button
        key={key}
        type="button"
        aria-pressed={on}
        onClick={() => setActive(key)}
        className={`min-h-10 rounded-full px-4 text-[14px] font-bold transition-colors ${
          on ? "bg-[#111118] text-white" : "bg-white text-[#121226] hover:bg-[#e4dfff]"
        }`}
      >
        {label}
      </button>
    );
  };

  return (
    <div>
      <div role="group" aria-label="Filter by skill area" className="flex flex-wrap justify-center gap-1.5">
        {filterChip("all", "All")}
        {groups.map((g) => filterChip(g.key, g.label))}
      </div>
      <div className="mx-auto mt-3 max-w-[360px]">
        <label htmlFor={`${id}-q`} className="sr-only">
          Search verbs and examples
        </label>
        <input
          id={`${id}-q`}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search verbs, e.g. “led” or “patients”"
          className="block min-h-11 w-full rounded-full border-[1.5px] border-[#e2e0ea] bg-white px-5 text-[16px] text-[#121226] transition-colors placeholder:text-[#66647c] hover:border-[#c9c0ff] focus:border-[#5440e8] sm:text-[15px]"
        />
      </div>

      <p className="mt-3 min-h-5 text-center text-[13px] text-[#4a4862]" aria-live="polite">
        {isFiltered ? `Showing ${shownCount} ${shownCount === 1 ? "verb" : "verbs"}. ` : ""}
        {announce}
      </p>

      <div className="mt-3 grid gap-2.5 md:grid-cols-2 lg:gap-3.5 xl:grid-cols-3">
        {groups.map((g, gi) => {
          const shown = visible[gi];
          const shownSet = new Set(shown.map((v) => v.verb));
          const sel = picked[g.key];
          const focus = g.verbs.find((v) => v.verb === sel && shownSet.has(v.verb)) ?? shown[0];
          return (
            <section
              key={g.key}
              id={g.key}
              hidden={shown.length === 0}
              aria-labelledby={`${id}-${g.key}`}
              className="lc-card flex scroll-mt-24 flex-col rounded-[26px] p-5 lg:p-6"
            >
              <div className="flex items-baseline justify-between gap-3">
                <h2 id={`${id}-${g.key}`} className="text-[20px] font-extrabold tracking-[-0.01em]">
                  {g.label}
                </h2>
                <span className="flex-none text-[13px] text-[#66647c]">{g.verbs.length} verbs</span>
              </div>
              <p className="mt-1 text-[14px] text-[#66647c]">{g.blurb}</p>
              <ul className="mt-3.5 flex flex-wrap gap-1.5">
                {g.verbs.map((v) => {
                  const on = sel === v.verb;
                  return (
                    <li key={v.verb} hidden={!shownSet.has(v.verb)}>
                      <button
                        type="button"
                        onClick={() => pick(g.key, v.verb)}
                        aria-pressed={on}
                        title="Copy and see an example"
                        className={`min-h-9 rounded-full px-[13px] text-[14px] font-semibold transition-colors ${
                          on ? "bg-[#5440e8] text-white" : "bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]"
                        }`}
                      >
                        {v.verb}
                      </button>
                    </li>
                  );
                })}
              </ul>
              {focus ? (
                <div className="mt-auto pt-4">
                  <p className="border-t border-[#efedf7] pt-3.5 text-[14px] leading-[21px] text-[#4a4862]">
                    <span className="mb-0.5 block text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">Example</span>
                    {focus.example}
                  </p>
                </div>
              ) : null}
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
