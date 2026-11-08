import { test, expect } from "@playwright/test";

// Admin → Revenue / Product hold billing data: nothing is served without a staff session.

for (const path of ["/admin-panel/revenue", "/admin-panel/product?range=90d"]) {
  test(`${path} is not shown to visitors`, async ({ page }) => {
    await page.goto(path);
    await expect(page).not.toHaveURL(/\/admin-panel\/(revenue|product)/);
    await expect(page.getByRole("heading", { level: 1, name: /^(revenue|product)$/i })).toHaveCount(0);
  });
}

for (const url of ["/api/admin-panel/revenue/export?table=kpis&range=30d", "/api/admin-panel/product/export?table=funnel&range=30d"]) {
  test(`${url.split("?")[0]} refuses visitors`, async ({ request }) => {
    const r = await request.get(url);
    expect(r.status()).toBe(401);
    expect(r.headers()["content-type"]).toContain("application/json");
  });
}

test("export routes reject unknown tables before anything else", async ({ request }) => {
  const r = await request.get("/api/admin-panel/revenue/export?table=users");
  expect(r.status()).toBe(400);
});
