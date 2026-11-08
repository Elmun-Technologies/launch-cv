import { test, expect, type Browser } from "@playwright/test";
import { PrismaClient } from "@prisma/client";

/**
 * First-party page analytics (components/traffic-tracker.tsx → POST /api/t → PageView).
 *
 * Playwright's Chromium announces itself (HeadlessChrome user-agent,
 * navigator.webdriver), which the tracker rightly treats as a bot, so the
 * "real visitor" tests use a regular desktop Chrome user-agent and hide the
 * webdriver flag. Each test tags its visit with a unique utm_campaign and
 * deletes its rows afterwards.
 */

const prisma = new PrismaClient();
const CHROME = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const GOOGLEBOT = "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)";
const HIDE_WEBDRIVER = `Object.defineProperty(Navigator.prototype, 'webdriver', { get: () => false });`;

const marker = () => `e2e-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
const campaigns: string[] = [];

async function visitor(browser: Browser, opts: { userAgent?: string; init?: string } = {}) {
  const context = await browser.newContext({ userAgent: opts.userAgent ?? CHROME });
  await context.addInitScript(HIDE_WEBDRIVER + (opts.init ?? ""));
  return context;
}

test.afterAll(async () => {
  if (campaigns.length) await prisma.pageView.deleteMany({ where: { utmCampaign: { in: campaigns } } });
  await prisma.$disconnect();
});

test("visiting a page sends a page view and stores it", async ({ browser }) => {
  const tag = marker();
  campaigns.push(tag);
  const context = await visitor(browser);
  const page = await context.newPage();
  const sent = page.waitForRequest((r) => r.url().endsWith("/api/t") && r.method() === "POST" && (r.postData() ?? "").includes('"t":"pv"'));
  const stored = page.waitForResponse((r) => r.url().endsWith("/api/t") && r.status() === 201);
  await page.goto(`/pricing?utm_source=e2e&utm_medium=test&utm_campaign=${tag}&email=someone@example.com`);
  const body = JSON.parse((await sent).postData() ?? "{}") as { p?: string; q?: string };
  expect(body.p).toBe("/pricing");
  // Only campaign tags leave the page; other query params never do.
  expect(body.q).toContain(`utm_campaign=${tag}`);
  expect(body.q).not.toContain("email");
  const { id } = (await (await stored).json()) as { id: string };

  const row = await prisma.pageView.findUnique({ where: { id } });
  expect(row).toMatchObject({ path: "/pricing", utmSource: "e2e", utmMedium: "test", utmCampaign: tag, isEntry: true, isBounce: true, device: "desktop", browser: "Chrome", os: "macOS" });
  expect(row?.visitorId).toMatch(/^[0-9a-f]{20}$/);

  // A second page in the same tab joins the session and clears the bounce.
  const second = page.waitForResponse((r) => r.url().endsWith("/api/t") && r.status() === 201);
  await page.goto("/about");
  const next = (await (await second).json()) as { id: string };
  const views = await prisma.pageView.findMany({ where: { sessionId: row!.sessionId }, orderBy: { createdAt: "asc" } });
  expect(views.map((v) => v.id)).toEqual([id, next.id]);
  expect(views[0].isBounce).toBe(false);
  expect(views[1]).toMatchObject({ path: "/about", isEntry: false, utmCampaign: tag, visitorId: row!.visitorId });
  await context.close();
});

test("a bot user-agent is ignored", async ({ browser, request }) => {
  const tag = marker();
  campaigns.push(tag);
  const context = await visitor(browser, { userAgent: GOOGLEBOT });
  const page = await context.newPage();
  const res = page.waitForResponse((r) => r.url().endsWith("/api/t"));
  await page.goto(`/pricing?utm_campaign=${tag}`);
  expect((await res).status()).toBe(204);
  await context.close();

  const direct = await request.post("/api/t", {
    headers: { "User-Agent": GOOGLEBOT, "Content-Type": "text/plain" },
    data: JSON.stringify({ t: "pv", p: "/pricing", q: `utm_campaign=${tag}`, s: "e2ebotsession01" }),
  });
  expect(direct.status()).toBe(204);
  expect(await prisma.pageView.count({ where: { utmCampaign: tag } })).toBe(0);
});

test("Do Not Track and Global Privacy Control are respected", async ({ browser, request }) => {
  const tag = marker();
  campaigns.push(tag);
  const context = await visitor(browser, {
    init: `Object.defineProperty(Navigator.prototype, 'doNotTrack', { get: () => '1' });`,
  });
  const page = await context.newPage();
  const calls: string[] = [];
  page.on("request", (r) => {
    if (r.url().endsWith("/api/t")) calls.push(r.url());
  });
  await page.goto(`/pricing?utm_campaign=${tag}`);
  await page.getByRole("heading", { level: 1 }).first().waitFor();
  await page.waitForTimeout(1500);
  expect(calls).toEqual([]);
  await context.close();

  // The server refuses too, whichever signal the browser sends.
  const signals: Record<string, string>[] = [{ DNT: "1" }, { "Sec-GPC": "1" }];
  for (const header of signals) {
    const res = await request.post("/api/t", {
      headers: { "User-Agent": CHROME, "Content-Type": "text/plain", ...header },
      data: JSON.stringify({ t: "pv", p: "/pricing", q: `utm_campaign=${tag}`, s: "e2ednt-session-01" }),
    });
    expect(res.status()).toBe(204);
  }
  expect(await prisma.pageView.count({ where: { utmCampaign: tag } })).toBe(0);
});
