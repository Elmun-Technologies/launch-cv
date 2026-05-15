import bcrypt from "bcryptjs";

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

/** Fixed-cost dummy compare. Use when an account doesn't exist so the
 *  request still spends bcrypt work and attackers can't enumerate emails
 *  via timing. The hash is for the literal string "invalid". */
const DUMMY_HASH = "$2a$12$C6UzMDM.H6dfI/f/IKxGhuQjz0bvW3qWWv0kS3o9j5Pj9CPgKQ7iy";

export async function verifyPasswordTimingSafe(plain: string, hash: string | null | undefined) {
  if (!hash) {
    await bcrypt.compare(plain, DUMMY_HASH);
    return false;
  }
  return bcrypt.compare(plain, hash);
}
