import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, sessionCookieBase, signSessionToken } from "@/lib/auth-token";
import { emptyResumeContent } from "@/types/resume";
import { trackEvent } from "@/lib/analytics";
import { isAdminUser } from "@/lib/admin-guard";
import { INTERNAL_TRAFFIC_KEY } from "@/lib/analytics-enabled";
import {
  GOOGLE_STATE_COOKIE,
  fetchGoogleProfile,
  isGoogleOAuthConfigured,
} from "@/lib/google-oauth";

/** Only same-origin paths are safe to redirect a user to after login. */
function safeNextPath(value: string | null | undefined): string | null {
  if (!value) return null;
  if (value.length > 512) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  if (value.includes("://")) return null;
  return value;
}

type StatePayload = { state: string; next: string | null; ref: string | null };

function parseStateCookie(raw: string | undefined): StatePayload | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as StatePayload;
    if (typeof parsed?.state !== "string") return null;
    return parsed;
  } catch {
    return null;
  }
}

/** Redirect back to the login page with an error code the UI can surface. */
function fail(req: Request, code: string): NextResponse {
  const res = NextResponse.redirect(new URL(`/login?error=${code}`, req.url));
  // Clear the one-time state cookie regardless of outcome.
  res.cookies.set(GOOGLE_STATE_COOKIE, "", { ...sessionCookieBase(), maxAge: 0 });
  return res;
}

async function creditReferral(referralCode: string, userId: string, email: string) {
  const normalizedCode = referralCode.toLowerCase();
  const matched = await prisma.referral.findFirst({
    where: { code: normalizedCode, status: "pending", referredEmail: null },
    select: { id: true, userId: true },
  });
  if (!matched || matched.userId === userId) return;
  const registeredCount = await prisma.referral.count({
    where: {
      userId: matched.userId,
      referredEmail: { not: null },
      status: { in: ["registered", "credited"] },
    },
  });
  const shouldCredit = (registeredCount + 1) % 5 === 0;
  await prisma.referral.update({
    where: { id: matched.id },
    data: {
      referredEmail: email,
      status: shouldCredit ? "credited" : "registered",
      creditAmount: shouldCredit ? 9 : 0,
    },
  });
}

export async function GET(req: Request) {
  if (!isGoogleOAuthConfigured()) {
    return fail(req, "google_unavailable");
  }

  const url = new URL(req.url);

  // Google reports user-declined consent or config problems via `error`.
  if (url.searchParams.get("error")) {
    return fail(req, "google_denied");
  }

  const code = url.searchParams.get("code");
  const stateParam = url.searchParams.get("state");
  const jar = await cookies();
  const stateCookie = parseStateCookie(jar.get(GOOGLE_STATE_COOKIE)?.value);

  if (!code || !stateParam || !stateCookie || stateParam !== stateCookie.state) {
    return fail(req, "google_state");
  }

  let profile;
  try {
    profile = await fetchGoogleProfile(code);
  } catch (err) {
    console.error("[google callback] profile error:", err instanceof Error ? err.message : err);
    return fail(req, "google_profile");
  }

  // Google only lets us trust the email when it is verified on their side.
  if (!profile.emailVerified) {
    return fail(req, "google_unverified_email");
  }

  let userId: string;
  let userEmail: string;
  let userRole: string;
  let isNewUser = false;

  try {
    // 1. Returning Google user — matched by the stable subject id.
    let user = await prisma.user.findUnique({ where: { googleId: profile.sub } });

    // 2. Existing email/password account — link Google to it so the user can
    //    use either method from now on.
    if (!user) {
      const byEmail = await prisma.user.findUnique({ where: { email: profile.email } });
      if (byEmail) {
        user = await prisma.user.update({
          where: { id: byEmail.id },
          data: {
            googleId: profile.sub,
            emailVerifiedAt: byEmail.emailVerifiedAt ?? new Date(),
            name: byEmail.name ?? profile.name,
          },
        });
        await trackEvent("google_account_linked", { userId: user.id });
      }
    }

    // 3. Brand-new user — create the account (no password) and seed a resume.
    if (!user) {
      user = await prisma.user.create({
        data: {
          email: profile.email,
          passwordHash: null,
          googleId: profile.sub,
          name: profile.name,
          // Google verified the email, so we can trust it immediately.
          emailVerifiedAt: new Date(),
        },
      });
      isNewUser = true;
      await prisma.resume.create({
        data: {
          userId: user.id,
          title: "My first resume",
          vertical: "software",
          regionMode: "us",
          content: emptyResumeContent() as object,
        },
      });
      if (stateCookie.ref) {
        await creditReferral(stateCookie.ref, user.id, user.email).catch(() => undefined);
      }
      await trackEvent("signup", { userId: user.id, meta: { provider: "google" } });
    }

    userId = user.id;
    userEmail = user.email;
    userRole = user.role;
  } catch (err) {
    console.error("[google callback] db error:", err instanceof Error ? err.message : err);
    return fail(req, "google_server");
  }

  let token: string;
  try {
    token = await signSessionToken({ sub: userId, email: userEmail });
  } catch {
    return fail(req, "google_server");
  }

  await trackEvent(isNewUser ? "google_signup_success" : "login_success", { userId });

  const admin = isAdminUser({ role: userRole, email: userEmail });
  const next = safeNextPath(stateCookie.next);
  const destination = next || (admin ? "/admin-panel" : "/dashboard");

  const res = NextResponse.redirect(new URL(destination, req.url));
  const cookieBase = sessionCookieBase();
  res.cookies.set(COOKIE_NAME, token, { ...cookieBase, maxAge: 60 * 60 * 24 * 14 });
  res.cookies.set(INTERNAL_TRAFFIC_KEY, admin ? "1" : "", {
    ...cookieBase,
    httpOnly: false,
    maxAge: admin ? 60 * 60 * 24 * 180 : 0,
  });
  // Consume the one-time state cookie.
  res.cookies.set(GOOGLE_STATE_COOKIE, "", { ...cookieBase, maxAge: 0 });
  return res;
}
