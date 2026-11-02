import type { CheckoutPlan } from "@/lib/plan-config";

/**
 * Shared bits of the phone pricing layout (used by /pricing and the home page):
 * the popular plan comes first as the one full card, the others follow as
 * compact rows with their limits on one line.
 */

/** Plan order on phones: the popular plan first (desktop keeps price order). */
export const MOBILE_PLAN_ORDER: Record<CheckoutPlan, string> = {
  professional: "order-1",
  starter: "order-2",
  elite: "order-3",
  lifetime: "order-3",
};

const n = (v: number) => v.toLocaleString("en-US");

/** "35 job matches · 35 role-fit checks · 15 packets a month." */
export function planLimitsLine(plan: CheckoutPlan, l: { jd: number; roleFit: number; packet: number }): string {
  return `${n(l.jd)} job matches · ${n(l.roleFit)} role-fit checks · ${n(l.packet)} packets a month.${plan === "lifetime" ? " Never renews." : ""}`;
}
