"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Loader2, Mail, Target, Users } from "lucide-react";
import { SiteMark } from "@/components/site/brand";
import { siteFontVars } from "@/lib/site-fonts";
import { PUBLIC_PLANS } from "@/lib/monetization";
import type { CheckoutPlan } from "@/lib/plan-config";

type Status = { paid: boolean; plan: string | null; currentPeriodEnd: string | null; cancelAtPeriodEnd: boolean; oneTime: boolean };

async function fetchStatus(): Promise<Status | null> {
  const r = await fetch("/api/subscription/status", { cache: "no-store" }).catch(() => null);
  if (!r?.ok) return null;
  const j = (await r.json().catch(() => ({}))) as Partial<Status> & { pro?: boolean };
  return {
    paid: j.paid === true || j.pro === true,
    plan: j.plan ?? null,
    currentPeriodEnd: j.currentPeriodEnd ?? null,
    cancelAtPeriodEnd: !!j.cancelAtPeriodEnd,
    oneTime: !!j.oneTime,
  };
}

/** Activate the plan from the returned checkout id (no-op without one). */
async function syncCheckout(checkoutId: string | null): Promise<void> {
  if (!checkoutId || checkoutId.includes("{")) return;
  await fetch("/api/polar/sync", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ checkoutId }),
  }).catch(() => null);
}

/**
 * Standalone screen after Polar sends the buyer back (?checkout=success): the
 * logo bar and nothing else from the app. Waits for the payment webhook
 * (polls the plan for ~30s), then shows the plan and what to do first.
 * Polar emails a receipt for every order, so the copy can say one is coming.
 */
export function CheckoutSuccessScreen({ email, resumeId }: { email: string; resumeId: string | null }) {
  const [state, setState] = useState<"waiting" | "confirmed" | "slow">("waiting");
  const [status, setStatus] = useState<Status | null>(null);

  useEffect(() => {
    let live = true;
    const checkoutId = new URLSearchParams(window.location.search).get("checkout_id");
    (async () => {
      // Ask the server to read the order from Polar and activate the plan now; the
      // payment webhook does the same, whichever lands first. Then confirm via status.
      await syncCheckout(checkoutId);
      let s = await fetchStatus();
      for (let i = 0; i < 20 && live && !s?.paid; i++) {
        await new Promise((res) => setTimeout(res, i < 5 ? 1500 : 3000));
        if (i % 2 === 1) await syncCheckout(checkoutId);
        s = await fetchStatus();
      }
      if (!live) return;
      setStatus(s);
      setState(s?.paid ? "confirmed" : "slow");
    })();
    return () => {
      live = false;
    };
  }, []);

  // Once the plan is active, take the buyer straight into the work after a short pause.
  const firstHref = resumeId ? `/resume/${resumeId}/jd` : "/resume/new";
  const [countdown, setCountdown] = useState(6);
  useEffect(() => {
    if (state !== "confirmed") return;
    if (countdown <= 0) {
      window.location.assign(firstHref);
      return;
    }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  });

  const plan = status?.plan && status.plan in PUBLIC_PLANS ? PUBLIC_PLANS[status.plan as CheckoutPlan] : null;
  const oneTime = !!status?.oneTime;
  const lifetime = status?.plan === "lifetime" || (oneTime && !status?.currentPeriodEnd);
  const endDay = status?.currentPeriodEnd
    ? new Date(status.currentPeriodEnd).toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : null;
  const passEnds = oneTime && !lifetime ? endDay : null;
  const renews = !oneTime && !lifetime && !status?.cancelAtPeriodEnd ? endDay : null;

  const steps = [
    {
      href: firstHref,
      icon: Target,
      t: "Match your resume to a job",
      d: "Paste a posting, get missing skills and rewrites",
    },
    { href: resumeId ? `/resume/${resumeId}/packet` : "/resume/new", icon: Mail, t: "Write a cover letter", d: "From your resume and the job post" },
    {
      href: resumeId ? `/resume/${resumeId}/packet` : "/resume/new",
      icon: Users,
      t: "Prepare for an interview",
      d: "Likely questions with answers from your resume",
    },
  ];

  return (
    <div className={`lc-site ${siteFontVars} min-h-dvh bg-[#eeecf4] text-[#121226]`}>
      <header className="border-b border-[#e2e0ea] bg-white px-4 py-3 sm:px-10 sm:py-5">
        <Link
          href="/dashboard"
          aria-label="LaunchCV dashboard"
          className="focus-visible:outline-[#5440e8]! focus-visible:rounded-xl! inline-flex min-h-11 items-center gap-2.5 rounded-xl text-[#121226]"
        >
          <SiteMark size={32} />
          <span className="text-[20px] font-extrabold tracking-[-0.02em]">
            launch<span className="text-[#5440e8]">cv</span>
          </span>
        </Link>
      </header>

      <main className="mx-auto max-w-[640px] px-4 py-8 sm:px-10 sm:py-[72px]">
        <div className="flex flex-col justify-center">
          <p role="status" className="sr-only">
            {state === "confirmed" ? "Your plan is active." : state === "waiting" ? "Activating your plan." : "Your plan is still activating."}
          </p>
          <span className="self-start rounded-full bg-[#dcf5ea] px-3 py-[7px] text-[13px] font-bold text-[#0b4f35]">Payment received</span>
          {state === "confirmed" ? (
            <>
              <h1 className="mt-[18px] text-[36px] font-extrabold leading-[40px] tracking-[-0.045em] sm:text-[56px] sm:leading-[60px]">
                {plan ? <>You&apos;re on {plan.title}.</> : <>Your plan is active.</>}{" "}
                <span className="whitespace-nowrap text-[#7c7a94]">Let&apos;s use it.</span>
              </h1>
              <p className="mt-3.5 text-[16px] leading-[25px] text-[#4a4862] sm:text-[17px] sm:leading-[27px]">
                A receipt is on its way to <span className="break-words">{email}</span>.{" "}
                {lifetime
                  ? "It's a one-time payment, so it never renews."
                  : passEnds
                    ? `Your pass runs until ${passEnds}. It doesn't renew, so there's nothing to cancel.`
                    : renews
                    ? `Your plan renews on ${renews}; cancel anytime in Settings.`
                    : "Manage it anytime in Settings."}
              </p>
              <p className="mt-4 text-[14px] text-[#4a4862]" aria-live="polite">
                Taking you to “{steps[0].t.toLowerCase()}” in {Math.max(countdown, 0)}s, or pick a step below.
              </p>
              <ul className="mt-4 flex flex-col gap-2">
                {steps.map((s, i) => {
                  const Icon = s.icon;
                  const first = i === 0;
                  return (
                    <li key={s.t}>
                      <Link
                        href={s.href}
                        className={`group flex min-h-11 items-center gap-3.5 rounded-[20px] px-4 py-3.5 transition-colors focus-visible:rounded-[20px]! motion-reduce:transition-none sm:px-[18px] sm:py-4 ${
                          first ? "bg-[#5440e8] text-white hover:bg-[#4430d6]" : "bg-white text-[#121226] hover:bg-[#f7f6fb]"
                        }`}
                      >
                        <span
                          aria-hidden="true"
                          className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${first ? "bg-white text-[#3a2bb8]" : "bg-[#e4dfff] text-[#3a2bb8]"}`}
                        >
                          <Icon className="h-[18px] w-[18px]" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[16px] font-bold">{s.t}</span>
                          <span className={`block text-[13px] leading-[19px] ${first ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>{s.d}</span>
                        </span>
                        <ArrowRight className="h-4 w-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </>
          ) : (
            <>
              <h1 className="mt-[18px] text-[32px] font-extrabold leading-[36px] tracking-[-0.04em] sm:text-[44px] sm:leading-[48px]">
                {state === "waiting" ? "Activating your plan…" : "Your plan is still activating."}
              </h1>
              <p className="mt-3.5 flex items-start gap-2.5 text-[16px] leading-[25px] text-[#4a4862]">
                {state === "waiting" ? <Loader2 className="mt-1 h-4 w-4 shrink-0 animate-spin text-[#3a2bb8]" aria-hidden /> : null}
                {state === "waiting"
                  ? "This usually takes a few seconds."
                  : "Refresh this page in a minute. If it still shows no plan, contact support and we'll sort it out."}
              </p>
              {state === "slow" ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  <Link
                    href="/dashboard/settings/subscription"
                    className="lc-btn-lift inline-flex min-h-11 items-center rounded-full bg-[#5440e8] px-5 text-[15px] font-semibold text-white hover:bg-[#4430d6] focus-visible:rounded-full!"
                  >
                    Plan and billing
                  </Link>
                  <Link
                    href="/dashboard/support"
                    className="inline-flex min-h-11 items-center rounded-full bg-white px-5 text-[15px] font-semibold text-[#121226] hover:bg-[#f7f6fb] focus-visible:rounded-full!"
                  >
                    Contact support
                  </Link>
                </div>
              ) : null}
            </>
          )}
        </div>

      </main>
    </div>
  );
}
