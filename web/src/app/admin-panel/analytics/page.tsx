import { redirect } from "next/navigation";
import { BarChart3, Clock, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";

export default async function AdminAnalyticsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const recentEvents = await prisma.analyticsEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    select: { id: true, name: true, userId: true, createdAt: true },
  });

  const allEvents = await prisma.analyticsEvent.groupBy({
    by: ["name"],
    _count: { name: true },
    orderBy: { _count: { name: "desc" } },
    take: 15,
  });

  const maxCount = allEvents.length > 0 ? allEvents[0]._count.name : 1;

  const now = new Date();
  const last7Days: { label: string; count: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const dayStart = new Date(now);
    dayStart.setDate(now.getDate() - i);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayStart.getDate() + 1);

    const count = await prisma.user.count({
      where: { createdAt: { gte: dayStart, lt: dayEnd } },
    });

    last7Days.push({
      label: dayStart.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }),
      count,
    });
  }

  const maxDaily = Math.max(1, ...last7Days.map((d) => d.count));
  const dateTimeFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <AdminShell email={admin.email} pageTitle="Analytics">
      <div className="space-y-6">
        <div>
          <h1 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">Analytics</h1>
          <p className="mt-1 text-[13px] text-[#64748B]">
            Daily signups for the last week, top tracked events, and most recent activity.
          </p>
        </div>

        <SectionCard
          title="Daily signups · last 7 days"
          description="Counts of new user accounts created per UTC day"
          action={<TrendingUp className="h-4 w-4 text-[#1A56DB]" />}
        >
          <div className="grid grid-cols-7 gap-2">
            {last7Days.map((d) => {
              const heightPct = (d.count / maxDaily) * 100;
              return (
                <div key={d.label} className="flex flex-col items-center gap-2">
                  <div className="flex h-[80px] w-full items-end overflow-hidden rounded-md bg-[#F8FAFC]">
                    <div
                      className="w-full rounded-md bg-gradient-to-t from-[#1A56DB] to-[#60A5FA]"
                      style={{ height: `${heightPct}%`, minHeight: d.count > 0 ? 4 : 0 }}
                    />
                  </div>
                  <span className="text-[16px] font-semibold leading-none tracking-tight text-[#0F172A]">
                    {d.count}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-[#94A3B8]">
                    {d.label.split(",")[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </SectionCard>

        <div className="grid gap-5 lg:grid-cols-2">
          <SectionCard
            title="Top events"
            description="Most frequently tracked event names"
            action={<BarChart3 className="h-4 w-4 text-[#1A56DB]" />}
          >
            {allEvents.length === 0 ? (
              <p className="py-8 text-center text-[13px] text-[#94A3B8]">No events recorded.</p>
            ) : (
              <ul className="space-y-3">
                {allEvents.map((e) => {
                  const pct = Math.round((e._count.name / maxCount) * 100);
                  return (
                    <li key={e.name}>
                      <div className="flex items-center justify-between text-[12px]">
                        <span className="font-mono font-semibold text-[#0F172A]">{e.name}</span>
                        <span className="text-[#64748B]">{e._count.name.toLocaleString()}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[#F1F5F9]">
                        <div
                          className="h-full rounded-full bg-[#1A56DB]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>

          <SectionCard
            title="Recent events"
            description="Latest 20 tracked events"
            action={<Clock className="h-4 w-4 text-[#1A56DB]" />}
            flush
          >
            {recentEvents.length === 0 ? (
              <p className="py-8 text-center text-[13px] text-[#94A3B8]">No events yet.</p>
            ) : (
              <ul className="max-h-[420px] divide-y divide-[#E2E8F0] overflow-y-auto">
                {recentEvents.map((e) => (
                  <li key={e.id} className="flex items-center justify-between gap-4 px-5 py-3 hover:bg-[#FAFBFC]">
                    <div className="min-w-0">
                      <p className="truncate font-mono text-[12px] font-semibold text-[#0F172A]">{e.name}</p>
                      <p className="truncate text-[11px] text-[#64748B]">
                        {e.userId ? `user ${e.userId.slice(0, 8)}…` : "anonymous"}
                      </p>
                    </div>
                    <p className="shrink-0 text-[11px] text-[#94A3B8]">{dateTimeFmt.format(e.createdAt)}</p>
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
