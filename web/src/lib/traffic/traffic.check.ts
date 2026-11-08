/**
 * Self-checks for the pure parts of page analytics: user-agent parsing, bot
 * detection, channel grouping, path/UTM cleaning and date ranges. No database.
 * Run: npx tsx src/lib/traffic/traffic.check.ts
 */
import assert from "node:assert/strict";
import { isBot, parseUserAgent } from "@/lib/traffic/ua";
import { classifyChannel, referrerHostOf } from "@/lib/traffic/channel";
import { normalizePath, parseUtm } from "@/lib/traffic/collect";
import { addDays, parseTrafficQuery, zonedDay, zonedMidnight } from "@/lib/traffic/filters";
import { pageGroupOf } from "@/lib/traffic/queries";

const CHROME_MAC = "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const SAFARI_IPHONE = "Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1";
const EDGE_WIN = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36 Edg/131.0.0.0";
const ANDROID_TAB = "Mozilla/5.0 (Linux; Android 14; SM-X710) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";
const FIREFOX_LINUX = "Mozilla/5.0 (X11; Linux x86_64; rv:132.0) Gecko/20100101 Firefox/132.0";

let n = 0;
function check(name: string, fn: () => void) {
  fn();
  n += 1;
  console.log(`ok - ${name}`);
}

check("user-agent parsing", () => {
  assert.deepEqual(parseUserAgent(CHROME_MAC), { device: "desktop", browser: "Chrome", os: "macOS" });
  assert.deepEqual(parseUserAgent(SAFARI_IPHONE), { device: "mobile", browser: "Safari", os: "iOS" });
  assert.deepEqual(parseUserAgent(EDGE_WIN), { device: "desktop", browser: "Edge", os: "Windows" });
  assert.deepEqual(parseUserAgent(ANDROID_TAB), { device: "tablet", browser: "Chrome", os: "Android" });
  assert.deepEqual(parseUserAgent(FIREFOX_LINUX), { device: "desktop", browser: "Firefox", os: "Linux" });
  // iPadOS reports a Mac user-agent; touch points give it away.
  assert.deepEqual(parseUserAgent(CHROME_MAC.replace("Chrome/131.0.0.0 ", "Version/18.1 "), 5), { device: "tablet", browser: "Safari", os: "iPadOS" });
});

check("bot detection", () => {
  for (const ua of [CHROME_MAC, SAFARI_IPHONE, EDGE_WIN, ANDROID_TAB, FIREFOX_LINUX]) assert.equal(isBot(ua), false, ua);
  for (const ua of [
    "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)",
    "Mozilla/5.0 AppleWebKit/537.36 (KHTML, like Gecko; compatible; GPTBot/1.2; +https://openai.com/gptbot)",
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/131.0.0.0 Safari/537.36",
    "curl/8.5.0",
    "python-requests/2.32.3",
    "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)",
    "",
    null,
  ]) assert.equal(isBot(ua), true, String(ua));
});

check("channel grouping", () => {
  const c = (referrerHost: string | null, utmSource: string | null = null, utmMedium: string | null = null, adClick = false) =>
    classifyChannel({ referrerHost, utmSource, utmMedium, adClick });
  assert.equal(c(null), "Direct");
  assert.equal(c("google.com"), "Organic search");
  assert.equal(c("google.co.uk"), "Organic search");
  assert.equal(c("duckduckgo.com"), "Organic search");
  assert.equal(c("search.yahoo.com"), "Organic search");
  assert.equal(c("chatgpt.com"), "AI assistants");
  assert.equal(c(null, "chatgpt.com"), "AI assistants");
  assert.equal(c("perplexity.ai"), "AI assistants");
  assert.equal(c("gemini.google.com"), "AI assistants");
  assert.equal(c("t.co"), "Social");
  assert.equal(c("linkedin.com"), "Social");
  assert.equal(c("com.google.android.gm"), "Email");
  assert.equal(c(null, "newsletter", "email"), "Email");
  assert.equal(c("google.com", "google", "cpc"), "Paid");
  assert.equal(c(null, "facebook", "paid_social"), "Paid");
  assert.equal(c("google.com", null, null, true), "Paid");
  assert.equal(c("someblog.dev"), "Referral");
  assert.equal(c(null, "producthunt-launch"), "Referral");
});

check("referrer host", () => {
  const site = ["launch-cv.com", "localhost"];
  assert.equal(referrerHostOf("https://www.google.com/", site), "google.com");
  assert.equal(referrerHostOf("android-app://com.google.android.gm/", site), "com.google.android.gm");
  assert.equal(referrerHostOf("https://launch-cv.com/pricing", site), null);
  assert.equal(referrerHostOf("https://www.launch-cv.com/pricing", site), null);
  assert.equal(referrerHostOf("http://localhost:3000/", site), null);
  assert.equal(referrerHostOf("not a url", site), null);
  assert.equal(referrerHostOf("", site), null);
});

check("path and UTM cleaning", () => {
  assert.equal(normalizePath("/pricing?utm_source=x&email=a@b.c#top"), "/pricing");
  assert.equal(normalizePath("/blog/"), "/blog");
  assert.equal(normalizePath("/"), "/");
  assert.equal(normalizePath("/resume/clx9a8b7c6d5e4f3g2h1i0jkl/edit"), "/resume/:id/edit");
  assert.equal(normalizePath("/r/123e4567-e89b-12d3-a456-426614174000"), "/r/:id");
  assert.equal(normalizePath("https://evil.com/"), null);
  assert.equal(normalizePath("//evil.com/"), null);
  assert.equal(normalizePath(`/${"z".repeat(500)}`)?.length, 300);
  const u = parseUtm("utm_source=Google&utm_medium=CPC&utm_campaign=Fall%20Sale&gclid=abc&email=x");
  assert.deepEqual(u, { utmSource: "google", utmMedium: "cpc", utmCampaign: "Fall Sale", utmTerm: null, utmContent: null, adClick: true });
});

check("page groups", () => {
  assert.equal(pageGroupOf("/blog/how-to"), "/blog/*");
  assert.equal(pageGroupOf("/blog"), "/blog");
  assert.equal(pageGroupOf("/resume-examples/nurse"), "/resume-examples/*");
  assert.equal(pageGroupOf("/pricing"), "/pricing");
});

check("timezone ranges", () => {
  // New York midnight is 04:00 UTC in summer (EDT) and 05:00 UTC in winter (EST).
  assert.equal(zonedMidnight("2026-07-04", "America/New_York").toISOString(), "2026-07-04T04:00:00.000Z");
  assert.equal(zonedMidnight("2026-11-08", "America/New_York").toISOString(), "2026-11-08T05:00:00.000Z");
  assert.equal(zonedMidnight("2026-11-01", "America/New_York").toISOString(), "2026-11-01T04:00:00.000Z");
  assert.equal(zonedMidnight("2026-11-08", "UTC").toISOString(), "2026-11-08T00:00:00.000Z");
  assert.equal(zonedDay(new Date("2026-11-08T03:00:00Z"), "America/New_York"), "2026-11-07");
  assert.equal(addDays("2026-02-28", 1), "2026-03-01");

  const now = Date.parse("2026-11-08T15:30:00Z");
  const q7 = parseTrafficQuery({}, now);
  assert.equal(q7.preset, "7d");
  assert.equal(q7.fromDay, "2026-11-02");
  assert.equal(q7.from.toISOString(), "2026-11-02T05:00:00.000Z");
  assert.equal(q7.to.getTime(), now);
  assert.equal(q7.prevTo.getTime(), q7.from.getTime());
  assert.equal(q7.from.getTime() - q7.prevFrom.getTime(), q7.to.getTime() - q7.from.getTime());

  const y = parseTrafficQuery({ range: "yesterday", tz: "utc" }, now);
  assert.equal(y.from.toISOString(), "2026-11-07T00:00:00.000Z");
  assert.equal(y.to.toISOString(), "2026-11-08T00:00:00.000Z");
  assert.equal(y.granularity, "hour");

  const c = parseTrafficQuery({ range: "custom", from: "2026-10-10", to: "2026-10-01", country: "us", device: "phone", source: "Social" }, now);
  assert.equal(c.fromDay, "2026-10-01");
  assert.equal(c.toDay, "2026-10-10");
  assert.equal(c.country, "US");
  assert.equal(c.device, null);
  assert.equal(c.channel, "Social");
  const bad = parseTrafficQuery({ range: "custom", from: "x" }, now);
  assert.equal(bad.preset, "7d");
});

console.log(`\n${n} checks passed`);
