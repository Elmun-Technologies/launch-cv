"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import type { PostHog } from "posthog-js";
import {
  analyticsAllowed,
  currentEnvName,
  isPreviewHost,
  readInternalFlag,
  syncInternalTrafficFlag,
} from "@/lib/analytics-enabled";

type PostHogProviderComp = ComponentType<{ client: PostHog; children: React.ReactNode }>;

/**
 * PostHog (`posthog-js`) is a sizeable library that's only needed when analytics are
 * configured. Loading it via dynamic `import()` keeps it out of the initial JS bundle
 * that every page pays for, instead of a static top-level import.
 *
 * It initialises ONLY on the production marketing site — never on `/admin-panel`
 * or `/dashboard`, and never on preview / local builds — so team and preview
 * traffic don't pollute product analytics. Internal/team browsers are tagged with
 * `is_internal: true` so PostHog's "Filter test accounts" rule can exclude them.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  const pathname = usePathname();
  const inited = useRef(false);
  const [provider, setProvider] = useState<{ Provider: PostHogProviderComp; client: PostHog } | null>(null);

  // Persist the internal/team flag from a `?lcv_internal=1` query param, on any page.
  useEffect(() => {
    syncInternalTrafficFlag();
  }, [pathname]);

  useEffect(() => {
    if (!key) return;
    // Allowed only on the production marketing site, and never a preview host.
    const allowed = analyticsAllowed(pathname) && !isPreviewHost();

    if (!allowed) {
      // Stop capturing if we're already running but wandered onto an app surface.
      const ph = (window as unknown as { posthog?: PostHog }).posthog;
      ph?.opt_out_capturing?.();
      return;
    }

    if (inited.current) {
      // Returning to a tracked page after having opted out on an excluded path.
      (window as unknown as { posthog?: PostHog }).posthog?.opt_in_capturing?.();
      return;
    }

    inited.current = true;
    let cancelled = false;
    Promise.all([import("posthog-js"), import("posthog-js/react")]).then(([{ default: posthog }, { PostHogProvider }]) => {
      if (cancelled) return;
      posthog.init(key, {
        api_host: host,
        person_profiles: "identified_only",
        capture_pageview: true,
        capture_pageleave: true,
      });
      // Attach as a super property so it rides on every event — PostHog's
      // "Filter test accounts" rule (is_internal = true) can then exclude team
      // traffic even for anonymous, unidentified sessions.
      if (readInternalFlag()) {
        posthog.register({ is_internal: true });
      }
      posthog.register({ environment: currentEnvName() });
      // Expose the initialized client so `lib/analytics-client.ts` can dispatch
      // events without a static `posthog-js` import (which would bloat the
      // initial bundle this dynamic import is here to avoid).
      (window as unknown as { posthog?: PostHog }).posthog = posthog;
      setProvider({ Provider: PostHogProvider, client: posthog });
    });
    return () => {
      cancelled = true;
    };
  }, [key, host, pathname]);

  if (!provider) return <>{children}</>;

  const { Provider, client } = provider;
  return <Provider client={client}>{children}</Provider>;
}
