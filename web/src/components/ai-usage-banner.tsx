"use client";

import { useState } from "react";
import Link from "next/link";
import type { AiUsagePayload } from "@/hooks/use-ai-usage";
import { PUBLIC_PLANS } from "@/lib/monetization";
import { UpgradeDialog, type PlanLimitsMap } from "@/components/app/tools/upgrade-dialog";

type Kind = "jd" | "packet" | "roleFit";

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

  if (!usage.pro) {
    return (
      <div className="flex flex-col gap-3 rounded-[20px] bg-[#e4dfff] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] leading-[21px] text-[#121226]">
          <span className="font-bold">This tool is included in every plan</span>, from {PUBLIC_PLANS.starter.priceDisplay}/month.
          Plans only differ in monthly limits.
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
