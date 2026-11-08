import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { ExportCsvButton } from "@/components/admin/export-csv-button";
import { BarList, Defined, MetricTile, NoData, RangeBar, StackedBarChart } from "@/components/admin/biz-ui";
import { AdminPageHeader, cellMain, cellMuted, cellSub, cellText, rowLink, tableCls, tdCls, thCls } from "@/components/admin/v5/ui";
import { PLAN_GROUPS, REVENUE_DEFS, firstRecordDate, loadRevenue, planGroupOf, type CustomerRow } from "@/lib/admin-revenue";
import { delta, fmtDuration, fmtPct, fmtUsd, parseRange, rangeQuery } from "@/lib/biz-metrics";
import { billingStatusDisplay, planLabel } from "@/lib/admin-labels";
import { fmtDate } from "@/lib/admin-dates";

export const dynamic = "force-dynamic";

const BASE = "/admin-panel/revenue";

function requestNow() {
  return Date.now();
}

const MONTH_FMT = new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" });

export default async function AdminRevenuePage({ searchParams }: { searchParams: Promise<{ range?: string; from?: string; to?: string }> }) {
  // Revenue is billing data: the same permission as Subscriptions (owner, admin, support).
  const admin = await requireAdmin("limits");
  if (!admin) redirect("/admin-panel/access-denied");

  const sp = await searchParams;
  const now = requestNow();
  const range = parseRange(sp, now, sp.range === "all" ? await firstRecordDate() : null);
  const data = await loadRevenue(range, now);
  const { cur, prev } = data.kpis;
  const q = rangeQuery(range);
  const rangeText = range.preset === "custom" ? range.label : range.label.toLowerCase();
  const exp = (table: string) => `/api/admin-panel/revenue/export?table=${table}&${q}`;
  const file = (table: string) => `launchcv-revenue-${table}-${range.fromKey}-${range.toKey}.csv`;
  const atLabel = data.kpis.pointInTime.getTime() >= now - 60_000 ? "now" : `on ${fmtDate(new Date(data.kpis.pointInTime.getTime() - 1), now)}`;

  const seriesTotal = data.series.reduce((a, p) => a + Object.values(p.values).reduce((x, y) => x + y, 0), 0);
  const busiest = data.series.reduce<{ key: string; v: number } | null>((best, p) => {
    const v = Object.values(p.values).reduce((x, y) => x + y, 0);
    return v > (best?.v ?? 0) ? { key: p.key, v } : best;
  }, null);
  const seriesSummary =
    seriesTotal > 0
      ? `${fmtUsd(seriesTotal)} net revenue ${rangeText}, by ${range.bucket}. Best ${range.bucket}: ${range.bucket === "week" ? "week of " : ""}${fmtDate(busiest!.key, now)} with ${fmtUsd(busiest!.v)}.`
      : "No purchases in this range.";

  const r = data.renewals;
  const customerColumns: DataTableColumn<CustomerRow>[] = [
    {
      key: "user",
      header: "Customer",
      render: (c) => (
        <div className="min-w-0">
          <p className={`truncate ${cellMain}`}>{c.email}</p>
          {c.name ? <p className={`truncate ${cellSub}`}>{c.name}</p> : null}
        </div>
      ),
    },
    {
      key: "plan",
      header: "Latest plan",
      render: (c) => (
        <span className={`whitespace-nowrap ${cellText}`}>
          {planLabel(c.plan === "none" ? "none" : c.plan).replace(/^Free$/, "Unknown")}
          {c.newInRange ? (
            <span className="ml-1.5">
              <StatusBadge tone="violet">New</StatusBadge>
            </span>
          ) : null}
        </span>
      ),
    },
    { key: "paid", header: "Paid to date", align: "right", render: (c) => <span className={cellMain}>{fmtUsd(c.paidUsd)}</span> },
    { key: "n", header: "Purchases", align: "right", render: (c) => <span className={cellText}>{c.purchases}</span> },
    { key: "first", header: "First purchase", render: (c) => <span className={`whitespace-nowrap ${cellMuted}`}>{fmtDate(c.firstAt, now)}</span> },
    { key: "last", header: "Last purchase", render: (c) => <span className={`whitespace-nowrap ${cellMuted}`}>{fmtDate(c.lastAt, now)}</span> },
    {
      key: "status",
      header: "Status",
      render: (c) => {
        const s = billingStatusDisplay(c.status);
        return <StatusBadge tone={s.tone}>{c.status === "none" ? "No access" : s.label}</StatusBadge>;
      },
    },
    {
      key: "view",
      header: "Actions",
      align: "right",
      render: (c) =>
        c.email === "deleted user" ? (
          <span className={cellMuted}>—</span>
        ) : (
          <Link href={`/admin-panel/users/${c.userId}`} className={rowLink} aria-label={`View ${c.email}`}>
            View
          </Link>
        ),
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="Revenue">
      <div className="space-y-5">
        <AdminPageHeader
          title="Revenue"
          description={`Purchases recorded from Polar, ${rangeText}. USD, after discounts, before tax. Deltas compare with the ${range.days}-day period before.`}
          actions={<RangeBar basePath={BASE} range={range} />}
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
          <MetricTile featured label="Net revenue" value={fmtUsd(cur.netUsd)} def={REVENUE_DEFS.net} delta={delta(cur.netUsd, prev?.netUsd ?? null)} hint={data.listPricedPurchases ? `${data.listPricedPurchases} valued at list price` : undefined} />
          <MetricTile label="Gross at list" value={fmtUsd(cur.grossUsd)} def={REVENUE_DEFS.gross} delta={delta(cur.grossUsd, prev?.grossUsd ?? null)} />
          <MetricTile label="Discounts given" value={fmtUsd(cur.discountUsd)} def={REVENUE_DEFS.discounts} delta={delta(cur.discountUsd, prev?.discountUsd ?? null, false)} hint={cur.grossUsd > 0 ? `${fmtPct((cur.discountUsd / cur.grossUsd) * 100)} of gross` : undefined} />
          <MetricTile label="Purchases" value={cur.purchases.toLocaleString("en-US")} def={REVENUE_DEFS.purchases} delta={delta(cur.purchases, prev?.purchases ?? null)} />
          <MetricTile label="New paying customers" value={cur.newCustomers.toLocaleString("en-US")} def={REVENUE_DEFS.newCustomers} delta={delta(cur.newCustomers, prev?.newCustomers ?? null)} hint={`${cur.payingUsers} paying in total`} />
          <MetricTile label="ARPPU" value={fmtUsd(cur.arppu)} def={REVENUE_DEFS.arppu} delta={cur.arppu !== null ? delta(cur.arppu, prev ? (prev.arppu ?? 0) : null) : null} />
          <MetricTile label="MRR" value={fmtUsd(cur.mrr)} def={REVENUE_DEFS.mrr} delta={delta(cur.mrr, prev?.mrr ?? null)} hint={`Pro subscriptions, ${atLabel}`} />
          <MetricTile label="ARR run-rate" value={fmtUsd(cur.arr)} def={REVENUE_DEFS.arr} delta={delta(cur.arr, prev?.arr ?? null)} />
          <MetricTile label="Active passes" value={cur.activePasses.toLocaleString("en-US")} def={REVENUE_DEFS.activePasses} delta={delta(cur.activePasses, prev?.activePasses ?? null)} hint={atLabel === "now" ? "Running now" : `Running ${atLabel}`} />
          <MetricTile
            label="Refunds"
            value={data.refundsTracked ? cur.refunds.toLocaleString("en-US") : <span className="text-[20px] text-[#66647c]">Not tracked yet</span>}
            def={REVENUE_DEFS.refunds}
            hint={data.refundsTracked ? undefined : "Check refunds in Polar"}
          />
        </div>

        <SectionCard
          title={`Revenue per ${range.bucket}`}
          description="Net revenue (after discounts), stacked by plan. Hover a column for its breakdown."
          action={<ExportCsvButton href={exp("series")} filename={file("series")} label="revenue per period" />}
        >
          {seriesTotal > 0 ? (
            <StackedBarChart points={data.series} groups={PLAN_GROUPS} fmt={fmtUsd} summary={seriesSummary} bucket={range.bucket} />
          ) : (
            <NoData />
          )}
        </SectionCard>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard
            title="Plan mix"
            description="Purchases and net revenue by plan in the range."
            action={<ExportCsvButton href={exp("plans")} filename={file("plans")} label="plan mix" />}
          >
            {data.planMix.length ? (
              <BarList
                rows={data.planMix.map((p) => ({
                  key: p.plan,
                  label: p.plan === "none" ? <Defined label="Unknown plan" def="A purchase event without a plan whose buyer has no billing row." /> : planLabel(p.plan),
                  value: p.netUsd,
                  display: fmtUsd(p.netUsd),
                  sub: `${p.purchases} purchase${p.purchases === 1 ? "" : "s"} · ${fmtPct(p.sharePct)} of net revenue · ${fmtUsd(p.grossUsd)} at list`,
                  color: PLAN_GROUPS.find((g) => g.id === planGroupOf(p.plan))?.color,
                }))}
              />
            ) : (
              <NoData />
            )}
          </SectionCard>

          <SectionCard
            title="Discount codes"
            description={
              data.codeSummary.total
                ? `${data.codeSummary.withCode} of ${data.codeSummary.total} purchases used a code. Win-back codes grouped.`
                : "Codes used on purchases in the range."
            }
            action={<ExportCsvButton href={exp("codes")} filename={file("codes")} label="discount codes" />}
          >
            {data.codes.length ? (
              <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Discount codes">
                <table className={tableCls}>
                  <thead>
                    <tr>
                      <th scope="col" className={thCls}>Code</th>
                      <th scope="col" className={`${thCls} text-right`}>Uses</th>
                      <th scope="col" className={`${thCls} text-right`}>
                        <Defined label="Revenue" def="Net amount paid on purchases with this code." />
                      </th>
                      <th scope="col" className={`${thCls} text-right`}>
                        <Defined label="Discount" def="Total discount given with this code." />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.codes.map((c) => (
                      <tr key={c.code}>
                        <td className={tdCls}>
                          {c.winback ? (
                            <span className="inline-flex items-center gap-1.5">
                              <StatusBadge tone="violet">Win-back</StatusBadge>
                              <span className={cellMuted}>
                                {c.codes} personal code{c.codes === 1 ? "" : "s"}
                              </span>
                            </span>
                          ) : (
                            <span className="lc-mono text-[13px] font-semibold">{c.code}</span>
                          )}
                        </td>
                        <td className={`${tdCls} text-right tabular-nums`}>{c.uses}</td>
                        <td className={`${tdCls} text-right font-semibold tabular-nums`}>{fmtUsd(c.netUsd)}</td>
                        <td className={`${tdCls} text-right tabular-nums text-[#a15c00]`}>{fmtUsd(c.discountUsd)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <NoData>{data.codeSummary.total ? "No discount codes used in this range." : "No data yet"}</NoData>
            )}
          </SectionCard>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard
            title="Time from sign-up to first purchase"
            description={
              data.timeToPurchase.customers
                ? `${data.timeToPurchase.customers} new customer${data.timeToPurchase.customers === 1 ? "" : "s"} in the range · median ${fmtDuration(data.timeToPurchase.medianMs)}.`
                : "For customers whose first purchase is in the range."
            }
            action={<ExportCsvButton href={exp("time-to-purchase")} filename={file("time-to-purchase")} label="time to first purchase" />}
          >
            {data.timeToPurchase.customers ? (
              <BarList
                color="#14a38b"
                rows={data.timeToPurchase.histogram.map((h) => ({
                  key: h.label,
                  label: h.label,
                  value: h.count,
                  display: `${h.count} · ${fmtPct((h.count / data.timeToPurchase.customers) * 100, 0)}`,
                }))}
              />
            ) : (
              <NoData />
            )}
          </SectionCard>

          <SectionCard
            title="Pass renewals"
            description="Pass buyers in the range and what they bought next."
            action={<ExportCsvButton href={exp("renewals")} filename={file("renewals")} label="pass renewals" />}
          >
            {r.passBuyers ? (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { l: "Pass buyers", v: r.passBuyers, d: "Distinct users who bought a Week or 90-Day Pass in the range." },
                    { l: "Bought another pass", v: r.renewedPass, d: "Their next purchase after that pass was another pass." },
                    { l: "Switched to Pro", v: r.switchedToPro, d: "Their next purchase after that pass was a monthly subscription." },
                  ].map((x) => (
                    <div key={x.l} className="rounded-[16px] bg-[#f7f6fb] p-3">
                      <p className="text-[12px] text-[#4a4862]">
                        <Defined label={x.l} def={x.d} />
                      </p>
                      <p className="mt-0.5 text-[24px] font-extrabold tabular-nums text-[#121226]">{x.v}</p>
                      {x.l !== "Pass buyers" ? <p className="text-[12px] font-bold text-[#66647c]">{fmtPct((x.v / r.passBuyers) * 100)}</p> : null}
                    </div>
                  ))}
                </div>
                {r.transitions.length ? (
                  <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Repeat purchases after a pass">
                    <table className={tableCls}>
                      <thead>
                        <tr>
                          <th scope="col" className={thCls}>
                            <Defined label="After a pass" def="Repeat purchases in the range whose previous purchase by the same user was a pass." />
                          </th>
                          <th scope="col" className={`${thCls} text-right`}>Purchases</th>
                          <th scope="col" className={`${thCls} text-right`}>Revenue</th>
                        </tr>
                      </thead>
                      <tbody>
                        {r.transitions.map((t) => (
                          <tr key={`${t.from}-${t.to}`}>
                            <td className={tdCls}>
                              {planLabel(t.from)} → {planLabel(t.to).replace(/^Free$/, "Unknown")}
                            </td>
                            <td className={`${tdCls} text-right tabular-nums`}>{t.purchases}</td>
                            <td className={`${tdCls} text-right font-semibold tabular-nums`}>{fmtUsd(t.revenueUsd)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-[13px] text-[#66647c]">No repeat purchases after a pass in this range yet.</p>
                )}
              </div>
            ) : (
              <NoData />
            )}
          </SectionCard>
        </div>

        <SectionCard
          title="Pro churn"
          description="Monthly subscriptions by the month their paid period ended. A subscription later replaced by a pass isn't counted."
          action={<ExportCsvButton href={exp("churn")} filename={file("churn")} label="Pro churn" />}
        >
          {data.churn.some((c) => c.activeAtStart || c.churned || c.scheduled) ? (
            <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Pro churn by month">
              <table className={tableCls}>
                <thead>
                  <tr>
                    <th scope="col" className={thCls}>Month</th>
                    <th scope="col" className={`${thCls} text-right`}>
                      <Defined label="Active at start" def="Monthly subscriptions running on the 1st (first recorded payment before it, not yet ended)." />
                    </th>
                    <th scope="col" className={`${thCls} text-right`}>
                      <Defined label="Churned" def="Cancelled, revoked or unpaid subscriptions whose paid period ended in the month." />
                    </th>
                    <th scope="col" className={`${thCls} text-right`}>
                      <Defined label="Scheduled" def="Set to cancel, with the paid period ending later this month." />
                    </th>
                    <th scope="col" className={`${thCls} text-right`}>
                      <Defined label="Churn rate" def="Churned ÷ active at the start of the month." />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[...data.churn].reverse().map((c) => (
                    <tr key={c.month}>
                      <td className={tdCls}>{MONTH_FMT.format(new Date(`${c.month}-01T00:00:00Z`))}</td>
                      <td className={`${tdCls} text-right tabular-nums`}>{c.activeAtStart}</td>
                      <td className={`${tdCls} text-right font-semibold tabular-nums`}>{c.churned}</td>
                      <td className={`${tdCls} text-right tabular-nums`}>{c.scheduled || "—"}</td>
                      <td className={`${tdCls} text-right tabular-nums`}>{fmtPct(c.ratePct)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NoData />
          )}
        </SectionCard>

        <div className="space-y-3 pt-2">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#121226]">Customers</h2>
              <p className="mt-1 text-[14px] text-[#4a4862]">
                Everyone who paid in the range ({data.customers.length}). Paid to date counts all their purchases up to the range end; status is their access now.
              </p>
            </div>
            <ExportCsvButton href={exp("customers")} filename={file("customers")} label="customers" />
          </div>
          <DataTable
            columns={customerColumns}
            rows={data.customers.slice(0, 200)}
            rowKey={(c) => c.userId}
            emptyTitle="No data yet"
            emptyDescription="Customers appear here once someone pays in the selected range."
          />
          {data.customers.length > 200 ? <p className={cellMuted}>Showing the top 200 by amount paid. The CSV has all {data.customers.length}.</p> : null}
        </div>
      </div>
    </AdminShell>
  );
}
