import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { DailyBarChart } from "@/components/admin/charts";
import { AdminPageHeader, Meter } from "@/components/admin/v5/ui";
import { dailyCounts, fmtAgo, fmtDateTime } from "@/lib/admin-dates";
import { maskEmail } from "@/lib/admin-labels";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;
const DAY = 86_400_000;

type Attribution = Partial<Record<"utm_source" | "utm_medium" | "gclid" | "fbclid" | "msclkid", string>>;

/** Channel name for a first-touch attribution record (UTM source, else the ad click id). */
function channelOf(a: Attribution | undefined): string | null {
  if (!a) return null;
  if (a.utm_source) {
    const s = a.utm_source.trim();
    return s ? s.charAt(0).toUpperCase() + s.slice(1) : null;
  }
  if (a.gclid) return "Google Ads";
  if (a.fbclid) return "Meta ads";
  if (a.msclkid) return "Microsoft Ads";
  return null;
}

function requestNow() {
  return Date.now();
}

export default async function AdminAnalyticsPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const { range: rangeParam } = await searchParams;
  const range = RANGES.find((r) => String(r) === rangeParam) ?? 7;
  const now = requestNow();
  // Whole UTC days: today plus the previous range-1 days.
  const from = new Date(now - (range - 1) * DAY);
  const since = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate()));

  const [signupDates, topEvents, recentEvents, signupEvents] = await Promise.all([
    prisma.user.findMany({ where: { createdAt: { gte: since } }, select: { createdAt: true } }),
    prisma.analyticsEvent.groupBy({
      by: ["name"],
      where: { createdAt: { gte: since } },
      _count: { name: true },
      orderBy: { _count: { name: "desc" } },
      take: 8,
    }),
    prisma.analyticsEvent.findMany({
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, name: true, userId: true, createdAt: true, user: { select: { email: true } } },
    }),
    prisma.analyticsEvent.findMany({
      where: { name: "signup", createdAt: { gte: since }, userId: { not: null } },
      select: { userId: true, meta: true },
    }),
  ]);

  const points = dailyCounts(
    signupDates.map((u) => u.createdAt),
    since,
    now,
  );
  const maxCount = topEvents[0]?._count.name ?? 1;

  // Traffic sources → paid: first-touch attribution recorded on the sign-up event.
  const bySource = new Map<string, { signups: number; users: string[] }>();
  let attributed = 0;
  for (const e of signupEvents) {
    const ch = channelOf((e.meta as { attribution?: Attribution } | null)?.attribution);
    if (ch) attributed += 1;
    const key = ch ?? "No campaign tag";
    const row = bySource.get(key) ?? { signups: 0, users: [] };
    row.signups += 1;
    row.users.push(e.userId!);
    bySource.set(key, row);
  }
  const paidUsers = attributed
    ? new Set(
        (
          await prisma.analyticsEvent.findMany({
            where: { name: "pay_success", userId: { in: signupEvents.map((e) => e.userId!) } },
            select: { userId: true },
          })
        ).map((e) => e.userId),
      )
    : new Set<string | null>();
  const sources = [...bySource.entries()]
    .map(([name, r]) => ({ name, signups: r.signups, paid: r.users.filter((u) => paidUsers.has(u)).length }))
    .sort((a, b) => (a.name === "No campaign tag" ? 1 : b.name === "No campaign tag" ? -1 : b.signups - a.signups));
  const maxSource = Math.max(1, ...sources.map((s) => s.signups));

  return (
    <AdminShell email={admin.email} pageTitle="Analytics">
      <div className="space-y-5">
        <AdminPageHeader
          title="Analytics"
          description={`Sign-ups, tracked events and where paying users came from — last ${range} days, UTC.`}
          actions={
            <nav aria-label="Date range" className="flex gap-1 rounded-full bg-white p-1">
              {RANGES.map((r) => (
                <Link
                  key={r}
                  href={r === 7 ? "/admin-panel/analytics" : `/admin-panel/analytics?range=${r}`}
                  aria-current={r === range ? "page" : undefined}
                  className={`inline-flex min-h-[44px] items-center rounded-full px-3.5 text-[13px] font-bold transition-colors sm:min-h-[36px] ${
                    r === range ? "bg-[#111118] text-white" : "text-[#4a4862] hover:bg-[#f1eff8] hover:text-[#121226]"
                  }`}
                >
                  {r} days
                </Link>
              ))}
            </nav>
          }
        />

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
          <SectionCard title="Daily sign-ups" description="New accounts per UTC day">
            <DailyBarChart points={points} noun="sign-ups" />
          </SectionCard>

          <SectionCard title="Top events" description={`Most tracked event names · last ${range} days`}>
            {topEvents.length === 0 ? (
              <p className="py-8 text-center text-[14px] text-[#66647c]">No events in the last {range} days.</p>
            ) : (
              <ul>
                {topEvents.map((e) => (
                  <li key={e.name} className="border-t border-[#e2e0ea] py-2.5 first:border-t-0">
                    <div className="flex items-center justify-between gap-3 text-[13px]">
                      <span className="lc-mono min-w-0 break-all text-[#121226]">{e.name}</span>
                      <b className="shrink-0 tabular-nums text-[#121226]">{e._count.name.toLocaleString("en-US")}</b>
                    </div>
                    <div className="mt-1.5">
                      <Meter pct={Math.round((e._count.name / maxCount) * 100)} />
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </SectionCard>
        </div>

        <SectionCard title="Traffic sources → paid" description={`First-touch campaign of people who signed up in the last ${range} days`}>
          {attributed === 0 ? (
            <div className="py-6 text-center">
              <p className="text-[15px] font-bold text-[#121226]">No attributed sign-ups yet</p>
              <p className="mx-auto mt-1.5 max-w-[560px] text-[14px] leading-[1.55] text-[#4a4862]">
                Attribution starts collecting from sign-up: each new account records the UTM tags or ad click id it first
                arrived with. Visits, organic search and referrers are in GA4 and PostHog, not here.
              </p>
            </div>
          ) : (
            <ul>
              {sources.map((s) => (
                <li
                  key={s.name}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-4 gap-y-1.5 border-t border-[#e2e0ea] py-2.5 text-[14px] first:border-t-0 sm:grid-cols-[180px_1fr_150px]"
                >
                  <b className={`min-w-0 break-words ${s.name === "No campaign tag" ? "font-semibold text-[#66647c]" : "text-[#121226]"}`}>{s.name}</b>
                  <span className="text-right text-[13px] tabular-nums text-[#4a4862] sm:order-last">
                    {s.signups.toLocaleString("en-US")} sign-up{s.signups === 1 ? "" : "s"} · <b className="text-[#121226]">{s.paid}</b> paid
                  </span>
                  <div className="col-span-2 sm:col-span-1">
                    <Meter pct={(s.signups / maxSource) * 100} />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>

        <SectionCard title="Recent events" description="Latest 20 tracked events" flush>
          {recentEvents.length === 0 ? (
            <p className="py-8 text-center text-[14px] text-[#66647c]">No events yet.</p>
          ) : (
            <ul className="max-h-[420px] overflow-y-auto" tabIndex={0} aria-label="Recent events">
              {recentEvents.map((e) => (
                <li key={e.id} className="flex items-center justify-between gap-4 border-t border-[#e2e0ea] px-5 py-3 first:border-t-0 sm:px-6">
                  <div className="min-w-0">
                    <p className="lc-mono truncate text-[13px] text-[#121226]">{e.name}</p>
                    <p className="truncate text-[12px] text-[#66647c]">
                      {e.userId ? (
                        <Link href={`/admin-panel/users/${e.userId}`} className="hover:text-[#5440e8]">
                          {e.user ? maskEmail(e.user.email) : "deleted user"}
                        </Link>
                      ) : (
                        "anonymous"
                      )}
                    </p>
                  </div>
                  <time dateTime={e.createdAt.toISOString()} title={`${fmtDateTime(e.createdAt, now)} UTC`} className="shrink-0 text-[12px] text-[#66647c]">
                    {fmtAgo(e.createdAt, now)}
                  </time>
                </li>
              ))}
            </ul>
          )}
        </SectionCard>
      </div>
    </AdminShell>
  );
}
