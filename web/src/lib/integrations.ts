import { prisma } from "@/lib/prisma";
import { lastFour, open, seal, secretBoxReady } from "@/lib/secret-box";
import { logError } from "@/lib/redact";
import { parseSiteTag, PIXELS, VERIFICATIONS, type PixelProvider, type VerificationProvider } from "@/lib/site-tags";

/**
 * External-service credentials, managed from Admin → Integrations.
 *
 * Values entered in the admin panel are stored encrypted in IntegrationSecret
 * and take precedence. When a value has never been set there, the matching
 * environment variable is used, so existing deployments keep working while
 * keys are moved into the panel one by one.
 */

export type FieldDef = {
  key: string;
  label: string;
  /** Secret fields are write-only in the UI and shown as ••••last4. */
  secret: boolean;
  env?: string;
  placeholder?: string;
  help?: string;
  /** Allowed values for a choice field. */
  options?: string[];
  /** "Where to find it" link shown under the field. */
  helpUrl?: string;
};

export type ProviderDef = {
  id: string;
  name: string;
  group: "AI models" | "Payments" | "Email" | "Sign-in" | "Analytics" | "Site verification" | "Pixels & tags";
  purpose: string;
  /** Fields that must be set for the provider to count as connected. */
  required: string[];
  fields: FieldDef[];
  docsUrl?: string;
  /** Label of the docsUrl link (default "Get keys"). */
  docsLabel?: string;
  /** Tile colors for the provider's initial (v5 palette, picked per brand). */
  tile: { bg: string; fg: string };
};

const INK = { bg: "#111118", fg: "#ffffff" };

/** Verification codes: one field each, rendered as <meta> in every page's <head> (components/site-verification-meta.tsx). */
const VERIFY_INFO: Record<VerificationProvider, { env: string; docsUrl: string; helpUrl: string; help: string; tile: ProviderDef["tile"] }> = {
  gsc: {
    env: "GOOGLE_SITE_VERIFICATION",
    docsUrl: "https://search.google.com/search-console",
    helpUrl: "https://support.google.com/webmasters/answer/9008080",
    help: "Search Console → Add property → URL prefix → HTML tag. Paste the code or the whole <meta> tag.",
    tile: { bg: "#f2a91f", fg: "#111118" },
  },
  bing: {
    env: "BING_SITE_VERIFICATION",
    docsUrl: "https://www.bing.com/webmasters",
    helpUrl: "https://www.bing.com/webmasters/help/add-and-verify-site-12184f8b",
    help: "Bing Webmaster Tools → Add a site → HTML Meta Tag (msvalidate.01). Paste the code or the whole <meta> tag.",
    tile: { bg: "#c9c0ff", fg: "#111118" },
  },
  yandex: {
    env: "YANDEX_VERIFICATION",
    docsUrl: "https://webmaster.yandex.com/",
    helpUrl: "https://yandex.com/support/webmaster/service/rights.html",
    help: "Yandex Webmaster → Add site → Meta tag. Paste the code or the whole <meta> tag.",
    tile: { bg: "#ff7a33", fg: "#111118" },
  },
  fbdomain: {
    env: "FACEBOOK_DOMAIN_VERIFICATION",
    docsUrl: "https://business.facebook.com/settings/owned-domains",
    helpUrl: "https://www.facebook.com/business/help/321167023127050",
    help: "Business settings → Brand safety → Domains → Add → Meta-tag verification. Paste the code or the whole <meta> tag.",
    tile: { bg: "#5440e8", fg: "#ffffff" },
  },
  pinterest: {
    env: "PINTEREST_DOMAIN_VERIFY",
    docsUrl: "https://www.pinterest.com/settings/claim",
    helpUrl: "https://help.pinterest.com/en/business/article/claim-your-website",
    help: "Pinterest settings → Claimed accounts → Websites → Claim → Add HTML tag. Paste the code or the whole <meta> tag.",
    tile: { bg: "#c42b30", fg: "#ffffff" },
  },
};

/** Pixels: loaded in the browser only after the visitor accepts the cookie notice (components/marketing-pixels.tsx). */
const PIXEL_INFO: Record<
  PixelProvider,
  { field: string; label: string; env: string; purpose: string; docsUrl: string; helpUrl: string; help: string; tile: ProviderDef["tile"] }
> = {
  gtm: {
    field: "containerId",
    label: "Container ID",
    env: "NEXT_PUBLIC_GTM_ID",
    purpose: "Loads the tags you manage in Google Tag Manager",
    docsUrl: "https://tagmanager.google.com/",
    helpUrl: "https://support.google.com/tagmanager/answer/6103696",
    help: "Tag Manager → your container: the GTM-XXXXXXX id at the top. Tags you add there also load only after cookie consent.",
    tile: { bg: "#f2a91f", fg: "#111118" },
  },
  metapixel: {
    field: "pixelId",
    label: "Pixel ID",
    env: "NEXT_PUBLIC_META_PIXEL_ID",
    purpose: "Facebook and Instagram ad conversions and audiences",
    docsUrl: "https://business.facebook.com/events_manager2",
    helpUrl: "https://www.facebook.com/business/help/952192354843755",
    help: "Events Manager → Data sources → your pixel → Settings: the 15–16 digit Pixel ID.",
    tile: { bg: "#5440e8", fg: "#ffffff" },
  },
  tiktok: {
    field: "pixelId",
    label: "Pixel ID",
    env: "NEXT_PUBLIC_TIKTOK_PIXEL_ID",
    purpose: "TikTok ad conversions and audiences",
    docsUrl: "https://ads.tiktok.com/i18n/events_manager",
    helpUrl: "https://ads.tiktok.com/help/article/get-started-pixel",
    help: "TikTok Ads Manager → Tools → Events → Web events: the pixel's 20-character ID.",
    tile: INK,
  },
  clarity: {
    field: "projectId",
    label: "Project ID",
    env: "NEXT_PUBLIC_CLARITY_PROJECT_ID",
    purpose: "Free heatmaps and session recordings",
    docsUrl: "https://clarity.microsoft.com/",
    helpUrl: "https://learn.microsoft.com/en-us/clarity/setup-and-installation/clarity-setup",
    help:
      "Free, unlimited heatmaps and session recordings: the quickest way to see where visitors get stuck. Clarity → Settings → Overview: the Project ID. Keep masking on Balanced or Strict, because the free ATS check and free tools have boxes where people paste resumes.",
    tile: { bg: "#c9c0ff", fg: "#111118" },
  },
  linkedin: {
    field: "partnerId",
    label: "Partner ID",
    env: "NEXT_PUBLIC_LINKEDIN_PARTNER_ID",
    purpose: "LinkedIn ad conversions and audiences",
    docsUrl: "https://www.linkedin.com/campaignmanager",
    helpUrl: "https://business.linkedin.com/marketing-solutions/insight-tag",
    help: "Campaign Manager → Analyze → Insight Tag → Install my Insight Tag: the number after _linkedin_partner_id.",
    tile: INK,
  },
  reddit: {
    field: "pixelId",
    label: "Pixel ID",
    env: "NEXT_PUBLIC_REDDIT_PIXEL_ID",
    purpose: "Reddit ad conversions and audiences",
    docsUrl: "https://ads.reddit.com/",
    helpUrl: "https://business.reddithelp.com/s/article/Install-the-Reddit-Pixel-on-your-website",
    help: "Reddit Ads → Events Manager → Reddit Pixel: the id that starts with a2_ or t2_.",
    tile: { bg: "#ff7a33", fg: "#111118" },
  },
};

/** Field that holds a pixel's id ("containerId", "pixelId", …). */
export function pixelField(id: PixelProvider): string {
  return PIXEL_INFO[id].field;
}

/** Field that holds a verification code. */
export const VERIFICATION_FIELD = "code";

const VERIFY_PROVIDERS: ProviderDef[] = (Object.keys(VERIFY_INFO) as VerificationProvider[]).map((id) => ({
  id,
  name: VERIFICATIONS[id].name,
  group: "Site verification",
  purpose: `Proves you own the site with a <meta name="${VERIFICATIONS[id].meta}"> tag on every page`,
  required: [VERIFICATION_FIELD],
  docsUrl: VERIFY_INFO[id].docsUrl,
  docsLabel: "Open dashboard",
  tile: VERIFY_INFO[id].tile,
  fields: [
    {
      key: VERIFICATION_FIELD,
      label: "Verification code",
      secret: false,
      env: VERIFY_INFO[id].env,
      placeholder: `<meta name="${VERIFICATIONS[id].meta}" content="…"> or just the code`,
      help: VERIFY_INFO[id].help,
      helpUrl: VERIFY_INFO[id].helpUrl,
    },
  ],
}));

const PIXEL_PROVIDER_DEFS: ProviderDef[] = (Object.keys(PIXEL_INFO) as PixelProvider[]).map((id) => ({
  id,
  name: PIXELS[id].name,
  group: "Pixels & tags",
  purpose: `${PIXEL_INFO[id].purpose}; loads only after a visitor accepts cookies`,
  required: [PIXEL_INFO[id].field],
  docsUrl: PIXEL_INFO[id].docsUrl,
  docsLabel: "Open dashboard",
  tile: PIXEL_INFO[id].tile,
  fields: [
    {
      key: PIXEL_INFO[id].field,
      label: PIXEL_INFO[id].label,
      secret: false,
      env: PIXEL_INFO[id].env,
      placeholder: PIXELS[id].example,
      help: PIXEL_INFO[id].help,
      helpUrl: PIXEL_INFO[id].helpUrl,
    },
  ],
}));

export const PROVIDERS: ProviderDef[] = [
  {
    id: "openai",
    name: "OpenAI",
    group: "AI models",
    purpose: "Free ATS check, job match, rewrites, packets, role fit, imports",
    required: ["apiKey"],
    docsUrl: "https://platform.openai.com/api-keys",
    tile: INK,
    fields: [{ key: "apiKey", label: "API key", secret: true, env: "OPENAI_API_KEY", placeholder: "sk-…" }],
  },
  {
    id: "anthropic",
    name: "Claude (Anthropic)",
    group: "AI models",
    purpose: "Runs any AI tool set to a Claude model in Limits & budgets → Models",
    required: ["apiKey"],
    docsUrl: "https://console.anthropic.com/settings/keys",
    tile: INK,
    fields: [{ key: "apiKey", label: "API key", secret: true, env: "ANTHROPIC_API_KEY", placeholder: "sk-ant-…" }],
  },
  {
    id: "polar",
    name: "Polar",
    group: "Payments",
    purpose: "Checkout, subscriptions, billing portal",
    required: ["accessToken", "webhookSecret"],
    docsUrl: "https://polar.sh/dashboard",
    tile: { bg: "#5440e8", fg: "#ffffff" },
    fields: [
      { key: "accessToken", label: "Access token", secret: true, env: "POLAR_ACCESS_TOKEN", placeholder: "polar_oat_…" },
      { key: "webhookSecret", label: "Webhook secret", secret: true, env: "POLAR_WEBHOOK_SECRET" },
      { key: "server", label: "Environment", secret: false, env: "POLAR_SERVER", options: ["production", "sandbox"] },
      { key: "productWeek", label: "Product ID — Week Pass (one-time)", secret: false, env: "POLAR_PRODUCT_WEEK" },
      { key: "productProfessional", label: "Product ID — Pro (monthly)", secret: false, env: "POLAR_PRODUCT_PROFESSIONAL" },
      { key: "productQuarter", label: "Product ID — 90-Day Pass (one-time)", secret: false, env: "POLAR_PRODUCT_QUARTER" },
      { key: "productStarter", label: "Product ID — Starter (legacy)", secret: false, env: "POLAR_PRODUCT_STARTER" },
      { key: "productLifetime", label: "Product ID — Lifetime (legacy)", secret: false, env: "POLAR_PRODUCT_LIFETIME" },
      { key: "productElite", label: "Product ID — Elite (legacy)", secret: false, env: "POLAR_PRODUCT_ELITE" },
      { key: "portalUrl", label: "Customer portal URL", secret: false, env: "NEXT_PUBLIC_POLAR_PORTAL_URL" },
    ],
  },
  {
    id: "resend",
    name: "Resend",
    group: "Email",
    purpose: "Verification, password reset and receipts",
    required: ["apiKey", "fromEmail"],
    docsUrl: "https://resend.com/api-keys",
    tile: INK,
    fields: [
      { key: "apiKey", label: "API key", secret: true, env: "RESEND_API_KEY", placeholder: "re_…" },
      { key: "fromEmail", label: "Sender", secret: false, env: "RESEND_FROM_EMAIL", placeholder: "LaunchCV <info@launch-cv.com>", help: "Use a name and an address on a domain verified in Resend, e.g. LaunchCV <info@launch-cv.com>." },
    ],
  },
  {
    id: "google",
    name: "Google sign-in",
    group: "Sign-in",
    purpose: "“Continue with Google” on login and register",
    required: ["clientId", "clientSecret"],
    docsUrl: "https://console.cloud.google.com/apis/credentials",
    tile: { bg: "#ff7a33", fg: "#111118" },
    fields: [
      { key: "clientId", label: "Client ID", secret: false, env: "GOOGLE_CLIENT_ID" },
      { key: "clientSecret", label: "Client secret", secret: true, env: "GOOGLE_CLIENT_SECRET" },
      { key: "redirectUri", label: "Redirect URI override", secret: false, env: "GOOGLE_REDIRECT_URI", help: "Leave empty to use https://<your site>/api/auth/google/callback." },
    ],
  },
  {
    id: "ga4",
    name: "Google Analytics 4",
    group: "Analytics",
    purpose: "Traffic and conversions",
    required: ["measurementId"],
    tile: { bg: "#f2a91f", fg: "#111118" },
    fields: [
      { key: "measurementId", label: "Measurement ID", secret: false, env: "NEXT_PUBLIC_GA_MEASUREMENT_ID", placeholder: "G-…" },
      { key: "apiSecret", label: "Measurement Protocol secret", secret: true, env: "GA_API_SECRET", help: "Only for server-side purchase events." },
    ],
  },
  {
    id: "posthog",
    name: "PostHog",
    group: "Analytics",
    purpose: "Product analytics",
    required: ["key"],
    tile: INK,
    fields: [
      { key: "key", label: "Project API key", secret: false, env: "NEXT_PUBLIC_POSTHOG_KEY", placeholder: "phc_…" },
      { key: "host", label: "Host", secret: false, env: "NEXT_PUBLIC_POSTHOG_HOST", placeholder: "https://us.i.posthog.com" },
    ],
  },
  {
    id: "mixpanel",
    name: "Mixpanel",
    group: "Analytics",
    purpose: "Product analytics",
    required: ["token"],
    tile: { bg: "#c9c0ff", fg: "#111118" },
    fields: [
      { key: "token", label: "Project token", secret: false, env: "NEXT_PUBLIC_MIXPANEL_TOKEN" },
      { key: "host", label: "API host", secret: false, env: "NEXT_PUBLIC_MIXPANEL_HOST", placeholder: "https://api.mixpanel.com" },
    ],
  },
  ...VERIFY_PROVIDERS,
  ...PIXEL_PROVIDER_DEFS,
];

export function providerDef(id: string): ProviderDef | undefined {
  return PROVIDERS.find((p) => p.id === id);
}

type Row = {
  provider: string;
  field: string;
  value: string | null;
  last4: string;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
  updatedById: string | null;
  rotatedAt: Date | null;
  testedAt: Date | null;
  testOk: boolean | null;
  testError: string | null;
  testMs: number | null;
};

const TTL_MS = 60_000;
let cache: { at: number; rows: Map<string, Row> } | null = null;

function k(provider: string, field: string) {
  return `${provider}.${field}`;
}

async function loadRows(maxAgeMs = TTL_MS): Promise<Map<string, Row>> {
  if (cache && Date.now() - cache.at < maxAgeMs) return cache.rows;
  const rows = new Map<string, Row>();
  try {
    const db = await prisma.integrationSecret.findMany();
    for (const r of db) {
      let value: string | null = null;
      try {
        value = open(r.ciphertext);
      } catch {
        value = null; // wrong/missing master key — treated as not set
      }
      rows.set(k(r.provider, r.field), {
        provider: r.provider,
        field: r.field,
        value,
        last4: r.last4,
        createdAt: r.createdAt,
        updatedAt: r.updatedAt,
        createdById: r.createdById,
        updatedById: r.updatedById,
        rotatedAt: r.rotatedAt,
        testedAt: r.testedAt,
        testOk: r.testOk,
        testError: r.testError,
        testMs: r.testMs,
      });
    }
  } catch {
    // Database unreachable (e.g. during build) — fall back to env only.
  }
  cache = { at: Date.now(), rows };
  return rows;
}

export function invalidateIntegrationCache() {
  cache = null;
}

/** The effective value of a field: admin panel first, then the env variable. Server-only. */
export async function getIntegrationValue(provider: string, field: string, opts: { maxAgeMs?: number } = {}): Promise<string> {
  const rows = await loadRows(opts.maxAgeMs);
  const v = rows.get(k(provider, field))?.value;
  if (v) return v;
  const def = providerDef(provider)?.fields.find((f) => f.key === field);
  return (def?.env ? process.env[def.env] : "")?.trim() ?? "";
}

export type FieldStatus = {
  key: string;
  label: string;
  secret: boolean;
  options?: string[];
  placeholder?: string;
  help?: string;
  helpUrl?: string;
  source: "panel" | "env" | "none";
  /** Masked for secrets ("••••a91f"), full text for plain fields. */
  display: string;
  updatedAt: string | null;
};

export type ProviderStatus = {
  id: string;
  name: string;
  group: ProviderDef["group"];
  purpose: string;
  docsUrl?: string;
  docsLabel?: string;
  tile: ProviderDef["tile"];
  state: "connected" | "missing" | "partial" | "error";
  testedAt: string | null;
  testError: string | null;
  /** Round-trip of the last test, ms. */
  testMs: number | null;
  /** Metadata of the main credential (first secret field, else first required field), when stored in the panel. */
  key: { field: string; label: string; addedAt: string; addedById: string | null; updatedAt: string; updatedById: string | null; rotatedAt: string | null } | null;
  fields: FieldStatus[];
};

/** Status for the admin panel. Never includes secret plaintext. */
export async function integrationStatuses(): Promise<ProviderStatus[]> {
  const rows = await loadRows();
  return PROVIDERS.map((p) => {
    const fields: FieldStatus[] = p.fields.map((f) => {
      const row = rows.get(k(p.id, f.key));
      const envVal = f.env ? process.env[f.env]?.trim() ?? "" : "";
      const source: FieldStatus["source"] = row?.value ? "panel" : envVal ? "env" : "none";
      const value = row?.value ?? envVal;
      const display = !value ? "" : f.secret ? `••••${row?.last4 ?? lastFour(value)}` : value;
      return {
        key: f.key,
        label: f.label,
        secret: f.secret,
        options: f.options,
        placeholder: f.placeholder,
        help: f.help,
        helpUrl: f.helpUrl,
        source,
        display,
        updatedAt: row?.updatedAt.toISOString() ?? null,
      };
    });
    const set = (key: string) => fields.find((f) => f.key === key)?.source !== "none";
    const requiredSet = p.required.filter(set).length;
    const testRow = rows.get(k(p.id, p.required[0]));
    const testFailed = testRow?.testOk === false;
    const state: ProviderStatus["state"] = testFailed
      ? "error"
      : requiredSet === p.required.length
        ? "connected"
        : requiredSet === 0
          ? "missing"
          : "partial";
    const mainField = p.fields.find((f) => f.secret && p.required.includes(f.key)) ?? p.fields.find((f) => f.key === p.required[0])!;
    const mainRow = rows.get(k(p.id, mainField.key));
    return {
      id: p.id,
      name: p.name,
      group: p.group,
      purpose: p.purpose,
      docsUrl: p.docsUrl,
      docsLabel: p.docsLabel,
      tile: p.tile,
      state,
      testedAt: testRow?.testedAt?.toISOString() ?? null,
      testError: testRow?.testError ?? null,
      testMs: testRow?.testMs ?? null,
      key: mainRow
        ? {
            field: mainField.key,
            label: mainField.label,
            addedAt: mainRow.createdAt.toISOString(),
            addedById: mainRow.createdById,
            updatedAt: mainRow.updatedAt.toISOString(),
            updatedById: mainRow.updatedById,
            rotatedAt: mainRow.rotatedAt?.toISOString() ?? null,
          }
        : null,
      fields,
    };
  });
}

/** Save fields for a provider. Empty strings are ignored for secrets; `null` removes a field. */
export async function saveIntegrationFields(
  provider: string,
  values: Record<string, string | null>,
  actorId: string,
): Promise<string[]> {
  const def = providerDef(provider);
  if (!def) throw new Error("Unknown provider");
  if (!secretBoxReady()) throw new Error("KEY_ENCRYPTION_KEY is not set in hosting, so keys can't be stored safely.");
  const changed: string[] = [];
  for (const f of def.fields) {
    if (!(f.key in values)) continue;
    const raw = values[f.key];
    if (raw === null) {
      await prisma.integrationSecret.deleteMany({ where: { provider, field: f.key } });
      changed.push(f.key);
      continue;
    }
    let v = raw.trim();
    if (!v) continue;
    if (v.length > 4000) throw new Error(`${f.label} is too long`);
    // Verification codes and pixel ids: store only the parsed id (a pasted <meta> tag or snippet is reduced to it).
    const tag = parseSiteTag(provider, v);
    if (tag && !tag.ok) throw new Error(tag.error);
    if (tag?.ok) v = tag.value;
    if (f.options && !f.options.includes(v)) throw new Error(`${f.label} must be one of ${f.options.join(", ")}`);
    await prisma.integrationSecret.upsert({
      where: { provider_field: { provider, field: f.key } },
      create: { provider, field: f.key, ciphertext: seal(v), last4: f.secret ? lastFour(v) : "", createdById: actorId, updatedById: actorId },
      // Replacing a stored secret is a rotation.
      update: {
        ciphertext: seal(v),
        last4: f.secret ? lastFour(v) : "",
        updatedById: actorId,
        ...(f.secret ? { rotatedAt: new Date() } : {}),
        testedAt: null,
        testOk: null,
        testError: null,
        testMs: null,
      },
    });
    changed.push(f.key);
  }
  invalidateIntegrationCache();
  return changed;
}

/** Remove every value stored in the panel for a provider. Hosting env values (if any) apply again. Returns the removed field names. */
export async function disconnectIntegration(provider: string): Promise<string[]> {
  if (!providerDef(provider)) throw new Error("Unknown provider");
  const rows = await prisma.integrationSecret.findMany({ where: { provider }, select: { field: true } });
  await prisma.integrationSecret.deleteMany({ where: { provider } });
  invalidateIntegrationCache();
  return rows.map((r) => r.field);
}

/** "LaunchCV <info@launch-cv.com>" or "info@launch-cv.com" → "launch-cv.com". */
export function senderDomain(from: string): string | null {
  const m = from.match(/<([^>]+)>/);
  const addr = (m ? m[1] : from).trim();
  const at = addr.lastIndexOf("@");
  if (at < 1 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(addr)) return null;
  return addr.slice(at + 1).toLowerCase();
}

/** Live check against the provider with the given (or stored) values. Never logs secrets. */
export async function testIntegration(
  provider: string,
  override: Record<string, string> = {},
): Promise<{ ok: boolean; message: string; ms: number }> {
  const get = async (field: string) => override[field]?.trim() || (await getIntegrationValue(provider, field));
  const t0 = Date.now();
  const done = (ok: boolean, message: string) => ({ ok, message, ms: Date.now() - t0 });
  try {
    const signal = AbortSignal.timeout(10_000);
    switch (provider) {
      case "openai": {
        const key = await get("apiKey");
        if (!key) return done(false, "No API key");
        const r = await fetch("https://api.openai.com/v1/models", { headers: { Authorization: `Bearer ${key}` }, signal });
        return r.ok ? done(true, "Key accepted") : done(false, r.status === 401 ? "Key rejected (401)" : `OpenAI returned ${r.status}`);
      }
      case "anthropic": {
        const key = await get("apiKey");
        if (!key) return done(false, "No API key");
        const { testClaudeKey } = await import("@/lib/claude-client");
        const r = await testClaudeKey(key);
        return done(r.ok, r.message);
      }
      case "resend": {
        const key = await get("apiKey");
        if (!key) return done(false, "No API key");
        const from = await get("fromEmail");
        if (!from) return done(false, "Sender is empty — set it, e.g. LaunchCV <info@launch-cv.com>");
        const domain = senderDomain(from);
        if (!domain) return done(false, "Sender should be an address like LaunchCV <info@launch-cv.com>");
        const r = await fetch("https://api.resend.com/domains", { headers: { Authorization: `Bearer ${key}` }, signal });
        // A sending-only key can't list domains; it can still send, so accept it but say what wasn't checked.
        if (r.status === 401 || r.status === 403) {
          const body = (await r.text().catch(() => "")).toLowerCase();
          if (body.includes("restricted")) return done(true, `Sending-only key accepted — couldn't check that ${domain} is verified`);
          return done(false, `Key rejected (${r.status})`);
        }
        if (!r.ok) return done(false, `Resend returned ${r.status}`);
        const list = ((await r.json().catch(() => null)) as { data?: { name?: string; status?: string }[] } | null)?.data ?? [];
        const match = list.find((d) => d.name?.toLowerCase() === domain);
        if (!match) return done(false, `${domain} isn't added in Resend → Domains, so mail from it is rejected`);
        if (match.status !== "verified") return done(false, `${domain} is "${match.status}" in Resend — finish the DNS records until it shows Verified`);
        return done(true, `Key accepted · ${domain} verified`);
      }
      case "polar": {
        const token = await get("accessToken");
        if (!token) return done(false, "No access token");
        const base = (await get("server")) === "sandbox" ? "https://sandbox-api.polar.sh" : "https://api.polar.sh";
        const r = await fetch(`${base}/v1/products/?limit=1`, { headers: { Authorization: `Bearer ${token}` }, signal });
        if (!r.ok) return done(false, `Polar returned ${r.status}`);
        const whSecret = await get("webhookSecret");
        if (!whSecret) return done(false, "Token works, but the webhook secret is missing — paid users won't get access");
        // Compare with the secret of the endpoint that points at this site, when the token may read it.
        const ep = await fetch(`${base}/v1/webhooks/endpoints?limit=50`, { headers: { Authorization: `Bearer ${token}` }, signal });
        if (ep.ok) {
          const items = ((await ep.json().catch(() => null)) as { items?: { url?: string; secret?: string; enabled?: boolean }[] } | null)?.items ?? [];
          const ours = items.filter((e) => e.url?.endsWith("/api/polar/webhook") && e.enabled !== false);
          if (!ours.length) return done(false, "Token works, but Polar has no enabled webhook pointing at /api/polar/webhook");
          if (!ours.some((e) => e.secret?.trim() === whSecret.trim())) {
            return done(false, "Token works, but the webhook secret doesn't match the Polar endpoint — paid users won't get access. Copy the secret from Polar → Webhooks.");
          }
          return done(true, "Token accepted · webhook secret matches");
        }
        return done(true, "Token accepted");
      }
      case "google": {
        const id = await get("clientId");
        const secret = await get("clientSecret");
        if (!id || !secret) return done(false, "Client ID and secret are both required");
        if (!id.endsWith(".apps.googleusercontent.com")) return done(false, "Client ID should end with .apps.googleusercontent.com");
        return done(true, "Looks right — try “Continue with Google” to confirm");
      }
      case "ga4": {
        const id = await get("measurementId");
        return /^G-[A-Z0-9]+$/.test(id) ? done(true, "Measurement ID format OK") : done(false, "Measurement ID should look like G-XXXXXXX");
      }
      case "posthog":
        return (await get("key")).startsWith("phc_") ? done(true, "Key format OK") : done(false, "Key should start with phc_");
      case "mixpanel":
        return (await get("token")).length >= 16 ? done(true, "Token set") : done(false, "Token looks too short");
      default: {
        // Site verification and pixels: public ids, so the test is a format check.
        const def = providerDef(provider);
        const field = def?.required[0];
        const parsed = field ? parseSiteTag(provider, await get(field)) : null;
        if (!parsed) return done(false, "Unknown provider");
        if (!parsed.ok) return done(false, parsed.error);
        return def!.group === "Site verification"
          ? done(true, `Format OK · ${parsed.value} will be on every page. Then press Verify in ${def!.name}.`)
          : done(true, `Format OK · ${parsed.value} loads after a visitor accepts cookies`);
      }
    }
  } catch (e) {
    if (!(e instanceof Error && e.name === "TimeoutError")) logError(`[integrations] ${provider} test failed`, e);
    return done(false, e instanceof Error && e.name === "TimeoutError" ? "Timed out after 10 s" : "Couldn't reach the provider");
  }
}

export async function recordTestResult(provider: string, ok: boolean, message: string, ms?: number) {
  const def = providerDef(provider);
  if (!def) return;
  await prisma.integrationSecret.updateMany({
    where: { provider, field: def.required[0] },
    data: { testedAt: new Date(), testOk: ok, testError: ok ? null : message.slice(0, 300), testMs: ms ?? null },
  });
  invalidateIntegrationCache();
}
