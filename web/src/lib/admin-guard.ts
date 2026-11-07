import { cache } from "react";
import { cookies, headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getSettings } from "@/lib/app-settings";
import { ADMIN_2FA_COOKIE, ADMIN_REAUTH_COOKIE, verifyPurposeToken } from "@/lib/auth-token";
import { displayIp, ipAllowed, maskIp } from "@/lib/ip-allowlist";
import { consumeRateLimitShared } from "@/lib/rate-limit";
import { recordAudit } from "@/lib/cms/audit";

/**
 * Staff access for /admin-panel and /api/admin-panel.
 *
 * Roles (User.role): owner, admin, editor, support. The legacy role "admin"
 * keeps working. ADMIN_EMAILS (hosting env) is a bootstrap list: a verified
 * address on it is treated as an owner, so the first owner can always get in
 * and invite the rest of the team from Admin → Security.
 */

export type StaffRole = "owner" | "admin" | "editor" | "support";
export const STAFF_ROLES: StaffRole[] = ["owner", "admin", "editor", "support"];

export type Permission = "view" | "content" | "users" | "limits" | "secrets" | "roles";

const PERMS: Record<Permission, StaffRole[]> = {
  view: ["owner", "admin", "editor", "support"],
  content: ["owner", "admin", "editor"],
  users: ["owner", "admin", "support"],
  limits: ["owner", "admin"],
  secrets: ["owner"],
  roles: ["owner"],
};

export const PERMISSION_LABELS: Record<Permission, string> = {
  view: "View dashboard and analytics",
  content: "Edit blog, FAQs, page copy, media",
  users: "Manage users and subscriptions",
  limits: "Change limits, budgets and switches",
  secrets: "Connect or replace API keys",
  roles: "Manage the team and roles",
};

export function can(role: StaffRole | null, perm: Permission): boolean {
  return !!role && PERMS[perm].includes(role);
}

export function bootstrapEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * The ADMIN_EMAILS allow-list only applies once the address is verified —
 * otherwise anyone could register an allow-listed email that has no account
 * yet and get admin access, since registration signs the user in immediately.
 */
export function staffRoleOf(user: { role: string; email: string; emailVerifiedAt: Date | null }): StaffRole | null {
  if (user.role === "owner" || user.role === "editor" || user.role === "support") return user.role;
  if (user.role === "admin") return "admin";
  if (user.emailVerifiedAt !== null && bootstrapEmails().includes(user.email.toLowerCase())) return "owner";
  return null;
}

/** Returns true if a freshly-loaded user row is staff of any role. */
export function isAdminUser(user: { role: string; email: string; emailVerifiedAt: Date | null }): boolean {
  return staffRoleOf(user) !== null;
}

export type StaffSession = { sub: string; email: string; role: StaffRole; totpEnabled: boolean; hasPassword: boolean };

export type AdminState =
  | { state: "ok"; staff: StaffSession }
  | { state: "anonymous" }
  | { state: "not_staff" }
  /** Staff, but 2FA isn't set up yet (and the setting requires it). */
  | { state: "setup_2fa"; staff: StaffSession }
  /** Staff with 2FA, but this browser hasn't entered a code recently. */
  | { state: "verify_2fa"; staff: StaffSession }
  /** Staff, but the request comes from a network outside the admin IP allow-list. */
  | { state: "ip_blocked"; staff: StaffSession; ip: string }
  | { state: "forbidden"; staff: StaffSession };

/** Request path set by middleware (x-lc-path) for admin pages and admin APIs. */
export const PATH_HEADER = "x-lc-path";
/** Request method set by middleware (x-lc-method) for admin APIs. */
export const METHOD_HEADER = "x-lc-method";

/**
 * Client address for admin checks: the first X-Forwarded-For hop (set by the
 * hosting edge — Vercel overwrites it), else X-Real-IP. Same source as the IPs
 * written to the audit log. Null when unknown.
 */
export function clientIpFrom(h: { get(name: string): string | null }): string | null {
  const xf = h.get("x-forwarded-for")?.split(",")[0]?.trim();
  const ip = xf || h.get("x-real-ip")?.trim() || "";
  return ip ? displayIp(ip) : null;
}

/** IP and path of the current request (server components and route handlers). */
export async function requestContext(): Promise<{ ip: string | null; path: string }> {
  try {
    const h = await headers();
    return { ip: clientIpFrom(h), path: (h.get(PATH_HEADER) ?? "").slice(0, 300) || "/admin-panel" };
  } catch {
    return { ip: null, path: "/admin-panel" };
  }
}

/** Escape hatch for an owner who locked themselves out: ADMIN_IP_ALLOWLIST_DISABLED=1 in hosting. */
export function ipAllowlistBypassed(): boolean {
  return process.env.ADMIN_IP_ALLOWLIST_DISABLED === "1";
}

export const DENIED_PATH = "/admin-panel/access-denied";

/**
 * Audit a signed-in non-admin reaching the admin panel: user id, path and a
 * masked IP. Once per request (React cache) and at most 30 per user per hour.
 */
export const logAdminDenied = cache(async (userId: string, path: string, ip: string | null) => {
  try {
    if (!(await consumeRateLimitShared(`admin-denied-log:${userId}`, 30, 60 * 60_000))) return;
    await recordAudit({ actorId: userId, action: "admin.denied", entity: "User", entityId: userId, diff: { path, ip: maskIp(ip) }, ip: maskIp(ip) });
  } catch {
    // Never block the response on logging.
  }
});

const logIpBlocked = cache(async (userId: string, path: string, ip: string | null) => {
  try {
    if (!(await consumeRateLimitShared(`admin-ipblock-log:${userId}`, 30, 60 * 60_000))) return;
    await recordAudit({ actorId: userId, action: "admin.ip.blocked", entity: "User", entityId: userId, diff: { path, ip: maskIp(ip) }, ip: ip ?? null });
  } catch {
    // Never block the response on logging.
  }
});

const LAST_SEEN_EVERY_MS = 5 * 60_000;

export async function adminState(perm: Permission = "view"): Promise<AdminState> {
  const session = await getSession();
  if (!session) return { state: "anonymous" };
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { role: true, email: true, emailVerifiedAt: true, totpEnabledAt: true, passwordHash: true, adminLastSeenAt: true },
  });
  if (!user) return { state: "anonymous" };
  const role = staffRoleOf(user);
  const ctx = await requestContext();
  if (!role) {
    if (ctx.path !== DENIED_PATH) await logAdminDenied(session.sub, ctx.path, ctx.ip);
    return { state: "not_staff" };
  }
  const staff: StaffSession = {
    sub: session.sub,
    email: user.email,
    role,
    totpEnabled: !!user.totpEnabledAt,
    hasPassword: !!user.passwordHash,
  };
  const { security } = await getSettings();
  // IP allow-list comes first: outside it, staff don't even get the 2FA screen. Unknown IP = blocked.
  if (security.ipAllowlist.length && !ipAllowlistBypassed() && !ipAllowed(ctx.ip, security.ipAllowlist)) {
    if (ctx.path !== DENIED_PATH) await logIpBlocked(session.sub, ctx.path, ctx.ip);
    return { state: "ip_blocked", staff, ip: ctx.ip ?? "unknown" };
  }
  if (security.requireAdmin2fa || staff.totpEnabled) {
    if (!staff.totpEnabled) return { state: "setup_2fa", staff };
    const token = (await cookies()).get(ADMIN_2FA_COOKIE)?.value;
    const ok = token ? await verifyPurposeToken(token, `admin2fa:${session.sub}`) : null;
    if (!ok) return { state: "verify_2fa", staff };
  }
  // "Last active" on Admin → Security; written at most every few minutes.
  if (!user.adminLastSeenAt || Date.now() - user.adminLastSeenAt.getTime() > LAST_SEEN_EVERY_MS) {
    void prisma.user.update({ where: { id: session.sub }, data: { adminLastSeenAt: new Date() } }).catch(() => null);
  }
  if (!can(role, perm)) return { state: "forbidden", staff };
  return { state: "ok", staff };
}

/**
 * Staff session with the given permission and a completed 2FA check, or null.
 * Pages redirect to /admin-panel/access-denied on null; that page sends staff
 * who still need 2FA to /admin-2fa.
 */
export async function requireAdmin(perm: Permission = "view"): Promise<StaffSession | null> {
  const s = await adminState(perm);
  return s.state === "ok" ? s.staff : null;
}

/** True if this browser confirmed password + code in the last few minutes. */
export async function hasRecentReauth(sub: string): Promise<boolean> {
  const token = (await cookies()).get(ADMIN_REAUTH_COOKIE)?.value;
  return !!(token && (await verifyPurposeToken(token, `reauth:${sub}`)));
}
