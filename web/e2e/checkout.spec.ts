import { test, expect } from "@playwright/test";

test("/checkout/week shows the plan and its price, and is noindex", async ({ page }) => {
  const res = await page.goto("/checkout/week", { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(200);
  await expect(page.getByRole("heading", { level: 1, name: "Week Pass" })).toBeVisible();
  await expect(page.getByText("$9", { exact: true }).first()).toBeVisible();
  await expect(page.getByText("for 7 days").first()).toBeVisible();
  await expect(page.getByText("Enter it on the next step.")).toBeVisible();
  const robots = await page.locator('meta[name="robots"]').getAttribute("content");
  expect(robots).toContain("noindex");
});

test("signed out, continuing from /checkout/week leads to sign-up and back to the checkout", async ({ page }) => {
  await page.goto("/checkout/week", { waitUntil: "domcontentloaded" });
  await page.getByRole("link", { name: "Create a free account to continue" }).click();
  await page.waitForURL(/\/(register|login)\?/);
  const url = new URL(page.url());
  expect(url.pathname).toMatch(/^\/(register|login)$/);
  expect(url.searchParams.get("next")).toBe("/checkout/week?start=1");
});

test("pricing plan buttons open the plan's checkout page", async ({ page }) => {
  await page.goto("/pricing", { waitUntil: "domcontentloaded" });
  await expect(page.locator("a", { hasText: "Get the Week Pass" }).first()).toHaveAttribute("href", "/checkout/week");
});

test("plans that aren't sold have no checkout page", async ({ page }) => {
  const res = await page.goto("/checkout/lifetime", { waitUntil: "domcontentloaded" });
  expect(res?.status()).toBe(404);
});
