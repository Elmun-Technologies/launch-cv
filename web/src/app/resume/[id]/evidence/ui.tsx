"use client";

import { useState } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { UpgradeDialog } from "@/components/app/tools/upgrade-dialog";
import { Badge, SparkIcon, ToolSkeleton, pillSoft, toolCard, toolH2, toolSubmit } from "@/components/app/tools/tool-ui";

type Issue = { severity: "low" | "med" | "high"; category?: string; bulletId?: string; message: string; suggestion: string };

const CATEGORY_LABEL: Record<string, string> = { dates: "Dates", format: "Format", claim: "Claim", metric: "Number", wording: "Wording" };
type Result = { issues: Issue[]; metrics_found: { text: string; bulletId?: string }[] };

const SEVERITY: Record<Issue["severity"], { label: string; tone: "red" | "amber" | "lilac" }> = {
  high: { label: "High", tone: "red" },
  med: { label: "Medium", tone: "amber" },
  low: { label: "Low", tone: "lilac" },
};

export function EvidenceClient({ resumeId }: { resumeId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<{ text: string; upgrade: boolean } | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [plansOpen, setPlansOpen] = useState(false);

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
      const upgrade = res?.status === 402 || res?.status === 403;
      setError({
        text: typeof j.error === "string" ? j.error : "Couldn't run the check. Please try again.",
        upgrade,
      });
      if (upgrade) setPlansOpen(true);
      return;
    }
    setResult(j.result as Result);
  }

  const order = { high: 0, med: 1, low: 2 } as const;
  const issues = [...(result?.issues ?? [])].sort((a, b) => order[a.severity] - order[b.severity]);
  const hasCategories = issues.some((x) => x.category && CATEGORY_LABEL[x.category]);

  const runLabel = result ? "Run again" : "Run consistency check";

  return (
    <div className="flex flex-col gap-4">
      {error ? (
        <div role="alert" className="flex flex-col gap-3 rounded-2xl bg-[#fbe2e3] px-4 py-3.5 text-[14px] leading-[21px] text-[#a3222a] sm:flex-row sm:items-center sm:justify-between">
          <p className="flex min-w-0 items-start gap-3">
            <AlertCircle className="mt-0.5 h-[18px] w-[18px] shrink-0" aria-hidden="true" />
            <span>{error.text}</span>
          </p>
          {error.upgrade ? (
            <button
              type="button"
              onClick={() => setPlansOpen(true)}
              className="lc-btn-lift inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#5440e8] px-5 text-[14px] font-semibold text-white hover:bg-[#4430d6] motion-reduce:transform-none"
            >
              See plans
            </button>
          ) : null}
        </div>
      ) : null}
      {error?.upgrade ? <UpgradeDialog open={plansOpen} onClose={() => setPlansOpen(false)} /> : null}

      {!result ? (
        <section className={`${toolCard} max-w-[820px]`}>
          <h2 className={toolH2}>Check dates, formats and claims</h2>
          <p className="mt-1.5 text-[14px] leading-[21px] text-[#4a4862]">
            We read the whole resume and flag what doesn’t line up, like a date written two ways or a team size that changes between sections.
            Each check counts toward your monthly AI limit.
          </p>
          <button type="button" onClick={() => void run()} disabled={loading} className={`${toolSubmit} mt-4 sm:w-auto`}>
            {loading ? <Loader2 className="h-[18px] w-[18px] motion-safe:animate-spin" aria-hidden="true" /> : <SparkIcon />}
            {runLabel}
          </button>
          {loading ? (
            <div className="mt-4" aria-busy="true">
              <ToolSkeleton rows={3} className="h-12 bg-[#f1eff8]!" />
            </div>
          ) : null}
        </section>
      ) : (
        <div className="grid items-start gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:gap-5">
          <section className={toolCard} aria-busy={loading}>
            <div className="flex items-center justify-between gap-3">
              <h2 className={toolH2}>
                {issues.length === 0 ? "No issues found" : `${issues.length} ${issues.length === 1 ? "thing" : "things"} to tidy up`}
              </h2>
              <button type="button" onClick={() => void run()} disabled={loading} className={pillSoft}>
                {loading ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : null}
                {runLabel}
              </button>
            </div>
            {issues.length > 0 ? (
              <ul className="mt-3">
                {issues.map((x, i) => (
                  <li
                    key={i}
                    className={`grid items-start gap-x-4 gap-y-1 border-t border-[#e2e0ea] py-4 sm:items-center ${hasCategories ? "grid-cols-[1fr_auto] sm:grid-cols-[96px_1fr_auto]" : "grid-cols-[1fr_auto]"}`}
                  >
                    {hasCategories ? (
                      <p className="col-span-2 text-[13px] font-bold text-[#121226] sm:col-span-1 sm:text-[14px]">{(x.category && CATEGORY_LABEL[x.category]) || "Other"}</p>
                    ) : null}
                    <div className="min-w-0 text-[14px] leading-[21px]">
                      <p className="text-[#24223a]">{x.message}</p>
                      {x.suggestion ? <p className="mt-1 text-[#4a4862]">{x.suggestion}</p> : null}
                    </div>
                    <Badge tone={SEVERITY[x.severity]?.tone ?? "lilac"}>{SEVERITY[x.severity]?.label ?? x.severity}</Badge>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-[14px] text-[#4a4862]">Dates, formats and claims look consistent.</p>
            )}
          </section>

          {result.metrics_found.length > 0 ? (
            <section className="rounded-[22px] bg-[#111118] p-[18px] text-white sm:rounded-[26px] sm:p-[26px]">
              <h2 className={toolH2}>Numbers in your resume</h2>
              <p className="mt-1.5 text-[14px] text-[#c9c7d8]">Be ready to explain each of these in an interview.</p>
              <ul className="mt-4 flex flex-wrap gap-2">
                {result.metrics_found.map((m, i) => (
                  <li key={i} className="rounded-full bg-[#2a2840] px-3.5 py-2 text-[14px] font-semibold">
                    {m.text}
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}

      <AiDisclaimer>AI checks can miss things or flag false positives. You decide what to change.</AiDisclaimer>
    </div>
  );
}
