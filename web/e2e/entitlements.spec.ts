import { test, expect } from "@playwright/test";
import {
  checkoutConflict,
  isUnexpiredPassRow,
  passPeriodEnd,
  subscriptionRowGrantsPaid,
} from "../src/lib/entitlement-rules";
import { CHECKOUT_PLAN_ORDER, PASS_DAYS, isOneTimePlan, isPublicPlan } from "../src/lib/plan-config";
import { usageBlock } from "../src/lib/usage-rules";

// Pure-function tests — no browser needed. They lock in who gets paid access from a
// stored billing row (passes expire, Lifetime never does, subscriptions keep their
// grace) and how a pass bought on top of another one is extended.

const NOW = Date.UTC(2026, 10, 8, 12, 0, 0);
const DAY = 24 * 60 * 60 * 1000;
const at = (offsetMs: number) => new Date(NOW + offsetMs);

const pass = (end: Date | null) => ({ stripeSubscriptionId: "order:ord_1", status: "active", currentPeriodEnd: end });
const sub = (status: string, end: Date | null, cancelAtPeriodEnd = false) => ({
  stripeSubscriptionId: "sub_1",
  status,
  currentPeriodEnd: end,
  cancelAtPeriodEnd,
});

test("an unexpired pass grants access", () => {
  expect(subscriptionRowGrantsPaid(pass(at(3 * DAY)), NOW)).toBe(true);
  expect(subscriptionRowGrantsPaid(pass(at(1000)), NOW)).toBe(true);
});

test("an expired pass does not grant access", () => {
  expect(subscriptionRowGrantsPaid(pass(at(-1000)), NOW)).toBe(false);
  expect(subscriptionRowGrantsPaid(pass(at(0)), NOW)).toBe(false);
  expect(subscriptionRowGrantsPaid(pass(at(-30 * DAY)), NOW)).toBe(false);
});

test("Lifetime (a one-time order with no end date) always grants access", () => {
  expect(subscriptionRowGrantsPaid(pass(null), NOW)).toBe(true);
  expect(subscriptionRowGrantsPaid(pass(null), NOW + 10 * 365 * DAY)).toBe(true);
});

test("an active subscription whose period end has just passed still grants access", () => {
  // The renewal webhook can arrive after the stored period end rolls over.
  expect(subscriptionRowGrantsPaid(sub("active", at(-60 * 1000)), NOW)).toBe(true);
  expect(subscriptionRowGrantsPaid(sub("trialing", at(-DAY)), NOW)).toBe(true);
  expect(subscriptionRowGrantsPaid(sub("past_due", at(-DAY)), NOW)).toBe(true);
});

test("a canceled subscription grants access only within its paid period", () => {
  expect(subscriptionRowGrantsPaid(sub("canceled", at(5 * DAY)), NOW)).toBe(true);
  expect(subscriptionRowGrantsPaid(sub("cancelled", at(5 * DAY)), NOW)).toBe(true);
  expect(subscriptionRowGrantsPaid(sub("canceled", at(-DAY)), NOW)).toBe(false);
  expect(subscriptionRowGrantsPaid(sub("revoked", at(5 * DAY)), NOW)).toBe(false);
  expect(subscriptionRowGrantsPaid(null, NOW)).toBe(false);
});

test("a new pass runs from now when there is no running pass", () => {
  expect(passPeriodEnd("week", null, NOW)).toEqual(at(PASS_DAYS.week * DAY));
  expect(passPeriodEnd("quarter", null, NOW)).toEqual(at(90 * DAY));
  // An expired pass doesn't carry over.
  expect(passPeriodEnd("week", pass(at(-2 * DAY)), NOW)).toEqual(at(7 * DAY));
  // Neither does a subscription's period, nor Lifetime.
  expect(passPeriodEnd("week", sub("active", at(20 * DAY)), NOW)).toEqual(at(7 * DAY));
  expect(passPeriodEnd("week", pass(null), NOW)).toEqual(at(7 * DAY));
});

test("a pass bought during an unexpired pass extends from the existing end", () => {
  const existingEnd = at(3 * DAY);
  expect(isUnexpiredPassRow(pass(existingEnd), NOW)).toBe(true);
  expect(passPeriodEnd("week", pass(existingEnd), NOW)).toEqual(at(10 * DAY));
  expect(passPeriodEnd("quarter", pass(existingEnd), NOW)).toEqual(at(93 * DAY));
});

test("checkout rules for one-time plans", () => {
  // Passes can extend a running pass; a subscription can't start on top of one.
  expect(checkoutConflict(pass(at(3 * DAY)), "week", NOW)).toBeNull();
  expect(checkoutConflict(pass(at(3 * DAY)), "quarter", NOW)).toBeNull();
  expect(checkoutConflict(pass(at(3 * DAY)), "professional", NOW)).toMatch(/pass is active/);
  // An expired pass blocks nothing.
  expect(checkoutConflict(pass(at(-DAY)), "professional", NOW)).toBeNull();
  // Lifetime already covers everything.
  expect(checkoutConflict(pass(null), "week", NOW)).toMatch(/Lifetime/);
  // A running subscription would be billed alongside a pass; a cancelling one wouldn't.
  expect(checkoutConflict(sub("active", at(20 * DAY)), "week", NOW)).toMatch(/active subscription/);
  expect(checkoutConflict(sub("active", at(20 * DAY), true), "week", NOW)).toBeNull();
  expect(checkoutConflict(sub("canceled", at(20 * DAY)), "professional", NOW)).toBeNull();
  expect(checkoutConflict(null, "professional", NOW)).toBeNull();
});

test("only the new plans are sold; passes and Lifetime are one-time", () => {
  expect([...CHECKOUT_PLAN_ORDER]).toEqual(["week", "professional", "quarter"]);
  for (const legacy of ["starter", "elite", "lifetime"]) expect(isPublicPlan(legacy)).toBe(false);
  expect(isOneTimePlan("week")).toBe(true);
  expect(isOneTimePlan("quarter")).toBe(true);
  expect(isOneTimePlan("lifetime")).toBe(true);
  expect(isOneTimePlan("professional")).toBe(false);
});

test("free AI checks need a confirmed email; paid plans never do", () => {
  expect(usageBlock({ paid: false, emailVerified: false, used: 0, max: 2 })).toBe("email_unverified");
  expect(usageBlock({ paid: false, emailVerified: true, used: 0, max: 2 })).toBeNull();
  expect(usageBlock({ paid: false, emailVerified: true, used: 2, max: 2 })).toBe("limit");
  // Paid (including staff-granted) plans aren't blocked by email confirmation.
  expect(usageBlock({ paid: true, emailVerified: false, used: 0, max: 40 })).toBeNull();
  expect(usageBlock({ paid: true, emailVerified: false, used: 40, max: 40 })).toBe("limit");
});
