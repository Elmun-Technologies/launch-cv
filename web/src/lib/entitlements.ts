import { prisma } from "@/lib/prisma";

/** Stripe-era + Lemon Squeezy subscription statuses that grant Pro access. */
const PRO_STATUSES = new Set(["active", "trialing", "on_trial", "past_due"]);

export type SubscriptionGrantInput = {
  status: string;
  currentPeriodEnd: Date | null;
};

/** Active paid access (any Launch CV plan tier). */
export function subscriptionRowGrantsPaid(sub: SubscriptionGrantInput | null): boolean {
  if (!sub) return false;
  // Recurring subscriptions (active/trialing) and the short past_due grace window grant
  // access; Lifetime one-time orders are stored as "active" with no end date.
  if (PRO_STATUSES.has(sub.status)) return true;
  // Canceled but still within the paid period (cancel-at-period-end) keeps access.
  if (
    (sub.status === "cancelled" || sub.status === "canceled") &&
    sub.currentPeriodEnd &&
    sub.currentPeriodEnd.getTime() > Date.now()
  ) {
    return true;
  }
  return false;
}

/** @deprecated Use `subscriptionRowGrantsPaid` — name kept for older call sites. */
export const subscriptionRowGrantsPro = subscriptionRowGrantsPaid;

export async function userHasProSubscription(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
  });
  if (!sub) return false;
  return subscriptionRowGrantsPaid({
    status: sub.status,
    currentPeriodEnd: sub.currentPeriodEnd,
  });
}
