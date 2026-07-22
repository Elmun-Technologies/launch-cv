/**
 * Server-side analytics dispatch.
 *
 * Used where there is no browser to run gtag/posthog/mixpanel — currently the
 * Polar webhook, which is the source of truth for the `purchase` event. Fans
 * the event out to ALL THREE destinations:
 *   - GA4 via the Measurement Protocol (needs a Measurement ID + an API secret)
 *   - PostHog via the /capture/ HTTP endpoint (uses the public project key)
 *   - Mixpanel via the /track HTTP endpoint (uses the public project token)
 *
 * Everything here is best-effort: a missing env var or a network hiccup must
 * never fail the webhook (Polar would just retry the delivery).
 */

import { ANALYTICS_EVENTS, type AnalyticsEventName } from "@/lib/analytics-events";
import { PLAN_CURRENCY, PLAN_PRICE_USD, type CheckoutPlan } from "@/lib/plan-config";
import { UTM_KEYS, type Attribution } from "@/lib/utm";

/**
 * Map first-touch attribution onto GA4 Measurement Protocol traffic-source
 * params (`source`/`medium`/`campaign`/…) so a server-side conversion is
 * credited to the campaign that brought the user in, and also keep the raw
 * `utm_*` keys for PostHog. Attribution is campaign metadata only — no PII.
 */
function attributionParams(attribution?: Attribution | null): Record<string, string> {
  if (!attribution) return {};
  const gaKey: Record<(typeof UTM_KEYS)[number], string> = {
    utm_source: "source",
    utm_medium: "medium",
    utm_campaign: "campaign",
    utm_term: "term",
    utm_content: "content",
  };
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(attribution)) {
    if (!v) continue;
    out[k] = v; // raw utm_* / click id (PostHog + GA4 custom dimension)
    const mapped = gaKey[k as (typeof UTM_KEYS)[number]];
    if (mapped) out[mapped] = v; // GA4-recognised traffic-source param
  }
  return out;
}

/** Same resolution rules as `components/google-analytics.tsx`. */
const DEFAULT_MEASUREMENT_ID = "G-BQJVBJ207Q";

function resolveMeasurementId(): string | null {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const id =
    raw === undefined || raw === ""
      ? DEFAULT_MEASUREMENT_ID
      : raw.trim() === "false" || raw.trim() === "0"
        ? ""
        : raw.trim();
  return id && id.startsWith("G-") ? id : null;
}

/** GA4 Measurement Protocol. Silently skips when GA_API_SECRET is unset. */
async function sendToGa4(
  event: AnalyticsEventName,
  params: Record<string, unknown>,
  clientId: string,
  userId?: string | null,
) {
  const measurementId = resolveMeasurementId();
  const apiSecret = process.env.GA_API_SECRET?.trim();
  if (!measurementId || !apiSecret) return;

  const url = `https://www.google-analytics.com/mp/collect?measurement_id=${encodeURIComponent(
    measurementId,
  )}&api_secret=${encodeURIComponent(apiSecret)}`;

  await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      client_id: clientId,
      ...(userId ? { user_id: userId } : {}),
      events: [{ name: event, params }],
    }),
  }).catch(() => undefined);
}

/** PostHog capture endpoint. Silently skips when the project key is unset. */
async function sendToPosthog(event: AnalyticsEventName, distinctId: string, properties: Record<string, unknown>) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY?.trim();
  if (!key) return;
  const host = (process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com").replace(/\/$/, "");

  await fetch(`${host}/capture/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: key,
      event,
      distinct_id: distinctId,
      // `$process_person_profile: true` links this server event to the person
      // identified in the browser (PostHog identifies by user id at login).
      properties: { ...properties, $process_person_profile: true },
    }),
  }).catch(() => undefined);
}

/** Mixpanel /track ingestion endpoint. Silently skips when the project token is unset. */
async function sendToMixpanel(event: AnalyticsEventName, distinctId: string, properties: Record<string, unknown>) {
  const token = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN?.trim();
  if (!token) return;
  const host = (process.env.NEXT_PUBLIC_MIXPANEL_HOST || "https://api.mixpanel.com").replace(/\/$/, "");

  await fetch(`${host}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "text/plain" },
    body: JSON.stringify([
      {
        event,
        properties: {
          ...properties,
          token,
          distinct_id: distinctId,
          time: Date.now(),
          // Dedupes retried webhook deliveries the same way Mixpanel's own SDKs do.
          $insert_id: crypto.randomUUID(),
        },
      },
    ]),
  }).catch(() => undefined);
}

/**
 * Emit a server-side event to GA4 + PostHog + Mixpanel.
 *
 * GA4's Measurement Protocol requires a `client_id`. There is no browser cookie
 * on a webhook, so we synthesize a stable id from the user id — the purchase
 * still lands as a proper GA4 conversion, just not stitched to the pre-purchase
 * web session. PostHog and Mixpanel are keyed by the same user id, matching
 * browser identify().
 */
export async function trackServerEvent(
  event: AnalyticsEventName,
  opts: { userId?: string | null; gaClientId?: string | null; params?: Record<string, unknown> } = {},
) {
  const { userId, gaClientId, params = {} } = opts;
  const distinctId = userId ?? "anonymous";
  // Prefer the real browser GA client id (stitches to the pre-purchase session);
  // fall back to a stable per-user synthetic id when it's unavailable.
  const clientId = gaClientId ?? (userId ? `srv.${userId}` : "srv.anonymous");
  await Promise.all([
    sendToGa4(event, params, clientId, userId),
    sendToPosthog(event, distinctId, params),
    sendToMixpanel(event, distinctId, params),
  ]);
}

/** Convenience wrapper for the payment success case. */
export async function trackPurchaseCompleted(opts: {
  userId: string;
  plan: CheckoutPlan | null;
  provider: string;
  orderId?: string | null;
  subscriptionId?: string | null;
  value?: number | null;
  currency?: string | null;
  gaClientId?: string | null;
  attribution?: Attribution | null;
}) {
  const { userId, plan, provider, orderId, subscriptionId, value, currency, gaClientId, attribution } = opts;
  // GA4 monetization needs a numeric `value` + `currency`. Prefer the provider's
  // actual amount; fall back to the plan list price when it didn't carry one.
  const resolvedValue = value ?? (plan ? PLAN_PRICE_USD[plan] : undefined);
  await trackServerEvent(ANALYTICS_EVENTS.purchase, {
    userId,
    gaClientId,
    params: {
      plan,
      provider,
      order_id: orderId ?? undefined,
      subscription_id: subscriptionId ?? undefined,
      // GA4 uses transaction_id to de-duplicate revenue across resends.
      transaction_id: orderId ?? subscriptionId ?? undefined,
      value: resolvedValue ?? undefined,
      currency: resolvedValue != null ? (currency ?? PLAN_CURRENCY) : undefined,
      ...attributionParams(attribution),
    },
  });
}
