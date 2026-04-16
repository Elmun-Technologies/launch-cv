import type { CheckoutPlan } from "@/lib/plans";
import { PLAN_MONTHLY_LIMITS } from "@/lib/plans";

/** Public marketing copy — align prices with Lemon product/variant amounts. */
export const PUBLIC_PLANS: Record<
  CheckoutPlan,
  {
    title: string;
    priceDisplay: string;
    periodLabel: string;
    billingExplainer: string;
    valueLine: string;
    popular?: boolean;
  }
> = {
  starter: {
    title: "Starter",
    priceDisplay: "$9",
    periodLabel: "/month",
    billingExplainer: "Billed monthly through Lemon Squeezy. Cancel anytime.",
    valueLine: "For one focused job search window — editor + core AI.",
  },
  professional: {
    title: "Professional",
    priceDisplay: "$29",
    periodLabel: "/year",
    billingExplainer: "One annual payment — full access for 12 months.",
    valueLine: "Best balance of limits and price for most job seekers.",
    popular: true,
  },
  elite: {
    title: "Elite",
    priceDisplay: "$79",
    periodLabel: "/year",
    billingExplainer: "Annual plan with the highest monthly AI ceilings.",
    valueLine: "Heavy applicants, career switchers, and agency-style volume.",
  },
  lifetime: {
    title: "Lifetime",
    priceDisplay: "$149",
    periodLabel: "once",
    billingExplainer: "One-time payment — keep access without renewals.",
    valueLine: "Long-term career insurance: generous fair-use AI limits every month.",
  },
};

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
  return [...base, "All Elite features", "No renewal — pay once", "Fair-use monthly AI caps (see Terms)"];
}

/** Legacy single-price block — maps to Professional for old UI strings. */
export const PUBLIC_PRICING = {
  headline: PUBLIC_PLANS.professional.title,
  priceDisplay: PUBLIC_PLANS.professional.priceDisplay,
  periodLabel: PUBLIC_PLANS.professional.periodLabel,
  billingExplainer: PUBLIC_PLANS.professional.billingExplainer,
  valueLine: PUBLIC_PLANS.professional.valueLine,
  upsellHook: "Choose a plan to unlock AI — Launch CV is a paid professional product.",
  proUsdPerYear: 29,
} as const;
