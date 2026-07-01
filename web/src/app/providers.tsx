"use client";

import { useEffect, useRef, useState, type ComponentType } from "react";
import type { PostHog } from "posthog-js";

type PostHogProviderComp = ComponentType<{ client: PostHog; children: React.ReactNode }>;

/**
 * PostHog (`posthog-js`) is a sizeable library that's only needed when analytics are
 * configured. Loading it via dynamic `import()` keeps it out of the initial JS bundle
 * that every page pays for, instead of a static top-level import.
 */
export function AppProviders({ children }: { children: React.ReactNode }) {
  const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
  const host = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
  const inited = useRef(false);
  const [provider, setProvider] = useState<{ Provider: PostHogProviderComp; client: PostHog } | null>(null);

  useEffect(() => {
    if (!key || inited.current) return;
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
      setProvider({ Provider: PostHogProvider, client: posthog });
    });
    return () => {
      cancelled = true;
    };
  }, [key, host]);

  if (!provider) return <>{children}</>;

  const { Provider, client } = provider;
  return <Provider client={client}>{children}</Provider>;
}
