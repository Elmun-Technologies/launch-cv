/**
 * Central registry for conversion / funnel events.
 *
 * This file is the ONE place event names live. It is isomorphic — no browser
 * or server-only imports — so it can be shared by:
 *   - `analytics-client.ts` (browser dispatch → GA4 gtag + PostHog)
 *   - `analytics-server.ts` (server dispatch → GA4 Measurement Protocol + PostHog capture)
 *   - the Polar webhook (server) for `purchase`
 *
 * The events below are the conversion funnel we measure end to end:
 *   register page → account created → plan chosen → checkout opened → payment,
 * plus CTA clicks that feed the top of the funnel.
 *
 * Naming: we use GA4's recommended event names where they exist (`purchase`,
 * `sign_up_*`) so GA4's built-in monetization / conversion reporting lights up.
 * Keep the string values stable — they are what GA4 and PostHog store, and
 * what you mark as Key events / build funnels on. Renaming a value resets its
 * history in both tools.
 */

import type { CheckoutPlan } from "@/lib/plan-config";

export const ANALYTICS_EVENTS = {
  /** Register page opened (top of the sign-up funnel). */
  signUpStart: "sign_up_start",
  /** Account successfully created. GA4 key event. */
  signUpComplete: "sign_up_complete",
  /** A specific plan was chosen (pricing card or subscription settings). */
  planSelected: "plan_selected",
  /** Checkout session opened (user redirected to pay). */
  checkoutStart: "checkout_start",
  /** Payment confirmed — emitted server-side from the payment webhook. GA4 key event. */
  purchase: "purchase",
  /** A key CTA ("Get started" / "Choose plan" / …) was clicked. */
  ctaClick: "cta_click",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/**
 * The events to mark as Key events (conversions) in the GA4 UI.
 *
 * Per the tracking spec we mark exactly two conversions: account creation and
 * payment. The other events are funnel steps — measured, but not counted as
 * conversions. See `docs/10-analytics.md` for the click-by-click marking steps.
 */
export const KEY_EVENT_NAMES: readonly AnalyticsEventName[] = [
  ANALYTICS_EVENTS.signUpComplete,
  ANALYTICS_EVENTS.purchase,
];

/** Properties attached to a `cta_click` event. */
export type CtaClickProps = {
  /** Button label / intent, e.g. "get_started" or "choose_plan". */
  cta: string;
  /** Which plan the CTA targets, when the CTA is plan-specific. */
  plan?: CheckoutPlan | null;
  /** Where on the site the CTA lives, e.g. "landing_hero", "pricing_card". */
  location?: string | null;
};
