import { NextResponse } from "next/server";
import { z } from "zod";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { csvResponse, toCsv } from "@/lib/admin-csv";
import { PLAN_GROUPS, REVENUE_DEFS, firstRecordDate, loadRevenue } from "@/lib/admin-revenue";
import { parseRange } from "@/lib/biz-metrics";
import { billingStatusDisplay, planLabel } from "@/lib/admin-labels";

const TABLES = ["kpis", "series", "plans", "codes", "time-to-purchase", "renewals", "churn", "customers"] as const;
type Table = (typeof TABLES)[number];

const querySchema = z.object({
  table: z.enum(TABLES),
  range: z.string().max(16).optional(),
  from: z.string().max(10).optional(),
  to: z.string().max(10).optional(),
});

const iso = (d: Date) => d.toISOString();
const money = (n: number | null) => (n === null ? "" : n.toFixed(2));
const planName = (p: string) => (p === "none" ? "Unknown" : planLabel(p));

/**
 * CSV of one table on Admin → Revenue, with the page's date range. Billing
 * permission; the customer list (emails) also needs a fresh password + code,
 * like the users export. Every export is audited.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Unknown table or range." }, { status: 400 });
  const { table, ...sp } = parsed.data;

  const { staff, error } = await adminApi("limits", { reauth: table === "customers" });
  if (error) return error;

  const now = Date.now();
  const range = parseRange(sp, now, sp.range === "all" ? await firstRecordDate() : null);
  const data = await loadRevenue(range, now);
  const csv = build(table, data);

  await recordAudit({
    actorId: staff.sub,
    action: "revenue.export",
    entity: "Revenue",
    diff: { table, from: range.fromKey, to: range.toKey },
    ip: getClientIp(req),
  });
  return csvResponse(`launchcv-revenue-${table}-${range.fromKey}-${range.toKey}.csv`, csv);
}

function build(table: Table, d: Awaited<ReturnType<typeof loadRevenue>>): string {
  const { cur, prev } = d.kpis;
  switch (table) {
    case "kpis": {
      const rows: [string, number | null, number | null, string][] = [
        ["Gross revenue at list (USD)", cur.grossUsd, prev?.grossUsd ?? null, REVENUE_DEFS.gross],
        ["Discounts given (USD)", cur.discountUsd, prev?.discountUsd ?? null, REVENUE_DEFS.discounts],
        ["Net revenue (USD)", cur.netUsd, prev?.netUsd ?? null, REVENUE_DEFS.net],
        ["Purchases", cur.purchases, prev?.purchases ?? null, REVENUE_DEFS.purchases],
        ["New paying customers", cur.newCustomers, prev?.newCustomers ?? null, REVENUE_DEFS.newCustomers],
        ["ARPPU (USD)", cur.arppu, prev?.arppu ?? null, REVENUE_DEFS.arppu],
        ["MRR (USD)", cur.mrr, prev?.mrr ?? null, REVENUE_DEFS.mrr],
        ["ARR run-rate (USD)", cur.arr, prev?.arr ?? null, REVENUE_DEFS.arr],
        ["Active passes", cur.activePasses, prev?.activePasses ?? null, REVENUE_DEFS.activePasses],
      ];
      return toCsv(
        ["metric", "value", "previous_period", "definition"],
        [...rows, ["Refunds", d.refundsTracked ? cur.refunds : null, d.refundsTracked ? (prev?.refunds ?? null) : null, d.refundsTracked ? REVENUE_DEFS.refunds : "Not tracked yet"]],
      );
    }
    case "series":
      return toCsv(
        ["period_start_utc", ...PLAN_GROUPS.map((g) => `${g.id}_usd`), "total_usd"],
        d.series.map((p) => [p.key, ...PLAN_GROUPS.map((g) => money(p.values[g.id])), money(Object.values(p.values).reduce((a, b) => a + b, 0))]),
      );
    case "plans":
      return toCsv(["plan", "purchases", "net_usd", "gross_usd", "share_of_net_pct"], d.planMix.map((p) => [planName(p.plan), p.purchases, money(p.netUsd), money(p.grossUsd), p.sharePct]));
    case "codes":
      return toCsv(
        ["code", "winback_group", "distinct_codes", "uses", "net_usd", "discount_usd", "gross_usd"],
        d.codes.map((c) => [c.code, c.winback ? "yes" : "no", c.codes, c.uses, money(c.netUsd), money(c.discountUsd), money(c.grossUsd)]),
      );
    case "time-to-purchase":
      return toCsv(["time_from_signup", "customers"], d.timeToPurchase.histogram.map((h) => [h.label, h.count]));
    case "renewals": {
      const r = d.renewals;
      return toCsv(
        ["row", "from_plan", "to_plan", "count", "revenue_usd"],
        [
          ["pass_buyers", "", "", r.passBuyers, ""],
          ["bought_again", "", "", r.boughtAgain, ""],
          ["next_was_pass", "", "", r.renewedPass, ""],
          ["next_was_pro", "", "", r.switchedToPro, ""],
          ...r.transitions.map((t) => ["transition", planName(t.from), planName(t.to), t.purchases, money(t.revenueUsd)] as (string | number)[]),
        ],
      );
    }
    case "churn":
      return toCsv(["month", "active_at_start", "churned", "scheduled", "churn_rate_pct"], d.churn.map((c) => [c.month, c.activeAtStart, c.churned, c.scheduled, c.ratePct ?? ""]));
    case "customers":
      return toCsv(
        ["user_id", "email", "name", "latest_plan", "purchases", "paid_to_date_usd", "first_purchase_utc", "last_purchase_utc", "status", "new_in_range"],
        d.customers.map((c) => [
          c.userId,
          c.email,
          c.name,
          planName(c.plan),
          c.purchases,
          money(c.paidUsd),
          iso(c.firstAt),
          iso(c.lastAt),
          c.status === "none" ? "No access" : billingStatusDisplay(c.status).label,
          c.newInRange ? "yes" : "no",
        ]),
      );
  }
}
