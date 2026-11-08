import { PASS_DAYS, isPassPlan, type CheckoutPlan } from "@/lib/plan-config";

/**
 * Shared bits of the phone pricing layout (used by /pricing and the home page):
 * the popular plan comes first as the one full card, the others follow as
 * compact rows with their limits on one line.
 */

/** Plan order on phones: the popular plan first (desktop keeps price order). */
export const MOBILE_PLAN_ORDER: Record<CheckoutPlan, string> = {
  professional: "order-1",
  week: "order-2",
  quarter: "order-3",
  // Legacy plans are never listed; kept so the record covers every plan id.
  starter: "order-3",
  elite: "order-3",
  lifetime: "order-3",
};

const n = (v: number) => v.toLocaleString("en-US");

/** "40 job matches · 40 role-fit checks · 20 packets a month. 7 days, no auto-renewal." */
export function planLimitsLine(plan: CheckoutPlan, l: { jd: number; roleFit: number; packet: number }): string {
  const tail = isPassPlan(plan) ? ` ${PASS_DAYS[plan]} days, no auto-renewal.` : plan === "lifetime" ? " Never renews." : "";
  return `${n(l.jd)} job matches · ${n(l.roleFit)} role-fit checks · ${n(l.packet)} packets a month.${tail}`;
}
