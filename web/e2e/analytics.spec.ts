import { test, expect, type Page } from "@playwright/test";

/**
 * Verifies the conversion funnel events dispatch to BOTH destinations:
 *   - GA4    → read from window.dataLayer (real gtag) or a fallback recorder
 *   - PostHog → a stubbed window.posthog.capture recorder
 *
 * PostHog is only assigned to window when a key is configured (it isn't in
 * tests), so our stub survives. GA4's inline gtag defines window.gtag and, once
 * external gtag/js is (or isn't) reachable, still queues events to dataLayer.
 *
 * We poll with waitForFunction instead of fixed sleeps / networkidle so the
 * tests don't hang on third-party requests and don't race hydration.
 */
const INIT = `
  window.__ph = [];
  window.__gtagFallback = [];
  window.posthog = { capture: (name, props) => window.__ph.push({ name, params: props }) };
  if (typeof window.gtag !== 'function') {
    window.gtag = function(){ const a = Array.prototype.slice.call(arguments);
      if (a[0] === 'event') window.__gtagFallback.push({ name: a[1], params: a[2] }); };
  }
`;

/** All GA4 events seen so far, from dataLayer (real gtag) + the fallback recorder. */
function gtagEvents(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as { dataLayer?: unknown[]; __gtagFallback: { name: string; params: unknown }[] };
    const fromLayer = (w.dataLayer || [])
      .map((a) => Array.from(a as ArrayLike<unknown>))
      .filter((a) => a[0] === "event")
      .map((a) => ({ name: a[1] as string, params: a[2] }));
    return [...fromLayer, ...w.__gtagFallback];
  });
}
const phEvents = (page: Page) =>
  page.evaluate(() => (window as unknown as { __ph: { name: string; params: unknown }[] }).__ph);

/** Wait until an event with `name` has reached BOTH gtag and posthog. */
async function waitForEvent(page: Page, name: string) {
  await page.waitForFunction(
    (n) => {
      const w = window as unknown as {
        dataLayer?: unknown[];
        __gtagFallback: { name: string }[];
        __ph: { name: string }[];
      };
      const inGtag =
        (w.dataLayer || []).some((a) => {
          const arr = Array.from(a as ArrayLike<unknown>);
          return arr[0] === "event" && arr[1] === n;
        }) || w.__gtagFallback.some((e) => e.name === n);
      const inPh = w.__ph.some((e) => e.name === n);
      return inGtag && inPh;
    },
    name,
    { timeout: 15_000 },
  );
}

async function preventNavigation(page: Page) {
  await page.evaluate(() =>
    document.addEventListener(
      "click",
      (e) => {
        const a = (e.target as HTMLElement).closest?.("a");
        if (a) e.preventDefault();
      },
      true,
    ),
  );
}

test("sign_up_started fires on the register page to GA4 + PostHog", async ({ page }) => {
  await page.addInitScript(INIT);
  await page.goto("/register", { waitUntil: "domcontentloaded" });
  await waitForEvent(page, "sign_up_started");
});

test("feature_cta_clicked fires with plan from a pricing card", async ({ page }) => {
  await page.addInitScript(INIT);
  await page.goto("/pricing", { waitUntil: "domcontentloaded" });
  await preventNavigation(page);
  await page.locator("a", { hasText: "Start with Starter" }).first().click();
  await waitForEvent(page, "feature_cta_clicked");

  const gtag = (await gtagEvents(page)).filter((e) => e.name === "feature_cta_clicked");
  const ph = (await phEvents(page)).filter((e) => e.name === "feature_cta_clicked");
  expect((gtag[0].params as { plan?: string }).plan).toBe("starter");
  expect((ph[0].params as { plan?: string }).plan).toBe("starter");
});

test("feature_cta_clicked fires from a marketing CTA", async ({ page }) => {
  await page.addInitScript(INIT);
  await page.goto("/", { waitUntil: "domcontentloaded" });
  await preventNavigation(page);
  await page.locator('a[href="/register"]').first().click();
  await waitForEvent(page, "feature_cta_clicked");
});
