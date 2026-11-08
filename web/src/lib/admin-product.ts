import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { AI_TOOL_LABELS, type AiTool } from "@/lib/app-settings";
import { loadPurchaseContext } from "@/lib/admin-revenue";
import { planOfRow, planResolver } from "@/lib/admin-billing";
import type { PlanId } from "@/lib/plan-config";
import {
  DAY_MS,
  dayKey,
  funnelStats,
  grossMarginPct,
  inRange,
  retentionMatrix,
  round2,
  unitEconomics,
  weekStart,
  type BizRange,
  type CohortRow,
  type FunnelStep,
  type FunnelUser,
  type PlanEconomics,
} from "@/lib/biz-metrics";

/**
 * Data for Admin → Product (and its CSV exports). Server only. Every query is
 * bounded by the selected range (activity for retention runs up to 8 weeks
 * after the last cohort).
 */

/** Most recent weekly cohorts shown in the retention grid. */
export const MAX_COHORTS = 16;
export const RETENTION_WEEKS = 8;
/** Safety cap for the per-user funnel query. */
const FUNNEL_MAX_USERS = 50_000;

/** One-line definitions shown as tooltips. */
export const PRODUCT_DEFS = {
  retention: "Share of a weekly sign-up cohort (Monday–Sunday, UTC) that did anything that week: any analytics event or AI call. Week 0 is the sign-up week.",
  toolUsers: "Distinct signed-in users with at least one AI call of this tool in the range (anonymous free-tool calls have no user).",
  calls: "AiCall rows: one per model call, successful or not.",
  errorRate: "Share of calls that failed (AiCall.ok = false). Failed calls cost nothing.",
  avgCost: "AI spend ÷ calls, from the token prices in lib/ai-budget.ts.",
  exports: "pdf_export / docx_export / cover_letter_docx_export events: downloads of the user's own documents.",
  freeTools: "Public free tools: free_tool_used events by tool, plus free ATS checks. Mostly anonymous, so only counts.",
  totalCost: "All AI spend in the range (signed-in and anonymous calls).",
  freeCost: "AI spend on people who never paid: signed-in users without a billing row plus anonymous free-tool calls. Staff grants count here.",
  margin: "(Net revenue − AI spend) ÷ net revenue for the range. AI is the only cost counted; hosting, email and fees are not.",
  planRow: "Plan = the user's billing row (current, or most recent including expired passes). No billing row = Free. Revenue = purchases of that plan in the range.",
  topUsers: "The 20 users with the highest AI spend in the range. Margin compares everything they paid with all their AI spend, both up to the range end.",
} as const;

export const EXPORT_EVENTS = [
  { name: "pdf_export", label: "Resume PDF export" },
  { name: "docx_export", label: "Resume Word export" },
  { name: "cover_letter_docx_export", label: "Cover letter Word export" },
] as const;

const FREE_TOOL_LABELS: Record<string, string> = {
  bullet_generator: "Bullet generator",
  summary_generator: "Summary generator",
  resignation_generator: "Resignation letter generator",
};

export type FeatureRow = { tool: string; label: string; users: number; calls: number; callsPerUser: number | null; errorRatePct: number | null; avgCostUsd: number | null; costUsd: number };
export type UsageRow = { key: string; label: string; users: number | null; count: number };
export type TopUserRow = {
  userId: string;
  email: string;
  plan: PlanId;
  calls: number;
  costUsd: number;
  costToDateUsd: number;
  paidToDateUsd: number;
  /** (paid to date − AI cost to date) / paid to date; null when nothing was paid. */
  marginPct: number | null;
};

export type ProductData = {
  funnel: FunnelStep[];
  funnelCapped: boolean;
  cohorts: CohortRow[];
  features: FeatureRow[];
  exports: UsageRow[];
  freeTools: UsageRow[];
  economics: PlanEconomics[];
  anonymousCostUsd: number;
  anonymousCalls: number;
  freeSignedInCostUsd: number;
  totalCostUsd: number;
  topUsers: TopUserRow[];
};

const STAFF_ROLES = ["owner", "admin", "editor", "support"];

async function loadFunnel(range: BizRange): Promise<{ users: FunnelUser[]; capped: boolean }> {
  const rows = await prisma.$queryRaw<
    { signup: Date; verified: Date | null; resume: Date | null; ai: Date | null; lim: Date | null; checkout: Date | null; paid: Date | null }[]
  >`
    WITH u AS (
      SELECT "id", "createdAt", "emailVerifiedAt" FROM "User"
      WHERE "createdAt" >= ${range.from} AND "createdAt" < ${range.to} AND "role" NOT IN (${Prisma.join(STAFF_ROLES)})
      ORDER BY "createdAt" DESC
      LIMIT ${FUNNEL_MAX_USERS}
    )
    SELECT
      u."createdAt" AS signup,
      u."emailVerifiedAt" AS verified,
      LEAST(
        (SELECT min(r."createdAt") FROM "Resume" r WHERE r."userId" = u."id"),
        (SELECT min(e."createdAt") FROM "AnalyticsEvent" e WHERE e."userId" = u."id" AND e."name" = 'resume_created')
      ) AS resume,
      (SELECT min(a."createdAt") FROM "AiCall" a WHERE a."userId" = u."id") AS ai,
      (SELECT min(e."createdAt") FROM "AnalyticsEvent" e WHERE e."userId" = u."id" AND e."name" = 'free_limit_reached') AS lim,
      (SELECT min(e."createdAt") FROM "AnalyticsEvent" e WHERE e."userId" = u."id" AND e."name" = 'checkout_started') AS checkout,
      (SELECT min(e."createdAt") FROM "AnalyticsEvent" e WHERE e."userId" = u."id" AND e."name" = 'pay_success') AS paid
    FROM u`;
  return {
    capped: rows.length >= FUNNEL_MAX_USERS,
    users: rows.map((r) => ({ signup: r.signup, verified: r.verified, resume: r.resume, ai: r.ai, limit: r.lim, checkout: r.checkout, paid: r.paid })),
  };
}

async function loadCohorts(range: BizRange, now: number): Promise<CohortRow[]> {
  // The most recent MAX_COHORTS weeks that start inside the range.
  const lastWeek = weekStart(new Date(Math.min(range.to.getTime(), now) - 1));
  const firstWeek = new Date(Math.max(weekStart(range.from).getTime(), lastWeek.getTime() - (MAX_COHORTS - 1) * 7 * DAY_MS));
  const cohortFrom = new Date(Math.max(firstWeek.getTime(), range.from.getTime()));
  const activityTo = new Date(lastWeek.getTime() + (RETENTION_WEEKS + 1) * 7 * DAY_MS);
  const [sizes, active] = await Promise.all([
    prisma.$queryRaw<{ cohort: Date; size: bigint }[]>`
      SELECT date_trunc('week', "createdAt") AS cohort, count(*)::bigint AS size
      FROM "User"
      WHERE "createdAt" >= ${cohortFrom} AND "createdAt" < ${range.to} AND "role" NOT IN (${Prisma.join(STAFF_ROLES)})
      GROUP BY 1 ORDER BY 1`,
    prisma.$queryRaw<{ cohort: Date; week: number; users: bigint }[]>`
      WITH c AS (
        SELECT "id", date_trunc('week', "createdAt") AS cw FROM "User"
        WHERE "createdAt" >= ${cohortFrom} AND "createdAt" < ${range.to} AND "role" NOT IN (${Prisma.join(STAFF_ROLES)})
      ),
      act AS (
        SELECT e."userId", date_trunc('week', e."createdAt") AS aw FROM "AnalyticsEvent" e
        WHERE e."createdAt" >= ${cohortFrom} AND e."createdAt" < ${activityTo} AND e."userId" IN (SELECT "id" FROM c)
        UNION
        SELECT a."userId", date_trunc('week', a."createdAt") AS aw FROM "AiCall" a
        WHERE a."createdAt" >= ${cohortFrom} AND a."createdAt" < ${activityTo} AND a."userId" IN (SELECT "id" FROM c)
      )
      SELECT c.cw AS cohort, ((act.aw::date - c.cw::date) / 7)::int AS week, count(DISTINCT c."id")::bigint AS users
      FROM c JOIN act ON act."userId" = c."id"
      WHERE act.aw >= c.cw AND act.aw < c.cw + make_interval(weeks => ${RETENTION_WEEKS + 1}::int)
      GROUP BY 1, 2`,
  ]);
  return retentionMatrix(
    sizes.map((s) => ({ cohort: dayKey(s.cohort), size: Number(s.size) })),
    active.map((a) => ({ cohort: dayKey(a.cohort), week: Number(a.week), users: Number(a.users) })),
    now,
    RETENTION_WEEKS,
  ).reverse();
}

async function loadFeatures(range: BizRange) {
  const [tools, exportRows, freeRows, atsChecks] = await Promise.all([
    prisma.$queryRaw<{ tool: string; calls: bigint; users: bigint; errors: bigint; cost: bigint | null }[]>`
      SELECT "tool", count(*)::bigint AS calls, count(DISTINCT "userId")::bigint AS users,
             count(*) FILTER (WHERE NOT "ok")::bigint AS errors, sum("costMicros")::bigint AS cost
      FROM "AiCall"
      WHERE "createdAt" >= ${range.from} AND "createdAt" < ${range.to}
      GROUP BY "tool"`,
    prisma.$queryRaw<{ name: string; n: bigint; users: bigint }[]>`
      SELECT "name", count(*)::bigint AS n, count(DISTINCT "userId")::bigint AS users
      FROM "AnalyticsEvent"
      WHERE "name" IN (${Prisma.join(EXPORT_EVENTS.map((e) => e.name))}) AND "createdAt" >= ${range.from} AND "createdAt" < ${range.to}
      GROUP BY "name"`,
    prisma.$queryRaw<{ tool: string | null; n: bigint }[]>`
      SELECT "meta"->>'tool' AS tool, count(*)::bigint AS n
      FROM "AnalyticsEvent"
      WHERE "name" = 'free_tool_used' AND "createdAt" >= ${range.from} AND "createdAt" < ${range.to}
      GROUP BY 1`,
    prisma.analyticsEvent.count({ where: { name: "free_ats_check", createdAt: { gte: range.from, lt: range.to } } }),
  ]);
  const features: FeatureRow[] = tools
    .map((t) => {
      const calls = Number(t.calls);
      const users = Number(t.users);
      const costUsd = Number(t.cost ?? 0) / 1_000_000;
      return {
        tool: t.tool,
        label: AI_TOOL_LABELS[t.tool as AiTool] ?? t.tool,
        users,
        calls,
        callsPerUser: users > 0 ? round2(calls / users) : null,
        errorRatePct: calls > 0 ? Math.round((Number(t.errors) / calls) * 1000) / 10 : null,
        avgCostUsd: calls > 0 ? costUsd / calls : null,
        costUsd,
      };
    })
    .sort((a, b) => b.calls - a.calls);
  const exportMap = new Map(exportRows.map((r) => [r.name, r]));
  const exports: UsageRow[] = EXPORT_EVENTS.map((e) => ({
    key: e.name,
    label: e.label,
    users: Number(exportMap.get(e.name)?.users ?? 0),
    count: Number(exportMap.get(e.name)?.n ?? 0),
  }));
  const freeTools: UsageRow[] = [
    { key: "free_ats_check", label: "Free ATS check", users: null, count: atsChecks },
    ...freeRows.map((r) => ({ key: r.tool ?? "unknown", label: FREE_TOOL_LABELS[r.tool ?? ""] ?? r.tool ?? "Unknown tool", users: null, count: Number(r.n) })),
  ].sort((a, b) => b.count - a.count);
  return { features, exports, freeTools };
}

export async function loadProduct(range: BizRange, now: number): Promise<ProductData> {
  const [funnel, cohorts, feat, costRows, anon, ctx] = await Promise.all([
    loadFunnel(range),
    loadCohorts(range, now),
    loadFeatures(range),
    prisma.aiCall.groupBy({
      by: ["userId"],
      where: { createdAt: { gte: range.from, lt: range.to }, userId: { not: null } },
      _sum: { costMicros: true },
      _count: { _all: true },
    }),
    prisma.aiCall.aggregate({
      where: { createdAt: { gte: range.from, lt: range.to }, userId: null },
      _sum: { costMicros: true },
      _count: { _all: true },
    }),
    loadPurchaseContext(range.from, range.to),
  ]);

  // Plan of each AI user: their billing row (current or most recent, expired passes included); none = Free.
  const userIds = costRows.map((r) => r.userId!) as string[];
  const subs = userIds.length
    ? await prisma.subscription.findMany({
        where: { userId: { in: userIds } },
        select: { userId: true, status: true, stripePriceId: true, stripeSubscriptionId: true, currentPeriodEnd: true, cancelAtPeriodEnd: true, updatedAt: true },
      })
    : [];
  const resolver = await planResolver(subs.map((s) => s.stripePriceId));
  const subPlan = new Map(subs.map((s) => [s.userId, planOfRow(s, resolver)]));
  const planOfUser = (id: string): PlanId => subPlan.get(id) ?? "none";

  const revenueByPlan = new Map<PlanId, number>();
  for (const p of ctx.purchases) {
    if (!inRange(p.at, range.from, range.to)) continue;
    revenueByPlan.set(p.plan, round2((revenueByPlan.get(p.plan) ?? 0) + p.paidUsd));
  }
  const costByUser = costRows.map((r) => ({ userId: r.userId!, costMicros: r._sum.costMicros ?? 0, calls: r._count._all }));
  const economics = unitEconomics(costByUser, planOfUser, revenueByPlan);
  const freeSignedInCostUsd = costByUser.filter((r) => planOfUser(r.userId) === "none").reduce((a, r) => a + r.costMicros, 0) / 1_000_000;
  const anonymousCostUsd = (anon._sum.costMicros ?? 0) / 1_000_000;
  const totalCostUsd = costByUser.reduce((a, r) => a + r.costMicros, 0) / 1_000_000 + anonymousCostUsd;

  // Top 20 by AI cost in the range, with lifetime (to range end) cost and payments.
  const top = [...costByUser].sort((a, b) => b.costMicros - a.costMicros).slice(0, 20);
  const topIds = top.map((t) => t.userId);
  const [topUsers, toDateCost, toDatePaid] = topIds.length
    ? await Promise.all([
        prisma.user.findMany({ where: { id: { in: topIds } }, select: { id: true, email: true } }),
        prisma.aiCall.groupBy({ by: ["userId"], where: { userId: { in: topIds }, createdAt: { lt: range.to } }, _sum: { costMicros: true } }),
        loadPaidToDate(topIds, range.to),
      ])
    : [[], [], new Map<string, number>()];
  const emailOf = new Map(topUsers.map((u) => [u.id, u.email]));
  const costToDate = new Map(toDateCost.map((r) => [r.userId!, (r._sum.costMicros ?? 0) / 1_000_000]));
  const topRows: TopUserRow[] = top.map((t) => {
    const costToDateUsd = costToDate.get(t.userId) ?? t.costMicros / 1_000_000;
    const paidToDateUsd = toDatePaid.get(t.userId) ?? 0;
    return {
      userId: t.userId,
      email: emailOf.get(t.userId) ?? "deleted user",
      plan: planOfUser(t.userId),
      calls: t.calls,
      costUsd: t.costMicros / 1_000_000,
      costToDateUsd,
      paidToDateUsd,
      marginPct: grossMarginPct(paidToDateUsd, costToDateUsd),
    };
  });

  return {
    funnel: funnelStats(funnel.users),
    funnelCapped: funnel.capped,
    cohorts,
    ...feat,
    economics,
    anonymousCostUsd,
    anonymousCalls: anon._count._all,
    freeSignedInCostUsd,
    totalCostUsd,
    topUsers: topRows,
  };
}

/** What each user paid up to `to` (all their pay_success events, same valuation as Revenue). */
async function loadPaidToDate(userIds: string[], to: Date): Promise<Map<string, number>> {
  const ctx = await loadPurchaseContext(new Date(0), to, userIds);
  const out = new Map<string, number>();
  for (const p of ctx.purchases) {
    if (!p.userId) continue;
    out.set(p.userId, round2((out.get(p.userId) ?? 0) + p.paidUsd));
  }
  return out;
}
