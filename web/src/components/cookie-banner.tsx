"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { isAppPath } from "@/lib/analytics-enabled";

const KEY = "launchcv_cookie_ack";

export function CookieBanner() {
  const [show, setShow] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) queueMicrotask(() => setShow(true));
    } catch {
      queueMicrotask(() => setShow(true));
    }
  }, []);

  // Signed-in app screens are reached through the marketing site or login, where the notice already showed.
  if (!show || isAppPath(pathname)) return null;

  return (
    <div
      role="region"
      aria-label="Cookie notice"
      className="fixed inset-x-4 bottom-4 z-50 rounded-[14px] border border-[#E5E5E2] bg-white p-4 shadow-[0_8px_30px_rgba(17,17,17,0.08)] sm:inset-x-auto sm:left-4 sm:max-w-[380px]"
    >
      <p className="text-[14px] leading-relaxed text-[#3F3F3F]">
        We use a cookie to keep you signed in, and analytics to see how LaunchCV is used.{" "}
        <a className="text-[#111111] underline underline-offset-2 hover:text-[#1D4ED8]" href="/legal/privacy">
          Privacy policy
        </a>
      </p>
      <button
        type="button"
        className="mt-3 inline-flex h-9 items-center rounded-full bg-[#111111] px-4 text-[13px] font-medium text-white hover:bg-black"
        onClick={() => {
          try { localStorage.setItem(KEY, "1"); } catch { /* ignore */ }
          setShow(false);
        }}
      >
        Got it
      </button>
    </div>
  );
}
