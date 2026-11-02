import { fmtDate, fmtWeekday } from "@/lib/admin-dates";

/**
 * Small inline-SVG charts for admin pages (no chart library, server-renderable).
 * Each chart is one `role="img"` with a text summary, plus a visible caption
 * that says the same thing, so nothing is only in the picture.
 */

export type DayPoint = { day: string; count: number };

function summarize(points: DayPoint[], noun: string): string {
  const total = points.reduce((a, p) => a + p.count, 0);
  if (points.length === 0) return `No ${noun} data.`;
  const first = fmtDate(points[0].day);
  const last = fmtDate(points[points.length - 1].day);
  if (total === 0) return `No ${noun} from ${first} to ${last}.`;
  const peak = points.reduce((a, p) => (p.count > a.count ? p : a), points[0]);
  const avg = total / points.length;
  return `${total.toLocaleString("en-US")} ${noun} from ${first} to ${last}, ${avg < 10 ? avg.toFixed(1) : Math.round(avg)} a day on average; the busiest day was ${fmtDate(peak.day)} with ${peak.count.toLocaleString("en-US")}.`;
}

/** Tick labels: first, last and a few evenly spaced days in between. */
function ticks(points: DayPoint[], want = 5): number[] {
  if (points.length <= 1) return points.length ? [0] : [];
  const n = Math.min(want, points.length);
  const out = new Set<number>();
  for (let i = 0; i < n; i++) out.add(Math.round((i * (points.length - 1)) / (n - 1)));
  return [...out];
}

/** Area + line chart of a daily count (Overview → Sign-ups per day). */
export function DailyLineChart({ points, noun, height = 160 }: { points: DayPoint[]; noun: string; height?: number }) {
  const summary = summarize(points, noun);
  const W = 600;
  const H = height;
  const pad = 6;
  const max = Math.max(1, ...points.map((p) => p.count));
  const x = (i: number) => (points.length <= 1 ? W / 2 : pad + (i * (W - pad * 2)) / (points.length - 1));
  const y = (v: number) => H - pad - (v / max) * (H - pad * 2);
  const line = points.map((p, i) => `${i === 0 ? "M" : "L"}${x(i).toFixed(1)},${y(p.count).toFixed(1)}`).join(" ");
  const area = points.length ? `${line} L${x(points.length - 1).toFixed(1)},${H} L${x(0).toFixed(1)},${H} Z` : "";
  return (
    <figure className="m-0">
      <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" role="img" aria-label={summary} className="block h-[160px] w-full">
        <line x1="0" x2={W} y1={H - 0.5} y2={H - 0.5} stroke="#e2e0ea" strokeWidth="1" vectorEffect="non-scaling-stroke" />
        {points.length ? (
          <>
            <path d={area} fill="#5440e8" fillOpacity="0.1" />
            <path d={line} fill="none" stroke="#5440e8" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
          </>
        ) : null}
      </svg>
      <div aria-hidden="true" className="relative mt-1.5 h-4 text-[11px] text-[#66647c]">
        {ticks(points).map((i) => (
          <span
            key={i}
            className="absolute top-0 whitespace-nowrap"
            style={
              i === 0
                ? { left: 0 }
                : i === points.length - 1
                  ? { right: 0 }
                  : { left: `${(i / (points.length - 1)) * 100}%`, transform: "translateX(-50%)" }
            }
          >
            {fmtDate(points[i].day)}
          </span>
        ))}
      </div>
      <figcaption className="mt-2 text-[12px] leading-[1.5] text-[#66647c]">{summary}</figcaption>
    </figure>
  );
}

/** Column chart of a daily count; the last (current) day is highlighted. */
export function DailyBarChart({ points, noun }: { points: DayPoint[]; noun: string }) {
  const summary = summarize(points, noun);
  const max = Math.max(1, ...points.map((p) => p.count));
  const few = points.length <= 14;
  const tickSet = new Set(ticks(points, few ? points.length : 5));
  return (
    <figure className="m-0">
      <div role="img" aria-label={summary} className={`flex h-[200px] items-end ${few ? "gap-1.5 sm:gap-2.5" : "gap-px sm:gap-[2px]"}`}>
        {points.map((p, i) => (
          <div key={p.day} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1">
            {few ? <span className="text-[12px] font-bold tabular-nums leading-none text-[#121226]">{p.count}</span> : null}
            <div
              className={`w-full ${few ? "rounded-t-lg rounded-b-sm" : "rounded-t-[3px]"} ${i === points.length - 1 ? "bg-[#5440e8]" : "bg-[#c9c0ff]"}`}
              style={{ height: `${(p.count / max) * 100}%`, minHeight: p.count > 0 ? 3 : 0 }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className={`mt-1.5 flex ${few ? "gap-1.5 sm:gap-2.5" : "gap-px sm:gap-[2px]"} text-[11px] text-[#66647c]`}>
        {points.map((p, i) => (
          <span key={p.day} className="relative h-4 min-w-0 flex-1 text-center">
            {tickSet.has(i) ? (
              <span
                className={
                  few
                    ? ""
                    : `absolute top-0 whitespace-nowrap ${
                        i === 0 ? "left-0" : i === points.length - 1 ? "right-0" : "left-1/2 -translate-x-1/2"
                      }`
                }
              >
                {few ? fmtWeekday(p.day) : fmtDate(p.day)}
              </span>
            ) : null}
          </span>
        ))}
      </div>
      <figcaption className="mt-2 text-[12px] leading-[1.5] text-[#66647c]">{summary}</figcaption>
    </figure>
  );
}
