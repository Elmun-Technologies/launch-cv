/**
 * Site verification meta tags and marketing pixels (Admin → Integrations).
 *
 * Pure and dependency-free, so the same parsers run on the server (saving,
 * testing and rendering) and in the browser (loading pixels). Every id is
 * checked against a strict pattern before it is rendered: pixel ids end up in
 * inline scripts, so nothing that fails these checks ever reaches a page.
 */

export type ParseResult = { ok: true; value: string } | { ok: false; error: string };

/* ───────────────────────── Site verification ───────────────────────── */

export const VERIFICATIONS = {
  gsc: { name: "Google Search Console", meta: "google-site-verification", pattern: /^[A-Za-z0-9_-]{20,100}$/, example: "a 43-character code like dz90Yv149kX83SmM…" },
  bing: { name: "Bing Webmaster Tools", meta: "msvalidate.01", pattern: /^[A-Fa-f0-9]{32}$/, example: "32 hex characters like 1A2B3C…" },
  yandex: { name: "Yandex Webmaster", meta: "yandex-verification", pattern: /^[A-Za-z0-9]{12,40}$/, example: "16 characters like 5c8a6e3d2b1f4a7e" },
  fbdomain: { name: "Meta domain verification", meta: "facebook-domain-verification", pattern: /^[a-z0-9]{20,40}$/, example: "30 lowercase letters and digits" },
  pinterest: { name: "Pinterest", meta: "p:domain_verify", pattern: /^[A-Fa-f0-9]{32}$/, example: "32 hex characters" },
} as const;
export type VerificationProvider = keyof typeof VERIFICATIONS;
export const VERIFICATION_PROVIDERS = Object.keys(VERIFICATIONS) as VerificationProvider[];

export function isVerificationProvider(id: string): id is VerificationProvider {
  return id in VERIFICATIONS;
}

/** Value of `attr` in a pasted tag, quoted or not. */
function attr(tag: string, name: string): string | null {
  const re = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'>/]+))`, "i");
  const m = tag.match(re);
  return m ? (m[1] ?? m[2] ?? m[3] ?? "").trim() : null;
}

/**
 * The verification code from either the bare code or the whole
 * `<meta name="…" content="…">` tag the provider shows. A pasted tag for a
 * different service (e.g. Bing's tag in the Google field) is refused.
 */
export function parseVerification(provider: VerificationProvider, raw: string): ParseResult {
  const def = VERIFICATIONS[provider];
  let v = (raw ?? "").trim();
  if (!v) return { ok: false, error: "Paste the verification code or the whole <meta> tag" };
  if (/[<>]|\bcontent\s*=/i.test(v)) {
    const name = attr(v, "name") ?? attr(v, "property");
    if (name && name.toLowerCase() !== def.meta.toLowerCase()) {
      return { ok: false, error: `That tag is for "${name}"; ${def.name} uses name="${def.meta}"` };
    }
    const content = attr(v, "content");
    if (!content) return { ok: false, error: "Couldn't find content=\"…\" in the pasted tag" };
    v = content;
  }
  if (!def.pattern.test(v)) return { ok: false, error: `That doesn't look like a ${def.name} code (expected ${def.example})` };
  return { ok: true, value: v };
}

/* ───────────────────────── Pixels and tags ───────────────────────── */

type PixelDef = {
  name: string;
  /** The id on its own, after trimming. */
  pattern: RegExp;
  /** Patterns that find the id inside a pasted snippet; group 1 is the id. */
  inSnippet: RegExp[];
  normalize: (s: string) => string;
  example: string;
};

export const PIXELS = {
  gtm: {
    name: "Google Tag Manager",
    pattern: /^GTM-[A-Z0-9]{4,10}$/,
    inSnippet: [/\b(GTM-[A-Z0-9]{4,10})\b/i],
    normalize: (s) => s.toUpperCase(),
    example: "GTM-XXXXXXX",
  },
  metapixel: {
    name: "Meta Pixel",
    pattern: /^\d{15,16}$/,
    inSnippet: [/fbq\(\s*['"]init['"]\s*,\s*['"]?(\d{15,16})\b/, /facebook\.com\/tr\?id=(\d{15,16})\b/],
    normalize: (s) => s,
    example: "15–16 digits",
  },
  tiktok: {
    name: "TikTok Pixel",
    pattern: /^[A-Z0-9]{20}$/,
    inSnippet: [/ttq\.load\(\s*['"]([A-Za-z0-9]{20})['"]/, /sdkid=([A-Za-z0-9]{20})\b/],
    normalize: (s) => s.toUpperCase(),
    example: "20 letters and digits like C4ABCDEFGHIJ12345678",
  },
  clarity: {
    name: "Microsoft Clarity",
    pattern: /^[a-z0-9]{8,12}$/,
    inSnippet: [/clarity\.ms\/tag\/([a-z0-9]{8,12})\b/i, /["']clarity["']\s*,\s*["']script["']\s*,\s*["']([a-z0-9]{8,12})["']/i],
    normalize: (s) => s.toLowerCase(),
    example: "10 letters and digits like k5x2e9abcd",
  },
  linkedin: {
    name: "LinkedIn Insight Tag",
    pattern: /^\d{4,10}$/,
    inSnippet: [/_linkedin_partner_id\s*=\s*["']?(\d{4,10})\b/, /[?&]pid=(\d{4,10})\b/],
    normalize: (s) => s,
    example: "a number like 1234567",
  },
  reddit: {
    name: "Reddit Pixel",
    pattern: /^(?:a2|t2)_[a-z0-9]{3,20}$/,
    inSnippet: [/rdt\(\s*['"]init['"]\s*,\s*['"]((?:a2|t2)_[A-Za-z0-9]{3,20})['"]/],
    normalize: (s) => s.toLowerCase(),
    example: "an id like a2_abcd1234efgh",
  },
} satisfies Record<string, PixelDef>;
export type PixelProvider = keyof typeof PIXELS;
export const PIXEL_PROVIDERS = Object.keys(PIXELS) as PixelProvider[];

export function isPixelProvider(id: string): id is PixelProvider {
  return id in PIXELS;
}

/** The id from the bare id or a pasted install snippet. */
export function parsePixelId(provider: PixelProvider, raw: string): ParseResult {
  const def: PixelDef = PIXELS[provider];
  const v = (raw ?? "").trim();
  if (!v) return { ok: false, error: `Paste the ${def.name} id` };
  const direct = def.normalize(v);
  if (def.pattern.test(direct)) return { ok: true, value: direct };
  for (const re of def.inSnippet) {
    const m = v.match(re);
    if (m?.[1] && def.pattern.test(def.normalize(m[1]))) return { ok: true, value: def.normalize(m[1]) };
  }
  return { ok: false, error: `That doesn't look like a ${def.name} id (expected ${def.example})` };
}

/** Parse a stored value of either kind; null for providers without a format. */
export function parseSiteTag(provider: string, raw: string): ParseResult | null {
  if (isVerificationProvider(provider)) return parseVerification(provider, raw);
  if (isPixelProvider(provider)) return parsePixelId(provider, raw);
  return null;
}

/** Valid pixel ids only; anything malformed is dropped. */
export function validPixelIds(raw: Partial<Record<PixelProvider, string | undefined>>): Partial<Record<PixelProvider, string>> {
  const out: Partial<Record<PixelProvider, string>> = {};
  for (const p of PIXEL_PROVIDERS) {
    const v = raw[p];
    if (!v) continue;
    const r = parsePixelId(p, v);
    if (r.ok) out[p] = r.value;
  }
  return out;
}

/**
 * The vendor's standard install snippet for an id. The id must already have
 * passed parsePixelId (it is checked again here and JSON-quoted).
 */
export function pixelSnippet(provider: PixelProvider, id: string): string | null {
  if (!parsePixelId(provider, id).ok) return null;
  const q = JSON.stringify(id);
  switch (provider) {
    case "gtm":
      return `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${q});`;
    case "metapixel":
      return `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${q});fbq('track','PageView');`;
    case "tiktok":
      return `!function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js";ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};ttq.load(${q});ttq.page();}(window,document,'ttq');`;
    case "clarity":
      return `(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script",${q});`;
    case "linkedin":
      return `window._linkedin_partner_id=${q};window._linkedin_data_partner_ids=window._linkedin_data_partner_ids||[];window._linkedin_data_partner_ids.push(window._linkedin_partner_id);(function(l){if(!l){window.lintrk=function(a,b){window.lintrk.q.push([a,b])};window.lintrk.q=[]}var s=document.getElementsByTagName("script")[0];var b=document.createElement("script");b.type="text/javascript";b.async=true;b.src="https://snap.licdn.com/li.lms-analytics/insight.min.js";s.parentNode.insertBefore(b,s);})(window.lintrk);`;
    case "reddit":
      return `!function(w,d){if(!w.rdt){var p=w.rdt=function(){p.sendEvent?p.sendEvent.apply(p,arguments):p.callQueue.push(arguments)};p.callQueue=[];var t=d.createElement("script");t.src="https://www.redditstatic.com/ads/pixel.js",t.async=!0;var s=d.getElementsByTagName("script")[0];s.parentNode.insertBefore(t,s)}}(window,document);rdt('init',${q});rdt('track','PageVisit');`;
  }
}

/** Hosts each pixel loads from (for tests and a future Content-Security-Policy). */
export const PIXEL_HOSTS: Record<PixelProvider, string[]> = {
  gtm: ["www.googletagmanager.com"],
  metapixel: ["connect.facebook.net", "www.facebook.com"],
  tiktok: ["analytics.tiktok.com"],
  clarity: ["www.clarity.ms"],
  linkedin: ["snap.licdn.com", "px.ads.linkedin.com"],
  reddit: ["www.redditstatic.com", "alb.reddit.com"],
};
