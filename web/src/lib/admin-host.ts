/**
 * Helpers for the admin-subdomain split.
 *
 * Production setup:
 *   NEXT_PUBLIC_ADMIN_HOST=admin.launch-cv.com
 *   NEXT_PUBLIC_APEX_HOST=launch-cv.com
 *
 * Local dev / Vercel preview leaves these unset — the split is a no-op
 * and every route is reachable from a single host, as today.
 */

export function getAdminHost(): string {
  return (process.env.NEXT_PUBLIC_ADMIN_HOST ?? "").trim().toLowerCase();
}

export function getApexHost(): string {
  return (process.env.NEXT_PUBLIC_APEX_HOST ?? "").trim().toLowerCase();
}

/** Strips port + lowercases. */
function normalizeHost(host: string | null | undefined): string {
  return (host ?? "").toLowerCase().split(":")[0];
}

export function isAdminRequest(host: string | null | undefined): boolean {
  const admin = getAdminHost();
  if (!admin) return false;
  return normalizeHost(host) === admin;
}

export function isApexRequest(host: string | null | undefined): boolean {
  const apex = getApexHost();
  if (!apex) return false;
  const h = normalizeHost(host);
  return h === apex || h === `www.${apex}`;
}

/** True when host-split routing should be enforced. */
export function isHostSplitConfigured(): boolean {
  return Boolean(getAdminHost());
}
