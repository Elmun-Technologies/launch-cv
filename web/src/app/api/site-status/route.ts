import { NextResponse } from "next/server";
import { getSettings } from "@/lib/app-settings";

/**
 * Public, read-only site status for the maintenance banner (Admin → Settings →
 * Product). Only the banner text is exposed. Cached briefly at the edge.
 */
export async function GET() {
  const { product } = await getSettings();
  const banner = product.maintenanceBanner ? product.maintenanceMessage || "We're doing some maintenance. Some features may be briefly unavailable." : null;
  return NextResponse.json({ banner }, { headers: { "Cache-Control": "public, max-age=0, s-maxage=30, stale-while-revalidate=30" } });
}
