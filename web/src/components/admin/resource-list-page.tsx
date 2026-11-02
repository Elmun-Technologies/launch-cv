import type { ReactNode } from "react";
import Link from "next/link";
import { Plus, Search } from "lucide-react";
import { adminBtnPrimary, adminH1, adminLead } from "./admin-ui";

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
    <div className="mx-auto max-w-[1280px] space-y-5">
      {/* Page header */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className={adminH1}>{title}</h1>
          {description ? <p className={adminLead}>{description}</p> : null}
        </div>
        {primaryAction ? (
          <Link href={primaryAction.href} className={adminBtnPrimary}>
            <Plus className="h-4 w-4" aria-hidden />
            {primaryAction.label}
          </Link>
        ) : null}
      </div>

      {intro ? <div>{intro}</div> : null}

      {/* Search + filters bar */}
      {(searchValue !== undefined || filters) && (
        <div className="flex flex-wrap items-center gap-2.5">
          {searchValue !== undefined ? (
            <form role="search" className="relative w-full min-w-0 sm:w-auto sm:min-w-[260px] sm:max-w-[420px] sm:flex-1">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#66647c]" aria-hidden />
              <input
                type="search"
                name="q"
                aria-label={searchPlaceholder.replace(/…$/, "") || "Search"}
                defaultValue={searchValue}
                placeholder={searchPlaceholder}
                className="block h-11 w-full rounded-full border-[1.5px] border-transparent bg-white pl-11 pr-4 text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! sm:text-[14px]"
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
