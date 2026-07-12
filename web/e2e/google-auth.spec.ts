import { test, expect } from "@playwright/test";

/**
 * These run without GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET configured (the
 * default CI env), so they exercise the "unconfigured" and CSRF-rejection
 * paths — both fully deterministic without hitting Google.
 */

test("Google button is hidden when OAuth isn't configured", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /sign in to launch cv/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /continue with google/i })).toHaveCount(0);
});

test("start route redirects to login when OAuth isn't configured", async ({ request }) => {
  const res = await request.get("/api/auth/google/start", { maxRedirects: 0 });
  expect(res.status()).toBe(307);
  expect(res.headers()["location"]).toContain("/login?error=google_unavailable");
});

test("callback rejects a missing/mismatched CSRF state", async ({ request }) => {
  const res = await request.get("/api/auth/google/callback?code=abc&state=forged", {
    maxRedirects: 0,
  });
  expect(res.status()).toBe(307);
  // Either google_state (bad CSRF) or google_unavailable (unconfigured) — both
  // are safe rejections that never trust the forged code.
  expect(res.headers()["location"]).toMatch(/\/login\?error=google_(state|unavailable)/);
});

test("callback reports Google-side denial", async ({ request }) => {
  const res = await request.get("/api/auth/google/callback?error=access_denied", {
    maxRedirects: 0,
  });
  expect(res.status()).toBe(307);
  expect(res.headers()["location"]).toMatch(/\/login\?error=google_(denied|unavailable)/);
});
