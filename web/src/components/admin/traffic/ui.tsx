import type { ReactNode } from "react";
import { ArrowDownRight, ArrowUpRight, Download, Info } from "lucide-react";
import { focusRing, Meter } from "@/components/admin/v5/ui";
import { fmtInt, fmtPct, pctChange } from "@/lib/traffic/labels";

/** Building blocks shared by the Admin → Analytics pages. Server-safe (no hooks). */

/** Small "i" with a hover/focus popover. The text is also the button's accessible name. */
export function InfoTip({ text, label = "How this is counted" }: { text: string; label?: string }) {
  return (
    <span className="group relative inline-flex align-middle">
      <button
        type="button"
        aria-label={`${label}: ${text}`}
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full text-current opacity-80 hover:bg-[#e4dfff] hover:text-[#3a2bb8] hover:opacity-100 ${focusRing}`}
      >
        <Info className="h-3.5 w-3.5" aria-hidden />
      </button>
      <span
        role="tooltip"
        className="pointer-events-none invisible absolute left-1/2 top-full z-30 mt-1 w-[280px] -translate-x-1/2 rounded-xl bg-[#111118] px-3 py-2 text-left text-[12px] font-medium normal-case leading-[1.5] tracking-normal text-white opacity-0 shadow-lg transition-opacity group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100"
      >
        {text}
      </span>
    </span>
  );
}

export function ExportLink({ href, label = "CSV" }: { href: string; label?: string }) {
  return (
    <a
      href={href}
      download
      className={`inline-flex min-h-9 items-center gap-1.5 rounded-full bg-[#f1eff8] px-3 text-[13px] font-bold text-[#121226] transition-colors hover:bg-[#e4dfff] ${focusRing}`}
    >
      <Download className="h-3.5 w-3.5" aria-hidden />
      {label}
      <span className="sr-only"> export</span>
    </a>
  );
}

export function NoData({ children = "No data yet" }: { children?: ReactNode }) {
  return <p className="py-8 text-center text-[14px] text-[#66647c]">{children}</p>;
}

/** "+12.3% vs previous period" pill. `invert` for metrics where lower is better (bounce rate). */
export function Delta({ cur, prev, invert, suffix = "" }: { cur: number; prev: number | null; invert?: boolean; suffix?: string }) {
  const change = pctChange(cur, prev);
  if (change === null) return <span className="text-[12px] font-semibold text-[#66647c]">No earlier data</span>;
  const up = change >= 0;
  const good = invert ? !up : up;
  const flat = Math.abs(change) < 0.05;
  const Icon = up ? ArrowUpRight : ArrowDownRight;
  return (
    <span className={`inline-flex items-center gap-0.5 text-[12px] font-bold ${flat ? "text-[#66647c]" : good ? "text-[#0b7a4f]" : "text-[#a3262b]"}`}>
      {!flat ? <Icon className="h-3 w-3" aria-hidden /> : null}
      {flat ? "±0%" : `${up ? "+" : "−"}${Math.abs(change).toFixed(Math.abs(change) < 10 ? 1 : 0)}%`}
      <span className="font-semibold text-[#66647c]">{suffix}</span>
    </span>
  );
}

export function KpiTile({
  label,
  value,
  cur,
  prev,
  invert,
  hint,
  info,
  featured,
}: {
  label: string;
  value: string;
  cur?: number;
  prev?: number | null;
  invert?: boolean;
  hint?: string;
  info?: string;
  featured?: boolean;
}) {
  return (
    <div className={`min-w-0 rounded-[22px] p-4 sm:p-5 ${featured ? "bg-[#5440e8] text-white" : "bg-white text-[#121226]"}`}>
      <p className={`flex items-center gap-1 text-[13px] ${featured ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>
        {label}
        {info ? <InfoTip text={info} label={label} /> : null}
      </p>
      <p className="mt-1 truncate text-[24px] font-extrabold leading-[1.15] tracking-[-0.03em] tabular-nums sm:text-[28px]">{value}</p>
      <p className="mt-0.5 min-h-[18px]">
        {cur !== undefined && prev !== undefined ? (
          featured ? (
            <span className="text-[12px] font-bold text-[#e4dfff]">
              {pctChange(cur, prev) === null
                ? "No earlier data"
                : `${(pctChange(cur, prev) ?? 0) >= 0 ? "+" : "−"}${Math.abs(pctChange(cur, prev) ?? 0).toFixed(1)}% vs previous`}
            </span>
          ) : (
            <Delta cur={cur} prev={prev} invert={invert} suffix=" vs previous" />
          )
        ) : hint ? (
          <span className={`text-[12px] font-semibold ${featured ? "text-[#e4dfff]" : "text-[#66647c]"}`}>{hint}</span>
        ) : null}
      </p>
    </div>
  );
}

export type BreakdownItem = {
  key: string;
  label: ReactNode;
  visitors: number;
  sessions?: number;
  signups: number;
  paid: number;
};

/**
 * Visitors / sign-ups / conversion table used for sources and audience
 * dimensions. The bar under each name is its share of visitors.
 */
export function BreakdownTable({
  items,
  nameHeader,
  showSessions = true,
  limit,
}: {
  items: BreakdownItem[];
  nameHeader: string;
  showSessions?: boolean;
  limit?: number;
}) {
  if (!items.length) return <NoData />;
  const total = items.reduce((a, b) => a + b.visitors, 0);
  const shown = limit ? items.slice(0, limit) : items;
  return (
    <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label={`${nameHeader} table`}>
      <table className="w-full border-collapse text-left text-[14px]">
        <thead>
          <tr className="text-[11px] font-bold uppercase tracking-[0.06em] text-[#66647c]">
            <th scope="col" className="py-2.5 pr-3">{nameHeader}</th>
            <th scope="col" className="py-2.5 pr-3 text-right">Visitors</th>
            {showSessions ? <th scope="col" className="hidden py-2.5 pr-3 text-right sm:table-cell">Sessions</th> : null}
            <th scope="col" className="py-2.5 pr-3 text-right">Sign-ups</th>
            <th scope="col" className="py-2.5 pr-3 text-right">Conv.</th>
            <th scope="col" className="py-2.5 text-right">Paid</th>
          </tr>
        </thead>
        <tbody>
          {shown.map((r) => (
            <tr key={r.key} className="border-t border-[#e2e0ea] align-middle">
              <td className="max-w-[260px] py-2.5 pr-3">
                <div className="truncate font-semibold text-[#121226]">{r.label}</div>
                <div className="mt-1 max-w-[220px]">
                  <Meter pct={total ? (r.visitors / total) * 100 : 0} />
                </div>
              </td>
              <td className="py-2.5 pr-3 text-right tabular-nums">
                {fmtInt(r.visitors)}
                <span className="block text-[11px] text-[#66647c]">{fmtPct(r.visitors, total, 0)}</span>
              </td>
              {showSessions ? <td className="hidden py-2.5 pr-3 text-right tabular-nums sm:table-cell">{fmtInt(r.sessions ?? 0)}</td> : null}
              <td className="py-2.5 pr-3 text-right font-semibold tabular-nums">{fmtInt(r.signups)}</td>
              <td className="py-2.5 pr-3 text-right tabular-nums text-[#4a4862]">{fmtPct(r.signups, r.visitors)}</td>
              <td className="py-2.5 text-right tabular-nums">{fmtInt(r.paid)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {limit && items.length > limit ? (
        <p className="pt-2 text-[12px] text-[#66647c]">Top {limit} of {items.length}. The CSV has all of them.</p>
      ) : null}
    </div>
  );
}

export const ATTRIBUTION_NOTE =
  "Sign-ups and payments are credited to the entry page and source of the person's first session: the earliest visit (up to 30 days before the range) by the same anonymous daily visitor id that later browsed signed in as that user. Each person counts once per column. People with no such visit aren't in any row.";

export const VISITOR_NOTE =
  "Visitors are anonymous daily ids (a hash of IP, browser and a salt that changes every day), so someone who visits on three different days counts three times in a multi-day range.";
