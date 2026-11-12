import { test, expect } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: /see your resume the way hiring software/i })).toBeVisible();
});

test("login page renders", async ({ page }) => {
  await page.goto("/login");
  await expect(page.getByRole("heading", { level: 1, name: /welcome back/i })).toBeVisible();
});

test("free ATS check page renders without an account", async ({ page }) => {
  await page.goto("/free-ats-check");
  await expect(page.getByRole("heading", { name: /free ats score checker/i })).toBeVisible();
  // Upload affordance is the default input mode. Target the dropzone button
  // specifically — the hero copy also contains "Upload your resume…".
  await expect(page.getByRole("button", { name: /upload your resume/i })).toBeVisible();
  // Switching to the paste tab reveals the textarea.
  await page.getByRole("tab", { name: /paste text/i }).click();
  await expect(page.getByPlaceholder(/paste your resume text/i)).toBeVisible();
});

test("home hero sends visitors to the free ATS check", async ({ page }) => {
  await page.goto("/");
  // One page per query: the checker lives on /free-ats-check, the home hero links to it.
  const cta = page.getByRole("link", { name: /check my resume — free/i }).first();
  await expect(cta).toHaveAttribute("href", "/free-ats-check");
  await cta.click();
  await expect(page).toHaveURL(/\/free-ats-check$/);
  await expect(page.getByRole("button", { name: /upload your resume/i })).toBeVisible();
});
