/**
 * Pure plan configuration — no server imports.
 * Safe to import from both client and server components.
 */

export type CheckoutPlan = "starter" | "professional" | "elite" | "lifetime";
export type PlanId = "none" | CheckoutPlan;

// Elite is intentionally excluded — it is a legacy plan retained only for
// webhook/plan mapping of existing subscribers, never shown in public UI.
export const CHECKOUT_PLAN_ORDER: readonly CheckoutPlan[] = [
  "starter",
  "professional",
  "lifetime",
];

export const PLAN_MONTHLY_LIMITS: Record<
  CheckoutPlan,
  { jd: number; packet: number; roleFit: number }
> = {
  starter: { jd: 35, packet: 15, roleFit: 35 },
  professional: { jd: 120, packet: 55, roleFit: 120 },
  elite: { jd: 320, packet: 160, roleFit: 320 },
  lifetime: { jd: 2000, packet: 1000, roleFit: 2000 },
};

export const NONE_LIMITS = { jd: 0, packet: 0, roleFit: 0 } as const;

/**
 * List price per plan in USD — the source of truth for the `value` attached to
 * the GA4 `purchase` event (GA4 monetization reporting needs a numeric value +
 * currency). Keep aligned with `PUBLIC_PLANS[*].priceDisplay` in
 * `lib/monetization.ts` and the Polar product amounts.
 */
export const PLAN_PRICE_USD: Record<CheckoutPlan, number> = {
  starter: 9,
  professional: 29,
  elite: 49,
  lifetime: 79,
};

export const PLAN_CURRENCY = "USD" as const;
