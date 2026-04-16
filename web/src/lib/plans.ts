import { prisma } from "@/lib/prisma";
import { subscriptionRowGrantsPaid } from "@/lib/entitlements";

/** Paid checkout keys (Lemon variant mapping). */
export type CheckoutPlan = "starter" | "professional" | "elite" | "lifetime";

export const CHECKOUT_PLAN_ORDER: readonly CheckoutPlan[] = ["starter", "professional", "elite", "lifetime"];

export type PlanId = "none" | CheckoutPlan;

/** Monthly AI caps (fair use). Lifetime uses high caps — adjust in Lemon + here together. */
export const PLAN_MONTHLY_LIMITS: Record<CheckoutPlan, { jd: number; packet: number; roleFit: number }> = {
  starter: { jd: 35, packet: 15, roleFit: 35 },
  professional: { jd: 120, packet: 55, roleFit: 120 },
  elite: { jd: 320, packet: 160, roleFit: 320 },
  lifetime: { jd: 2000, packet: 1000, roleFit: 2000 },
};

export const NONE_LIMITS = { jd: 0, packet: 0, roleFit: 0 } as const;

function envVariant(...keys: (string | undefined)[]): string | undefined {
  for (const k of keys) {
    const v = k?.trim();
    if (v) return v;
  }
  return undefined;
}

/** Map Lemon `variant_id` (string) to internal plan. */
export function planIdFromVariantId(variantId: string | null | undefined): PlanId {
  if (!variantId) return "none";
  const v = variantId.trim();
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

export function limitsForPlan(plan: PlanId): { jd: number; packet: number; roleFit: number } {
  if (plan === "none") return NONE_LIMITS;
  return PLAN_MONTHLY_LIMITS[plan];
}
