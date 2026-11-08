/**
 * Billing FAQ copy shown on /pricing (when the CMS has no pricing FAQs) and,
 * in part, on the /checkout/[plan] pages. Pure: limits come from the caller
 * (Admin → Limits & budgets via getSettings().planLimits).
 */

import { PUBLIC_PLANS, freeAllowanceSentence, planPriceLabel } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, type CheckoutPlan } from "@/lib/plan-config";

type Counts = { jd: number; packet: number; roleFit: number };
export type PricingFaq = { q: string; a: string };

const n = (v: number) => v.toLocaleString("en-US");

export function buildPricingFaqs(limits: Record<CheckoutPlan | "free", Counts>): PricingFaq[] {
  const week = PUBLIC_PLANS.week;
  const pro = PUBLIC_PLANS.professional;
  const quarter = PUBLIC_PLANS.quarter;
  const perPlan = CHECKOUT_PLAN_ORDER.map((k) => {
    const L = limits[k];
    return `${PUBLIC_PLANS[k].title}: ${n(L.jd)} job-description analyses, ${n(L.roleFit)} role-fit checks and ${n(L.packet)} application packets`;
  }).join("; ");
  return [
    {
      q: "Is there a free plan?",
      a: `Yes. ${freeAllowanceSentence(limits.free)} The editor, PDF export, templates and job tracker are free too.${
        limits.free.packet <= 0 ? " Cover letters and interview prep come with a paid plan." : ""
      }`,
    },
    {
      q: "What's the difference between the passes and Pro?",
      a: `Every plan includes every AI tool. The ${week.title} (${planPriceLabel("week")}) and the ${quarter.title} (${planPriceLabel("quarter")}) are single payments with no auto-renewal. ${pro.title} (${pro.priceDisplay}/month) renews monthly until you cancel.`,
    },
    {
      q: "What happens when a pass ends?",
      a: "You aren't charged again. The paid AI limits stop, everything you've written stays saved, and your free monthly checks keep working. Buying another pass while one is active adds its days to the end of the current one.",
    },
    {
      q: "How do I cancel?",
      a: `Passes don't renew, so there's nothing to cancel. For ${pro.title}, open the billing portal from Settings → Subscription and cancel in one click. You keep access until the end of the period you paid for, and you aren't charged again.`,
    },
    {
      q: "Do you offer refunds?",
      a: "Monthly plans have a 7-day money-back guarantee — email support within 7 days of paying. Details are in our Terms.",
    },
    {
      q: "How much can I use each plan?",
      a: `Monthly limits per plan — ${perPlan}. Limits reset on the 1st of each month.`,
    },
    {
      q: "Which payment methods do you accept?",
      a: "Checkout runs on Polar, which accepts major credit and debit cards. Prices are in US dollars; sales tax or VAT is added where your country requires it.",
    },
  ];
}

/** Questions a buyer has at the payment step, in the order the checkout page shows them. */
const CHECKOUT_FAQ_TOPICS = [/payment method|pay with|card/i, /cancel/i, /refund|money.back/i, /pass end|when .*pass/i];

/**
 * Up to `max` FAQs for the checkout page, picked from the same list the
 * pricing page shows (CMS FAQs when present, else the built-in ones), so the
 * two pages never disagree.
 */
export function checkoutFaqs(faqs: PricingFaq[], max = 4): PricingFaq[] {
  const picked: PricingFaq[] = [];
  for (const topic of CHECKOUT_FAQ_TOPICS) {
    const f = faqs.find((x) => topic.test(x.q) && !picked.includes(x));
    if (f) picked.push(f);
  }
  return picked.slice(0, max);
}
