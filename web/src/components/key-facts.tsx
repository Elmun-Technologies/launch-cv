import { Sparkles } from "lucide-react";

/**
 * Visible "Key facts" / TL;DR answer box. Placed near the top of a page, it
 * gives AI answer engines (and skim-reading humans) a concise, liftable
 * summary. The `lc-key-facts` class is referenced by each page's
 * SpeakableSpecification so voice assistants read it aloud.
 *
 * `lead` is a 1–2 sentence direct answer; `facts` are short supporting points.
 */
export function KeyFacts({
  title = "Key facts",
  lead,
  facts,
  className = "",
}: {
  title?: string;
  lead?: string;
  facts?: string[];
  className?: string;
}) {
  if (!lead && (!facts || facts.length === 0)) return null;

  return (
    <aside
      className={`lc-key-facts rounded-xl border border-[#DBEAFE] bg-[#F5F9FF] p-5 sm:p-6 ${className}`}
      aria-label={title}
    >
      <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#1A56DB]">
        <Sparkles className="h-3.5 w-3.5" />
        {title}
      </p>
      {lead ? (
        <p className="lc-key-facts-lead mt-2.5 text-[15px] leading-[1.7] text-[#1E293B]">{lead}</p>
      ) : null}
      {facts && facts.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {facts.map((f, i) => (
            <li key={i} className="flex gap-2 text-[13.5px] leading-[1.6] text-[#334155]">
              <span aria-hidden className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full bg-[#1A56DB]" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
