"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isAppPath, isPreviewHost, isProductionSite } from "@/lib/analytics-enabled";
import { readConsent, saveConsent, useAck, useConsent, type Consent } from "@/lib/cookie-consent";
import { usePublicConfig } from "@/lib/public-config";

/** Height of the bar, published so the page can pad its bottom (globals.css) and other fixed bars can sit above it. */
const VAR = "--lc-cookie-bar";

/**
 * Cookie notice. Without marketing pixels it is the plain "Got it" notice.
 * Once a pixel is set in Admin → Integrations (and only on the production
 * site, where pixels can load), it also asks whether ad and session-recording
 * tags may load: Accept or Decline. Pixels load only after Accept
 * (components/marketing-pixels.tsx).
 */
export function CookieBanner() {
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const cfg = usePublicConfig();
  const acked = useAck();
  const consent = useConsent();
  // Hides the bar even when storage is blocked and the choice can't be saved.
  const [dismissed, setDismissed] = useState(false);

  const asksAboutPixels = !!cfg && Object.keys(cfg.pixels).length > 0 && isProductionSite() && !isPreviewHost();
  const needed = asksAboutPixels ? consent === null : !acked;
  const visible = needed && !dismissed && !isAppPath(pathname);

  // While the bar is up, the page gets that much bottom padding, so the last button on
  // a page (e.g. "Create my account" on a phone) can always be scrolled clear of it.
  useEffect(() => {
    const el = ref.current;
    const root = document.documentElement;
    if (!visible || !el) return;
    const set = () => root.style.setProperty(VAR, `${el.offsetHeight}px`);
    set();
    const ro = new ResizeObserver(set);
    ro.observe(el);
    return () => {
      ro.disconnect();
      root.style.removeProperty(VAR);
    };
  }, [visible]);

  // Signed-in app screens are reached through the marketing site or login, where the notice already showed.
  if (!visible) return null;

  const choose = (c: Consent | null) => {
    const before = readConsent();
    saveConsent(c);
    setDismissed(true);
    // Tags already running on this page can't be unloaded; a reload drops them.
    if (before === "all" && c === "essential") window.location.reload();
  };

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e2e0ea] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto flex min-h-14 max-w-[1360px] items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-10">
        {asksAboutPixels ? (
          <p className="text-[13px] leading-[18px] text-[#3F3F3F] sm:text-[14px]">
            <span className="sm:hidden">Cookies keep you signed in; analytics show how the site is used. Allow ad and session-recording tags too?</span>
            <span className="hidden sm:inline">
              We use a cookie to keep you signed in, and analytics to see how LaunchCV is used. May we also load advertising and
              session-recording tags?
            </span>{" "}
            <a className="text-[#111111] underline underline-offset-2 hover:text-[#5440e8]" href="/legal/privacy">
              Privacy
            </a>
          </p>
        ) : (
          <p className="text-[13px] leading-[18px] text-[#3F3F3F] sm:text-[14px]">
            <span className="sm:hidden">Cookies keep you signed in; analytics show how the site is used.</span>
            <span className="hidden sm:inline">We use a cookie to keep you signed in, and analytics to see how LaunchCV is used.</span>{" "}
            <a className="text-[#111111] underline underline-offset-2 hover:text-[#5440e8]" href="/legal/privacy">
              Privacy
            </a>
          </p>
        )}
        {asksAboutPixels ? (
          <div className="flex flex-none items-center gap-2">
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-full border border-[#d6d4e0] bg-white px-4 text-[13px] font-medium text-[#111111] hover:bg-[#f5f5f3]"
              onClick={() => choose("essential")}
            >
              Decline
            </button>
            <button
              type="button"
              className="inline-flex h-9 items-center rounded-full bg-[#111111] px-4 text-[13px] font-medium text-white hover:bg-black"
              onClick={() => choose("all")}
            >
              Accept
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="inline-flex h-9 flex-none items-center rounded-full bg-[#111111] px-4 text-[13px] font-medium text-white hover:bg-black"
            onClick={() => choose(null)}
          >
            Got it
          </button>
        )}
      </div>
    </div>
  );
}
