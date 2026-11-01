"use client";

import { useEffect, useState } from "react";

export type PublicConfig = {
  gaId: string;
  posthogKey: string;
  posthogHost: string;
  mixpanelToken: string;
  mixpanelHost: string;
  polarPortalUrl: string;
};

/** Build-time values, used until /api/public-config answers (and if it can't). */
const BUILD: PublicConfig = {
  gaId: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "",
  posthogKey: process.env.NEXT_PUBLIC_POSTHOG_KEY ?? "",
  posthogHost: process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "",
  mixpanelToken: process.env.NEXT_PUBLIC_MIXPANEL_TOKEN ?? "",
  mixpanelHost: process.env.NEXT_PUBLIC_MIXPANEL_HOST ?? "",
  polarPortalUrl: process.env.NEXT_PUBLIC_POLAR_PORTAL_URL ?? "",
};

let loaded: PublicConfig | null = null;
let pending: Promise<PublicConfig> | null = null;

function load(): Promise<PublicConfig> {
  if (loaded) return Promise.resolve(loaded);
  pending ??= fetch("/api/public-config")
    .then((r) => (r.ok ? r.json() : BUILD))
    .then((c: Partial<PublicConfig>) => {
      loaded = {
        gaId: c.gaId || BUILD.gaId,
        posthogKey: c.posthogKey || BUILD.posthogKey,
        posthogHost: c.posthogHost || BUILD.posthogHost,
        mixpanelToken: c.mixpanelToken || BUILD.mixpanelToken,
        mixpanelHost: c.mixpanelHost || BUILD.mixpanelHost,
        polarPortalUrl: c.polarPortalUrl || BUILD.polarPortalUrl,
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
