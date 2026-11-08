import { prisma } from "@/lib/prisma";
import { trackEvent } from "@/lib/analytics";
import { trackPurchaseCompleted } from "@/lib/analytics-server";
import { isOneTimePlan, planIdFromPolarProductId } from "@/lib/polar";
import { attributionFromRecord } from "@/lib/utm";
import {
  resolvePolarUserId,
  upsertOrderFromPolar,
  upsertSubscriptionFromPolar,
  type PolarOrder,
  type PolarSubscription,
} from "@/lib/polar-sync";

/**
 * Apply a Polar billing event to our database. Shared by the webhook and by the
 * return-from-checkout sync, so a purchase is activated by whichever arrives first
 * and is counted exactly once.
 */

function metadataOf(data: Record<string, unknown>): Record<string, unknown> | null {
  const m = data.metadata;
  return m && typeof m === "object" ? (m as Record<string, unknown>) : null;
}

function gaClientIdOf(meta: Record<string, unknown> | null): string | null {
  const v = meta?.ga_client_id;
  return typeof v === "string" && v ? v : null;
}

/** Polar amounts are in minor units (cents); GA4 `value` wants major units. */
function toMajorUnits(minor: number | null | undefined): number | null {
  return typeof minor === "number" && Number.isFinite(minor) ? minor / 100 : null;
}

/**
 * What the buyer actually paid, for the admin's revenue: net of discounts and before
 * tax (tax isn't ours). The list price and discount are kept so a 90%-off test sale
 * shows as $0.90 of a $9 plan, not as $9.
 */
function orderAmounts(order: PolarOrder): Record<string, number | string> {
  const out: Record<string, number | string> = {};
  const paid = order.net_amount ?? order.total_amount ?? order.amount;
  if (typeof paid === "number") out.paidCents = paid;
  if (typeof order.subtotal_amount === "number") out.listCents = order.subtotal_amount;
  if (typeof order.discount_amount === "number" && order.discount_amount > 0) out.discountCents = order.discount_amount;
  if (order.discount?.code) out.discountCode = order.discount.code;
  if (order.currency) out.currency = order.currency;
  return out;
}

/**
 * A subscription's later monthly payment. The first payment is counted when the
 * subscription turns active, so only renewal cycles are recorded here — as their own
 * pay_success event (renewal: true) so revenue includes every month a subscriber pays.
 */
async function recordRenewal(order: PolarOrder, plan: string): Promise<"applied" | "duplicate" | "ignored"> {
  if (order.billing_reason !== "subscription_cycle" || !order.subscription_id) return "ignored";
  const userId = await resolvePolarUserId(metadataOf(order as unknown as Record<string, unknown>), order.subscription_id);
  if (!userId) return "ignored";
  const seen = await prisma.analyticsEvent.findFirst({
    where: { name: "pay_success", meta: { path: ["orderId"], equals: order.id } },
    select: { id: true },
  });
  if (seen) return "duplicate";
  await trackEvent("pay_success", {
    userId,
    meta: { provider: "polar", orderId: order.id, subscriptionId: order.subscription_id, plan, renewal: true, ...orderAmounts(order) },
  });
  return "applied";
}

/**
 * A refund on a Polar order. Recorded once per order as `order_refunded` (the Revenue
 * page counts these). A fully refunded pass or Lifetime order also stops granting access.
 */
export async function applyPolarRefund(data: Record<string, unknown>): Promise<"recorded" | "duplicate" | "ignored"> {
  const order = data as unknown as PolarOrder;
  const refunded = order.refunded_amount ?? 0;
  if (!order.id || refunded <= 0) return "ignored";
  const userId = await resolvePolarUserId(metadataOf(data), order.subscription_id ?? null);
  const seen = await prisma.analyticsEvent.findFirst({
    where: { name: "order_refunded", meta: { path: ["orderId"], equals: order.id } },
    select: { id: true, meta: true },
  });
  const prevCents = (seen?.meta as { refundedCents?: number } | null)?.refundedCents ?? 0;
  if (seen && prevCents >= refunded) return "duplicate";
  const plan = await planIdFromPolarProductId(order.product_id ?? null);
  const meta = { provider: "polar", orderId: order.id, plan, refundedCents: refunded, paidCents: order.total_amount ?? order.amount ?? null, currency: order.currency ?? null };
  if (seen) await prisma.analyticsEvent.update({ where: { id: seen.id }, data: { meta } });
  else await trackEvent("order_refunded", { userId: userId ?? undefined, meta });
  const full = typeof order.total_amount === "number" && refunded >= order.total_amount;
  if (full) {
    await prisma.subscription.updateMany({ where: { stripeSubscriptionId: `order:${order.id}` }, data: { status: "refunded" } });
  }
  return "recorded";
}

export type SubscriptionEvent =
  | "subscription.created"
  | "subscription.updated"
  | "subscription.active"
  | "subscription.canceled"
  | "subscription.uncanceled"
  | "subscription.revoked";

/** Record a subscription state. Returns the user it was applied to, or null. */
export async function applyPolarSubscription(data: Record<string, unknown>, eventType: SubscriptionEvent): Promise<string | null> {
  const sub = data as unknown as PolarSubscription;
  const userId = await resolvePolarUserId(metadataOf(data), sub.id ?? null);
  if (!userId) return null;
  // Capture prior state BEFORE the upsert so we can detect the transition
  // into `active` and stay idempotent across Polar's webhook re-deliveries.
  // A one-time order row (a pass, often expired, or Lifetime) is a different
  // purchase, so its "active" status must not hide this subscription's first activation.
  const prior = await prisma.subscription.findUnique({ where: { userId }, select: { status: true, stripeSubscriptionId: true } });
  const priorStatus = prior && !prior.stripeSubscriptionId.startsWith("order:") ? prior.status : undefined;
  await upsertSubscriptionFromPolar(sub, userId);
  // Count the purchase exactly once — on the FIRST transition into `active`.
  if (eventType === "subscription.active" && priorStatus !== "active") {
    await trackEvent("pay_success", {
      userId,
      meta: { provider: "polar", subscriptionId: sub.id, ...(typeof sub.amount === "number" ? { paidCents: sub.amount } : {}) },
    });
    await trackPurchaseCompleted({
      userId,
      plan: await planIdFromPolarProductId(sub.product_id ?? null),
      provider: "polar",
      subscriptionId: sub.id ?? null,
      gaClientId: gaClientIdOf(metadataOf(data)),
      value: toMajorUnits(sub.amount),
      currency: sub.currency ?? null,
      attribution: attributionFromRecord(metadataOf(data)),
    });
  }
  return userId;
}

/**
 * Record a paid one-time order (Week Pass, 90-Day Pass, legacy Lifetime). Recurring
 * renewals also arrive as orders; those are left to the subscription events.
 */
export async function applyPolarPaidOrder(data: Record<string, unknown>): Promise<"applied" | "not_applied" | "duplicate" | "ignored"> {
  const order = data as unknown as PolarOrder;
  const plan = await planIdFromPolarProductId(order.product_id ?? null);
  if (!plan) return "ignored";
  if (!isOneTimePlan(plan)) return recordRenewal(order, plan);
  const userId = await resolvePolarUserId(metadataOf(data), null);
  if (!userId) return "ignored";
  // Idempotency: an order must be applied once only — even after a later pass replaced
  // its row, which is why the recorded purchase event is checked as well as the row.
  const alreadyRecorded =
    !!(await prisma.subscription.findFirst({ where: { stripeSubscriptionId: `order:${order.id}` }, select: { id: true } })) ||
    !!(await prisma.analyticsEvent.findFirst({
      where: { name: "pay_success", userId, meta: { path: ["orderId"], equals: order.id } },
      select: { id: true },
    }));
  if (alreadyRecorded) return "duplicate";
  const applied = await upsertOrderFromPolar(order, userId, plan);
  if (!applied) console.warn(`[polar] order ${order.id} (${plan}) not applied: user ${userId} already has better access`);
  // Count the one-time purchase exactly once: it was paid even if it didn't change access.
  await trackEvent("pay_success", {
    userId,
    meta: { provider: "polar", orderId: order.id, plan, ...orderAmounts(order), ...(applied ? {} : { applied: false }) },
  });
  await trackPurchaseCompleted({
    userId,
    plan,
    provider: "polar",
    orderId: order.id ?? null,
    gaClientId: gaClientIdOf(metadataOf(data)),
    value: toMajorUnits(order.net_amount ?? order.total_amount ?? order.amount),
    currency: order.currency ?? null,
    attribution: attributionFromRecord(metadataOf(data)),
  });
  return applied ? "applied" : "not_applied";
}
