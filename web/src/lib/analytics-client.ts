/**
 * Browser-side analytics dispatch.
 *
 * A single `track()` fans every event out to BOTH destinations:
 *   - Google Analytics 4 via the global `gtag()` (see `components/google-analytics.tsx`)
 *   - PostHog via `window.posthog` (exposed in `app/providers.tsx` after init)
 *
 * We intentionally reach for the globals rather than statically importing
 * `posthog-js` — a static import would pull the (large) library into the
 * initial JS bundle and defeat the dynamic-import loading in `providers.tsx`.
 *
 * Import the typed helpers (`trackSignUpStarted`, …) from client components.
 * `purchase_completed` has no client helper — it is emitted server-side from
 * the Polar webhook (see `analytics-server.ts`).
 */

import { ANALYTICS_EVENTS, type AnalyticsEventName, type CtaClickProps } from "@/lib/analytics-events";
import type { CheckoutPlan } from "@/lib/plan-config";

type EventParams = Record<string, unknown>;

type GtagWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  posthog?: {
    capture?: (event: string, properties?: EventParams) => void;
    identify?: (distinctId: string, properties?: EventParams) => void;
    reset?: () => void;
  };
};

function toGtag(event: AnalyticsEventName, params: EventParams) {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  if (typeof w.gtag === "function") {
    w.gtag("event", event, params);
    return;
  }
  // Defensive fallback: mirror what the gtag snippet does if it hasn't run yet.
  w.dataLayer = w.dataLayer || [];
  w.dataLayer.push(["event", event, params]);
}

function toPosthog(event: AnalyticsEventName, params: EventParams) {
  if (typeof window === "undefined") return;
  (window as GtagWindow).posthog?.capture?.(event, params);
}

/**
 * Send a conversion / funnel event to GA4 and PostHog. Never throws — analytics
 * must not break the UI. Undefined params are dropped so GA4 doesn't record them.
 */
export function track(event: AnalyticsEventName, params?: EventParams) {
  const clean: EventParams = {};
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined) clean[k] = v;
    }
  }
  try {
    toGtag(event, clean);
  } catch {
    // ignore
  }
  try {
    toPosthog(event, clean);
  } catch {
    // ignore
  }
}

export function trackSignUpStarted(params?: EventParams) {
  track(ANALYTICS_EVENTS.signUpStarted, params);
}

export function trackSignUpCompleted(params?: EventParams) {
  track(ANALYTICS_EVENTS.signUpCompleted, params);
}

export function trackCheckoutStarted(plan: CheckoutPlan, params?: EventParams) {
  track(ANALYTICS_EVENTS.checkoutStarted, { plan, provider: "polar", ...params });
}

export function trackFeatureCtaClicked({ cta, plan, location }: CtaClickProps) {
  track(ANALYTICS_EVENTS.featureCtaClicked, {
    cta,
    plan: plan ?? null,
    location: location ?? null,
  });
}

/**
 * Tie subsequent events to a known user. Without this, pre-signup events are
 * anonymous and the funnel can't join them to the identified user (nor to the
 * server-side `purchase_completed`, which is keyed by user id). Call right after
 * a successful register / login.
 */
export function identifyUser(userId: string, traits?: EventParams) {
  if (typeof window === "undefined" || !userId) return;
  const w = window as GtagWindow;
  try {
    w.gtag?.("set", { user_id: userId });
  } catch {
    // ignore
  }
  try {
    w.posthog?.identify?.(userId, traits);
  } catch {
    // ignore
  }
}

/** Clear the identified user on logout so the next visitor starts anonymous. */
export function resetUser() {
  if (typeof window === "undefined") return;
  const w = window as GtagWindow;
  try {
    w.gtag?.("set", { user_id: null });
  } catch {
    // ignore
  }
  try {
    w.posthog?.reset?.();
  } catch {
    // ignore
  }
}

/**
 * Read the GA4 client id from the `_ga` cookie (`GA1.1.<cid1>.<cid2>` → `<cid1>.<cid2>`).
 * Passed to the server at checkout so the webhook-driven `purchase_completed`
 * stitches to this browser's GA session. Returns null before GA has set the cookie.
 */
export function getGaClientId(): string | null {
  if (typeof document === "undefined") return null;
  const m = document.cookie.match(/(?:^|;\s*)_ga=GA\d+\.\d+\.(\d+\.\d+)/);
  return m ? m[1] : null;
}
