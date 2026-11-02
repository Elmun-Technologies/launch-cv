import type { ReactNode } from "react";

export type SectionCardProps = {
  title?: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  /** Disable internal padding for tables/lists that style their own edges. */
  flush?: boolean;
};

/**
 * v5 white card (24px radius, soft shadow) that groups content on admin pages.
 * Pairs with DataTable (use flush=true when a table or list is the only child —
 * the content then starts under a hairline and runs edge to edge).
 */
export function SectionCard({ title, description, action, children, flush }: SectionCardProps) {
  const hasHeader = !!(title || action);
  return (
    <section className="lc-card min-w-0 overflow-hidden rounded-[24px]">
      {hasHeader && (
        <header className={`flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-5 pt-5 sm:px-6 sm:pt-6 ${flush ? "pb-4" : "pb-1"}`}>
          <div className="min-w-0">
            {title ? <h2 className="text-[18px] font-extrabold tracking-[-0.01em] text-[#121226]">{title}</h2> : null}
            {description ? <p className="mt-1 text-[13px] leading-[1.5] text-[#66647c]">{description}</p> : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      )}
      <div className={flush ? (hasHeader ? "border-t border-[#e2e0ea]" : "") : hasHeader ? "px-5 pb-5 pt-4 sm:px-6 sm:pb-6" : "p-5 sm:p-6"}>
        {children}
      </div>
    </section>
  );
}
