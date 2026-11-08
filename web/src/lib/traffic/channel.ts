/**
 * Channel grouping for page analytics: where a session came from, from its
 * referrer host and UTM tags. Rules run in this order, first match wins:
 *
 *   Paid           utm_medium cpc / ppc / paid* / display / cpm, or a Google /
 *                  Microsoft ad click id
 *   Email          utm_medium email / newsletter, or a webmail referrer
 *   AI assistants  chatgpt.com, perplexity, claude.ai, gemini, copilot (referrer or utm_source)
 *   Social         a social network referrer, or utm_medium social
 *   Organic search google, bing, duckduckgo, yahoo, ecosia, baidu, yandex (and a few more)
 *   Referral       any other referrer, or a utm_source with nothing above
 *   Direct         nothing at all
 *
 * Pure; shared by the collector and the admin filters.
 */

export const CHANNELS = ["Direct", "Organic search", "AI assistants", "Social", "Email", "Paid", "Referral"] as const;
export type Channel = (typeof CHANNELS)[number];

export function isChannel(v: string | null | undefined): v is Channel {
  return !!v && (CHANNELS as readonly string[]).includes(v);
}

const hostIs = (host: string, re: RegExp) => re.test(host);

const SEARCH_RE =
  /(^|\.)(google\.[a-z.]{2,8}|bing\.com|duckduckgo\.com|yahoo\.(com|co\.[a-z]{2}|[a-z]{2})|search\.yahoo\.com|ecosia\.org|baidu\.com|yandex\.(ru|com|com\.tr|by|kz|ua)|ya\.ru|naver\.com|seznam\.cz|qwant\.com|startpage\.com|search\.brave\.com|presearch\.com|ask\.com|aol\.com|so\.com|sogou\.com)$/;
const AI_RE =
  /(^|\.)(chatgpt\.com|chat\.openai\.com|openai\.com|perplexity\.ai|claude\.ai|gemini\.google\.com|bard\.google\.com|copilot\.microsoft\.com|copilot\.com|you\.com|phind\.com|meta\.ai|chat\.mistral\.ai|deepseek\.com|chat\.deepseek\.com|grok\.com|poe\.com)$/;
const SOCIAL_RE =
  /(^|\.)(facebook\.com|fb\.com|fb\.me|instagram\.com|t\.co|twitter\.com|x\.com|linkedin\.com|lnkd\.in|reddit\.com|youtube\.com|youtu\.be|tiktok\.com|pinterest\.[a-z.]+|pin\.it|threads\.net|threads\.com|quora\.com|news\.ycombinator\.com|tumblr\.com|vk\.com|telegram\.org|t\.me|discord\.com|discord\.gg|bsky\.app|mastodon\.social|snapchat\.com|whatsapp\.com|wa\.me|producthunt\.com)$/;
const WEBMAIL_RE =
  /(^|\.)(mail\.google\.com|com\.google\.android\.gm|outlook\.live\.com|outlook\.office\.com|outlook\.office365\.com|mail\.yahoo\.com|mail\.aol\.com|mail\.proton\.me|app\.fastmail\.com|mail\.zoho\.com|icloud\.com)$/;

const PAID_MEDIA = new Set(["cpc", "ppc", "paid", "paidsearch", "paid-search", "paid_search", "paidsocial", "paid-social", "paid_social", "display", "cpm", "cpv", "cpa", "banner", "retargeting", "ads", "ad"]);
const EMAIL_MEDIA = new Set(["email", "e-mail", "e_mail", "newsletter", "mail"]);
const SOCIAL_MEDIA = new Set(["social", "social-media", "social_media", "sm", "social-network", "organic-social", "organic_social"]);

export type ChannelInput = {
  referrerHost: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  /** The landing URL carried gclid / msclkid / dclid (an ad click). */
  adClick?: boolean;
};

export function classifyChannel({ referrerHost, utmSource, utmMedium, adClick }: ChannelInput): Channel {
  const host = (referrerHost ?? "").toLowerCase();
  const medium = (utmMedium ?? "").trim().toLowerCase();
  const source = (utmSource ?? "").trim().toLowerCase().replace(/^www\./, "");

  if (PAID_MEDIA.has(medium) || medium.startsWith("paid") || medium.includes("cpc") || adClick) return "Paid";
  if (EMAIL_MEDIA.has(medium) || /newsletter|e-?mail/.test(source) || (host && hostIs(host, WEBMAIL_RE))) return "Email";
  if ((host && hostIs(host, AI_RE)) || (source && hostIs(source, AI_RE)) || /^(chatgpt|perplexity|claude|gemini|copilot)$/.test(source)) return "AI assistants";
  if (SOCIAL_MEDIA.has(medium) || (host && hostIs(host, SOCIAL_RE)) || (source && hostIs(source, SOCIAL_RE)) || /^(facebook|instagram|twitter|linkedin|reddit|youtube|tiktok|threads|x)$/.test(source)) return "Social";
  if (medium === "organic" || (host && hostIs(host, SEARCH_RE)) || /^(google|bing|duckduckgo|yahoo|ecosia|baidu|yandex)$/.test(source)) return "Organic search";
  if (host || source) return "Referral";
  return "Direct";
}

/**
 * Host part of a referrer URL, lowercased, without "www." and port. Android
 * app referrers ("android-app://com.google.android.gm/") give the package.
 * Null for empty, unparsable or same-site referrers.
 */
export function referrerHostOf(referrer: string | null | undefined, siteHosts: string[]): string | null {
  if (!referrer) return null;
  let host = "";
  try {
    const u = new URL(referrer.slice(0, 2000));
    host = u.protocol === "android-app:" ? u.host || u.pathname.replace(/^\/+/, "").split("/")[0] : u.hostname;
  } catch {
    return null;
  }
  host = host.toLowerCase().replace(/^www\./, "").replace(/\.$/, "");
  if (!host || host.length > 120 || !/^[a-z0-9.-]+$/.test(host)) return null;
  if (siteHosts.some((h) => host === h || host.endsWith(`.${h}`))) return null;
  return host;
}
