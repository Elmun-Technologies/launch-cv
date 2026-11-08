import { test, expect, type BrowserContext, type Page } from "@playwright/test";
import { PrismaClient } from "@prisma/client";
import { signPurposeToken, signSessionToken, ADMIN_2FA_COOKIE } from "../src/lib/auth-token";

/**
 * Site verification meta tags and consent-gated marketing pixels
 * (Admin → Integrations → Site verification / Pixels & tags).
 *
 * Needs the server built and started with, e.g.:
 *   BING_SITE_VERIFICATION=1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D
 *   YANDEX_VERIFICATION='<meta name="yandex-verification" content="5c8a6e3d2b1f4a7e" />'
 *   NEXT_PUBLIC_CLARITY_PROJECT_ID=e2eclarity1
 *   NEXT_PUBLIC_META_PIXEL_ID=123456789012345
 * (or the same values saved in Admin → Integrations). Tests that need them skip otherwise.
 *
 * Pixels never load on preview or local hosts (127.0.0.1, localhost), so the
 * pixel tests open the site as http://lcv-e2e.test:<port>: run Chromium with
 * --host-resolver-rules="MAP lcv-e2e.test 127.0.0.1" (see PIXEL_ORIGIN). The
 * vendors' scripts are answered locally; nothing leaves the machine.
 */

const BING = process.env.BING_SITE_VERIFICATION ?? "";
const CLARITY = process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID ?? "";
const META = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";
const PIXEL_ORIGIN = process.env.PIXEL_E2E_ORIGIN ?? "";
const PIXEL_HOSTS = /(clarity\.ms|connect\.facebook\.net|facebook\.com\/tr|googletagmanager\.com\/gtm\.js|analytics\.tiktok\.com|snap\.licdn\.com|redditstatic\.com)/;

const prisma = new PrismaClient();
const staffEmail = `e2e-pixels-${Date.now()}@example.test`;

test.afterAll(async () => {
  await prisma.user.deleteMany({ where: { email: staffEmail } });
  await prisma.$disconnect();
});

test.describe("site verification", () => {
  test.skip(!BING, "set BING_SITE_VERIFICATION (and YANDEX_VERIFICATION) for the build");

  test("verification codes are server-rendered in the home page <head>", async ({ request }) => {
    const html = await (await request.get("/")).text();
    const head = html.slice(0, html.indexOf("</head>"));
    expect(head).toContain(`<meta name="msvalidate.01" content="${BING}"/>`);
    // A full pasted <meta> tag is reduced to its content.
    if (process.env.YANDEX_VERIFICATION) expect(head).toContain(`<meta name="yandex-verification" content="5c8a6e3d2b1f4a7e"/>`);
    // The built-in Search Console code is still there, once.
    expect(head.match(/name="google-site-verification"/g)?.length).toBe(1);
  });

  test("a static page carries them too", async ({ request }) => {
    const html = await (await request.get("/legal/privacy")).text();
    expect(html.slice(0, html.indexOf("</head>"))).toContain(`name="msvalidate.01"`);
  });
});

/** Answers every vendor script locally and records what was asked for. */
async function recordPixels(context: BrowserContext): Promise<string[]> {
  const hits: string[] = [];
  await context.route(PIXEL_HOSTS, (route) => {
    hits.push(route.request().url());
    return route.fulfill({ status: 200, contentType: "application/javascript", body: "/* e2e stub */" });
  });
  return hits;
}

async function settle(page: Page) {
  // public-config is fetched after hydration; give it and any script injection a moment.
  await page.waitForResponse((r) => r.url().includes("/api/public-config")).catch(() => null);
  await page.waitForTimeout(1500);
}

test.describe("marketing pixels", () => {
  test.skip(!PIXEL_ORIGIN || !CLARITY || !META, "set PIXEL_E2E_ORIGIN, NEXT_PUBLIC_CLARITY_PROJECT_ID and NEXT_PUBLIC_META_PIXEL_ID");
  test.use({ baseURL: PIXEL_ORIGIN });

  test("nothing loads before consent; Accept loads them, and the choice sticks", async ({ browser }) => {
    const context = await browser.newContext({ baseURL: PIXEL_ORIGIN });
    const hits = await recordPixels(context);
    const page = await context.newPage();
    await page.goto("/");
    await settle(page);

    const banner = page.getByRole("region", { name: "Cookie notice" });
    await expect(banner.getByRole("button", { name: "Accept" })).toBeVisible();
    expect(hits).toEqual([]);
    expect(await page.evaluate(() => typeof (window as unknown as { fbq?: unknown }).fbq)).toBe("undefined");
    expect(await page.locator('script[id^="lcv-pixel-"]').count()).toBe(0);

    await banner.getByRole("button", { name: "Accept" }).click();
    await expect(banner).toHaveCount(0);
    await expect.poll(() => hits.some((u) => u.includes(`clarity.ms/tag/${CLARITY}`))).toBe(true);
    await expect.poll(() => hits.some((u) => u.includes("connect.facebook.net/en_US/fbevents.js"))).toBe(true);
    expect(await page.evaluate(() => typeof (window as unknown as { fbq?: unknown }).fbq)).toBe("function");

    // Next visit: no question, pixels load straight away.
    hits.length = 0;
    await page.goto("/pricing");
    await settle(page);
    await expect(page.getByRole("region", { name: "Cookie notice" })).toHaveCount(0);
    await expect.poll(() => hits.some((u) => u.includes("clarity.ms"))).toBe(true);
    await context.close();
  });

  test("Decline: nothing loads", async ({ browser }) => {
    const context = await browser.newContext({ baseURL: PIXEL_ORIGIN });
    const hits = await recordPixels(context);
    const page = await context.newPage();
    await page.goto("/");
    await settle(page);
    await page.getByRole("region", { name: "Cookie notice" }).getByRole("button", { name: "Decline" }).click();
    await page.goto("/pricing");
    await settle(page);
    expect(hits).toEqual([]);
    await context.close();
  });

  test("an old 'Got it' is not consent to pixels", async ({ browser }) => {
    const context = await browser.newContext({ baseURL: PIXEL_ORIGIN });
    await context.addInitScript(() => localStorage.setItem("launchcv_cookie_ack", "1"));
    const hits = await recordPixels(context);
    const page = await context.newPage();
    await page.goto("/");
    await settle(page);
    await expect(page.getByRole("region", { name: "Cookie notice" }).getByRole("button", { name: "Accept" })).toBeVisible();
    expect(hits).toEqual([]);
    await context.close();
  });

  test("no pixel loads in the admin panel, even after consent", async ({ browser }) => {
    const user = await prisma.user.create({
      data: { email: staffEmail, role: "admin", emailVerifiedAt: new Date(), totpEnabledAt: new Date(), passwordHash: "x" },
    });
    const context = await browser.newContext({ baseURL: PIXEL_ORIGIN });
    await context.addInitScript(() => {
      localStorage.setItem("launchcv_cookie_ack", "1");
      localStorage.setItem("launchcv_consent", "all");
    });
    await context.addCookies([
      { name: "launchcv_session", value: await signSessionToken({ sub: user.id, email: user.email }), url: PIXEL_ORIGIN },
      { name: ADMIN_2FA_COOKIE, value: await signPurposeToken(user.id, `admin2fa:${user.id}`, 1800), url: PIXEL_ORIGIN },
    ]);
    const hits = await recordPixels(context);
    const page = await context.newPage();

    // Control: the same browser does load them on a public page.
    await page.goto("/");
    await expect.poll(() => hits.length).toBeGreaterThan(0);

    hits.length = 0;
    for (const path of ["/admin-panel", "/admin-panel/integrations", "/admin-panel/integrations/clarity"]) {
      await page.goto(path);
      await expect(page).toHaveURL(new RegExp(`${path.replace(/\//g, "\\/")}$`));
      await settle(page);
      expect(await page.locator('script[id^="lcv-pixel-"]').count()).toBe(0);
    }
    expect(hits).toEqual([]);

    // The Clarity page shows its help and "Where to find it".
    await expect(page.getByRole("heading", { level: 1, name: "Microsoft Clarity" })).toBeVisible();
    await expect(page.getByText(/Free, unlimited heatmaps and session recordings/)).toBeVisible();
    await expect(page.getByRole("link", { name: /Where to find it/ })).toHaveAttribute("href", /learn\.microsoft\.com/);
    await context.close();
  });
});

test("weekly report cron refuses callers without the cron secret or user-agent", async ({ request }) => {
  const r = await request.get("/api/cron/weekly-report");
  expect(r.status()).toBe(401);
});

test("weekly report send-now refuses visitors", async ({ request }) => {
  const r = await request.post("/api/admin-panel/reports/weekly");
  // 401 without a session; 403 when the same-origin check refuses first.
  expect([401, 403]).toContain(r.status());
});
