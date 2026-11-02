import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { StatusBadge, statusToTone } from "@/components/admin/status-badge";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { AdminPageHeader, StatTile, cellMain, cellMuted, cellSub, cellText } from "@/components/admin/v5/ui";

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
  const admin = await requireAdmin("users");
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
      header: "Customer",
      render: (s) => (
        <div className="min-w-0">
          <p className={`truncate ${cellMain}`}>{s.user.name || "—"}</p>
          <p className={`truncate ${cellSub}`}>{s.user.email}</p>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan / variant",
      render: (s) => <span className="lc-mono text-[13px] text-[#121226]">{s.stripePriceId}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (s) => (
        <StatusBadge tone={statusToTone(s.status)} dot>
          {s.status}
        </StatusBadge>
      ),
    },
    {
      key: "period_end",
      header: "Period end",
      render: (s) => (
        <span className={`whitespace-nowrap ${cellMuted}`}>
          {s.currentPeriodEnd ? s.currentPeriodEnd.toLocaleDateString() : "—"}
        </span>
      ),
    },
    {
      key: "cancel_at_end",
      header: "Cancel at end",
      render: (s) =>
        s.cancelAtPeriodEnd ? (
          <span className="text-[14px] font-bold text-[#a15c00]">Yes</span>
        ) : (
          <span className={cellText}>No</span>
        ),
    },
    {
      key: "id",
      header: "Subscription ID",
      truncate: "max-w-[180px]",
      render: (s) => <span className="lc-mono text-[12px] text-[#66647c]">{s.stripeSubscriptionId}</span>,
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="Subscriptions">
      <div className="space-y-5">
        <AdminPageHeader
          title="Subscriptions"
          description="Polar subscription records, including pending cancellations."
        />

        <div className="grid gap-3 sm:grid-cols-3">
          <StatTile featured label="Active" value={activeSubs} hint="Not pending cancellation" />
          <StatTile label="Pending cancellation" value={cancelling} hint="Cancel at period end" />
          <StatTile label="Total records" value={totalSubs} hint="All lifetime subscriptions" />
        </div>

        <DataTable
          columns={columns}
          rows={subscriptions}
          rowKey={(s) => s.id}
          emptyTitle="No subscriptions yet"
          emptyDescription="Subscriptions appear here once users complete checkout via Polar."
        />
      </div>
    </AdminShell>
  );
}
