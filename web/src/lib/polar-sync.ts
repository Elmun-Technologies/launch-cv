import { prisma } from "@/lib/prisma";

/** Polar subscription object (subset we persist). */
export type PolarSubscription = {
  id: string;
  status: string; // active | trialing | past_due | canceled | unpaid | incomplete | ...
  customer_id?: string | null;
  product_id?: string | null;
  cancel_at_period_end?: boolean | null;
  current_period_end?: string | null;
  ends_at?: string | null;
  metadata?: Record<string, unknown> | null;
  customer?: { id?: string | null; email?: string | null } | null;
};

/** Polar order object (subset) — used for one-time purchases (e.g. Lifetime). */
export type PolarOrder = {
  id: string;
  status?: string | null;
  customer_id?: string | null;
  product_id?: string | null;
  metadata?: Record<string, unknown> | null;
  customer?: { id?: string | null; email?: string | null } | null;
};

function parseDate(s: string | null | undefined): Date | null {
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d;
}

function customerIdOf(obj: { customer_id?: string | null; customer?: { id?: string | null } | null }): string {
  return String(obj.customer_id ?? obj.customer?.id ?? "");
}

/**
 * Upsert a recurring Polar subscription into the shared `Subscription` table.
 * Reuses legacy column names: stripeCustomerId/stripeSubscriptionId/stripePriceId.
 */
export async function upsertSubscriptionFromPolar(sub: PolarSubscription, userId: string) {
  const customerId = customerIdOf(sub);
  const productId = String(sub.product_id ?? "");
  const periodEnd = parseDate(sub.current_period_end) ?? parseDate(sub.ends_at);
  const cancelAtPeriodEnd = sub.cancel_at_period_end === true;

  const data = {
    stripeCustomerId: customerId,
    stripeSubscriptionId: sub.id,
    stripePriceId: productId,
    status: sub.status,
    currentPeriodEnd: periodEnd,
    cancelAtPeriodEnd,
  };

  await prisma.subscription.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  if (customerId) {
    await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
  }
}

/**
 * Record a one-time Polar order as an active subscription row.
 * `accessEnd` is the access window end (null = never expires, e.g. Lifetime).
 */
export async function upsertOrderFromPolar(order: PolarOrder, userId: string, accessEnd: Date | null) {
  const customerId = customerIdOf(order);
  const productId = String(order.product_id ?? "");

  const data = {
    stripeCustomerId: customerId,
    stripeSubscriptionId: `order:${order.id}`,
    stripePriceId: productId,
    status: "active",
    currentPeriodEnd: accessEnd,
    cancelAtPeriodEnd: false,
  };

  await prisma.subscription.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  if (customerId) {
    await prisma.user.update({ where: { id: userId }, data: { stripeCustomerId: customerId } });
  }
}

/** Resolve our user id from Polar metadata, or fall back to an existing subscription row. */
export async function resolvePolarUserId(
  metadata: Record<string, unknown> | null | undefined,
  subscriptionId: string | null,
): Promise<string | null> {
  const fromMeta = metadata?.user_id;
  if (typeof fromMeta === "string" && fromMeta) return fromMeta;
  if (fromMeta != null && typeof fromMeta === "number") return String(fromMeta);
  if (subscriptionId) {
    const row = await prisma.subscription.findFirst({
      where: { stripeSubscriptionId: subscriptionId },
      select: { userId: true },
    });
    if (row?.userId) return row.userId;
  }
  return null;
}
