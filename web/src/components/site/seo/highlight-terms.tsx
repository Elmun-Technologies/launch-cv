import type { ReactNode } from "react";

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Renders `text` with every whole-word occurrence of `terms` wrapped in a
 * lilac <mark>. Matching follows lib/seo/resume-keywords `mentions()`: short
 * terms (3 characters or fewer) are case-sensitive, longer ones aren't.
 */
export function HighlightTerms({ text, terms, markClassName = "" }: { text: string; terms: string[]; markClassName?: string }) {
  const ranges: [number, number][] = [];
  for (const term of [...terms].sort((a, b) => b.length - a.length)) {
    const re = new RegExp(`(^|[^A-Za-z0-9])(${escapeRe(term)})(?![A-Za-z0-9])`, term.length <= 3 ? "g" : "gi");
    for (const m of text.matchAll(re)) {
      const start = (m.index ?? 0) + m[1].length;
      const end = start + m[2].length;
      if (!ranges.some(([s, e]) => start < e && end > s)) ranges.push([start, end]);
    }
  }
  if (ranges.length === 0) return <>{text}</>;
  ranges.sort((a, b) => a[0] - b[0]);
  const out: ReactNode[] = [];
  let pos = 0;
  ranges.forEach(([s, e], i) => {
    if (s > pos) out.push(text.slice(pos, s));
    out.push(
      <mark key={i} className={`rounded-[5px] bg-[#e4dfff] px-1 text-inherit ${markClassName}`}>
        {text.slice(s, e)}
      </mark>,
    );
    pos = e;
  });
  if (pos < text.length) out.push(text.slice(pos));
  return <>{out}</>;
}
