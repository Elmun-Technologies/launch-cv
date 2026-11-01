"use client";

import { useState, type ReactNode } from "react";

type Card = { slug: string; category: string; node: ReactNode };

/**
 * Category chips + post listing for /blog. Every post is in the server HTML
 * (the "All" view); picking a category just narrows the grid on the client.
 */
export function BlogFilter({
  categories,
  featured,
  featuredSlug,
  cards,
}: {
  categories: { name: string; count: number }[];
  featured: ReactNode;
  featuredSlug: string;
  cards: Card[];
}) {
  const [cat, setCat] = useState<string | null>(null);
  const shown = cat ? cards.filter((c) => c.category === cat) : cards.filter((c) => c.slug !== featuredSlug);
  const chips = [{ name: null as string | null, label: "All", count: cards.length }, ...categories.map((c) => ({ name: c.name, label: c.name, count: c.count }))];

  return (
    <>
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-10">
        <div
          role="group"
          aria-label="Filter guides by topic"
          className="-mx-4 mt-[18px] flex gap-1.5 overflow-x-auto px-4 pb-1 [scrollbar-width:none] sm:mx-0 sm:mt-8 sm:flex-wrap sm:gap-2 sm:overflow-visible sm:px-0 [&::-webkit-scrollbar]:hidden"
        >
          {chips.map((c) => {
            const on = c.name === cat;
            return (
              <button
                key={c.label}
                type="button"
                aria-pressed={on}
                onClick={() => setCat(c.name)}
                className={`lc-btn-lift min-h-[44px] shrink-0 whitespace-nowrap rounded-full px-[14px] text-[13px] font-semibold sm:px-[18px] sm:text-[15px] ${
                  on ? "bg-[#111118] text-white" : "bg-white text-[#121226] hover:bg-[#e4dfff]"
                }`}
              >
                {c.label} · {c.count}
              </button>
            );
          })}
        </div>
      </div>

      {cat ? null : <section className="mx-auto max-w-[1280px] px-4 pt-5 sm:px-6 sm:pt-8 lg:px-10">{featured}</section>}

      <section className="mx-auto max-w-[1280px] px-4 pt-2.5 sm:px-6 sm:pt-6 lg:px-10">
        <h2 className="sr-only">{cat ? `${cat} guides` : "More guides"}</h2>
        <p role="status" className="sr-only">
          {cat ? `Showing ${shown.length} ${cat} guides` : ""}
        </p>
        <ul className="grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
          {shown.map((c) => (
            <li key={c.slug}>{c.node}</li>
          ))}
        </ul>
      </section>
    </>
  );
}
