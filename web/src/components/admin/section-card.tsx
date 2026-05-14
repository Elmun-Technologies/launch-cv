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
 * Light SaaS section card — used to group content inside admin pages.
 * Pairs nicely with DataTable (use flush=true when the table is the only child).
 */
export function SectionCard({ title, description, action, children, flush }: SectionCardProps) {
  return (
    <section className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
      {(title || action) && (
        <header className="flex items-start justify-between gap-4 border-b border-[#E2E8F0] px-5 py-4">
          <div>
            {title ? (
              <h2 className="text-[14px] font-semibold tracking-tight text-[#0F172A]">{title}</h2>
            ) : null}
            {description ? (
              <p className="mt-0.5 text-[12px] text-[#64748B]">{description}</p>
            ) : null}
          </div>
          {action ? <div className="shrink-0">{action}</div> : null}
        </header>
      )}
      <div className={flush ? "" : "p-5"}>{children}</div>
    </section>
  );
}
