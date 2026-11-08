import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { SectionCard } from "@/components/admin/section-card";
import { Meter } from "@/components/admin/v5/ui";
import { AnalyticsFrame, exportHref } from "@/components/admin/traffic/frame";
import { PagesTable } from "@/components/admin/traffic/pages-table";
import { ATTRIBUTION_NOTE, ExportLink, InfoTip, NoData } from "@/components/admin/traffic/ui";
import { parseTrafficQuery } from "@/lib/traffic/filters";
import { fmtInt, fmtPct } from "@/lib/traffic/labels";
import { conversions, pages, type PageStats } from "@/lib/traffic/queries";

export const dynamic = "force-dynamic";

function requestNow() {
  return Date.now();
}

/** Ungrouped pages (group rows replaced by their pages). */
function flat(rows: Awaited<ReturnType<typeof pages>>): PageStats[] {
  return rows.flatMap((r) => r.children ?? [r]);
}

function TopList({ rows, value, label }: { rows: PageStats[]; value: (r: PageStats) => number; label: string }) {
  const list = rows.filter((r) => value(r) > 0).sort((a, b) => value(b) - value(a)).slice(0, 12);
  if (!list.length) return <NoData />;
  const total = rows.reduce((a, r) => a + value(r), 0);
  return (
    <ul>
      {list.map((r) => (
        <li key={r.path} className="border-t border-[#e2e0ea] py-2.5 first:border-t-0">
          <div className="flex items-center justify-between gap-3 text-[13px]">
            <span className="lc-mono min-w-0 truncate text-[#121226]" title={r.path}>
              {r.path}
            </span>
            <span className="shrink-0 tabular-nums text-[#4a4862]">
              <b className="text-[#121226]">{fmtInt(value(r))}</b> {label} · {fmtPct(value(r), total, 0)}
            </span>
          </div>
          <div className="mt-1.5">
            <Meter pct={total ? (value(r) / total) * 100 : 0} />
          </div>
        </li>
      ))}
    </ul>
  );
}

export default async function AnalyticsPagesPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const admin = await requireAdmin("view");
  if (!admin) redirect("/admin-panel/access-denied");
  const q = parseTrafficQuery(await searchParams, requestNow());
  const conv = await conversions(q);
  const rows = await pages(q, conv);
  const all = flat(rows);

  return (
    <AnalyticsFrame email={admin.email} q={q} tab="pages">
      <SectionCard
        title="Pages"
        description="Dynamic SEO routes are grouped; open a group to see its pages"
        action={
          <div className="flex items-center gap-2">
            <InfoTip text={`"Sign-ups started here" / "Paid started here": ${ATTRIBUTION_NOTE} Avg. time is the visible time on the page (else the gap to the next page). Bounce is the share of sessions that entered here and saw nothing else.`} label="Attribution rule" />
            <ExportLink href={exportHref(q, "pages")} />
          </div>
        }
      >
        {rows.length ? <PagesTable rows={rows} /> : <NoData />}
      </SectionCard>

      <div className="grid gap-5 lg:grid-cols-2">
        <SectionCard title="Entry pages" description="Where sessions start" action={<ExportLink href={exportHref(q, "entry-pages")} />}>
          <TopList rows={all} value={(r) => r.entries} label="entries" />
        </SectionCard>
        <SectionCard title="Exit pages" description="The last page of a session" action={<ExportLink href={exportHref(q, "exit-pages")} />}>
          <TopList rows={all} value={(r) => r.exits} label="exits" />
        </SectionCard>
      </div>
    </AnalyticsFrame>
  );
}
