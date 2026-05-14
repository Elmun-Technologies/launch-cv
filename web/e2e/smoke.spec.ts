import { test, expect } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  // Editorial hero copy — Stop applying. Start getting hired.
  await expect(page.getByRole("heading", { name: /stop applying/i })).toBeVisible();
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /sign in to launch cv/i })).toBeVisible();
});
