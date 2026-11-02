import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { subscriptionRowGrantsPaid } from "@/lib/entitlements";
import { activeGrantedPlan, higherPlan, planIdFromVariantId } from "@/lib/plans";
import type { PlanId } from "@/lib/plan-config";
import { PUBLIC_PLANS } from "@/lib/monetization";

/**
 * Admin-side billing view of a user, from the same rules the app uses for
 * access (lib/entitlements.ts + lib/plans.ts). Server only.
 */

type SubRow = {
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd?: boolean;
  stripePriceId: string;
  stripeSubscriptionId?: string;
};
type GrantRow = { grantedPlan: string | null; grantedPlanUntil: Date | null };

/** Subscription rows that grant paid access right now (mirrors subscriptionRowGrantsPaid). */
export function payingSubscriptionWhere(now = new Date()): Prisma.SubscriptionWhereInput {
  return {
    OR: [
      { status: { in: ["active", "trialing", "on_trial", "past_due"] } },
      { status: { in: ["cancelled", "canceled"] }, currentPeriodEnd: { gt: now } },
    ],
  };
}

/** Resolve billing ids → plans once per page instead of once per row. */
export async function planResolver(priceIds: Array<string | null | undefined>): Promise<(id: string | null | undefined) => PlanId> {
  const ids = [...new Set(priceIds.filter((x): x is string => !!x))];
  const map = new Map<string, PlanId>(await Promise.all(ids.map(async (id) => [id, await planIdFromVariantId(id)] as const)));
  return (id) => (id ? (map.get(id) ?? "professional") : "none");
}

export type AdminBilling = {
  plan: PlanId;
  /** Has a billing-provider subscription or order that grants access. */
  paying: boolean;
  /** Plan comes (only or partly) from a staff grant. */
  granted: boolean;
  /** "active" | "past_due" | "cancelling" | "cancelled" | "granted" | "none" … */
  status: string;
  lifetime: boolean;
};

export function billingOf(sub: SubRow | null | undefined, user: GrantRow, planOf: (id: string | null | undefined) => PlanId, now = Date.now()): AdminBilling {
  const grant = activeGrantedPlan(user, now);
  const paying = !!sub && subscriptionRowGrantsPaid({ status: sub.status, currentPeriodEnd: sub.currentPeriodEnd });
  // One-time orders ("order:<id>") are only stored for one-time products, i.e. Lifetime.
  const paidPlan: PlanId = !paying ? "none" : sub!.stripeSubscriptionId?.startsWith("order:") ? "lifetime" : planOf(sub!.stripePriceId);
  const plan = higherPlan(paidPlan, grant);
  let status = "none";
  if (sub) {
    const s = sub.status.toLowerCase();
    if (s === "past_due") status = "past_due";
    else if (paying && sub.cancelAtPeriodEnd) status = "cancelling";
    else if (paying) status = s === "trialing" || s === "on_trial" ? "trial" : "active";
    else status = s === "canceled" || s === "cancelled" ? "cancelled" : s;
  }
  if (!paying && grant !== "none") status = "granted";
  const lifetime = plan === "lifetime" || !!sub?.stripeSubscriptionId?.startsWith("order:");
  return { plan, paying, granted: grant !== "none" && grant === plan, status, lifetime };
}

export { billingStatusDisplay as statusDisplay } from "@/lib/admin-labels";

/** List price of a plan in USD (what the public pricing page shows). */
export function listPrice(plan: PlanId): number {
  return plan === "none" ? 0 : PUBLIC_PLANS[plan].priceAmount;
}

/**
 * Purchases recorded since a date (pay_success events) valued at list price:
 * the event's own plan, else the buyer's current paid plan. Same method as the
 * Overview's Revenue tile. `since` null = all time.
 */
export async function purchaseRevenue(since: Date | null): Promise<{ revenue: number; purchases: number; payingUsers: number }> {
  const [events, subs] = await Promise.all([
    prisma.analyticsEvent.findMany({
      where: { name: "pay_success", ...(since ? { createdAt: { gte: since } } : {}) },
      select: { userId: true, meta: true },
    }),
    prisma.subscription.findMany({ where: payingSubscriptionWhere(), select: { userId: true, stripePriceId: true } }),
  ]);
  const planOf = await planResolver(subs.map((s) => s.stripePriceId));
  const planOfUser = new Map(subs.map((s) => [s.userId, planOf(s.stripePriceId)]));
  let revenue = 0;
  for (const e of events) {
    const metaPlan = (e.meta as { plan?: string } | null)?.plan;
    const plan = (metaPlan && metaPlan in PUBLIC_PLANS ? metaPlan : e.userId ? planOfUser.get(e.userId) : undefined) as PlanId | undefined;
    if (plan && plan !== "none") revenue += listPrice(plan);
  }
  return { revenue, purchases: events.length, payingUsers: subs.length };
}
