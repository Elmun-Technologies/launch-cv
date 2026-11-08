import type { ReactNode } from "react";

type Tone = "default" | "blue" | "green" | "amber" | "red" | "violet" | "slate";

/** v5 pill chips (see Chip in components/site/ui.tsx). All pairs pass WCAG AA. */
const toneClass: Record<Tone, string> = {
  default: "bg-[#f1eff8] text-[#4a4862]",
  blue: "bg-[#e4dfff] text-[#3a2bb8]",
  green: "bg-[#dcf5ea] text-[#0b4f35]",
  amber: "bg-[#fdf0d5] text-[#7a4600]",
  red: "bg-[#fbe2e3] text-[#a3262b]",
  violet: "bg-[#e4dfff] text-[#3a2bb8]",
  slate: "bg-[#111118] text-white",
};

const dotClass: Record<Tone, string> = {
  default: "bg-[#7c7a94]",
  blue: "bg-[#5440e8]",
  green: "bg-[#0b7a4f]",
  amber: "bg-[#c77700]",
  red: "bg-[#c42b30]",
  violet: "bg-[#5440e8]",
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
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-[5px] text-[12px] font-bold leading-none ${toneClass[tone]}`}
    >
      {dot ? <span className={`h-1.5 w-1.5 rounded-full ${dotClass[tone]}`} aria-hidden /> : null}
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
  if (["professional", "week", "quarter", "starter", "trial"].includes(s)) return "blue";
  return "default";
}
