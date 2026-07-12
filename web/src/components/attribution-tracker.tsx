"use client";

import { useEffect } from "react";
import { captureAttribution } from "@/lib/utm";

/**
 * Records first-touch campaign attribution (UTM params + ad click ids) into the
 * `lc_attribution` cookie on the visitor's first landing. Renders nothing.
 *
 * `captureAttribution()` is a no-op once the cookie exists, so mounting this at
 * the root layout is safe — the first campaign a visitor arrives on wins and is
 * carried through the whole funnel (including the server-side `purchase`).
 */
export function AttributionTracker() {
  useEffect(() => {
    captureAttribution();
  }, []);
  return null;
}
