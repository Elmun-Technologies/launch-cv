import type { ReactNode } from "react";
import Link from "next/link";
import { AlertCircle, ArrowLeft, CheckCircle2, ChevronDown, Plus } from "lucide-react";

/**
 * v5 building blocks for the admin CMS screens (blog, testimonials, FAQs,
 * page copy, media). Colors follow components/site/ui.tsx: ink #121226,
 * body #4a4862, muted #66647c, primary #5440e8, hairline #e2e0ea.
 *
 * Every button and link here has a 44px hit area and an explicit focus ring,
 * so they stay accessible with or without the `lc-site` wrapper.
 */

const focusRing =
  "focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-offset-2 focus-visible:outline-[#5440e8]";

const btnBase = `lc-btn-lift inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[14px] font-semibold ${focusRing} focus-visible:rounded-full! disabled:pointer-events-none disabled:opacity-55`;

export const cmsBtnPrimary = `${btnBase} bg-[#5440e8] text-white hover:bg-[#4430d6]`;
export const cmsBtnWhite = `${btnBase} bg-white text-[#121226] shadow-[0_1px_2px_rgba(18,18,38,0.06)] hover:bg-[#f7f6fb]`;
export const cmsBtnSoft = `${btnBase} bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]`;
export const cmsBtnDark = `${btnBase} bg-[#111118] text-white hover:bg-[#2a2940]`;
export const cmsBtnDanger = `${btnBase} bg-[#fbe2e3] text-[#a3222a] hover:bg-[#f7cfd1]`;

/** Text-style action ("Edit") with a 44px hit area. */
export const cmsTextLinkCls = `inline-flex min-h-11 items-center rounded-lg px-1 text-[14px] font-bold text-[#5440e8] transition-colors hover:text-[#3a2bb8] ${focusRing}`;

/* ── Form controls ─────────────────────────────────────────────────── */

const controlBase =
  "block w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! disabled:bg-[#f7f6fb] disabled:text-[#66647c] sm:text-[15px]";

export const cmsInputCls = `${controlBase} h-12 px-4`;
export const cmsTextareaCls = `${controlBase} px-4 py-3 leading-6`;
export const cmsSelectCls = `${controlBase} h-12 appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2216%22%20height%3D%2216%22%20fill%3D%22none%22%20stroke%3D%22%2366647c%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20viewBox%3D%220%200%2024%2024%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[right_14px_center] bg-no-repeat pl-4 pr-10`;

export type CounterTone = "ok" | "warn" | "muted";

/** Character count shown to the right of a label. */
export function charCounterTone(len: number, { min = 1, max }: { min?: number; max: number }): CounterTone {
  if (len === 0) return "muted";
  return len >= min && len <= max ? "ok" : "warn";
}

const COUNTER_TONE: Record<CounterTone, string> = {
  ok: "text-[#0b7a4f]",
  warn: "text-[#a15c00]",
  muted: "text-[#66647c]",
};

/**
 * Labelled field. The label wraps the control, so every input is named.
 * `counter` sits on the right of the label row; `hint` goes below the control.
 */
export function CmsField({
  label,
  required,
  counter,
  counterTone = "muted",
  hint,
  error,
  children,
  className = "",
  group,
}: {
  /** Render a labelled group (div) instead of a <label> — for composite controls such as image pickers. */
  group?: { id: string };
  label: ReactNode;
  required?: boolean;
  counter?: ReactNode;
  counterTone?: CounterTone;
  hint?: ReactNode;
  error?: string | null;
  children: ReactNode;
  className?: string;
}) {
  const Wrap = group ? "div" : "label";
  return (
    <Wrap
      className={`block ${className}`}
      {...(group ? { role: "group", "aria-labelledby": group.id } : {})}
    >
      <span className="flex items-baseline justify-between gap-3 text-[13px] font-bold text-[#4a4862]">
        <span id={group?.id}>
          {label}
          {required ? (
            <>
              <span aria-hidden="true" className="ml-0.5 text-[#c42b30]">
                *
              </span>
              <span className="sr-only"> (required)</span>
            </>
          ) : null}
        </span>
        {counter !== undefined ? (
          <span className={`shrink-0 text-[12px] font-semibold tabular-nums ${COUNTER_TONE[counterTone]}`}>{counter}</span>
        ) : null}
      </span>
      <span className="mt-1.5 block">{children}</span>
      {hint ? <span className="mt-1.5 block text-[12px] leading-[18px] text-[#66647c]">{hint}</span> : null}
      {error ? <span className="mt-1.5 block text-[13px] font-semibold text-[#a3222a]">{error}</span> : null}
    </Wrap>
  );
}

/* ── Layout ────────────────────────────────────────────────────────── */

/** White v5 card. Pass `title` for a 16px section heading. */
export function CmsCard({
  title,
  description,
  action,
  children,
  className = "",
  padding = "p-5 sm:p-[22px]",
}: {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  padding?: string;
}) {
  return (
    <section className={`lc-card min-w-0 rounded-[24px] ${padding} ${className}`}>
      {title || action ? (
        <div className="mb-3.5 flex items-start justify-between gap-3">
          <div className="min-w-0">
            {title ? <h2 className="text-[16px] font-extrabold tracking-[-0.01em] text-[#121226]">{title}</h2> : null}
            {description ? <p className="mt-1 text-[13px] leading-5 text-[#66647c]">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

/**
 * Collapsible sidebar card (native <details>, so it works without JS and the
 * summary is a real disclosure button for keyboards and screen readers).
 * `meta` is a short state shown next to the title while closed or open.
 */
export function CmsDisclosure({
  title,
  meta,
  defaultOpen = false,
  children,
}: {
  title: string;
  meta?: ReactNode;
  defaultOpen?: boolean;
  children: ReactNode;
}) {
  return (
    <details open={defaultOpen} className="lc-card group min-w-0 rounded-[24px]">
      <summary
        className={`flex min-h-14 cursor-pointer list-none items-center justify-between gap-3 rounded-[24px] px-5 py-3 sm:px-[22px] [&::-webkit-details-marker]:hidden ${focusRing} focus-visible:outline-offset-[-3px]`}
      >
        <h2 className="text-[16px] font-extrabold tracking-[-0.01em] text-[#121226]">{title}</h2>
        <span className="flex min-w-0 items-center gap-2">
          {meta ? <span className="truncate text-[12px] font-semibold text-[#66647c]">{meta}</span> : null}
          <ChevronDown
            className="h-4 w-4 shrink-0 text-[#66647c] transition-transform group-open:rotate-180 motion-reduce:transition-none"
            aria-hidden="true"
          />
        </span>
      </summary>
      <div className="px-5 pb-5 sm:px-[22px] sm:pb-[22px]">{children}</div>
    </details>
  );
}

/** List-page header: 34px H1, one-line lead and a primary action. */
export function CmsPageHeader({
  title,
  description,
  action,
  actions,
}: {
  title: ReactNode;
  description?: ReactNode;
  action?: { href: string; label: string };
  /** Custom action area (e.g. a client-side upload button) instead of a link. */
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-[#121226] sm:text-[34px]">{title}</h1>
        {description ? <p className="mt-1.5 max-w-[680px] text-[15px] leading-[22px] text-[#4a4862]">{description}</p> : null}
      </div>
      {action ? (
        <Link href={action.href} className={`${cmsBtnPrimary} shrink-0 self-start px-5 sm:self-auto`}>
          <Plus className="h-4 w-4" strokeWidth={2.2} aria-hidden="true" />
          {action.label}
        </Link>
      ) : null}
      {actions ? <div className="shrink-0">{actions}</div> : null}
    </div>
  );
}

/** "← Blog posts" style back link above an editor. */
export function CmsBackLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={`group -ml-1 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-1 text-[14px] font-bold text-[#5440e8] transition-colors hover:text-[#3a2bb8] ${focusRing}`}
    >
      <ArrowLeft className="h-3.5 w-3.5 transition-transform motion-safe:group-hover:-translate-x-0.5" aria-hidden="true" />
      {children}
    </Link>
  );
}

/** Editor header: back link, H1 + status badge, and the action buttons. */
export function CmsEditorHeader({
  back,
  title,
  meta,
  actions,
}: {
  back: { href: string; label: string };
  title: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
}) {
  return (
    <div>
      <CmsBackLink href={back.href}>{back.label}</CmsBackLink>
      <div className="mt-1 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1.5">
          <h1 className="min-w-0 text-[24px] font-extrabold leading-[1.15] tracking-[-0.02em] text-[#121226] [overflow-wrap:anywhere] sm:text-[28px]">
            {title}
          </h1>
          {meta}
        </div>
        {actions ? <div className="flex flex-wrap gap-2 sm:shrink-0">{actions}</div> : null}
      </div>
    </div>
  );
}

/* ── Status ────────────────────────────────────────────────────────── */

export type CmsTone = "green" | "amber" | "lilac" | "soft" | "red";

const TONE: Record<CmsTone, string> = {
  green: "bg-[#dcf5ea] text-[#0b4f35]",
  amber: "bg-[#fdf0d5] text-[#7a4600]",
  lilac: "bg-[#e4dfff] text-[#3a2bb8]",
  soft: "bg-[#f1eff8] text-[#4a4862]",
  red: "bg-[#fbe2e3] text-[#a3222a]",
};

export function CmsBadge({ tone = "soft", children }: { tone?: CmsTone; children: ReactNode }) {
  return (
    <span className={`inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-[5px] text-[12px] font-bold leading-none ${TONE[tone]}`}>
      {children}
    </span>
  );
}

/** Blog post status → badge tone + label. */
export function blogStatusBadge(status: string): { tone: CmsTone; label: string } {
  switch (status) {
    case "published":
      return { tone: "green", label: "Published" };
    case "scheduled":
      return { tone: "lilac", label: "Scheduled" };
    case "archived":
      return { tone: "soft", label: "Archived" };
    case "draft":
      return { tone: "amber", label: "Draft" };
    default:
      return { tone: "soft", label: status.charAt(0).toUpperCase() + status.slice(1) };
  }
}

/** Published / Hidden badge for testimonials and FAQs. */
export function VisibilityBadge({ published }: { published: boolean }) {
  return published ? <CmsBadge tone="green">Published</CmsBadge> : <CmsBadge tone="soft">Hidden</CmsBadge>;
}

/* ── Notices & empty states ────────────────────────────────────────── */

export function CmsNotice({ tone, children }: { tone: "error" | "success"; children: ReactNode }) {
  const err = tone === "error";
  const Icon = err ? AlertCircle : CheckCircle2;
  return (
    <div
      role={err ? "alert" : "status"}
      className={`flex items-start gap-3 rounded-2xl px-4 py-3.5 text-[14px] leading-[21px] ${
        err ? "bg-[#fbe2e3] text-[#a3222a]" : "bg-[#dcf5ea] text-[#08603e]"
      }`}
    >
      <Icon className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden="true" />
      <div className="min-w-0 [overflow-wrap:anywhere]">{children}</div>
    </div>
  );
}

export function CmsEmpty({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="px-2 py-12 text-center">
      <p className="text-[17px] font-extrabold text-[#121226]">{title}</p>
      {description ? <p className="mx-auto mt-1.5 max-w-[440px] text-[14px] leading-[21px] text-[#4a4862]">{description}</p> : null}
      {action ? <div className="mt-5 flex justify-center">{action}</div> : null}
    </div>
  );
}

/* ── Filter chips ──────────────────────────────────────────────────── */

export function CmsFilterChips({
  label,
  items,
}: {
  label: string;
  items: { href: string; label: ReactNode; active: boolean }[];
}) {
  return (
    <nav aria-label={label} className="-mx-1 overflow-x-auto px-1 py-1">
      <ul className="flex w-max gap-1.5">
        {items.map((it, i) => (
          <li key={i}>
            <Link
              href={it.href}
              aria-current={it.active ? "page" : undefined}
              className={`inline-flex min-h-11 items-center whitespace-nowrap rounded-full px-4 text-[13px] font-bold transition-colors ${focusRing} focus-visible:rounded-full! ${
                it.active ? "bg-[#111118] text-white" : "bg-white text-[#121226] hover:bg-[#e4dfff]"
              }`}
            >
              {it.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Pill-shaped GET search form (input name="q"). */
export function CmsSearch({ value, placeholder, label, hidden }: { value: string; placeholder: string; label: string; hidden?: Record<string, string> }) {
  return (
    <form role="search" className="w-full sm:w-[380px]">
      {hidden
        ? Object.entries(hidden).map(([k, v]) => <input key={k} type="hidden" name={k} value={v} />)
        : null}
      <label className="relative block">
        <span className="sr-only">{label}</span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66647c]"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" />
        </svg>
        <input
          type="search"
          name="q"
          defaultValue={value}
          placeholder={placeholder}
          className="block h-11 w-full rounded-full border-[1.5px] border-transparent bg-white pl-11 pr-4 text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! sm:text-[14px]"
        />
      </label>
    </form>
  );
}

export const cmsDateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });
