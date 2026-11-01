"use client";

import { useEffect, useRef, type ReactNode, type SelectHTMLAttributes } from "react";
import { ChevronDown, Search, X } from "lucide-react";

/**
 * v5 building blocks for the job-search tools (tracker, companies, contacts,
 * company matcher, referrals). Colors follow components/site/ui.tsx:
 * ink #121226, body #4a4862, muted #66647c, primary #5440e8, lilac #e4dfff,
 * soft #f1eff8, hairline #e2e0ea.
 */

/** Same ring as `.lc-site :focus-visible`, repeated so it holds even outside the v5 root. */
export const focusCls =
  "focus-visible:outline-[3px] focus-visible:outline-offset-[3px] focus-visible:outline-solid focus-visible:outline-[#5440e8]";

const btnBase = `lc-btn-lift inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-full px-5 text-[15px] font-semibold motion-reduce:transition-none motion-reduce:hover:transform-none disabled:pointer-events-none disabled:opacity-50 focus-visible:rounded-full! ${focusCls}`;
export const appBtnPrimary = `${btnBase} bg-[#5440e8] text-white hover:bg-[#4430d6]`;
export const appBtnSoft = `${btnBase} bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]`;
export const appBtnWhite = `${btnBase} bg-white text-[#121226] hover:bg-[#f7f6fb]`;
export const appBtnDark = `${btnBase} bg-[#111118] text-white hover:bg-[#2a2940]`;
/** Quiet text-style action (Cancel, Delete). */
export const appBtnGhost = `inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 text-[15px] font-semibold text-[#4a4862] transition-colors hover:bg-[#f1eff8] hover:text-[#121226] motion-reduce:transition-none ${focusCls}`;
export const appBtnDanger = `inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-4 text-[15px] font-semibold text-[#c42b30] transition-colors hover:bg-[#fbe2e3] motion-reduce:transition-none ${focusCls}`;

export const labelCls = "mb-1.5 block text-[14px] font-semibold text-[#121226]";
/** Small section heading inside cards and drawers. */
export const sectionLabelCls = "text-[13px] font-bold text-[#4a4862]";

/** 48px, 16px text on phones (no iOS zoom), 15px from `sm`. */
export const fieldCls =
  "block h-12 w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white px-4 text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! disabled:opacity-60 motion-reduce:transition-none sm:text-[15px]";
export const textareaCls = `${fieldCls} h-auto min-h-[96px] py-3 leading-[1.5]`;

export function SelectField({ className = "", children, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <span className="relative block">
      <select {...props} className={`${fieldCls} appearance-none pr-10 ${className}`}>
        {children}
      </select>
      <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66647c]" aria-hidden />
    </span>
  );
}

export function PageHeader({ title, lead, actions }: { title: ReactNode; lead?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-6">
      <div className="min-w-0">
        <h1 className="text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#121226] sm:text-[36px] sm:leading-[40px]">
          {title}
        </h1>
        {lead ? <p className="mt-1 text-[14px] leading-[1.5] text-[#4a4862] sm:mt-1.5 sm:text-[16px]">{lead}</p> : null}
      </div>
      {actions ? <div className="flex w-full flex-wrap gap-2 md:w-auto md:flex-nowrap">{actions}</div> : null}
    </div>
  );
}

/** Pill search box. `label` is read by screen readers; the placeholder is only a hint. */
export function SearchField({
  value,
  onChange,
  placeholder,
  label,
  className = "",
  soft = false,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  label: string;
  className?: string;
  /** Tinted fill for use on a white card. */
  soft?: boolean;
}) {
  return (
    <label className={`relative block ${className}`}>
      <span className="sr-only">{label}</span>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#66647c]" aria-hidden />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`block h-[46px] w-full rounded-full border-[1.5px] border-transparent ${soft ? "bg-[#f7f6fb]" : "bg-white shadow-[0_1px_2px_rgba(18,18,38,0.04)]"} pl-11 pr-4 text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! motion-reduce:transition-none sm:text-[15px]`}
      />
    </label>
  );
}

/** Toggle chip for filters and stage tabs (44px tall for touch). */
export function FilterChip({
  pressed,
  onClick,
  children,
  className = "",
  soft = false,
}: {
  pressed: boolean;
  onClick: () => void;
  children: ReactNode;
  className?: string;
  /** Tinted resting fill for use on a white card. */
  soft?: boolean;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={`inline-flex min-h-11 shrink-0 items-center whitespace-nowrap rounded-full px-4 text-[14px] font-semibold transition-colors motion-reduce:transition-none focus-visible:rounded-full! ${focusCls} ${
        pressed ? "bg-[#111118] text-white" : `${soft ? "bg-[#f1eff8]" : "bg-white"} text-[#121226] hover:bg-[#e4dfff]`
      } ${className}`}
    >
      {children}
    </button>
  );
}

const TILE_TONES = ["bg-[#e4dfff]", "bg-[#c9c0ff]", "bg-[#dcf5ea]", "bg-[#fdf0d5]", "bg-[#ffd9c4]"] as const;

/** Letter tile used in place of a logo. Decorative: the name is always printed next to it. */
export function InitialTile({
  name,
  size = 34,
  tone,
  className = "",
}: {
  name: string;
  size?: 32 | 34 | 36;
  /** Fixed background; omit to pick one from the name. */
  tone?: string;
  className?: string;
}) {
  const letter = (name.trim()[0] ?? "?").toUpperCase();
  let h = 0;
  for (const ch of name) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const bg = tone ?? TILE_TONES[h % TILE_TONES.length];
  const dim = size === 32 ? "h-8 w-8 text-[13px]" : size === 36 ? "h-9 w-9 text-[15px]" : "h-[34px] w-[34px] text-[14px]";
  return (
    <span aria-hidden="true" className={`inline-flex shrink-0 items-center justify-center rounded-[10px] font-extrabold text-[#3a2bb8] ${dim} ${bg} ${className}`}>
      {letter}
    </span>
  );
}

export function EmptyState({
  icon,
  title,
  children,
  actions,
}: {
  icon: ReactNode;
  title: string;
  children?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center rounded-[28px] border-2 border-dashed border-[#c9c0ff] px-5 py-12 text-center sm:rounded-[32px] sm:px-10 sm:py-[70px]">
      <span aria-hidden="true" className="inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#5440e8] text-white sm:h-[72px] sm:w-[72px] sm:rounded-[22px]">
        {icon}
      </span>
      <h2 className="mt-5 text-[24px] font-extrabold tracking-[-0.02em] text-[#121226] sm:text-[28px]">{title}</h2>
      {children ? <div className="mt-2 max-w-[460px] text-[15px] leading-[1.6] text-[#4a4862] sm:text-[16px]">{children}</div> : null}
      {actions ? <div className="mt-6 flex flex-wrap justify-center gap-2.5">{actions}</div> : null}
    </div>
  );
}

export function ErrorNote({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <p role="alert" className={`rounded-2xl bg-[#fbe2e3] px-4 py-3 text-[14px] leading-[1.5] text-[#a3222a] ${className}`}>
      {children}
    </p>
  );
}

export function CloseButton({ onClick, label = "Close" }: { onClick: () => void; label?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1eff8] text-[#121226] transition-colors hover:bg-[#e4dfff] motion-reduce:transition-none focus-visible:rounded-full! ${focusCls}`}
    >
      <X className="h-5 w-5" aria-hidden />
    </button>
  );
}

/** Dimmed ground behind drawers and dialogs (the page shows through, like the mockup). */
export const overlayCls = "absolute inset-0 bg-[#eeecf4]/70 backdrop-blur-[1px]";

/** Right-hand sheet: full width on phones, 440px from `sm`. */
export const drawerPanelCls =
  "relative flex h-full w-full flex-col bg-white text-[#121226] shadow-[-24px_0_48px_-24px_rgba(18,18,38,0.3)] sm:max-w-[440px]";

/** Moves focus into a drawer/dialog when it opens and back to the trigger when it closes. */
export function useDialogFocus<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    const el = ref.current;
    if (el && !el.contains(document.activeElement)) {
      const first = el.querySelector<HTMLElement>("[autofocus], input, textarea, select, button");
      (first ?? el).focus();
    }
    return () => prev?.focus?.();
  }, []);
  return ref;
}
