"use client";

import Link from "next/link";
import { trackCtaClick } from "@/lib/analytics-client";

/** Result of a failed AI tool run: a plain error, or — when the plan is the reason — an offer to pick one. */
export function ToolNotice({ message, upgrade, location }: { message: string; upgrade: boolean; location: string }) {
  if (!upgrade) {
    return (
      <p role="alert" className="rounded-xl border border-[#F6D3CD] bg-[#FDF2F0] px-4 py-3 text-[14px] text-[#B42318]">
        {message}
      </p>
    );
  }
  return (
    <div role="status" className="flex flex-col gap-3 rounded-2xl border border-[#DCE6FF] bg-[#EEF3FF] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-[14px] text-[#111111]">{message}</p>
      <Link
        href="/dashboard/settings/subscription"
        onClick={() => trackCtaClick({ cta: "choose_plan", location })}
        className="inline-flex h-10 shrink-0 items-center justify-center rounded-full bg-[#2563EB] px-5 text-[14px] font-medium text-white hover:bg-[#1D4ED8]"
      >
        See plans
      </Link>
    </div>
  );
}
