/** Row of white cards with a mono "01" counter, a title and a line (v5 "what trips it up"). */
export function NumberedCards({ items, className = "" }: { items: { t: string; d: string }[]; className?: string }) {
  return (
    <ol className={`grid gap-2 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4 ${className}`}>
      {items.map((it, i) => (
        <li key={it.t} className="lc-card lc-reveal rounded-[22px] p-[18px] sm:rounded-3xl sm:p-6">
          <p className="lc-mono text-[13px] text-[#5440e8]" aria-hidden="true">
            {String(i + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-3 text-[18px] font-extrabold leading-6 sm:mt-7 sm:text-[20px]">{it.t}</h3>
          <p className="mt-1.5 text-[15px] leading-[23px] text-[#4a4862] sm:mt-2">{it.d}</p>
        </li>
      ))}
    </ol>
  );
}
