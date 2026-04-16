import { redirect } from "next/navigation";
import { Cpu } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";

export default async function AdminAiUsagePage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const usageMonths = await prisma.usageMonth.findMany({
    orderBy: { month: "desc" },
    take: 100,
    include: { user: { select: { name: true, email: true } } },
  });

  const totalJd = usageMonths.reduce((s, u) => s + u.jdCount, 0);
  const totalRoleFit = usageMonths.reduce((s, u) => s + u.roleFitCount, 0);
  const totalPacket = usageMonths.reduce((s, u) => s + u.packetCount, 0);

  return (
    <AdminShell email={admin.email} pageTitle="AI Usage">
      <div className="space-y-8">
        <h2 className="text-[28px] font-bold text-gray-900">AI Usage</h2>

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "JD Analyses", value: totalJd, color: "bg-violet-100 text-violet-600" },
            { label: "RoleFit Checks", value: totalRoleFit, color: "bg-blue-100 text-blue-600" },
            { label: "Packets Generated", value: totalPacket, color: "bg-emerald-100 text-emerald-600" },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                <Cpu className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[28px] font-bold leading-tight text-gray-900">{s.value.toLocaleString()}</p>
                <p className="text-[13px] text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">User</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Month</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">JD Count</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">RoleFit</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Packets</th>
                <th className="px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-wider text-gray-500">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {usageMonths.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[13px] text-gray-400">No AI usage data</td>
                </tr>
              ) : (
                usageMonths.map((u) => (
                  <tr key={u.id} className="transition hover:bg-gray-50/60">
                    <td className="px-5 py-3">
                      <p className="text-[13px] font-medium text-gray-900">{u.user.name || "—"}</p>
                      <p className="text-[11px] text-gray-400">{u.user.email}</p>
                    </td>
                    <td className="px-5 py-3 text-[13px] font-medium text-gray-600">{u.month}</td>
                    <td className="px-5 py-3 text-center text-[13px] text-gray-600">{u.jdCount}</td>
                    <td className="px-5 py-3 text-center text-[13px] text-gray-600">{u.roleFitCount}</td>
                    <td className="px-5 py-3 text-center text-[13px] text-gray-600">{u.packetCount}</td>
                    <td className="px-5 py-3 text-center text-[13px] font-semibold text-gray-900">
                      {u.jdCount + u.roleFitCount + u.packetCount}
                    </td>
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
