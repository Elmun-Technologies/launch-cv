import type { TocEntry } from "@/lib/toc";
import { List } from "lucide-react";

/**
 * Auto-generated table of contents for long posts. Anchor links jump to the
 * matching heading id set on the rendered Markdown headings. Rendered inside
 * a <nav> for accessibility and to give crawlers a jump-link map of the page.
 */
export function BlogToc({ entries }: { entries: TocEntry[] }) {
  if (entries.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className="mt-10 rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] p-5 sm:p-6"
    >
      <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">
        <List className="h-3.5 w-3.5" /> On this page
      </p>
      <ul className="mt-3 space-y-1.5">
        {entries.map((e) => (
          <li key={e.id} className={e.depth === 3 ? "pl-4" : ""}>
            <a
              href={`#${e.id}`}
              className="text-[13px] leading-snug text-[#475569] underline-offset-2 transition hover:text-[#1A56DB] hover:underline"
            >
              {e.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
