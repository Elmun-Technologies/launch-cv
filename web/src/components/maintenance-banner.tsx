"use client";

import { useEffect, useState } from "react";
import { Wrench } from "lucide-react";

/**
 * Site-wide maintenance notice, switched on in Admin → Settings → Product.
 * Fetched on the client so static pages pick it up without a rebuild.
 */
export function MaintenanceBanner() {
  const [text, setText] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/site-status")
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { banner?: string | null } | null) => {
        if (alive) setText(j?.banner ?? null);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  if (!text) return null;
  return (
    <div role="region" aria-label="Site notice" className="w-full bg-[#111118] px-4 py-2.5 text-white" data-maintenance-banner>
      <p className="mx-auto flex max-w-[1280px] items-center justify-center gap-2 text-center text-[14px] font-medium leading-[1.45]">
        <Wrench className="h-4 w-4 shrink-0 text-[#ffb08a]" aria-hidden />
        <span>{text}</span>
      </p>
    </div>
  );
}
