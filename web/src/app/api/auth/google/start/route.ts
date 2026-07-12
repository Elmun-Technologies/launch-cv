import { NextResponse } from "next/server";
import { generateRawToken } from "@/lib/token-crypto";
import { sessionCookieBase } from "@/lib/auth-token";
import {
  GOOGLE_STATE_COOKIE,
  buildGoogleAuthUrl,
  isGoogleOAuthConfigured,
} from "@/lib/google-oauth";

/** Only same-origin paths are safe to redirect a user to after login. */
function safeNextPath(value: string | null): string | null {
  if (!value) return null;
  if (value.length > 512) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  if (value.includes("://")) return null;
  return value;
}

export async function GET(req: Request) {
  if (!isGoogleOAuthConfigured()) {
    return NextResponse.redirect(new URL("/login?error=google_unavailable", req.url));
  }

  const url = new URL(req.url);
  const next = safeNextPath(url.searchParams.get("next"));
  const referralCode = url.searchParams.get("ref")?.trim().slice(0, 64) || null;

  // CSRF state: a random token we hand to Google and stash in an httpOnly
  // cookie. On callback we require the two to match before trusting the code.
  const state = generateRawToken();
  const statePayload = JSON.stringify({ state, next, ref: referralCode });

  const res = NextResponse.redirect(buildGoogleAuthUrl(state));
  res.cookies.set(GOOGLE_STATE_COOKIE, statePayload, {
    ...sessionCookieBase(),
    // Short-lived — the round-trip to Google's consent screen is quick.
    maxAge: 60 * 10,
  });
  return res;
}
