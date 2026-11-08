/**
 * Pure helpers for the /checkout/[plan] page (no server imports; self-checked
 * in checkout-embed.check.ts).
 */

/** Where every completed checkout lands: the existing success screen (see the Polar `success_url`). */
export const CHECKOUT_SUCCESS_PATH = "/dashboard/settings/subscription?checkout=success";

/**
 * Where to send the buyer after the embedded checkout reports success: the
 * `success_url` /api/polar/checkout gave Polar, as Polar echoes it back (query
 * included, e.g. `checkout_id`). It is followed unchanged as long as it is an
 * http(s) URL to the subscription settings page (on this or the configured
 * app host); only a missing or foreign value falls back to the plain path.
 */
export function successRedirect(successURL: string | null | undefined, origin: string): string {
  if (!successURL) return CHECKOUT_SUCCESS_PATH;
  try {
    const u = new URL(successURL, origin);
    if ((u.protocol !== "https:" && u.protocol !== "http:") || u.pathname !== "/dashboard/settings/subscription") return CHECKOUT_SUCCESS_PATH;
    return u.origin === origin ? `${u.pathname}${u.search}${u.hash}` : u.toString();
  } catch {
    return CHECKOUT_SUCCESS_PATH;
  }
}

/** Sign-up / sign-in links that bring the buyer back to this plan's checkout, which then opens payment. */
export function checkoutAuthHrefs(plan: string): { register: string; login: string } {
  const next = encodeURIComponent(`/checkout/${plan}?start=1`);
  return { register: `/register?next=${next}`, login: `/login?next=${next}` };
}

/** Only Polar-hosted checkout URLs are opened in the overlay; anything else is a plain redirect. */
export function isPolarCheckoutUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && (u.hostname === "polar.sh" || u.hostname.endsWith(".polar.sh"));
  } catch {
    return false;
  }
}
