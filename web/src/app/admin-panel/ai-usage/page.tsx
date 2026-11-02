import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { SectionCard } from "@/components/admin/section-card";
import {
  AdminPageHeader,
  Meter,
  StatTile,
  cellMain,
  cellSub,
  cellText,
  tableCls,
  tdCls,
  thCls,
} from "@/components/admin/v5/ui";
import { AI_TOOL_LABELS, type AiTool } from "@/lib/app-settings";
import { purchaseRevenue } from "@/lib/admin-billing";

export const dynamic = "force-dynamic";

const RANGES = ["7", "30", "90", "all"] as const;
type Range = (typeof RANGES)[number];

const usd = (micros: number) => `$${(micros / 1_000_000).toFixed(2)}`;

type UsageRow = {
  id: string;
  month: string;
  jdCount: number;
  roleFitCount: number;
  packetCount: number;
  user: { name: string | null; email: string };
};

function requestNow() {
  return Date.now();
}

export default async function AdminAiUsagePage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const admin = await requireAdmin("view");
  if (!admin) redirect("/admin-panel/access-denied");

  const { range: rangeParam } = await searchParams;
  const range: Range = RANGES.find((r) => r === rangeParam) ?? "30";
  const days = range === "all" ? null : Number(range);
  const since = days ? new Date(requestNow() - days * 86_400_000) : null;
  const inWindow = since ? { createdAt: { gte: since } } : {};
  const rangeText = days ? `last ${days} days` : "all time";
  const rangeShort = days ? `${days} days` : "all time";

  // Rows where a counter moved; all-zero months say nothing.
  const nonZero = { OR: [{ jdCount: { gt: 0 } }, { roleFitCount: { gt: 0 } }, { packetCount: { gt: 0 } }] };

  const [usageMonths, monthTotals, byTool, byUser, failed, revenue] = await Promise.all([
    prisma.usageMonth.findMany({
      where: nonZero,
      orderBy: [{ month: "desc" }, { jdCount: "desc" }],
      take: 100,
      include: { user: { select: { name: true, email: true } } },
    }),
    prisma.usageMonth.aggregate({ _sum: { jdCount: true, roleFitCount: true, packetCount: true } }),
    prisma.aiCall.groupBy({
      by: ["tool"],
      where: inWindow,
      _sum: { costMicros: true, inputTokens: true, outputTokens: true },
      _count: { _all: true },
    }),
    prisma.aiCall.groupBy({
      by: ["userId"],
      where: { ...inWindow, userId: { not: null } },
      _sum: { costMicros: true },
      _count: { _all: true },
      orderBy: { _sum: { costMicros: "desc" } },
      take: 10,
    }),
    prisma.aiCall.count({ where: { ...inWindow, ok: false } }),
    purchaseRevenue(since),
  ]);
  const topUsers = await prisma.user.findMany({
    where: { id: { in: byUser.map((u) => u.userId!) } },
    select: { id: true, email: true },
  });

  const spend = byTool.reduce((a, r) => a + (r._sum.costMicros ?? 0), 0);
  const calls = byTool.reduce((a, r) => a + r._count._all, 0);
  const tokens = byTool.reduce((a, r) => a + (r._sum.inputTokens ?? 0) + (r._sum.outputTokens ?? 0), 0);
  const toolRows = [...byTool].sort((a, b) => (b._sum.costMicros ?? 0) - (a._sum.costMicros ?? 0));
  const maxToolCalls = Math.max(1, ...toolRows.map((r) => r._count._all));
  const failedPct = calls > 0 ? `${((failed / calls) * 100).toFixed(1)}% of calls` : "No calls yet";

  // Revenue KPIs only when there is revenue to compare against (list prices, same as Overview).
  const revenueMicros = revenue.revenue * 1_000_000;
  const pctOfRevenue = revenue.revenue > 0 ? `${((spend / revenueMicros) * 100).toFixed(spend / revenueMicros < 0.1 ? 1 : 0)}% of revenue` : null;
  const perPaying = revenue.revenue > 0 && revenue.payingUsers > 0 ? usd(spend / revenue.payingUsers) : null;

  const columns: DataTableColumn<UsageRow>[] = [
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div className="min-w-0">
          <p className={`truncate ${cellMain}`}>{u.user.name || "—"}</p>
          <p className={`truncate ${cellSub}`}>{u.user.email}</p>
        </div>
      ),
    },
    { key: "month", header: "Month", render: (u) => <span className="lc-mono text-[13px] text-[#121226]">{u.month}</span> },
    { key: "jd", header: "Job match", align: "right", render: (u) => <span className={`${cellText} tabular-nums`}>{u.jdCount}</span> },
    { key: "rf", header: "Role fit", align: "right", render: (u) => <span className={`${cellText} tabular-nums`}>{u.roleFitCount}</span> },
    { key: "pk", header: "Packets", align: "right", render: (u) => <span className={`${cellText} tabular-nums`}>{u.packetCount}</span> },
    {
      key: "total",
      header: "Total",
      align: "right",
      render: (u) => <span className={`${cellMain} tabular-nums`}>{u.jdCount + u.roleFitCount + u.packetCount}</span>,
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="AI usage">
      <div className="space-y-5">
        <AdminPageHeader
          title="AI usage"
          description={`AI spend by tool and user (${rangeText}), plus per-user monthly counters. Caps and models: Limits & budgets.`}
          actions={
            <nav aria-label="Date range" className="flex gap-1 rounded-full bg-white p-1">
              {RANGES.map((r) => (
                <Link
                  key={r}
                  href={r === "30" ? "/admin-panel/ai-usage" : `/admin-panel/ai-usage?range=${r}`}
                  aria-current={r === range ? "page" : undefined}
                  className={`inline-flex min-h-[44px] items-center rounded-full px-3.5 text-[13px] font-bold transition-colors sm:min-h-[36px] ${
                    r === range ? "bg-[#111118] text-white" : "text-[#4a4862] hover:bg-[#f1eff8] hover:text-[#121226]"
                  }`}
                >
                  {r === "all" ? "All" : `${r} days`}
                </Link>
              ))}
            </nav>
          }
        />

        <div className={`grid grid-cols-2 gap-3 ${perPaying ? "lg:grid-cols-5" : "lg:grid-cols-4"}`}>
          <StatTile featured label={`AI spend · ${rangeShort}`} value={usd(spend)} hint={pctOfRevenue ?? "All tools"} />
          <StatTile label={`Calls · ${rangeShort}`} value={calls} hint="All tools" />
          {perPaying ? <StatTile label="Cost per paying user" value={perPaying} hint={`${revenue.payingUsers} paying now`} /> : null}
          <StatTile label="Failed calls" value={failed} hint={failedPct} />
          <StatTile label="Tokens" value={tokens} hint="Input + output" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <SectionCard title="By tool" description={`${rangeText[0].toUpperCase()}${rangeText.slice(1)}, sorted by cost`}>
            {toolRows.length === 0 ? (
              <p className="py-6 text-center text-[14px] text-[#66647c]">No AI calls in this period.</p>
            ) : (
              <ul>
                {toolRows.map((r) => {
                  const label = AI_TOOL_LABELS[r.tool as AiTool] ?? r.tool;
                  const n = r._count._all;
                  const t = (r._sum.inputTokens ?? 0) + (r._sum.outputTokens ?? 0);
                  return (
                    <li
                      key={r.tool}
                      className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 border-t border-[#e2e0ea] py-2.5 text-[14px] first:border-t-0 sm:grid-cols-[160px_1fr_auto_auto]"
                    >
                      <b className="min-w-0 break-words text-[#121226]">{label}</b>
                      <span className="text-right font-semibold tabular-nums text-[#121226] sm:order-last">{usd(r._sum.costMicros ?? 0)}</span>
                      <div className="col-span-2 sm:col-span-1">
                        <Meter pct={(n / maxToolCalls) * 100} />
                      </div>
                      <span className="col-span-2 text-[13px] tabular-nums text-[#4a4862] sm:col-span-1 sm:text-right">
                        {n.toLocaleString("en-US")} calls · {t.toLocaleString("en-US")} tokens
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Top users by cost" description={`${rangeText[0].toUpperCase()}${rangeText.slice(1)}, signed-in calls`}>
            {byUser.length === 0 ? (
              <p className="py-6 text-center text-[14px] text-[#66647c]">No signed-in usage in this period.</p>
            ) : (
              <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Top users by cost">
                <table className={tableCls}>
                  <thead>
                    <tr>
                      <th scope="col" className={thCls}>User</th>
                      <th scope="col" className={`${thCls} text-right`}>Calls</th>
                      <th scope="col" className={`${thCls} text-right`}>Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {byUser.map((r) => (
                      <tr key={r.userId}>
                        <td className={`${tdCls} max-w-[220px] truncate`}>
                          {topUsers.find((u) => u.id === r.userId) ? (
                            <Link href={`/admin-panel/users/${r.userId}`} className="hover:text-[#5440e8]">
                              {topUsers.find((u) => u.id === r.userId)!.email}
                            </Link>
                          ) : (
                            "deleted user"
                          )}
                        </td>
                        <td className={`${tdCls} text-right tabular-nums`}>{r._count._all}</td>
                        <td className={`${tdCls} text-right font-semibold tabular-nums`}>{usd(r._sum.costMicros ?? 0)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SectionCard>
        </div>

        <div className="space-y-3 pt-2">
          <div>
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em] text-[#121226]">Monthly counters</h2>
            <p className="mt-1 text-[14px] text-[#4a4862]">
              What counts against plan limits, per user and month (UTC). Months with no usage are hidden; newest 100 shown.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatTile compact label="Job-match analyses" value={monthTotals._sum.jdCount ?? 0} hint="All time, all users" />
            <StatTile compact label="Role-fit checks" value={monthTotals._sum.roleFitCount ?? 0} hint="All time, all users" />
            <StatTile compact label="Application packets" value={monthTotals._sum.packetCount ?? 0} hint="All time, all users" />
          </div>
          <DataTable
            columns={columns}
            rows={usageMonths}
            rowKey={(u) => u.id}
            emptyTitle="No AI usage recorded yet"
            emptyDescription="Per-user counters appear once a paid user runs job match, role fit or packet generation."
          />
        </div>
      </div>
    </AdminShell>
  );
}
