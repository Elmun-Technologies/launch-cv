"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { usePublicConfig } from "@/lib/public-config";
import { useConsent } from "@/lib/cookie-consent";
import { analyticsAllowed, isAppPath, isPreviewHost, readInternalFlag } from "@/lib/analytics-enabled";
import { PIXEL_PROVIDERS, pixelSnippet, type PixelProvider } from "@/lib/site-tags";

type PixelWindow = {
  fbq?: (...args: unknown[]) => void;
  ttq?: { page?: () => void };
  rdt?: (...args: unknown[]) => void;
};

/** Pages that never load pixels: the admin panel and the signed-in app (resume text lives there). */
function pixelsAllowedOn(pathname: string | null): boolean {
  return analyticsAllowed(pathname) && !isAppPath(pathname);
}

/**
 * Marketing pixels from Admin → Integrations → Pixels & tags (GTM, Meta,
 * TikTok, Clarity, LinkedIn, Reddit).
 *
 * Loaded only when all of these hold:
 *   - the visitor pressed Accept in the cookie notice (lib/cookie-consent.ts);
 *   - the production site, not a preview or local host;
 *   - a public page: never /admin-panel, /dashboard or /resume;
 *   - the browser isn't flagged as internal/team traffic.
 *
 * Once loaded, a script can't be unloaded, so a client-side move to an
 * excluded page reloads it (the fresh page loads no pixels).
 */
export function MarketingPixels() {
  const pathname = usePathname();
  const cfg = usePublicConfig();
  const consent = useConsent();
  const [hostOk, setHostOk] = useState(false);
  const loaded = useRef(false);
  const lastPath = useRef<string | null>(null);

  // Host and the internal flag are browser-only; read after mount so SSR and hydration agree.
  useEffect(() => {
    queueMicrotask(() => setHostOk(!isPreviewHost() && !readInternalFlag()));
  }, []);

  const allowedHere = pixelsAllowedOn(pathname);
  const ids = cfg?.pixels ?? {};
  const active = consent === "all" && hostOk && allowedHere ? PIXEL_PROVIDERS.filter((p) => !!ids[p]) : [];
  const on = active.length > 0;

  useEffect(() => {
    if (on) loaded.current = true;
  }, [on]);

  // Left a public page for an excluded one after pixels loaded: start over without them.
  useEffect(() => {
    if (loaded.current && !allowedHere) window.location.reload();
  }, [allowedHere]);

  // Client-side page changes: tell the pixels that track page views themselves.
  useEffect(() => {
    if (!on) return;
    if (lastPath.current === null || lastPath.current === pathname) {
      lastPath.current = pathname;
      return;
    }
    lastPath.current = pathname;
    const w = window as unknown as PixelWindow;
    if (ids.metapixel) w.fbq?.("track", "PageView");
    if (ids.tiktok) w.ttq?.page?.();
    if (ids.reddit) w.rdt?.("track", "PageVisit");
  }, [on, pathname, ids.metapixel, ids.tiktok, ids.reddit]);

  if (!on) return null;
  return (
    <>
      {active.map((p: PixelProvider) => {
        const code = pixelSnippet(p, ids[p]!);
        return code ? (
          <Script key={p} id={`lcv-pixel-${p}`} strategy="afterInteractive">
            {code}
          </Script>
        ) : null;
      })}
    </>
  );
}
