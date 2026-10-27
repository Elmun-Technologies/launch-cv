import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { SectionCard } from "@/components/admin/section-card";
import { subscriptionRowGrantsPaid } from "@/lib/entitlements";
import { planIdFromVariantId } from "@/lib/plans";
import { productIdForCheckoutPlan } from "@/lib/polar";
import { CHECKOUT_PLAN_ORDER, type PlanId } from "@/lib/plan-config";
import { PUBLIC_PLANS } from "@/lib/monetization";
import { monthKey } from "@/lib/usage-limits";

export const dynamic = "force-dynamic";

const RANGES = [7, 30, 90] as const;

function daysAgo(n: number): Date {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000);
}

const usd = (n: number) => `$${n.toLocaleString("en-US", { maximumFractionDigits: 0 })}`;
const pct = (a: number, b: number) => (b > 0 ? `${Math.round((a / b) * 100)}%` : "—");

/** Settings checkout and AI need to work; a missing one silently loses sales. */
function configProblems(): string[] {
  const out: string[] = [];
  if (!process.env.POLAR_ACCESS_TOKEN) out.push("POLAR_ACCESS_TOKEN is not set — nobody can open checkout.");
  if (!process.env.POLAR_WEBHOOK_SECRET) out.push("POLAR_WEBHOOK_SECRET is not set — paid users won't get access.");
  for (const p of CHECKOUT_PLAN_ORDER) {
    if (!productIdForCheckoutPlan(p)) out.push(`No Polar product id for ${PUBLIC_PLANS[p].title} — its checkout fails.`);
  }
  if (!process.env.OPENAI_API_KEY) out.push("OPENAI_API_KEY is not set — the free ATS check and AI tools fail.");
  if (!process.env.NEXT_PUBLIC_APP_URL) out.push("NEXT_PUBLIC_APP_URL is not set — checkout return links and sitemap use a fallback host.");
  return out;
}

export default async function AdminOverviewPage({ searchParams }: { searchParams: Promise<{ range?: string }> }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const { range: rangeParam } = await searchParams;
  const range = RANGES.find((r) => String(r) === rangeParam) ?? 30;
  const since = daysAgo(range);

  const [subs, signups, atsChecks, checkoutRows, paidRows, payEvents, usage, recentUsers] = await Promise.all([
    prisma.subscription.findMany({
      select: { userId: true, status: true, currentPeriodEnd: true, stripePriceId: true, stripeSubscriptionId: true },
    }),
    prisma.user.count({ where: { createdAt: { gte: since } } }),
    prisma.freeAtsTrial.count({ where: { createdAt: { gte: since } } }),
    prisma.analyticsEvent.groupBy({
      by: ["userId"],
      where: { name: "checkout_started", createdAt: { gte: since }, userId: { not: null } },
    }),
    prisma.analyticsEvent.groupBy({
      by: ["userId"],
      where: { name: "pay_success", createdAt: { gte: since }, userId: { not: null } },
    }),
    prisma.analyticsEvent.findMany({
      where: { name: "pay_success", createdAt: { gte: since } },
      select: { userId: true, meta: true },
    }),
    prisma.usageMonth.aggregate({
      where: { month: monthKey() },
      _sum: { jdCount: true, roleFitCount: true, packetCount: true },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
      take: 8,
      select: { id: true, email: true, createdAt: true, googleId: true, subscription: { select: { stripePriceId: true, status: true, currentPeriodEnd: true } } },
    }),
  ]);

  const planOfSub = new Map<string, PlanId>();
  let mrr = 0;
  let payingUsers = 0;
  let lifetimeUsers = 0;
  for (const s of subs) {
    if (!subscriptionRowGrantsPaid({ status: s.status, currentPeriodEnd: s.currentPeriodEnd })) continue;
    const plan = planIdFromVariantId(s.stripePriceId);
    planOfSub.set(s.userId, plan);
    payingUsers += 1;
    if (plan === "lifetime" || s.stripeSubscriptionId.startsWith("order:")) lifetimeUsers += 1;
    else if (plan !== "none") mrr += PUBLIC_PLANS[plan].priceAmount;
  }

  // Purchase value at list price: the event's own plan, else the buyer's current plan.
  let revenue = 0;
  for (const e of payEvents) {
    const metaPlan = (e.meta as { plan?: string } | null)?.plan;
    const plan = (metaPlan && metaPlan in PUBLIC_PLANS ? metaPlan : e.userId ? planOfSub.get(e.userId) : undefined) as
      | keyof typeof PUBLIC_PLANS
      | undefined;
    if (plan && plan in PUBLIC_PLANS) revenue += PUBLIC_PLANS[plan].priceAmount;
  }

  const aiCalls = (usage._sum.jdCount ?? 0) + (usage._sum.roleFitCount ?? 0) + (usage._sum.packetCount ?? 0);
  const checkouts = checkoutRows.length;
  const paid = paidRows.length;
  const problems = configProblems();

  const kpis = [
    { l: "Revenue", v: usd(revenue), d: `${payEvents.length} purchases · list prices` },
    { l: "MRR", v: usd(mrr), d: `${payingUsers - lifetimeUsers} monthly · ${lifetimeUsers} lifetime` },
    { l: "Paying users", v: payingUsers.toLocaleString(), d: `${paid} new in ${range} days` },
    { l: "Sign-ups", v: signups.toLocaleString(), d: `last ${range} days` },
    { l: "Free ATS checks", v: atsChecks.toLocaleString(), d: `${(atsChecks / range).toFixed(1)} per day` },
  ];

  const funnel = [
    { l: "Ran a free ATS check", n: atsChecks, of: null as number | null },
    { l: "Created an account", n: signups, of: atsChecks },
    { l: "Started checkout", n: checkouts, of: signups },
    { l: "Paid", n: paid, of: checkouts },
  ];
  const top = Math.max(1, ...funnel.map((f) => f.n));

  const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  return (
    <AdminShell email={admin.email} pageTitle="Overview">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em]">Overview</h1>
          <nav aria-label="Range" className="flex gap-1 rounded-full bg-[#F0F0EE] p-[3px] text-[13px]">
            {RANGES.map((r) => (
              <Link
                key={r}
                href={`/admin-panel?range=${r}`}
                aria-current={r === range ? "page" : undefined}
                className={`rounded-full px-3 py-1.5 ${r === range ? "bg-white shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-[#3F3F3F]"}`}
              >
                {r} days
              </Link>
            ))}
          </nav>
        </div>

        {problems.length > 0 ? (
          <div role="alert" className="rounded-xl border border-[#F6D3CD] bg-[#FDF2F0] px-4 py-3 text-[14px]">
            <p className="font-semibold text-[#111111]">Setup issues that block revenue</p>
            <ul className="mt-1.5 list-disc space-y-0.5 pl-5 text-[#3F3F3F]">
              {problems.map((p) => (
                <li key={p}>{p}</li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
          {kpis.map((k) => (
            <div key={k.l} className="rounded-[14px] border border-[#E5E5E2] bg-white px-[18px] py-4">
              <p className="text-[13px] text-[#6B6B6B]">{k.l}</p>
              <p className="mt-1.5 text-[26px] font-semibold tracking-[-0.02em] [font-feature-settings:'tnum']">{k.v}</p>
              <p className="mt-0.5 text-[12px] text-[#6B6B6B]">{k.d}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr]">
          <div className="rounded-[14px] border border-[#E5E5E2] bg-white p-5">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[16px] font-semibold">Funnel · last {range} days</h2>
              <span className="text-[13px] text-[#6B6B6B]">Where people drop off</span>
            </div>
            <div className="mt-4 flex flex-col gap-3.5 text-[14px]">
              {funnel.map((f, i) => (
                <div key={f.l}>
                  <p className="flex justify-between">
                    <span>{f.l}</span>
                    <span className="[font-feature-settings:'tnum']">
                      {f.n.toLocaleString()}
                      {f.of !== null && f.n <= f.of ? <span className="text-[#6B6B6B]"> · {pct(f.n, f.of)}</span> : null}
                    </span>
                  </p>
                  <div className="mt-1.5 h-[26px] rounded-md bg-[#F5F5F3]">
                    <div
                      className={`h-[26px] rounded-md ${i === funnel.length - 1 ? "bg-[#2563EB]" : ["bg-[#111111]", "bg-[#3F3F3F]", "bg-[#6B6B6B]"][i]}`}
                      style={{ width: `${Math.max(f.n > 0 ? 2 : 0, (f.n / top) * 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="mt-4 text-[12px] leading-[1.5] text-[#6B6B6B]">
              Sign-ups include people who didn&apos;t run a check first. AI calls this month: {aiCalls.toLocaleString()}.
            </p>
          </div>

          <SectionCard
            title="Recent sign-ups"
            flush
            action={
              <Link href="/admin-panel/users" className="inline-flex items-center gap-1 text-[13px] text-[#1D4ED8] hover:underline">
                All users <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            {recentUsers.length === 0 ? (
              <p className="px-5 py-8 text-center text-[13px] text-[#8A8A86]">No users yet.</p>
            ) : (
              <table className="w-full text-[14px]">
                <thead>
                  <tr className="text-left text-[#6B6B6B]">
                    <th className="px-5 py-2.5 font-medium">User</th>
                    <th className="py-2.5 font-medium">Source</th>
                    <th className="py-2.5 pr-5 font-medium">Plan</th>
                  </tr>
                </thead>
                <tbody>
                  {recentUsers.map((u) => {
                    const s = u.subscription;
                    const plan =
                      s && subscriptionRowGrantsPaid({ status: s.status, currentPeriodEnd: s.currentPeriodEnd })
                        ? planIdFromVariantId(s.stripePriceId)
                        : "none";
                    return (
                      <tr key={u.id} className="border-t border-[#EEEEEB]">
                        <td className="max-w-[220px] px-5 py-2.5">
                          <Link href={`/admin-panel/users/${u.id}`} className="block truncate hover:text-[#1D4ED8]">
                            {u.email}
                          </Link>
                          <span className="text-[12px] text-[#8A8A86]">{dateFmt.format(u.createdAt)}</span>
                        </td>
                        <td className="py-2.5 text-[#3F3F3F]">{u.googleId ? "Google" : "Email"}</td>
                        <td className={`py-2.5 pr-5 ${plan === "none" ? "text-[#6B6B6B]" : ""}`}>
                          {plan === "none" ? "Free" : PUBLIC_PLANS[plan].title}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </SectionCard>
        </div>
      </div>
    </AdminShell>
  );
}
