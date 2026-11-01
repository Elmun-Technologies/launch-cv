import { NextResponse } from "next/server";
import { ADMIN_2FA_COOKIE, ADMIN_REAUTH_COOKIE, COOKIE_NAME, sessionCookieBase } from "@/lib/auth-token";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  for (const name of [COOKIE_NAME, ADMIN_2FA_COOKIE, ADMIN_REAUTH_COOKIE]) {
    res.cookies.set(name, "", { ...sessionCookieBase(), maxAge: 0 });
  }
  return res;
}
