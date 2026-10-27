"use client";

import Link from "next/link";
import { useState } from "react";
import { Loader2 } from "lucide-react";

type Issue = { severity: "low" | "med" | "high"; bulletId?: string; message: string; suggestion: string };
type Result = { issues: Issue[]; metrics_found: { text: string; bulletId?: string }[] };

const SEVERITY: Record<Issue["severity"], { label: string; cls: string }> = {
  high: { label: "High", cls: "text-[#C2341B]" },
  med: { label: "Medium", cls: "text-[#9C5200]" },
  low: { label: "Low", cls: "text-[#6B6B6B]" },
};

export function EvidenceClient({ resumeId }: { resumeId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ text: string; upgrade: boolean } | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  // Runs on demand: each check counts toward the monthly AI limit.
  async function run() {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/ai/evidence-check", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId }),
    }).catch(() => null);
    const j = res ? await res.json().catch(() => ({})) : {};
    setLoading(false);
    if (!res?.ok) {
      setError({
        text: typeof j.error === "string" ? j.error : "Couldn't run the check. Please try again.",
        upgrade: res?.status === 402 || res?.status === 403,
      });
      return;
    }
    setResult(j.result as Result);
  }

  const order = { high: 0, med: 1, low: 2 } as const;
  const issues = [...(result?.issues ?? [])].sort((a, b) => order[a.severity] - order[b.severity]);

  return (
    <div className="mt-6 flex flex-col gap-5">
      <div>
        <button
          type="button"
          onClick={() => void run()}
          disabled={loading}
          className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2563EB] px-5 text-[14px] font-medium text-white hover:bg-[#1D4ED8] disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
          {result ? "Run again" : "Run consistency check"}
        </button>
      </div>

      {error ? (
        <p role="alert" className="rounded-xl border border-[#F6D3CD] bg-[#FDF2F0] px-4 py-3 text-[14px] text-[#B42318]">
          {error.text}{" "}
          {error.upgrade ? (
            <Link href="/dashboard/settings/subscription" className="font-medium underline">
              See plans
            </Link>
          ) : null}
        </p>
      ) : null}

      {result ? (
        <>
          <section className="rounded-2xl border border-[#E5E5E2] bg-white p-5">
            <h2 className="text-[17px] font-semibold">
              {issues.length === 0 ? "No issues found" : `${issues.length} ${issues.length === 1 ? "issue" : "issues"} to review`}
            </h2>
            {issues.length > 0 ? (
              <ul className="mt-3">
                {issues.map((x, i) => (
                  <li key={i} className="border-t border-[#EEEEEB] py-3.5 first:border-t-0 first:pt-1">
                    <p className="text-[15px]">
                      <span className={`mr-2 text-[13px] font-medium ${SEVERITY[x.severity]?.cls ?? ""}`}>
                        {SEVERITY[x.severity]?.label ?? x.severity}
                      </span>
                      {x.message}
                    </p>
                    {x.suggestion ? <p className="mt-1 text-[14px] text-[#3F3F3F]">{x.suggestion}</p> : null}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1 text-[14px] text-[#6B6B6B]">Dates, formats and claims look consistent.</p>
            )}
          </section>

          {result.metrics_found.length > 0 ? (
            <section className="rounded-2xl border border-[#E5E5E2] bg-white p-5">
              <h2 className="text-[17px] font-semibold">Numbers in your resume</h2>
              <p className="mt-1 text-[14px] text-[#6B6B6B]">Be ready to explain each of these in an interview.</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {result.metrics_found.map((m, i) => (
                  <li key={i} className="rounded-full border border-[#E5E5E2] px-3 py-1 text-[13px]">
                    {m.text}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
