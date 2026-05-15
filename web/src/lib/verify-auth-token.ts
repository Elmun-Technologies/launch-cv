import { prisma } from "@/lib/prisma";
import { hashToken } from "@/lib/token-crypto";

export type AuthTokenType = "password_reset" | "email_verify";

export type VerifiedAuthToken = {
  id: string;
  userId: string;
};

/** Look up and validate a single-use auth token. Returns the row when the
 *  token exists, is the expected type, has not been consumed, and is still
 *  inside its TTL window. Otherwise returns null so the caller can return
 *  a generic "invalid or expired" error without leaking which check failed. */
export async function verifyAuthToken(
  rawToken: string,
  expectedType: AuthTokenType,
): Promise<VerifiedAuthToken | null> {
  const tokenHash = hashToken(rawToken);
  const row = await prisma.authToken.findUnique({ where: { tokenHash } });
  if (!row) return null;
  if (row.type !== expectedType) return null;
  if (row.usedAt) return null;
  if (row.expiresAt <= new Date()) return null;
  return { id: row.id, userId: row.userId };
}
