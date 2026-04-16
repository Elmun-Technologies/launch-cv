import { redirect } from "next/navigation";
import {
  Users,
  FileText,
  Briefcase,
  Mail,
  Building2,
  CreditCard,
  Cpu,
  Activity,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [
    totalUsers,
    totalResumes,
    totalApplications,
    totalContacts,
    totalCompanies,
    activeSubscriptions,
    aiRequests30d,
    events30d,
    recentUsers,
    recentEvents,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.resume.count(),
    prisma.jobApplication.count(),
    prisma.contact.count(),
    prisma.company.count(),
    prisma.subscription.count({ where: { status: "active" } }),
    prisma.usageMonth.aggregate({ _sum: { jdCount: true, roleFitCount: true, packetCount: true } }),
    prisma.analyticsEvent.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.analyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
      select: { id: true, name: true, userId: true, createdAt: true },
    }),
  ]);

  const aiTotal =
    (aiRequests30d._sum.jdCount ?? 0) +
    (aiRequests30d._sum.roleFitCount ?? 0) +
    (aiRequests30d._sum.packetCount ?? 0);

  const stats = [
    { label: "Total Users", value: totalUsers, icon: Users, color: "bg-violet-100 text-violet-600" },
    { label: "Total Resumes", value: totalResumes, icon: FileText, color: "bg-blue-100 text-blue-600" },
    { label: "Applications", value: totalApplications, icon: Briefcase, color: "bg-amber-100 text-amber-600" },
    { label: "Contacts", value: totalContacts, icon: Mail, color: "bg-emerald-100 text-emerald-600" },
    { label: "Companies", value: totalCompanies, icon: Building2, color: "bg-pink-100 text-pink-600" },
    { label: "Active Subs", value: activeSubscriptions, icon: CreditCard, color: "bg-cyan-100 text-cyan-600" },
    { label: "AI Requests", value: aiTotal, icon: Cpu, color: "bg-orange-100 text-orange-600" },
    { label: "Events (30d)", value: events30d, icon: Activity, color: "bg-indigo-100 text-indigo-600" },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="Dashboard">
      <div className="space-y-8">
        <h2 className="text-[28px] font-bold text-gray-900">Dashboard</h2>

        {/* Stat cards */}
        <div className="grid grid-cols-4 gap-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]"
            >
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${s.color}`}>
                <s.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-[28px] font-bold leading-tight text-gray-900">
                  {s.value.toLocaleString()}
                </p>
                <p className="text-[13px] text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Recent Signups */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="border-b border-gray-100 px-6 py-4">
              <h3 className="text-[15px] font-semibold text-gray-900">Recent Signups</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentUsers.map((u) => (
                <div key={u.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/60">
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{u.name || "—"}</p>
                    <p className="text-[13px] text-gray-500">{u.email}</p>
                  </div>
                  <p className="text-[13px] text-gray-400">
                    {u.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
              {recentUsers.length === 0 && (
                <p className="px-6 py-8 text-center text-[13px] text-gray-400">No users yet</p>
              )}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="border-b border-gray-100 px-6 py-4">
              <h3 className="text-[15px] font-semibold text-gray-900">Recent Activity</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {recentEvents.map((e) => (
                <div key={e.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/60">
                  <div>
                    <p className="text-[13px] font-medium text-gray-900">{e.name}</p>
                    <p className="text-[13px] text-gray-500">User: {e.userId ?? "anonymous"}</p>
                  </div>
                  <p className="text-[13px] text-gray-400">
                    {e.createdAt.toLocaleDateString()}
                  </p>
                </div>
              ))}
              {recentEvents.length === 0 && (
                <p className="px-6 py-8 text-center text-[13px] text-gray-400">No events yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
