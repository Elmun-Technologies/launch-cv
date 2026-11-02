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

/** Start of the 30-day window (outside render for the purity lint). */
function thirtyDaysAgo() {
  return new Date(Date.now() - 30 * 86_400_000);
}

const usd = (micros: number) => `$${(micros / 1_000_000).toFixed(2)}`;

type UsageRow = {
  id: string;
  month: string;
  jdCount: number;
  roleFitCount: number;
  packetCount: number;
  user: { name: string | null; email: string };
};

export default async function AdminAiUsagePage() {
  const admin = await requireAdmin("view");
  if (!admin) redirect("/admin-panel/access-denied");

  const usageMonths = await prisma.usageMonth.findMany({
    orderBy: { month: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  const since = thirtyDaysAgo();
  const [byTool, byUser] = await Promise.all([
    prisma.aiCall.groupBy({
      by: ["tool"],
      where: { createdAt: { gte: since } },
      _sum: { costMicros: true, inputTokens: true, outputTokens: true },
      _count: { _all: true },
    }),
    prisma.aiCall.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: since }, userId: { not: null } },
      _sum: { costMicros: true },
      _count: { _all: true },
      orderBy: { _sum: { costMicros: "desc" } },
      take: 10,
    }),
  ]);
  const failed30 = await prisma.aiCall.count({ where: { createdAt: { gte: since }, ok: false } });
  const topUsers = await prisma.user.findMany({
    where: { id: { in: byUser.map((u) => u.userId!) } },
    select: { id: true, email: true },
  });
  const spend30 = byTool.reduce((a, r) => a + (r._sum.costMicros ?? 0), 0);
  const calls30 = byTool.reduce((a, r) => a + r._count._all, 0);

  const totalJd = usageMonths.reduce((s, u) => s + u.jdCount, 0);
  const totalRoleFit = usageMonths.reduce((s, u) => s + u.roleFitCount, 0);
  const totalPacket = usageMonths.reduce((s, u) => s + u.packetCount, 0);

  const tokens30 = byTool.reduce((a, r) => a + (r._sum.inputTokens ?? 0) + (r._sum.outputTokens ?? 0), 0);
  const toolRows = [...byTool].sort((a, b) => (b._sum.costMicros ?? 0) - (a._sum.costMicros ?? 0));
  const maxToolCalls = Math.max(1, ...toolRows.map((r) => r._count._all));
  const failedPct = calls30 > 0 ? `${((failed30 / calls30) * 100).toFixed(1)}% of calls` : "No calls yet";

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
    {
      key: "month",
      header: "Month",
      render: (u) => <span className="lc-mono text-[13px] text-[#121226]">{u.month}</span>,
    },
    {
      key: "jd",
      header: "JD",
      align: "right",
      render: (u) => <span className={`${cellText} tabular-nums`}>{u.jdCount}</span>,
    },
    {
      key: "rf",
      header: "RoleFit",
      align: "right",
      render: (u) => <span className={`${cellText} tabular-nums`}>{u.roleFitCount}</span>,
    },
    {
      key: "pk",
      header: "Packets",
      align: "right",
      render: (u) => <span className={`${cellText} tabular-nums`}>{u.packetCount}</span>,
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      render: (u) => (
        <span className={`${cellMain} tabular-nums`}>{u.jdCount + u.roleFitCount + u.packetCount}</span>
      ),
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="AI usage">
      <div className="space-y-5">
        <AdminPageHeader
          title="AI usage"
          description="AI spend for the last 30 days, plus per-user monthly counters across the three rate-limited AI surfaces. Caps and models: Limits & budgets."
        />

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <StatTile featured label="AI spend · 30 days" value={usd(spend30)} hint="All tools" />
          <StatTile label="Calls · 30 days" value={calls30} hint="All tools" />
          <StatTile label="Failed calls · 30 days" value={failed30} hint={failedPct} />
          <StatTile label="Tokens · 30 days" value={tokens30} hint="Input + output" />
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <SectionCard title="By tool" description="Last 30 days, sorted by cost">
            {toolRows.length === 0 ? (
              <p className="py-6 text-center text-[14px] text-[#66647c]">No AI calls in the last 30 days.</p>
            ) : (
              <ul>
                {toolRows.map((r) => {
                  const label = AI_TOOL_LABELS[r.tool as AiTool] ?? r.tool;
                  const calls = r._count._all;
                  const tokens = (r._sum.inputTokens ?? 0) + (r._sum.outputTokens ?? 0);
                  return (
                    <li
                      key={r.tool}
                      className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 border-t border-[#e2e0ea] py-2.5 text-[14px] first:border-t-0 sm:grid-cols-[160px_1fr_auto_auto]"
                    >
                      <b className="min-w-0 break-words text-[#121226]">{label}</b>
                      <span className="text-right font-semibold tabular-nums text-[#121226] sm:order-last">
                        {usd(r._sum.costMicros ?? 0)}
                      </span>
                      <div className="col-span-2 sm:col-span-1">
                        <Meter pct={(calls / maxToolCalls) * 100} />
                      </div>
                      <span className="col-span-2 text-[13px] tabular-nums text-[#4a4862] sm:col-span-1 sm:text-right">
                        {calls.toLocaleString()} calls · {tokens.toLocaleString()} tokens
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          <SectionCard title="Top users by cost" description="Last 30 days, signed-in calls">
            {byUser.length === 0 ? (
              <p className="py-6 text-center text-[14px] text-[#66647c]">No signed-in usage yet.</p>
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
                          {topUsers.find((u) => u.id === r.userId)?.email ?? "deleted user"}
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
            <p className="mt-1 text-[14px] text-[#4a4862]">Top 100 per-user monthly records.</p>
          </div>
          <div className="grid gap-3 sm:grid-cols-3">
            <StatTile compact label="JD analyses" value={totalJd} hint="All-time across all users" />
            <StatTile compact label="Role-fit checks" value={totalRoleFit} hint="All-time" />
            <StatTile compact label="Application packets" value={totalPacket} hint="All-time" />
          </div>
          <DataTable
            columns={columns}
            rows={usageMonths}
            rowKey={(u) => u.id}
            emptyTitle="No AI usage recorded yet"
            emptyDescription="Per-user usage counters appear once a paid user runs JD analysis, role-fit, or packet generation."
          />
        </div>
      </div>
    </AdminShell>
  );
}
