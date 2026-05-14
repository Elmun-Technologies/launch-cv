import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";

export type EmptyStateProps = {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
};

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="rounded-xl border border-dashed border-[#E2E8F0] bg-[#FAFBFC] p-12 text-center">
      {Icon ? (
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#94A3B8] ring-1 ring-[#E2E8F0]">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <p className="mt-4 text-[15px] font-semibold text-[#0F172A]">{title}</p>
      {description ? (
        <p className="mx-auto mt-1 max-w-[420px] text-[13px] leading-[1.6] text-[#64748B]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5 inline-flex">{action}</div> : null}
    </div>
  );
}
