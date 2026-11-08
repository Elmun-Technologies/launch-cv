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
  week: "productWeek",
  professional: "productProfessional",
  quarter: "productQuarter",
  // Legacy products: never sold, still mapped so existing customers keep access.
  starter: "productStarter",
  elite: "productElite",
  lifetime: "productLifetime",
};

/** Polar product id configured for a checkout plan. */
/**
 * Production product ids for the plans on sale (organization "elmun-technologies").
 * Used only when Admin → Integrations → Polar and the env leave the field empty
 * and the server is production; a value set in the panel always wins.
 */
const PRODUCTION_PRODUCT_IDS: Partial<Record<CheckoutPlan, string>> = {
  week: "d3080455-4ba7-4a57-b3d9-093e749d73df",
  professional: "2e23dae2-5d0a-40c2-9b1f-37b8ac0e1629",
  quarter: "040fec38-32f8-4921-bc9c-0c5f93f73115",
};

export async function productIdForCheckoutPlan(plan: CheckoutPlan): Promise<string | undefined> {
  const field = PRODUCT_FIELD[plan];
  if (!field) return undefined;
  const set = await getIntegrationValue("polar", field);
  if (set) return set;
  const server = (await getIntegrationValue("polar", "server")).toLowerCase() || "production";
  return server === "production" ? PRODUCTION_PRODUCT_IDS[plan] : undefined;
}

/** Reverse map: Polar product id → internal plan tier. Returns null if unknown. */
export async function planIdFromPolarProductId(productId: string | null | undefined): Promise<CheckoutPlan | null> {
  if (!productId) return null;
  const id = productId.trim();
  for (const plan of Object.keys(PRODUCT_FIELD) as CheckoutPlan[]) {
    const pid = await productIdForCheckoutPlan(plan);
    if (pid && pid === id) return plan;
  }
  return null;
}

/** One-time vs recurring lives in plan-config (pure) so client code can use it too. */
export { isOneTimePlan } from "@/lib/plan-config";
