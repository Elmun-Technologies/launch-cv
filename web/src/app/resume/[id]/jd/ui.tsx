"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, Loader2, X } from "lucide-react";
import { ToolNotice } from "@/components/tool-notice";
import { AiDisclaimer } from "@/components/ai-disclaimer";
import { AiUsageBanner } from "@/components/ai-usage-banner";
import { useAiUsage } from "@/hooks/use-ai-usage";
import type { JdAlignResult } from "@/types/ai-results";
import type { PlanLimitsMap } from "@/components/app/tools/upgrade-dialog";
import {
  Badge,
  CopyButton,
  ScoreRing,
  SparkIcon,
  ToolSkeleton,
  pillPrimary,
  pillSoft,
  pillWhite,
  toolCard,
  toolEyebrow,
  toolH2,
  toolInput,
  toolLabel,
  toolSubmit,
  toolTextarea,
} from "@/components/app/tools/tool-ui";

function StatusBadge({ status }: { status: string }) {
  if (status === "met") return <Badge tone="green">Covered</Badge>;
  if (status === "partial") return <Badge tone="amber">Partial</Badge>;
  return <Badge tone="red">Missing</Badge>;
}

function SkillBadge({ status }: { status: string }) {
  if (status === "strong") return <Badge tone="green">Strong</Badge>;
  if (status === "partial") return <Badge tone="amber">Partial</Badge>;
  return <Badge tone="red">Missing</Badge>;
}

function verdict(score: number) {
  if (score >= 80) return "Strong match for this job.";
  if (score >= 60) return "Good match, with a few gaps to close.";
  if (score >= 40) return "Partial match. Close the gaps below first.";
  return "Weak match for now. Start with the missing requirements.";
}

const plural = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

export function JdClient({
  resumeId,
  bullets = {},
  planLimits,
}: {
  resumeId: string;
  /** Current bullet text keyed by `${experienceId}:${bulletId}`. */
  bullets?: Record<string, string>;
  planLimits?: PlanLimitsMap;
}) {
  const usage = useAiUsage();
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [upgrade, setUpgrade] = useState(false);
  const [result, setResult] = useState<JdAlignResult | null>(null);
  const [jdRunId, setJdRunId] = useState<string | null>(null);
  const [applyBusy, setApplyBusy] = useState<string | null>(null);
  const [applied, setApplied] = useState<Record<string, true>>({});
  const [saveBusy, setSaveBusy] = useState(false);
  const [appTitle, setAppTitle] = useState("");
  const [appCompany, setAppCompany] = useState("");
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  /** Phones: after a run the form folds into "Based on: … · Change" so the results come first. */
  const [editing, setEditing] = useState(false);

  const resultsRef = useRef<HTMLDivElement>(null);
  const jdRef = useRef<HTMLTextAreaElement>(null);

  // Start from the job description pasted into the editor's "Target a job" panel, if any.
  // Read after the first paint, so the server and browser render the same empty box.
  useEffect(() => {
    const frame = requestAnimationFrame(() => {
      let saved: string | null = null;
      try {
        saved = window.localStorage.getItem(`lcv_jd_${resumeId}`);
      } catch {
        // storage unavailable
      }
      if (saved) setJd((cur) => cur || saved);
    });
    return () => cancelAnimationFrame(frame);
  }, [resumeId]);

  async function run() {
    setLoading(true);
    // On one-column layouts the report renders below the form; bring it into view.
    if (window.matchMedia("(max-width: 1023px)").matches) {
      requestAnimationFrame(() =>
        resultsRef.current?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" }),
      );
    }
    setError(null);
    setUpgrade(false);
    setSaveMsg(null);
    const res = await fetch("/api/ai/jd-align", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId, jdText: jd }),
    });
    setLoading(false);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) {
      setError(j.error ?? "Error");
      if (j.code === "USAGE_LIMIT" && j.upgrade) setUpgrade(true);
      return;
    }
    setResult(j.result as JdAlignResult);
    setEditing(false);
    setJdRunId(typeof j.jdRunId === "string" ? j.jdRunId : null);
    setApplied({});
  }

  async function applyBullet(experienceId: string, bulletId: string, text: string) {
    setApplyBusy(`${experienceId}:${bulletId}`);
    setError(null);
    const res = await fetch(`/api/resumes/${resumeId}/apply-bullet`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ experienceId, bulletId, text }),
    });
    setApplyBusy(null);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Failed to apply");
      return;
    }
    setApplied((a) => ({ ...a, [`${experienceId}:${bulletId}`]: true }));
  }

  async function saveApplication() {
    if (!jdRunId) return;
    setSaveBusy(true);
    setSaveMsg(null);
    const res = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId,
        jdRunId,
        title: appTitle.trim() || undefined,
        company: appCompany.trim() || undefined,
      }),
    });
    setSaveBusy(false);
    const j = await res.json().catch(() => ({}));
    setSaveMsg(res.ok ? "Application added." : (j.error ?? "Failed to save"));
  }

  const bulletText = (bulletId: string) => {
    const key = Object.keys(bullets).find((k) => k.endsWith(`:${bulletId}`));
    return key ? bullets[key] : null;
  };

  const max = usage?.limits.jd ?? 0;
  const folded = !!result && !editing && !loading;
  const basedOn =
    [appTitle.trim(), appCompany.trim()].filter(Boolean).join(" · ") ||
    jd.trim().split(/\n/)[0]?.slice(0, 80) ||
    "the job post";
  const missing = result ? result.gap_map.filter((r) => r.status === "missing").length : 0;

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <AiUsageBanner usage={usage} kind="jd" limits={planLimits} />

      <div className="grid items-start gap-4 lg:grid-cols-[0.8fr_1.2fr] lg:gap-5">
        {folded ? (
          <div className="flex min-w-0 items-center justify-between gap-3 rounded-[20px] bg-white px-4 py-2 lg:hidden">
            <p className="min-w-0 truncate text-[14px] text-[#4a4862]">
              <span className="font-bold text-[#121226]">Based on:</span> {basedOn}
            </p>
            <button
              type="button"
              onClick={() => {
                setEditing(true);
                requestAnimationFrame(() => jdRef.current?.focus());
              }}
              className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! inline-flex min-h-11 shrink-0 items-center rounded-full px-2 text-[14px] font-bold text-[#5440e8] hover:text-[#3a2bb8]"
            >
              Change<span className="sr-only"> the job post</span>
            </button>
          </div>
        ) : null}

        {/* Input */}
        <section className={`${toolCard} lg:sticky lg:top-6 ${folded ? "max-lg:hidden" : ""}`} aria-labelledby="jd-input-h">
          <h2 id="jd-input-h" className={toolLabel}>
            Job description
          </h2>
          <div className="mt-2.5 grid gap-2 sm:grid-cols-2">
            <input
              className={toolInput}
              placeholder="Job title"
              aria-label="Job title (optional, used when you save to the job tracker)"
              value={appTitle}
              onChange={(e) => setAppTitle(e.target.value)}
            />
            <input
              className={toolInput}
              placeholder="Company"
              aria-label="Company (optional, used when you save to the job tracker)"
              value={appCompany}
              onChange={(e) => setAppCompany(e.target.value)}
            />
          </div>
          <label htmlFor="jd-text" className="sr-only">
            Job description text
          </label>
          <textarea
            ref={jdRef}
            id="jd-text"
            className={`${toolTextarea} mt-2 min-h-[220px] lg:min-h-[300px]`}
            placeholder="Paste the job description..."
            value={jd}
            onChange={(e) => setJd(e.target.value)}
          />
          <button type="button" disabled={loading || jd.length < 40} onClick={() => void run()} className={`${toolSubmit} mt-3`}>
            {loading ? <Loader2 className="h-[18px] w-[18px] motion-safe:animate-spin" aria-hidden="true" /> : <SparkIcon />}
            {loading ? "AI is processing..." : "Analyze match"}
          </button>
          {usage?.pro && max > 0 ? (
            <p className="mt-2.5 text-center text-[12px] text-[#66647c]">
              Uses 1 of your {max.toLocaleString("en-US")} monthly analyses · {usage.used.jd.toLocaleString("en-US")} used
            </p>
          ) : null}
        </section>

        {/* Results */}
        <div ref={resultsRef} className="flex min-w-0 scroll-mt-4 flex-col gap-4" aria-busy={loading}>
          {error ? <ToolNotice message={error} upgrade={upgrade} location="jd_paywall" kind="jd" limits={planLimits} autoOpen /> : null}

          {loading ? <ToolSkeleton rows={4} className="h-24" /> : null}

          {!result && !loading ? (
            <section className="rounded-[22px] border-[1.5px] border-dashed border-[#c9c7d8] p-6 text-center sm:rounded-[26px] sm:p-10">
              <p className="text-[17px] font-extrabold sm:text-[20px]">Your match report shows up here</p>
              <p className="mx-auto mt-1.5 max-w-[440px] text-[14px] leading-[21px] text-[#4a4862]">
                Match score, the requirements you cover, missing skills and rewrites for your bullets — using only facts already in your resume.
              </p>
            </section>
          ) : null}

          {result && !loading ? (
            <>
              {/* Score */}
              <section className="rounded-[22px] bg-[#111118] p-[18px] text-white sm:rounded-[26px] sm:px-7 sm:py-6">
                <div className="flex items-center gap-3.5 sm:gap-6">
                  <div className="shrink-0 rounded-full bg-white p-1 sm:p-1.5">
                    <ScoreRing score={result.match_score} size={68} label={`Match score ${Math.round(result.match_score)} out of 100`} />
                  </div>
                  <div className="min-w-0">
                    <p className={`${toolEyebrow} hidden text-[#c9c0ff] sm:block`}>ATS MATCH SCORE</p>
                    <p className="text-[17px] font-extrabold leading-[22px] sm:mt-1.5 sm:text-[24px] sm:leading-[29px]">{verdict(result.match_score)}</p>
                    <p className="mt-1 text-[13px] text-[#c9c7d8] sm:text-[14px]">
                      {plural(result.keyword_coverage.length, "keyword")} matched · {plural(missing, "requirement")} missing
                      {result.rewritten_bullets.length > 0 ? ` · ${plural(result.rewritten_bullets.length, "rewrite")} suggested` : ""}
                    </p>
                  </div>
                </div>
                {result.keyword_coverage.length > 0 ? (
                  <div className="mt-4 border-t border-[#2f2d48] pt-4">
                    <h2 className="text-[13px] font-bold text-[#c9c0ff]">Keywords you cover</h2>
                    <ul className="mt-2 flex flex-wrap gap-1.5">
                      {result.keyword_coverage.map((kw) => (
                        <li key={kw} className="rounded-full bg-[#2a2840] px-3 py-1.5 text-[13px] font-semibold">
                          {kw}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </section>

              {/* Requirements */}
              {result.gap_map.length > 0 ? (
                <section className={toolCard}>
                  <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                    <h2 className={toolH2}>Skill gap analysis</h2>
                    <span className="hidden text-[13px] text-[#66647c] sm:inline">Requirement · status · where your resume says it</span>
                  </div>
                  <ul className="mt-2.5">
                    {result.gap_map.map((row, i) => (
                      <li
                        key={i}
                        className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-t border-[#e2e0ea] py-2.5 text-[14px] sm:grid-cols-[1fr_100px_1.4fr] sm:gap-x-3.5 sm:py-3"
                      >
                        <b className="min-w-0 break-words">{row.requirement}</b>
                        <span className="sm:text-center">
                          <StatusBadge status={row.status} />
                        </span>
                        <span className="col-span-2 min-w-0 break-words text-[13px] text-[#4a4862] sm:col-span-1">
                          {row.evidence ? (
                            row.evidence
                          ) : (
                            <>
                              <span aria-hidden="true">—</span>
                              <span className="sr-only">Not found in your resume</span>
                            </>
                          )}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Skills */}
              {result.skill_gaps.length > 0 ? (
                <section className={toolCard}>
                  <h2 className={toolH2}>Skills to strengthen</h2>
                  <ul className="mt-2.5">
                    {result.skill_gaps.map((sg, i) => (
                      <li
                        key={i}
                        className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-t border-[#e2e0ea] py-2.5 text-[14px] sm:grid-cols-[1fr_100px_1.4fr] sm:gap-x-3.5 sm:py-3"
                      >
                        <b className="min-w-0 break-words">{sg.skill}</b>
                        <span className="sm:text-center">
                          <SkillBadge status={sg.status} />
                        </span>
                        <span className="col-span-2 min-w-0 text-[13px] text-[#4a4862] sm:col-span-1">{sg.recommendation}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Rewrites */}
              {result.rewritten_bullets.length > 0 ? (
                <section className={toolCard}>
                  <h2 className={toolH2}>Suggested rewrites</h2>
                  <div className="mt-3 flex flex-col gap-2.5 sm:mt-3.5">
                    {result.rewritten_bullets.map((b, i) => {
                      const key = `${b.experienceId}:${b.bulletId}`;
                      const busy = applyBusy === key;
                      const done = applied[key];
                      const before = bullets[key];
                      return (
                        <div key={i} className="rounded-[20px] bg-[#f7f6fb] p-[18px]">
                          {before ? (
                            <p className="text-[13px] text-[#66647c] line-through">
                              <span className="sr-only">Current bullet: </span>
                              {before}
                            </p>
                          ) : null}
                          <p className={`${before ? "mt-1.5" : ""} text-[15px] font-bold leading-[22px]`}>{b.new_text}</p>
                          {b.reason ? <p className="mt-2 text-[12px] leading-[18px] text-[#66647c]">{b.reason}</p> : null}
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            <button
                              type="button"
                              disabled={busy}
                              onClick={() => void applyBullet(b.experienceId, b.bulletId, b.new_text)}
                              className={done ? pillSoft : pillPrimary}
                            >
                              {busy ? (
                                <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
                              ) : done ? (
                                <Check className="h-4 w-4" aria-hidden="true" />
                              ) : null}
                              {done ? "Applied" : "Apply to resume"}
                            </button>
                            <CopyButton text={b.new_text} className={pillWhite} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </section>
              ) : null}

              {result.remove_suggestions.length > 0 ? (
                <section className={toolCard}>
                  <h2 className={toolH2}>Consider removing</h2>
                  <ul className="mt-2.5">
                    {result.remove_suggestions.map((r, i) => {
                      const text = bulletText(r.bulletId);
                      return (
                        <li key={i} className="flex items-start gap-2.5 border-t border-[#e2e0ea] py-3 text-[14px] leading-[21px]">
                          <X className="mt-0.5 h-4 w-4 shrink-0 text-[#c42b30]" aria-hidden="true" />
                          <span className="min-w-0">
                            {text ? <b className="block break-words">{text}</b> : <code className="lc-mono text-[12px] text-[#66647c]">{r.bulletId}</code>}
                            <span className="text-[#4a4862]">{r.reason}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </section>
              ) : null}

              {result.explanations.length > 0 ? (
                <section className={toolCard}>
                  <h2 className={toolH2}>Why this score</h2>
                  <ul className="mt-2.5 list-disc space-y-1.5 pl-5 text-[14px] leading-[21px] text-[#24223a] marker:text-[#5440e8]">
                    {result.explanations.map((e, i) => (
                      <li key={i}>{e}</li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {/* Save to applications */}
              {jdRunId ? (
                <section className={toolCard}>
                  <h2 className={toolH2}>Add to applications</h2>
                  <p className="mt-1 text-[14px] text-[#4a4862]">
                    {appTitle.trim() || appCompany.trim()
                      ? `Saves this match to your job tracker as ${[appTitle.trim(), appCompany.trim()].filter(Boolean).join(" · ")}.`
                      : "Saves this match to your job tracker. Add a job title and company above to name it."}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <button type="button" disabled={saveBusy} onClick={() => void saveApplication()} className={pillPrimary}>
                      {saveBusy ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : null}
                      Save
                    </button>
                    <Link href="/dashboard/job-tracker" className={pillSoft}>
                      Job tracker
                    </Link>
                  </div>
                  {saveMsg ? (
                    <p role="status" className="mt-2.5 text-[13px] text-[#4a4862]">
                      {saveMsg}
                    </p>
                  ) : null}
                </section>
              ) : null}
            </>
          ) : null}

          <AiDisclaimer />
        </div>
      </div>
    </div>
  );
}
