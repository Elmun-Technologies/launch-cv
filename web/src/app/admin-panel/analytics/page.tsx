import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { SectionCard } from "@/components/admin/section-card";
import { AnalyticsFrame, exportHref } from "@/components/admin/traffic/frame";
import { LabeledBarChart, WeekHourHeatmap } from "@/components/admin/traffic/charts";
import { TrendChart } from "@/components/admin/traffic/trend-chart";
import { ATTRIBUTION_NOTE, ExportLink, InfoTip, KpiTile, NoData, VISITOR_NOTE } from "@/components/admin/traffic/ui";
import { parseTrafficQuery } from "@/lib/traffic/filters";
import { WEEKDAYS, fmtDuration, fmtInt, fmtPct, fmtUsd, hourLabel } from "@/lib/traffic/labels";
import { conversions, filtered, funnel, heatmap, liveVisitors, series, summarize, topEvents, totals } from "@/lib/traffic/queries";

export const dynamic = "force-dynamic";

function requestNow() {
  return Date.now();
}

export default async function AnalyticsTrafficPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const admin = await requireAdmin("view");
  if (!admin) redirect("/admin-panel/access-denied");
  const q = parseTrafficQuery(await searchParams, requestNow());
  const prevRange = { from: q.prevFrom, to: q.prevTo };

  const [cur, prev, liveNow, conv, prevConv, grid, events] = await Promise.all([
    totals(q, q),
    totals(prevRange, q),
    liveVisitors(q, q.now),
    conversions(q),
    conversions(prevRange),
    heatmap(q),
    topEvents(q),
  ]);
  const [sum, prevSum, points, steps] = await Promise.all([
    summarize(conv, q),
    summarize(prevConv, q),
    series(q, filtered(conv, q)),
    funnel(q, conv, cur.visitors),
  ]);

  const ratio = (a: number, b: number) => (b > 0 ? a / b : 0);
  const pagesPer = ratio(cur.pageviews, cur.sessions);
  const prevPagesPer = prev.sessions ? ratio(prev.pageviews, prev.sessions) : null;
  const bounce = ratio(cur.bounces, cur.entries);
  const prevBounce = prev.entries ? ratio(prev.bounces, prev.entries) : null;
  const rpv = ratio(sum.revenue, cur.visitors);
  const prevRpv = prev.visitors ? ratio(prevSum.revenue, prev.visitors) : null;

  const hours = Array.from({ length: 24 }, (_, h) => grid.reduce((a, row) => a + row[h], 0));
  const weekdays = grid.map((row) => row.reduce((a, b) => a + b, 0));
  const anyTraffic = cur.pageviews > 0;
  const topStep = Math.max(1, ...steps.map((s) => s.n));

  return (
    <AnalyticsFrame email={admin.email} q={q} tab="traffic">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        <KpiTile featured label="Visitors" value={fmtInt(cur.visitors)} cur={cur.visitors} prev={prev.visitors} info={VISITOR_NOTE} />
        <KpiTile label="Sessions" value={fmtInt(cur.sessions)} cur={cur.sessions} prev={prev.sessions} info="Visits: a new one starts after 30 minutes without activity, or in a new tab." />
        <KpiTile label="Pageviews" value={fmtInt(cur.pageviews)} cur={cur.pageviews} prev={prev.pageviews} />
        <KpiTile label="Pages / session" value={pagesPer ? pagesPer.toFixed(2) : "—"} cur={pagesPer} prev={prevPagesPer} />
        <KpiTile
          label="Avg. session"
          value={fmtDuration(cur.avgSessionMs)}
          cur={cur.avgSessionMs}
          prev={prev.sessions ? prev.avgSessionMs : null}
          info="From the first page view to the end of the last one. Time on a page is the visible time the browser reports, else the gap to the next page (max 30 minutes)."
        />
        <KpiTile
          label="Bounce rate"
          value={cur.entries ? fmtPct(cur.bounces, cur.entries) : "—"}
          cur={bounce}
          prev={prevBounce}
          invert
          info="Sessions with a single page view."
        />
        <Link href="/admin-panel/analytics/live" className="block rounded-[22px] focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#5440e8]">
          <KpiTile label="Live now" value={fmtInt(liveNow)} hint="Last 5 minutes →" />
        </Link>
        <KpiTile
          label="Sign-ups"
          value={fmtInt(sum.signups)}
          cur={sum.signups}
          prev={prevSum.signups}
          info={`New accounts in the range. With a filter on, only sign-ups attributed to matching traffic. ${ATTRIBUTION_NOTE}`}
        />
        <KpiTile label="Sign-up conversion" value={fmtPct(sum.signups, cur.visitors, 2)} cur={ratio(sum.signups, cur.visitors)} prev={prev.visitors ? ratio(prevSum.signups, prev.visitors) : null} info="Sign-ups ÷ visitors." />
        <KpiTile
          label="Paid conversion"
          value={fmtPct(sum.payers, cur.visitors, 2)}
          cur={ratio(sum.payers, cur.visitors)}
          prev={prev.visitors ? ratio(prevSum.payers, prev.visitors) : null}
          info="People with a payment in the range ÷ visitors."
        />
        <KpiTile
          label="Revenue / visitor"
          value={cur.visitors ? fmtUsd(rpv, true) : "—"}
          cur={rpv}
          prev={prevRpv}
          info={`${fmtUsd(sum.revenue)} from ${sum.purchases} purchase${sum.purchases === 1 ? "" : "s"} ÷ visitors. Amount paid after discounts; list price for older events without an amount.`}
        />
        <KpiTile label="Revenue" value={fmtUsd(sum.revenue)} cur={sum.revenue} prev={prevSum.revenue} />
      </div>

      <SectionCard
        title="Dynamics"
        description={q.granularity === "hour" ? "Per hour" : "Per day"}
        action={<ExportLink href={exportHref(q, "dynamics")} />}
      >
        {anyTraffic || sum.signups ? <TrendChart points={points} hourly={q.granularity === "hour"} /> : <NoData />}
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="By hour of day" description="Sessions started" action={<ExportLink href={exportHref(q, "hours")} />}>
          {anyTraffic ? <LabeledBarChart noun="sessions" labelEvery={3} bars={hours.map((n, h) => ({ label: hourLabel(h).replace(" ", "").toLowerCase(), value: n, title: `${hourLabel(h)}: ${n.toLocaleString("en-US")}` }))} /> : <NoData />}
        </SectionCard>
        <SectionCard title="By weekday" description="Sessions started" action={<ExportLink href={exportHref(q, "weekdays")} />}>
          {anyTraffic ? <LabeledBarChart noun="sessions" bars={weekdays.map((n, d) => ({ label: WEEKDAYS[d], value: n }))} /> : <NoData />}
        </SectionCard>
      </div>

      <SectionCard title="Hour × weekday" description="When sessions start; darker is busier">
        {anyTraffic ? <WeekHourHeatmap grid={grid} /> : <NoData />}
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
        <SectionCard
          title="Funnel"
          description="Visit → free ATS check → sign-up, then what the people who signed up in this range did next"
          action={<ExportLink href={exportHref(q, "funnel")} />}
        >
          {steps[0].n === 0 && steps[2].n === 0 ? (
            <NoData />
          ) : (
            <ol>
              {steps.map((s, i) => (
                <li key={s.id} className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1.5 border-t border-[#e2e0ea] py-2.5 first:border-t-0 sm:grid-cols-[190px_1fr_120px]">
                  <span className="flex items-center gap-1 text-[14px] font-bold text-[#121226]">
                    {s.label}
                    <InfoTip text={s.hint} label={s.label} />
                  </span>
                  <span className="text-right text-[14px] tabular-nums sm:order-last">
                    <b>{fmtInt(s.n)}</b>
                    {i > 0 && s.n <= steps[i - 1].n ? <span className="text-[#66647c]"> · {fmtPct(s.n, steps[i - 1].n, 0)}</span> : null}
                  </span>
                  <div className="col-span-2 h-6 overflow-hidden rounded-lg bg-[#f1eff8] sm:col-span-1" aria-hidden>
                    <div className="h-full rounded-lg bg-[#5440e8]" style={{ width: `${Math.max(s.n > 0 ? 1.5 : 0, (s.n / topStep) * 100)}%` }} />
                  </div>
                </li>
              ))}
            </ol>
          )}
          <p className="mt-3 text-[12px] leading-[1.5] text-[#66647c]">Percent is conversion from the step above. Sign-ups include people who never ran a check, so that step can be larger than the one above it.</p>
        </SectionCard>

        <SectionCard title="Events" description="Server-side product events in the range (filters don't apply)" action={<ExportLink href={exportHref(q, "events")} />}>
          {events.length === 0 ? (
            <NoData />
          ) : (
            <ul>
              {events.slice(0, 15).map((e) => (
                <li key={e.name} className="flex items-center justify-between gap-3 border-t border-[#e2e0ea] py-2 text-[13px] first:border-t-0">
                  <span className="lc-mono min-w-0 break-all text-[#121226]">{e.name}</span>
                  <span className="shrink-0 tabular-nums text-[#4a4862]">
                    <b className="text-[#121226]">{fmtInt(e.count)}</b> · {fmtInt(e.users)} user{e.users === 1 ? "" : "s"}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </AnalyticsFrame>
  );
}
