import { prisma } from "@/lib/prisma";

/** Lemon Squeezy subscription `attributes` (subset we persist). */
export type LemonSubscriptionAttrs = {
  store_id?: number;
  customer_id: number;
  variant_id: number;
  status: string;
  cancelled?: boolean;
  renews_at: string | null;
  ends_at: string | null;
};

function parseDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

/** Current access end: renewal date while active; `ends_at` when cancelled/expired. */
export function subscriptionPeriodEnd(attrs: LemonSubscriptionAttrs): Date | null {
  if (attrs.status === "cancelled" || attrs.status === "expired") {
    return parseDate(attrs.ends_at);
  }
  return parseDate(attrs.renews_at) ?? parseDate(attrs.ends_at);
}

/**
 * Reuses `Subscription` fields: `stripeCustomerId` = Lemon customer id,
 * `stripeSubscriptionId` = Lemon subscription id, `stripePriceId` = variant id.
 */
export async function upsertSubscriptionFromLemon(
  subscriptionId: string,
  attrs: LemonSubscriptionAttrs,
  userId: string,
) {
  const customerId = String(attrs.customer_id);
  const variantId = String(attrs.variant_id);
  const periodEnd = subscriptionPeriodEnd(attrs);
  const cancelAtPeriodEnd = attrs.cancelled === true || attrs.status === "cancelled";

  await prisma.subscription.upsert({
    where: { userId },
    create: {
      userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: variantId,
      status: attrs.status,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: cancelAtPeriodEnd,
    },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      stripePriceId: variantId,
      status: attrs.status,
      currentPeriodEnd: periodEnd,
      cancelAtPeriodEnd: cancelAtPeriodEnd,
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { stripeCustomerId: customerId },
  });
}

export async function findUserIdByLemonSubscriptionId(subscriptionId: string): Promise<string | null> {
  const row = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    select: { userId: true },
  });
  return row?.userId ?? null;
}
