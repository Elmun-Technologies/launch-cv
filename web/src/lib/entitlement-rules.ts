/**
 * Pure access rules for a stored billing row — no server imports, so they can
 * be unit-tested and shared by the app, the webhook and the admin views.
 */

import { PASS_DAYS, isPassPlan, type CheckoutPlan, type PassPlan } from "@/lib/plan-config";

/** Stripe-era + Lemon Squeezy + Polar statuses that grant paid access. */
export const PAID_STATUSES = ["active", "trialing", "on_trial", "past_due"] as const;
const PAID_STATUS_SET = new Set<string>(PAID_STATUSES);

const DAY_MS = 24 * 60 * 60 * 1000;

export type SubscriptionGrantInput = {
  status: string;
  currentPeriodEnd: Date | null;
  /** Provider subscription id; one-time orders are stored as `order:<id>`. */
  stripeSubscriptionId: string;
};

/** One-time purchase (pass or legacy Lifetime) rather than a recurring subscription. */
export function isOneTimeRow(sub: { stripeSubscriptionId: string }): boolean {
  return sub.stripeSubscriptionId.startsWith("order:");
}

/** A one-time row with no end date: legacy Lifetime, which never expires. */
export function isLifetimeRow(sub: { stripeSubscriptionId: string; currentPeriodEnd: Date | null }): boolean {
  return isOneTimeRow(sub) && !sub.currentPeriodEnd;
}

/** Active paid access (any LaunchCV plan tier). */
export function subscriptionRowGrantsPaid(sub: SubscriptionGrantInput | null | undefined, now = Date.now()): boolean {
  if (!sub) return false;
  // Passes (one-time orders with an end date) stop granting the moment they end.
  // Lifetime orders have no end date and never expire.
  if (isOneTimeRow(sub) && sub.currentPeriodEnd && sub.currentPeriodEnd.getTime() <= now) return false;
  // Recurring subscriptions (active/trialing) and the short past_due grace window grant
  // access even if the stored period end has just passed: the renewal webhook can land
  // after the period rolls over, and we never cut off an active subscription for that.
  if (PAID_STATUS_SET.has(sub.status)) return true;
  // Canceled but still within the paid period (cancel-at-period-end) keeps access.
  if (
    (sub.status === "cancelled" || sub.status === "canceled") &&
    sub.currentPeriodEnd &&
    sub.currentPeriodEnd.getTime() > now
  ) {
    return true;
  }
  return false;
}

/** A pass row that still has time left (not Lifetime, not a subscription). */
export function isUnexpiredPassRow(
  sub: { stripeSubscriptionId: string; status: string; currentPeriodEnd: Date | null } | null | undefined,
  now = Date.now(),
): boolean {
  return !!sub && isOneTimeRow(sub) && sub.status === "active" && !!sub.currentPeriodEnd && sub.currentPeriodEnd.getTime() > now;
}

type ExistingRow = {
  stripeSubscriptionId: string;
  status: string;
  currentPeriodEnd: Date | null;
  cancelAtPeriodEnd?: boolean;
};

function fmtDay(d: Date): string {
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });
}

/**
 * Why a checkout for `plan` must not open given the user's current billing row,
 * or null when it may. There is one billing row per user, so:
 * - Lifetime already covers everything.
 * - An unexpired pass can be extended by buying another pass, but a subscription
 *   bought on top of it would be hidden by the pass until the pass ends.
 * - A running (not cancelling) subscription would be billed alongside a pass or a
 *   second subscription.
 * Expired passes, cancelling subscriptions and ended subscriptions never block.
 */
export function checkoutConflict(existing: ExistingRow | null | undefined, plan: CheckoutPlan, now = Date.now()): string | null {
  if (!existing) return null;
  const s = existing.status;
  if (isOneTimeRow(existing)) {
    if (s !== "active") return null;
    if (!existing.currentPeriodEnd) return "You already have Lifetime access.";
    if (existing.currentPeriodEnd.getTime() <= now) return null;
    if (isPassPlan(plan)) return null;
    return `Your pass is active until ${fmtDay(existing.currentPeriodEnd)}. Buy another pass to extend it, or subscribe after it ends.`;
  }
  if (s === "active" || s === "trialing") {
    if (isPassPlan(plan) && existing.cancelAtPeriodEnd) return null;
    return "You already have an active subscription. Change or cancel it in the billing portal.";
  }
  return null;
}

/**
 * When a newly paid pass ends. Buying a pass while an earlier pass is still
 * running extends it from that pass's end; otherwise it runs from `now`.
 */
export function passPeriodEnd(
  plan: PassPlan,
  existing: { stripeSubscriptionId: string; status: string; currentPeriodEnd: Date | null } | null | undefined,
  now = Date.now(),
): Date {
  const start = isUnexpiredPassRow(existing, now) ? existing!.currentPeriodEnd!.getTime() : now;
  return new Date(start + PASS_DAYS[plan] * DAY_MS);
}
