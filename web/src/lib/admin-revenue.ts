import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { billingOf, planOfRow, planResolver } from "@/lib/admin-billing";
import { isOneTimeRow } from "@/lib/entitlement-rules";
import { WINBACK_CODE_RE, WINBACK_SENT_EVENT } from "@/lib/winback";
import type { PlanId } from "@/lib/plan-config";
import {
  DAY_MS,
  activePassesAt,
  arrFromMrr,
  bucketKey,
  bucketKeys,
  churnByMonth,
  firstPurchaseByUser,
  inRange,
  median,
  monthKeys,
  mrrAt,
  normalizePurchase,
  passIntervals,
  passRenewals,
  round2,
  summarizeRevenue,
  timeToPurchaseHistogram,
  type BizRange,
  type ChurnMonth,
  type PassRenewals,
  type Purchase,
  type RecurringSub,
  type RevenueSummary,
} from "@/lib/biz-metrics";

/**
 * Data for Admin → Revenue (and its CSV exports). Server only.
 *
 * Source of truth for money: `pay_success` analytics events (one per paid
 * Polar order, one per new subscription), normalized by lib/biz-metrics.ts.
 * Recurring state (MRR, churn) comes from the Subscription rows.
 */

/** Events that would mark a refund. None is recorded yet: the Polar webhook doesn't handle order.refunded. */
export const REFUND_EVENT_NAMES = ["order_refunded", "refund", "pay_refund", "refund_issued"] as const;

/** One-line definitions shown as tooltips (and in the KPI CSV). */
export const REVENUE_DEFS = {
  gross: "Sum of list prices of everything bought in the range (the order's subtotal when recorded, else the plan's public price).",
  discounts: "Discount codes applied to those purchases: the recorded discount, else list price minus amount paid.",
  net: "What buyers actually paid in the range, after discounts and before tax. Older events without an amount count at list price.",
  purchases: "pay_success events in the range: each paid pass or Lifetime order, the first payment of each subscription, and each later monthly renewal (recorded from Polar renewal orders).",
  newCustomers: "Buyers whose first-ever purchase falls in the range.",
  arppu: "Average revenue per paying user: net revenue ÷ distinct buyers in the range.",
  mrr: "Monthly recurring revenue at the range end (or now): active, non-cancelling, not past-due monthly subscriptions × list price. Passes never count. Past values are rebuilt from each subscription's first payment and end date.",
  arr: "Annual run-rate: MRR × 12.",
  activePasses: "Users with a Week or 90-Day Pass running at the range end (or now), from pass purchases, stacked the way checkout extends them.",
  refunds: "Orders refunded in the range (from Polar's order.refunded webhook). Shown once a refund has been recorded.",
} as const;

/** Plan groups for charts: sold plans, then legacy and unknown. */
export const PLAN_GROUPS = [
  { id: "week", label: "Week Pass", color: "#ff7a33" },
  { id: "professional", label: "Pro", color: "#5440e8" },
  { id: "quarter", label: "90-Day Pass", color: "#14a38b" },
  { id: "legacy", label: "Legacy plans", color: "#c9c0ff" },
  { id: "unknown", label: "Unknown plan", color: "#a8a6bb" },
] as const;
export type PlanGroup = (typeof PLAN_GROUPS)[number]["id"];

export function planGroupOf(plan: PlanId): PlanGroup {
  if (plan === "week" || plan === "professional" || plan === "quarter") return plan;
  if (plan === "none") return "unknown";
  return "legacy";
}

/** Earliest sign-up or purchase: where "All time" starts. */
export async function firstRecordDate(): Promise<Date | null> {
  const [u, e] = await Promise.all([
    prisma.user.findFirst({ orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
    prisma.analyticsEvent.findFirst({ where: { name: "pay_success" }, orderBy: { createdAt: "asc" }, select: { createdAt: true } }),
  ]);
  const ds = [u?.createdAt, e?.createdAt].filter((x): x is Date => !!x);
  return ds.length ? new Date(Math.min(...ds.map((d) => d.getTime()))) : null;
}

type SubRow = {
  userId: string;
  status: string;
  stripePriceId: string;
  stripeSubscriptionId: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd: boolean;
  updatedAt: Date;
  user?: { createdAt: Date };
};

export type PurchaseContext = {
  purchases: Purchase[];
  subs: SubRow[];
  /** Billing product/variant id → plan (lib/admin-billing.ts planResolver). */
  planOf: (id: string | null | undefined) => PlanId;
  planOfRowFor: (s: SubRow) => PlanId;
};

/**
 * Every purchase (up to `to`) of anyone who bought in [since, to) — or of
 * `onlyUsers` when given — plus the billing rows of those buyers and every
 * recurring subscription row.
 */
export async function loadPurchaseContext(since: Date, to: Date, onlyUsers?: string[]): Promise<PurchaseContext> {
  const raw = onlyUsers
    ? onlyUsers.length
      ? await prisma.$queryRaw<{ userId: string | null; createdAt: Date; meta: unknown }[]>`
          SELECT e."userId", e."createdAt", e."meta"
          FROM "AnalyticsEvent" e
          WHERE e."name" = 'pay_success' AND e."createdAt" < ${to} AND e."userId" IN (${Prisma.join(onlyUsers)})
          ORDER BY e."createdAt" ASC`
      : []
    : await prisma.$queryRaw<{ userId: string | null; createdAt: Date; meta: unknown }[]>`
        SELECT e."userId", e."createdAt", e."meta"
        FROM "AnalyticsEvent" e
        WHERE e."name" = 'pay_success' AND e."createdAt" < ${to}
          AND (
            e."userId" IN (
              SELECT DISTINCT p."userId" FROM "AnalyticsEvent" p
              WHERE p."name" = 'pay_success' AND p."createdAt" >= ${since} AND p."createdAt" < ${to} AND p."userId" IS NOT NULL
            )
            OR (e."userId" IS NULL AND e."createdAt" >= ${since})
          )
        ORDER BY e."createdAt" ASC`;
  const buyerIds = [...new Set(raw.map((r) => r.userId).filter((x): x is string => !!x))];
  const subs = await prisma.subscription.findMany({
    where: { OR: [{ userId: { in: buyerIds } }, { NOT: { stripeSubscriptionId: { startsWith: "order:" } } }] },
    select: {
      userId: true,
      status: true,
      stripePriceId: true,
      stripeSubscriptionId: true,
      currentPeriodEnd: true,
      cancelAtPeriodEnd: true,
      updatedAt: true,
      user: { select: { createdAt: true } },
    },
  });
  const planOf = await planResolver(subs.map((s) => s.stripePriceId));
  const planOfRowFor = (s: SubRow) => planOfRow(s, planOf);
  const bySubId = new Map(subs.map((s) => [s.stripeSubscriptionId, planOfRowFor(s)]));
  const byUser = new Map(subs.map((s) => [s.userId, planOfRowFor(s)]));
  const purchases = raw.map((e) =>
    normalizePurchase(e, { planOfSubscription: (id) => bySubId.get(id), planOfUser: (id) => byUser.get(id) }),
  );
  return { purchases, subs, planOf, planOfRowFor };
}

export type RevenueKpis = {
  cur: RevenueSummary & { mrr: number; arr: number; activePasses: number; refunds: number };
  prev: (RevenueSummary & { mrr: number; arr: number; activePasses: number; refunds: number }) | null;
  /** When MRR / passes are measured: the range end, or now if that's later. */
  pointInTime: Date;
};

export type SeriesPoint = { key: string; values: Record<PlanGroup, number> };
export type PlanMixRow = { plan: PlanId; purchases: number; netUsd: number; grossUsd: number; sharePct: number };
export type CodeRow = { code: string; winback: boolean; codes: number; uses: number; netUsd: number; discountUsd: number; grossUsd: number };
export type CustomerRow = {
  userId: string;
  email: string;
  name: string | null;
  plan: PlanId;
  purchases: number;
  paidUsd: number;
  firstAt: Date;
  lastAt: Date;
  status: string;
  newInRange: boolean;
};

export type RevenueData = {
  kpis: RevenueKpis;
  refundsTracked: boolean;
  series: SeriesPoint[];
  planMix: PlanMixRow[];
  codes: CodeRow[];
  codeSummary: { withCode: number; total: number };
  timeToPurchase: { histogram: { label: string; count: number }[]; medianMs: number | null; customers: number };
  renewals: PassRenewals;
  churn: ChurnMonth[];
  customers: CustomerRow[];
  /** Purchases whose amount wasn't recorded (valued at list price). */
  listPricedPurchases: number;
};

function recurringSubs(ctx: PurchaseContext, startedAt: Map<string, Date>): RecurringSub[] {
  return ctx.subs
    .filter((s) => !isOneTimeRow(s))
    .map((s) => ({
      plan: ctx.planOfRowFor(s),
      status: s.status,
      cancelAtPeriodEnd: s.cancelAtPeriodEnd,
      currentPeriodEnd: s.currentPeriodEnd,
      updatedAt: s.updatedAt,
      // No recorded first payment (e.g. bought before events were kept): it can't predate the account.
      startedAt: startedAt.get(s.stripeSubscriptionId) ?? s.user?.createdAt ?? null,
    }));
}

/**
 * First recorded payment of each recurring subscription (by its provider id).
 * Not cut at the range end: a subscription first paid after a past date didn't exist then.
 */
async function subscriptionStarts(subs: SubRow[]): Promise<Map<string, Date>> {
  const users = [...new Set(subs.filter((s) => !isOneTimeRow(s)).map((s) => s.userId))];
  if (!users.length) return new Map();
  const rows = await prisma.$queryRaw<{ sid: string; first: Date }[]>`
    SELECT e."meta"->>'subscriptionId' AS sid, min(e."createdAt") AS first
    FROM "AnalyticsEvent" e
    WHERE e."name" = 'pay_success'
      AND e."userId" IN (${Prisma.join(users)})
      AND e."meta"->>'subscriptionId' IS NOT NULL
    GROUP BY 1`;
  return new Map(rows.map((r) => [r.sid, r.first]));
}

async function countRefunds(from: Date, to: Date): Promise<number> {
  return prisma.analyticsEvent.count({ where: { name: { in: [...REFUND_EVENT_NAMES] }, createdAt: { gte: from, lt: to } } });
}

export async function loadRevenue(range: BizRange, now: number): Promise<RevenueData> {
  const { from, to, prevFrom, prevTo } = range;
  // Look back far enough to know every buyer's first purchase in both periods and
  // any pass still running (passes stack, so a year covers realistic chains).
  const since = new Date(Math.min((prevFrom ?? from).getTime(), to.getTime() - 400 * DAY_MS));
  const ctx = await loadPurchaseContext(since, to);
  const { purchases } = ctx;
  const starts = await subscriptionStarts(ctx.subs);
  const recurring = recurringSubs(ctx, starts);
  const first = firstPurchaseByUser(purchases);
  const intervals = passIntervals(purchases);
  const pointInTime = new Date(Math.min(to.getTime(), now));

  const [refundsCur, refundsPrev] = await Promise.all([
    countRefunds(from, to),
    prevFrom && prevTo ? countRefunds(prevFrom, prevTo) : Promise.resolve(null),
  ]);
  const curSummary = summarizeRevenue(purchases, from, to, first);
  const mrrCur = mrrAt(recurring, pointInTime, now);
  const kpis: RevenueKpis = {
    pointInTime,
    cur: { ...curSummary, mrr: mrrCur, arr: arrFromMrr(mrrCur), activePasses: activePassesAt(intervals, pointInTime), refunds: refundsCur },
    prev:
      prevFrom && prevTo
        ? (() => {
            const s = summarizeRevenue(purchases, prevFrom, prevTo, first);
            const m = mrrAt(recurring, prevTo, now);
            return { ...s, mrr: m, arr: arrFromMrr(m), activePasses: activePassesAt(intervals, prevTo), refunds: refundsPrev ?? 0 };
          })()
        : null,
  };

  const cur = purchases.filter((p) => inRange(p.at, from, to));

  // Revenue per day/week, stacked by plan group.
  const keys = bucketKeys(from, to, range.bucket);
  const zero = (): Record<PlanGroup, number> => ({ week: 0, professional: 0, quarter: 0, legacy: 0, unknown: 0 });
  const seriesMap = new Map(keys.map((k) => [k, zero()]));
  for (const p of cur) {
    const v = seriesMap.get(bucketKey(p.at, range.bucket));
    if (v) v[planGroupOf(p.plan)] = round2(v[planGroupOf(p.plan)] + p.paidUsd);
  }
  const series = keys.map((key) => ({ key, values: seriesMap.get(key)! }));

  // Plan mix.
  const mix = new Map<PlanId, PlanMixRow>();
  for (const p of cur) {
    const r = mix.get(p.plan) ?? { plan: p.plan, purchases: 0, netUsd: 0, grossUsd: 0, sharePct: 0 };
    r.purchases += 1;
    r.netUsd = round2(r.netUsd + p.paidUsd);
    r.grossUsd = round2(r.grossUsd + p.listUsd);
    mix.set(p.plan, r);
  }
  const netTotal = curSummary.netUsd;
  const planMix = [...mix.values()]
    .map((r) => ({ ...r, sharePct: netTotal > 0 ? round2((r.netUsd / netTotal) * 100) : 0 }))
    .sort((a, b) => b.netUsd - a.netUsd || b.purchases - a.purchases);

  // Discount codes; personal win-back codes collapse into one group.
  const usedCodes = [...new Set(cur.map((p) => p.code).filter((c): c is string => !!c))];
  const winbackCodes = new Set<string>(usedCodes.filter((c) => WINBACK_CODE_RE.test(c)));
  if (usedCodes.length) {
    const sent = await prisma.$queryRaw<{ code: string }[]>`
      SELECT DISTINCT upper(e."meta"->>'code') AS code FROM "AnalyticsEvent" e
      WHERE e."name" = ${WINBACK_SENT_EVENT} AND upper(e."meta"->>'code') IN (${Prisma.join(usedCodes)})`;
    for (const s of sent) winbackCodes.add(s.code);
  }
  const codeMap = new Map<string, CodeRow & { set: Set<string> }>();
  for (const p of cur) {
    if (!p.code) continue;
    const wb = winbackCodes.has(p.code);
    const key = wb ? "__winback" : p.code;
    const r = codeMap.get(key) ?? { code: wb ? "Win-back codes" : p.code, winback: wb, codes: 0, uses: 0, netUsd: 0, discountUsd: 0, grossUsd: 0, set: new Set<string>() };
    r.set.add(p.code);
    r.codes = r.set.size;
    r.uses += 1;
    r.netUsd = round2(r.netUsd + p.paidUsd);
    r.discountUsd = round2(r.discountUsd + p.discountUsd);
    r.grossUsd = round2(r.grossUsd + p.listUsd);
    codeMap.set(key, r);
  }
  const codes = [...codeMap.values()]
    .map((r): CodeRow => ({ code: r.code, winback: r.winback, codes: r.codes, uses: r.uses, netUsd: r.netUsd, discountUsd: r.discountUsd, grossUsd: r.grossUsd }))
    .sort((a, b) => Number(b.winback) - Number(a.winback) || b.uses - a.uses);

  // Customers who paid in the range, with totals up to the range end.
  const buyerIds = [...new Set(cur.map((p) => p.userId).filter((x): x is string => !!x))];
  const users = buyerIds.length
    ? await prisma.user.findMany({
        where: { id: { in: buyerIds } },
        select: { id: true, email: true, name: true, createdAt: true, grantedPlan: true, grantedPlanUntil: true },
      })
    : [];
  const userById = new Map(users.map((u) => [u.id, u]));
  const subByUser = new Map(ctx.subs.map((s) => [s.userId, s]));
  const byBuyer = new Map<string, Purchase[]>();
  for (const p of purchases) if (p.userId) byBuyer.set(p.userId, [...(byBuyer.get(p.userId) ?? []), p]);
  const customers: CustomerRow[] = buyerIds
    .map((id) => {
      const mine = byBuyer.get(id)!;
      const last = mine[mine.length - 1];
      const u = userById.get(id);
      const sub = subByUser.get(id);
      const billing = u ? billingOf(sub ?? null, u, ctx.planOf, now) : null;
      return {
        userId: id,
        email: u?.email ?? "deleted user",
        name: u?.name ?? null,
        plan: last.plan,
        purchases: mine.length,
        paidUsd: round2(mine.reduce((a, p) => a + p.paidUsd, 0)),
        firstAt: mine[0].at,
        lastAt: last.at,
        status: billing?.status ?? "none",
        newInRange: inRange(mine[0].at, from, to),
      };
    })
    .sort((a, b) => b.paidUsd - a.paidUsd || b.lastAt.getTime() - a.lastAt.getTime());

  // Time from sign-up to first purchase, for customers whose first purchase is in the range.
  const gaps: number[] = [];
  for (const c of customers) {
    const u = userById.get(c.userId);
    if (c.newInRange && u) gaps.push(c.firstAt.getTime() - u.createdAt.getTime());
  }

  const months = monthKeys(from, to).slice(-24);
  return {
    kpis,
    refundsTracked: refundsCur > 0 || (refundsPrev ?? 0) > 0,
    series,
    planMix,
    codes,
    codeSummary: { withCode: cur.filter((p) => p.code).length, total: cur.length },
    timeToPurchase: { histogram: timeToPurchaseHistogram(gaps), medianMs: median(gaps), customers: gaps.length },
    renewals: passRenewals(purchases, from, to),
    churn: churnByMonth(recurring, months, now),
    customers,
    listPricedPurchases: cur.filter((p) => !p.amountKnown).length,
  };
}
