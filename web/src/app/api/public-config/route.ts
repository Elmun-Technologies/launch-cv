import { NextResponse } from "next/server";
import { getIntegrationValue, pixelField } from "@/lib/integrations";
import { PIXEL_PROVIDERS, validPixelIds } from "@/lib/site-tags";

/**
 * Public analytics IDs set in Admin → Integrations, for the browser.
 * Only values that are public by design (they ship in page JS anyway) —
 * never secrets. Cached at the edge for a minute. Pixel ids are sent only
 * when they pass their format check (components/marketing-pixels.tsx loads
 * them after cookie consent).
 */
export async function GET() {
  const [ga, phKey, phHost, mpToken, mpHost, portal, pixelValues] = await Promise.all([
    getIntegrationValue("ga4", "measurementId"),
    getIntegrationValue("posthog", "key"),
    getIntegrationValue("posthog", "host"),
    getIntegrationValue("mixpanel", "token"),
    getIntegrationValue("mixpanel", "host"),
    getIntegrationValue("polar", "portalUrl"),
    Promise.all(PIXEL_PROVIDERS.map(async (p) => [p, await getIntegrationValue(p, pixelField(p))] as const)),
  ]);
  return NextResponse.json(
    {
      gaId: ga,
      posthogKey: phKey,
      posthogHost: phHost,
      mixpanelToken: mpToken,
      mixpanelHost: mpHost,
      polarPortalUrl: portal,
      pixels: validPixelIds(Object.fromEntries(pixelValues)),
    },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=600" } },
  );
}
