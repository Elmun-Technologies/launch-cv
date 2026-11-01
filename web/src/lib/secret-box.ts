import { createCipheriv, createDecipheriv, createHash, randomBytes } from "node:crypto";

/**
 * Authenticated encryption for credentials stored in the database
 * (API keys entered in the admin panel, staff TOTP secrets).
 *
 * The master key comes from KEY_ENCRYPTION_KEY, which lives only in the
 * hosting environment — never in the database next to the data it protects.
 * Any string works; it is stretched to 32 bytes with SHA-256. Use at least
 * 32 random characters (e.g. `openssl rand -base64 48`).
 *
 * Format: "v1:<iv b64>:<tag b64>:<ciphertext b64>" (AES-256-GCM, 12-byte IV).
 */

const VERSION = "v1";

function masterKey(): Buffer | null {
  const raw = process.env.KEY_ENCRYPTION_KEY?.trim();
  if (!raw || raw.length < 32) return null;
  return createHash("sha256").update(raw, "utf8").digest();
}

export function secretBoxReady(): boolean {
  return masterKey() !== null;
}

export class SecretBoxError extends Error {}

export function seal(plaintext: string): string {
  const key = masterKey();
  if (!key) throw new SecretBoxError("KEY_ENCRYPTION_KEY is not set (min 32 characters)");
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", key, iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [VERSION, iv.toString("base64"), tag.toString("base64"), enc.toString("base64")].join(":");
}

export function open(sealed: string): string {
  const key = masterKey();
  if (!key) throw new SecretBoxError("KEY_ENCRYPTION_KEY is not set (min 32 characters)");
  const [v, ivB64, tagB64, encB64] = sealed.split(":");
  if (v !== VERSION || !ivB64 || !tagB64 || encB64 === undefined) {
    throw new SecretBoxError("Unrecognized secret format");
  }
  const decipher = createDecipheriv("aes-256-gcm", key, Buffer.from(ivB64, "base64"));
  decipher.setAuthTag(Buffer.from(tagB64, "base64"));
  return Buffer.concat([decipher.update(Buffer.from(encB64, "base64")), decipher.final()]).toString("utf8");
}

/** Last four characters for display, e.g. "a91f". Short values show nothing. */
export function lastFour(value: string): string {
  const v = value.trim();
  return v.length >= 8 ? v.slice(-4) : "";
}
