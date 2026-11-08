import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { ExportCsvButton } from "@/components/admin/export-csv-button";
import { BarList, Defined, MetricTile, NoData, RangeBar, heatColor } from "@/components/admin/biz-ui";
import { AdminPageHeader, cellMuted, tableCls, tdCls, thCls } from "@/components/admin/v5/ui";
import { MAX_COHORTS, PRODUCT_DEFS, RETENTION_WEEKS, loadProduct } from "@/lib/admin-product";
import { firstRecordDate } from "@/lib/admin-revenue";
import { fmtCost, fmtDuration, fmtPct, fmtUsd, grossMarginPct, parseRange, rangeQuery } from "@/lib/biz-metrics";
import { planLabel } from "@/lib/admin-labels";
import { fmtDate } from "@/lib/admin-dates";

export const dynamic = "force-dynamic";

const BASE = "/admin-panel/product";

function requestNow() {
  return Date.now();
}

const marginTone = (m: number | null) => (m === null ? "text-[#66647c]" : m < 0 ? "text-[#a3262b]" : m < 50 ? "text-[#a15c00]" : "text-[#0b7a4f]");

export default async function AdminProductPage({ searchParams }: { searchParams: Promise<{ range?: string; from?: string; to?: string }> }) {
  // Shows revenue, margins and user emails: the billing permission, like Revenue and Subscriptions.
  const admin = await requireAdmin("limits");
  if (!admin) redirect("/admin-panel/access-denied");

  const sp = await searchParams;
  const now = requestNow();
  const range = parseRange(sp, now, sp.range === "all" ? await firstRecordDate() : null);
  const data = await loadProduct(range, now);
  const q = rangeQuery(range);
  const rangeText = range.preset === "custom" ? range.label : range.label.toLowerCase();
  const exp = (table: string) => `/api/admin-panel/product/export?table=${table}&${q}`;
  const file = (table: string) => `launchcv-product-${table}-${range.fromKey}-${range.toKey}.csv`;

  const signups = data.funnel[0]?.users ?? 0;
  const maxFunnel = Math.max(1, signups);
  const revenue = data.economics.reduce((a, r) => a + r.revenueUsd, 0);
  const overallMargin = grossMarginPct(revenue, data.totalCostUsd);
  const freeCost = data.freeSignedInCostUsd + data.anonymousCostUsd;

  return (
    <AdminShell email={admin.email} pageTitle="Product">
      <div className="space-y-5">
        <AdminPageHeader
          title="Product"
          description={`Activation, retention, feature use and AI unit economics for ${rangeText}. Staff accounts are left out of sign-up based numbers.`}
          actions={<RangeBar basePath={BASE} range={range} />}
        />

        <SectionCard
          title="Activation funnel"
          description={`${signups.toLocaleString("en-US")} people signed up in the range. Each step counts people who have reached it, and every required step before it, by now.`}
          action={<ExportCsvButton href={exp("funnel")} filename={file("funnel")} label="activation funnel" />}
        >
          {signups ? (
            <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Activation funnel">
              <table className={`${tableCls} min-w-[640px]`}>
                <thead>
                  <tr>
                    <th scope="col" className={thCls}>Step</th>
                    <th scope="col" className={`${thCls} w-[38%]`}>
                      <span className="sr-only">Bar</span>
                    </th>
                    <th scope="col" className={`${thCls} text-right`}>Users</th>
                    <th scope="col" className={`${thCls} text-right`}>
                      <Defined label="Step %" def="Users at this step ÷ users at the previous required step." />
                    </th>
                    <th scope="col" className={`${thCls} text-right`}>
                      <Defined label="Of sign-ups" def="Users at this step ÷ sign-ups." />
                    </th>
                    <th scope="col" className={`${thCls} text-right`}>
                      <Defined label="Median time" def="Median time from the previous required step, among users who did this step after it." />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.funnel.map((s, i) => (
                    <tr key={s.key}>
                      <td className={`${tdCls} whitespace-nowrap font-semibold`}>
                        <Defined label={s.label} def={s.def} />
                        {s.optional ? <span className="ml-1.5 text-[12px] font-semibold text-[#66647c]">optional</span> : null}
                      </td>
                      <td className={tdCls}>
                        <div className="h-6 overflow-hidden rounded-lg bg-[#f1eff8]" aria-hidden="true">
                          <div className="h-full rounded-lg bg-[#5440e8]" style={{ width: `${(s.users / maxFunnel) * 100}%`, opacity: s.optional ? 0.45 : 1 - i * 0.08 }} />
                        </div>
                      </td>
                      <td className={`${tdCls} text-right font-bold tabular-nums`}>{s.users.toLocaleString("en-US")}</td>
                      <td className={`${tdCls} text-right tabular-nums`}>{i === 0 ? "—" : fmtPct(s.pctOfPrev)}</td>
                      <td className={`${tdCls} text-right tabular-nums`}>{fmtPct(s.pctOfFirst)}</td>
                      <td className={`${tdCls} whitespace-nowrap text-right tabular-nums`}>{i === 0 ? "—" : fmtDuration(s.medianFromPrevMs)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data.funnelCapped ? <p className={`mt-2 ${cellMuted}`}>Only the newest 50,000 sign-ups are included.</p> : null}
            </div>
          ) : (
            <NoData />
          )}
        </SectionCard>

        <SectionCard
          title="Weekly retention"
          description={`Sign-up cohorts by week (newest ${MAX_COHORTS} in the range) × weeks since sign-up. Blank cells are weeks that haven't started.`}
          action={<ExportCsvButton href={exp("cohorts")} filename={file("cohorts")} label="retention cohorts" />}
        >
          {data.cohorts.length ? (
            <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Weekly retention by sign-up cohort">
              <table className="w-full min-w-[720px] border-separate border-spacing-[3px] text-[13px]">
                <thead>
                  <tr>
                    <th scope="col" className="px-2 py-2 text-left text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">
                      <Defined label="Cohort" def={PRODUCT_DEFS.retention} />
                    </th>
                    <th scope="col" className="px-2 py-2 text-right text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">Users</th>
                    {Array.from({ length: RETENTION_WEEKS + 1 }, (_, w) => (
                      <th key={w} scope="col" className="px-1 py-2 text-center text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">
                        W{w}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.cohorts.map((c) => (
                    <tr key={c.cohort}>
                      <th scope="row" className="whitespace-nowrap px-2 py-1.5 text-left font-semibold text-[#121226]">
                        Week of {fmtDate(c.cohort, now)}
                      </th>
                      <td className="px-2 py-1.5 text-right tabular-nums text-[#121226]">{c.size}</td>
                      {c.pct.map((p, w) =>
                        p === null ? (
                          <td key={w} className="rounded-md bg-[#f7f6fb]" aria-label="Not started" />
                        ) : (
                          <td
                            key={w}
                            className="rounded-md px-1 py-1.5 text-center font-semibold tabular-nums"
                            style={heatColor(p)}
                            title={`${c.users[w]} of ${c.size} active`}
                          >
                            {fmtPct(p, 0)}
                          </td>
                        ),
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NoData />
          )}
        </SectionCard>

        <SectionCard
          title="Feature adoption: AI tools"
          description="Every AI call in the range, by tool."
          action={<ExportCsvButton href={exp("features")} filename={file("features")} label="AI tool adoption" />}
        >
          {data.features.length ? (
            <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="AI tool adoption">
              <table className={tableCls}>
                <thead>
                  <tr>
                    <th scope="col" className={thCls}>Tool</th>
                    <th scope="col" className={`${thCls} text-right`}>
                      <Defined label="Users" def={PRODUCT_DEFS.toolUsers} />
                    </th>
                    <th scope="col" className={`${thCls} text-right`}>
                      <Defined label="Calls" def={PRODUCT_DEFS.calls} />
                    </th>
                    <th scope="col" className={`${thCls} text-right`}>
                      <Defined label="Calls / user" def="Calls by signed-in users ÷ users. Anonymous calls make this look higher." />
                    </th>
                    <th scope="col" className={`${thCls} text-right`}>
                      <Defined label="Error rate" def={PRODUCT_DEFS.errorRate} />
                    </th>
                    <th scope="col" className={`${thCls} text-right`}>
                      <Defined label="Avg cost" def={PRODUCT_DEFS.avgCost} />
                    </th>
                    <th scope="col" className={`${thCls} text-right`}>Spend</th>
                  </tr>
                </thead>
                <tbody>
                  {data.features.map((f) => (
                    <tr key={f.tool}>
                      <td className={`${tdCls} font-semibold`}>{f.label}</td>
                      <td className={`${tdCls} text-right tabular-nums`}>{f.users.toLocaleString("en-US")}</td>
                      <td className={`${tdCls} text-right tabular-nums`}>{f.calls.toLocaleString("en-US")}</td>
                      <td className={`${tdCls} text-right tabular-nums`}>{f.callsPerUser ?? "—"}</td>
                      <td className={`${tdCls} text-right tabular-nums ${(f.errorRatePct ?? 0) >= 5 ? "font-bold text-[#a3262b]" : ""}`}>{fmtPct(f.errorRatePct)}</td>
                      <td className={`${tdCls} text-right tabular-nums`}>{fmtCost(f.avgCostUsd)}</td>
                      <td className={`${tdCls} text-right font-semibold tabular-nums`}>{fmtCost(f.costUsd)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <NoData />
          )}
        </SectionCard>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard
            title="Resume exports"
            description="Downloads in the range."
            action={<ExportCsvButton href={exp("exports")} filename={file("exports")} label="resume exports" />}
          >
            {data.exports.some((e) => e.count) ? (
              <BarList
                rows={data.exports.map((e) => ({
                  key: e.key,
                  label: <Defined label={e.label} def={PRODUCT_DEFS.exports} />,
                  value: e.count,
                  display: e.count.toLocaleString("en-US"),
                  sub: `${e.users ?? 0} user${e.users === 1 ? "" : "s"}`,
                }))}
              />
            ) : (
              <NoData />
            )}
          </SectionCard>
          <SectionCard
            title="Free tools"
            description="Uses of the public free tools in the range."
            action={<ExportCsvButton href={exp("free-tools")} filename={file("free-tools")} label="free tools" />}
          >
            {data.freeTools.some((e) => e.count) ? (
              <BarList
                color="#ff7a33"
                rows={data.freeTools.map((e) => ({
                  key: e.key,
                  label: <Defined label={e.label} def={PRODUCT_DEFS.freeTools} />,
                  value: e.count,
                  display: e.count.toLocaleString("en-US"),
                }))}
              />
            ) : (
              <NoData />
            )}
          </SectionCard>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#121226]">Unit economics</h2>
            <p className="mt-1 text-[14px] text-[#4a4862]">AI spend next to revenue. AI is the only cost counted here.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <MetricTile featured label="AI spend" value={fmtCost(data.totalCostUsd)} def={PRODUCT_DEFS.totalCost} hint={range.label} />
            <MetricTile label="Net revenue" value={fmtUsd(revenue)} def="Net purchase revenue in the range (same as Admin → Revenue)." />
            <MetricTile
              label="Gross margin"
              value={<span className={marginTone(overallMargin)}>{fmtPct(overallMargin)}</span>}
              def={PRODUCT_DEFS.margin}
              hint={overallMargin === null ? "No revenue in this range" : undefined}
            />
            <MetricTile
              label="Cost of free users"
              value={fmtCost(freeCost)}
              def={PRODUCT_DEFS.freeCost}
              hint={`${fmtCost(data.freeSignedInCostUsd)} signed in · ${fmtCost(data.anonymousCostUsd)} anonymous`}
            />
          </div>

          <SectionCard
            title="By plan"
            description="AI spend per user on each plan against that plan's revenue in the range."
            action={<ExportCsvButton href={exp("economics")} filename={file("economics")} label="unit economics by plan" />}
          >
            {data.economics.length ? (
              <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Unit economics by plan">
                <table className={tableCls}>
                  <thead>
                    <tr>
                      <th scope="col" className={thCls}>
                        <Defined label="Plan" def={PRODUCT_DEFS.planRow} />
                      </th>
                      <th scope="col" className={`${thCls} text-right`}>AI users</th>
                      <th scope="col" className={`${thCls} text-right`}>Calls</th>
                      <th scope="col" className={`${thCls} text-right`}>AI spend</th>
                      <th scope="col" className={`${thCls} text-right`}>
                        <Defined label="Cost / user" def="AI spend ÷ users of this plan with at least one AI call." />
                      </th>
                      <th scope="col" className={`${thCls} text-right`}>Revenue</th>
                      <th scope="col" className={`${thCls} text-right`}>
                        <Defined label="Margin" def={PRODUCT_DEFS.margin} />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.economics.map((e) => (
                      <tr key={e.plan}>
                        <td className={`${tdCls} font-semibold`}>{planLabel(e.plan)}</td>
                        <td className={`${tdCls} text-right tabular-nums`}>{e.aiUsers}</td>
                        <td className={`${tdCls} text-right tabular-nums`}>{e.calls.toLocaleString("en-US")}</td>
                        <td className={`${tdCls} text-right tabular-nums`}>{fmtCost(e.costUsd)}</td>
                        <td className={`${tdCls} text-right tabular-nums`}>{fmtCost(e.costPerUser)}</td>
                        <td className={`${tdCls} text-right tabular-nums`}>{e.plan === "none" ? "—" : fmtUsd(e.revenueUsd)}</td>
                        <td className={`${tdCls} text-right font-bold tabular-nums ${marginTone(e.marginPct)}`}>{e.plan === "none" ? "Cost only" : fmtPct(e.marginPct)}</td>
                      </tr>
                    ))}
                    {data.anonymousCalls ? (
                      <tr>
                        <td className={`${tdCls} font-semibold`}>
                          <Defined label="Anonymous" def="AI calls without a signed-in user (public free tools)." />
                        </td>
                        <td className={`${tdCls} text-right tabular-nums`}>—</td>
                        <td className={`${tdCls} text-right tabular-nums`}>{data.anonymousCalls.toLocaleString("en-US")}</td>
                        <td className={`${tdCls} text-right tabular-nums`}>{fmtCost(data.anonymousCostUsd)}</td>
                        <td className={`${tdCls} text-right tabular-nums`}>—</td>
                        <td className={`${tdCls} text-right tabular-nums`}>—</td>
                        <td className={`${tdCls} text-right font-bold text-[#66647c]`}>Cost only</td>
                      </tr>
                    ) : null}
                  </tbody>
                </table>
              </div>
            ) : (
              <NoData />
            )}
          </SectionCard>

          <SectionCard
            title="Top 20 users by AI spend"
            description="Spot heavy or abusive use. A negative margin means a user cost more in AI than they ever paid."
            action={<ExportCsvButton href={exp("top-users")} filename={file("top-users")} label="top users by AI spend" />}
          >
            {data.topUsers.length ? (
              <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Top users by AI spend">
                <table className={tableCls}>
                  <thead>
                    <tr>
                      <th scope="col" className={thCls}>
                        <Defined label="User" def={PRODUCT_DEFS.topUsers} />
                      </th>
                      <th scope="col" className={thCls}>Plan</th>
                      <th scope="col" className={`${thCls} text-right`}>Calls</th>
                      <th scope="col" className={`${thCls} text-right`}>AI spend</th>
                      <th scope="col" className={`${thCls} text-right`}>
                        <Defined label="Spend to date" def="All AI spend of this user up to the range end." />
                      </th>
                      <th scope="col" className={`${thCls} text-right`}>
                        <Defined label="Paid to date" def="Everything this user paid up to the range end." />
                      </th>
                      <th scope="col" className={`${thCls} text-right`}>
                        <Defined label="Margin" def="(Paid to date − spend to date) ÷ paid to date. Free users have no margin." />
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topUsers.map((u) => (
                      <tr key={u.userId}>
                        <td className={`${tdCls} max-w-[260px] truncate`}>
                          {u.email === "deleted user" ? (
                            "deleted user"
                          ) : (
                            <Link href={`/admin-panel/users/${u.userId}`} className="font-semibold hover:text-[#5440e8]">
                              {u.email}
                            </Link>
                          )}
                        </td>
                        <td className={`${tdCls} whitespace-nowrap`}>{planLabel(u.plan)}</td>
                        <td className={`${tdCls} text-right tabular-nums`}>{u.calls.toLocaleString("en-US")}</td>
                        <td className={`${tdCls} text-right font-semibold tabular-nums`}>{fmtCost(u.costUsd)}</td>
                        <td className={`${tdCls} text-right tabular-nums`}>{fmtCost(u.costToDateUsd)}</td>
                        <td className={`${tdCls} text-right tabular-nums`}>{fmtUsd(u.paidToDateUsd)}</td>
                        <td className={`${tdCls} text-right font-bold tabular-nums ${marginTone(u.marginPct)}`}>{u.marginPct === null ? "No revenue" : fmtPct(u.marginPct)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <NoData />
            )}
          </SectionCard>
        </div>
      </div>
    </AdminShell>
  );
}
