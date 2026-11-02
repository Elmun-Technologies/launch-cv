/**
 * Row of white cards with a mono "01" counter, a title and a line (v5 "what trips it up").
 * Pass `reveal={false}` when the row sits above the fold, so it isn't faded in on load.
 * `compact` packs the cards two to a row on phones (for long step lists at the top of a page).
 */
export function NumberedCards({
  items,
  className = "",
  reveal = true,
  compact = false,
}: {
  items: { t: string; d: string }[];
  className?: string;
  reveal?: boolean;
  compact?: boolean;
}) {
  return (
    <ol className={`grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 ${compact ? "grid-cols-2" : ""} ${className}`}>
      {items.map((it, i) => (
        <li key={it.t} className={`lc-card ${reveal ? "lc-reveal" : ""} ${compact ? "rounded-[18px] p-3.5" : "rounded-[22px] p-[18px]"} sm:rounded-3xl sm:p-6`}>
          <p className={`lc-mono text-[#5440e8] ${compact ? "text-[12px]" : "text-[13px]"} sm:text-[13px]`} aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className={`font-extrabold sm:mt-7 sm:text-[20px] sm:leading-6 ${compact ? "mt-1.5 text-[16px] leading-5" : "mt-3 text-[18px] leading-6"}`}>{it.t}</h3>
          <p className={`text-[#4a4862] sm:mt-2 sm:text-[15px] sm:leading-[23px] ${compact ? "mt-1 text-[13px] leading-[19px]" : "mt-1.5 text-[15px] leading-[23px]"}`}>{it.d}</p>
        </li>
      ))}
    </ol>
  );
}
