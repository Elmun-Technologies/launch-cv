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
    <div className="rounded-[24px] border-[1.5px] border-dashed border-[#d9d4f2] bg-white/70 px-6 py-12 text-center sm:p-12">
      {Icon ? (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#e4dfff] text-[#3a2bb8]">
          <Icon className="h-5 w-5" aria-hidden />
        </div>
      ) : null}
      <p className="mt-4 text-[17px] font-extrabold tracking-[-0.01em] text-[#121226]">{title}</p>
      {description ? <p className="mx-auto mt-1.5 max-w-[440px] text-[14px] leading-[1.6] text-[#4a4862]">{description}</p> : null}
      {action ? <div className="mt-5 inline-flex">{action}</div> : null}
    </div>
  );
}
