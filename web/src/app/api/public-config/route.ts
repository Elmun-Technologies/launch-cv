import { NextResponse } from "next/server";
import { getIntegrationValue } from "@/lib/integrations";

/**
 * Public analytics IDs set in Admin → Integrations, for the browser.
 * Only values that are public by design (they ship in page JS anyway) —
 * never secrets. Cached at the edge for a minute.
 */
export async function GET() {
  const [ga, phKey, phHost, mpToken, mpHost, portal] = await Promise.all([
    getIntegrationValue("ga4", "measurementId"),
    getIntegrationValue("posthog", "key"),
    getIntegrationValue("posthog", "host"),
    getIntegrationValue("mixpanel", "token"),
    getIntegrationValue("mixpanel", "host"),
    getIntegrationValue("polar", "portalUrl"),
  ]);
  return NextResponse.json(
    { gaId: ga, posthogKey: phKey, posthogHost: phHost, mixpanelToken: mpToken, mixpanelHost: mpHost, polarPortalUrl: portal },
    { headers: { "Cache-Control": "public, max-age=60, s-maxage=60, stale-while-revalidate=600" } },
  );
}
