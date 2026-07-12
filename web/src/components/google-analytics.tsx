"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import {
  analyticsAllowed,
  isExcludedPath,
  isPreviewHost,
  isProductionSite,
  INTERNAL_TRAFFIC_KEY,
} from "@/lib/analytics-enabled";

const DEFAULT_MEASUREMENT_ID = "G-BQJVBJ207Q";

function resolveMeasurementId(): string {
  const raw = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const id =
    raw === undefined || raw === ""
      ? DEFAULT_MEASUREMENT_ID
      : raw.trim() === "false" || raw.trim() === "0"
        ? ""
        : raw.trim();
  return id && id.startsWith("G-") ? id : "";
}

/**
 * GA4 via gtag — loaded ONLY on the production marketing site.
 *
 * It is never mounted on the app surfaces (`/admin-panel`, `/dashboard`) or on
 * preview / local builds, and it flags internal/team traffic with
 * `traffic_type: 'internal'` so GA4's internal-traffic data filter can exclude
 * it. Set `NEXT_PUBLIC_GA_MEASUREMENT_ID` to override the id, or `"false"` to
 * disable entirely.
 */
export function GoogleAnalytics() {
  const pathname = usePathname();
  const id = resolveMeasurementId();

  // Suppress hits on preview hosts and app surfaces even after a client-side
  // navigation (the script, once injected, otherwise keeps tracking). Toggled
  // in an effect — not in render — so SSR and CSR agree and don't mismatch.
  const suppressed = !isProductionSite() || isExcludedPath(pathname) || isPreviewHost();
  useEffect(() => {
    if (!id || typeof window === "undefined") return;
    (window as unknown as Record<string, boolean>)[`ga-disable-${id}`] = suppressed;
  }, [id, suppressed]);

  // Render-time gate (env + path only → SSR-safe). If the user first lands on an
  // excluded path we don't inject at all; navigating to a tracked page re-renders
  // this and injects the tag then.
  if (!id || !analyticsAllowed(pathname)) return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
(function(){
  var internal = false;
  try { internal = localStorage.getItem('${INTERNAL_TRAFFIC_KEY}') === '1'; } catch(e){}
  if (!internal && document.cookie.indexOf('${INTERNAL_TRAFFIC_KEY}=1') !== -1) internal = true;
  // 'set' makes traffic_type ride on every subsequent event (page_view + custom
  // events), which is what GA4's internal-traffic data filter matches on.
  if (internal) gtag('set', { traffic_type: 'internal' });
  gtag('config', '${id}');
})();
        `.trim()}
      </Script>
    </>
  );
}
