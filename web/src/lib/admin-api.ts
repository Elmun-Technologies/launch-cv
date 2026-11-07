import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { adminState, clientIpFrom, hasRecentReauth, METHOD_HEADER, PATH_HEADER, type Permission, type StaffSession } from "@/lib/admin-guard";
import { checkSameOrigin, CROSS_ORIGIN_ERROR, hasForeignOrigin, UNSAFE_METHODS } from "@/lib/same-origin";
import { recordAudit } from "@/lib/cms/audit";

/**
 * Guard for /api/admin-panel routes. Returns the staff session, or a ready
 * NextResponse to send back (401/403). `reauth` also requires a password +
 * code confirmation from the last few minutes (keys, limits, roles).
 *
 * State-changing calls (POST/PUT/PATCH/DELETE) must come from this site:
 * middleware refuses cross-site ones before they reach a route, and this
 * checks again here (and records it) in case a route is ever reached
 * without middleware.
 */
export async function adminApi(
  perm: Permission,
  opts: { reauth?: boolean } = {},
): Promise<{ staff: StaffSession; error?: never } | { staff?: never; error: NextResponse }> {
  const h = await headers();
  const method = (h.get(METHOD_HEADER) ?? "").toUpperCase();
  const crossSite = hasForeignOrigin(h) || (UNSAFE_METHODS.has(method) && !checkSameOrigin(h).ok);
  const s = await adminState(perm);
  if (crossSite) {
    if ("staff" in s) {
      await recordAudit({
        actorId: s.staff.sub,
        action: "admin.origin.blocked",
        entity: "User",
        entityId: s.staff.sub,
        diff: { path: h.get(PATH_HEADER) ?? "", method },
        ip: clientIpFrom(h),
      });
    }
    return { error: NextResponse.json({ error: CROSS_ORIGIN_ERROR, code: "cross_origin" }, { status: 403 }) };
  }
  if (s.state === "anonymous") return { error: NextResponse.json({ error: "Sign in first." }, { status: 401 }) };
  if (s.state === "ip_blocked") {
    return { error: NextResponse.json({ error: "Your network isn't on the admin IP allow-list.", code: "ip_blocked" }, { status: 403 }) };
  }
  if (s.state === "setup_2fa" || s.state === "verify_2fa") {
    return { error: NextResponse.json({ error: "Two-factor check required.", code: "2fa_required" }, { status: 401 }) };
  }
  if (s.state !== "ok") return { error: NextResponse.json({ error: "You don't have access to this." }, { status: 403 }) };
  if (opts.reauth && !(await hasRecentReauth(s.staff.sub))) {
    return { error: NextResponse.json({ error: "Confirm it's you first.", code: "reauth_required" }, { status: 401 }) };
  }
  return { staff: s.staff };
}
