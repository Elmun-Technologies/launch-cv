import { redirect } from "next/navigation";
import { BarChart3, Clock, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";

export default async function AdminAnalyticsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

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

  return (
    <AdminShell email={admin.email} pageTitle="Analytics">
      <div className="space-y-8">
        <h2 className="text-[28px] font-bold text-gray-900">Analytics</h2>

        {/* Daily Signups */}
        <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#7C5CFC]" />
            <h3 className="text-[15px] font-semibold text-gray-900">Daily Signups (Last 7 Days)</h3>
          </div>
          <div className="grid grid-cols-7 gap-3 p-6">
            {last7Days.map((d) => (
              <div
                key={d.label}
                className="flex flex-col items-center gap-2 rounded-xl border border-gray-100 bg-gray-50/60 p-4"
              >
                <span className="text-[28px] font-bold text-gray-900">{d.count}</span>
                <span className="text-[11px] text-gray-500">{d.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          {/* Top Events */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-[#7C5CFC]" />
              <h3 className="text-[15px] font-semibold text-gray-900">Top Events</h3>
            </div>
            <div className="space-y-2 p-6">
              {allEvents.length === 0 ? (
                <p className="text-center text-[13px] text-gray-400">No events recorded</p>
              ) : (
                allEvents.map((e) => {
                  const pct = Math.round((e._count.name / maxCount) * 100);
                  return (
                    <div key={e.name} className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-medium text-gray-900">{e.name}</span>
                        <span className="text-[13px] text-gray-500">{e._count.name}</span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-100">
                        <div
                          className="h-full rounded-full bg-[#7C5CFC]"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Recent Events */}
          <div className="rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <div className="border-b border-gray-100 px-6 py-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-[#7C5CFC]" />
              <h3 className="text-[15px] font-semibold text-gray-900">Recent Events</h3>
            </div>
            <div className="divide-y divide-gray-50 max-h-[500px] overflow-y-auto">
              {recentEvents.length === 0 ? (
                <p className="px-6 py-8 text-center text-[13px] text-gray-400">No events yet</p>
              ) : (
                recentEvents.map((e) => (
                  <div key={e.id} className="flex items-center justify-between px-6 py-3 hover:bg-gray-50/60">
                    <div>
                      <p className="text-[13px] font-medium text-gray-900">{e.name}</p>
                      <p className="text-[11px] text-gray-400">User: {e.userId ?? "anonymous"}</p>
                    </div>
                    <p className="text-[13px] text-gray-400">
                      {e.createdAt.toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
