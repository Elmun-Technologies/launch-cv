import crypto from "node:crypto";
import { authSecretKey } from "@/lib/auth-token";

/**
 * Unsubscribe links in marketing email: `?u=<userId>&t=<token>`, where the
 * token is HMAC-SHA256(userId) keyed with AUTH_SECRET. No expiry, so a link in
 * an old email keeps working. Server-only (node:crypto).
 */

export function unsubscribeToken(userId: string, key: Uint8Array = authSecretKey()): string {
  return crypto.createHmac("sha256", key).update(userId).digest("base64url");
}

/** Timing-safe check of a token from a link. */
export function verifyUnsubscribeToken(userId: string | null | undefined, token: string | null | undefined, key: Uint8Array = authSecretKey()): boolean {
  if (!userId || !token || userId.length > 64 || token.length > 128) return false;
  const expected = Buffer.from(unsubscribeToken(userId, key));
  const got = Buffer.from(token);
  return got.length === expected.length && crypto.timingSafeEqual(got, expected);
}

export function unsubscribeUrl(base: string, userId: string, key?: Uint8Array): string {
  return `${base.replace(/\/$/, "")}/api/email/unsubscribe?u=${encodeURIComponent(userId)}&t=${unsubscribeToken(userId, key)}`;
}
