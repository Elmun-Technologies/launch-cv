import type { ReactNode } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";

export type ResourceListPageProps = {
  title: string;
  description?: string;
  /** Inline content rendered right under the page header (above table) — KPIs, callouts. */
  intro?: ReactNode;
  /** Search box: when present, renders a GET form with input name="q". */
  searchValue?: string;
  searchPlaceholder?: string;
  /** Filter chips row (status filters etc.). Optional. */
  filters?: ReactNode;
  /** Primary action — usually a "New X" button. */
  primaryAction?: { href: string; label: string };
  children: ReactNode;
};

export function ResourceListPage({
  title,
  description,
  intro,
  searchValue,
  searchPlaceholder = "Search…",
  filters,
  primaryAction,
  children,
}: ResourceListPageProps) {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">{title}</h1>
          {description ? (
            <p className="mt-1 max-w-[640px] text-[13px] leading-[1.6] text-[#64748B]">
              {description}
            </p>
          ) : null}
        </div>
        {primaryAction ? (
          <Link
            href={primaryAction.href}
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#0F172A] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1E293B]"
          >
            <Plus className="h-4 w-4" />
            {primaryAction.label}
          </Link>
        ) : null}
      </div>

      {intro ? <div>{intro}</div> : null}

      {/* Search + filters bar */}
      {(searchValue !== undefined || filters) && (
        <div className="flex flex-wrap items-center gap-3">
          {searchValue !== undefined ? (
            <form className="relative flex-1 min-w-[220px] max-w-[360px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#94A3B8]" />
              <input
                type="search"
                name="q"
                defaultValue={searchValue}
                placeholder={searchPlaceholder}
                className="block w-full rounded-lg border border-[#E2E8F0] bg-white py-2 pl-9 pr-3 text-[13px] text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/15"
              />
            </form>
          ) : null}
          {filters}
        </div>
      )}

      {children}
    </div>
  );
}
