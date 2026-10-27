import type { TocEntry } from "@/lib/toc";

/**
 * Auto-generated table of contents for long posts. Anchor links jump to the
 * matching heading id set on the rendered Markdown headings. Rendered inside
 * a <nav> for accessibility and to give crawlers a jump-link map of the page.
 */
export function BlogToc({ entries }: { entries: TocEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <nav aria-label="Table of contents">
      <p className="mb-2 text-[13px] text-[#6B6B6B]">In this guide</p>
      <ul className="border-l border-[#E5E5E2]">
        {entries.map((e) => (
          <li key={e.id}>
            <a
              href={`#${e.id}`}
              className={`-ml-px block border-l border-transparent py-1.5 text-[14px] leading-snug text-[#3F3F3F] hover:border-[#111111] hover:text-[#111111] ${
                e.depth === 3 ? "pl-6" : "pl-3.5"
              }`}
            >
              {e.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
