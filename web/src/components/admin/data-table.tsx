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
    <div className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead className="bg-[#FAFBFC]">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`whitespace-nowrap border-b border-[#E2E8F0] px-4 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-[#475569] ${
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
                  className={`border-b border-[#E2E8F0] last:border-b-0 ${
                    href ? "cursor-pointer hover:bg-[#FAFBFC]" : ""
                  }`}
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
                      className={`px-4 py-3 text-[#0F172A] ${col.align === "right" ? "text-right" : ""} ${
                        col.truncate ? `${col.truncate} truncate` : ""
                      }`}
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

  return (
    <div className="mt-4 flex items-center justify-between text-[12px] text-[#64748B]">
      <p>
        Showing <span className="font-semibold text-[#0F172A]">{start}–{end}</span> of{" "}
        <span className="font-semibold text-[#0F172A]">{total.toLocaleString()}</span>
      </p>
      <div className="flex items-center gap-1">
        <a
          href={prevHref ?? undefined}
          aria-disabled={!prevHref}
          className={`rounded-md border border-[#E2E8F0] bg-white px-3 py-1 font-semibold transition ${
            prevHref
              ? "text-[#0F172A] hover:bg-[#FAFBFC]"
              : "pointer-events-none text-[#CBD5E1]"
          }`}
        >
          Previous
        </a>
        <a
          href={nextHref ?? undefined}
          aria-disabled={!nextHref}
          className={`rounded-md border border-[#E2E8F0] bg-white px-3 py-1 font-semibold transition ${
            nextHref
              ? "text-[#0F172A] hover:bg-[#FAFBFC]"
              : "pointer-events-none text-[#CBD5E1]"
          }`}
        >
          Next
        </a>
      </div>
    </div>
  );
}
