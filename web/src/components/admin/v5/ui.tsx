import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft, Search } from "lucide-react";

/**
 * v5 page-level building blocks for the admin panel (users and data pages).
 * Colors follow components/site/ui.tsx: ink #121226, body #4a4862, muted
 * #66647c, ground #eeecf4, primary #5440e8, lilac #e4dfff, dark #111118,
 * hairline #e2e0ea. No hooks here, so these work in server and client files
 * (the button-based ones need a client parent for their handlers).
 */

/** Explicit focus ring, matching `.lc-site :focus-visible`, so it holds outside the shell too. */
export const focusRing =
  "focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#5440e8]";

/** Small white pill button (page actions, pagination). 44px tall on phones. */
export const pillBtn = `lc-btn-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-white px-4 text-[14px] font-semibold text-[#121226] disabled:pointer-events-none disabled:opacity-45 sm:min-h-10 ${focusRing} focus-visible:rounded-full!`;

/** Inline text action inside table rows ("View"). */
export const rowLink = `inline-flex min-h-11 items-center rounded-full px-3 text-[14px] font-bold text-[#5440e8] transition-colors hover:bg-[#e4dfff] hover:text-[#3a2bb8] sm:min-h-9 ${focusRing}`;
/** Destructive inline text action inside table rows ("Delete"). */
export const rowDanger = `inline-flex min-h-11 items-center rounded-full px-3 text-[14px] font-bold text-[#c42b30] transition-colors hover:bg-[#fbe2e3] sm:min-h-9 ${focusRing}`;

/** Primary + secondary lines used inside table cells. */
export const cellMain = "text-[14px] font-semibold text-[#121226]";
export const cellText = "text-[14px] text-[#121226]";
export const cellMuted = "text-[13px] text-[#66647c]";
export const cellSub = "text-[12px] text-[#66647c]";

export function AdminPageHeader({
  title,
  description,
  actions,
  back,
  leading,
}: {
  title: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  back?: { href: string; label: string };
  /** Rendered left of the title (e.g. an avatar). */
  leading?: ReactNode;
}) {
  return (
    <div>
      {back ? (
        <Link
          href={back.href}
          className={`group inline-flex min-h-11 items-center gap-1.5 rounded-full text-[14px] font-bold text-[#5440e8] transition-colors hover:text-[#3a2bb8] sm:min-h-0 ${focusRing}`}
        >
          <ArrowLeft className="h-4 w-4 transition-transform motion-safe:group-hover:-translate-x-0.5" aria-hidden="true" />
          {back.label}
        </Link>
      ) : null}
      <div className={`${back ? "mt-2 sm:mt-3.5" : ""} flex flex-wrap items-end justify-between gap-4`}>
        <div className="flex min-w-0 items-center gap-4">
          {leading}
          <div className="min-w-0">
            <h1 className="break-words text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#121226] sm:text-[34px]">
              {title}
            </h1>
            {description ? (
              <p className="mt-1.5 max-w-[760px] text-[15px] leading-[1.5] text-[#4a4862]">{description}</p>
            ) : null}
          </div>
        </div>
        {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
      </div>
    </div>
  );
}

/** KPI tile. `featured` is the purple lead tile from the mockups. */
export function StatTile({
  label,
  value,
  hint,
  featured,
  compact,
}: {
  label: string;
  value: ReactNode;
  hint?: ReactNode;
  featured?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`min-w-0 ${compact ? "rounded-[18px] p-4" : "rounded-[22px] p-5"} ${
        featured ? "bg-[#5440e8] text-white" : "bg-white text-[#121226]"
      }`}
    >
      <p className={`${compact ? "text-[12px]" : "text-[13px]"} ${featured ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>
        {label}
      </p>
      <p
        className={`break-words font-extrabold tracking-[-0.03em] ${
          compact ? "mt-1 text-[26px] leading-[1.15]" : "mt-1.5 text-[28px] leading-[1.1] sm:text-[34px]"
        }`}
      >
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {hint ? (
        <p className={`mt-0.5 text-[12px] font-bold ${featured ? "text-[#e4dfff]" : "text-[#66647c]"}`}>{hint}</p>
      ) : null}
    </div>
  );
}

/** Pill search input with a visually hidden label. 16px text on phones (no iOS zoom). */
export function SearchField({
  id,
  label,
  className = "",
  ...props
}: Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "type"> & { id: string; label: string }) {
  return (
    <div className={`relative w-full sm:max-w-[380px] ${className}`}>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66647c]" aria-hidden="true" />
      <input
        id={id}
        type="search"
        {...props}
        className="block h-11 w-full rounded-full border-[1.5px] border-transparent bg-white pl-11 pr-4 text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#66647c] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! sm:text-[14px]"
      />
    </div>
  );
}

const chipBase = `inline-flex min-h-11 items-center rounded-full px-4 text-[13px] font-bold transition-colors sm:min-h-10 ${focusRing} focus-visible:rounded-full!`;
export function chipCls(active: boolean) {
  return `${chipBase} ${active ? "bg-[#111118] text-white" : "bg-white text-[#121226] hover:bg-[#e4dfff]"}`;
}

/** Row of filter chips; give it a label so screen readers know what the chips filter. */
export function ChipGroup({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div role="group" aria-label={label} className="flex flex-wrap gap-1.5">
      {children}
    </div>
  );
}

export function ChipButton({
  active,
  children,
  ...props
}: Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className" | "type"> & { active: boolean; children: ReactNode }) {
  return (
    <button type="button" aria-pressed={active} {...props} className={chipCls(active)}>
      {children}
    </button>
  );
}

/** Previous / next pager for client-paginated lists. */
export function Pager({
  page,
  totalPages,
  onPrev,
  onNext,
  summary,
}: {
  page: number;
  totalPages: number;
  onPrev: () => void;
  onNext: () => void;
  summary?: ReactNode;
}) {
  return (
    <nav aria-label="Pagination" className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[14px] text-[#4a4862]">
      <p>{summary}</p>
      <div className="flex items-center gap-2">
        <button type="button" onClick={onPrev} disabled={page <= 1} className={pillBtn}>
          Previous
        </button>
        <span className="px-1 tabular-nums" aria-live="polite">
          Page {page} of {totalPages}
        </span>
        <button type="button" onClick={onNext} disabled={page >= totalPages} className={pillBtn}>
          Next
        </button>
      </div>
    </nav>
  );
}

export function LoadingCard({ label = "Loading…" }: { label?: string }) {
  return (
    <div role="status" className="lc-card rounded-[24px] px-6 py-12 text-center text-[14px] text-[#4a4862]">
      {label}
    </div>
  );
}

/** Round initials avatar (lilac). */
export function Avatar({ name, email, size = "sm" }: { name?: string | null; email: string; size?: "sm" | "lg" }) {
  const words = (name ?? "").trim().split(/\s+/).filter(Boolean);
  const initials = (words.length > 0 ? words.slice(0, 2).map((w) => w[0]) : [email[0] ?? "?"]).join("").toUpperCase();
  return (
    <span
      aria-hidden="true"
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-extrabold text-[#121226] ${
        size === "lg" ? "h-16 w-16 bg-[#c9c0ff] text-[22px]" : "h-8 w-8 bg-[#e4dfff] text-[12px]"
      }`}
    >
      {initials}
    </span>
  );
}

/** Horizontal meter used in "by tool" / "top events" style lists. */
export function Meter({ pct, label }: { pct: number; label?: string }) {
  const w = Math.max(0, Math.min(100, pct));
  return (
    <div
      className="h-2.5 w-full overflow-hidden rounded-full bg-[#f1eff8]"
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <div className="h-full rounded-full bg-[#5440e8]" style={{ width: `${w}%` }} />
    </div>
  );
}

/** Class strings for small hand-written tables inside cards. Wrap them in `relative overflow-x-auto`. */
export const tableCls = "w-full border-collapse text-left text-[14px]";
export const thCls = "whitespace-nowrap px-0 py-3.5 pr-4 text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c] last:pr-0";
export const tdCls = "border-t border-[#e2e0ea] py-3 pr-4 align-middle text-[#121226] last:pr-0";
