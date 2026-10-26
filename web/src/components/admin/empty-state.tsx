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
    <div className="rounded-xl border border-dashed border-[#E5E5E2] bg-[#FAFAF9] p-12 text-center">
      {Icon ? (
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-lg bg-white text-[#8A8A86] ring-1 ring-[#E5E5E2]">
          <Icon className="h-5 w-5" />
        </div>
      ) : null}
      <p className="mt-4 text-[15px] font-semibold text-[#111111]">{title}</p>
      {description ? (
        <p className="mx-auto mt-1 max-w-[420px] text-[13px] leading-[1.6] text-[#6B6B6B]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-5 inline-flex">{action}</div> : null}
    </div>
  );
}
