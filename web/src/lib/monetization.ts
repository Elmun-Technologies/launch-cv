import type { CheckoutPlan } from "@/lib/plan-config";
import { CHECKOUT_PLAN_ORDER, PLAN_MONTHLY_LIMITS } from "@/lib/plan-config";

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
    /** "/month" | "/year" | "once" — drives every derived period label. */
    periodLabel: string;
    billingExplainer: string;
    valueLine: string;
    /** Short audience phrase for compact tables (e.g. llms.txt). */
    bestFor: string;
    popular?: boolean;
  }
> = {
  starter: {
    title: "Starter",
    priceDisplay: "$9",
    priceAmount: 9,
    periodLabel: "/month",
    billingExplainer: "Billed monthly through Polar. Cancel anytime.",
    valueLine: "For one focused job search window — editor + core AI.",
    bestFor: "Short-term job search window",
  },
  professional: {
    title: "Professional",
    priceDisplay: "$29",
    priceAmount: 29,
    periodLabel: "/month",
    billingExplainer: "Billed monthly through Polar — renews monthly. Cancel anytime.",
    valueLine: "Best balance of limits and price for most job seekers.",
    bestFor: "Most job seekers (best value)",
    popular: true,
  },
  // Elite is retained for legacy webhook/plan mapping only — it is intentionally
  // excluded from CHECKOUT_PLAN_ORDER and never shown in marketing or checkout UI.
  elite: {
    title: "Elite",
    priceDisplay: "$49",
    priceAmount: 49,
    periodLabel: "/month",
    billingExplainer: "Legacy plan — no longer offered to new customers.",
    valueLine: "Heavy applicants, career switchers, and agency-style volume.",
    bestFor: "Heavy applicants & career switchers",
  },
  lifetime: {
    title: "Lifetime",
    priceDisplay: "$79",
    priceAmount: 79,
    periodLabel: "once",
    billingExplainer: "One-time payment — lifetime access, no renewals.",
    valueLine: "Long-term career insurance: generous fair-use AI limits every month.",
    bestFor: "Long-term career use",
  },
};

/** Compact price label for badges and tables, e.g. "$9/mo", "$29/yr", "$79 once". */
export function planPriceLabel(plan: CheckoutPlan): string {
  const { priceDisplay, periodLabel } = PUBLIC_PLANS[plan];
  const period =
    periodLabel === "/month" ? "/mo" : periodLabel === "/year" ? "/yr" : " once";
  return `${priceDisplay}${period}`;
}

/** schema.org billingDuration for recurring plans, or undefined for one-time. */
export function planBillingDuration(plan: CheckoutPlan): "P1M" | "P1Y" | undefined {
  const { periodLabel } = PUBLIC_PLANS[plan];
  if (periodLabel === "/month") return "P1M";
  if (periodLabel === "/year") return "P1Y";
  return undefined;
}

/** Human billing summary for compact tables, e.g. "Recurring, monthly". */
export function planBillingSummary(plan: CheckoutPlan): string {
  const { periodLabel } = PUBLIC_PLANS[plan];
  if (periodLabel === "/month") return "Recurring, monthly";
  if (periodLabel === "/year") return "Recurring, yearly";
  return "Once, forever";
}

/** Oxford-comma plan-name list, e.g. "Starter, Professional, or Lifetime". */
export function planNameList(conjunction: "or" | "and" = "or"): string {
  const names = CHECKOUT_PLAN_ORDER.map((k) => PUBLIC_PLANS[k].title);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")}, ${conjunction} ${names[names.length - 1]}`;
}

/** Name + price summary, e.g. "Starter $9/mo, Professional $29/mo, Lifetime $79 once". */
export function planPricingSummary(): string {
  return CHECKOUT_PLAN_ORDER.map(
    (k) => `${PUBLIC_PLANS[k].title} ${planPriceLabel(k)}`,
  ).join(", ");
}

export function planMarketingBullets(plan: CheckoutPlan): string[] {
  const L = PLAN_MONTHLY_LIMITS[plan];
  const base = [
    `${L.jd} JD analyses / month`,
    `${L.roleFit} role-fit checks / month`,
    `${L.packet} application packets / month`,
  ];
  if (plan === "starter") {
    return [...base, "Resume editor, PDF export, core templates", "Job tracker, contacts & companies"];
  }
  if (plan === "professional") {
    return [...base, "Company matcher & voice input", "All resume templates + email support"];
  }
  if (plan === "elite") {
    return [...base, "Priority feature rollouts", "Company matcher & voice input", "Priority support"];
  }
  return [...base, "All Professional features", "No renewal — pay once", "Fair-use monthly AI caps (see Terms)"];
}

/** Legacy single-price block — maps to Professional for old UI strings. */
export const PUBLIC_PRICING = {
  headline: PUBLIC_PLANS.professional.title,
  priceDisplay: PUBLIC_PLANS.professional.priceDisplay,
  periodLabel: PUBLIC_PLANS.professional.periodLabel,
  billingExplainer: PUBLIC_PLANS.professional.billingExplainer,
  valueLine: PUBLIC_PLANS.professional.valueLine,
  upsellHook: "Choose a plan to unlock AI — LaunchCV is a paid professional product.",
  proUsdPerMonth: PUBLIC_PLANS.professional.priceAmount,
} as const;
