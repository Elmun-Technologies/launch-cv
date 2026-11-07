import { randomBytes, randomInt, scrypt, timingSafeEqual } from "node:crypto";
import { prisma } from "@/lib/prisma";

/**
 * One-time two-factor recovery codes for staff (lost phone).
 *
 * 10 codes like "k7m2q-x9tfa" are generated when 2FA is turned on (and on
 * "Regenerate"), shown once, and stored only as scrypt hashes. All of a
 * user's codes share one salt, so checking an entry costs one scrypt run.
 * A code is spent atomically: two requests racing with the same code can't
 * both succeed.
 */

export const RECOVERY_CODE_COUNT = 10;
const ALPHABET = "abcdefghjkmnpqrstuvwxyz23456789"; // no 0/o, 1/l/i
const SCRYPT = { N: 1 << 14, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

function scryptHex(code: string, salt: string): Promise<string> {
  return new Promise((resolve, reject) =>
    scrypt(code, salt, 32, SCRYPT, (err, key) => (err ? reject(err) : resolve(key.toString("hex")))),
  );
}

function newCode(): string {
  let s = "";
  for (let i = 0; i < 10; i++) s += ALPHABET[randomInt(ALPHABET.length)];
  return `${s.slice(0, 5)}-${s.slice(5)}`;
}

/** Lowercase, drop spaces and dashes. */
export function normalizeRecoveryCode(input: string): string {
  return input.toLowerCase().replace(/[\s-]/g, "");
}

/** Looks like a recovery code rather than a 6-digit authenticator code. */
export function isRecoveryCodeShape(input: string): boolean {
  const n = normalizeRecoveryCode(input);
  return n.length === 10 && [...n].every((c) => ALPHABET.includes(c));
}

/** Replace a user's codes with 10 new ones. Returns the plain codes — show them once, never store them. */
export async function generateRecoveryCodes(userId: string): Promise<string[]> {
  const salt = randomBytes(16).toString("hex");
  const codes = Array.from({ length: RECOVERY_CODE_COUNT }, newCode);
  const hashes = await Promise.all(codes.map((c) => scryptHex(normalizeRecoveryCode(c), salt)));
  await prisma.$transaction([
    prisma.adminRecoveryCode.deleteMany({ where: { userId } }),
    prisma.adminRecoveryCode.createMany({ data: hashes.map((hash) => ({ userId, hash, salt })) }),
  ]);
  return codes;
}

export async function clearRecoveryCodes(userId: string) {
  await prisma.adminRecoveryCode.deleteMany({ where: { userId } });
}

export async function remainingRecoveryCodes(userId: string): Promise<number> {
  return prisma.adminRecoveryCode.count({ where: { userId, usedAt: null } });
}

/**
 * Spend a recovery code. Returns the number of codes left on success, or null
 * when the code is wrong or already used.
 */
export async function consumeRecoveryCode(userId: string, input: string): Promise<number | null> {
  if (!isRecoveryCodeShape(input)) return null;
  const rows = await prisma.adminRecoveryCode.findMany({ where: { userId, usedAt: null }, select: { id: true, hash: true, salt: true } });
  if (!rows.length) return null;
  const code = normalizeRecoveryCode(input);
  const bySalt = new Map<string, string>();
  let match: string | null = null;
  for (const r of rows) {
    let h = bySalt.get(r.salt);
    if (!h) {
      h = await scryptHex(code, r.salt);
      bySalt.set(r.salt, h);
    }
    const a = Buffer.from(h, "hex");
    const b = Buffer.from(r.hash, "hex");
    if (a.length === b.length && timingSafeEqual(a, b) && !match) match = r.id;
  }
  if (!match) return null;
  const spent = await prisma.adminRecoveryCode.updateMany({ where: { id: match, usedAt: null }, data: { usedAt: new Date() } });
  if (spent.count !== 1) return null;
  return remainingRecoveryCodes(userId);
}

/**
 * True while the "5 wrong codes → 15 minutes" lock is active (bucket
 * `admin2fa-fail:<user>`, filled by the verify and re-auth routes). Checked
 * before any code — TOTP or recovery — so a lock can't be guessed through.
 */
export async function admin2faLocked(userId: string): Promise<boolean> {
  try {
    const b = await prisma.rateLimitBucket.findUnique({ where: { key: `admin2fa-fail:${userId}` } });
    return !!b && b.resetAt > new Date() && b.count >= 5;
  } catch {
    return false;
  }
}
