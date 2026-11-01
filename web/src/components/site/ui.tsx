import type { ReactNode } from "react";
import Link from "next/link";

/**
 * Shared building blocks for v5 marketing pages (see app/page.tsx for the
 * reference implementation). Colors: ink #121226, body #4a4862, muted #66647c /
 * #7c7a94, ground #eeecf4, primary #5440e8 (hover #4430d6), lilac #e4dfff /
 * #c9c0ff, dark #111118, orange accent #ff7a33, green #0b7a4f / #dcf5ea,
 * red #c42b30 / #fbe2e3, amber #a15c00 / #fdf0d5, hairline #e2e0ea.
 */

export const container = "mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-10";

export const btn =
  "lc-btn-lift inline-flex items-center justify-center gap-2 rounded-full px-[26px] py-[17px] text-[16px] font-semibold";
export const btnPrimary = `${btn} bg-[#5440e8] text-white hover:bg-[#4430d6]`;
export const btnWhite = `${btn} bg-white text-[#121226]`;
export const btnDark = `${btn} bg-[#111118] text-white hover:bg-[#2a2940]`;
export const btnSoft = `${btn} bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]`;

/** "/ Section" label above an H2. */
export const labelCls = "text-[18px] font-semibold tracking-[-0.01em] text-[#5440e8] sm:text-[20px]";

/** Section top spacing between major blocks. */
export const sectionGap = "pt-24 lg:pt-[140px]";

export function SectionHead({
  label,
  title,
  muted,
  lead,
  center,
  as: H = "h2",
  className = "",
}: {
  label?: string;
  title: ReactNode;
  /** Second half of the heading, shown in grey. */
  muted?: ReactNode;
  lead?: ReactNode;
  center?: boolean;
  as?: "h1" | "h2";
  className?: string;
}) {
  return (
    <div className={`${center ? "mx-auto max-w-[980px] text-center" : "max-w-[820px]"} ${className}`}>
      {label ? <p className={labelCls}>/ {label}</p> : null}
      <H
        className={
          H === "h1"
            ? `${label ? "mt-4" : ""} text-[40px] font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-[56px] lg:text-[64px]`
            : `lc-h2 ${label ? "mt-5" : ""}`
        }
      >
        {title} {muted ? <span className="text-[#7c7a94]">{muted}</span> : null}
      </H>
      {lead ? (
        <p className={`mt-5 text-[17px] leading-7 text-[#4a4862] sm:text-[18px] ${center ? "mx-auto max-w-[640px]" : "max-w-[640px]"}`}>{lead}</p>
      ) : null}
    </div>
  );
}

/** Visible breadcrumb trail (pair it with BreadcrumbList JSON-LD on the page). */
export function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[14px] text-[#66647c]">
      <ol className="flex flex-wrap items-center gap-1.5">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1.5">
            {i > 0 ? <span aria-hidden="true">/</span> : null}
            {it.href ? (
              <Link href={it.href} className="lc-link hover:text-[#5440e8]">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-[#121226]">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

/** Small rounded tag / chip. */
export function Chip({ children, tone = "soft" }: { children: ReactNode; tone?: "soft" | "green" | "red" | "amber" | "dark" | "lilac" }) {
  const t = {
    soft: "bg-[#f1eff8] text-[#121226]",
    green: "bg-[#dcf5ea] text-[#0b7a4f]",
    red: "bg-[#fbe2e3] text-[#c42b30]",
    amber: "bg-[#fdf0d5] text-[#a15c00]",
    dark: "bg-[#111118] text-white",
    lilac: "bg-[#e4dfff] text-[#3a2bb8]",
  }[tone];
  return <span className={`inline-block rounded-full px-2.5 py-[5px] text-[12px] font-bold ${t}`}>{children}</span>;
}
