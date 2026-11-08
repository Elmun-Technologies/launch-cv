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
    await trackEvent("pay_success", { userId, meta: { provider: "polar", subscriptionId: sub.id } });
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
  if (!plan || !isOneTimePlan(plan)) return "ignored";
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
  await trackEvent("pay_success", { userId, meta: { provider: "polar", orderId: order.id, plan, ...(applied ? {} : { applied: false }) } });
  await trackPurchaseCompleted({
    userId,
    plan,
    provider: "polar",
    orderId: order.id ?? null,
    gaClientId: gaClientIdOf(metadataOf(data)),
    value: toMajorUnits(order.total_amount ?? order.amount),
    currency: order.currency ?? null,
    attribution: attributionFromRecord(metadataOf(data)),
  });
  return applied ? "applied" : "not_applied";
}
