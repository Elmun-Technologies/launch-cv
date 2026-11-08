"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import { UpgradeDialog, type AiToolKind, type PlanLimitsMap } from "@/components/app/tools/upgrade-dialog";
import { VerifyEmailNotice } from "@/components/verify-email-notice";

/**
 * Result of a failed AI tool run: a plain error, or — when the plan is the reason — an
 * offer to pick one (opens the v5 plan picker; `autoOpen` shows it right away).
 */
export function ToolNotice({
  message,
  upgrade,
  location,
  kind,
  limits,
  autoOpen = false,
  verifyEmail = false,
}: {
  message: string;
  upgrade: boolean;
  /** The account must confirm its email before free AI checks: offer to resend the link, not plans. */
  verifyEmail?: boolean;
  location: string;
  /** Which tool hit the paywall; tailors the plan picker's copy and limits. */
  kind?: AiToolKind;
  /** Admin-configured plan limits (defaults to the built-in ones). */
  limits?: PlanLimitsMap;
  /** Open the plan picker as soon as the notice appears. */
  autoOpen?: boolean;
}) {
  const [open, setOpen] = useState(upgrade && autoOpen && !verifyEmail);

  if (verifyEmail) return <VerifyEmailNotice message={message} />;
  if (!upgrade) {
    return (
      <div role="alert" className="flex items-start gap-3 rounded-2xl bg-[#fbe2e3] px-4 py-3.5 text-[14px] leading-[21px] text-[#a3222a]">
        <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden="true" />
        <p className="min-w-0">{message}</p>
      </div>
    );
  }
  return (
    <>
      <div role="status" className="flex flex-col gap-3 rounded-[20px] bg-[#e4dfff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] leading-[21px] text-[#121226]">{message}</p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="lc-btn-lift inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#5440e8] px-5 text-[14px] font-semibold text-white hover:bg-[#4430d6] motion-reduce:transform-none"
        >
          See plans
        </button>
      </div>
      <UpgradeDialog open={open} onClose={() => setOpen(false)} kind={kind} limits={limits} location={location} />
    </>
  );
}
