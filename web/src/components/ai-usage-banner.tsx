"use client";

import Link from "next/link";
import type { AiUsagePayload } from "@/hooks/use-ai-usage";

type Kind = "jd" | "packet" | "roleFit";

export function AiUsageBanner({ usage, kind }: { usage: AiUsagePayload | null; kind: Kind }) {
  if (!usage) return null;
  const key = kind === "roleFit" ? "roleFit" : kind;
  const used = usage.used[key];
  const max = usage.limits[key];
  const left = max - used;
  if (left > 1) return null;
  return (
    <div className={`rounded-lg border px-3 py-2 text-xs ${usage.pro ? "border-amber-200 bg-amber-50 text-amber-800" : "border-blue-200 bg-blue-50 text-blue-800"}`}>
      <span className="font-semibold">AI limit:</span> {used}/{max} used this month.
      {!usage.pro ? (
        <>
          {" "}
          <Link href="/dashboard/settings" className="font-medium text-blue-600 underline">Pro subscription</Link>
        </>
      ) : null}
    </div>
  );
}
