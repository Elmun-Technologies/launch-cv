"use client";

import { Suspense, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { readInternalFlag } from "@/lib/analytics-enabled";

/**
 * First-party, cookie-less page analytics (POST /api/t → PageView rows,
 * Admin → Analytics). Sends one page view per route change and, when the page
 * is hidden or left, the visible time on it via navigator.sendBeacon.
 *
 * Sends nothing on admin and API paths, with Do Not Track or Global Privacy
 * Control on, for automated browsers, for team browsers flagged as internal
 * (?lcv_internal=1) and on *.vercel.app previews. The only things kept in the
 * browser are a session id in sessionStorage (renewed after 30 minutes of
 * inactivity) and a "visited before" flag in localStorage — no identifier.
 */

const ENDPOINT = "/api/t";
const SESSION_KEY = "lc_t_session";
const RETURNING_KEY = "lc_t_seen";
const SESSION_IDLE_MS = 30 * 60_000;
const SKIP_PREFIXES = ["/admin-panel", "/admin-2fa", "/api"];
const KEEP_PARAMS = ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content", "gclid", "gbraid", "wbraid", "msclkid", "dclid"];

type Current = { id: string | null; sessionId: string; visibleMs: number; shownAt: number | null; sentMs: number };

let current: Current | null = null;
let lastKey: string | null = null;

function trackingAllowed(pathname: string): boolean {
  if (SKIP_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`))) return false;
  const nav = navigator as Navigator & { globalPrivacyControl?: boolean; msDoNotTrack?: string };
  const win = window as Window & { doNotTrack?: string };
  const dnt = nav.doNotTrack ?? win.doNotTrack ?? nav.msDoNotTrack;
  if (dnt === "1" || dnt === "yes" || nav.globalPrivacyControl === true) return false;
  if (nav.webdriver) return false;
  if (window.location.hostname.endsWith(".vercel.app")) return false;
  if (readInternalFlag()) return false;
  return true;
}

function randomId(): string {
  const bytes = new Uint8Array(16);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

/** This tab's session id; a new one after 30 minutes without activity. */
function sessionId(): string {
  const now = Date.now();
  let id: string | null = null;
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    const saved = raw ? (JSON.parse(raw) as { id?: string; at?: number }) : null;
    if (saved?.id && typeof saved.at === "number" && now - saved.at < SESSION_IDLE_MS) id = saved.id;
  } catch {
    // storage blocked: one id per page load
  }
  id ??= current && now - (current.shownAt ?? now) < SESSION_IDLE_MS ? current.sessionId : randomId();
  try {
    window.sessionStorage.setItem(SESSION_KEY, JSON.stringify({ id, at: now }));
  } catch {
    // ignore
  }
  return id;
}

function returningVisitor(): boolean {
  try {
    const seen = window.localStorage.getItem(RETURNING_KEY) === "1";
    if (!seen) window.localStorage.setItem(RETURNING_KEY, "1");
    return seen;
  } catch {
    return false;
  }
}

function beacon(payload: object) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon?.(ENDPOINT, new Blob([body], { type: "text/plain" }))) return;
  } catch {
    // fall through
  }
  void fetch(ENDPOINT, { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(() => undefined);
}

function visibleMs(c: Current): number {
  return c.visibleMs + (c.shownAt !== null ? Date.now() - c.shownAt : 0);
}

/** Report the visible time on the current page if it grew since the last report. */
function flush() {
  const c = current;
  if (!c?.id) return;
  const ms = visibleMs(c);
  if (ms - c.sentMs < 500) return;
  c.sentMs = ms;
  beacon({ t: "leave", id: c.id, s: c.sessionId, ms });
}

function onVisibility() {
  const c = current;
  if (!c) return;
  if (document.visibilityState === "hidden") {
    if (c.shownAt !== null) {
      c.visibleMs += Date.now() - c.shownAt;
      c.shownAt = null;
    }
    flush();
  } else if (c.shownAt === null) {
    c.shownAt = Date.now();
    // Keep the session alive while the tab is in use.
    sessionId();
  }
}

let listening = false;
function listen() {
  if (listening) return;
  listening = true;
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("pagehide", () => {
    onVisibility();
    flush();
  });
}

async function sendPageView(pathname: string, query: string) {
  flush();
  const sid = sessionId();
  const isNewSession = current?.sessionId !== sid;
  const c: Current = { id: null, sessionId: sid, visibleMs: 0, shownAt: document.visibilityState === "visible" ? Date.now() : null, sentMs: 0 };
  current = c;
  listen();
  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      keepalive: true,
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        t: "pv",
        p: pathname,
        q: query,
        // The external referrer only applies to the first view of a page load.
        r: lastKey === null ? document.referrer : "",
        ti: document.title,
        s: sid,
        l: navigator.language,
        tp: navigator.maxTouchPoints ?? 0,
        rv: isNewSession && returningVisitor() ? 1 : 0,
      }),
    });
    if (res.status === 201) {
      const data = (await res.json()) as { id?: string };
      if (current === c && typeof data.id === "string") c.id = data.id;
    }
  } catch {
    // analytics never breaks the page
  }
}

function Tracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const query = (() => {
    const out = new URLSearchParams();
    for (const k of KEEP_PARAMS) {
      const v = searchParams.get(k);
      if (v) out.set(k, v);
    }
    return out.toString();
  })();

  useEffect(() => {
    if (!pathname || !trackingAllowed(pathname)) return;
    // Only the path and campaign tags make a new view; other query changes (filters, tabs) don't.
    const key = `${pathname}?${query}`;
    if (key === lastKey) return;
    void sendPageView(pathname, query);
    lastKey = key;
  }, [pathname, query]);

  return null;
}

/** Mount once in the root layout. */
export function TrafficTracker() {
  return (
    <Suspense fallback={null}>
      <Tracker />
    </Suspense>
  );
}
