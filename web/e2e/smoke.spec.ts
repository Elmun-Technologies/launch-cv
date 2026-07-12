import { test, expect } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: /the ai job search platform/i })).toBeVisible();
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { name: /sign in to launchcv/i })).toBeVisible();
});

test("free ATS check page renders without an account", async ({ page }) => {
  await page.goto("/free-ats-check");
  await expect(page.getByRole("heading", { name: /check your ats score free/i })).toBeVisible();
  // Upload affordance is the default input mode. Target the dropzone button
  // specifically — the hero copy also contains "Upload your resume…".
  await expect(page.getByRole("button", { name: /upload your resume/i })).toBeVisible();
  // Switching to the paste tab reveals the textarea.
  await page.getByRole("button", { name: /paste text/i }).click();
  await expect(page.getByPlaceholder(/paste your resume text/i)).toBeVisible();
});

test("home hero CTA points to the free ATS check", async ({ page }) => {
  await page.goto("/");
  const cta = page.getByRole("link", { name: /check your ats score free/i }).first();
  await expect(cta).toHaveAttribute("href", "/free-ats-check");
});
