import { getSettings } from "@/lib/app-settings";
import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { StatusBadge } from "@/components/admin/status-badge";
import { DailyLineChart } from "@/components/admin/charts";
import { adminH1, adminLink } from "@/components/admin/admin-ui";
import { subscriptionRowGrantsPaid } from "@/lib/entitlements";
import { productIdForCheckoutPlan } from "@/lib/polar";
import { integrationStatuses } from "@/lib/integrations";
import { secretBoxReady } from "@/lib/secret-box";
import { CHECKOUT_PLAN_ORDER, type PlanId } from "@/lib/plan-config";
import { PUBLIC_PLANS } from "@/lib/monetization";
import { billingOf, planResolver } from "@/lib/admin-billing";
import { dailyCounts, fmtAgo, fmtDateTime, startOfUtcDay, startOfUtcMonth } from "@/lib/admin-dates";
import { maskEmail, planLabel } from "@/lib/admin-labels";

export const dynamic = "force-dynamic";

const RANGES = ["7", "30", "90", "all"] as const;
type Range = (typeof RANGES)[number];
const DAY = 86_400_000;

const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : "—");

/** "+18% vs prior 30 days", or null when there's nothing to compare against. */
function delta(cur: number, prev: number | null, days: number | null): { text: string; up: boolean } | null {
  if (prev === null || days === null || prev <= 0) return null;
  const change = Math.round(((cur - prev) / prev) * 100);
  return { text: `${change > 0 ? "+" : change < 0 ? "−" : "±"}${Math.abs(change)}% vs prior ${days} days`, up: change >= 0 };
}

/** Settings checkout and AI need to work; a missing one silently loses sales. */
async function configProblems(): Promise<string[]> {
  const out: string[] = [];
  const st = await integrationStatuses();
  const field = (p: string, f: string) => st.find((x) => x.id === p)?.fields.find((x) => x.key === f)?.source !== "none";
  if (!field("polar", "accessToken")) out.push("Polar access token is missing — nobody can open checkout.");
  if (!field("polar", "webhookSecret")) out.push("Polar webhook secret is missing — paid users won't get access.");
  for (const p of CHECKOUT_PLAN_ORDER) {
    if (!(await productIdForCheckoutPlan(p))) out.push(`No Polar product id for ${PUBLIC_PLANS[p].title} — its checkout fails.`);
  }
  // Only the providers the chosen models actually use need a key.
  const models = Object.values((await getSettings()).models);
  if (models.some((m) => !m.startsWith("claude-")) && !field("openai", "apiKey")) out.push("OpenAI key is missing — AI tools set to an OpenAI model fail.");
  if (models.some((m) => m.startsWith("claude-")) && !field("anthropic", "apiKey")) out.push("Claude API key is missing — AI tools set to a Claude model fail.");
  if (!secretBoxReady()) out.push("KEY_ENCRYPTION_KEY is not set in hosting — keys can't be saved from Integrations.");
  if (!process.env.NEXT_PUBLIC_APP_URL) out.push("NEXT_PUBLIC_APP_URL is not set — checkout return links and sitemap use a fallback host.");
  return out;
}

/** Request time, read once (outside render for the purity lint). */
function requestNow() {
  return Date.now();
}

export default async function AdminOverviewPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const { range: rangeParam } = await searchParams;
  const range: Range = RANGES.find((r) => r === rangeParam) ?? "30";
  const days = range === "all" ? null : Number(range);
  const now = requestNow();
  const since = days ? new Date(now - days * DAY) : null;
  const prevSince = days ? new Date(now - 2 * days * DAY) : null;
  const inRange = since ? { gte: since } : undefined;
  const inPrev = since && prevSince ? { gte: prevSince, lt: since } : undefined;

  const [subs, signups, atsChecks, checkoutRows, paidRows, payEvents, aiCallsMonth, recentUsers, signupDays, firstUser] = await Promise.all([
    prisma.subscription.findMany({
      select: { userId: true, status: true, currentPeriodEnd: true, stripePriceId: true, stripeSubscriptionId: true },
    }),
    prisma.user.count({ where: { createdAt: inRange } }),
    prisma.freeAtsTrial.count({ where: { createdAt: inRange } }),
    prisma.analyticsEvent.groupBy({
      by: ["userId"],
      where: { name: "checkout_started", createdAt: inRange, userId: { not: null } },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["userId"],
      where: { name: "pay_success", createdAt: inRange, userId: { not: null } },
    }),
    prisma.analyticsEvent.findMany({
      where: { name: "pay_success", createdAt: inPrev ? { gte: prevSince! } : undefined },
      select: { userId: true, meta: true, createdAt: true },
    }),
    // Same source as Admin → AI usage: one AiCall row per model call.
    prisma.aiCall.count({ where: { createdAt: { gte: startOfUtcMonth(now) } } }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        id: true,
        email: true,
        createdAt: true,
        googleId: true,
        passwordHash: true,
        grantedPlan: true,
        grantedPlanUntil: true,
        subscription: { select: { stripePriceId: true, stripeSubscriptionId: true, status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true } },
      },
    }),
    prisma.$queryRaw<{ day: string; n: bigint }[]>`
      SELECT to_char("createdAt", 'YYYY-MM-DD') AS day, count(*)::bigint AS n
      FROM "User"
      WHERE "createdAt" >= ${since ?? new Date(0)}
      GROUP BY 1`,
    range === "all" ? prisma.user.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } }) : null,
  ]);
  const [prevSignups, prevAts, prevPaidRows] = inPrev
    ? await Promise.all([
        prisma.user.count({ where: { createdAt: inPrev } }),
        prisma.freeAtsTrial.count({ where: { createdAt: inPrev } }),
        prisma.analyticsEvent.groupBy({ by: ["userId"], where: { name: "pay_success", createdAt: inPrev, userId: { not: null } } }),
      ])
    : [null, null, null];

  const planOf = await planResolver([...subs.map((s) => s.stripePriceId), ...recentUsers.map((u) => u.subscription?.stripePriceId)]);
  const planOfSub = new Map<string, PlanId>();
  let mrr = 0;
  let payingUsers = 0;
  let lifetimeUsers = 0;
  for (const s of subs) {
    if (!subscriptionRowGrantsPaid({ status: s.status, currentPeriodEnd: s.currentPeriodEnd })) continue;
    const plan: PlanId = s.stripeSubscriptionId.startsWith("order:") ? "lifetime" : planOf(s.stripePriceId);
    planOfSub.set(s.userId, plan);
    payingUsers += 1;
    if (plan === "lifetime" || s.stripeSubscriptionId.startsWith("order:")) lifetimeUsers += 1;
    else if (plan !== "none") mrr += PUBLIC_PLANS[plan].priceAmount;
  }

  // Purchase value at list price: the event's own plan, else the buyer's current plan.
  const valueOf = (e: { userId: string | null; meta: unknown }) => {
    const metaPlan = (e.meta as { plan?: string } | null)?.plan;
    const plan = (metaPlan && metaPlan in PUBLIC_PLANS ? metaPlan : e.userId ? planOfSub.get(e.userId) : undefined) as
      | keyof typeof PUBLIC_PLANS
      | undefined;
    return plan && plan in PUBLIC_PLANS ? PUBLIC_PLANS[plan].priceAmount : 0;
  };
  const curPay = payEvents.filter((e) => !since || e.createdAt >= since);
  const prevPay = since ? payEvents.filter((e) => e.createdAt < since) : [];
  const revenue = curPay.reduce((a, e) => a + valueOf(e), 0);
  const prevRevenue = inPrev ? prevPay.reduce((a, e) => a + valueOf(e), 0) : null;

  const checkouts = checkoutRows.length;
  const paid = paidRows.length;
  const problems = await configProblems();
  const rangeText = days ? `last ${days} days` : "all time";

  // Daily sign-ups for the chart: one point per UTC day, zeros included.
  const chartFrom = days ? new Date(now - (days - 1) * DAY) : startOfUtcDay(firstUser?.createdAt ?? now);
  const perDay = new Map(signupDays.map((r) => [r.day, Number(r.n)]));
  const points = dailyCounts([], chartFrom, now).map((p) => ({ day: p.day, count: perDay.get(p.day) ?? 0 }));

  const spanDays = days ?? Math.max(1, Math.round((now - chartFrom.getTime()) / DAY) + 1);
  const kpis = [
    { l: "Revenue", v: usd(revenue), d: `${curPay.length} purchase${curPay.length === 1 ? "" : "s"} · list prices`, delta: delta(revenue, prevRevenue, days) },
    { l: "MRR", v: usd(mrr), d: `${payingUsers - lifetimeUsers} monthly · ${lifetimeUsers} lifetime`, delta: null },
    {
      l: "Paying users",
      v: payingUsers.toLocaleString("en-US"),
      d: `${paid} new ${days ? `in ${days} days` : "all time"}`,
      delta: delta(paid, prevPaidRows ? prevPaidRows.length : null, days),
    },
    { l: "Sign-ups", v: signups.toLocaleString("en-US"), d: rangeText, delta: delta(signups, prevSignups, days) },
    { l: "Free ATS checks", v: atsChecks.toLocaleString("en-US"), d: `${(atsChecks / spanDays).toFixed(1)} per day`, delta: delta(atsChecks, prevAts, days) },
  ];

  const funnel = [
    { l: "Ran a free ATS check", n: atsChecks, of: null as number | null },
    { l: "Created an account", n: signups, of: atsChecks },
    { l: "Started checkout", n: checkouts, of: signups },
    { l: "Paid", n: paid, of: checkouts },
  ];
  const top = Math.max(1, ...funnel.map((f) => f.n));

  return (
    <AdminShell email={admin.email} pageTitle="Overview">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-[18px]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className={adminH1}>Overview</h1>
          <nav aria-label="Date range" className="flex gap-1 rounded-full bg-white p-1">
            {RANGES.map((r) => (
              <Link
                key={r}
                href={r === "30" ? "/admin-panel" : `/admin-panel?range=${r}`}
                aria-current={r === range ? "page" : undefined}
                className={`inline-flex min-h-[44px] items-center rounded-full px-3.5 text-[13px] sm:min-h-[36px] font-bold transition-colors ${
                  r === range ? "bg-[#111118] text-white" : "text-[#4a4862] hover:bg-[#f1eff8] hover:text-[#121226]"
                }`}
              >
                {r === "all" ? "All" : `${r} days`}
              </Link>
            ))}
          </nav>
        </div>

        {problems.length > 0 ? (
          <div role="alert" className="flex flex-col gap-3 rounded-[20px] bg-[#fbe2e3] px-5 py-4 text-[#8f1d22] sm:flex-row sm:items-start">
            <div className="min-w-0 flex-1">
              <p className="text-[15px] font-bold">Setup issues that block revenue</p>
              <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[14px] leading-[1.5]">
                {problems.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
            </div>
            <Link href="/admin-panel/integrations" className="lc-link shrink-0 self-start text-[14px] font-extrabold text-[#8f1d22]">
              Fix in Integrations →
            </Link>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {kpis.map((k, i) => (
            <div
              key={k.l}
              className={`min-w-0 rounded-[22px] p-5 ${i === 0 ? "col-span-2 bg-[#5440e8] text-white lg:col-span-1" : "bg-white"}`}
            >
              <p className={`text-[13px] ${i === 0 ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>{k.l}</p>
              <p className="mt-1.5 truncate text-[26px] font-extrabold leading-[1.15] tracking-[-0.03em] tabular-nums sm:text-[34px]">{k.v}</p>
              {k.delta ? (
                <p
                  className={`mt-0.5 text-[12px] font-bold ${
                    i === 0 ? "text-[#e4dfff]" : k.delta.up ? "text-[#0b7a4f]" : "text-[#a3262b]"
                  }`}
                >
                  {k.delta.text}
                </p>
              ) : null}
              <p className={`mt-0.5 text-[12px] font-semibold ${i === 0 ? "text-[#e4dfff]" : "text-[#66647c]"}`}>{k.d}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-[18px] lg:grid-cols-2">
          <section className="lc-card min-w-0 rounded-[24px] p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-[18px] font-extrabold tracking-[-0.01em]">Sign-ups per day</h2>
              <span className="text-[13px] text-[#66647c]">UTC days · {rangeText}</span>
            </div>
            <div className="mt-4">
              <DailyLineChart points={points} noun="sign-ups" />
            </div>
          </section>

          <section className="lc-card min-w-0 rounded-[24px] p-5 sm:p-6">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h2 className="text-[18px] font-extrabold tracking-[-0.01em]">Where people drop off</h2>
              <span className="text-[13px] text-[#66647c]">Funnel · {rangeText}</span>
            </div>
            <ol className="mt-3">
              {funnel.map((f) => (
                <li
                  key={f.l}
                  className="grid grid-cols-[1fr_auto] items-center gap-x-3.5 gap-y-1.5 py-2.5 sm:grid-cols-[160px_1fr_96px]"
                >
                  <span className="text-[14px] font-bold">{f.l}</span>
                  <span className="text-right text-[14px] tabular-nums sm:order-last">
                    <b>{f.n.toLocaleString("en-US")}</b>
                    {f.of !== null && f.n <= f.of ? <span className="text-[#66647c]"> {pct(f.n, f.of)}</span> : null}
                  </span>
                  <div className="col-span-2 h-7 overflow-hidden rounded-lg bg-[#f1eff8] sm:col-span-1" aria-hidden>
                    <div
                      className="h-full rounded-lg bg-[#5440e8]"
                      style={{ width: `${Math.max(f.n > 0 ? 2 : 0, (f.n / top) * 100)}%` }}
                    />
                  </div>
                </li>
              ))}
            </ol>
            <p className="mt-3 text-[12px] leading-[1.5] text-[#66647c]">
              Sign-ups include people who didn&apos;t run a check first. AI calls this month (UTC):{" "}
              <Link href="/admin-panel/ai-usage" className={`${adminLink} text-[12px]`}>
                {aiCallsMonth.toLocaleString("en-US")}
              </Link>
              .
            </p>
          </section>
        </div>

        <SectionCard
          title="Recent sign-ups"
          flush
          action={
            <Link href="/admin-panel/users" className={`${adminLink} text-[14px]`}>
              All users →
            </Link>
          }
        >
          {recentUsers.length === 0 ? (
            <p className="px-6 py-10 text-center text-[14px] text-[#66647c]">No users yet.</p>
          ) : (
            <div className="relative overflow-x-auto" tabIndex={0} role="region" aria-label="Recent sign-ups">
              <table className="w-full min-w-[520px] text-[14px]">
                <thead>
                  <tr className="text-left text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c]">
                    <th scope="col" className="py-3 pl-5 pr-3 font-bold sm:pl-6">User</th>
                    <th scope="col" className="px-3 py-3 font-bold">Sign-in method</th>
                    <th scope="col" className="px-3 py-3 font-bold">Plan</th>
                    <th scope="col" className="py-3 pl-3 pr-5 text-right font-bold sm:pr-6">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => {
                    const b = billingOf(u.subscription, u, planOf, now);
                    const method = u.googleId ? (u.passwordHash ? "Google + email" : "Google") : "Email";
                    return (
                      <tr key={u.id} className="border-t border-[#e2e0ea]">
                        <td className="max-w-[300px] py-3 pl-5 pr-3 sm:pl-6">
                          <Link href={`/admin-panel/users/${u.id}`} className="block truncate font-bold hover:text-[#5440e8]">
                            {maskEmail(u.email)}
                          </Link>
                        </td>
                        <td className="px-3 py-3 text-[#4a4862]">{method}</td>
                        <td className="px-3 py-3">
                          <StatusBadge tone={b.plan === "none" ? "default" : "violet"}>{planLabel(b.plan)}</StatusBadge>
                        </td>
                        <td className="whitespace-nowrap py-3 pl-3 pr-5 text-right text-[#66647c] sm:pr-6">
                          <time dateTime={u.createdAt.toISOString()} title={`${fmtDateTime(u.createdAt, now)} UTC`}>
                            {fmtAgo(u.createdAt, now)}
                          </time>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </SectionCard>
      </div>
    </AdminShell>
  );
}
