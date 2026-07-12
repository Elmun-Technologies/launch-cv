"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";
import { CtaLink } from "@/components/cta-link";

type StickyCtaProps = {
  /** Where the primary button points, e.g. "/register" or "/free-ats-check". */
  primaryHref: string;
  /** Primary button label, e.g. "Try free". */
  primaryLabel: string;
  /** Tailwind background/hover classes for the primary button (page accent). */
  primaryClassName?: string;
  /** Analytics `cta` intent for the primary button. */
  primaryCta?: string;
  /** Secondary link target — defaults to the pricing page. */
  secondaryHref?: string;
  /** Secondary link label. */
  secondaryLabel?: string;
  /** Analytics `location` tag, unique per page (e.g. "features_index"). */
  location: string;
  /** Scroll distance (px) before the bar reveals. Keeps the hero unobstructed. */
  revealAfter?: number;
};

/**
 * A conversion bar that slides up once the visitor has scrolled past the hero
 * and hides again as they approach the footer (so it never covers the page's
 * own closing CTA). Fixed-positioned, so it adds zero layout shift, and it is
 * dismissible for the current page view.
 *
 * Rendered from Server Components — it is its own client boundary, like
 * `CtaLink`, so pages stay server-rendered.
 */
export function StickyCta({
  primaryHref,
  primaryLabel,
  primaryClassName = "bg-[#1A56DB] hover:bg-[#1D4ED8]",
  primaryCta = "get_started",
  secondaryHref = "/pricing",
  secondaryLabel = "See pricing",
  location,
  revealAfter = 640,
}: StickyCtaProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const scrollY = window.scrollY;
      const viewport = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      // Reveal after the hero, but retract near the footer's own CTA.
      const pastHero = scrollY > revealAfter;
      const nearFooter = scrollY + viewport >= docHeight - 200;
      setVisible(pastHero && !nearFooter);
    };

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [dismissed, revealAfter]);

  if (dismissed) return null;

  return (
    <div
      aria-hidden={!visible}
      className={`fixed inset-x-0 bottom-0 z-40 flex justify-center px-3 pb-3 transition-all duration-300 motion-reduce:transition-none ${
        visible ? "visible translate-y-0 opacity-100" : "invisible pointer-events-none translate-y-6 opacity-0"
      }`}
    >
      <div className="flex w-full max-w-[560px] items-center gap-3 rounded-2xl border border-[#E2E8F0] bg-white/95 p-2.5 pl-4 shadow-[0_12px_40px_-12px_rgba(15,23,42,0.35)] backdrop-blur supports-[backdrop-filter]:bg-white/85">
        <p className="hidden flex-1 text-[13px] font-medium leading-snug text-[#334155] sm:block">
          Ready when you are — it&apos;s free to start.
        </p>
        <Link
          href={secondaryHref}
          className="hidden shrink-0 rounded-lg px-3 py-2.5 text-[13px] font-semibold text-[#475569] transition hover:text-[#0F172A] sm:inline-flex"
        >
          {secondaryLabel}
        </Link>
        <CtaLink
          cta={primaryCta}
          location={`sticky:${location}`}
          href={primaryHref}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-lg px-4 py-2.5 text-[14px] font-semibold text-white shadow-sm transition sm:flex-none ${primaryClassName}`}
        >
          {primaryLabel}
          <ArrowRight className="h-4 w-4" />
        </CtaLink>
        <button
          type="button"
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="shrink-0 rounded-lg p-1.5 text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#475569]"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
