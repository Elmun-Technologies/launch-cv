"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import { usePathname } from "next/navigation";
import type { PostHog } from "posthog-js";
import type { Mixpanel } from "mixpanel-browser";
import { trackSignUpComplete } from "@/lib/analytics-client";
import {
  analyticsAllowed,
  isAppPath,
  SIGNUP_FLAG_COOKIE,
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
 * It initialises ONLY on the production site — never on `/admin-panel`, and never
 * on preview / local builds — so team and preview traffic don't pollute product
 * analytics. In the signed-in app it sends explicit events only (no autocapture). Internal/team browsers are tagged with
 * `is_internal: true` so PostHog's "Filter test accounts" rule can exclude them.
 *
 * Mixpanel (`mixpanel-browser`) is initialised the same way, right alongside
 * PostHog, gated by the same `analyticsAllowed` check.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  const mixpanelToken = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;
  const mixpanelHost = process.env.NEXT_PUBLIC_MIXPANEL_HOST;
  const pathname = usePathname();
  const inited = useRef(false);
  const mixpanelInited = useRef(false);
  const [provider, setProvider] = useState<{ Provider: PostHogProviderComp; client: PostHog } | null>(null);

  // Persist the internal/team flag from a `?lcv_internal=1` query param, on any page.
  useEffect(() => {
    syncInternalTrafficFlag();
  }, [pathname]);

  // Google sign-ups complete server-side; fire sign_up_complete once the
  // analytics clients have loaded (or after a few seconds regardless).
  useEffect(() => {
    const m = document.cookie.match(new RegExp(`(?:^|; )${SIGNUP_FLAG_COOKIE}=([^;]*)`));
    if (!m) return;
    document.cookie = `${SIGNUP_FLAG_COOKIE}=; Max-Age=0; Path=/`;
    const method = decodeURIComponent(m[1]);
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      const ready = !key || !!(window as unknown as { posthog?: unknown }).posthog;
      if (ready || tries >= 20) {
        window.clearInterval(id);
        trackSignUpComplete({ method });
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [key]);

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
        // Inside the app, only explicit events (checkout_start, …) are sent:
        // autocaptured clicks there could carry resume text.
        before_send: (ev) => (ev?.event === "$autocapture" && isAppPath(window.location.pathname) ? null : ev),
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

  useEffect(() => {
    if (!mixpanelToken) return;
    // Allowed only on the production marketing site, and never a preview host.
    const allowed = analyticsAllowed(pathname) && !isPreviewHost();

    if (!allowed) {
      // Stop capturing if we're already running but wandered onto an app surface.
      const mp = (window as unknown as { mixpanel?: Mixpanel }).mixpanel;
      mp?.opt_out_tracking?.();
      return;
    }

    if (mixpanelInited.current) {
      // Returning to a tracked page after having opted out on an excluded path.
      (window as unknown as { mixpanel?: Mixpanel }).mixpanel?.opt_in_tracking?.();
      return;
    }

    mixpanelInited.current = true;
    let cancelled = false;
    import("mixpanel-browser").then(({ default: mixpanel }) => {
      if (cancelled) return;
      mixpanel.init(mixpanelToken, {
        ...(mixpanelHost ? { api_host: mixpanelHost } : {}),
        track_pageview: true,
        persistence: "localStorage",
      });
      // Same "is_internal" convention as PostHog's super property, so team
      // traffic can be filtered out of Mixpanel reports too.
      if (readInternalFlag()) {
        mixpanel.register({ is_internal: true });
      }
      mixpanel.register({ environment: currentEnvName() });
      // Expose the initialized client so `lib/analytics-client.ts` can dispatch
      // events without a static `mixpanel-browser` import (which would bloat the
      // initial bundle this dynamic import is here to avoid).
      (window as unknown as { mixpanel?: Mixpanel }).mixpanel = mixpanel;
    });
    return () => {
      cancelled = true;
    };
  }, [mixpanelToken, mixpanelHost, pathname]);

  if (!provider) return <>{children}</>;

  const { Provider, client } = provider;
  return <Provider client={client}>{children}</Provider>;
}
