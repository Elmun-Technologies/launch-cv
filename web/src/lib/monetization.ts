import type { CheckoutPlan } from "@/lib/plan-config";
import {
  CHECKOUT_PLAN_ORDER,
  FREE_LIMITS,
  PASS_DAYS,
  PLAN_MONTHLY_LIMITS,
  PLAN_PRICE_USD,
  isPassPlan,
} from "@/lib/plan-config";

/**
 * Single source of truth for all public pricing copy.
 *
 * Every marketing surface (homepage, /pricing, llms.txt, OG images, meta
 * descriptions) and every schema block (Product / Offer / SoftwareApplication
 * JSON-LD) derives its plan names and prices from this object plus the helpers
 * below. Never hard-code a price or plan list elsewhere — read from here so all
 * sources stay identical. Keep amounts aligned with the Polar product/variant
 * amounts configured via POLAR_PRODUCT_* env vars.
 */
export const PUBLIC_PLANS: Record<
  CheckoutPlan,
  {
    title: string;
    /** Currency-prefixed price, e.g. "$9". */
    priceDisplay: string;
    /** Numeric price for schema.org offers, e.g. 9. */
    priceAmount: number;
    /**
     * "/month" | "/year" for recurring plans, "for N days" for passes, "once"
     * for legacy Lifetime — drives every derived period label.
     */
    periodLabel: string;
    billingExplainer: string;
    valueLine: string;
    /** Short audience phrase for compact tables (e.g. llms.txt). */
    bestFor: string;
    /** Short promise shown as a badge on the plan card, e.g. "No auto-renewal". */
    badge?: string;
    popular?: boolean;
  }
> = {
  week: {
    title: "Week Pass",
    priceDisplay: "$9",
    priceAmount: PLAN_PRICE_USD.week,
    periodLabel: `for ${PASS_DAYS.week} days`,
    billingExplainer: `One payment through Polar for ${PASS_DAYS.week} days of full access. No auto-renewal.`,
    valueLine: "For a focused week of applications.",
    bestFor: "A short, focused application sprint",
    badge: "No auto-renewal",
  },
  professional: {
    title: "Pro",
    priceDisplay: "$29",
    priceAmount: PLAN_PRICE_USD.professional,
    periodLabel: "/month",
    billingExplainer: "Billed monthly through Polar. Cancel anytime.",
    valueLine: "For an ongoing search, month to month.",
    bestFor: "An ongoing search with no fixed end date",
    popular: true,
  },
  quarter: {
    title: "90-Day Pass",
    priceDisplay: "$69",
    priceAmount: PLAN_PRICE_USD.quarter,
    periodLabel: `for ${PASS_DAYS.quarter} days`,
    billingExplainer: `One payment through Polar for ${PASS_DAYS.quarter} days of full access. No auto-renewal.`,
    valueLine: "For a full job search, paid once.",
    bestFor: "A full job search without a subscription",
    badge: "No auto-renewal",
  },
  // Legacy plans: retained for webhook/plan mapping of existing customers only.
  // They are excluded from CHECKOUT_PLAN_ORDER and never shown or sold.
  starter: {
    title: "Starter",
    priceDisplay: "$9",
    priceAmount: PLAN_PRICE_USD.starter,
    periodLabel: "/month",
    billingExplainer: "Legacy plan — no longer offered to new customers.",
    valueLine: "For a focused job search.",
    bestFor: "Short-term job search window",
  },
  elite: {
    title: "Elite",
    priceDisplay: "$49",
    priceAmount: PLAN_PRICE_USD.elite,
    periodLabel: "/month",
    billingExplainer: "Legacy plan — no longer offered to new customers.",
    valueLine: "Heavy applicants, career switchers, and agency-style volume.",
    bestFor: "Heavy applicants & career switchers",
  },
  lifetime: {
    title: "Lifetime",
    priceDisplay: "$79",
    priceAmount: PLAN_PRICE_USD.lifetime,
    periodLabel: "once",
    billingExplainer: "Legacy plan — no longer offered to new customers.",
    valueLine: "Paid once, no renewals.",
    bestFor: "Long-term career use",
  },
};

/** Compact price label for badges and tables, e.g. "$29/mo", "$9 for 7 days", "$79 once". */
export function planPriceLabel(plan: CheckoutPlan): string {
  const { priceDisplay, periodLabel } = PUBLIC_PLANS[plan];
  if (periodLabel === "/month") return `${priceDisplay}/mo`;
  if (periodLabel === "/year") return `${priceDisplay}/yr`;
  return `${priceDisplay} ${periodLabel}`;
}

/** schema.org billingDuration for recurring plans, or undefined for passes and one-time plans. */
export function planBillingDuration(plan: CheckoutPlan): "P1M" | "P1Y" | undefined {
  const { periodLabel } = PUBLIC_PLANS[plan];
  if (periodLabel === "/month") return "P1M";
  if (periodLabel === "/year") return "P1Y";
  return undefined;
}

/** Human billing summary for compact tables, e.g. "Recurring, monthly" or "$9 for 7 days". */
export function planBillingSummary(plan: CheckoutPlan): string {
  const { periodLabel } = PUBLIC_PLANS[plan];
  if (periodLabel === "/month") return "Recurring, monthly";
  if (periodLabel === "/year") return "Recurring, yearly";
  if (isPassPlan(plan)) return `${planPriceLabel(plan)}, no auto-renewal`;
  return "Once, forever";
}

/** The cheapest plan sold today (the entry price quoted as "from …"). */
export function entryPlan(): CheckoutPlan {
  return CHECKOUT_PLAN_ORDER.reduce((a, b) => (PUBLIC_PLANS[b].priceAmount < PUBLIC_PLANS[a].priceAmount ? b : a));
}

/** Entry price for "from …" copy, e.g. "$9 for 7 days". */
export function entryPriceLabel(): string {
  return planPriceLabel(entryPlan());
}

/** Oxford-comma plan-name list, e.g. "Week Pass, Pro, or 90-Day Pass". */
export function planNameList(conjunction: "or" | "and" = "or"): string {
  const names = CHECKOUT_PLAN_ORDER.map((k) => PUBLIC_PLANS[k].title);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")}, ${conjunction} ${names[names.length - 1]}`;
}

/** Name + price summary, e.g. "Week Pass $9 for 7 days, Pro $29/mo, 90-Day Pass $69 for 90 days". */
export function planPricingSummary(): string {
  return CHECKOUT_PLAN_ORDER.map(
    (k) => `${PUBLIC_PLANS[k].title} ${planPriceLabel(k)}`,
  ).join(", ");
}

/** The monthly AI allowance of a free account, as one plain sentence. */
export function freeAllowanceSentence(limits: { jd: number; roleFit: number } = FREE_LIMITS): string {
  const jd = `${limits.jd} job-description ${limits.jd === 1 ? "match" : "matches"}`;
  const fit = `${limits.roleFit} role-fit ${limits.roleFit === 1 ? "check" : "checks"}`;
  if (limits.jd <= 0 && limits.roleFit <= 0) return "A free account includes the free ATS check and the resume builder.";
  const parts = [limits.jd > 0 ? jd : null, limits.roleFit > 0 ? fit : null].filter(Boolean).join(" and ");
  return `A free account gets ${parts} each month, plus the free ATS check and the resume builder.`;
}

/** `limits` comes from Admin → Limits & budgets (`getSettings().planLimits`); defaults otherwise. */
export function planMarketingBullets(
  plan: CheckoutPlan,
  limits: Record<CheckoutPlan, { jd: number; packet: number; roleFit: number }> = PLAN_MONTHLY_LIMITS,
): string[] {
  const L = limits[plan];
  const n = (v: number) => v.toLocaleString("en-US");
  const usage = [
    `${n(L.jd)} job-description analyses / month`,
    `${n(L.roleFit)} role-fit checks / month`,
    `${n(L.packet)} application packets / month`,
  ];
  // Every tool ships on every plan; plans differ by how long access lasts and the monthly limits.
  if (plan === "week") {
    return [`${PASS_DAYS.week} days of full access`, ...usage, "Every AI tool and template", "No auto-renewal"];
  }
  if (plan === "quarter") {
    return [`${PASS_DAYS.quarter} days of full access, paid once`, ...usage, "Every AI tool and template", "No auto-renewal"];
  }
  if (plan === "lifetime") return [...usage, "Every AI tool and template", "Paid once, never renews"];
  return [...usage, "Every AI tool and template", "Cancel anytime"];
}

/** Legacy single-price block — maps to Professional for old UI strings. */
export const PUBLIC_PRICING = {
  headline: PUBLIC_PLANS.professional.title,
  priceDisplay: PUBLIC_PLANS.professional.priceDisplay,
  periodLabel: PUBLIC_PLANS.professional.periodLabel,
  billingExplainer: PUBLIC_PLANS.professional.billingExplainer,
  valueLine: PUBLIC_PLANS.professional.valueLine,
  upsellHook: `Get more AI checks with the ${PUBLIC_PLANS.week.title}: ${planPriceLabel("week")}, no auto-renewal.`,
  proUsdPerMonth: PUBLIC_PLANS.professional.priceAmount,
} as const;
