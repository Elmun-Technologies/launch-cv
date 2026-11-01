/** Presentational pieces shared by the free ATS result, the dashboard and the saved report page (v5 design). */
import type { FreeAtsFix, FreeAtsResult } from "@/types/ai-results";

export function scoreVerdict(score: number): string {
  if (score >= 85) return "Ready to send. Only small fixes left.";
  if (score >= 70) return "Readable, but you're leaving points on the table.";
  if (score >= 50) return "Most hiring software would rank this resume low.";
  return "This resume is likely being filtered out.";
}

/** Two-word label for the same bands as `scoreVerdict`. */
export function scoreLabel(score: number): string {
  if (score >= 85) return "Ready to send";
  if (score >= 70) return "Almost there";
  if (score >= 50) return "Needs work";
  return "At risk";
}

/** Text-safe score color (AA on white): green / amber / red. */
export function scoreColor(v: number): string {
  if (v >= 80) return "#0b7a4f";
  if (v >= 60) return "#a15c00";
  return "#c42b30";
}

/** Fill color for bars and rings (not for text). */
export function scoreBarColor(v: number): string {
  if (v >= 80) return "#22b07d";
  if (v >= 60) return "#f2a91f";
  return "#c42b30";
}

const PRIORITY_BADGE: Record<FreeAtsFix["priority"], string> = {
  High: "bg-[#fbe2e3] text-[#a3262b]",
  Medium: "bg-[#fdf0d5] text-[#7a4600]",
  Low: "bg-[#f1eff8] text-[#4a4862]",
};

export function PriorityBadge({ priority }: { priority: FreeAtsFix["priority"] }) {
  return (
    <span className={`inline-block shrink-0 rounded-full px-2.5 py-[5px] text-[12px] font-bold leading-none ${PRIORITY_BADGE[priority]}`}>
      {priority}
      <span className="sr-only"> priority</span>
    </span>
  );
}

/** Circular score gauge, 0–100. */
export function ScoreRing({ score, size = 150, className = "" }: { score: number; size?: number; className?: string }) {
  const r = 45.5;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, score));
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={`Score ${score} out of 100`} className={className}>
      <circle cx="50" cy="50" r={r} fill="none" stroke="#efedf7" strokeWidth="9" />
      <circle
        cx="50"
        cy="50"
        r={r}
        fill="none"
        stroke={scoreBarColor(v)}
        strokeWidth="9"
        strokeLinecap="round"
        strokeDasharray={`${(v / 100) * c} ${c}`}
        transform="rotate(-90 50 50)"
      />
      <text x="50" y="59" textAnchor="middle" fontSize="28" fontWeight="700" fill="#121226">
        {score}
      </text>
    </svg>
  );
}

/** One fix as a list row: priority, what's wrong, how to fix it. Renders an <li>. */
export function FixItem({ fix, n }: { fix: FreeAtsFix; n: number }) {
  return (
    <li
      data-n={n}
      className="flex flex-col gap-2 border-t border-[#e2e0ea] py-4 sm:grid sm:grid-cols-[90px_1fr_1fr] sm:gap-5 sm:py-[18px]"
    >
      <span>
        <PriorityBadge priority={fix.priority} />
      </span>
      <p className="text-[15px] font-bold leading-[21px] text-[#121226]">{fix.title}</p>
      {fix.fix ? (
        <p className="flex gap-2.5 text-[14px] leading-[21px] text-[#24223a]">
          <span className="font-extrabold text-[#0b7a4f]">Fix</span>
          <span className="min-w-0">{fix.fix}</span>
        </p>
      ) : (
        <span className="hidden sm:block" />
      )}
    </li>
  );
}

export function DimensionBars({ dimensions }: { dimensions: FreeAtsResult["dimensions"] }) {
  return (
    <div className="flex flex-col gap-3.5 text-[14px]">
      {dimensions.map((d) => (
        <div key={d.name}>
          <div className="flex justify-between">
            <span className="text-[#4a4862]">{d.name}</span>
            <span className="font-bold" style={{ color: scoreColor(d.score) }}>
              {d.score}
            </span>
          </div>
          <div aria-hidden="true" className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-[#efedf7]">
            <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: scoreBarColor(d.score) }} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Dimension scores as a 2-column grid of tiles (report page). */
export function DimensionTiles({ dimensions, className = "" }: { dimensions: FreeAtsResult["dimensions"]; className?: string }) {
  return (
    <ul className={`grid grid-cols-2 gap-2 sm:gap-2.5 ${className}`}>
      {dimensions.map((d) => (
        <li key={d.name} className="rounded-[18px] bg-[#f7f6fb] p-3.5 sm:rounded-[20px] sm:p-[18px]">
          <div className="flex justify-between gap-2 text-[13px] font-extrabold sm:text-[15px]">
            <span className="min-w-0 break-words text-[#121226]">{d.name}</span>
            <span style={{ color: scoreColor(d.score) }}>
              {d.score}
              <span className="sr-only"> out of 100</span>
            </span>
          </div>
          <div aria-hidden="true" className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e9e6f3] sm:mt-2.5 sm:h-2">
            <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: scoreBarColor(d.score) }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
