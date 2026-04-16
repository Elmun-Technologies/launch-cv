import { FREE_MONTHLY, PRO_MONTHLY } from "@/lib/usage-limits";

/** Public marketing — Pro is one annual payment (Lemon Squeezy variant should match). */
export const PUBLIC_PRICING = {
  proUsdPerYear: 1.99,
  headline: "Pro Annual",
  priceDisplay: "$1.99",
  periodLabel: "per year",
  /** Shown next to price on cards */
  billingExplainer: "Billed annually — one payment covers 12 months.",
  /** Social proof / value line */
  valueLine: "Less than a coffee — for a full year of AI resume tools.",
  /** Upsell one-liner */
  upsellHook: "Unlock higher AI limits, company matcher, and premium templates.",
} as const;

export function freePlanMarketingBullets(): string[] {
  return [
    `${FREE_MONTHLY.jd} JD analyses / month`,
    `${FREE_MONTHLY.roleFit} role-fit checks / month`,
    `${FREE_MONTHLY.packet} application packets / month`,
    "PDF export & core templates",
    "Job tracker, contacts & companies",
  ];
}

export function proPlanMarketingBullets(): string[] {
  return [
    `${PRO_MONTHLY.jd} JD analyses / month`,
    `${PRO_MONTHLY.roleFit} role-fit checks / month`,
    `${PRO_MONTHLY.packet} application packets / month`,
    "Company matcher & voice input",
    "All resume templates + priority support",
  ];
}
