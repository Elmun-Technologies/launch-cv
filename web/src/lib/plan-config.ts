/**
 * Pure plan configuration — no server imports.
 * Safe to import from both client and server components.
 */

export type CheckoutPlan = "starter" | "professional" | "elite" | "lifetime";
export type PlanId = "none" | CheckoutPlan;

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
