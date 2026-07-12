/**
 * Campaign attribution (UTM + ad click ids).
 *
 * Isomorphic and dependency-free so it can run in three places:
 *   - the browser, to CAPTURE attribution on landing and READ it for events;
 *   - the checkout route (server), to READ it from the request cookie and
 *     forward it into the Polar checkout metadata;
 *   - anywhere that needs to PARSE a query string or cookie value.
 *
 * We store FIRST-TOUCH attribution: the first campaign a visitor arrives on is
 * written once to a first-party cookie and kept for the whole funnel, so a
 * purchase that happens days later is still credited to the campaign that
 * brought the user in. GA4 (session source/medium) and PostHog ($initial_utm_*)
 * do their own attribution automatically for client events; this cookie is what
 * lets us carry the same attribution onto the SERVER-side `purchase` event,
 * which has no browser session to read from.
 *
 * Everything here is campaign metadata only — never any PII.
 */

/** Cookie name holding the JSON-encoded first-touch attribution. */
export const ATTRIBUTION_COOKIE = "lc_attribution";

/** ~90 days — long enough to outlive a typical consideration window. */
const ATTRIBUTION_MAX_AGE_SECONDS = 60 * 60 * 24 * 90;

/** Standard UTM query params we recognise. */
export const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
] as const;

/** Ad-platform click ids (also non-PII campaign metadata). */
export const CLICK_ID_KEYS = ["gclid", "fbclid", "msclkid"] as const;

const ALL_KEYS = [...UTM_KEYS, ...CLICK_ID_KEYS] as const;

export type AttributionKey = (typeof ALL_KEYS)[number];
export type Attribution = Partial<Record<AttributionKey, string>>;

/** Pull recognised attribution params out of a URL query string. */
export function parseAttribution(search: string): Attribution {
  const params = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const out: Attribution = {};
  for (const key of ALL_KEYS) {
    const v = params.get(key);
    // Cap length defensively — attribution values are short campaign tags.
    if (v) out[key] = v.slice(0, 200);
  }
  return out;
}

function hasAny(a: Attribution): boolean {
  return Object.keys(a).length > 0;
}

/** Read the first-touch cookie value string → Attribution. Safe on any input. */
function decodeAttribution(raw: string | undefined | null): Attribution {
  if (!raw) return {};
  try {
    const parsed = JSON.parse(decodeURIComponent(raw)) as unknown;
    if (!parsed || typeof parsed !== "object") return {};
    const out: Attribution = {};
    for (const key of ALL_KEYS) {
      const v = (parsed as Record<string, unknown>)[key];
      if (typeof v === "string" && v) out[key] = v.slice(0, 200);
    }
    return out;
  } catch {
    return {};
  }
}

/* ────────────────────────── browser ────────────────────────── */

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const match = document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`));
  return match ? match.slice(name.length + 1) : undefined;
}

/**
 * Capture first-touch attribution on landing. No-op when the cookie already
 * exists (first touch wins) or when the URL carries no attribution params.
 * Call once on initial page load.
 */
export function captureAttribution(): void {
  if (typeof window === "undefined") return;
  if (readCookie(ATTRIBUTION_COOKIE)) return; // first touch already recorded

  const current = parseAttribution(window.location.search);
  if (!hasAny(current)) return;

  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const value = encodeURIComponent(JSON.stringify(current));
  document.cookie = `${ATTRIBUTION_COOKIE}=${value}; Max-Age=${ATTRIBUTION_MAX_AGE_SECONDS}; Path=/; SameSite=Lax${secure}`;
}

/** Read stored first-touch attribution in the browser (for event params). */
export function getAttribution(): Attribution {
  return decodeAttribution(readCookie(ATTRIBUTION_COOKIE));
}

/* ────────────────────────── server ────────────────────────── */

/** Read stored attribution from a request `Cookie` header (server-side). */
export function attributionFromCookieHeader(cookieHeader: string | null | undefined): Attribution {
  if (!cookieHeader) return {};
  const match = cookieHeader
    .split("; ")
    .find((row) => row.startsWith(`${ATTRIBUTION_COOKIE}=`));
  return decodeAttribution(match ? match.slice(ATTRIBUTION_COOKIE.length + 1) : undefined);
}

/**
 * Pull recognised attribution keys out of a flat record (e.g. the `metadata`
 * object a payment provider echoes back on its webhook). Ignores everything
 * that isn't a known UTM / click-id key.
 */
export function attributionFromRecord(record: Record<string, unknown> | null | undefined): Attribution {
  if (!record) return {};
  const out: Attribution = {};
  for (const key of ALL_KEYS) {
    const v = record[key];
    if (typeof v === "string" && v) out[key] = v.slice(0, 200);
  }
  return out;
}

/** Flatten attribution back into string metadata for a checkout payload. */
export function attributionToMetadata(attribution: Attribution): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(attribution)) {
    if (v) out[k] = v;
  }
  return out;
}
