"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X } from "lucide-react";

export type BannerOffer = { code: string; percent: number; endsAt: string; plan: string; kind: "welcome" | "winback" };

const pad = (n: number) => String(n).padStart(2, "0");

/** "1d 07:12:05" / "07:12:05" */
function left(ms: number): string {
  const s = Math.max(0, Math.floor(ms / 1000));
  const d = Math.floor(s / 86400);
  const hms = `${pad(Math.floor((s % 86400) / 3600))}:${pad(Math.floor((s % 3600) / 60))}:${pad(s % 60)}`;
  return d ? `${d}d ${hms}` : hms;
}

const hiddenKey = (code: string) => `lc-offer-hidden:${code}`;

/**
 * Countdown strip for the user's personal code (welcome or win-back). Pass
 * `offer` when the server already knows it (dashboard); without it the banner
 * asks /api/offer (static pages like /pricing). Hides itself when the code
 * ends, and for the rest of the browser session when dismissed.
 */
export function OfferBanner({ offer: initial, where }: { offer?: BannerOffer | null; where: "dashboard" | "pricing" }) {
  const [offer, setOffer] = useState<BannerOffer | null>(initial ?? null);
  const [now, setNow] = useState<number | null>(null);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    if (initial !== undefined) return;
    let live = true;
    fetch("/api/offer", { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((j: { offer?: BannerOffer | null } | null) => {
        if (live && j?.offer) setOffer(j.offer);
      })
      .catch(() => undefined);
    return () => {
      live = false;
    };
  }, [initial]);

  useEffect(() => {
    if (!offer) return;
    // The clock and the "dismissed" flag only exist in the browser, so the first
    // read happens after mount (no hydration mismatch), then once a second.
    const first = setTimeout(() => {
      try {
        if (sessionStorage.getItem(hiddenKey(offer.code))) setHidden(true);
      } catch {
        // Storage blocked: the banner just stays.
      }
      setNow(Date.now());
    }, 0);
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => {
      clearTimeout(first);
      clearInterval(t);
    };
  }, [offer]);

  if (!offer || hidden || now === null) return null;
  const ms = new Date(offer.endsAt).getTime() - now;
  if (ms <= 0) return null;

  const dismiss = () => {
    setHidden(true);
    try {
      sessionStorage.setItem(hiddenKey(offer.code), "1");
    } catch {
      // ignore
    }
  };
  const href = `/checkout/${offer.plan}?code=${encodeURIComponent(offer.code)}`;
  const label = offer.kind === "welcome" ? "Your welcome offer" : "Your personal offer";

  return (
    <aside
      aria-label={`${label}: ${offer.percent}% off`}
      className={`relative overflow-hidden rounded-[20px] bg-[#121226] px-4 py-3.5 text-white shadow-[0_24px_48px_-24px_rgba(36,24,120,.6)] sm:px-5 ${where === "dashboard" ? "mb-5" : "mb-8"}`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute -right-16 -top-20 h-48 w-48 rounded-full bg-[#5440e8]/40" />
      <div className="relative flex flex-col gap-3 pr-10 sm:flex-row sm:items-center sm:gap-4">
        <span className="lc-poster w-fit -rotate-[4deg] rounded-full bg-[#ff7a33] px-3 py-1.5 text-[13px] text-[#111118]">{offer.percent}% OFF</span>
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-semibold text-[#c9c0ff]">
            {label} · code <span className="lc-mono font-bold tracking-[0.08em] text-white">{offer.code}</span>
          </p>
          <p className="mt-0.5 text-[15px] font-bold leading-snug">
            Ends in{" "}
            <span className="lc-mono tabular-nums text-[#ffb489]" role="timer" aria-live="off">
              {left(ms)}
            </span>
            <span className="font-normal text-[#d9d5f5]">
              {where === "pricing" ? " · applied automatically at checkout, on any plan" : " · any plan, one use"}
            </span>
          </p>
        </div>
        <Link
          href={href}
          className="lc-btn-lift inline-flex min-h-11 w-fit shrink-0 items-center justify-center rounded-full bg-white px-5 text-[14px] font-bold text-[#121226] hover:bg-[#eeebff] focus-visible:outline focus-visible:outline-3 focus-visible:outline-offset-2 focus-visible:outline-[#c9c0ff]"
        >
          Claim {offer.percent}% off →
        </Link>
      </div>
      <button
        type="button"
        onClick={dismiss}
        aria-label="Hide this offer"
        className="absolute right-1.5 top-1.5 inline-flex h-11 w-11 items-center justify-center rounded-full text-[#c9c0ff] hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-3 focus-visible:outline-[#c9c0ff]"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>
    </aside>
  );
}
