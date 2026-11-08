/**
 * Self-checks for lib/winback.ts, lib/unsubscribe-token.ts and lib/cron-auth.ts.
 * Polar, email and the database are stubbed; nothing leaves the process.
 * Run: npx tsx src/lib/winback.check.ts
 */
process.env.AUTH_SECRET ||= "winback-check-secret-at-least-32-chars!!";
process.env.ADMIN_EMAILS = "boss@example.com";

import {
  WINBACK_CODE_RE,
  WINBACK_MAX_PER_RUN,
  PERSONAL_CODE_RE,
  WELCOME_CODE_RE,
  discountedPrice,
  formatEastern,
  formatUtc,
  parseWinbackOffer,
  pickCandidates,
  randomWinbackCode,
  runWinback,
  winbackDiscountBody,
  winbackEmail,
  winbackWindow,
  type CandidateUser,
  type Marketing,
  type TriggerEvent,
  type WinbackDeps,
  type WinbackSentMeta,
} from "@/lib/winback";
import { unsubscribeToken, unsubscribeUrl, verifyUnsubscribeToken } from "@/lib/unsubscribe-token";
import { cronAuth } from "@/lib/cron-auth";
import { randomWelcomeCode, welcomeOfferEmail } from "@/lib/welcome-offer";
import type { PlanId } from "@/lib/plan-config";
import type { PolarDiscountBody } from "@/lib/polar-discounts";

const failures: string[] = [];
let count = 0;
function expect(ok: boolean, what: string) {
  count += 1;
  if (!ok) failures.push(what);
}

const H = 3_600_000;
const NOW = new Date("2026-11-08T15:07:00Z");
const ago = (h: number) => new Date(NOW.getTime() - h * H);
const verified = new Date("2026-01-01T00:00:00Z");

function user(id: string, over: Partial<CandidateUser> = {}): CandidateUser {
  return { id, email: `${id}@example.com`, role: "user", emailVerifiedAt: verified, marketingOptOutAt: null, suspendedAt: null, ...over };
}
const checkout = (userId: string, h: number, plan = "professional"): TriggerEvent => ({ userId, name: "checkout_started", createdAt: ago(h), meta: { provider: "polar", plan } });
const freeLimit = (userId: string, h: number): TriggerEvent => ({ userId, name: "free_limit_reached", createdAt: ago(h), meta: { kind: "jd" } });

/* ── Window ── */
{
  const w = winbackWindow(NOW, 24);
  expect(w.to.getTime() === ago(24).getTime(), "window ends `delay` hours ago");
  expect(w.from.getTime() === ago(72).getTime(), "window starts delay + 48 h ago");
}

/* ── Eligibility (pure) ── */
{
  const window = winbackWindow(NOW, 24);
  const users = [
    user("ok"),
    user("paidlater"),
    user("optout", { marketingOptOutAt: ago(1) }),
    user("unverified", { emailVerifiedAt: null }),
    user("sent"),
    user("staff", { role: "admin" }),
    user("owner", { role: "owner" }),
    user("boss", { email: "boss@example.com" }),
    user("suspended", { suspendedAt: ago(2) }),
    user("tooNew"),
    user("tooOld"),
    user("edgeTo"),
    user("edgeFrom"),
    user("free"),
    user("mixed"),
    user("legacyPlan"),
  ];
  const events: TriggerEvent[] = [
    checkout("ok", 30, "quarter"),
    checkout("paidlater", 30),
    checkout("optout", 30),
    checkout("unverified", 30),
    checkout("sent", 30),
    checkout("staff", 30),
    checkout("owner", 30),
    checkout("boss", 30),
    checkout("suspended", 30),
    checkout("tooNew", 23.99),
    checkout("tooOld", 72.01),
    checkout("edgeTo", 24),
    checkout("edgeFrom", 72),
    freeLimit("free", 40),
    freeLimit("mixed", 50),
    checkout("mixed", 45, "week"),
    checkout("mixed", 30, "professional"),
    checkout("legacyPlan", 30, "elite"),
    checkout("ghost", 30),
  ];
  const picked = pickCandidates({ events, users, alreadySent: new Set(["sent"]), window });
  const ids = picked.map((c) => c.userId);
  const has = (id: string) => ids.includes(id);
  expect(has("ok"), "eligible user is picked");
  expect(picked.find((c) => c.userId === "ok")?.plan === "quarter", "plan = the one they started");
  expect(picked.find((c) => c.userId === "ok")?.reason === "checkout", "reason = checkout");
  expect(!has("optout"), "opted-out user is skipped");
  expect(!has("unverified"), "unverified email is skipped");
  expect(!has("sent"), "user with a prior winback_sent is skipped");
  expect(!has("staff") && !has("owner"), "staff roles are skipped");
  expect(!has("boss"), "ADMIN_EMAILS bootstrap owner is skipped");
  expect(!has("suspended"), "suspended user is skipped");
  expect(!has("tooNew"), "event newer than the delay is skipped");
  expect(!has("tooOld"), "event older than delay + 48 h is skipped");
  expect(has("edgeTo"), "event exactly `delay` hours ago counts");
  expect(has("edgeFrom"), "event exactly delay + 48 h ago counts");
  expect(picked.find((c) => c.userId === "free")?.reason === "free_limit", "free-limit event alone → reason free_limit");
  expect(picked.find((c) => c.userId === "free")?.plan === "week", "free-limit → Week Pass");
  const mixed = picked.find((c) => c.userId === "mixed");
  expect(mixed?.reason === "checkout" && mixed.plan === "professional", "checkout wins over free limit; latest checkout plan used");
  expect(picked.find((c) => c.userId === "legacyPlan")?.plan === "week", "legacy / unknown plan defaults to week");
  expect(!has("ghost"), "event without a user row is skipped");
  expect(new Set(ids).size === ids.length, "one entry per user");
}

/* ── Codes, body, email ── */
{
  for (let i = 0; i < 50; i++) expect(WINBACK_CODE_RE.test(randomWinbackCode()), "random code is BACK + 6 A–Z0–9");
  const endsAt = new Date(NOW.getTime() + 48 * H);
  const body = winbackDiscountBody({ userId: "u1", code: "BACKABC123", percent: 30, endsAt, productIds: ["p1", "p2", "p3"] });
  expect(body.name === "Win-back u1" && body.code === "BACKABC123", "discount name and code");
  expect(body.type === "percentage" && body.basis_points === 3000, "30% = 3000 basis points");
  expect(body.duration === "once" && body.max_redemptions === 1, "single use, once");
  expect(body.ends_at === "2026-11-10T15:07:00.000Z", "ends_at = now + valid hours (ISO)");
  expect(body.products.length === 3, "all three sold products");
  expect(formatUtc(endsAt) === "Tuesday, November 10, 2026 at 15:07 UTC", `formatUtc: ${formatUtc(endsAt)}`);

  const e = winbackEmail({
    percent: 30,
    validHours: 48,
    code: "BACKABC123",
    endsAt,
    plan: "professional",
    reason: "checkout",
    checkoutUrl: "https://launch-cv.com/checkout/professional?code=BACKABC123",
    unsubscribeUrl: "https://launch-cv.com/api/email/unsubscribe?u=u1&t=x",
    postalAddress: "1 Main St, Sheridan, WY 82801, USA",
  });
  expect(e.subject === "Your Pro is waiting: 30% off for 48 hours", `subject: ${e.subject}`);
  expect(e.text.includes("BACKABC123") && e.html.includes("BACKABC123"), "email shows the code");
  expect(formatEastern(endsAt) === "Tuesday, November 10 at 10:07 AM EST", `formatEastern: ${formatEastern(endsAt)}`);
  expect(e.text.includes("Ends Tuesday, November 10 at 10:07 AM EST"), "email shows the expiry in US Eastern");
  expect(e.text.includes("one step away from the Pro") && e.subject.includes("Your Pro is waiting"), "email says what they started");
  expect(e.text.includes("from $29 to $20.30"), "email shows the discounted price");
  expect(e.text.includes("Code: BACKABC123"), "text version carries the code");
  expect(e.html.includes("/checkout/professional?code=BACKABC123"), "button links to checkout with the code");
  expect(e.text.includes("Elmun Technologies LLC") && e.text.includes("1 Main St, Sheridan"), "footer has company and postal address");
  expect(e.html.includes("api/email/unsubscribe?u=u1&amp;t=x"), "footer has the unsubscribe link");
  expect(e.text.includes("because you started a checkout"), "footer says why they got it");
}

/* ── Unsubscribe token ── */
{
  const key = new TextEncoder().encode("k".repeat(32));
  const t = unsubscribeToken("user_1", key);
  expect(verifyUnsubscribeToken("user_1", t, key), "valid token verifies");
  expect(!verifyUnsubscribeToken("user_2", t, key), "token for another user fails");
  expect(!verifyUnsubscribeToken("user_1", `${t.slice(0, -1)}${t.endsWith("A") ? "B" : "A"}`, key), "tampered token fails");
  expect(!verifyUnsubscribeToken("user_1", t.slice(0, 10), key), "short token fails");
  expect(!verifyUnsubscribeToken("user_1", "", key) && !verifyUnsubscribeToken(null, t, key), "missing parts fail");
  expect(!verifyUnsubscribeToken("user_1", t, new TextEncoder().encode("z".repeat(32))), "other secret fails");
  const url = new URL(unsubscribeUrl("https://launch-cv.com/", "user_1"));
  expect(url.pathname === "/api/email/unsubscribe", "unsubscribe URL path");
  expect(verifyUnsubscribeToken(url.searchParams.get("u"), url.searchParams.get("t")), "URL built with AUTH_SECRET verifies");
}

/* ── Cron auth ── */
{
  const base = { authorization: null, userAgent: null, lastRunAt: null, now: NOW };
  expect(cronAuth({ ...base, secret: "s3cret", authorization: "Bearer s3cret" }).ok, "secret: right bearer passes");
  expect(!cronAuth({ ...base, secret: "s3cret", authorization: "Bearer nope" }).ok, "secret: wrong bearer fails");
  expect(!cronAuth({ ...base, secret: "s3cret", userAgent: "vercel-cron/1.0" }).ok, "secret: user-agent alone fails");
  expect(cronAuth({ ...base, secret: "s3cret", authorization: "Bearer s3cret", lastRunAt: ago(1) }).ok, "secret: no 20 h guard");
  expect(cronAuth({ ...base, secret: undefined, userAgent: "vercel-cron/1.0" }).ok, "no secret: vercel-cron UA passes");
  expect(cronAuth({ ...base, secret: "  ", userAgent: "vercel-cron/1.0" }).ok, "blank secret counts as unset");
  expect(!cronAuth({ ...base, secret: undefined, userAgent: "curl/8" }).ok, "no secret: other UA fails");
  const recent = cronAuth({ ...base, secret: undefined, userAgent: "vercel-cron/1.0", lastRunAt: ago(19.9) });
  expect(!recent.ok && recent.status === 429, "no secret: run within 20 h refused");
  expect(cronAuth({ ...base, secret: undefined, userAgent: "vercel-cron/1.0", lastRunAt: ago(20) }).ok, "no secret: run 20 h later allowed");
}

/* ── Checkout offer parsing ── */
{
  const meta = { code: "BACKABC123", discountId: "d1", plan: "week", reason: "checkout", percent: 30, endsAt: new Date(NOW.getTime() + H).toISOString() };
  expect(parseWinbackOffer(meta, "BACKABC123", NOW)?.discountId === "d1", "valid offer parsed");
  expect(parseWinbackOffer(meta, "BACKZZZ999", NOW) === null, "other code → no offer");
  expect(parseWinbackOffer({ ...meta, endsAt: ago(0).toISOString() }, "BACKABC123", NOW) === null, "expired offer → none");
  expect(parseWinbackOffer({ ...meta, discountId: "" }, "BACKABC123", NOW) === null, "no discount id → none");
}

/* ── runWinback with stubs ── */
type Stub = { deps: WinbackDeps; sent: { userId: string; meta: WinbackSentMeta }[]; emails: { to: string; headers: Record<string, string>; text: string }[]; discounts: PolarDiscountBody[]; deleted: string[] };

function stub(opts: {
  marketing?: Partial<Marketing>;
  events: TriggerEvent[];
  users: CandidateUser[];
  alreadySent?: string[];
  plans?: Record<string, PlanId>;
  polarFails?: boolean;
  emailFailsFor?: string[];
  activeWelcome?: string[];
}): Stub {
  const s: Stub = { sent: [], emails: [], discounts: [], deleted: [], deps: null as unknown as WinbackDeps };
  let n = 0;
  s.deps = {
    marketing: async () => ({ winbackEnabled: true, winbackPercent: 30, winbackValidHours: 48, winbackDelayHours: 24, postalAddress: "1 Main St, Sheridan, WY", welcomeEnabled: true, welcomePercent: 20, welcomeValidHours: 48, ...opts.marketing }),
    findTriggerEvents: async (from, to) => opts.events.filter((e) => e.createdAt >= from && e.createdAt <= to),
    findUsers: async (ids) => opts.users.filter((u) => ids.includes(u.id)),
    findAlreadySent: async (ids) => new Set((opts.alreadySent ?? []).filter((id) => ids.includes(id))),
    findActiveWelcome: async (ids) => new Set((opts.activeWelcome ?? []).filter((id) => ids.includes(id))),
    planOf: async (id) => opts.plans?.[id] ?? "none",
    productIds: async () => ["p1", "p2", "p3"],
    createDiscount: async (body) => {
      if (opts.polarFails) return { ok: false, error: "Polar answered 500." };
      s.discounts.push(body);
      return { ok: true, id: `disc_${s.discounts.length}` };
    },
    deleteDiscount: async (id) => {
      s.deleted.push(id);
    },
    sendEmail: async (a) => {
      if (opts.emailFailsFor?.includes(a.to)) return { ok: false, error: "resend down" };
      s.emails.push({ to: a.to, headers: a.headers, text: a.text });
      return { ok: true };
    },
    recordSent: async (userId, meta) => {
      s.sent.push({ userId, meta });
    },
    baseUrl: () => "https://launch-cv.com",
    unsubscribeUrl: (id) => `https://launch-cv.com/api/email/unsubscribe?u=${id}&t=tok`,
    randomCode: () => `BACK${String(++n).padStart(6, "0")}`,
    clock: () => 0,
  };
  return s;
}

async function runChecks() {
  const users = [user("a"), user("b"), user("paid"), user("granted")];
  const events = [checkout("a", 30, "quarter"), freeLimit("b", 30), checkout("paid", 30), checkout("granted", 30)];

  {
    const s = stub({ marketing: { postalAddress: "   " }, events, users });
    const r = await runWinback(NOW, s.deps);
    expect("skipped" in r && r.skipped === "no_postal_address", "gate: no postal address → skipped");
    expect(s.emails.length === 0 && s.discounts.length === 0 && s.sent.length === 0, "gate: nothing sent or created");
  }
  {
    const s = stub({ marketing: { winbackEnabled: false }, events, users });
    const r = await runWinback(NOW, s.deps);
    expect("skipped" in r && r.skipped === "disabled", "gate: disabled → skipped");
    expect(s.emails.length === 0, "gate: disabled sends nothing");
  }
  {
    const s = stub({ events, users, plans: { paid: "professional", granted: "week" } });
    const r = await runWinback(NOW, s.deps);
    expect(!("skipped" in r) && r.sent === 2 && r.paid === 2, `run: 2 sent, 2 paid skipped (${JSON.stringify(r)})`);
    expect(s.sent.map((x) => x.userId).sort().join() === "a,b", "run: paid and staff-granted users get nothing");
    const a = s.sent.find((x) => x.userId === "a")!;
    expect(a.meta.plan === "quarter" && a.meta.reason === "checkout" && a.meta.discountId === "disc_1" && WINBACK_CODE_RE.test(a.meta.code), "run: winback_sent meta");
    expect(a.meta.endsAt === new Date(NOW.getTime() + 48 * H).toISOString(), "run: endsAt recorded");
    expect(s.sent.find((x) => x.userId === "b")!.meta.reason === "free_limit", "run: free-limit reason");
    const mail = s.emails.find((x) => x.to === "a@example.com")!;
    expect(mail.headers["List-Unsubscribe"] === "<https://launch-cv.com/api/email/unsubscribe?u=a&t=tok>", "run: List-Unsubscribe header");
    expect(mail.headers["List-Unsubscribe-Post"] === "List-Unsubscribe=One-Click", "run: List-Unsubscribe-Post header");
    expect(mail.text.includes("/checkout/quarter?code=BACK"), "run: button to the started plan with the code");
    expect(s.discounts.every((d) => d.basis_points === 3000 && d.max_redemptions === 1 && d.products.length === 3), "run: discount bodies");
  }
  {
    const s = stub({ events, users, polarFails: true });
    const r = await runWinback(NOW, s.deps);
    expect(!("skipped" in r) && r.failed === 4 && r.sent === 0, "polar failure counted");
    expect(s.sent.length === 0 && s.emails.length === 0, "polar failure: no email, nothing recorded (retried later)");
  }
  {
    const s = stub({ events, users, emailFailsFor: ["a@example.com"] });
    await runWinback(NOW, s.deps);
    expect(!s.sent.some((x) => x.userId === "a"), "email failure: nothing recorded for that user");
    expect(s.deleted.length === 1, "email failure: the unused Polar code is deleted");
    expect(s.sent.some((x) => x.userId === "b"), "email failure for one user doesn't stop the others");
  }
  {
    const s = stub({ events, users, alreadySent: ["a", "b"] });
    await runWinback(NOW, s.deps);
    expect(!s.sent.some((x) => x.userId === "a" || x.userId === "b"), "already sent → never again");
  }
  {
    const many = Array.from({ length: 130 }, (_, i) => user(`m${i}`));
    const s = stub({ events: many.map((u) => checkout(u.id, 30)), users: many });
    const r = await runWinback(NOW, s.deps);
    expect(s.sent.length === WINBACK_MAX_PER_RUN, `at most 100 per run (sent ${s.sent.length})`);
    expect(!("skipped" in r) && r.deferred === 30, "the rest are deferred");
  }
  {
    const s = stub({ events: [], users: [] });
    const r = await runWinback(NOW, s.deps);
    expect(!("skipped" in r) && r.candidates === 0, "no events → nothing to do");
  }
  {
    const s = stub({ events, users, activeWelcome: ["a"] });
    await runWinback(NOW, s.deps);
    expect(!s.sent.some((x) => x.userId === "a") && s.sent.some((x) => x.userId === "b"), "valid welcome code → no win-back yet; others still get theirs");
  }

  // Welcome offer
  for (let i = 0; i < 50; i++) {
    const c = randomWelcomeCode();
    expect(WELCOME_CODE_RE.test(c) && PERSONAL_CODE_RE.test(c) && !WINBACK_CODE_RE.test(c), `welcome code format: ${c}`);
  }
  expect(PERSONAL_CODE_RE.test("BACKABC123") && !PERSONAL_CODE_RE.test("SAVE20"), "personal code regex covers win-back only among the others");
  expect(discountedPrice("week", 20) === "$7.20" && discountedPrice("quarter", 30) === "$48.30", "discounted prices");
  const w = welcomeOfferEmail({
    percent: 20,
    validHours: 48,
    code: "HELLOABC123",
    endsAt: new Date("2026-11-10T15:07:00Z"),
    checkoutUrl: "https://launch-cv.com/checkout/week?code=HELLOABC123",
    unsubscribeUrl: "https://launch-cv.com/api/email/unsubscribe?u=u1&t=x",
    postalAddress: "1 Main St, Sheridan, WY",
  });
  expect(w.subject.includes("20% off") && w.subject.includes("48 hours"), "welcome subject");
  expect(w.text.includes("Code: HELLOABC123") && w.html.includes("HELLOABC123"), "welcome carries the code");
  expect(w.text.includes("from $9 to $7.20"), "welcome shows the discounted Week Pass price");
  expect(w.text.includes("Ends Tuesday, November 10 at 10:07 AM EST"), "welcome shows the expiry in US Eastern");
  expect(w.html.includes("/checkout/week?code=HELLOABC123"), "welcome button opens checkout with the code");
  expect(w.text.includes("Elmun Technologies LLC") && w.text.includes("1 Main St, Sheridan") && w.html.includes("unsubscribe?u=u1&amp;t=x"), "welcome footer: company, address, unsubscribe");
  expect(!/[<>]/.test(w.text), "welcome text version has no markup");
}

runChecks()
  .then(() => {
    if (failures.length) {
      console.error(`winback checks: ${failures.length} of ${count} failed`);
      for (const f of failures) console.error(`  ✗ ${f}`);
      process.exit(1);
    }
    console.log(`winback checks: all ${count} passed`);
    process.exit(0);
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
