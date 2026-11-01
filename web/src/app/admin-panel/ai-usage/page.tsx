import { redirect } from "next/navigation";
import { Cpu, Target, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { KpiCard } from "@/components/admin/kpi-card";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { SectionCard } from "@/components/admin/section-card";
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

  const columns: DataTableColumn<UsageRow>[] = [
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-[#111111]">{u.user.name || "—"}</p>
          <p className="truncate text-[11px] text-[#6E6E6A]">{u.user.email}</p>
        </div>
      ),
    },
    {
      key: "month",
      header: "Month",
      render: (u) => <span className="font-mono text-[12px] font-semibold text-[#111111]">{u.month}</span>,
    },
    {
      key: "jd",
      header: "JD",
      align: "right",
      render: (u) => <span className="font-mono text-[12px] text-[#3F3F3F]">{u.jdCount}</span>,
    },
    {
      key: "rf",
      header: "RoleFit",
      align: "right",
      render: (u) => <span className="font-mono text-[12px] text-[#3F3F3F]">{u.roleFitCount}</span>,
    },
    {
      key: "pk",
      header: "Packets",
      align: "right",
      render: (u) => <span className="font-mono text-[12px] text-[#3F3F3F]">{u.packetCount}</span>,
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      render: (u) => (
        <span className="font-mono text-[12px] font-semibold text-[#111111]">
          {u.jdCount + u.roleFitCount + u.packetCount}
        </span>
      ),
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="AI usage">
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#111111]">AI usage</h1>
          <p className="mt-1 text-[13px] text-[#6B6B6B]">
            Per-user monthly counters across the three rate-limited AI surfaces. Top 100 records shown.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <KpiCard label="JD analyses" value={totalJd} icon={Target} hint="All-time across all users" />
          <KpiCard label="Role-fit checks" value={totalRoleFit} icon={Cpu} hint="All-time" />
          <KpiCard label="Application packets" value={totalPacket} icon={Layers} hint="All-time" />
        </div>

        <SectionCard
          title="AI spend · last 30 days"
          description={`${calls30.toLocaleString()} calls · ${usd(spend30)} · ${failed30} failed. Caps and models: Limits & budgets.`}
          flush
        >
          <div className="grid gap-0 lg:grid-cols-2 lg:divide-x lg:divide-[#E5E5E2]">
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#FAFAF9] text-[11px] uppercase tracking-wider text-[#6E6E6A]">
                <tr>
                  <th className="px-5 py-2 font-semibold">Tool</th>
                  <th className="px-3 py-2 text-right font-semibold">Calls</th>
                  <th className="px-3 py-2 text-right font-semibold">Tokens</th>
                  <th className="px-5 py-2 text-right font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E2]">
                {byTool.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-[#6E6E6A]">
                      No AI calls in the last 30 days.
                    </td>
                  </tr>
                ) : (
                  byTool
                    .sort((a, b) => (b._sum.costMicros ?? 0) - (a._sum.costMicros ?? 0))
                    .map((r) => (
                      <tr key={r.tool}>
                        <td className="px-5 py-2 text-[#111111]">{AI_TOOL_LABELS[r.tool as AiTool] ?? r.tool}</td>
                        <td className="px-3 py-2 text-right font-mono text-[12px]">{r._count._all.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right font-mono text-[12px]">
                          {((r._sum.inputTokens ?? 0) + (r._sum.outputTokens ?? 0)).toLocaleString()}
                        </td>
                        <td className="px-5 py-2 text-right font-mono text-[12px] font-semibold">{usd(r._sum.costMicros ?? 0)}</td>
                      </tr>
                    ))
                )}
              </tbody>
            </table>
            <table className="w-full text-left text-[13px]">
              <thead className="bg-[#FAFAF9] text-[11px] uppercase tracking-wider text-[#6E6E6A]">
                <tr>
                  <th className="px-5 py-2 font-semibold">Top users by cost</th>
                  <th className="px-3 py-2 text-right font-semibold">Calls</th>
                  <th className="px-5 py-2 text-right font-semibold">Cost</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E5E5E2]">
                {byUser.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-5 py-6 text-center text-[#6E6E6A]">
                      No signed-in usage yet.
                    </td>
                  </tr>
                ) : (
                  byUser.map((r) => (
                    <tr key={r.userId}>
                      <td className="max-w-[220px] truncate px-5 py-2 text-[#111111]">
                        {topUsers.find((u) => u.id === r.userId)?.email ?? "deleted user"}
                      </td>
                      <td className="px-3 py-2 text-right font-mono text-[12px]">{r._count._all}</td>
                      <td className="px-5 py-2 text-right font-mono text-[12px] font-semibold">{usd(r._sum.costMicros ?? 0)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </SectionCard>

        <DataTable
          columns={columns}
          rows={usageMonths}
          rowKey={(u) => u.id}
          emptyTitle="No AI usage recorded yet"
          emptyDescription="Per-user usage counters appear once a paid user runs JD analysis, role-fit, or packet generation."
        />
      </div>
    </AdminShell>
  );
}
