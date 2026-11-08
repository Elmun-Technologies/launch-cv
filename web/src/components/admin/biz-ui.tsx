import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowDownRight, ArrowUpRight, Info, Minus } from "lucide-react";
import { chipCls, focusRing } from "@/components/admin/v5/ui";
import { RANGE_PRESETS, type BizRange, type Delta } from "@/lib/biz-metrics";
import { fmtDate } from "@/lib/admin-dates";

/**
 * Building blocks for the business analytics pages (Admin → Revenue, Product).
 * No hooks: server-renderable. Every metric carries a one-line definition
 * (InfoTip) so nobody has to guess what a number means.
 */

/** Hover/focus tooltip with a metric's definition. Keyboard reachable; the text is also its accessible name. */
export function InfoTip({ text, label, tone = "light" }: { text: string; label: string; tone?: "light" | "dark" }) {
  return (
    <span className="group relative inline-flex align-middle">
      <span
        tabIndex={0}
        role="note"
        aria-label={`${label}: ${text}`}
        className={`inline-flex h-5 w-5 cursor-help items-center justify-center rounded-full ${
          tone === "dark" ? "text-[#e4dfff] hover:bg-white/15" : "text-[#8f8da8] hover:bg-[#f1eff8] hover:text-[#5440e8]"
        } ${focusRing}`}
      >
        <Info className="h-3.5 w-3.5" aria-hidden="true" />
      </span>
      <span
        aria-hidden="true"
        className="pointer-events-none invisible absolute left-1/2 top-full z-30 mt-1.5 w-[250px] max-w-[70vw] -translate-x-1/2 rounded-xl bg-[#111118] px-3 py-2 text-left text-[12px] font-medium normal-case leading-[1.45] tracking-normal text-white opacity-0 shadow-[0_12px_30px_-8px_rgba(10,6,60,.45)] transition-opacity group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

/** Label with its definition tooltip. */
export function Defined({ label, def, tone }: { label: ReactNode; def: string; tone?: "light" | "dark" }) {
  return (
    <span className="inline-flex items-center gap-1">
      {label}
      <InfoTip text={def} label={typeof label === "string" ? label : "Definition"} tone={tone} />
    </span>
  );
}

function DeltaLine({ d, featured }: { d: Delta; featured?: boolean }) {
  if (d.tone === "none") return <span className={featured ? "text-[#e4dfff]" : "text-[#66647c]"}>{d.text}</span>;
  const color = featured
    ? "text-white"
    : d.tone === "up"
      ? "text-[#0b7a4f]"
      : d.tone === "down"
        ? "text-[#a3262b]"
        : "text-[#66647c]";
  const Icon = d.tone === "flat" ? Minus : (d.pct ?? 1) >= 0 ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 font-bold ${color}`}>
      <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      {d.text}
    </span>
  );
}

/** KPI tile (v5 StatTile look) with a definition and a change vs the previous period. */
export function MetricTile({
  label,
  value,
  def,
  delta,
  hint,
  featured,
}: {
  label: string;
  value: ReactNode;
  def: string;
  delta?: Delta | null;
  hint?: ReactNode;
  featured?: boolean;
}) {
  return (
    <div className={`min-w-0 rounded-[22px] p-5 ${featured ? "bg-[#5440e8] text-white" : "bg-white text-[#121226]"}`}>
      <p className={`text-[13px] ${featured ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>
        <Defined label={label} def={def} tone={featured ? "dark" : "light"} />
      </p>
      <p className="mt-1 break-words text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] tabular-nums">{value}</p>
      {delta || hint ? (
        <div className="mt-1 flex flex-col gap-0.5 text-[12px]">
          {delta ? <DeltaLine d={delta} featured={featured} /> : null}
          {hint ? <span className={`font-semibold ${featured ? "text-[#e4dfff]" : "text-[#66647c]"}`}>{hint}</span> : null}
        </div>
      ) : null}
    </div>
  );
}

/** Preset chips plus a custom from/to form (plain GET, works without JS). */
export function RangeBar({ basePath, range }: { basePath: string; range: BizRange }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <nav aria-label="Date range" className="flex flex-wrap gap-1.5">
        {RANGE_PRESETS.map((p) => (
          <Link
            key={p.id}
            href={p.id === "30d" ? basePath : `${basePath}?range=${p.id}`}
            aria-current={range.preset === p.id ? "page" : undefined}
            className={chipCls(range.preset === p.id)}
          >
            {p.label}
          </Link>
        ))}
      </nav>
      <form method="get" action={basePath} className="flex flex-wrap items-center gap-1.5" aria-label="Custom date range">
        <input type="hidden" name="range" value="custom" />
        <label className="sr-only" htmlFor="range-from">
          From
        </label>
        <input
          id="range-from"
          type="date"
          name="from"
          defaultValue={range.fromKey}
          required
          className="h-10 rounded-full border-[1.5px] border-transparent bg-white px-3 text-[13px] text-[#121226] outline-none hover:border-[#c9c0ff] focus:border-[#5440e8]"
        />
        <span aria-hidden="true" className="text-[13px] text-[#66647c]">
          to
        </span>
        <label className="sr-only" htmlFor="range-to">
          To
        </label>
        <input
          id="range-to"
          type="date"
          name="to"
          defaultValue={range.toKey}
          required
          className="h-10 rounded-full border-[1.5px] border-transparent bg-white px-3 text-[13px] text-[#121226] outline-none hover:border-[#c9c0ff] focus:border-[#5440e8]"
        />
        <button type="submit" className={chipCls(range.preset === "custom")}>
          Apply
        </button>
      </form>
    </div>
  );
}

export function NoData({ children = "No data yet" }: { children?: ReactNode }) {
  return <p className="py-8 text-center text-[14px] font-semibold text-[#66647c]">{children}</p>;
}

export type StackGroup = { id: string; label: string; color: string };

/**
 * Stacked columns (one per day or week). The summary is the accessible name
 * and the visible caption; each column's tooltip lists its breakdown.
 */
export function StackedBarChart({
  points,
  groups,
  fmt,
  summary,
  bucket,
}: {
  points: { key: string; values: Record<string, number> }[];
  groups: readonly StackGroup[];
  fmt: (n: number) => string;
  summary: string;
  bucket: "day" | "week";
}) {
  const totals = points.map((p) => groups.reduce((a, g) => a + (p.values[g.id] ?? 0), 0));
  const max = Math.max(0, ...totals);
  const used = groups.filter((g) => points.some((p) => (p.values[g.id] ?? 0) > 0));
  const tickEvery = Math.max(1, Math.ceil(points.length / 6));
  return (
    <figure className="m-0">
      <div role="img" aria-label={summary} className={`flex h-[220px] items-end ${points.length > 40 ? "gap-px" : "gap-[3px]"}`}>
        {points.map((p, i) => {
          const total = totals[i];
          const title = `${bucket === "week" ? "Week of " : ""}${fmtDate(p.key)}: ${fmt(total)}${
            total > 0 ? ` (${used.filter((g) => (p.values[g.id] ?? 0) > 0).map((g) => `${g.label} ${fmt(p.values[g.id])}`).join(", ")})` : ""
          }`;
          return (
            <div key={p.key} title={title} className="flex h-full min-w-0 flex-1 flex-col justify-end">
              <div
                className="flex w-full flex-col-reverse overflow-hidden rounded-t-[4px]"
                style={{ height: max > 0 ? `${(total / max) * 100}%` : 0, minHeight: total > 0 ? 3 : 0 }}
              >
                {groups.map((g) => {
                  const v = p.values[g.id] ?? 0;
                  return v > 0 ? <div key={g.id} style={{ height: `${(v / total) * 100}%`, background: g.color }} /> : null;
                })}
              </div>
            </div>
          );
        })}
      </div>
      <div aria-hidden="true" className="mt-1.5 flex gap-[3px] text-[11px] text-[#66647c]">
        {points.map((p, i) => (
          <span key={p.key} className="relative h-4 min-w-0 flex-1">
            {i % tickEvery === 0 ? <span className="absolute left-0 top-0 whitespace-nowrap">{fmtDate(p.key)}</span> : null}
          </span>
        ))}
      </div>
      {used.length ? (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[12px] font-semibold text-[#4a4862]">
          {used.map((g) => (
            <li key={g.id} className="inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="h-2.5 w-2.5 rounded-sm" style={{ background: g.color }} />
              {g.label}
            </li>
          ))}
        </ul>
      ) : null}
      <figcaption className="mt-2 text-[12px] leading-[1.5] text-[#66647c]">{summary}</figcaption>
    </figure>
  );
}

/** Horizontal bars with a label, a value and an optional second line. */
export function BarList({
  rows,
  color = "#5440e8",
}: {
  rows: { key: string; label: ReactNode; value: number; display: string; sub?: string; color?: string }[];
  color?: string;
}) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <ul>
      {rows.map((r) => (
        <li key={r.key} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1 border-t border-[#e2e0ea] py-2.5 text-[14px] first:border-t-0">
          <span className="min-w-0 font-semibold text-[#121226]">{r.label}</span>
          <span className="text-right font-bold tabular-nums text-[#121226]">{r.display}</span>
          <div className="col-span-2 h-2.5 overflow-hidden rounded-full bg-[#f1eff8]" aria-hidden="true">
            <div className="h-full rounded-full" style={{ width: `${(r.value / max) * 100}%`, background: r.color ?? color }} />
          </div>
          {r.sub ? <span className="col-span-2 text-[12px] text-[#66647c]">{r.sub}</span> : null}
        </li>
      ))}
    </ul>
  );
}

/** Background for a 0–100 % heatmap cell (lilac → primary). */
export function heatColor(pct: number): { background: string; color: string } {
  const a = Math.max(0.06, Math.min(1, pct / 100));
  return { background: `rgba(84, 64, 232, ${a.toFixed(2)})`, color: a > 0.45 ? "#ffffff" : "#121226" };
}
