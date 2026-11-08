/**
 * Self-checks for lib/site-tags.ts (verification codes and pixel ids).
 * Run: npx tsx src/lib/site-tags.check.ts
 */
import assert from "node:assert/strict";
import { parsePixelId, parseSiteTag, parseVerification, pixelSnippet, validPixelIds, PIXEL_PROVIDERS } from "@/lib/site-tags";

let n = 0;
const ok = (r: ReturnType<typeof parseVerification>, value: string) => {
  n++;
  assert.equal(r.ok, true, JSON.stringify(r));
  if (r.ok) assert.equal(r.value, value);
};
const bad = (r: ReturnType<typeof parseVerification>, includes?: string) => {
  n++;
  assert.equal(r.ok, false, JSON.stringify(r));
  if (!r.ok && includes) assert.ok(r.error.includes(includes), r.error);
};

/* Verification: bare code or a pasted <meta> tag. */
const G = "dz90Yv149kX83SmMMEE6jz4_gegmV8_owlAFe1MzOMw";
ok(parseVerification("gsc", G), G);
ok(parseVerification("gsc", `  ${G}\n`), G);
ok(parseVerification("gsc", `<meta name="google-site-verification" content="${G}" />`), G);
ok(parseVerification("gsc", `<meta content='${G}' name='google-site-verification'>`), G);
ok(parseVerification("gsc", `<META NAME="google-site-verification" CONTENT="${G}">`), G);
bad(parseVerification("gsc", `<meta name="msvalidate.01" content="${G}" />`), "msvalidate.01");
bad(parseVerification("gsc", `<meta name="google-site-verification">`), "content");
bad(parseVerification("gsc", ""), "Paste");
bad(parseVerification("gsc", "short"));
bad(parseVerification("gsc", `${G}"><script>alert(1)</script>`));

const BING = "1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D";
ok(parseVerification("bing", BING), BING);
ok(parseVerification("bing", `<meta name="msvalidate.01" content="${BING}" />`), BING);
bad(parseVerification("bing", "1A2B3C"));
bad(parseVerification("bing", "ZZ2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D"));

ok(parseVerification("yandex", '<meta name="yandex-verification" content="5c8a6e3d2b1f4a7e" />'), "5c8a6e3d2b1f4a7e");
bad(parseVerification("yandex", "5c8a-6e3d"));

const FB = "abcdefghijklmnopqrstuvwxyz1234";
ok(parseVerification("fbdomain", `<meta name="facebook-domain-verification" content="${FB}" />`), FB);
bad(parseVerification("fbdomain", FB.toUpperCase()));

const PIN = "0123456789abcdef0123456789abcdef";
ok(parseVerification("pinterest", `<meta name="p:domain_verify" content="${PIN}"/>`), PIN);
bad(parseVerification("pinterest", `<meta name="p:domain_verify" content="nothex"/>`));

/* Pixels: bare id or the vendor's install snippet. */
ok(parsePixelId("gtm", "GTM-ABC1234"), "GTM-ABC1234");
ok(parsePixelId("gtm", "gtm-abc1234"), "GTM-ABC1234");
ok(parsePixelId("gtm", "<script>(function(w,d,s,l,i){…})(window,document,'script','dataLayer','GTM-K9X2PQR');</script>"), "GTM-K9X2PQR");
bad(parsePixelId("gtm", "G-ABC1234"), "GTM-XXXXXXX");
bad(parsePixelId("gtm", "GTM-AB"));

ok(parsePixelId("metapixel", "123456789012345"), "123456789012345");
ok(parsePixelId("metapixel", "1234567890123456"), "1234567890123456");
ok(parsePixelId("metapixel", "fbq('init', '1234567890123456'); fbq('track', 'PageView');"), "1234567890123456");
bad(parsePixelId("metapixel", "12345678901234"), "15–16 digits");
bad(parsePixelId("metapixel", "12345678901234567"));
bad(parsePixelId("metapixel", "12345678901234a"));

ok(parsePixelId("tiktok", "C4ABCDEFGHIJ12345678"), "C4ABCDEFGHIJ12345678");
ok(parsePixelId("tiktok", "c4abcdefghij12345678"), "C4ABCDEFGHIJ12345678");
ok(parsePixelId("tiktok", "ttq.load('CQ1234567890ABCDEFGH'); ttq.page();"), "CQ1234567890ABCDEFGH");
bad(parsePixelId("tiktok", "C4ABCDEFG"));

ok(parsePixelId("clarity", "k5x2e9abcd"), "k5x2e9abcd");
ok(parsePixelId("clarity", "K5X2E9ABCD"), "k5x2e9abcd");
ok(parsePixelId("clarity", '(function(c,l,a,r,i,t,y){…})(window, document, "clarity", "script", "jd0ok8xyl7");'), "jd0ok8xyl7");
ok(parsePixelId("clarity", "https://www.clarity.ms/tag/jd0ok8xyl7"), "jd0ok8xyl7");
bad(parsePixelId("clarity", "k5x2"));
bad(parsePixelId("clarity", "k5x2e9ab-d"));

ok(parsePixelId("linkedin", "1234567"), "1234567");
ok(parsePixelId("linkedin", '_linkedin_partner_id = "7654321";'), "7654321");
ok(parsePixelId("linkedin", '<img src="https://px.ads.linkedin.com/collect/?pid=7654321&fmt=gif" />'), "7654321");
bad(parsePixelId("linkedin", "12a4567"));

ok(parsePixelId("reddit", "a2_abcd1234efgh"), "a2_abcd1234efgh");
ok(parsePixelId("reddit", "T2_ABC123"), "t2_abc123");
ok(parsePixelId("reddit", "rdt('init','a2_ebd5xn1pgw5h', {});"), "a2_ebd5xn1pgw5h");
bad(parsePixelId("reddit", "abcd1234"), "a2_");

/* Dispatch and filtering. */
n++;
assert.equal(parseSiteTag("ga4", "G-1"), null);
n++;
assert.deepEqual(parseSiteTag("bing", BING), { ok: true, value: BING });
n++;
assert.deepEqual(validPixelIds({ gtm: "GTM-ABC1234", metapixel: "nope", clarity: "", reddit: "a2_abc123" }), { gtm: "GTM-ABC1234", reddit: "a2_abc123" });

/* Snippets embed only validated ids, JSON-quoted. */
n++;
assert.equal(pixelSnippet("metapixel", "1'+alert(1)+'"), null);
for (const p of PIXEL_PROVIDERS) {
  const id = { gtm: "GTM-ABC1234", metapixel: "123456789012345", tiktok: "C4ABCDEFGHIJ12345678", clarity: "k5x2e9abcd", linkedin: "1234567", reddit: "a2_abc123" }[p];
  const code = pixelSnippet(p, id);
  n++;
  assert.ok(code && code.includes(JSON.stringify(id)), `${p} snippet embeds the id`);
  n++;
  assert.ok(!/<\/|<!--|<script/i.test(code!), `${p} snippet can't close or open a <script>`);
}

console.log(`site-tags: ${n} checks passed`);
