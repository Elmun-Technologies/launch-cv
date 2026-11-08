"use client";

import { useState } from "react";
import Link from "next/link";
import type { AiUsagePayload } from "@/hooks/use-ai-usage";
import { PUBLIC_PLANS, planPriceLabel } from "@/lib/monetization";
import { UpgradeDialog, type PlanLimitsMap } from "@/components/app/tools/upgrade-dialog";
import { VerifyEmailNotice } from "@/components/verify-email-notice";

type Kind = "jd" | "packet" | "roleFit";

const UNIT: Record<Kind, [string, string]> = {
  jd: ["job match", "job matches"],
  roleFit: ["role-fit check", "role-fit checks"],
  packet: ["application packet", "application packets"],
};

/** Shown above an AI tool when the user has no plan, or is about to run out this month. */
export function AiUsageBanner({
  usage,
  kind,
  limits,
}: {
  usage: AiUsagePayload | null;
  kind: Kind;
  /** Admin-configured plan limits for the plan picker (defaults to the built-in ones). */
  limits?: PlanLimitsMap;
}) {
  const [open, setOpen] = useState(false);
  if (!usage) return null;
  const key = kind === "roleFit" ? "roleFit" : kind;
  const used = usage.used[key];
  const max = usage.limits[key];

  // Free AI checks need a confirmed email: ask for that instead of pitching plans.
  if (!usage.pro && usage.emailVerified === false && max > 0) return <VerifyEmailNotice />;

  if (!usage.pro) {
    const left = Math.max(0, max - used);
    const week = `${PUBLIC_PLANS.week.title} is ${planPriceLabel("week")}, with no auto-renewal`;
    return (
      <div className="flex flex-col gap-3 rounded-[20px] bg-[#e4dfff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] leading-[21px] text-[#121226]">
          {left > 0 ? (
            <>
              <span className="font-bold">
                {left} of {max} free {UNIT[kind][max === 1 ? 0 : 1]} left this month.
              </span>{" "}
              For more, the {week}.
            </>
          ) : max > 0 ? (
            <>
              <span className="font-bold">You&apos;ve used this month&apos;s free AI checks.</span> The {week}. Your work stays saved.
            </>
          ) : (
            <>
              <span className="font-bold">This tool is included in every paid plan.</span> The {week}.
            </>
          )}
        </p>
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="lc-btn-lift inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#5440e8] px-5 text-[14px] font-semibold text-white hover:bg-[#4430d6] motion-reduce:transform-none"
        >
          See plans
        </button>
        <UpgradeDialog open={open} onClose={() => setOpen(false)} kind={kind} limits={limits} location={`ai_usage_banner:${kind}`} />
      </div>
    );
  }

  if (max - used > 1) return null;
  return (
    <div className="rounded-[20px] bg-[#fdf0d5] px-5 py-3.5 text-[14px] leading-[21px] text-[#121226]">
      <span className="font-bold">
        {used} of {max.toLocaleString("en-US")} used this month.
      </span>{" "}
      <Link
        href="/dashboard/settings/subscription"
        className="font-semibold text-[#3a2bb8] underline decoration-[#3a2bb8]/30 underline-offset-2 hover:decoration-[#3a2bb8]"
      >
        Higher limits
      </Link>
    </div>
  );
}
