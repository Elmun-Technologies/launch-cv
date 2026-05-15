import { redirect } from "next/navigation";
import { Cpu, Target, Layers } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { KpiCard } from "@/components/admin/kpi-card";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";

type UsageRow = {
  id: string;
  month: string;
  jdCount: number;
  roleFitCount: number;
  packetCount: number;
  user: { name: string | null; email: string };
};

export default async function AdminAiUsagePage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const usageMonths = await prisma.usageMonth.findMany({
    orderBy: { month: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  const totalJd = usageMonths.reduce((s, u) => s + u.jdCount, 0);
  const totalRoleFit = usageMonths.reduce((s, u) => s + u.roleFitCount, 0);
  const totalPacket = usageMonths.reduce((s, u) => s + u.packetCount, 0);

  const columns: DataTableColumn<UsageRow>[] = [
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-[#0F172A]">{u.user.name || "—"}</p>
          <p className="truncate text-[11px] text-[#94A3B8]">{u.user.email}</p>
        </div>
      ),
    },
    {
      key: "month",
      header: "Month",
      render: (u) => <span className="font-mono text-[12px] font-semibold text-[#0F172A]">{u.month}</span>,
    },
    {
      key: "jd",
      header: "JD",
      align: "right",
      render: (u) => <span className="font-mono text-[12px] text-[#475569]">{u.jdCount}</span>,
    },
    {
      key: "rf",
      header: "RoleFit",
      align: "right",
      render: (u) => <span className="font-mono text-[12px] text-[#475569]">{u.roleFitCount}</span>,
    },
    {
      key: "pk",
      header: "Packets",
      align: "right",
      render: (u) => <span className="font-mono text-[12px] text-[#475569]">{u.packetCount}</span>,
    },
    {
      key: "total",
      header: "Total",
      align: "right",
      render: (u) => (
        <span className="font-mono text-[12px] font-semibold text-[#0F172A]">
          {u.jdCount + u.roleFitCount + u.packetCount}
        </span>
      ),
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="AI usage">
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">AI usage</h1>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Per-user monthly counters across the three rate-limited AI surfaces. Top 100 records shown.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <KpiCard label="JD analyses" value={totalJd} icon={Target} hint="All-time across all users" />
          <KpiCard label="Role-fit checks" value={totalRoleFit} icon={Cpu} hint="All-time" />
          <KpiCard label="Application packets" value={totalPacket} icon={Layers} hint="All-time" />
        </div>

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
