import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export type KpiCardProps = {
  label: string;
  value: string | number;
  icon?: LucideIcon;
  hint?: string;
  /** Positive = green up arrow, negative = red down arrow */
  delta?: { value: string; positive: boolean };
};

export function KpiCard({ label, value, icon: Icon, hint, delta }: KpiCardProps) {
  return (
    <div className="rounded-xl border border-[#E5E5E2] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8A8A86]">
          {label}
        </p>
        {Icon ? (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F5F3] text-[#3F3F3F]">
            <Icon className="h-4 w-4" />
          </span>
        ) : null}
      </div>
      <p className="mt-3 text-[28px] font-bold leading-none tracking-tight text-[#111111]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {(hint || delta) && (
        <div className="mt-2 flex items-center gap-2 text-[12px]">
          {delta ? (
            <span
              className={`inline-flex items-center gap-0.5 font-semibold ${
                delta.positive ? "text-emerald-700" : "text-red-700"
              }`}
            >
              {delta.positive ? (
                <ArrowUpRight className="h-3 w-3" />
              ) : (
                <ArrowDownRight className="h-3 w-3" />
              )}
              {delta.value}
            </span>
          ) : null}
          {hint ? <span className="text-[#8A8A86]">{hint}</span> : null}
        </div>
      )}
    </div>
  );
}
