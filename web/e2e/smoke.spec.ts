import { test, expect } from "@playwright/test";

test("bosh sahifa ochiladi", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /Oddiy shablondan emas/i })).toBeVisible();
});

test("kirish sahifasi", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: "Kirish" })).toBeVisible();
});
