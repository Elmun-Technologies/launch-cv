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
    <div className="min-w-0 rounded-[22px] bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[13px] font-medium text-[#4a4862]">{label}</p>
        {Icon ? (
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#f1eff8] text-[#5440e8]">
            <Icon className="h-4 w-4" aria-hidden />
          </span>
        ) : null}
      </div>
      <p className="mt-1.5 truncate text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em] text-[#121226] tabular-nums sm:text-[34px]">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
      {(hint || delta) && (
        <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[12px]">
          {delta ? (
            <span className={`inline-flex items-center gap-0.5 font-bold ${delta.positive ? "text-[#0b7a4f]" : "text-[#c42b30]"}`}>
              {delta.positive ? <ArrowUpRight className="h-3 w-3" aria-hidden /> : <ArrowDownRight className="h-3 w-3" aria-hidden />}
              {delta.value}
            </span>
          ) : null}
          {hint ? <span className="text-[#66647c]">{hint}</span> : null}
        </div>
      )}
    </div>
  );
}
