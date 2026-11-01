import Link from "next/link";

/** White card link with a title, a muted line and a round arrow (related examples, cover letters). */
export function ArrowCard({ href, title, sub }: { href: string; title: string; sub?: string }) {
  return (
    <Link
      href={href}
      className="lc-card lc-rise group flex items-center justify-between gap-3 rounded-[22px] px-[18px] py-4 text-[#121226] sm:rounded-3xl sm:px-[26px] sm:py-6"
    >
      <span className="min-w-0">
        <span className="block text-[16px] font-extrabold tracking-[-0.01em] group-hover:text-[#5440e8] sm:text-[20px]">{title}</span>
        {sub ? <span className="mt-0.5 block text-[12px] text-[#66647c] sm:text-[14px]">{sub}</span> : null}
      </span>
      <span
        aria-hidden="true"
        className="inline-flex h-[34px] w-[34px] flex-none items-center justify-center rounded-full bg-[#111118] text-white transition-colors group-hover:bg-[#5440e8] sm:h-10 sm:w-10"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </span>
    </Link>
  );
}
