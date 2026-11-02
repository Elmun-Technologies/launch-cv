"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";
import { X } from "lucide-react";
import { trackCtaClick } from "@/lib/analytics-client";
import { PUBLIC_PLANS, planPriceLabel } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, PLAN_MONTHLY_LIMITS, type CheckoutPlan } from "@/lib/plan-config";

export type AiToolKind = "jd" | "packet" | "roleFit";
export type PlanLimitsMap = Record<CheckoutPlan, { jd: number; packet: number; roleFit: number }>;

const COPY: Record<AiToolKind | "any", { eyebrow: string; title: string; points: string[]; unit?: string }> = {
  jd: {
    eyebrow: "JOB MATCH",
    title: "See what this job wants that your resume doesn’t say.",
    points: ["Match score and missing skills", "Rewrites for your bullets", "Cover letter and interview prep"],
    unit: "job matches",
  },
  roleFit: {
    eyebrow: "ROLE FIT",
    title: "See how a hiring manager would score your resume.",
    points: ["A score for each hiring criterion", "Fixes in priority order", "Job match, cover letter and interview prep"],
    unit: "role-fit checks",
  },
  packet: {
    eyebrow: "COVER LETTER & INTERVIEW",
    title: "Walk into the interview with your letter and answers ready.",
    points: ["A cover letter for this job", "A short elevator pitch", "Ten likely questions with answer outlines"],
    unit: "application packets",
  },
  any: {
    eyebrow: "AI TOOLS",
    title: "Every AI tool is included in every plan.",
    points: ["Job match and role fit", "Cover letters and interview prep", "Plans only differ in monthly limits"],
  },
};

/**
 * Plan picker shown when an AI tool needs a plan (State-Upgrade mockup): a centered
 * two-column dialog on desktop, a bottom sheet on phones. Continuing opens
 * /dashboard/settings/subscription?plan=<plan>, which starts that plan's checkout.
 * Prices come from PUBLIC_PLANS, limits from the admin-configured plan limits.
 */
export function UpgradeDialog({
  open,
  onClose,
  kind,
  limits = PLAN_MONTHLY_LIMITS,
  location,
}: {
  open: boolean;
  onClose: () => void;
  kind?: AiToolKind;
  limits?: PlanLimitsMap;
  /** Analytics location for the choose_plan CTA event (no event when omitted). */
  location?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const popular = CHECKOUT_PLAN_ORDER.find((p) => PUBLIC_PLANS[p].popular) ?? CHECKOUT_PLAN_ORDER[0];
  const [plan, setPlan] = useState<CheckoutPlan>(popular);
  const copy = COPY[kind ?? "any"];

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) d.showModal();
    if (!open && d.open) d.close();
  }, [open]);

  function line(p: CheckoutPlan) {
    if (PUBLIC_PLANS[p].periodLabel === "once") return "Pay once, never renews";
    if (!kind || !copy.unit) return PUBLIC_PLANS[p].valueLine;
    return `${limits[p][kind].toLocaleString("en-US")} ${copy.unit} a month`;
  }

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onClose={onClose}
      onClick={(e) => {
        // Click on the backdrop (outside the panel) closes.
        if (e.target === e.currentTarget) onClose();
      }}
      className="m-auto max-h-[calc(100svh-32px)] w-[760px] max-w-[calc(100%-32px)] overflow-y-auto overscroll-contain rounded-[32px] bg-white p-0 text-[#121226] shadow-[0_40px_80px_-30px_rgba(10,6,60,.6)] backdrop:bg-[#111118]/50 max-sm:mb-0 max-sm:max-h-[92svh] max-sm:w-full max-sm:max-w-full max-sm:rounded-b-none"
    >
      <div className="sm:grid sm:grid-cols-[0.85fr_1.15fr]">
        <div className="relative hidden overflow-hidden bg-[#5440e8] p-8 text-white sm:block">
          <p aria-hidden="true" className="lc-poster absolute bottom-1.5 left-[22px] m-0 text-[56px] leading-[56px] text-[#6a58ee]">
            UNLOCK
          </p>
          <p className="relative text-[13px] font-bold tracking-[.08em] text-[#e4dfff]">{copy.eyebrow}</p>
          <p className="relative mt-2.5 text-[26px] font-extrabold leading-[31px] tracking-[-0.02em]">{copy.title}</p>
          <ul className="relative mt-4 list-disc pl-[18px] pb-16 text-[14px] leading-6 text-[#e4dfff]">
            {copy.points.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </div>

        <div className="px-[18px] pb-[26px] pt-[22px] sm:p-8">
          <span aria-hidden="true" className="mx-auto mb-4 block h-[5px] w-10 rounded-[9px] bg-[#d9d4f2] sm:hidden" />
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[12px] font-bold tracking-[.08em] text-[#5440e8] sm:hidden">{copy.eyebrow}</p>
              <h2 id={titleId} className="mt-1.5 text-[24px] font-extrabold leading-[28px] tracking-[-0.02em] sm:mt-0">
                Pick a plan
              </h2>
              <p className="mt-1.5 text-[14px] text-[#4a4862] sm:hidden">{copy.points.join(" · ")}</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1eff8] transition-colors hover:bg-[#e4dfff]"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <fieldset className="mt-4 flex flex-col gap-2">
            <legend className="sr-only">Plan</legend>
            {CHECKOUT_PLAN_ORDER.map((p) => {
              const on = plan === p;
              return (
                <label
                  key={p}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl p-3.5 transition-colors has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-[#5440e8]/25 sm:gap-3.5 sm:rounded-[18px] sm:px-[18px] sm:py-4 ${
                    on ? "border-2 border-[#5440e8] bg-[#f6f4ff]" : "border-[1.5px] border-[#e2e0ea] hover:border-[#c9c0ff]"
                  }`}
                >
                  <input
                    type="radio"
                    name={`${titleId}-plan`}
                    value={p}
                    checked={on}
                    onChange={() => setPlan(p)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden="true"
                    className={`inline-flex h-5 w-5 flex-none rounded-full ${on ? "border-[6px] border-[#5440e8]" : "border-2 border-[#c9c7d8]"}`}
                  />
                  <span className="min-w-0 flex-1">
                    <b className="text-[16px]">{PUBLIC_PLANS[p].title}</b>{" "}
                    {PUBLIC_PLANS[p].popular ? (
                      <span className="ml-1 hidden rounded-full bg-[#ff7a33] px-2.5 py-[5px] text-[12px] font-bold text-[#111118] sm:inline-block">
                        Most picked
                      </span>
                    ) : null}
                    <span className="block text-[12px] text-[#4a4862] sm:text-[13px]">{line(p)}</span>
                  </span>
                  <b className="text-[16px] sm:text-[20px]">{planPriceLabel(p)}</b>
                </label>
              );
            })}
          </fieldset>

          <Link
            href={`/dashboard/settings/subscription?plan=${plan}`}
            onClick={() => (location ? trackCtaClick({ cta: "choose_plan", plan, location }) : undefined)}
            className="lc-btn-lift mt-4 inline-flex h-[54px] w-full items-center justify-center rounded-full bg-[#5440e8] px-[26px] text-[16px] font-semibold text-white hover:bg-[#4430d6] motion-reduce:transform-none"
          >
            Continue to checkout
          </Link>
          <p className="mt-2.5 text-center text-[12px] text-[#66647c]">
            Secure checkout by Polar · 7-day refund on monthly plans ·{" "}
            <Link
              href="/dashboard/settings/subscription"
              onClick={() => (location ? trackCtaClick({ cta: "choose_plan", location }) : undefined)}
              className="font-semibold text-[#5440e8] underline decoration-[#5440e8]/30 underline-offset-2 hover:decoration-[#5440e8]"
            >
              Compare plans
            </Link>
          </p>
        </div>
      </div>
    </dialog>
  );
}
