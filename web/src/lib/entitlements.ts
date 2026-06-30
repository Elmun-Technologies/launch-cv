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
  // When an access-end date is set it governs absolutely. This covers Polar one-time
  // purchases that grant a fixed window (Starter = 1 month, Professional = 1 year) and
  // any subscription tracked with a renewal/expiry date.
  if (sub.currentPeriodEnd) {
    return sub.currentPeriodEnd.getTime() > Date.now();
  }
  // No end date: open-ended access (e.g. Lifetime) — grant on a paid status.
  return PRO_STATUSES.has(sub.status);
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
