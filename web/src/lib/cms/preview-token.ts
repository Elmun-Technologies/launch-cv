import crypto from "node:crypto";

const SECRET = process.env.AUTH_SECRET ?? "dev-fallback-do-not-use-in-prod";
const DEFAULT_TTL_SECONDS = 60 * 60; // 1 hour

/**
 * Signs a token for previewing draft/scheduled content.
 * Format: <slug>.<expEpochSeconds>.<hmacBase64Url>
 * - Stored client-side as a URL query string param (`?preview=…`).
 * - Stateless: no DB record; HMAC keeps it tamper-resistant.
 */
export function signPreviewToken(slug: string, ttlSeconds = DEFAULT_TTL_SECONDS): string {
  const exp = Math.floor(Date.now() / 1000) + ttlSeconds;
  const body = `${slug}.${exp}`;
  const sig = crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
  return `${body}.${sig}`;
}

/** Verifies a preview token for a given slug. Returns true if valid + unexpired. */
export function verifyPreviewToken(slug: string, token: string | null | undefined): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 3) return false;
  const [tokSlug, expStr, sig] = parts;
  if (tokSlug !== slug) return false;

  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return false;

  const expected = crypto.createHmac("sha256", SECRET).update(`${tokSlug}.${expStr}`).digest("base64url");
  try {
    return crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected));
  } catch {
    return false;
  }
}
