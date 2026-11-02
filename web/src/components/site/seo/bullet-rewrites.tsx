import Link from "next/link";

export type BulletRewrite = { slug: string; role: string; skill: string; weak: string; strong: string };

/**
 * Before/after resume bullets taken from the site's resume examples. The
 * strike-through and tick are backed by screen-reader text, so the meaning
 * doesn't rest on color or decoration alone.
 */
export function BulletRewrites({ items, className = "" }: { items: BulletRewrite[]; className?: string }) {
  return (
    <ul className={`mt-7 flex flex-col gap-2.5 sm:gap-3 ${className}`}>
      {items.map((b) => (
        <li key={`${b.slug}-${b.skill}`} className="lc-card flex flex-col rounded-[22px] p-[18px] sm:rounded-3xl sm:p-6">
          <p className="text-[12px] font-bold uppercase leading-5 tracking-[0.06em] text-[#66647c]">
            <Link href={`/resume-examples/${b.slug}`} className="lc-link hover:text-[#5440e8]">
              {b.role}
            </Link>{" "}
            · {b.skill}
          </p>
          <p className="mt-2.5 text-[15px] leading-[23px] text-[#66647c] line-through decoration-[#c42b30]">
            <span className="sr-only">Instead of: </span>
            {b.weak}
          </p>
          <p className="mt-1.5 text-[16px] font-semibold leading-6 text-[#121226]">
            <span className="text-[#0b7a4f]" aria-hidden="true">
              ✓
            </span>{" "}
            <span className="sr-only">Write: </span>
            {b.strong}
          </p>
        </li>
      ))}
    </ul>
  );
}
