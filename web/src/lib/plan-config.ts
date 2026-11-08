/**
 * Pure plan configuration — no server imports.
 * Safe to import from both client and server components.
 */

/**
 * Every plan a billing row can resolve to. Only `CHECKOUT_PLAN_ORDER` is shown
 * and sold; starter, elite and lifetime are legacy plans kept so existing
 * customers keep their access (product mapping, webhooks, admin views).
 */
export type CheckoutPlan = "week" | "professional" | "quarter" | "starter" | "elite" | "lifetime";
export type PlanId = "none" | CheckoutPlan;

/** Plans shown and sold today, in display order. */
export const CHECKOUT_PLAN_ORDER: readonly CheckoutPlan[] = ["week", "professional", "quarter"];

/** Legacy plans: never shown or sold, still honoured for existing customers. */
export const LEGACY_PLANS: readonly CheckoutPlan[] = ["starter", "elite", "lifetime"];

/** True for plans a new customer can buy. */
export function isPublicPlan(plan: string): plan is CheckoutPlan {
  return (CHECKOUT_PLAN_ORDER as readonly string[]).includes(plan);
}

/**
 * Length of each time-limited pass, in days. One-time Polar orders for these
 * plans grant access until `currentPeriodEnd`; buying another pass while one
 * is still running extends it from the current end.
 */
export const PASS_DAYS = { week: 7, quarter: 90 } as const satisfies Partial<Record<CheckoutPlan, number>>;
export type PassPlan = keyof typeof PASS_DAYS;

export function isPassPlan(plan: string | null | undefined): plan is PassPlan {
  return !!plan && plan in PASS_DAYS;
}

/**
 * Plans paid as a one-time purchase rather than a recurring subscription:
 * the Week Pass and 90-Day Pass, plus legacy Lifetime (never expires).
 */
export function isOneTimePlan(plan: CheckoutPlan): boolean {
  return plan === "lifetime" || isPassPlan(plan);
}

export const PLAN_MONTHLY_LIMITS: Record<
  CheckoutPlan,
  { jd: number; packet: number; roleFit: number }
> = {
  week: { jd: 40, packet: 20, roleFit: 40 },
  professional: { jd: 150, packet: 60, roleFit: 150 },
  quarter: { jd: 150, packet: 60, roleFit: 150 },
  // Legacy plans keep the limits their customers bought.
  starter: { jd: 35, packet: 15, roleFit: 35 },
  elite: { jd: 320, packet: 160, roleFit: 320 },
  lifetime: { jd: 2000, packet: 1000, roleFit: 2000 },
};

/** Monthly AI allowance for a signed-in user without a paid plan. */
export const FREE_LIMITS: { readonly jd: number; readonly packet: number; readonly roleFit: number } = { jd: 2, packet: 0, roleFit: 1 };

/** No access at all (e.g. for a plan id that resolves to nothing). */
export const NONE_LIMITS = { jd: 0, packet: 0, roleFit: 0 } as const;

/**
 * List price per plan in USD — the source of truth for the `value` attached to
 * the GA4 `purchase` event (GA4 monetization reporting needs a numeric value +
 * currency). Keep aligned with `PUBLIC_PLANS[*].priceDisplay` in
 * `lib/monetization.ts` and the Polar product amounts.
 */
export const PLAN_PRICE_USD: Record<CheckoutPlan, number> = {
  week: 9,
  professional: 29,
  quarter: 69,
  starter: 9,
  elite: 49,
  lifetime: 79,
};

export const PLAN_CURRENCY = "USD" as const;
