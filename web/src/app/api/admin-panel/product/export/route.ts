import { NextResponse } from "next/server";
import { z } from "zod";
import { adminApi } from "@/lib/admin-api";
import { recordAudit } from "@/lib/cms/audit";
import { getClientIp } from "@/lib/request-ip";
import { csvResponse, toCsv } from "@/lib/admin-csv";
import { RETENTION_WEEKS, loadProduct } from "@/lib/admin-product";
import { firstRecordDate } from "@/lib/admin-revenue";
import { parseRange } from "@/lib/biz-metrics";
import { planLabel } from "@/lib/admin-labels";

const TABLES = ["funnel", "cohorts", "features", "exports", "free-tools", "economics", "top-users"] as const;
type Table = (typeof TABLES)[number];

const querySchema = z.object({
  table: z.enum(TABLES),
  range: z.string().max(16).optional(),
  from: z.string().max(10).optional(),
  to: z.string().max(10).optional(),
});

const usd = (n: number | null, digits = 4) => (n === null ? "" : n.toFixed(digits));

/**
 * CSV of one table on Admin → Product, with the page's date range. Billing
 * permission; the top-users list (emails) also needs a fresh password + code.
 * Every export is audited.
 */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const parsed = querySchema.safeParse(Object.fromEntries(url.searchParams));
  if (!parsed.success) return NextResponse.json({ error: "Unknown table or range." }, { status: 400 });
  const { table, ...sp } = parsed.data;

  const { staff, error } = await adminApi("limits", { reauth: table === "top-users" });
  if (error) return error;

  const now = Date.now();
  const range = parseRange(sp, now, sp.range === "all" ? await firstRecordDate() : null);
  const data = await loadProduct(range, now);
  const csv = build(table, data);

  await recordAudit({
    actorId: staff.sub,
    action: "product.export",
    entity: "Product",
    diff: { table, from: range.fromKey, to: range.toKey },
    ip: getClientIp(req),
  });
  return csvResponse(`launchcv-product-${table}-${range.fromKey}-${range.toKey}.csv`, csv);
}

function build(table: Table, d: Awaited<ReturnType<typeof loadProduct>>): string {
  switch (table) {
    case "funnel":
      return toCsv(
        ["step", "optional", "compared_with", "users", "pct_of_previous", "pct_of_signups", "median_hours_from_previous", "definition"],
        d.funnel.map((s) => [s.label, s.optional ? "yes" : "no", s.baseKey ?? "", s.users, s.pctOfPrev ?? "", s.pctOfFirst ?? "", s.medianFromPrevMs === null ? "" : (s.medianFromPrevMs / 3_600_000).toFixed(2), s.def]),
      );
    case "cohorts":
      return toCsv(
        ["cohort_week_utc", "users", ...Array.from({ length: RETENTION_WEEKS + 1 }, (_, w) => `week_${w}_pct`)],
        d.cohorts.map((c) => [c.cohort, c.size, ...c.pct.map((p) => (p === null ? "" : p))]),
      );
    case "features":
      return toCsv(
        ["tool", "label", "users", "calls", "calls_per_user", "error_rate_pct", "avg_cost_usd", "cost_usd"],
        d.features.map((f) => [f.tool, f.label, f.users, f.calls, f.callsPerUser ?? "", f.errorRatePct ?? "", usd(f.avgCostUsd, 6), usd(f.costUsd)]),
      );
    case "exports":
      return toCsv(["event", "label", "users", "count"], d.exports.map((e) => [e.key, e.label, e.users ?? "", e.count]));
    case "free-tools":
      return toCsv(["tool", "label", "count"], d.freeTools.map((e) => [e.key, e.label, e.count]));
    case "economics":
      return toCsv(
        ["plan", "ai_users", "calls", "ai_cost_usd", "cost_per_user_usd", "revenue_usd", "gross_margin_pct"],
        [
          ...d.economics.map((e) => [planLabel(e.plan), e.aiUsers, e.calls, usd(e.costUsd), usd(e.costPerUser), e.plan === "none" ? "" : e.revenueUsd.toFixed(2), e.marginPct ?? ""]),
          ["Anonymous", "", d.anonymousCalls, usd(d.anonymousCostUsd), "", "", ""],
        ],
      );
    case "top-users":
      return toCsv(
        ["user_id", "email", "plan", "calls", "ai_cost_usd", "ai_cost_to_date_usd", "paid_to_date_usd", "margin_pct"],
        d.topUsers.map((u) => [u.userId, u.email, planLabel(u.plan), u.calls, usd(u.costUsd), usd(u.costToDateUsd), u.paidToDateUsd.toFixed(2), u.marginPct ?? ""]),
      );
  }
}
