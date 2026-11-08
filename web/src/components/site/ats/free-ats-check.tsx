"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { track } from "@/lib/analytics-client";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { CtaLink } from "@/components/cta-link";
import { scoreVerdict } from "@/components/ats-report-parts";
import { PUBLIC_PLANS, planPriceLabel } from "@/lib/monetization";
import { FREE_LIMITS } from "@/lib/plan-config";
import type { FreeAtsFix, FreeAtsResult } from "@/types/ai-results";

/*
 * v5 free ATS check: input → checking → result. The page passes its
 * server-rendered intro (with the H1) and the hero stage as props, so the
 * idle state is plain SSR HTML; the checking and result states replace the
 * hero once the visitor submits.
 */

type Mode = "upload" | "paste";
type Status = "idle" | "loading" | "done" | "error";

/** Lightweight, non-invasive client signal — a secondary abuse hint only. */
function clientFingerprint(): string {
  try {
    const parts = [
      navigator.userAgent,
      navigator.language,
      String(screen.width),
      String(screen.height),
      Intl.DateTimeFormat().resolvedOptions().timeZone,
    ];
    return btoa(unescape(encodeURIComponent(parts.join("|")))).slice(0, 128);
  } catch {
    return "";
  }
}

const container = "mx-auto w-full max-w-[1360px] px-4 sm:px-6 lg:px-10";
const btn = "lc-btn-lift inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-[26px] py-[15px] text-[16px] font-semibold";

/** Same thresholds as the FAQ: 80+ ready, 65–80 readable, below 65 at risk. */
function tone(v: number, dark = false): string {
  if (v >= 80) return "#22b07d";
  if (v >= 65) return "#f2a91f";
  return dark ? "#ff6b6b" : "#c42b30";
}

const PRIORITY_BADGE: Record<FreeAtsFix["priority"], string> = {
  High: "bg-[#fbe2e3] text-[#a3262b]",
  Medium: "bg-[#fdf0d5] text-[#7a4600]",
  Low: "bg-[#f1eff8] text-[#4a4862]",
};

function stepsFor(fileName: string | null): string[] {
  const ext = fileName?.split(".").pop()?.toLowerCase();
  const source = !fileName ? "Reading your pasted text" : ext === "pdf" ? "Extracting text from your PDF" : "Extracting text from your Word file";
  return [source, "Finding contact details and sections", "Reading dates and job titles", "Checking keywords for your role", "Ranking fixes by impact"];
}

export function FreeAtsCheck({
  intro,
  stage,
  googleEnabled = false,
  children,
}: {
  intro: ReactNode;
  stage: ReactNode;
  /** From `isGoogleOAuthConfigured()`, as on the login and register pages. */
  googleEnabled?: boolean;
  /** The page's marketing sections: kept in the HTML, hidden while a check runs. */
  children?: ReactNode;
}) {
  const [mode, setMode] = useState<Mode>("upload");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [result, setResult] = useState<FreeAtsResult | null>(null);
  const [claimToken, setClaimToken] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");
  const [displayScore, setDisplayScore] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [dragging, setDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  // Animate the score count-up (respecting reduced-motion) once we have a result.
  useEffect(() => {
    if (status !== "done" || !result) return;
    const target = result.overall;
    track(ANALYTICS_EVENTS.atsCheckCompleted, { score: target, fixes: result.totalFixes });
    const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
    if (reduce) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayScore(target);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const duration = 900;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayScore(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [status, result]);

  // Walk through the checking steps while the request runs. The last step
  // stays active until the result actually arrives.
  useEffect(() => {
    if (status !== "loading") return;
    const id = window.setInterval(() => setActiveStep((s) => Math.min(s + 1, 4)), 1800);
    return () => window.clearInterval(id);
  }, [status]);

  // When the hero swaps to checking/result, bring it into view and move focus to its heading.
  useEffect(() => {
    if (status !== "loading" && status !== "done") return;
    const top = sectionRef.current?.getBoundingClientRect().top ?? 0;
    if (top < 0) sectionRef.current?.scrollIntoView({ block: "start" });
    headingRef.current?.focus({ preventScroll: true });
  }, [status]);

  async function submit(fd: FormData) {
    if (status === "loading") return;
    setStatus("loading");
    setActiveStep(0);
    setError(null);
    setAlreadyUsed(false);
    setDisplayScore(0);
    fd.append("fingerprint", clientFingerprint());
    try {
      const res = await fetch("/api/free/ats-check", { method: "POST", body: fd });
      const json = await res.json().catch(() => ({}));
      if (!res.ok || !json.result) {
        setStatus("error");
        setAlreadyUsed(Boolean(json.alreadyUsed));
        setError(json.error ?? "Something went wrong. Please try again.");
        return;
      }
      setResult(json.result as FreeAtsResult);
      setClaimToken(typeof json.claimToken === "string" ? json.claimToken : null);
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
    }
  }

  function startFile(file: File) {
    setFileName(file.name);
    const fd = new FormData();
    fd.append("file", file);
    void submit(fd);
  }

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Allow re-selecting the same file later by clearing the input value.
    e.target.value = "";
    if (!file) return;
    startFile(file);
  }

  function onDrop(e: React.DragEvent<HTMLButtonElement>) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) startFile(file);
  }

  function onPasteSubmit() {
    if (pasted.trim().length < 30) {
      setStatus("error");
      setError("Paste at least a few lines of your resume.");
      return;
    }
    setFileName(null);
    const fd = new FormData();
    fd.append("text", pasted);
    void submit(fd);
  }

  function reset() {
    setStatus("idle");
    setResult(null);
    setClaimToken(null);
    setError(null);
    setAlreadyUsed(false);
    setFileName(null);
  }

  const headingStyle = { outline: "none" } as const;
  const wrap = (checker: ReactNode) => (
    <>
      {checker}
      <div hidden={status === "loading"}>{children}</div>
    </>
  );

  // ---- Result ----
  if (status === "done" && result) {
    const next = claimToken ? `/dashboard/ats-report/${claimToken}` : "/dashboard";
    const registerHref = `/register?next=${encodeURIComponent(next)}`;
    const hidden = Math.max(0, result.totalFixes - result.preview.length);
    const onGate = () => track(ANALYTICS_EVENTS.atsGateClick, { score: result.overall, hidden });
    const high = result.issueCounts.high;
    const ring = 2 * Math.PI * 45;
    const week = PUBLIC_PLANS.week;
    const freeJd = FREE_LIMITS.jd;
    const freeMatches = `${freeJd} free job ${freeJd === 1 ? "match" : "matches"} a month`;

    return wrap(
      <section id="ats-check" ref={sectionRef} className="scroll-mt-24">
        <p role="status" className="sr-only">
          Your ATS score is {result.overall} out of 100.
        </p>
        <div className={`${container} grid items-start gap-5 pt-4 lg:grid-cols-[1.25fr_0.75fr] lg:pt-8`}>
          <div className="flex flex-col gap-5 lg:gap-4">
            {/* Score */}
            <div className="rounded-[26px] bg-[#111118] p-[22px] text-white lg:rounded-[32px] lg:p-8">
              <div className="flex items-center gap-4 lg:gap-8">
                <div className="shrink-0 rounded-full bg-white p-[5px] lg:p-2.5">
                  <svg viewBox="0 0 100 100" role="img" aria-label={`Score ${result.overall} out of 100`} className="h-[86px] w-[86px] lg:h-[150px] lg:w-[150px]">
                    <circle cx="50" cy="50" r="45" fill="none" stroke="#efedf7" strokeWidth="9" />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke={tone(result.overall)}
                      strokeWidth="9"
                      strokeLinecap="round"
                      strokeDasharray={`${(displayScore / 100) * ring} ${ring}`}
                      transform="rotate(-90 50 50)"
                    />
                    <text x="50" y="59" textAnchor="middle" fontSize="28" fontWeight="700" fill="#121226">
                      {displayScore}
                    </text>
                  </svg>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold tracking-[0.08em] text-[#c9c0ff] lg:text-[13px]">
                    YOUR ATS SCORE
                    {fileName ? <span className="hidden break-all font-semibold tracking-normal sm:inline"> · {fileName}</span> : null}
                  </p>
                  <h1 ref={headingRef} tabIndex={-1} style={headingStyle} className="mt-1 text-[20px] font-extrabold leading-6 tracking-[-0.02em] lg:mt-2 lg:text-[38px] lg:leading-[42px] lg:tracking-[-0.035em]">
                    {scoreVerdict(result.overall)}
                  </h1>
                  <p className="mt-1.5 text-[13px] text-[#c9c7d8] lg:mt-2.5 lg:text-[16px]">
                    {result.totalFixes} {result.totalFixes === 1 ? "issue" : "issues"} · {high} high priority · aim for 80+
                  </p>
                  <Dimensions dims={result.dimensions} className="mt-[18px] hidden lg:grid" />
                </div>
              </div>
              <Dimensions dims={result.dimensions} className="mt-3.5 grid lg:hidden" />
            </div>

            {/* Fixes */}
            <div className="lg:rounded-[28px] lg:bg-white lg:p-7 lg:shadow-[0_1px_2px_rgba(18,18,38,.04),0_10px_30px_-18px_rgba(18,18,38,.22)]">
              <h2 className="text-[22px] font-extrabold">Fix these first</h2>
              {result.preview.length ? (
                <ol className="mt-2.5 flex flex-col gap-2 lg:mt-0 lg:gap-0">
                  {result.preview.map((f) => (
                    <li key={f.title} className="flex justify-between gap-3 rounded-[20px] bg-white p-4 lg:justify-start lg:gap-4 lg:rounded-none lg:border-t lg:border-[#e2e0ea] lg:bg-transparent lg:px-0 lg:py-[18px]">
                      <span className="order-2 shrink-0 lg:order-1 lg:w-20">
                        <span className={`inline-block rounded-full px-2.5 py-[5px] text-[12px] font-bold ${PRIORITY_BADGE[f.priority]}`}>
                          {f.priority}
                          <span className="sr-only"> priority</span>
                        </span>
                      </span>
                      <div className="order-1 min-w-0 lg:order-2">
                        <p className="text-[15px] font-bold lg:text-[16px]">{f.title}</p>
                        {f.fix ? (
                          <p className="mt-1.5 text-[13px] leading-[19px] lg:mt-1 lg:text-[14px] lg:leading-[21px]">
                            <b className="text-[#0b7a4f]">Fix:</b> {f.fix}
                          </p>
                        ) : null}
                      </div>
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-[15px] text-[#4a4862]">No issues found. Nice work.</p>
              )}

              {hidden > 0 ? (
                <div className="relative mt-2 lg:mt-1 lg:min-h-[240px] lg:border-t lg:border-[#e2e0ea]">
                  <div aria-hidden="true" className="hidden select-none blur-[2px] lg:block">
                    {Array.from({ length: Math.min(hidden, 4) }).map((_, i) => (
                      <div key={i} className="flex items-center gap-4 border-b border-[#efedf7] py-[18px]">
                        <span className="h-5 w-14 rounded-full bg-[#efedf7]" />
                        <span className="h-3.5 rounded-full bg-[#e2e0ea]" style={{ width: `${[58, 44, 66, 36][i]}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="lg:absolute lg:inset-0 lg:flex lg:items-center lg:justify-center">
                    <div className="lc-float rounded-[20px] bg-white p-[18px] text-center lg:w-full lg:max-w-[440px] lg:rounded-[22px] lg:p-[22px]">
                      <span aria-hidden="true" className="mx-auto hidden h-11 w-11 items-center justify-center rounded-[14px] bg-[#e4dfff] text-[#3a2bb8] lg:inline-flex">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </span>
                      <p className="text-[15px] font-extrabold lg:mt-2.5 lg:text-[17px]">
                        <span className="lg:hidden">
                          + {hidden} more {hidden === 1 ? "fix" : "fixes"}
                        </span>
                        <span className="hidden lg:inline">See all {result.totalFixes} fixes — free</span>
                      </p>
                      <p className="mt-0.5 text-[13px] text-[#4a4862]">Free account · no credit card</p>
                      <div className="mt-3 flex flex-col gap-2" onClick={onGate}>
                        <Link href={registerHref} className={`${btn} bg-[#5440e8] text-white hover:bg-[#4430d6]`}>
                          Save my report
                        </Link>
                        {googleEnabled ? <GoogleSignInButton mode="register" next={next} /> : null}
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>
          </div>

          {/* Side */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-6">
            <div className="rounded-[26px] bg-[#5440e8] px-5 pb-5 pt-[26px] text-white lg:rounded-[28px] lg:p-[26px]">
              <p className="text-[24px] font-extrabold leading-[29px] tracking-[-0.02em] lg:text-[22px] lg:leading-[27px]">
                {high > 0 ? `Start with the ${high} high-priority ${high === 1 ? "issue" : "issues"}.` : "No high-priority issues. Polish the rest."}
              </p>
              <p className="mt-2 text-[14px] leading-[21px] text-[#e4dfff]">
                All four LaunchCV templates are one column with plain-text headings — the layout ATS parsers read reliably.
              </p>
              <CtaLink cta="fix_in_editor" location="free_ats_result" href={registerHref} onClick={onGate} className={`${btn} mt-4 w-full bg-white text-[#121226]`}>
                Fix these with AI — free
              </CtaLink>
              <p className="mt-2.5 text-center text-[12px] text-[#e4dfff]">Free account · {freeMatches} · no credit card</p>
            </div>
            <div className="rounded-[26px] bg-[#1d1c2e] p-6 text-[#e9e7f3] lg:rounded-[28px]">
              <p className="text-[13px] font-bold tracking-[0.08em] text-[#c9c0ff]">ISSUES FOUND</p>
              {(
                [
                  ["High priority", result.issueCounts.high, "bg-[#fbe2e3] text-[#a3262b]"],
                  ["Medium priority", result.issueCounts.medium, "bg-[#fdf0d5] text-[#7a4600]"],
                  ["Low priority", result.issueCounts.low, "bg-[#e4dfff] text-[#3a2bb8]"],
                ] as const
              ).map(([label, count, cls]) => (
                <div key={label} className="mt-2 flex justify-between gap-2.5 border-t border-[#2f2d48] pt-2.5 text-[14px]">
                  <span className="text-[#b3b0c8]">{label}</span>
                  <span className={`lc-mono rounded-[5px] px-[7px] py-px text-[13px] ${cls}`}>{count}</span>
                </div>
              ))}
            </div>
            <p className="px-1.5 text-[12px] leading-[18px] text-[#66647c]">
              Your resume was read once and not stored; we keep only this report. Scores estimate how common ATS software parses resumes;
              employers&apos; settings vary.
            </p>
            <button type="button" onClick={reset} className="lc-link min-h-[44px] self-start px-1.5 text-[15px] font-semibold text-[#5440e8]">
              Check another resume
            </button>
          </div>
        </div>

        <div className={`${container} pt-10`}>
          <div className="flex flex-col gap-5 rounded-[26px] bg-[#c9c0ff] p-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8 lg:rounded-[32px] lg:px-11 lg:py-9">
            <div>
              <p className="text-[24px] font-extrabold leading-[29px] lg:text-[28px] lg:leading-[33px]">Applying to a specific job?</p>
              <p className="mt-1.5 text-[15px] text-[#2b2752] lg:text-[16px]">
                Paste the post and see which of its keywords your resume is missing. A free account gets {freeMatches}; the{" "}
                {week.title} is {planPriceLabel("week")}, with no auto-renewal.
              </p>
            </div>
            <CtaLink cta="see_plans" location="free_ats_result" href="/pricing" className={`${btn} flex-none bg-[#111118] text-white hover:bg-[#2a2940]`}>
              See plans
            </CtaLink>
          </div>
        </div>
      </section>
    );
  }

  // ---- Checking ----
  if (status === "loading") {
    const steps = stepsFor(fileName);
    return wrap(
      <section id="ats-check" ref={sectionRef} className={`${container} scroll-mt-24 pt-4 lg:pt-8`}>
        <style>{`@media (prefers-reduced-motion: no-preference){@keyframes lcv5-scan{from{top:4%}to{top:96%}}.lcv5-scan{animation:lcv5-scan 2.4s ease-in-out infinite alternate}}`}</style>
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          <div className="flex flex-col justify-center lg:pr-6">
            <div role="status" aria-live="polite">
              <p className="text-[18px] font-semibold tracking-[-0.01em] text-[#5440e8] sm:text-[20px]">/ Checking</p>
              <h1 ref={headingRef} tabIndex={-1} style={headingStyle} className="mt-4 text-[36px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-[48px] lg:mt-[18px] lg:text-[56px] lg:leading-[60px]">
                Reading your resume the way an ATS does…
              </h1>
              <p className="mt-4 text-[17px] text-[#4a4862] lg:text-[18px]">Usually about 10 seconds.</p>
            </div>
            <ol className="mt-7 flex flex-col gap-2.5">
              {steps.map((s, i) => {
                const done = i < activeStep;
                const active = i === activeStep;
                return (
                  <li
                    key={s}
                    className={`flex items-center gap-3.5 rounded-[18px] px-[18px] py-3.5 text-[16px] ${
                      done || active ? "bg-white text-[#121226]" : "text-[#66647c]"
                    } ${active ? "font-bold" : "font-medium"}`}
                  >
                    {done ? (
                      <span className="inline-flex h-[26px] w-[26px] flex-none items-center justify-center rounded-full bg-[#22b07d]">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M20 6 9 17l-5-5" />
                        </svg>
                      </span>
                    ) : active ? (
                      <span aria-hidden="true" className="inline-block h-[26px] w-[26px] flex-none rounded-full border-[3px] border-[#5440e8] border-r-transparent motion-safe:animate-spin" />
                    ) : (
                      <span aria-hidden="true" className="inline-block h-[26px] w-[26px] flex-none rounded-full border-2 border-[#c9c7d8]" />
                    )}
                    <span>
                      {s}
                      <span className="sr-only">{done ? " — done" : active ? " — in progress" : ""}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <div aria-hidden="true" className="relative h-[440px] overflow-hidden rounded-[28px] bg-[#5440e8] sm:h-[540px] lg:h-[620px] lg:rounded-[36px]">
            <div className="absolute left-1/2 top-10 h-[340px] w-[260px] -translate-x-1/2 overflow-hidden rounded-lg bg-white px-5 py-6 sm:h-[420px] sm:w-[320px] lg:top-[60px] lg:h-[500px] lg:w-[380px] lg:px-[26px] lg:py-[30px]">
              <ResumeSkeleton />
              <div className="lcv5-scan absolute inset-x-0 top-[46%]">
                <div className="absolute inset-x-0 bottom-0 h-[200px] bg-gradient-to-b from-transparent to-[rgba(84,64,232,.1)]" />
                <div className="absolute inset-x-0 bottom-0 h-[3px] bg-[#5440e8] shadow-[0_0_18px_4px_rgba(84,64,232,.6)]" />
              </div>
            </div>
            <span className="lc-float lc-mono absolute right-4 top-[70px] max-w-[220px] truncate rounded-[14px] bg-[#111118] px-3.5 py-2.5 text-[12px] text-white lg:right-[30px] lg:top-[120px]">
              {fileName ?? "pasted-text.txt"}
            </span>
            <span className="lc-float lc-mono absolute bottom-6 left-4 rounded-[14px] bg-white px-3.5 py-2.5 text-[12px] text-[#121226] lg:bottom-auto lg:left-[26px] lg:top-[280px]">
              reading …
            </span>
          </div>
        </div>
      </section>
    );
  }

  // ---- Input (idle / error) ----
  return wrap(
    <section id="ats-check" ref={sectionRef} className={`${container} scroll-mt-24 pt-4 lg:pt-8`}>
      <div className="grid items-stretch gap-7 lg:grid-cols-2 lg:gap-6">
        <div className="lg:pr-6 lg:pt-6">
          {intro}
          <div className="lc-float mt-[22px] rounded-3xl bg-white p-1.5 lg:mt-8 lg:rounded-[28px] lg:p-2">
            <div className="mx-auto mt-1.5 flex w-max gap-1 rounded-full bg-[#f1eff8] p-1 lg:mt-2" role="tablist" aria-label="How to add your resume">
              {(["upload", "paste"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  role="tab"
                  aria-selected={mode === m}
                  onClick={() => setMode(m)}
                  className={`min-h-[44px] rounded-full px-4 text-[13px] font-semibold transition-colors lg:px-[18px] lg:text-[14px] ${
                    mode === m ? "bg-[#111118] text-white" : "text-[#4a4862] hover:bg-white/70 hover:text-[#121226]"
                  }`}
                >
                  {m === "upload" ? "Upload file" : "Paste text"}
                </button>
              ))}
            </div>

            {mode === "upload" ? (
              <div className="m-1.5 mt-2.5 lg:m-2 lg:mt-3">
                <button
                  type="button"
                  aria-label={fileName ? `Upload your resume — selected: ${fileName}` : "Upload your resume — drop a PDF or DOCX here, or choose a file"}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDragging(true);
                  }}
                  onDragLeave={() => setDragging(false)}
                  onDrop={onDrop}
                  className={`group flex w-full flex-col items-center rounded-[20px] border-2 border-dashed px-4 py-7 text-center transition-colors duration-300 lg:rounded-[22px] lg:px-6 lg:py-10 ${
                    dragging ? "border-[#5440e8] bg-[#ece8ff]" : "border-[#b5aaf7] bg-[#f6f4ff] hover:border-[#5440e8] hover:bg-[#efebff]"
                  }`}
                >
                  <span aria-hidden="true" className="inline-flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#5440e8] transition-transform duration-300 group-hover:-translate-y-1 lg:h-[60px] lg:w-[60px]">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M12 15V3" />
                      <path d="m7 8 5-5 5 5" />
                      <path d="M5 15v4a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-4" />
                    </svg>
                  </span>
                  <span className="mt-3 break-all text-[18px] font-bold lg:mt-4 lg:text-[20px]">
                    {fileName ?? (
                      <>
                        <span className="lg:hidden">Upload your resume</span>
                        <span className="hidden lg:inline">Drop your resume here</span>
                      </>
                    )}
                  </span>
                  <span className="mt-0.5 text-[14px] text-[#4a4862] lg:mt-1 lg:text-[15px]">PDF or DOCX · up to 4 MB</span>
                  <span className={`${btn} mt-3.5 w-full bg-[#5440e8] text-white group-hover:bg-[#4430d6] sm:w-auto lg:mt-[18px]`}>Choose a file</span>
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept=".pdf,.doc,.docx"
                  aria-label="Upload your resume (PDF or DOCX)"
                  className="hidden"
                  onChange={onFile}
                />
              </div>
            ) : (
              <div className="m-1.5 mt-2.5 lg:m-2 lg:mt-3">
                <textarea
                  value={pasted}
                  onChange={(e) => setPasted(e.target.value)}
                  aria-label="Paste your resume text"
                  placeholder="Paste your resume text here…"
                  className="h-52 w-full resize-none rounded-[20px] border-2 border-[#e2e0ea] bg-[#f6f4ff] p-4 text-[15px] leading-[1.6] text-[#121226] outline-none transition-colors placeholder:text-[#66647c] focus:border-[#5440e8] focus:bg-white lg:rounded-[22px]"
                />
                <button type="button" onClick={onPasteSubmit} className={`${btn} mt-2.5 w-full bg-[#111118] text-white hover:bg-[#2a2940]`}>
                  Check my resume
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M5 12h14" />
                    <path d="m13 6 6 6-6 6" />
                  </svg>
                </button>
              </div>
            )}

            {status === "error" && error ? (
              <div role="alert" className="m-1.5 mt-2 flex items-start gap-2.5 rounded-2xl bg-[#fbe2e3] p-3.5 text-[14px] text-[#8f1d22] lg:m-2">
                <span aria-hidden="true" className="inline-flex h-6 w-6 flex-none items-center justify-center rounded-full bg-white font-extrabold text-[#c42b30]">
                  !
                </span>
                <div>
                  <p>{error}</p>
                  {alreadyUsed ? (
                    <Link href="/pricing" className="lc-link mt-1 inline-block py-1 font-semibold">
                      See plans to keep checking →
                    </Link>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
          <ul className="mt-3.5 flex flex-wrap justify-center gap-x-3.5 gap-y-1.5 text-[13px] font-medium text-[#4a4862] lg:mt-[18px] lg:justify-start lg:gap-x-5 lg:text-[14px]">
            {/* Phones get the canvas's shorter wording. */}
            {[
              { short: "No account", long: "No account needed" },
              { short: "File isn't stored", long: "Your file isn't stored" },
              { short: "1 free check per 30 days", long: "One free check every 30 days per network" },
            ].map((t) => (
              <li key={t.long}>
                <span aria-hidden="true" className="font-bold text-[#0b7a4f]">
                  ✓
                </span>{" "}
                <span className="sm:hidden">{t.short}</span>
                <span className="hidden sm:inline">{t.long}</span>
              </li>
            ))}
          </ul>
        </div>
        {stage}
      </div>
    </section>
  );
}

function Dimensions({ dims, className = "" }: { dims: FreeAtsResult["dimensions"]; className?: string }) {
  return (
    <ul className={`grid-cols-2 gap-1.5 lg:grid-cols-4 lg:gap-2 ${className}`}>
      {dims.map((d) => (
        <li key={d.name} className="rounded-xl bg-[#1d1c2e] p-2.5 lg:rounded-[14px] lg:p-3">
          <div className="flex justify-between text-[12px] font-bold">
            <span>{d.name}</span>
            <span>{d.score}</span>
          </div>
          <div aria-hidden="true" className="mt-2 hidden h-1.5 overflow-hidden rounded-full bg-[#2f2d48] sm:block">
            <div className="h-full rounded-full" style={{ width: `${d.score}%`, background: tone(d.score, true) }} />
          </div>
        </li>
      ))}
    </ul>
  );
}

/** Neutral page illustration for the checking state — no invented resume content. */
function ResumeSkeleton() {
  const bar = "h-[7px] rounded-full bg-[#e2e0ea]";
  const section = (rows: number[], key: string) => (
    <div key={key} className="mt-5">
      <div className="h-[8px] w-[34%] rounded-full bg-[#121226]/80" />
      <div className="mt-1.5 h-px bg-[#121226]/60" />
      <div className="mt-2.5 flex flex-col gap-[7px]">
        {rows.map((w, i) => (
          <div key={i} className={bar} style={{ width: `${w}%` }} />
        ))}
      </div>
    </div>
  );
  return (
    <div>
      <div className="h-4 w-[52%] rounded-full bg-[#111118]" />
      <div className="mt-2 h-[7px] w-[38%] rounded-full bg-[#c9c7d8]" />
      <div className="mt-1.5 h-[7px] w-[70%] rounded-full bg-[#e2e0ea]" />
      {section([96, 88, 64], "s")}
      {section([92, 84, 90, 70, 86, 58], "e")}
      {section([72], "ed")}
      {section([90, 54], "sk")}
    </div>
  );
}
