/** Presentational pieces shared by the free ATS result and the saved report page. */
import type { FreeAtsFix, FreeAtsResult } from "@/types/ai-results";

export function scoreVerdict(score: number): string {
  if (score >= 85) return "Ready to send. Only small fixes left.";
  if (score >= 70) return "Readable, but you're leaving points on the table.";
  if (score >= 50) return "Most hiring software would rank this resume low.";
  return "This resume is likely being filtered out.";
}

export function scoreColor(v: number): string {
  if (v >= 80) return "#12A15E";
  if (v >= 60) return "#E8890C";
  return "#C2341B";
}

const PRIORITY_COLOR: Record<FreeAtsFix["priority"], string> = {
  High: "#C2341B",
  Medium: "#E8890C",
  Low: "#8A8A86",
};

export function FixItem({ fix, n }: { fix: FreeAtsFix; n: number }) {
  return (
    <li className="flex gap-4 border-t border-[#EEEEEB] py-5">
      <span
        className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[13px] font-semibold text-white"
        style={{ background: PRIORITY_COLOR[fix.priority] }}
        aria-label={`${fix.priority} priority`}
      >
        {n}
      </span>
      <div className="min-w-0">
        <p className="text-[17px] font-semibold text-[#111111]">{fix.title}</p>
        {fix.fix ? (
          <p className="mt-2.5 rounded-[10px] bg-[#F5F5F3] px-3.5 py-3 text-[14px] leading-[1.55] text-[#3F3F3F]">
            <strong className="text-[#111111]">Fix:</strong> {fix.fix}
          </p>
        ) : null}
      </div>
    </li>
  );
}

export function DimensionBars({ dimensions }: { dimensions: FreeAtsResult["dimensions"] }) {
  return (
    <div className="flex flex-col gap-3.5 text-[14px]">
      {dimensions.map((d) => (
        <div key={d.name}>
          <div className="flex justify-between">
            <span className="text-[#3F3F3F]">{d.name}</span>
            <span className="font-semibold text-[#111111]">{d.score}</span>
          </div>
          <div className="mt-1.5 h-1.5 rounded-full bg-[#EEEEEB]">
            <div className="h-1.5 rounded-full" style={{ width: `${d.score}%`, background: scoreColor(d.score) }} />
          </div>
        </div>
      ))}
    </div>
  );
}
