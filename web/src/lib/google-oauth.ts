import { appBaseUrl } from "@/lib/email";
import { getIntegrationValue } from "@/lib/integrations";

/**
 * Lightweight Google OAuth 2.0 helper (Authorization Code flow).
 *
 * We deliberately avoid a heavy auth framework: the app already issues its own
 * JWT session cookie, so Google is only used to *identify* the user. The flow is:
 *   1. /api/auth/google/start   → redirect to Google with a CSRF `state`
 *   2. Google redirects back to  /api/auth/google/callback?code=...&state=...
 *   3. We exchange the code for tokens and read the profile from the userinfo
 *      endpoint, then find-or-create the user and set our own session cookie.
 */

const GOOGLE_AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

/** Cookie that carries the CSRF `state` + post-login intent across the redirect. */
export const GOOGLE_STATE_COOKIE = "google_oauth_state";

/** Client ID and secret come from Admin → Integrations → Google sign-in (env as fallback). */
export async function googleClientId(): Promise<string> {
  return getIntegrationValue("google", "clientId");
}

async function googleClientSecret(): Promise<string> {
  return getIntegrationValue("google", "clientSecret");
}

/** True when both the client id and secret are configured. Used to hide the
 *  "Continue with Google" button when the deployment hasn't set up OAuth. */
export async function isGoogleOAuthConfigured(): Promise<boolean> {
  return (await googleClientId()).length > 0 && (await googleClientSecret()).length > 0;
}

/** The redirect URI Google calls back to. Must match a URI registered in the
 *  Google Cloud console's OAuth client exactly. */
export async function googleRedirectUri(): Promise<string> {
  const override = await getIntegrationValue("google", "redirectUri");
  if (override) return override;
  return `${appBaseUrl()}/api/auth/google/callback`;
}

/** Build the Google consent-screen URL for a given CSRF `state`. */
export async function buildGoogleAuthUrl(state: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: await googleClientId(),
    redirect_uri: await googleRedirectUri(),
    response_type: "code",
    scope: "openid email profile",
    state,
    access_type: "online",
    include_granted_scopes: "true",
    prompt: "select_account",
  });
  return `${GOOGLE_AUTH_URL}?${params.toString()}`;
}

type GoogleTokenResponse = {
  access_token?: string;
  id_token?: string;
  error?: string;
  error_description?: string;
};

/** Exchange an authorization `code` for an access token. */
async function exchangeCode(code: string): Promise<string> {
  const body = new URLSearchParams({
    code,
    client_id: await googleClientId(),
    client_secret: await googleClientSecret(),
    redirect_uri: await googleRedirectUri(),
    grant_type: "authorization_code",
  });
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    cache: "no-store",
  });
  const json = (await res.json().catch(() => ({}))) as GoogleTokenResponse;
  if (!res.ok || !json.access_token) {
    throw new Error(json.error_description || json.error || "Google token exchange failed");
  }
  return json.access_token;
}

export type GoogleProfile = {
  sub: string;
  email: string;
  emailVerified: boolean;
  name: string | null;
  picture: string | null;
};

type GoogleUserInfo = {
  sub?: string;
  email?: string;
  email_verified?: boolean | string;
  name?: string;
  picture?: string;
};

/** Complete the flow: exchange the code and fetch the user's Google profile. */
export async function fetchGoogleProfile(code: string): Promise<GoogleProfile> {
  const accessToken = await exchangeCode(code);
  const res = await fetch(GOOGLE_USERINFO_URL, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error("Failed to load Google profile");
  }
  const info = (await res.json()) as GoogleUserInfo;
  if (!info.sub || !info.email) {
    throw new Error("Google profile missing required fields");
  }
  return {
    sub: info.sub,
    email: info.email.trim().toLowerCase(),
    // Google may serialise the boolean as the string "true".
    emailVerified: info.email_verified === true || info.email_verified === "true",
    name: info.name?.trim() || null,
    picture: info.picture || null,
  };
}
