"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { ToolNotice } from "@/components/tool-notice";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { AiUsageBanner } from "@/components/ai-usage-banner";
import { useAiUsage } from "@/hooks/use-ai-usage";
import type { RoleFitResult } from "@/types/ai-results";
import type { PlanLimitsMap } from "@/components/app/tools/upgrade-dialog";
import {
  ScoreRing,
  SparkIcon,
  ToolSkeleton,
  toolCard,
  toolEyebrow,
  toolLabel,
  toolSubmit,
  toolTextarea,
} from "@/components/app/tools/tool-ui";

function barColor(pct: number) {
  if (pct >= 0.8) return "bg-[#22b07d]";
  if (pct >= 0.6) return "bg-[#f2a91f]";
  return "bg-[#c42b30]";
}

/** Segmented score bar: one segment per point for small scales, otherwise ten. */
function ScoreBar({ score, max }: { score: number; max: number }) {
  const pct = max > 0 ? Math.max(0, Math.min(1, score / max)) : 0;
  const segments = Number.isInteger(max) && max > 0 && max <= 12 ? max : 10;
  const filled = Math.round(pct * segments);
  return (
    <div className="flex gap-1" aria-hidden="true">
      {Array.from({ length: segments }, (_, i) => (
        <span key={i} className={`h-2.5 flex-1 rounded-[3px] ${i < filled ? barColor(pct) : "bg-[#efedf7]"}`} />
      ))}
    </div>
  );
}

function verdict(score: number) {
  if (score >= 80) return "Strong candidate for this role.";
  if (score >= 70) return "Good candidate, with gaps to close.";
  if (score >= 50) return "Close, but a few gaps stand out.";
  return "Not a strong fit yet. Start with the fixes.";
}

export function FitClient({ resumeId, planLimits }: { resumeId: string; planLimits?: PlanLimitsMap }) {
  const usage = useAiUsage();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgrade, setUpgrade] = useState(false);
  const [result, setResult] = useState<RoleFitResult | null>(null);
  const [withJd, setWithJd] = useState(false);

  async function run() {
    setLoading(true);
    setError(null);
    setUpgrade(false);
    const usedJd = Boolean(jd.trim());
    const res = await fetch("/api/ai/role-fit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId,
        jdText: jd.trim() ? jd : undefined,
      }),
    });
    setLoading(false);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error ?? "Error");
      if (j.code === "USAGE_LIMIT" && j.upgrade) setUpgrade(true);
      return;
    }
    setResult(j.result as RoleFitResult);
    setWithJd(usedJd);
  }

  const overall = result ? Math.round(result.overall) : 0;
  const max = usage?.limits.roleFit ?? 0;
  const showFixes = Boolean(result && !loading && result.prioritized_fixes.length > 0);

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <AiUsageBanner usage={usage} kind="roleFit" limits={planLimits} />

      <div className="grid items-start gap-4 lg:grid-cols-[1.3fr_0.7fr] lg:grid-rows-[auto_1fr] lg:gap-5">
        {/* Input */}
        <section className={`${toolCard} lg:col-start-2 ${showFixes ? "lg:row-start-2" : "lg:row-start-1"}`}>
          <label htmlFor="fit-jd" className={toolLabel}>
            Job description <span className="font-normal text-[#66647c]">(optional)</span>
          </label>
          <p id="fit-jd-hint" className="mt-1 text-[13px] leading-5 text-[#66647c]">
            Leave it empty to evaluate the resume on its own.
          </p>
          <textarea
            id="fit-jd"
            aria-describedby="fit-jd-hint"
            className={`${toolTextarea} mt-2.5 min-h-[140px]`}
            value={jd}
            onChange={(e) => setJd(e.target.value)}
            placeholder="Paste the job description..."
          />
          <button type="button" disabled={loading} onClick={() => void run()} className={`${toolSubmit} mt-3`}>
            {loading ? <Loader2 className="h-[18px] w-[18px] motion-safe:animate-spin" aria-hidden="true" /> : <SparkIcon />}
            {loading ? "Evaluating..." : "Evaluate"}
          </button>
          {usage?.pro && max > 0 ? (
            <p className="mt-2.5 text-center text-[12px] text-[#66647c]">
              Uses 1 of your {max.toLocaleString("en-US")} monthly checks · {usage.used.roleFit.toLocaleString("en-US")} used
            </p>
          ) : null}
        </section>

        {/* Result */}
        <div className="flex min-w-0 flex-col gap-4 lg:col-start-1 lg:row-span-2 lg:row-start-1" aria-busy={loading}>
          {error ? <ToolNotice message={error} upgrade={upgrade} location="role_fit_paywall" kind="roleFit" limits={planLimits} autoOpen /> : null}

          {loading ? <ToolSkeleton rows={5} className="h-16" /> : null}

          {!result && !loading ? (
            <section className="rounded-[22px] border-[1.5px] border-dashed border-[#c9c7d8] p-6 text-center sm:rounded-[26px] sm:p-10">
              <p className="text-[17px] font-extrabold sm:text-[20px]">Your role-fit score shows up here</p>
              <p className="mx-auto mt-1.5 max-w-[440px] text-[14px] leading-[21px] text-[#4a4862]">
                An overall score, a score for each hiring criterion and the fixes to make first.
              </p>
            </section>
          ) : null}

          {result && !loading ? (
            <section className={toolCard}>
              <div className="flex items-center gap-4 sm:gap-[22px]">
                <ScoreRing score={overall} size={88} label={`Overall role fit ${overall} out of 100`} />
                <div className="min-w-0">
                  <p className={`${toolEyebrow} text-[#66647c]`}>OVERALL ROLE FIT</p>
                  <p className="mt-1 text-[19px] font-extrabold leading-[24px] sm:text-[24px] sm:leading-[29px]">{verdict(overall)}</p>
                  <p className="mt-1 text-[13px] leading-5 text-[#4a4862] sm:text-[14px]">
                    On a 100-point scale. 70+ is a good result.{" "}
                    {withJd ? "Scored against the job description you pasted." : "Scored on the resume alone."}
                  </p>
                </div>
              </div>

              {result.scores.length > 0 ? (
                <ul className="mt-4 sm:mt-5">
                  {result.scores.map((s, i) => (
                    <li
                      key={i}
                      className="grid grid-cols-[1fr_auto] items-center gap-x-[18px] gap-y-2 border-t border-[#e2e0ea] py-3.5 sm:grid-cols-[220px_1fr_56px]"
                    >
                      <div className="min-w-0">
                        <b className="text-[15px]">{s.name}</b>
                        {s.comment ? <p className="mt-0.5 text-[13px] leading-[19px] text-[#66647c]">{s.comment}</p> : null}
                      </div>
                      <div className="order-last col-span-2 sm:order-none sm:col-span-1">
                        <ScoreBar score={s.score} max={s.max} />
                      </div>
                      <b className="self-start text-right text-[16px] tabular-nums sm:self-center sm:text-[18px]">
                        {s.score}/{s.max}
                      </b>
                    </li>
                  ))}
                </ul>
              ) : null}
            </section>
          ) : null}

          <AiDisclaimer />
        </div>

        {/* Fixes */}
        {result && showFixes ? (
          <section className="rounded-[22px] bg-[#111118] p-[18px] text-white sm:rounded-[26px] sm:p-6 lg:col-start-2 lg:row-start-1">
            <h2 className={`${toolEyebrow} text-[#c9c0ff]`}>DO THESE FIRST</h2>
            <ol className="mt-3">
              {result.prioritized_fixes.map((f, i) => (
                <li key={i} className="flex gap-3.5 border-t border-[#2f2d48] py-4 text-[15px] leading-[22px]">
                  <span className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-[#5440e8] text-[13px] font-extrabold">
                    {i + 1}
                  </span>
                  <span className="min-w-0 pt-0.5">{f}</span>
                </li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>
    </div>
  );
}
