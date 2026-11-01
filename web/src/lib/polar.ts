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
import { getIntegrationValue } from "@/lib/integrations";

/** Polar API base URL — production by default, sandbox for testing (Admin → Integrations → Polar). */
export async function polarApiBase(): Promise<string> {
  const server = (await getIntegrationValue("polar", "server")).toLowerCase() || "production";
  return server === "sandbox" ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";
}

const PRODUCT_FIELD: Record<CheckoutPlan, string> = {
  starter: "productStarter",
  professional: "productProfessional",
  elite: "productElite",
  lifetime: "productLifetime",
};

/** Polar product id configured for a checkout plan. */
export async function productIdForCheckoutPlan(plan: CheckoutPlan): Promise<string | undefined> {
  const field = PRODUCT_FIELD[plan];
  if (!field) return undefined;
  return (await getIntegrationValue("polar", field)) || undefined;
}

/** Reverse map: Polar product id → internal plan tier. Returns null if unknown. */
export async function planIdFromPolarProductId(productId: string | null | undefined): Promise<CheckoutPlan | null> {
  if (!productId) return null;
  const id = productId.trim();
  for (const plan of Object.keys(PRODUCT_FIELD) as CheckoutPlan[]) {
    const pid = await getIntegrationValue("polar", PRODUCT_FIELD[plan]);
    if (pid && pid === id) return plan;
  }
  return null;
}

/**
 * Plans paid as a one-time purchase rather than a recurring subscription.
 * Starter and Professional are monthly recurring; Lifetime is one-time. (Elite is a
 * legacy monthly plan retained only for existing subscribers, never offered publicly.)
 */
export function isOneTimePlan(plan: CheckoutPlan): boolean {
  return plan === "lifetime";
}
