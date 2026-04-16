import { prisma } from "@/lib/prisma";

/** Stripe-era + Lemon Squeezy subscription statuses that grant Pro access. */
const PRO_STATUSES = new Set(["active", "trialing", "on_trial", "past_due"]);

export type SubscriptionGrantInput = {
  status: string;
  currentPeriodEnd: Date | null;
};

/** Pure helper for server + client (parsed dates). */
export function subscriptionRowGrantsPro(sub: SubscriptionGrantInput | null): boolean {
  if (!sub) return false;
  if (PRO_STATUSES.has(sub.status)) return true;
  if (
    (sub.status === "cancelled" || sub.status === "canceled") &&
    sub.currentPeriodEnd &&
    sub.currentPeriodEnd.getTime() > Date.now()
  ) {
    return true;
  }
  return false;
}

export async function userHasProSubscription(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
  });
  if (!sub) return false;
  return subscriptionRowGrantsPro({
    status: sub.status,
    currentPeriodEnd: sub.currentPeriodEnd,
  });
}
