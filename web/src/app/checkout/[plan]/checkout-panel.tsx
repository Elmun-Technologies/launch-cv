"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Loader2, Lock } from "lucide-react";
import { CtaLink } from "@/components/cta-link";
import { btnPrimary } from "@/components/site/ui";
import { getGaClientId, trackCheckoutStart, trackCtaClick, trackPlanSelected } from "@/lib/analytics-client";
import { checkoutAuthHrefs, isPolarCheckoutUrl, successRedirect } from "@/lib/checkout-embed";
import type { CheckoutPlan } from "@/lib/plan-config";

/** If Polar's overlay hasn't loaded by then (blocked frame, script error), go to the hosted page instead. */
const EMBED_TIMEOUT_MS = 15_000;

const linkCls = "lc-link font-semibold text-[#5440e8]";

type Notice = { tone: "error" | "info"; text: string; conflict?: boolean };

/**
 * Pay button of /checkout/[plan]. Signed out: sign-up / sign-in that return
 * here. Signed in: asks /api/polar/checkout for a checkout URL and opens it in
 * Polar's embedded overlay (@polar-sh/checkout), falling back to a full-page
 * redirect when the overlay can't load. Success goes to the existing success
 * screen; the payment webhook stays the source of truth for access.
 */
export function CheckoutPanel({
  plan,
  planTitle,
  signedIn,
  conflict,
  paused,
}: {
  plan: CheckoutPlan;
  planTitle: string;
  signedIn: boolean;
  /** Why the API would refuse this checkout right now (same rule as /api/polar/checkout), or null. */
  conflict: string | null;
  /** Admin switch "checkout" is off. */
  paused: string | null;
}) {
  const [busy, setBusy] = useState<"idle" | "creating" | "opening">("idle");
  const [notice, setNotice] = useState<Notice | null>(
    conflict ? { tone: "info", text: conflict, conflict: true } : paused ? { tone: "info", text: paused } : null,
  );
  const autoStarted = useRef(false);
  const blocked = !!notice?.conflict || !!paused;

  async function openEmbed(url: string) {
    if (!isPolarCheckoutUrl(url)) {
      window.location.href = url;
      return;
    }
    setBusy("opening");
    let settled = false;
    const fallback = () => {
      if (settled) return;
      settled = true;
      window.location.href = url;
    };
    const timer = window.setTimeout(fallback, EMBED_TIMEOUT_MS);
    try {
      const { PolarEmbedCheckout } = await import("@polar-sh/checkout/embed");
      const checkout = await PolarEmbedCheckout.create(url, { theme: "light" });
      window.clearTimeout(timer);
      if (settled) return;
      settled = true;
      setBusy("idle");
      checkout.addEventListener("success", (e) => {
        // Our own redirect, to our success screen (it waits for the webhook).
        e.preventDefault();
        window.location.href = successRedirect(e.detail.successURL, window.location.origin);
      });
      checkout.addEventListener("close", () => setBusy("idle"));
    } catch {
      window.clearTimeout(timer);
      fallback();
    }
  }

  async function start(source: "click" | "auto") {
    if (busy !== "idle") return;
    // Same funnel events the subscription page fired when it opened checkout.
    trackCtaClick({ cta: "choose_plan", plan, location: source === "auto" ? "checkout_page_auto" : "checkout_page" });
    trackPlanSelected(plan, { location: "checkout_page" });
    setBusy("creating");
    setNotice(null);
    const res = await fetch("/api/polar/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ plan, gaClientId: getGaClientId() }),
    }).catch(() => null);
    const j = (res ? await res.json().catch(() => ({})) : {}) as { url?: unknown; error?: unknown; code?: unknown };
    if (res?.ok && typeof j.url === "string") {
      trackCheckoutStart(plan);
      await openEmbed(j.url);
      return;
    }
    setBusy("idle");
    if (res?.status === 401) {
      window.location.href = checkoutAuthHrefs(plan).login;
      return;
    }
    if (res?.status === 409 && typeof j.error === "string") setNotice({ tone: "info", text: j.error, conflict: true });
    else if (res && res.status >= 500 && res.status !== 503)
      setNotice({ tone: "error", text: "Checkout isn't available right now. Please try again in a few minutes or contact support." });
    else setNotice({ tone: "error", text: typeof j.error === "string" ? j.error : "Couldn't open checkout. Please try again." });
  }

  // Back from sign-up / sign-in with ?start=1: open payment straight away, as the old flow did.
  useEffect(() => {
    if (!signedIn || autoStarted.current) return;
    const qs = new URLSearchParams(window.location.search);
    if (qs.get("start") !== "1") return;
    autoStarted.current = true;
    qs.delete("start");
    const rest = qs.toString();
    window.history.replaceState(null, "", `${window.location.pathname}${rest ? `?${rest}` : ""}`);
    if (!blocked) void start("auto");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signedIn]);

  if (!signedIn) {
    const { register, login } = checkoutAuthHrefs(plan);
    return (
      <div className="flex flex-col gap-3">
        <CtaLink cta="checkout_sign_up" plan={plan} location="checkout_page" href={register} className={`${btnPrimary} w-full`}>
          Create a free account to continue
        </CtaLink>
        <p className="text-center text-[14px] text-[#4a4862]">
          Already have an account?{" "}
          <Link href={login} className={`${linkCls} inline-block py-1.5`}>
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {notice ? (
        <div
          role={notice.tone === "error" ? "alert" : "status"}
          className={`rounded-[18px] px-4 py-3.5 text-[14px] leading-[21px] ${notice.tone === "error" ? "bg-[#fbe2e3] text-[#a3262b]" : "bg-[#fdf0d5] text-[#7a4600]"}`}
        >
          <p className="font-semibold">{notice.text}</p>
          {notice.conflict ? (
            <p className="mt-1.5">
              <Link href="/dashboard/settings/subscription" className="lc-link font-bold text-[#121226]">
                See your plan in Settings → Subscription
              </Link>
            </p>
          ) : null}
        </div>
      ) : null}
      {notice?.conflict ? null : (
        <button type="button" onClick={() => void start("click")} disabled={busy !== "idle" || !!paused} className={`${btnPrimary} w-full disabled:pointer-events-none disabled:opacity-60`}>
          {busy !== "idle" ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Lock className="h-4 w-4" aria-hidden="true" />}
          {busy === "creating" ? "Preparing checkout…" : busy === "opening" ? "Opening secure checkout…" : `Continue to payment`}
        </button>
      )}
      <span className="sr-only" aria-live="polite">
        {busy === "opening" ? `Opening Polar checkout for the ${planTitle}.` : ""}
      </span>
    </div>
  );
}
