import { redirect } from "next/navigation";
import { CreditCard, CheckCircle2, Users } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { KpiCard } from "@/components/admin/kpi-card";
import { StatusBadge, statusToTone } from "@/components/admin/status-badge";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";

type SubscriptionRow = {
  id: string;
  status: string;
  stripePriceId: string;
  stripeSubscriptionId: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  user: { name: string | null; email: string };
};

export default async function AdminSubscriptionsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const [activeSubs, totalSubs, cancelling, subscriptions] = await Promise.all([
    prisma.subscription.count({
      where: { status: { in: ["active", "trialing", "on_trial"] }, cancelAtPeriodEnd: false },
    }),
    prisma.subscription.count(),
    prisma.subscription.count({ where: { cancelAtPeriodEnd: true } }),
    prisma.subscription.findMany({
      orderBy: { updatedAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  const columns: DataTableColumn<SubscriptionRow>[] = [
    {
      key: "user",
      header: "User",
      render: (s) => (
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-[#0F172A]">{s.user.name || "—"}</p>
          <p className="truncate text-[11px] text-[#94A3B8]">{s.user.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (s) => (
        <div className="flex flex-col gap-1">
          <StatusBadge tone={statusToTone(s.status)} dot>{s.status}</StatusBadge>
          {s.cancelAtPeriodEnd ? (
            <span className="text-[10px] font-medium uppercase tracking-wider text-amber-700">
              Cancels at period end
            </span>
          ) : null}
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan / variant",
      render: (s) => (
        <span className="font-mono text-[12px] text-[#475569]">{s.stripePriceId}</span>
      ),
    },
    {
      key: "period_end",
      header: "Period end",
      render: (s) => (
        <span className="text-[12px] text-[#64748B]">
          {s.currentPeriodEnd ? s.currentPeriodEnd.toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "id",
      header: "Subscription ID",
      truncate: "max-w-[180px]",
      render: (s) => (
        <span className="font-mono text-[11px] text-[#94A3B8]">{s.stripeSubscriptionId}</span>
      ),
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="Subscriptions">
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">Subscriptions</h1>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Lemon Squeezy subscription records, including pending cancellations.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          <KpiCard label="Active" value={activeSubs} icon={CheckCircle2} hint="Not pending cancellation" />
          <KpiCard label="Pending cancellation" value={cancelling} icon={CreditCard} hint="Cancel at period end" />
          <KpiCard label="Total records" value={totalSubs} icon={Users} hint="All lifetime subscriptions" />
        </div>

        <DataTable
          columns={columns}
          rows={subscriptions}
          rowKey={(s) => s.id}
          emptyTitle="No subscriptions yet"
          emptyDescription="Subscriptions appear here once users complete checkout via Lemon Squeezy."
        />
      </div>
    </AdminShell>
  );
}
