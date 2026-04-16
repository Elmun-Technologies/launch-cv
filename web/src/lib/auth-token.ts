import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "launchcv_session";

const DEV_FALLBACK_SECRET = "dev-secret-change-me-in-production-32chars!!";

function getSecret() {
  const raw = process.env.AUTH_SECRET;
  const trimmed = typeof raw === "string" ? raw.trim() : "";
  /** An empty `AUTH_SECRET=` in .env still counts as set — `??` won't help. */
  const fromEnv = trimmed.length >= 16 ? trimmed : "";
  const s =
    fromEnv ||
    (process.env.NODE_ENV === "development" ? DEV_FALLBACK_SECRET : "");
  if (!s || s.length < 16) {
    throw new Error("AUTH_SECRET is required (min 16 characters)");
  }
  return new TextEncoder().encode(s);
}

export type SessionPayload = { sub: string; email: string };

export async function signSessionToken(payload: SessionPayload) {
  return new SignJWT({ email: payload.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime("14d")
    .sign(getSecret());
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    const sub = typeof payload.sub === "string" ? payload.sub : null;
    const email = typeof payload.email === "string" ? payload.email : null;
    if (!sub || !email) return null;
    return { sub, email };
  } catch {
    return null;
  }
}

/**
 * Common session cookie settings.
 * `secure: true` only works over HTTPS — if you open production via `http://`
 * (e.g. `next start` locally) the browser won't store the cookie and login "won't work".
 * `.env`: `NEXT_PUBLIC_APP_URL=https://...` or `COOKIE_SECURE=false`.
 */
export function sessionCookieBase(): {
  httpOnly: true;
  sameSite: "lax";
  secure: boolean;
  path: string;
} {
  const explicit = process.env.COOKIE_SECURE;
  if (explicit === "true") {
    return { httpOnly: true, sameSite: "lax", secure: true, path: "/" };
  }
  if (explicit === "false") {
    return { httpOnly: true, sameSite: "lax", secure: false, path: "/" };
  }

  if (process.env.NODE_ENV !== "production") {
    return { httpOnly: true, sameSite: "lax", secure: false, path: "/" };
  }

  const base = String(process.env.NEXT_PUBLIC_APP_URL ?? "")
    .trim()
    .toLowerCase();
  const secure = base.startsWith("https://");
  return { httpOnly: true, sameSite: "lax", secure, path: "/" };
}

export { COOKIE_NAME };
