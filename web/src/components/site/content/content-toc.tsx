"use client";

import { useEffect, useState } from "react";

export type ContentTocEntry = { id: string; text: string; depth?: 2 | 3 };

/**
 * Sticky "On this page" list for long-form pages (blog posts, legal pages).
 * Server-rendered as plain anchor links; once hydrated it highlights the
 * section currently being read.
 */
export function ContentToc({ entries, numbered = false }: { entries: ContentTocEntry[]; numbered?: boolean }) {
  const [active, setActive] = useState(entries[0]?.id);

  useEffect(() => {
    const els = entries.map((e) => document.getElementById(e.id)).filter((el): el is HTMLElement => !!el);
    if (els.length === 0 || typeof IntersectionObserver === "undefined") return;
    const visible = new Set<string>();
    const io = new IntersectionObserver(
      (records) => {
        for (const r of records) {
          if (r.isIntersecting) visible.add(r.target.id);
          else visible.delete(r.target.id);
        }
        // The first heading in document order that's in the reading band wins.
        const first = els.find((el) => visible.has(el.id));
        if (first) setActive(first.id);
      },
      { rootMargin: "0px 0px -65% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [entries]);

  if (entries.length === 0) return null;

  return (
    <nav aria-label="On this page">
      <p className="mb-2.5 ml-3 text-[12px] font-bold tracking-[0.08em] text-[#66647c]">ON THIS PAGE</p>
      <ol className="flex flex-col gap-0.5">
        {entries.map((e, i) => {
          const on = e.id === active;
          return (
            <li key={e.id}>
              <a
                href={`#${e.id}`}
                aria-current={on ? "location" : undefined}
                className={`block rounded-xl py-[9px] pr-3 text-[14px] leading-5 transition-colors ${e.depth === 3 ? "pl-6" : "pl-3"} ${
                  on ? "bg-[#e4dfff] font-bold text-[#3a2bb8]" : "text-[#4a4862] hover:bg-white hover:text-[#121226]"
                }`}
              >
                {numbered ? `${i + 1}. ` : null}
                {e.text}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

/** Collapsible table of contents for narrow screens (no JavaScript needed). */
export function ContentTocMobile({ entries, numbered = false }: { entries: ContentTocEntry[]; numbered?: boolean }) {
  if (entries.length === 0) return null;
  return (
    <details open className="lc-faq group rounded-[20px] bg-white px-[18px] py-1.5">
      <summary className="flex min-h-[48px] items-center justify-between gap-3 text-[14px] font-bold">
        On this page
        <span className="lc-plus inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#f1eff8]" aria-hidden="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#121226" strokeWidth="2.2" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </span>
      </summary>
      <nav aria-label="On this page">
        <ol className={`mt-1 pb-2 text-[14px] text-[#4a4862] ${numbered ? "list-decimal pl-[18px]" : ""}`}>
          {entries.map((e) => (
            <li key={e.id} className={`border-t border-[#e2e0ea] ${e.depth === 3 ? "pl-4" : ""}`}>
              <a href={`#${e.id}`} className="block py-3 leading-5 hover:text-[#5440e8]">
                {e.text}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}
