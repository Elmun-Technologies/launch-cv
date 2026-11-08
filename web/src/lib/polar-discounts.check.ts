/** Self-checks for lib/polar-discounts.ts, lib/checkout-embed.ts and lib/pricing-faqs.ts. Run: npx tsx src/lib/polar-discounts.check.ts */
import {
  buildDiscountBody,
  discountDurationLabel,
  discountPlanNames,
  discountValueLabel,
  isPolarId,
  isValidDiscountCode,
  normalizeDiscountCode,
  polarErrorMessage,
  redemptionsLabel,
  type DiscountInput,
} from "@/lib/polar-discounts";
import { CHECKOUT_SUCCESS_PATH, checkoutAuthHrefs, isPolarCheckoutUrl, successRedirect } from "@/lib/checkout-embed";
import { buildPricingFaqs, checkoutFaqs } from "@/lib/pricing-faqs";
import { FREE_LIMITS, PLAN_MONTHLY_LIMITS, type CheckoutPlan } from "@/lib/plan-config";
import { PUBLIC_PLANS } from "@/lib/monetization";

const failures: string[] = [];
let count = 0;
function expect(ok: boolean, what: string) {
  count += 1;
  if (!ok) failures.push(what);
}

/* ── Codes ── */
expect(normalizeDiscountCode("  ownertest90 ") === "OWNERTEST90", "codes are trimmed and upper-cased");
for (const ok of ["ABC", "OWNERTEST90", "A".repeat(32), "123"]) expect(isValidDiscountCode(ok), `valid code ${ok}`);
for (const bad of ["AB", "A".repeat(33), "SPRING-20", "spring20", "SPRING 20", "", "ÄBC"]) expect(!isValidDiscountCode(bad), `invalid code ${JSON.stringify(bad)}`);

/* ── Request body ── */
const ids: Partial<Record<CheckoutPlan, string>> = { week: "pid-week", professional: "pid-pro", quarter: "pid-quarter" };
const base: DiscountInput = { code: "ownertest90", kind: "percentage", percent: 90, duration: "once", maxRedemptions: 3, plans: ["week", "quarter"] };
const NOW = Date.UTC(2026, 10, 8);

const ownerTest = buildDiscountBody(base, ids, NOW);
expect(ownerTest.ok, "the production OWNERTEST90 shape builds");
if (ownerTest.ok) {
  // Same body the owner sent by hand: name, code, type, basis_points, duration, max_redemptions, products.
  expect(
    JSON.stringify(ownerTest.body) ===
      JSON.stringify({ name: "OWNERTEST90", code: "OWNERTEST90", type: "percentage", duration: "once", products: ["pid-week", "pid-quarter"], basis_points: 9000, max_redemptions: 3 }),
    `OWNERTEST90 body matches the hand-made one: ${JSON.stringify(ownerTest.body)}`,
  );
}

const fixed = buildDiscountBody({ ...base, kind: "fixed", percent: null, amountUsd: 4.5, maxRedemptions: null, duration: "forever", plans: ["professional"] }, ids, NOW);
expect(fixed.ok && fixed.body.amount === 450 && fixed.body.currency === "usd" && fixed.body.basis_points === undefined, "fixed $4.50 → 450 cents usd");
expect(fixed.ok && fixed.body.max_redemptions === undefined && fixed.body.duration === "forever", "no max redemptions → omitted");
expect(fixed.ok && fixed.body.products.join() === "pid-pro", "plans map to their product ids");

const ordered = buildDiscountBody({ ...base, plans: ["quarter", "week", "week"] }, ids, NOW);
expect(ordered.ok && ordered.body.products.join() === "pid-week,pid-quarter", "products follow plan order, without duplicates");

const ends = buildDiscountBody({ ...base, endsOn: "2026-12-31" }, ids, NOW);
expect(ends.ok && ends.body.ends_at === "2026-12-31T23:59:59.000Z", "expiry is the end of that UTC day");

const rejects: [string, DiscountInput, Partial<Record<CheckoutPlan, string>>?][] = [
  ["short code", { ...base, code: "AB" }],
  ["no plans", { ...base, plans: [] }],
  ["legacy plan", { ...base, plans: ["lifetime"] }],
  ["unknown plan", { ...base, plans: ["gold"] }],
  ["0%", { ...base, percent: 0 }],
  ["101%", { ...base, percent: 101 }],
  ["percent missing", { ...base, percent: null }],
  ["$0", { ...base, kind: "fixed", amountUsd: 0 }],
  ["fixed missing", { ...base, kind: "fixed", amountUsd: null }],
  ["0 redemptions", { ...base, maxRedemptions: 0 }],
  ["1.5 redemptions", { ...base, maxRedemptions: 1.5 }],
  ["past expiry", { ...base, endsOn: "2026-11-07" }],
  ["bad date", { ...base, endsOn: "2026-02-31" }],
  ["bad date format", { ...base, endsOn: "31/12/2026" }],
  ["bad duration", { ...base, duration: "repeating" as "once" }],
  ["plan without product", { ...base, plans: ["week"] }, { professional: "pid-pro" }],
];
for (const [what, input, map] of rejects) expect(!buildDiscountBody(input, map ?? ids, NOW).ok, `rejects ${what}`);
expect(buildDiscountBody({ ...base, percent: 100 }, ids, NOW).ok, "100% is allowed");
expect(buildDiscountBody({ ...base, percent: 12.5 }, ids, NOW).ok, "12.5% is allowed");

/* ── Labels ── */
expect(discountValueLabel({ type: "percentage", basis_points: 9000 }) === "90% off", "90% off");
expect(discountValueLabel({ type: "percentage", basis_points: 1250 }) === "12.50% off", "12.50% off");
expect(discountValueLabel({ type: "fixed", amount: 500, currency: "usd" }) === "$5 off", "$5 off");
expect(discountValueLabel({ type: "fixed", amount: 450, currency: "usd" }) === "$4.50 off", "$4.50 off");
expect(discountValueLabel({ type: "fixed", amount: 500, currency: "eur" }) === "5 EUR off", "other currencies keep their code");
expect(discountDurationLabel({ duration: "once" }) === "Once" && discountDurationLabel({ duration: "repeating", duration_in_months: 3 }) === "3 months", "duration labels");
expect(redemptionsLabel({ redemptions_count: 1, max_redemptions: 3 }) === "1 / 3", "used / max");
expect(redemptionsLabel({ redemptions_count: 0, max_redemptions: null }) === "0 / ∞", "used / unlimited");

/* ── Product id → plan names ── */
const planOf = (id: string): CheckoutPlan | null => ({ "pid-week": "week", "pid-quarter": "quarter" } as Record<string, CheckoutPlan>)[id] ?? null;
const title = (p: CheckoutPlan) => PUBLIC_PLANS[p].title;
expect(discountPlanNames([{ id: "pid-week" }, { id: "pid-quarter" }], planOf, title).join() === "Week Pass,90-Day Pass", "products map to plan titles");
expect(discountPlanNames([], planOf, title).join() === "All products", "no products = every product");
expect(discountPlanNames([{ id: "abcdef123456" }], planOf, title)[0].startsWith("Other product (abcdef12"), "unknown products are labelled, not dropped");

/* ── Polar errors ── */
expect(polarErrorMessage({ detail: "Not found" }, "x") === "Not found", "string detail");
expect(
  polarErrorMessage({ detail: [{ loc: ["body", "code"], msg: "Discount with this code already exists.", type: "value_error" }] }, "x") === "code: Discount with this code already exists.",
  "validation detail keeps the field",
);
expect(polarErrorMessage({ error: "Boom" }, "x") === "Boom", "error field");
expect(polarErrorMessage(null, "fallback") === "fallback", "fallback");
expect(isPolarId("2e23dae2-5d0a-40c2-9b1f-37b8ac0e1629") && !isPolarId("../checkouts") && !isPolarId("a/b"), "discount ids are path-safe");

/* ── Checkout page helpers ── */
const origin = "https://launch-cv.com";
expect(successRedirect(null, origin) === CHECKOUT_SUCCESS_PATH, "no success URL → success screen");
expect(
  successRedirect(`${origin}/dashboard/settings/subscription?checkout=success&checkout_id=abc`, origin) === "/dashboard/settings/subscription?checkout=success&checkout_id=abc",
  "our own success URL is followed unchanged (checkout_id kept)",
);
expect(
  successRedirect("https://www.launch-cv.com/dashboard/settings/subscription?checkout=success&checkout_id=abc", origin) ===
    "https://www.launch-cv.com/dashboard/settings/subscription?checkout=success&checkout_id=abc",
  "the configured app host is followed as-is",
);
expect(successRedirect("https://evil.example/phish", origin) === CHECKOUT_SUCCESS_PATH, "foreign pages are not followed");
expect(successRedirect("javascript:alert(1)", origin) === CHECKOUT_SUCCESS_PATH, "no javascript: URLs");
const hrefs = checkoutAuthHrefs("week");
expect(hrefs.register === "/register?next=%2Fcheckout%2Fweek%3Fstart%3D1" && hrefs.login === "/login?next=%2Fcheckout%2Fweek%3Fstart%3D1", "auth links return to the checkout");
expect(isPolarCheckoutUrl("https://buy.polar.sh/polar_c_123") && isPolarCheckoutUrl("https://sandbox.polar.sh/checkout/x"), "Polar checkout hosts");
expect(!isPolarCheckoutUrl("https://polar.sh.evil.com/x") && !isPolarCheckoutUrl("http://polar.sh/x") && !isPolarCheckoutUrl("nope"), "other hosts are not embedded");

/* ── Checkout FAQs come from the pricing FAQs ── */
const faqs = buildPricingFaqs({ ...PLAN_MONTHLY_LIMITS, free: FREE_LIMITS });
const picked = checkoutFaqs(faqs);
expect(picked.length === 4, `four checkout FAQs (got ${picked.length})`);
expect(picked.every((f) => faqs.includes(f)), "checkout FAQs are the pricing FAQs, word for word");
expect(picked.some((f) => /refund/i.test(f.q)) && picked.some((f) => /cancel/i.test(f.q)), "refund and cancel questions are included");

if (failures.length) {
  console.error(`${failures.length} of ${count} checks failed:\n- ${failures.join("\n- ")}`);
  process.exit(1);
}
console.log(`polar-discounts: all ${count} checks passed`);
