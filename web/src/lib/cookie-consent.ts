"use client";

import { useSyncExternalStore } from "react";

/**
 * The visitor's answer to the cookie notice (components/cookie-banner.tsx).
 *
 * - `launchcv_cookie_ack` = "1": the notice was seen (sign-in cookie and
 *   analytics). Older browsers have only this key.
 * - `launchcv_consent` = "all" | "essential": the answer to the separate
 *   question about marketing pixels (ads and session recordings). Asked only
 *   once a pixel is configured; pixels load only with "all". An old
 *   "Got it" is not taken as a yes to pixels.
 */
export const ACK_KEY = "launchcv_cookie_ack";
export const CONSENT_KEY = "launchcv_consent";
export type Consent = "all" | "essential";

const EVENT = "lcv-consent";

export function readConsent(): Consent | null {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY);
    return v === "all" || v === "essential" ? v : null;
  } catch {
    return null;
  }
}

export function readAck(): boolean {
  try {
    return window.localStorage.getItem(ACK_KEY) === "1";
  } catch {
    return false;
  }
}

function notify() {
  window.dispatchEvent(new Event(EVENT));
}

/** Record the notice as seen, and optionally the answer about pixels. */
export function saveConsent(consent: Consent | null): void {
  try {
    window.localStorage.setItem(ACK_KEY, "1");
    if (consent) window.localStorage.setItem(CONSENT_KEY, consent);
  } catch {
    /* storage blocked: the choice lasts for this page only */
  }
  notify();
}

/** Forget the pixel answer, so the notice asks again (Privacy policy → "Change cookie choice"). */
export function resetConsent(): void {
  try {
    window.localStorage.removeItem(CONSENT_KEY);
  } catch {
    /* ignore */
  }
  notify();
}

function subscribe(cb: () => void): () => void {
  const onStorage = (e: StorageEvent) => {
    if (e.key === CONSENT_KEY || e.key === ACK_KEY || e.key === null) cb();
  };
  window.addEventListener(EVENT, cb);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(EVENT, cb);
    window.removeEventListener("storage", onStorage);
  };
}

/** The pixel answer; null on the server, before an answer, or when storage is blocked. */
export function useConsent(): Consent | null {
  return useSyncExternalStore(subscribe, readConsent, () => null);
}

/** Has the notice been seen? Server snapshot is true so nothing flashes before hydration. */
export function useAck(): boolean {
  return useSyncExternalStore(subscribe, readAck, () => true);
}
