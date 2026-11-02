import { redirect } from "next/navigation";
import { BarChart3, Clock, TrendingUp } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { AdminPageHeader, Meter } from "@/components/admin/v5/ui";

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
      <div className="space-y-5">
        <AdminPageHeader
          title="Analytics"
          description="Daily sign-ups for the last week, top tracked events, and most recent activity."
        />

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <SectionCard
            title="Daily sign-ups · last 7 days"
            description="Counts of new user accounts created per UTC day"
            action={<TrendingUp className="h-4 w-4 text-[#5440e8]" aria-hidden="true" />}
          >
            <ol className="flex h-[220px] items-end gap-1.5 sm:gap-2.5" aria-label="Sign-ups per day">
              {last7Days.map((d, i) => {
                const heightPct = (d.count / maxDaily) * 100;
                const isToday = i === last7Days.length - 1;
                return (
                  <li key={d.label} className="flex h-full min-w-0 flex-1 flex-col items-center justify-end gap-1.5">
                    <span className="text-[13px] font-bold tabular-nums leading-none text-[#121226]">
                      {d.count}
                      <span className="sr-only"> sign-ups on {d.label}</span>
                    </span>
                    <div className="flex w-full flex-1 items-end">
                      <div
                        aria-hidden="true"
                        className={`w-full rounded-t-lg rounded-b-sm ${isToday ? "bg-[#5440e8]" : "bg-[#c9c0ff]"}`}
                        style={{ height: `${heightPct}%`, minHeight: d.count > 0 ? 4 : 0 }}
                      />
                    </div>
                    <span aria-hidden="true" className="text-[11px] text-[#66647c]">
                      {d.label.split(",")[0]}
                    </span>
                  </li>
                );
              })}
            </ol>
          </SectionCard>

          <SectionCard
            title="Top events"
            description="Most frequently tracked event names"
            action={<BarChart3 className="h-4 w-4 text-[#5440e8]" aria-hidden="true" />}
          >
            {allEvents.length === 0 ? (
              <p className="py-8 text-center text-[14px] text-[#66647c]">No events recorded.</p>
            ) : (
              <ul>
                {allEvents.map((e) => {
                  const pct = Math.round((e._count.name / maxCount) * 100);
                  return (
                    <li key={e.name} className="border-t border-[#e2e0ea] py-2.5 first:border-t-0">
                      <div className="flex items-center justify-between gap-3 text-[13px]">
                        <span className="lc-mono min-w-0 break-all text-[#121226]">{e.name}</span>
                        <b className="shrink-0 tabular-nums text-[#121226]">{e._count.name.toLocaleString()}</b>
                      </div>
                      <div className="mt-1.5">
                        <Meter pct={pct} />
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </SectionCard>
        </div>

        <SectionCard
          title="Recent events"
          description="Latest 20 tracked events"
          action={<Clock className="h-4 w-4 text-[#5440e8]" aria-hidden="true" />}
          flush
        >
          {recentEvents.length === 0 ? (
            <p className="py-8 text-center text-[14px] text-[#66647c]">No events yet.</p>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto" tabIndex={0} aria-label="Recent events">
              {recentEvents.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between gap-4 border-t border-[#e2e0ea] px-6 py-3 first:border-t-0"
                >
                  <div className="min-w-0">
                    <p className="lc-mono truncate text-[13px] text-[#121226]">{e.name}</p>
                    <p className="truncate text-[12px] text-[#66647c]">
                      {e.userId ? `user ${e.userId.slice(0, 8)}…` : "anonymous"}
                    </p>
                  </div>
                  <p className="shrink-0 text-[12px] text-[#66647c]">{dateTimeFmt.format(e.createdAt)}</p>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </AdminShell>
  );
}
