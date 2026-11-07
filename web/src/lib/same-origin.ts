/**
 * Cross-site request check for state-changing admin API calls (CSRF defense
 * on top of SameSite cookies). Pure: used by middleware and lib/admin-api.ts.
 *
 * A request passes when its Origin (or, without one, its Referer) names this
 * site's own host. Browsers always send Origin on cross-origin POST/PUT/
 * PATCH/DELETE, so a missing Origin is only accepted when the browser itself
 * says the request is same-origin (Sec-Fetch-Site) or the Referer matches.
 * Anything else is refused — fail closed.
 */

export const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

type HeaderGetter = { get(name: string): string | null };

function hostOf(url: string | null | undefined): string | null {
  if (!url || url === "null") return null;
  try {
    return new URL(url).host.toLowerCase();
  } catch {
    return null;
  }
}

/** Hosts this deployment answers on: the request's own Host and the configured app URL. */
export function ownHosts(h: HeaderGetter): string[] {
  const hosts = new Set<string>();
  const host = h.get("host")?.trim().toLowerCase();
  if (host) hosts.add(host);
  const fwd = h.get("x-forwarded-host")?.split(",")[0]?.trim().toLowerCase();
  if (fwd) hosts.add(fwd);
  const app = hostOf(process.env.NEXT_PUBLIC_APP_URL ?? null);
  if (app) hosts.add(app);
  return [...hosts];
}

export type OriginVerdict = { ok: true } | { ok: false; reason: string };

/** For an unsafe method: is this a same-site request? */
export function checkSameOrigin(h: HeaderGetter): OriginVerdict {
  const hosts = ownHosts(h);
  const origin = h.get("origin");
  if (origin) {
    const oh = hostOf(origin);
    return oh && hosts.includes(oh) ? { ok: true } : { ok: false, reason: "cross-origin" };
  }
  const site = h.get("sec-fetch-site");
  if (site && site !== "same-origin" && site !== "none") return { ok: false, reason: `sec-fetch-site ${site}` };
  const referer = h.get("referer");
  if (referer) {
    const rh = hostOf(referer);
    return rh && hosts.includes(rh) ? { ok: true } : { ok: false, reason: "cross-origin referer" };
  }
  if (site === "same-origin") return { ok: true };
  return { ok: false, reason: "no origin" };
}

/** A present Origin header that isn't ours, for any method. */
export function hasForeignOrigin(h: HeaderGetter): boolean {
  const origin = h.get("origin");
  if (!origin) return false;
  const oh = hostOf(origin);
  return !oh || !ownHosts(h).includes(oh);
}

export const CROSS_ORIGIN_ERROR = "This request came from another site, so it was blocked. Use the admin panel on this site.";
