"use client";

import { useEffect, useState } from "react";

const KEY = "launchcv_cookie_ack";

export function CookieBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) queueMicrotask(() => setShow(true));
    } catch {
      queueMicrotask(() => setShow(true));
    }
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white px-4 py-3 shadow-lg">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          This site uses session cookies for authentication.{" "}
          <a className="font-medium text-blue-600 hover:underline" href="/legal/privacy">Privacy</a>
        </p>
        <button
          type="button"
          className="soha-btn-primary text-xs"
          onClick={() => {
            try { localStorage.setItem(KEY, "1"); } catch { /* ignore */ }
            setShow(false);
          }}
        >
          Got it
        </button>
      </div>
    </div>
  );
}
