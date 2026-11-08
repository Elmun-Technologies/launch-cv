"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { isAppPath } from "@/lib/analytics-enabled";

const KEY = "launchcv_cookie_ack";
/** Height of the bar, published so the page can pad its bottom (globals.css) and other fixed bars can sit above it. */
const VAR = "--lc-cookie-bar";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();
  const ref = useRef<HTMLDivElement>(null);
  const visible = show && !isAppPath(pathname);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) queueMicrotask(() => setShow(true));
    } catch {
      queueMicrotask(() => setShow(true));
    }
  }, []);

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

  return (
    <div
      ref={ref}
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-[#e2e0ea] bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur"
    >
      <div className="mx-auto flex min-h-14 max-w-[1360px] items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-10">
        <p className="text-[13px] leading-[18px] text-[#3F3F3F] sm:text-[14px]">
          <span className="sm:hidden">Cookies keep you signed in; analytics show how the site is used.</span>
          <span className="hidden sm:inline">We use a cookie to keep you signed in, and analytics to see how LaunchCV is used.</span>{" "}
          <a className="text-[#111111] underline underline-offset-2 hover:text-[#5440e8]" href="/legal/privacy">
            Privacy
          </a>
        </p>
        <button
          type="button"
          className="inline-flex h-9 flex-none items-center rounded-full bg-[#111111] px-4 text-[13px] font-medium text-white hover:bg-black"
          onClick={() => {
            try {
              localStorage.setItem(KEY, "1");
            } catch {
              /* ignore */
            }
            setShow(false);
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
