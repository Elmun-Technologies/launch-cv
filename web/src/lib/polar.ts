/**
 * Polar.sh configuration and plan ↔ product mapping.
 *
 * Polar (https://polar.sh) is used as the payment provider for regions where
 * Stripe / Lemon Squeezy are unavailable (e.g. Uzbekistan). It is a Merchant of
 * Record, so it handles checkout, tax and the customer billing portal for us.
 *
 * We reuse the existing `Subscription` table (legacy `stripe*` column names):
 *   stripeCustomerId     = Polar customer id
 *   stripeSubscriptionId = Polar subscription id (or `order:<id>` for one-time)
 *   stripePriceId        = Polar product id (used to resolve the plan tier)
 */

import type { CheckoutPlan } from "@/lib/plan-config";

/** Polar API base URL — production by default, sandbox for testing. */
export function polarApiBase(): string {
  const server = (process.env.POLAR_SERVER ?? "production").trim().toLowerCase();
  return server === "sandbox" ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";
}

function envProduct(...keys: (string | undefined)[]): string | undefined {
  for (const k of keys) {
    const v = k?.trim();
    if (v) return v;
  }
  return undefined;
}

/** Polar product id configured for a checkout plan (via env). */
export function productIdForCheckoutPlan(plan: CheckoutPlan): string | undefined {
  switch (plan) {
    case "starter":
      return envProduct(process.env.POLAR_PRODUCT_STARTER);
    case "professional":
      return envProduct(process.env.POLAR_PRODUCT_PROFESSIONAL);
    case "elite":
      return envProduct(process.env.POLAR_PRODUCT_ELITE);
    case "lifetime":
      return envProduct(process.env.POLAR_PRODUCT_LIFETIME);
    default:
      return undefined;
  }
}

/** Reverse map: Polar product id → internal plan tier. Returns null if unknown. */
export function planIdFromPolarProductId(productId: string | null | undefined): CheckoutPlan | null {
  if (!productId) return null;
  const id = productId.trim();
  const starter = envProduct(process.env.POLAR_PRODUCT_STARTER);
  const professional = envProduct(process.env.POLAR_PRODUCT_PROFESSIONAL);
  const elite = envProduct(process.env.POLAR_PRODUCT_ELITE);
  const lifetime = envProduct(process.env.POLAR_PRODUCT_LIFETIME);
  if (starter && id === starter) return "starter";
  if (professional && id === professional) return "professional";
  if (elite && id === elite) return "elite";
  if (lifetime && id === lifetime) return "lifetime";
  return null;
}

/** Plans paid as a one-time purchase rather than a recurring subscription. */
export function isOneTimePlan(plan: CheckoutPlan): boolean {
  return plan === "lifetime";
}

/**
 * All plans are sold as one-time purchases (no auto-renewal). Each grants a fixed
 * access window from the purchase date:
 *   starter  → 1 month
 *   professional / elite → 1 year
 *   lifetime → forever (null = never expires)
 */
export function accessEndForPlan(plan: CheckoutPlan, from: Date): Date | null {
  if (plan === "lifetime") return null;
  const end = new Date(from.getTime());
  if (plan === "starter") {
    end.setMonth(end.getMonth() + 1);
  } else {
    // professional, elite
    end.setFullYear(end.getFullYear() + 1);
  }
  return end;
}
