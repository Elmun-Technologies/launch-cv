import { WEEKDAYS, hourLabel } from "@/lib/traffic/labels";

/**
 * Analytics charts that the shared admin charts (components/admin/charts.tsx)
 * don't cover: labelled columns (hours, weekdays) and an hour × weekday
 * heatmap. Inline SVG/CSS, server-renderable, with a text summary for screen
 * readers and a visible caption.
 */

export type Bar = { label: string; value: number; title?: string };

/** Columns with a label under each (or under every `labelEvery`-th). */
export function LabeledBarChart({
  bars,
  noun,
  summary,
  labelEvery = 1,
  height = 180,
  highlight,
}: {
  bars: Bar[];
  noun: string;
  summary?: string;
  labelEvery?: number;
  height?: number;
  /** Index of the bar to draw in the strong color (e.g. the busiest one). */
  highlight?: number;
}) {
  const max = Math.max(1, ...bars.map((b) => b.value));
  const total = bars.reduce((a, b) => a + b.value, 0);
  const peak = bars.reduce((a, b, i) => (b.value > bars[a].value ? i : a), 0);
  const text =
    summary ??
    (total === 0
      ? `No ${noun} in this range.`
      : `${total.toLocaleString("en-US")} ${noun}; the busiest is ${bars[peak]?.label} with ${bars[peak]?.value.toLocaleString("en-US")}.`);
  const strong = highlight ?? (total > 0 ? peak : -1);
  return (
    <figure className="m-0">
      <div role="img" aria-label={text} className="flex items-end gap-[3px] sm:gap-1" style={{ height }}>
        {bars.map((b, i) => (
          <div key={`${b.label}-${i}`} className="flex h-full min-w-0 flex-1 flex-col justify-end" title={b.title ?? `${b.label}: ${b.value.toLocaleString("en-US")}`}>
            <div
              className={`w-full rounded-t-[4px] ${i === strong ? "bg-[#5440e8]" : "bg-[#c9c0ff]"}`}
              style={{ height: `${(b.value / max) * 100}%`, minHeight: b.value > 0 ? 3 : 0 }}
            />
          </div>
        ))}
      </div>
      <div aria-hidden="true" className="mt-1.5 flex gap-[3px] text-[11px] text-[#66647c] sm:gap-1">
        {bars.map((b, i) => (
          <span key={`${b.label}-${i}`} className="min-w-0 flex-1 overflow-visible whitespace-nowrap text-center">
            {i % labelEvery === 0 ? b.label : ""}
          </span>
        ))}
      </div>
      <figcaption className="mt-2 text-[12px] leading-[1.5] text-[#66647c]">{text}</figcaption>
    </figure>
  );
}

/** 7 × 24 grid of sessions started, darker = more. Rows Mon–Sun, columns 0–23 h. */
export function WeekHourHeatmap({ grid }: { grid: number[][] }) {
  const max = Math.max(0, ...grid.flat());
  const total = grid.flat().reduce((a, b) => a + b, 0);
  let peak = { d: 0, h: 0, n: 0 };
  grid.forEach((row, d) => row.forEach((n, h) => (n > peak.n ? (peak = { d, h, n }) : null)));
  const text =
    total === 0
      ? "No sessions in this range."
      : `${total.toLocaleString("en-US")} sessions; the busiest hour is ${WEEKDAYS[peak.d]} ${hourLabel(peak.h)} with ${peak.n.toLocaleString("en-US")}.`;
  return (
    <figure className="m-0">
      <div role="img" aria-label={text} className="overflow-x-auto">
        <div className="grid min-w-[520px] grid-cols-[36px_repeat(24,minmax(0,1fr))] gap-[3px]">
          <span />
          {Array.from({ length: 24 }, (_, h) => (
            <span key={h} aria-hidden className="text-center text-[10px] text-[#66647c]">
              {h % 3 === 0 ? (h === 0 ? "12a" : h < 12 ? `${h}a` : h === 12 ? "12p" : `${h - 12}p`) : ""}
            </span>
          ))}
          {grid.map((row, d) => (
            <div key={d} className="contents">
              <span aria-hidden className="pr-1 text-[11px] font-semibold leading-[18px] text-[#4a4862]">
                {WEEKDAYS[d]}
              </span>
              {row.map((n, h) => {
                const a = max > 0 ? n / max : 0;
                return (
                  <span
                    key={h}
                    title={`${WEEKDAYS[d]} ${hourLabel(h)}: ${n.toLocaleString("en-US")} session${n === 1 ? "" : "s"}`}
                    className="h-[18px] rounded-[4px]"
                    style={{ background: n === 0 ? "#f1eff8" : `rgba(84, 64, 232, ${(0.15 + a * 0.85).toFixed(3)})` }}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <figcaption className="mt-2 text-[12px] leading-[1.5] text-[#66647c]">{text}</figcaption>
    </figure>
  );
}
