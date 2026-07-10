/**
 * Central registry for conversion / funnel events.
 *
 * This file is the ONE place event names live. It is isomorphic — no browser
 * or server-only imports — so it can be shared by:
 *   - `analytics-client.ts` (browser dispatch → GA4 gtag + PostHog)
 *   - `analytics-server.ts` (server dispatch → GA4 Measurement Protocol + PostHog capture)
 *   - the Polar webhook (server) for `purchase_completed`
 *
 * The five events below are the conversion funnel we measure end to end:
 *   register page → account created → checkout opened → payment succeeded,
 * plus CTA clicks that feed the top of the funnel.
 *
 * Keep the string values stable — they are what GA4 and PostHog store, and
 * what you mark as Key events / build funnels on. Renaming a value resets its
 * history in both tools.
 */

import type { CheckoutPlan } from "@/lib/plan-config";

export const ANALYTICS_EVENTS = {
  /** Register page opened. */
  signUpStarted: "sign_up_started",
  /** Account successfully created. */
  signUpCompleted: "sign_up_completed",
  /** Polar checkout session opened (user redirected to pay). */
  checkoutStarted: "checkout_started",
  /** Payment confirmed — emitted server-side from the Polar webhook. */
  purchaseCompleted: "purchase_completed",
  /** A "Get started" / "Choose plan" CTA was clicked. */
  featureCtaClicked: "feature_cta_clicked",
} as const;

export type AnalyticsEventName = (typeof ANALYTICS_EVENTS)[keyof typeof ANALYTICS_EVENTS];

/** The events to mark as Key events (conversions) in the GA4 UI. */
export const KEY_EVENT_NAMES: readonly AnalyticsEventName[] = [
  ANALYTICS_EVENTS.signUpStarted,
  ANALYTICS_EVENTS.signUpCompleted,
  ANALYTICS_EVENTS.checkoutStarted,
  ANALYTICS_EVENTS.purchaseCompleted,
  ANALYTICS_EVENTS.featureCtaClicked,
];

/** Properties attached to a `feature_cta_clicked` event. */
export type CtaClickProps = {
  /** Button label / intent, e.g. "get_started" or "choose_plan". */
  cta: string;
  /** Which plan the CTA targets, when the CTA is plan-specific. */
  plan?: CheckoutPlan | null;
  /** Where on the site the CTA lives, e.g. "landing_hero", "pricing_card". */
  location?: string | null;
};
