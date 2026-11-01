import Link from "next/link";
import type { ReactNode, SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";

/**
 * v5 building blocks for the signed-in account area (settings, billing, email
 * templates, help, ATS report). Colors follow components/site/ui.tsx.
 */

export const pageTitleCls = "text-[28px] font-extrabold leading-[32px] tracking-[-0.03em] text-[#121226] sm:text-[36px] sm:leading-[40px]";
export const pageLeadCls = "mt-1.5 text-[15px] leading-[22px] text-[#4a4862] sm:text-[16px]";

export const cardCls = "lc-card rounded-[24px] p-5 sm:rounded-[26px] sm:p-[26px]";
export const cardTitleCls = "text-[20px] font-extrabold tracking-[-0.01em] text-[#121226]";
export const cardLeadCls = "mt-1 text-[14px] leading-[21px] text-[#4a4862]";

export const fieldLabelCls = "block text-[13px] font-bold text-[#4a4862]";

/** 48px tall, 16px text on phones (no iOS zoom). The v5 focus outline is swapped for a border + ring. */
const fieldBase =
  "block w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! focus-visible:rounded-[14px]! disabled:opacity-60 sm:text-[15px] motion-reduce:transition-none";
export const inputCls = `${fieldBase} h-12 px-4`;
export const textareaCls = `${fieldBase} min-h-[96px] px-4 py-3 leading-[23px]`;

const btnBase =
  "lc-btn-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold focus-visible:rounded-full! disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:transform-none";
export const btnSmDark = `${btnBase} bg-[#111118] text-white hover:bg-[#2a2940]`;
export const btnSmPrimary = `${btnBase} bg-[#5440e8] text-white hover:bg-[#4430d6]`;
export const btnSmSoft = `${btnBase} bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]`;
export const btnSmWhite = `${btnBase} bg-white text-[#121226] hover:bg-[#f1eff8] focus-visible:outline-white!`;
export const btnSmDangerSoft = `${btnBase} bg-[#fbe2e3] text-[#a3262b] hover:bg-[#f7cfd1]`;
export const btnSmDanger = `${btnBase} bg-[#c42b30] text-white hover:bg-[#a3262b]`;
/** Full-size (54px) primary button. */
export const btnLgPrimary =
  "lc-btn-lift inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[#5440e8] px-[26px] py-3.5 text-[16px] font-semibold text-white hover:bg-[#4430d6] focus-visible:rounded-full! disabled:pointer-events-none disabled:opacity-60 motion-reduce:transition-none motion-reduce:hover:transform-none";

export const inlineLinkCls = "lc-link font-semibold text-[#5440e8] transition-colors hover:text-[#3a2bb8]";

export function PageHeader({ title, lead, actions }: { title: ReactNode; lead?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-6">
      <div className="min-w-0">
        <h1 className={pageTitleCls}>{title}</h1>
        {lead ? <p className={pageLeadCls}>{lead}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

/** Pill segmented control used as links (Settings) or tabs (Email templates). */
export const segWrapCls = "flex w-max gap-1 rounded-full bg-white p-1";
export function segItemCls(active: boolean) {
  return `inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-3.5 text-[14px] font-bold transition-colors focus-visible:rounded-full! focus-visible:outline-offset-0! sm:px-[18px] motion-reduce:transition-none ${
    active ? "bg-[#111118] text-white" : "text-[#4a4862] hover:bg-[#f1eff8] hover:text-[#121226]"
  }`;
}

const SETTINGS_TABS = [
  { href: "/dashboard/settings", label: "Profile" },
  { href: "/dashboard/settings/subscription", label: "Plan & billing" },
  { href: "/dashboard/settings/email-templates", label: "Email templates" },
] as const;

export function SettingsTabs({ current }: { current: "/dashboard/settings" | "/dashboard/settings/subscription" }) {
  return (
    <nav aria-label="Settings sections" className="relative mt-5 max-w-full overflow-x-auto sm:mt-[22px]">
      <div className={segWrapCls}>
        {SETTINGS_TABS.map((t) => (
          <Link key={t.href} href={t.href} aria-current={t.href === current ? "page" : undefined} className={segItemCls(t.href === current)}>
            {t.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export function Badge({ children, tone = "lilac", className = "" }: { children: ReactNode; tone?: "green" | "red" | "amber" | "lilac" | "primary" | "soft"; className?: string }) {
  const t = {
    green: "bg-[#dcf5ea] text-[#0b4f35]",
    red: "bg-[#fbe2e3] text-[#a3262b]",
    amber: "bg-[#fdf0d5] text-[#7a4600]",
    lilac: "bg-[#e4dfff] text-[#3a2bb8]",
    primary: "bg-[#5440e8] text-white",
    soft: "bg-[#f1eff8] text-[#121226]",
  }[tone];
  return <span className={`inline-block shrink-0 rounded-full px-2.5 py-[5px] text-[12px] font-bold leading-none ${t} ${className}`}>{children}</span>;
}

/** Status line under a form (success or error). */
export function FormStatus({ msg }: { msg: { ok: boolean; text: string } | null }) {
  if (!msg) return null;
  return (
    <p role={msg.ok ? "status" : "alert"} className={`text-[14px] font-semibold ${msg.ok ? "text-[#0b7a4f]" : "text-[#a3262b]"}`}>
      {msg.text}
    </p>
  );
}

/** Native select with the v5 field look. */
export function SelectField({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={`relative ${className}`}>
      <select {...props} className={`${inputCls} appearance-none pr-11`}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66647c]" aria-hidden />
    </div>
  );
}

/** One usage meter: label, used/limit and a thin bar (amber from 80%, red when used up). */
export function UsageMeter({ label, used, limit }: { label: string; used: number; limit: number }) {
  const pct = limit > 0 ? Math.min(100, Math.round((used / limit) * 100)) : 0;
  const color = pct >= 100 ? "#c42b30" : pct >= 80 ? "#f2a91f" : "#5440e8";
  return (
    <div>
      <div className="flex justify-between gap-3 text-[13px] text-[#4a4862]">
        <span>{label}</span>
        <span className="font-semibold tabular-nums text-[#121226]">
          {used.toLocaleString("en-US")}/{limit.toLocaleString("en-US")}
        </span>
      </div>
      <div aria-hidden="true" className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#efedf7]">
        <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}
