import type { ReactNode } from "react";
import { EmptyState } from "./empty-state";
import { Inbox } from "lucide-react";

export type DataTableColumn<T> = {
  key: string;
  header: string;
  /** Right-aligned numeric column */
  align?: "left" | "right";
  /** Max width (Tailwind class, e.g. "max-w-[200px]") for truncation */
  truncate?: string;
  render: (row: T) => ReactNode;
};

export type DataTableProps<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  /** Optional href factory for clickable rows. */
  rowHref?: (row: T) => string | null;
  emptyTitle?: string;
  emptyDescription?: string;
  emptyAction?: ReactNode;
};

export function DataTable<T>({
  columns,
  rows,
  rowKey,
  rowHref,
  emptyTitle = "Nothing here yet",
  emptyDescription,
  emptyAction,
}: DataTableProps<T>) {
  if (rows.length === 0) {
    return <EmptyState icon={Inbox} title={emptyTitle} description={emptyDescription} action={emptyAction} />;
  }

  return (
    <div className="lc-card min-w-0 overflow-hidden rounded-[24px]">
      {/* Wide tables scroll inside the card, never the page. */}
      <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Table">
        <table className="w-full border-collapse text-[14px]">
          <thead>
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`whitespace-nowrap px-3 py-3.5 text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c] first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6 ${
                    col.align === "right" ? "text-right" : "text-left"
                  }`}
                >
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => {
              const href = rowHref ? rowHref(row) : null;
              return (
                <tr
                  key={rowKey(row)}
                  className={`border-t border-[#e2e0ea] transition-colors ${href ? "cursor-pointer hover:bg-[#f7f6fb]" : ""}`}
                  onClick={
                    href
                      ? () => {
                          if (typeof window !== "undefined") window.location.href = href;
                        }
                      : undefined
                  }
                >
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      className={`px-3 py-3.5 align-middle text-[#121226] first:pl-5 last:pr-5 sm:first:pl-6 sm:last:pr-6 ${
                        col.align === "right" ? "text-right tabular-nums" : ""
                      } ${col.truncate ? `${col.truncate} truncate` : ""}`}
                    >
                      {col.render(row)}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/** Standard pagination footer (server-rendered via query string). */
export function Pagination({
  page,
  pageSize,
  total,
  baseQuery,
}: {
  page: number;
  pageSize: number;
  total: number;
  /** Full URL including ?key=value pairs but WITHOUT &page= (we append it). */
  baseQuery: string;
}) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const sep = baseQuery.includes("?") ? "&" : "?";
  const prevHref = page > 1 ? `${baseQuery}${sep}page=${page - 1}` : null;
  const nextHref = page < totalPages ? `${baseQuery}${sep}page=${page + 1}` : null;
  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);

  const btn = (enabled: boolean) =>
    `inline-flex min-h-[44px] items-center rounded-full px-4 text-[13px] font-bold transition sm:min-h-[38px] ${
      enabled ? "bg-white text-[#121226] ring-1 ring-inset ring-[#e2e0ea] hover:bg-[#f1eff8]" : "pointer-events-none bg-transparent text-[#9d9bb3] ring-1 ring-inset ring-[#e2e0ea]"
    }`;

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[13px] text-[#4a4862]">
      <p>
        Showing <span className="font-bold text-[#121226]">{start}–{end}</span> of{" "}
        <span className="font-bold text-[#121226]">{total.toLocaleString()}</span>
      </p>
      <div className="flex items-center gap-2">
        <a href={prevHref ?? undefined} aria-disabled={!prevHref} className={btn(!!prevHref)}>
          Previous
        </a>
        <a href={nextHref ?? undefined} aria-disabled={!nextHref} className={btn(!!nextHref)}>
          Next
        </a>
      </div>
    </div>
  );
}
