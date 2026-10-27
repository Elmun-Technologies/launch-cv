
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
      className={`lc-key-facts rounded-2xl bg-[#F5F5F3] p-5 sm:p-6 ${className}`}
      aria-label={title}
    >
      <p className="text-[14px] font-semibold text-[#111111]">
        {title}
      </p>
      {lead ? (
        <p className="lc-key-facts-lead mt-2 text-[16px] leading-[1.65] text-[#111111]">{lead}</p>
      ) : null}
      {facts && facts.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {facts.map((f, i) => (
            <li key={i} className="flex gap-2.5 text-[15px] leading-[1.6] text-[#3F3F3F]">
              <span aria-hidden className="mt-[9px] h-1 w-1 shrink-0 rounded-full bg-[#111111]" />
              <span>{f}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
