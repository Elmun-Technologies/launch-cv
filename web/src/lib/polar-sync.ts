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
  amount?: number | null; // minor units (cents)
  currency?: string | null;
  metadata?: Record<string, unknown> | null;
  customer?: { id?: string | null; email?: string | null } | null;
};

/** Polar order object (subset) — used for one-time purchases (e.g. Lifetime). */
export type PolarOrder = {
  id: string;
  status?: string | null;
  customer_id?: string | null;
  product_id?: string | null;
  amount?: number | null; // minor units (cents)
  total_amount?: number | null; // minor units (cents), incl. tax
  currency?: string | null;
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

  // One row per user, so guard against events that would clobber better access:
  // a Lifetime order must not be overwritten by a later subscription event, and
  // a cancel/revoke for an old subscription must not wipe a newer active one.
  const existing = await prisma.subscription.findUnique({
    where: { userId },
    select: { stripeSubscriptionId: true, status: true },
  });
  if (existing && existing.stripeSubscriptionId !== sub.id) {
    if (existing.stripeSubscriptionId.startsWith("order:") && existing.status === "active") return;
    const incomingActive = sub.status === "active" || sub.status === "trialing";
    const existingActive = existing.status === "active" || existing.status === "trialing";
    if (existingActive && !incomingActive) return;
  }

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
 * Record a one-time Polar order (e.g. Lifetime) as an always-active subscription row
 * with no renewal date.
 */
export async function upsertOrderFromPolar(order: PolarOrder, userId: string) {
  const customerId = customerIdOf(order);
  const productId = String(order.product_id ?? "");

  const data = {
    stripeCustomerId: customerId,
    stripeSubscriptionId: `order:${order.id}`,
    stripePriceId: productId,
    status: "active",
    currentPeriodEnd: null,
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
