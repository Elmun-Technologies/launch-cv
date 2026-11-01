import { prisma } from "@/lib/prisma";
import { subscriptionRowGrantsPaid } from "@/lib/entitlements";
import { planIdFromPolarProductId } from "@/lib/polar";
import type { CheckoutPlan, PlanId } from "@/lib/plan-config";
import { planLimits } from "@/lib/app-settings";

// Re-export pure config so other modules can import from here
export type { CheckoutPlan, PlanId } from "@/lib/plan-config";
export { CHECKOUT_PLAN_ORDER, PLAN_MONTHLY_LIMITS, NONE_LIMITS } from "@/lib/plan-config";

function envVariant(...keys: (string | undefined)[]): string | undefined {
  for (const k of keys) {
    const v = k?.trim();
    if (v) return v;
  }
  return undefined;
}

/** Map a stored billing id (Lemon `variant_id` or Polar `product_id`) to internal plan. */
export async function planIdFromVariantId(variantId: string | null | undefined): Promise<PlanId> {
  if (!variantId) return "none";
  const v = variantId.trim();
  // Polar product ids are distinct from Lemon variant ids, so checking both is safe.
  const polarPlan = await planIdFromPolarProductId(v);
  if (polarPlan) return polarPlan;
  const starter = envVariant(process.env.LEMON_VARIANT_STARTER);
  const professional = envVariant(process.env.LEMON_VARIANT_PROFESSIONAL, process.env.LEMON_SQUEEZY_VARIANT_ID);
  const elite = envVariant(process.env.LEMON_VARIANT_ELITE);
  const lifetime = envVariant(process.env.LEMON_VARIANT_LIFETIME);
  if (starter && v === starter) return "starter";
  if (professional && v === professional) return "professional";
  if (elite && v === elite) return "elite";
  if (lifetime && v === lifetime) return "lifetime";
  /** Legacy: unknown variant but row exists — treat as professional so existing subs keep working. */
  return "professional";
}

export function variantIdForCheckoutPlan(plan: CheckoutPlan): string | undefined {
  switch (plan) {
    case "starter":
      return envVariant(process.env.LEMON_VARIANT_STARTER);
    case "professional":
      return envVariant(process.env.LEMON_VARIANT_PROFESSIONAL, process.env.LEMON_SQUEEZY_VARIANT_ID);
    case "elite":
      return envVariant(process.env.LEMON_VARIANT_ELITE);
    case "lifetime":
      return envVariant(process.env.LEMON_VARIANT_LIFETIME);
    default:
      return undefined;
  }
}

export async function getUserPlanId(userId: string): Promise<PlanId> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true, currentPeriodEnd: true, stripePriceId: true },
  });
  if (!sub) return "none";
  if (!subscriptionRowGrantsPaid({ status: sub.status, currentPeriodEnd: sub.currentPeriodEnd })) {
    return "none";
  }
  return planIdFromVariantId(sub.stripePriceId);
}

/** Monthly AI limits for a plan, as set in Admin → Limits & budgets. */
export async function limitsForPlan(plan: PlanId): Promise<{ jd: number; packet: number; roleFit: number }> {
  return planLimits(plan);
}
