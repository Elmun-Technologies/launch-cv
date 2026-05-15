import { redirect } from "next/navigation";
import Link from "next/link";
import {
  Users,
  FileText,
  Briefcase,
  Mail,
  Building2,
  CreditCard,
  Cpu,
  Activity,
  ArrowRight,
} from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { KpiCard } from "@/components/admin/kpi-card";
import { SectionCard } from "@/components/admin/section-card";

export default async function AdminDashboardPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

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
      take: 8,
      select: { id: true, name: true, email: true, createdAt: true },
    }),
    prisma.analyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, name: true, userId: true, createdAt: true },
    }),
  ]);

  const aiTotal =
    (aiRequests30d._sum.jdCount ?? 0) +
    (aiRequests30d._sum.roleFitCount ?? 0) +
    (aiRequests30d._sum.packetCount ?? 0);

  const stats: Array<{ label: string; value: number; icon: typeof Users; hint?: string }> = [
    { label: "Total users", value: totalUsers, icon: Users },
    { label: "Total resumes", value: totalResumes, icon: FileText },
    { label: "Applications", value: totalApplications, icon: Briefcase },
    { label: "Contacts", value: totalContacts, icon: Mail },
    { label: "Companies", value: totalCompanies, icon: Building2 },
    { label: "Active subscriptions", value: activeSubscriptions, icon: CreditCard },
    { label: "AI requests · 30d", value: aiTotal, icon: Cpu, hint: "JD + RoleFit + Packet" },
    { label: "Events · 30d", value: events30d, icon: Activity },
  ];

  const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <AdminShell email={admin.email} pageTitle="Dashboard">
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">Dashboard</h1>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Live snapshot of platform activity. Cards below are real-time; lists show the last 8 entries.
          </p>
        </div>

        {/* KPIs */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <KpiCard key={s.label} label={s.label} value={s.value} icon={s.icon} hint={s.hint} />
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard
            title="Recent signups"
            description="Newest accounts"
            flush
            action={
              <Link
                href="/admin-panel/users"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1A56DB] hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            {recentUsers.length === 0 ? (
              <p className="px-5 py-8 text-center text-[13px] text-[#94A3B8]">No users yet.</p>
            ) : (
              <ul className="divide-y divide-[#E2E8F0]">
                {recentUsers.map((u) => (
                  <li key={u.id} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-[#FAFBFC]">
                    <div className="min-w-0">
                      <p className="truncate text-[13px] font-medium text-[#0F172A]">{u.name || "—"}</p>
                      <p className="truncate text-[12px] text-[#64748B]">{u.email}</p>
                    </div>
                    <p className="shrink-0 text-[12px] text-[#94A3B8]">{dateFmt.format(u.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Recent activity"
            description="Latest analytics events"
            flush
            action={
              <Link
                href="/admin-panel/analytics"
                className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1A56DB] hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            {recentEvents.length === 0 ? (
              <p className="px-5 py-8 text-center text-[13px] text-[#94A3B8]">No events yet.</p>
            ) : (
              <ul className="divide-y divide-[#E2E8F0]">
                {recentEvents.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-[#FAFBFC]">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[12px] font-semibold text-[#0F172A]">{e.name}</p>
                      <p className="truncate text-[12px] text-[#64748B]">
                        {e.userId ? `user ${e.userId.slice(0, 8)}…` : "anonymous"}
                      </p>
                    </div>
                    <p className="shrink-0 text-[12px] text-[#94A3B8]">{dateFmt.format(e.createdAt)}</p>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>
      </div>
    </AdminShell>
  );
}
