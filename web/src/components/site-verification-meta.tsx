import { getIntegrationValue, VERIFICATION_FIELD } from "@/lib/integrations";
import { parseVerification, VERIFICATION_PROVIDERS, VERIFICATIONS } from "@/lib/site-tags";

/** Already in the root layout's metadata (verification.google); not repeated when the panel holds the same code. */
export const BUILT_IN_GOOGLE_VERIFICATION = "dz90Yv149kX83SmMMEE6jz4_gegmV8_owlAFe1MzOMw";

/**
 * Freshness of the values read here. Static pages are re-rendered after a
 * change in Admin → Integrations (the save route calls revalidatePath), and
 * that render may run on another server whose integration cache is older, so
 * this reads with a short cache instead of the usual minute.
 */
const MAX_AGE_MS = 5_000;

/** { name, content } for every verification code set in Admin → Integrations (or hosting env). Malformed values are skipped. */
export async function siteVerificationTags(): Promise<{ name: string; content: string }[]> {
  const values = await Promise.all(
    VERIFICATION_PROVIDERS.map(async (p) => ({ p, raw: await getIntegrationValue(p, VERIFICATION_FIELD, { maxAgeMs: MAX_AGE_MS }) })),
  );
  const out: { name: string; content: string }[] = [];
  for (const { p, raw } of values) {
    if (!raw) continue;
    const parsed = parseVerification(p, raw);
    if (!parsed.ok) continue;
    if (p === "gsc" && parsed.value === BUILT_IN_GOOGLE_VERIFICATION) continue;
    out.push({ name: VERIFICATIONS[p].meta, content: parsed.value });
  }
  return out;
}

/**
 * Site-ownership <meta> tags (Search Console, Bing, Yandex, Meta, Pinterest).
 * Rendered by the root layout inside <head>, on the server, so crawlers that
 * don't run JavaScript see them in the HTML.
 */
export async function SiteVerificationMeta() {
  const tags = await siteVerificationTags();
  return (
    <>
      {tags.map((t) => (
        <meta key={t.name} name={t.name} content={t.content} />
      ))}
    </>
  );
}
