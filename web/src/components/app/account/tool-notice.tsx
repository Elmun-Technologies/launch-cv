"use client";

import Link from "next/link";
import { trackCtaClick } from "@/lib/analytics-client";
import { btnSmPrimary } from "./ui";

/** v5 variant of components/tool-notice: a plain error, or — when the plan is the reason — an offer to pick one. */
export function AccountToolNotice({ message, upgrade, location }: { message: string; upgrade: boolean; location: string }) {
  if (!upgrade) {
    return (
      <p role="alert" className="rounded-2xl bg-[#fbe2e3] px-4 py-3 text-[14px] font-semibold text-[#a3262b]">
        {message}
      </p>
    );
  }
  return (
    <div role="status" className="flex flex-col gap-3 rounded-[20px] bg-[#e4dfff] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
      <p className="text-[14px] leading-[21px] text-[#121226]">{message}</p>
      <Link
        href="/dashboard/settings/subscription"
        onClick={() => trackCtaClick({ cta: "choose_plan", location })}
        className={`${btnSmPrimary} shrink-0`}
      >
        See plans
      </Link>
    </div>
  );
}
