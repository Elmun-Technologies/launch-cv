import { NextResponse } from "next/server";
import { adminState, hasRecentReauth, type Permission, type StaffSession } from "@/lib/admin-guard";

/**
 * Guard for /api/admin-panel routes. Returns the staff session, or a ready
 * NextResponse to send back (401/403). `reauth` also requires a password +
 * code confirmation from the last few minutes (keys, limits, roles).
 */
export async function adminApi(
  perm: Permission,
  opts: { reauth?: boolean } = {},
): Promise<{ staff: StaffSession; error?: never } | { staff?: never; error: NextResponse }> {
  const s = await adminState(perm);
  if (s.state === "anonymous") return { error: NextResponse.json({ error: "Sign in first." }, { status: 401 }) };
  if (s.state === "setup_2fa" || s.state === "verify_2fa") {
    return { error: NextResponse.json({ error: "Two-factor check required.", code: "2fa_required" }, { status: 401 }) };
  }
  if (s.state !== "ok") return { error: NextResponse.json({ error: "You don't have access to this." }, { status: 403 }) };
  if (opts.reauth && !(await hasRecentReauth(s.staff.sub))) {
    return { error: NextResponse.json({ error: "Confirm it's you first.", code: "reauth_required" }, { status: 401 }) };
  }
  return { staff: s.staff };
}
