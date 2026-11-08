/**
 * Pure helpers for Admin → Discounts (Polar discount codes): input validation,
 * the Polar request body, display labels and error text. No server imports, so
 * the admin form can share the same rules and they can be self-checked
 * (see polar-discounts.check.ts).
 */

import { CHECKOUT_PLAN_ORDER, isPublicPlan, type CheckoutPlan } from "@/lib/plan-config";

/** Codes are stored upper-case: A–Z and 0–9, 3 to 32 characters. */
export const DISCOUNT_CODE_RE = /^[A-Z0-9]{3,32}$/;

export function normalizeDiscountCode(raw: string): string {
  return raw.trim().toUpperCase();
}

export function isValidDiscountCode(code: string): boolean {
  return DISCOUNT_CODE_RE.test(code);
}

/** A discount as Polar returns it (only the fields the panel reads). */
export type PolarDiscount = {
  id: string;
  name: string;
  code: string | null;
  type: "percentage" | "fixed";
  basis_points?: number | null;
  amount?: number | null;
  currency?: string | null;
  duration: "once" | "forever" | "repeating";
  duration_in_months?: number | null;
  max_redemptions: number | null;
  redemptions_count: number;
  starts_at: string | null;
  ends_at: string | null;
  products: { id: string }[];
};

/** What the admin form sends. */
export type DiscountInput = {
  code: string;
  kind: "percentage" | "fixed";
  /** 1–100, up to two decimals (Polar stores basis points). */
  percent?: number | null;
  /** US dollars, at least $0.01 (Polar stores cents). */
  amountUsd?: number | null;
  duration: "once" | "forever";
  /** Empty for no limit. */
  maxRedemptions?: number | null;
  /** Last day the code works (UTC, inclusive), "YYYY-MM-DD"; empty for no expiry. */
  endsOn?: string | null;
  plans: string[];
};

export type PolarDiscountBody = {
  name: string;
  code: string;
  type: "percentage" | "fixed";
  basis_points?: number;
  amount?: number;
  currency?: "usd";
  duration: "once" | "forever";
  max_redemptions?: number;
  ends_at?: string;
  products: string[];
};

/** Upper bound for a fixed discount, well above any plan price; Polar checks it against the product too. */
export const MAX_FIXED_USD = 1000;

/**
 * Validate the admin form and build the Polar POST body. `productIds` maps each
 * sold plan to its Polar product id (plans without one can't be selected).
 */
export function buildDiscountBody(
  input: DiscountInput,
  productIds: Partial<Record<CheckoutPlan, string>>,
  now = Date.now(),
): { ok: true; body: PolarDiscountBody } | { ok: false; error: string } {
  const code = normalizeDiscountCode(input.code ?? "");
  if (!isValidDiscountCode(code)) return { ok: false, error: "The code must be 3–32 characters: letters A–Z and digits 0–9." };

  const plans = [...new Set(input.plans ?? [])];
  if (!plans.length) return { ok: false, error: "Pick at least one plan." };
  const bad = plans.find((p) => !isPublicPlan(p));
  if (bad) return { ok: false, error: `Unknown plan "${bad}".` };
  const products: string[] = [];
  for (const p of CHECKOUT_PLAN_ORDER) {
    if (!plans.includes(p)) continue;
    const id = productIds[p];
    if (!id) return { ok: false, error: `No Polar product is set for ${p}. Set it in Integrations → Polar.` };
    products.push(id);
  }

  if (input.duration !== "once" && input.duration !== "forever") return { ok: false, error: "Duration must be once or forever." };

  const body: PolarDiscountBody = { name: code, code, type: input.kind, duration: input.duration, products };

  if (input.kind === "percentage") {
    const p = Number(input.percent);
    if (!Number.isFinite(p) || p < 1 || p > 100) return { ok: false, error: "Percent off must be between 1 and 100." };
    body.basis_points = Math.round(p * 100);
  } else if (input.kind === "fixed") {
    const usd = Number(input.amountUsd);
    if (!Number.isFinite(usd) || usd < 0.01 || usd > MAX_FIXED_USD) return { ok: false, error: `Amount off must be between $0.01 and $${MAX_FIXED_USD}.` };
    body.amount = Math.round(usd * 100);
    body.currency = "usd";
  } else {
    return { ok: false, error: "Pick percent off or a fixed amount." };
  }

  if (input.maxRedemptions !== null && input.maxRedemptions !== undefined) {
    const m = Number(input.maxRedemptions);
    if (!Number.isInteger(m) || m < 1 || m > 1_000_000) return { ok: false, error: "Max redemptions must be a whole number of at least 1, or empty." };
    body.max_redemptions = m;
  }

  if (input.endsOn) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.endsOn)) return { ok: false, error: "Use a valid expiry date." };
    const end = new Date(`${input.endsOn}T23:59:59Z`);
    if (Number.isNaN(end.getTime()) || end.toISOString().slice(0, 10) !== input.endsOn) return { ok: false, error: "Use a valid expiry date." };
    if (end.getTime() <= now) return { ok: false, error: "The expiry date must be in the future." };
    body.ends_at = end.toISOString();
  }

  return { ok: true, body };
}

/** "90% off", "$5 off", "$4.50 off". */
export function discountValueLabel(d: Pick<PolarDiscount, "type" | "basis_points" | "amount" | "currency">): string {
  if (d.type === "percentage") {
    const pct = (d.basis_points ?? 0) / 100;
    return `${Number.isInteger(pct) ? pct : pct.toFixed(2)}% off`;
  }
  const cents = d.amount ?? 0;
  const cur = (d.currency ?? "usd").toLowerCase();
  const value = cents % 100 === 0 ? String(cents / 100) : (cents / 100).toFixed(2);
  return cur === "usd" ? `$${value} off` : `${value} ${cur.toUpperCase()} off`;
}

/** "Once", "Forever", "3 months". */
export function discountDurationLabel(d: Pick<PolarDiscount, "duration" | "duration_in_months">): string {
  if (d.duration === "once") return "Once";
  if (d.duration === "forever") return "Forever";
  const m = d.duration_in_months ?? 0;
  return `${m} month${m === 1 ? "" : "s"}`;
}

/** "2 / 3", "5 / ∞". */
export function redemptionsLabel(d: Pick<PolarDiscount, "redemptions_count" | "max_redemptions">): string {
  return `${(d.redemptions_count ?? 0).toLocaleString("en-US")} / ${d.max_redemptions == null ? "∞" : d.max_redemptions.toLocaleString("en-US")}`;
}

/**
 * Plan names a discount applies to. `planOf` resolves a Polar product id to a
 * plan (lib/polar.ts planIdFromPolarProductId, pre-resolved by the caller).
 * Polar treats an empty product list as "every product".
 */
export function discountPlanNames(
  products: { id: string }[] | null | undefined,
  planOf: (productId: string) => CheckoutPlan | null,
  titleOf: (plan: CheckoutPlan) => string,
): string[] {
  if (!products?.length) return ["All products"];
  return products.map((p) => {
    const plan = planOf(p.id);
    return plan ? titleOf(plan) : `Other product (${p.id.slice(0, 8)}…)`;
  });
}

/** Human message from a Polar error body ({ detail: string | [{ msg }] } or { error }). */
export function polarErrorMessage(json: unknown, fallback: string): string {
  if (!json || typeof json !== "object") return fallback;
  const j = json as { detail?: unknown; error?: unknown };
  const detail = j.detail;
  if (typeof detail === "string" && detail.trim()) return detail;
  if (Array.isArray(detail)) {
    const msgs = detail
      .map((d) => {
        if (!d || typeof d !== "object") return null;
        const msg = (d as { msg?: unknown }).msg;
        const loc = (d as { loc?: unknown }).loc;
        if (typeof msg !== "string") return null;
        const field = Array.isArray(loc) ? loc.filter((x) => typeof x === "string" && x !== "body").join(".") : "";
        return field ? `${field}: ${msg}` : msg;
      })
      .filter((x): x is string => !!x);
    if (msgs.length) return msgs.join("; ");
  }
  if (typeof j.error === "string" && j.error.trim()) return j.error;
  return fallback;
}

/** Polar resource ids are UUIDs; refuse anything else before it reaches a URL. */
export function isPolarId(id: string): boolean {
  return /^[A-Za-z0-9-]{8,64}$/.test(id);
}
