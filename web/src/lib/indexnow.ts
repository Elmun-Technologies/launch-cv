/**
 * IndexNow: tells Bing, Yandex, Seznam, Naver and others (Bing powers DuckDuckGo,
 * Yahoo and ChatGPT search) that pages changed, so they recrawl in hours instead of
 * weeks. Google doesn't use IndexNow; it reads the sitemap.
 *
 * The key is public by design: the engines verify it by fetching
 * https://launch-cv.com/<key>.txt (public/<key>.txt). It proves we own the host,
 * nothing more.
 */

export const INDEXNOW_KEY = "3858e6c045a57cdccd322d9e15cd9393";
export const INDEXNOW_ENDPOINT = "https://api.indexnow.org/indexnow";
/** Protocol limit per request. */
export const INDEXNOW_MAX_URLS = 10_000;

export type SitemapEntry = { url: string; lastModified?: string | Date };

/** URLs changed within the last `days` (all of them when `all`), same host only, deduplicated. */
export function pickIndexNowUrls(entries: SitemapEntry[], host: string, now: Date, days: number, all = false): string[] {
  const since = now.getTime() - days * 86_400_000;
  const out = new Set<string>();
  for (const e of entries) {
    let u: URL;
    try {
      u = new URL(e.url);
    } catch {
      continue;
    }
    if (u.host !== host) continue;
    const t = e.lastModified ? new Date(e.lastModified).getTime() : NaN;
    if (all || (Number.isFinite(t) && t >= since)) out.add(u.toString());
  }
  return [...out].slice(0, INDEXNOW_MAX_URLS);
}

export function indexNowBody(host: string, urls: string[]) {
  return { host, key: INDEXNOW_KEY, keyLocation: `https://${host}/${INDEXNOW_KEY}.txt`, urlList: urls };
}
