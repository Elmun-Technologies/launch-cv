"use client";

import Link from "next/link";
import type { AiUsagePayload } from "@/hooks/use-ai-usage";
import { trackCtaClick } from "@/lib/analytics-client";
import { PUBLIC_PLANS } from "@/lib/monetization";

type Kind = "jd" | "packet" | "roleFit";

/** Shown above an AI tool when the user has no plan, or is about to run out this month. */
export function AiUsageBanner({ usage, kind }: { usage: AiUsagePayload | null; kind: Kind }) {
  if (!usage) return null;
  const key = kind === "roleFit" ? "roleFit" : kind;
  const used = usage.used[key];
  const max = usage.limits[key];

  if (!usage.pro) {
    return (
      <div className="flex flex-col gap-3 rounded-2xl border border-[#DCE6FF] bg-[#EEF3FF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[14px] text-[#111111]">
          <span className="font-medium">This tool is included in every plan</span>, from {PUBLIC_PLANS.starter.priceDisplay}/month.
          Plans only differ in monthly limits.
        </p>
        <Link
          href="/dashboard/settings/subscription"
          onClick={() => trackCtaClick({ cta: "choose_plan", location: `ai_usage_banner:${kind}` })}
          className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] px-5 text-[14px] font-medium text-white hover:bg-[#1D4ED8]"
        >
          See plans
        </Link>
      </div>
    );
  }

  if (max - used > 1) return null;
  return (
    <div className="rounded-2xl border border-[#F4D9B0] bg-[#FDF6EC] px-5 py-3.5 text-[14px] text-[#111111]">
      <span className="font-medium">
        {used} of {max.toLocaleString("en-US")} used this month.
      </span>{" "}
      <Link href="/dashboard/settings/subscription" className="text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
        Higher limits
      </Link>
    </div>
  );
}
