/**
 * Single source of truth for *whether* browser analytics (GA4 + PostHog) may
 * run for the current request, and for tagging internal/team traffic.
 *
 * The goal is to keep our GA4 / PostHog data clean of internal noise:
 *   - Analytics only load on the PRODUCTION marketing site.
 *   - They never load on the app surfaces (`/admin-panel`, `/dashboard`).
 *   - They never load on Vercel *preview* deployments (or local dev), which is
 *     the source of the "vercel.com preview" referral pollution.
 *   - Team members can be tagged as `internal` so GA4's internal-traffic filter
 *     and PostHog's "Filter test accounts" rule can exclude them even while they
 *     browse the real production marketing pages.
 *
 * Everything here is isomorphic and dependency-free so it can be imported from
 * both server and client components.
 */

/** localStorage key + cookie name + query param used to flag internal traffic. */
export const INTERNAL_TRAFFIC_KEY = "lcv_internal";

/**
 * App surfaces that must never load marketing analytics. A path is excluded if
 * it equals one of these prefixes or is nested under it (`/dashboard/resumes`).
 */
export const EXCLUDED_PATH_PREFIXES = ["/admin-panel", "/dashboard"] as const;

export type EnvName = "production" | "preview" | "development";

/**
 * Which deployment environment we're in.
 *
 * On Vercel, `NODE_ENV` is `"production"` for BOTH production and preview
 * deployments, so it can't distinguish them. `NEXT_PUBLIC_VERCEL_ENV`
 * (auto-exposed by Vercel for Next.js) can — it is `production` / `preview` /
 * `development`. We fall back to `NODE_ENV` when not running on Vercel.
 */
export function currentEnvName(): EnvName {
  const vercel = (process.env.NEXT_PUBLIC_VERCEL_ENV || "").trim().toLowerCase();
  if (vercel === "production" || vercel === "preview" || vercel === "development") {
    return vercel;
  }
  return process.env.NODE_ENV === "production" ? "production" : "development";
}

/** True only on the real production deployment (not preview, not local dev). */
export function isProductionSite(): boolean {
  return currentEnvName() === "production";
}

/** Does `pathname` point at an internal app surface (admin panel / dashboard)? */
export function isExcludedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return EXCLUDED_PATH_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * Client-only: is the current host a preview/non-production domain? Catches
 * `*.vercel.app` preview URLs and local hosts even if the env var is misconfigured.
 * Returns false during SSR (no `window`) — the env check is the SSR-safe guard.
 */
export function isPreviewHost(): boolean {
  if (typeof window === "undefined") return false;
  const host = window.location.hostname.toLowerCase();
  return (
    host.endsWith(".vercel.app") ||
    host === "localhost" ||
    host === "127.0.0.1" ||
    host.endsWith(".local")
  );
}

/**
 * Render-time gate for whether to mount analytics. Deterministic across
 * SSR/CSR (env + pathname only) so it never causes a hydration mismatch —
 * host- and flag-based suppression is applied in effects, not in render.
 */
export function analyticsAllowed(pathname: string | null | undefined): boolean {
  return isProductionSite() && !isExcludedPath(pathname);
}

/** Client-only: has this browser been flagged as internal/team traffic? */
export function readInternalFlag(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.localStorage.getItem(INTERNAL_TRAFFIC_KEY) === "1") return true;
  } catch {
    // localStorage can throw (private mode / disabled) — fall through to cookie.
  }
  if (typeof document !== "undefined" && document.cookie.includes(`${INTERNAL_TRAFFIC_KEY}=1`)) {
    return true;
  }
  return false;
}

/**
 * Client-only: persist / clear the internal flag from a `?lcv_internal=1` (or
 * `=0`) query param so a team member can opt their browser in once from any
 * device. Call on navigation; a no-op when the param is absent.
 */
export function syncInternalTrafficFlag(): void {
  if (typeof window === "undefined") return;
  try {
    const value = new URLSearchParams(window.location.search).get(INTERNAL_TRAFFIC_KEY);
    if (value === null) return;
    if (value === "1" || value === "true") {
      window.localStorage.setItem(INTERNAL_TRAFFIC_KEY, "1");
    } else if (value === "0" || value === "false") {
      window.localStorage.removeItem(INTERNAL_TRAFFIC_KEY);
    }
  } catch {
    // Ignore — flagging internal traffic must never break navigation.
  }
}
