"use client";

import { useEffect, useState } from "react";
import { validPixelIds, type PixelProvider } from "@/lib/site-tags";

export type PublicConfig = {
  gaId: string;
  posthogKey: string;
  posthogHost: string;
  mixpanelToken: string;
  mixpanelHost: string;
  polarPortalUrl: string;
  /** Marketing pixel ids that passed their format check (Admin → Integrations → Pixels & tags). */
  pixels: Partial<Record<PixelProvider, string>>;
};

/** Build-time values, used until /api/public-config answers (and if it can't). */
const BUILD: PublicConfig = {
  gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "",
  mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? "",
  mixpanelHost: process.env.NEXT_PUBLIC_MIXPANEL_HOST ?? "",
  polarPortalUrl: process.env.NEXT_PUBLIC_POLAR_PORTAL_URL ?? "",
  pixels: validPixelIds({
    gtm: process.env.NEXT_PUBLIC_GTM_ID,
    metapixel: process.env.NEXT_PUBLIC_META_PIXEL_ID,
    tiktok: process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID,
    clarity: process.env.NEXT_PUBLIC_CLARITY_PROJECT_ID,
    linkedin: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID,
    reddit: process.env.NEXT_PUBLIC_REDDIT_PIXEL_ID,
  }),
};

let loaded: PublicConfig | null = null;
let pending: Promise<PublicConfig> | null = null;

function load(): Promise<PublicConfig> {
  if (loaded) return Promise.resolve(loaded);
  pending ??= fetch("/api/public-config")
    .then((r) => (r.ok ? r.json() : BUILD))
    .then((c: Partial<PublicConfig>) => {
      const fromServer = c.pixels && typeof c.pixels === "object" ? c.pixels : null;
      loaded = {
        gaId: c.gaId || BUILD.gaId,
        posthogKey: c.posthogKey || BUILD.posthogKey,
        posthogHost: c.posthogHost || BUILD.posthogHost,
        mixpanelToken: c.mixpanelToken || BUILD.mixpanelToken,
        mixpanelHost: c.mixpanelHost || BUILD.mixpanelHost,
        polarPortalUrl: c.polarPortalUrl || BUILD.polarPortalUrl,
        // The server's list is complete (panel, then hosting env); checked again here because these ids go into inline scripts.
        pixels: fromServer ? validPixelIds(fromServer) : BUILD.pixels,
      };
      return loaded;
    })
    .catch(() => (loaded = BUILD));
  return pending;
}

/** Analytics IDs from Admin → Integrations. `null` until loaded, so nothing initialises twice. */
export function usePublicConfig(): PublicConfig | null {
  const [cfg, setCfg] = useState<PublicConfig | null>(loaded);
  useEffect(() => {
    let alive = true;
    void load().then((c) => alive && setCfg(c));
    return () => {
      alive = false;
    };
  }, []);
  return cfg;
}

/** Polar customer portal (Admin → Integrations → Polar), or Polar's generic purchases page. */
export function usePortalUrl(): string {
  return usePublicConfig()?.polarPortalUrl || "https://polar.sh/purchases";
}
