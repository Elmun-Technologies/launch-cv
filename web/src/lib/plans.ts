import { prisma } from "@/lib/prisma";
import { subscriptionRowGrantsPaid } from "@/lib/entitlements";
import { planIdFromPolarProductId } from "@/lib/polar";
import type { CheckoutPlan, PlanId } from "@/lib/plan-config";
import { planLimits } from "@/lib/app-settings";

// Re-export pure config so other modules can import from here
export type { CheckoutPlan, PlanId } from "@/lib/plan-config";
export { CHECKOUT_PLAN_ORDER, PLAN_MONTHLY_LIMITS, NONE_LIMITS, FREE_LIMITS } from "@/lib/plan-config";

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
  // Lemon Squeezy is legacy-only: the Week Pass / 90-Day Pass are sold through Polar.
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
    // Passes are Polar-only products.
    default:
      return undefined;
  }
}

/** Ordered by monthly AI allowance; ties keep the plan the user pays for. */
const PLAN_RANK: Record<PlanId, number> = { none: 0, starter: 1, week: 2, professional: 3, quarter: 3, elite: 4, lifetime: 5 };
const GRANTABLE = new Set<string>(Object.keys(PLAN_RANK).filter((p) => p !== "none"));

/** A staff-granted plan (User.grantedPlan) while it applies, else "none". */
export function activeGrantedPlan(
  user: { grantedPlan: string | null; grantedPlanUntil: Date | null } | null | undefined,
  now = Date.now(),
): PlanId {
  if (!user?.grantedPlan || !GRANTABLE.has(user.grantedPlan)) return "none";
  if (user.grantedPlanUntil && user.grantedPlanUntil.getTime() <= now) return "none";
  return user.grantedPlan as PlanId;
}

/** The higher of two plans (a grant never lowers what someone pays for). */
export function higherPlan(a: PlanId, b: PlanId): PlanId {
  return PLAN_RANK[a] >= PLAN_RANK[b] ? a : b;
}

export async function getUserPlanId(userId: string): Promise<PlanId> {
  const [sub, user] = await Promise.all([
    prisma.subscription.findUnique({
      where: { userId },
      select: { status: true, currentPeriodEnd: true, stripePriceId: true, stripeSubscriptionId: true },
    }),
    prisma.user.findUnique({ where: { id: userId }, select: { grantedPlan: true, grantedPlanUntil: true } }),
  ]);
  const granted = activeGrantedPlan(user);
  if (!sub || !subscriptionRowGrantsPaid(sub)) {
    return granted;
  }
  return higherPlan(await planIdFromVariantId(sub.stripePriceId), granted);
}

/** Monthly AI limits for a plan, as set in Admin → Limits & budgets. */
export async function limitsForPlan(plan: PlanId): Promise<{ jd: number; packet: number; roleFit: number }> {
  return planLimits(plan);
}
