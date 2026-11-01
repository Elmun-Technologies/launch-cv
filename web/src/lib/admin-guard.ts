import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { getSettings } from "@/lib/app-settings";
import { ADMIN_2FA_COOKIE, ADMIN_REAUTH_COOKIE, verifyPurposeToken } from "@/lib/auth-token";

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

function bootstrapEmails(): string[] {
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
  | { state: "forbidden"; staff: StaffSession };

export async function adminState(perm: Permission = "view"): Promise<AdminState> {
  const session = await getSession();
  if (!session) return { state: "anonymous" };
  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { role: true, email: true, emailVerifiedAt: true, totpEnabledAt: true, passwordHash: true },
  });
  if (!user) return { state: "anonymous" };
  const role = staffRoleOf(user);
  if (!role) return { state: "not_staff" };
  const staff: StaffSession = {
    sub: session.sub,
    email: user.email,
    role,
    totpEnabled: !!user.totpEnabledAt,
    hasPassword: !!user.passwordHash,
  };
  const { security } = await getSettings();
  if (security.requireAdmin2fa || staff.totpEnabled) {
    if (!staff.totpEnabled) return { state: "setup_2fa", staff };
    const token = (await cookies()).get(ADMIN_2FA_COOKIE)?.value;
    const ok = token ? await verifyPurposeToken(token, `admin2fa:${session.sub}`) : null;
    if (!ok) return { state: "verify_2fa", staff };
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
