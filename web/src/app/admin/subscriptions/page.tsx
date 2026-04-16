import { redirect } from "next/navigation";
import { CreditCard } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";

const statusColors: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  canceled: "bg-red-100 text-red-700",
  cancelled: "bg-amber-100 text-amber-800",
  expired: "bg-red-100 text-red-700",
  unpaid: "bg-red-100 text-red-600",
  paused: "bg-gray-100 text-gray-600",
  past_due: "bg-amber-100 text-amber-700",
  trialing: "bg-blue-100 text-blue-700",
  on_trial: "bg-blue-100 text-blue-700",
  incomplete: "bg-gray-100 text-gray-600",
};

export default async function AdminSubscriptionsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const [activeSubs, subscriptions] = await Promise.all([
    prisma.subscription.count({
      where: { status: { in: ["active", "trialing", "on_trial", "past_due"] } },
    }),
    prisma.subscription.findMany({
      orderBy: { updatedAt: "desc" },
      include: { user: { select: { name: true, email: true } } },
    }),
  ]);

  return (
    <AdminShell email={admin.email} pageTitle="Subscriptions">
      <div className="space-y-8">
        <h2 className="text-[28px] font-bold text-gray-900">Subscriptions</h2>

        {/* Stat */}
        <div className="flex gap-4">
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[28px] font-bold leading-tight text-gray-900">{activeSubs}</p>
              <p className="text-[13px] text-gray-500">Active Subscriptions</p>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <CreditCard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[28px] font-bold leading-tight text-gray-900">{subscriptions.length}</p>
              <p className="text-[13px] text-gray-500">Total Subscriptions</p>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">User</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Plan</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Period End</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Subscription ID</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {subscriptions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-[13px] text-gray-400">No subscriptions</td>
                </tr>
              ) : (
                subscriptions.map((s) => (
                  <tr key={s.id} className="transition hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <p className="text-[13px] font-medium text-gray-900">{s.user.name || "—"}</p>
                      <p className="text-[11px] text-gray-400">{s.user.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusColors[s.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {s.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">{s.stripePriceId}</td>
                    <td className="px-5 py-3 text-[13px] text-gray-500">
                      {s.currentPeriodEnd?.toLocaleDateString() ?? "—"}
                    </td>
                    <td className="px-5 py-3 text-[13px] font-mono text-gray-400">{s.stripeSubscriptionId}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
