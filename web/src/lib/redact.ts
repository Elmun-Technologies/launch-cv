/**
 * Strips secrets from anything about to be logged or written to the audit log
 * (audit diffs, error objects, request bodies). It is a safety net: callers
 * should still log field names, not values, wherever they can.
 *
 * - Object keys that name a credential (apiKey, secret, token, password …)
 *   have their value replaced with "[redacted]".
 * - String values that look like a provider key (sk-…, re_…, polar_…, Bearer …)
 *   are replaced wherever they appear, including inside error messages.
 */

const SECRET_KEY = /(secret|token|password|passwd|api[-_]?key|apikey|ciphertext|authorization|cookie|totp|private[-_]?key|credential)/i;

/** Field names that look like secrets but only ever hold labels or flags. */
const SAFE_KEYS = new Set(["fields", "changed", "tested", "skippedTest", "testOk", "testedAt", "testMs", "testError", "secretBoxReady", "hasPassword", "hasTotp"]);

const SECRET_VALUE =
  /\b(?:sk-[A-Za-z0-9_-]{8,}|sk_(?:live|test)_[A-Za-z0-9]{8,}|re_[A-Za-z0-9_]{8,}|polar_[A-Za-z0-9_]{8,}|whsec_[A-Za-z0-9+/=_-]{8,}|phx_[A-Za-z0-9]{8,}|gh[pousr]_[A-Za-z0-9]{16,}|xox[abpr]-[A-Za-z0-9-]{10,}|AIza[0-9A-Za-z_-]{20,}|GOCSPX-[A-Za-z0-9_-]{10,}|v1:[A-Za-z0-9+/=]{8,}:[A-Za-z0-9+/=]{8,}:[A-Za-z0-9+/=]*)/g;
const BEARER = /\b(Bearer|Basic)\s+[A-Za-z0-9._~+/=-]{8,}/gi;

export const REDACTED = "[redacted]";

/** Redact secret-looking substrings in a string. */
export function redactString(s: string): string {
  return s.replace(BEARER, "$1 " + REDACTED).replace(SECRET_VALUE, REDACTED);
}

/** Deep copy of `value` with secrets removed. Safe on cycles, errors and odd types. */
export function redact<T>(value: T): T {
  return walk(value, new WeakSet(), 0) as T;
}

function walk(v: unknown, seen: WeakSet<object>, depth: number): unknown {
  if (typeof v === "string") return redactString(v);
  if (v === null || typeof v !== "object") return v;
  if (depth > 8) return "[…]";
  if (seen.has(v)) return "[circular]";
  seen.add(v);
  if (v instanceof Date) return v;
  if (v instanceof Error) {
    return { name: v.name, message: redactString(v.message), ...(v.cause !== undefined ? { cause: walk(v.cause, seen, depth + 1) } : {}) };
  }
  if (Array.isArray(v)) return v.map((x) => walk(x, seen, depth + 1));
  const out: Record<string, unknown> = {};
  for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
    out[k] = SECRET_KEY.test(k) && !SAFE_KEYS.has(k) && x !== null && x !== undefined && typeof x !== "boolean" ? REDACTED : walk(x, seen, depth + 1);
  }
  return out;
}

/** console.error with every argument passed through redact(). */
export function logError(label: string, ...args: unknown[]) {
  console.error(label, ...args.map((a) => redact(a)));
}
