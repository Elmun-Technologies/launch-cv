/**
 * Pure rules for whether an AI call may run — no server imports, so they can be
 * unit-tested and shared with client components (codes and copy).
 */

/** `code` in the JSON body when a free account must confirm its email first. */
export const EMAIL_UNVERIFIED_CODE = "EMAIL_UNVERIFIED" as const;
/** `code` in the JSON body when the monthly AI limit is used up. */
export const USAGE_LIMIT_CODE = "USAGE_LIMIT" as const;

export const VERIFY_EMAIL_MESSAGE =
  "Confirm your email to use your free AI checks. We sent a link when you signed up; you can send it again here or from Settings.";

export type UsageBlock = "email_unverified" | "limit" | null;

/**
 * Why an AI call is refused, or null when it may run.
 * - A free account (no paid or staff-granted plan) must have a confirmed email before
 *   any free AI call, so throwaway sign-ups can't farm the free allowance.
 * - Paid users are never blocked by email confirmation.
 * - Everyone is blocked once this month's limit for the tool is used up.
 */
export function usageBlock(args: { paid: boolean; emailVerified: boolean; used: number; max: number }): UsageBlock {
  if (!args.paid && !args.emailVerified) return "email_unverified";
  if (args.used >= args.max) return "limit";
  return null;
}
