import { prisma } from "@/lib/prisma";
import { isPassPlan, type CheckoutPlan } from "@/lib/plan-config";
import { isLifetimeRow, isOneTimeRow, isUnexpiredPassRow, passPeriodEnd, subscriptionRowGrantsPaid } from "@/lib/entitlement-rules";
import { planIdFromPolarProductId } from "@/lib/polar";

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

/** Polar order object (subset) — used for one-time purchases (Week Pass, 90-Day Pass, legacy Lifetime). */
export type PolarOrder = {
  id: string;
  status?: string | null;
  customer_id?: string | null;
  product_id?: string | null;
  amount?: number | null; // minor units (cents)
  total_amount?: number | null; // minor units (cents), incl. tax
  subtotal_amount?: number | null; // list price before discount (cents)
  discount_amount?: number | null; // cents taken off by a discount code
  net_amount?: number | null; // after discount, before tax (cents) — what we earn
  discount?: { code?: string | null; name?: string | null } | null;
  subscription_id?: string | null;
  billing_reason?: string | null; // purchase | subscription_create | subscription_cycle | subscription_update
  refunded_amount?: number | null; // cents refunded so far
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
  // a paid one-time order (legacy Lifetime, or a pass that hasn't ended) must not be
  // overwritten by a later subscription event, and a cancel/revoke for an old
  // subscription must not wipe a newer active one. An expired pass gives way.
  const existing = await prisma.subscription.findUnique({
    where: { userId },
    select: { stripeSubscriptionId: true, status: true, currentPeriodEnd: true },
  });
  if (existing && existing.stripeSubscriptionId !== sub.id) {
    if (isOneTimeRow(existing) && existing.status === "active" && subscriptionRowGrantsPaid(existing)) return;
    const incomingActive = sub.status === "active" || sub.status === "trialing";
    const existingActive = !isOneTimeRow(existing) && (existing.status === "active" || existing.status === "trialing");
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
 * Record a paid one-time Polar order as the user's billing row.
 *
 * - Week Pass / 90-Day Pass: access until `currentPeriodEnd`. A pass bought while an
 *   earlier pass is still running extends from that pass's end, not from now.
 * - Legacy Lifetime: no end date, never expires.
 *
 * Returns false (and changes nothing) when the order wouldn't improve access: a pass
 * never replaces Lifetime, and a pass never replaces a running recurring subscription
 * (checkout blocks that case; this guards webhooks that arrive anyway).
 */
export async function upsertOrderFromPolar(order: PolarOrder, userId: string, plan: CheckoutPlan, now = Date.now()): Promise<boolean> {
  const customerId = customerIdOf(order);
  const productId = String(order.product_id ?? "");

  const existing = await prisma.subscription.findUnique({
    where: { userId },
    select: { stripeSubscriptionId: true, stripePriceId: true, status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true },
  });
  // Already applied (Polar redelivers order.paid): never extend a pass twice for one order.
  if (existing?.stripeSubscriptionId === `order:${order.id}`) return false;

  let currentPeriodEnd: Date | null = null;
  if (isPassPlan(plan)) {
    if (existing) {
      if (isLifetimeRow(existing) && existing.status === "active") return false;
      const recurringActive =
        !isOneTimeRow(existing) && (existing.status === "active" || existing.status === "trialing") && !existing.cancelAtPeriodEnd;
      if (recurringActive) return false;
    }
    currentPeriodEnd = passPeriodEnd(plan, existing, now);
  }

  // Extending a running 90-Day Pass with a Week Pass keeps the 90-Day limits for the
  // whole extended period instead of dropping to the Week Pass limits.
  let priceId = productId;
  if (plan === "week" && existing && isUnexpiredPassRow(existing, now)) {
    if ((await planIdFromPolarProductId(existing.stripePriceId)) === "quarter") priceId = existing.stripePriceId;
  }

  const data = {
    stripeCustomerId: customerId,
    stripeSubscriptionId: `order:${order.id}`,
    stripePriceId: priceId,
    status: "active",
    currentPeriodEnd,
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
  return true;
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
