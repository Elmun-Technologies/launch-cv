"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Loader2, Lock, ArrowRight, AlertTriangle, FileText } from "lucide-react";
import { track } from "@/lib/analytics-client";
import { ANALYTICS_EVENTS } from "@/lib/analytics-events";
import { GoogleSignInButton } from "@/components/google-sign-in-button";
import { DimensionBars, FixItem, scoreVerdict } from "@/components/ats-report-parts";
import type { FreeAtsResult } from "@/types/ai-results";

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

export function FreeAtsClient() {
  const [mode, setMode] = useState<Mode>("upload");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [result, setResult] = useState<FreeAtsResult | null>(null);
  const [claimToken, setClaimToken] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");
  const [displayScore, setDisplayScore] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

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

  async function submit(fd: FormData) {
    if (status === "loading") return;
    setStatus("loading");
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

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    // Allow re-selecting the same file later by clearing the input value.
    e.target.value = "";
    if (!file) return;
    setFileName(file.name);
    const fd = new FormData();
    fd.append("file", file);
    void submit(fd);
  }

  function onPasteSubmit() {
    if (pasted.trim().length < 30) {
      setStatus("error");
      setError("Paste at least a few lines of your resume.");
      return;
    }
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

  // ---- Result view ----
  if (status === "done" && result) {
    const next = claimToken ? `/dashboard/ats-report/${claimToken}` : "/dashboard";
    const hidden = Math.max(0, result.totalFixes - result.preview.length);
    const onGate = () => track(ANALYTICS_EVENTS.atsGateClick, { score: result.overall, hidden });
    return (
      <div className="mx-auto w-full max-w-[1000px] text-left" role="status" aria-live="polite">
        <div className="flex flex-col gap-8 border-b border-[#EEEEEB] pb-10 lg:flex-row lg:items-end lg:gap-16">
          <div className="flex-1">
            <p className="text-[14px] text-[#6B6B6B]">Your ATS score{fileName ? ` · ${fileName}` : ""}</p>
            <p className="mt-1.5 flex items-baseline gap-3">
              <span className="text-[88px] font-semibold leading-[0.9] tracking-[-0.05em] text-[#111111]">{displayScore}</span>
              <span className="text-[22px] text-[#6E6E6A]">/ 100</span>
            </p>
            <h2 className="mt-5 max-w-[560px] text-[30px] font-semibold leading-[1.15] tracking-[-0.03em] text-[#111111]">
              {scoreVerdict(result.overall)}{" "}
              {result.totalFixes > 0 ? (
                <span className="text-[#6E6E6A]">
                  {result.totalFixes} fixable {result.totalFixes === 1 ? "issue" : "issues"}.
                </span>
              ) : null}
            </h2>
          </div>
          <div className="w-full lg:max-w-[380px]">
            <DimensionBars dimensions={result.dimensions} />
          </div>
        </div>

        <div className="mt-8 flex items-baseline justify-between gap-4">
          <h3 className="text-[22px] font-semibold tracking-[-0.02em] text-[#111111]">Fix these first</h3>
          <span className="text-[14px] text-[#6B6B6B]">
            {result.issueCounts.high} high · {result.issueCounts.medium} medium · {result.issueCounts.low} low
          </span>
        </div>
        <ol className="mt-3">
          {result.preview.map((f, i) => (
            <FixItem key={f.title} fix={f} n={i + 1} />
          ))}
        </ol>

        {hidden > 0 ? (
          <div className="relative mt-1 min-h-[400px] overflow-hidden rounded-[20px] border border-[#E5E5E2]">
            <div className="space-y-4 p-6 blur-[5px] select-none" aria-hidden>
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <span className="h-[26px] w-[26px] shrink-0 rounded-full bg-[#C2700A]" />
                  <div className="flex-1">
                    <div className="h-3.5 w-2/3 rounded bg-[#D9D9D5]" />
                    <div className="mt-2.5 h-2.5 w-full rounded bg-[#EEEEEB]" />
                  </div>
                </div>
              ))}
            </div>
            <div className="absolute inset-0 flex items-center justify-center bg-white/60 p-4">
              <div className="w-full max-w-[420px] rounded-[20px] border border-[#E5E5E2] bg-white p-6 text-center shadow-[0_30px_60px_-24px_rgba(0,0,0,0.3)]">
                <Lock className="mx-auto h-5 w-5 text-[#111111]" aria-hidden />
                <p className="mt-3 text-[20px] font-semibold tracking-[-0.02em] text-[#111111]">
                  See all {result.totalFixes} issues — free
                </p>
                <p className="mt-1.5 text-[15px] leading-[1.55] text-[#3F3F3F]">
                  Save your report to unlock the other {hidden} and keep it with your resume.
                </p>
                <div className="mt-4 flex flex-col gap-2.5" onClick={onGate}>
                  <GoogleSignInButton mode="register" next={next} />
                  <Link
                    href={`/register?next=${encodeURIComponent(next)}`}
                    className="flex h-12 items-center justify-center rounded-full bg-[#111111] text-[15px] font-medium text-white transition hover:bg-[#2B2B2B]"
                  >
                    Continue with email
                  </Link>
                </div>
                <p className="mt-3 text-[13px] text-[#6B6B6B]">No credit card needed</p>
              </div>
            </div>
          </div>
        ) : null}

        <button onClick={reset} className="mt-6 text-[14px] font-medium text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
          Check another resume
        </button>
      </div>
    );
  }

  // ---- Input view ----
  return (
    <div className="mx-auto w-full max-w-[720px]">
      <div className="rounded-[20px] border border-[#E5E5E2] bg-white p-2.5 shadow-[0_30px_60px_-40px_rgba(0,0,0,0.3)]">
        <div className="mx-auto mt-1.5 flex w-max gap-1 rounded-full bg-[#F5F5F3] p-1" role="tablist">
          {(["upload", "paste"] as const).map((m) => (
            <button
              key={m}
              role="tab"
              aria-selected={mode === m}
              onClick={() => setMode(m)}
              className={`h-9 rounded-full px-4 text-[14px] font-medium transition ${
                mode === m ? "bg-white text-[#111111] shadow-[0_1px_2px_rgba(0,0,0,0.08)]" : "text-[#6B6B6B]"
              }`}
            >
              {m === "upload" ? "Upload file" : "Paste text"}
            </button>
          ))}
        </div>

        {status === "loading" ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-3 flex flex-col items-center justify-center gap-3 rounded-[14px] border-[1.5px] border-dashed border-[#C9C9C4] bg-[#FAFAF9] py-14"
          >
            <Loader2 className="h-7 w-7 animate-spin text-[#111111]" />
            <p className="text-[15px] font-medium text-[#111111]">Reading your resume the way an ATS does…</p>
            <p className="text-[13px] text-[#6B6B6B]">Usually about 10 seconds</p>
          </div>
        ) : mode === "upload" ? (
          <div className="mt-3">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2.5 rounded-[14px] border-[1.5px] border-dashed border-[#C9C9C4] bg-[#FAFAF9] px-6 py-12 transition hover:border-[#111111]"
            >
              <FileText className="h-8 w-8 text-[#111111]" aria-hidden />
              <span className="text-[17px] font-medium text-[#111111]">{fileName ?? "Upload your resume"}</span>
              <span className="text-[14px] text-[#6B6B6B]">PDF or DOCX · up to 4 MB</span>
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
          <div className="mt-3 px-1.5 pb-1.5">
            <textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              aria-label="Paste your resume text"
              placeholder="Paste your resume text here…"
              className="h-52 w-full resize-none rounded-[14px] border border-[#D9D9D5] bg-[#FAFAF9] p-4 text-[15px] leading-[1.6] text-[#111111] outline-none transition focus:border-[#111111] focus:bg-white"
            />
            <button
              onClick={onPasteSubmit}
              className="mt-2.5 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[#111111] text-[15px] font-medium text-white transition hover:bg-[#2B2B2B]"
            >
              Check my resume <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {status === "error" && error ? (
          <div
            role="alert"
            className="mx-1.5 mb-1.5 mt-3 flex items-start gap-2 rounded-[12px] border border-[#F6D3CD] bg-[#FDF2F0] p-3 text-[14px] text-[#8F2A18]"
          >
            {alreadyUsed ? <Lock className="mt-0.5 h-4 w-4 shrink-0" /> : <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />}
            <div>
              <p>{error}</p>
              {alreadyUsed ? (
                <Link href="/pricing" className="mt-1 inline-flex items-center gap-1 font-medium underline underline-offset-2">
                  See plans to keep checking <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ) : null}
            </div>
          </div>
        ) : null}
      </div>

      <p className="mt-4 text-center text-[13px] text-[#6B6B6B]">No account needed · your file is read once and not stored</p>
    </div>
  );
}
