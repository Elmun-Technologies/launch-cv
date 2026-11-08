/**
 * Small user-agent parser for first-party page analytics (POST /api/t).
 * Good enough for "which browser / OS / device class" breakdowns; it is not a
 * fingerprinting tool and returns coarse names only. Pure, no dependencies.
 */

export type Device = "mobile" | "tablet" | "desktop";
export type ParsedUa = { device: Device; browser: string | null; os: string | null };

/**
 * Crawlers, link unfurlers, uptime checks, headless browsers and HTTP
 * libraries. Matched case-insensitively against the whole user-agent.
 */
const BOT_RE =
  /bot\b|bot\/|crawl|spider|slurp|scrap|archiver|facebookexternalhit|facebookcatalog|embedly|quora link preview|whatsapp|telegrambot|discordbot|slackbot|skypeuripreview|bitlybot|vkshare|pinterestbot|redditbot|linkedinbot|twitterbot|applebot|bingpreview|google-inspectiontool|googleother|google-read-aloud|feedfetcher|mediapartners|adsbot|apis-google|chrome-lighthouse|lighthouse|pagespeed|gtmetrix|headlesschrome|headless|phantomjs|selenium|puppeteer|playwright|electron\/|python|curl\/|wget|httpclient|http-client|okhttp|axios|node-fetch|undici|go-http|java\/|libwww|perl|ruby|php\/|postman|insomnia|ahrefs|semrush|mj12|dotbot|petalbot|bytespider|gptbot|chatgpt-user|oai-searchbot|claudebot|claude-web|anthropic|perplexity|ccbot|cohere|diffbot|yandex(bot|images|metrika)|baiduspider|duckduckbot|duckassistbot|sogou|exabot|seznambot|uptime|pingdom|statuscake|site24x7|newrelic|datadog|checkly|monitor|vercel-screenshot|vercelbot|prerender|preview/i;

/** True for automated clients. An empty or very short user-agent counts as a bot. */
export function isBot(ua: string | null | undefined): boolean {
  if (!ua || ua.length < 20) return true;
  return BOT_RE.test(ua);
}

function browserOf(ua: string): string | null {
  if (/edg(e|a|ios)?\//i.test(ua)) return "Edge";
  if (/opr\/|opera|opios/i.test(ua)) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  if (/yabrowser/i.test(ua)) return "Yandex";
  if (/ucbrowser/i.test(ua)) return "UC Browser";
  if (/duckduckgo\//i.test(ua)) return "DuckDuckGo";
  if (/vivaldi/i.test(ua)) return "Vivaldi";
  if (/fban|fbav|instagram|linkedinapp|musical_ly|tiktok|snapchat|; wv\)/i.test(ua)) return "In-app browser";
  if (/firefox|fxios/i.test(ua)) return "Firefox";
  if (/crios|chrome|chromium/i.test(ua)) return "Chrome";
  if (/msie|trident/i.test(ua)) return "Internet Explorer";
  if (/safari/i.test(ua) && /version\//i.test(ua)) return "Safari";
  if (/applewebkit/i.test(ua) && /mobile/i.test(ua)) return "Safari";
  return null;
}

function osOf(ua: string): string | null {
  if (/windows phone/i.test(ua)) return "Windows Phone";
  if (/windows/i.test(ua)) return "Windows";
  if (/ipad/i.test(ua)) return "iPadOS";
  if (/iphone|ipod/i.test(ua)) return "iOS";
  if (/android/i.test(ua)) return "Android";
  if (/cros/i.test(ua)) return "ChromeOS";
  if (/mac os x|macintosh/i.test(ua)) return "macOS";
  if (/linux|x11/i.test(ua)) return "Linux";
  return null;
}

function deviceOf(ua: string, touchPoints: number): Device {
  if (/ipad|tablet|kindle|silk|playbook|nexus (7|9|10)|sm-t\d|tab\b/i.test(ua)) return "tablet";
  // Android tablets send no "Mobile" token.
  if (/android/i.test(ua) && !/mobile/i.test(ua)) return "tablet";
  if (/mobi|iphone|ipod|android|blackberry|opera mini|iemobile|windows phone/i.test(ua)) return "mobile";
  // iPadOS 13+ claims to be a Mac; a touch screen gives it away.
  if (/macintosh/i.test(ua) && touchPoints > 1) return "tablet";
  return "desktop";
}

export function parseUserAgent(ua: string, touchPoints = 0): ParsedUa {
  const device = deviceOf(ua, touchPoints);
  let os = osOf(ua);
  if (device === "tablet" && os === "macOS") os = "iPadOS";
  return { device, browser: browserOf(ua), os };
}
