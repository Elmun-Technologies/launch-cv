/** White card with a ticked list (ATS "Before you hit Upload" checklist). */
export function CheckList({ items, label }: { items: string[]; label: string }) {
  return (
    <ul aria-label={label} className="lc-card rounded-[24px] px-5 py-1.5 sm:rounded-[28px] sm:px-7 sm:py-3">
      {items.map((item, i) => (
        <li key={item} className={`flex gap-3.5 py-3.5 text-[15px] leading-6 sm:py-4 sm:text-[16px] ${i > 0 ? "border-t border-[#e2e0ea]" : ""}`}>
          <span aria-hidden="true" className="mt-px inline-flex h-6 w-6 flex-none items-center justify-center rounded-[7px] bg-[#5440e8]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          {item}
        </li>
      ))}
    </ul>
  );
}
