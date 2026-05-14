import type { ReactNode } from "react";

type Tone = "default" | "blue" | "green" | "amber" | "red" | "violet" | "slate";

const toneClass: Record<Tone, string> = {
  default: "bg-[#F1F5F9] text-[#475569] ring-1 ring-inset ring-[#E2E8F0]",
  blue: "bg-blue-50 text-blue-700 ring-1 ring-inset ring-blue-200",
  green: "bg-emerald-50 text-emerald-700 ring-1 ring-inset ring-emerald-200",
  amber: "bg-amber-50 text-amber-700 ring-1 ring-inset ring-amber-200",
  red: "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200",
  violet: "bg-violet-50 text-violet-700 ring-1 ring-inset ring-violet-200",
  slate: "bg-[#0F172A] text-white",
};

const dotClass: Record<Tone, string> = {
  default: "bg-[#64748B]",
  blue: "bg-blue-500",
  green: "bg-emerald-500",
  amber: "bg-amber-500",
  red: "bg-red-500",
  violet: "bg-violet-500",
  slate: "bg-white",
};

export type StatusBadgeProps = {
  tone?: Tone;
  dot?: boolean;
  children: ReactNode;
};

export function StatusBadge({ tone = "default", dot = false, children }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-semibold ${toneClass[tone]}`}
    >
      {dot ? <span className={`h-1.5 w-1.5 rounded-full ${dotClass[tone]}`} /> : null}
      {children}
    </span>
  );
}

/** Maps a free-form status string to a sensible tone. Defaults to slate/grey. */
export function statusToTone(status: string | null | undefined): Tone {
  if (!status) return "default";
  const s = status.toLowerCase();
  if (["published", "active", "ok", "success", "verified", "paid"].includes(s)) return "green";
  if (["draft", "pending", "scheduled", "incomplete"].includes(s)) return "amber";
  if (["archived", "cancelled", "canceled", "failed", "error", "rejected", "deleted", "expired"].includes(s)) return "red";
  if (["admin", "elite", "lifetime"].includes(s)) return "violet";
  if (["professional", "starter", "trial"].includes(s)) return "blue";
  return "default";
}
