"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  Upload,
  Loader2,
  Lock,
  ArrowRight,
  AlertTriangle,
  FileText,
  ClipboardPaste,
} from "lucide-react";
import type { FreeAtsResult } from "@/types/ai-results";

type Mode = "upload" | "paste";
type Status = "idle" | "loading" | "done" | "error";

/** Fire-and-forget funnel event to GA4 (gtag) if analytics is loaded. */
function fireEvent(name: string, params?: Record<string, unknown>): void {
  try {
    const w = window as unknown as { gtag?: (...args: unknown[]) => void };
    w.gtag?.("event", name, params ?? {});
  } catch {
    /* analytics must never break the flow */
  }
}

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

function band(score: number): { label: string; className: string } {
  if (score >= 85) return { label: "Strong — minor fixes", className: "text-emerald-700" };
  if (score >= 70) return { label: "Good — fixes recommended", className: "text-[#C2410C]" };
  if (score >= 50) return { label: "At risk — needs work", className: "text-amber-700" };
  return { label: "High risk — likely filtered", className: "text-red-700" };
}

function barColor(v: number): string {
  if (v >= 85) return "bg-emerald-500";
  if (v >= 70) return "bg-amber-500";
  return "bg-red-500";
}

export function FreeAtsClient() {
  const [mode, setMode] = useState<Mode>("upload");
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);
  const [alreadyUsed, setAlreadyUsed] = useState(false);
  const [result, setResult] = useState<FreeAtsResult | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [pasted, setPasted] = useState("");
  const [displayScore, setDisplayScore] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);

  // Animate the score count-up (respecting reduced-motion) once we have a result.
  useEffect(() => {
    if (status !== "done" || !result) return;
    const target = result.overall;
    fireEvent("free_ats_result", { score: target, fixes: result.totalFixes });
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
        const used = Boolean(json.alreadyUsed);
        setAlreadyUsed(used);
        setError(json.error ?? "Something went wrong. Please try again.");
        fireEvent(used ? "free_ats_quota_hit" : "free_ats_error");
        return;
      }
      setResult(json.result as FreeAtsResult);
      setStatus("done");
    } catch {
      setStatus("error");
      setError("Network error. Please try again.");
      fireEvent("free_ats_error");
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
    setError(null);
    setAlreadyUsed(false);
    setFileName(null);
  }

  // ---- Result view ----
  if (status === "done" && result) {
    const b = band(result.overall);
    const dash = 283;
    const offset = dash - (dash * displayScore) / 100;
    return (
      <div className="mx-auto max-w-[720px]" role="status" aria-live="polite">
        <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.18)]">
          <div className="grid sm:grid-cols-5">
            <div className="flex flex-col items-center justify-center border-b border-[#E2E8F0] bg-[#FFF7ED] p-6 sm:col-span-2 sm:border-b-0 sm:border-r">
              <div className="relative h-[150px] w-[150px]">
                <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
                  <circle cx="60" cy="60" r="45" fill="none" stroke="#FED7AA" strokeWidth="12" />
                  <circle
                    cx="60"
                    cy="60"
                    r="45"
                    fill="none"
                    stroke="#EA580C"
                    strokeWidth="12"
                    strokeLinecap="round"
                    strokeDasharray={dash}
                    strokeDashoffset={offset}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-[40px] font-bold leading-none tracking-tight text-[#0F172A]">
                    {displayScore}
                  </p>
                  <p className="text-[10px] uppercase tracking-wider text-[#94A3B8]">of 100</p>
                </div>
              </div>
              <p className={`mt-4 text-center text-[11px] font-semibold uppercase tracking-wider ${b.className}`}>
                {b.label}
              </p>
            </div>

            <div className="p-6 sm:col-span-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                Breakdown
              </p>
              <div className="mt-3 space-y-3">
                {result.dimensions.map((d) => (
                  <div key={d.name}>
                    <div className="mb-1 flex items-center justify-between text-[12px]">
                      <span className="text-[#475569]">{d.name}</span>
                      <span className="font-semibold text-[#0F172A]">{d.score}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-[#FFF7ED]">
                      <div
                        className={`h-full rounded-full ${barColor(d.score)}`}
                        style={{ width: `${d.score}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-px border-t border-[#E2E8F0] bg-[#E2E8F0]">
            {[
              { l: "High issues", v: result.issueCounts.high, c: "text-red-600" },
              { l: "Medium", v: result.issueCounts.medium, c: "text-amber-600" },
              { l: "Low", v: result.issueCounts.low, c: "text-yellow-600" },
            ].map((s) => (
              <div key={s.l} className="bg-white p-4 text-center">
                <p className={`text-[22px] font-bold ${s.c}`}>{s.v}</p>
                <p className="text-[11px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Locked fix list — the upsell */}
        <div className="relative mt-5 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white">
          <div className="p-6" aria-hidden>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              Your prioritized fix list ({result.totalFixes})
            </p>
            <div className="mt-3 space-y-3 blur-[6px] select-none">
              {Array.from({ length: Math.max(3, Math.min(result.totalFixes, 5)) }).map((_, i) => (
                <div key={i} className="flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-4">
                  <span className="inline-flex shrink-0 items-center rounded-md bg-red-50 px-2 py-0.5 text-[11px] font-semibold uppercase text-red-700">
                    High
                  </span>
                  <div className="flex-1">
                    <div className="h-3 w-2/3 rounded bg-[#E2E8F0]" />
                    <div className="mt-2 h-2 w-full rounded bg-[#EEF2F6]" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-white/40 to-white p-6 text-center">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-orange-50 text-[#EA580C]">
              <Lock className="h-5 w-5" />
            </span>
            <h3 className="mt-4 text-[18px] font-bold text-[#0F172A]">
              Unlock every fix — and lift your score
            </h3>
            <p className="mx-auto mt-2 max-w-[420px] text-[14px] leading-[1.6] text-[#475569]">
              Create a free account to see all {result.totalFixes} prioritized fixes, apply them
              one-by-one, and rescore. Most users gain 20–40 points on the first pass.
            </p>
            <Link
              href="/register?next=/resume/new"
              onClick={() => fireEvent("free_ats_gate_cta_click", { score: result.overall })}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#EA580C] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_8px_24px_-12px_rgba(234,88,12,0.5)] transition hover:bg-[#C2410C]"
            >
              Unlock my fix list
              <ArrowRight className="h-4 w-4" />
            </Link>
            <button
              onClick={reset}
              className="mt-3 text-[13px] font-medium text-[#64748B] hover:text-[#0F172A]"
            >
              Check another resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Input view ----
  return (
    <div className="mx-auto max-w-[640px]">
      <div className="rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_20px_50px_-24px_rgba(15,23,42,0.18)] sm:p-8">
        <div className="flex gap-2 rounded-lg bg-[#F1F5F9] p-1">
          <button
            onClick={() => setMode("upload")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-semibold transition ${
              mode === "upload" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]"
            }`}
          >
            <FileText className="h-4 w-4" /> Upload file
          </button>
          <button
            onClick={() => setMode("paste")}
            className={`flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-[13px] font-semibold transition ${
              mode === "paste" ? "bg-white text-[#0F172A] shadow-sm" : "text-[#64748B]"
            }`}
          >
            <ClipboardPaste className="h-4 w-4" /> Paste text
          </button>
        </div>

        {status === "loading" ? (
          <div
            role="status"
            aria-live="polite"
            className="mt-6 flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-[#E2E8F0] py-14"
          >
            <Loader2 className="h-7 w-7 animate-spin text-[#EA580C]" />
            <p className="text-[14px] font-medium text-[#475569]">Scoring your resume…</p>
            <p className="text-[12px] text-[#94A3B8]">Usually under 10 seconds</p>
          </div>
        ) : mode === "upload" ? (
          <div className="mt-6">
            <button
              onClick={() => fileRef.current?.click()}
              className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#E2E8F0] bg-[#FAFBFC] py-12 transition hover:border-[#EA580C] hover:bg-[#FFF7ED]"
            >
              <Upload className="h-7 w-7 text-[#EA580C]" />
              <span className="text-[14px] font-semibold text-[#0F172A]">
                {fileName ?? "Upload your resume"}
              </span>
              <span className="text-[12px] text-[#94A3B8]">PDF or DOCX · max 4MB</span>
            </button>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf,.doc,.docx"
              className="hidden"
              onChange={onFile}
            />
          </div>
        ) : (
          <div className="mt-6">
            <textarea
              value={pasted}
              onChange={(e) => setPasted(e.target.value)}
              placeholder="Paste your resume text here…"
              className="h-52 w-full resize-none rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] p-4 text-[14px] leading-[1.6] text-[#0F172A] outline-none transition focus:border-[#EA580C] focus:bg-white"
            />
            <button
              onClick={onPasteSubmit}
              className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#EA580C] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#C2410C]"
            >
              Check my ATS score
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

        {status === "error" && error && (
          <div
            role="alert"
            className={`mt-4 flex items-start gap-2 rounded-lg border p-3 text-[13px] ${
              alreadyUsed
                ? "border-orange-200 bg-orange-50 text-[#9A3412]"
                : "border-red-200 bg-red-50 text-red-700"
            }`}
          >
            {alreadyUsed ? (
              <Lock className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            <div>
              <p>{error}</p>
              {alreadyUsed && (
                <Link
                  href="/register?next=/resume/new"
                  onClick={() => fireEvent("free_ats_gate_cta_click", { source: "quota" })}
                  className="mt-1 inline-flex items-center gap-1 font-semibold underline underline-offset-2"
                >
                  Create a free account <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              )}
            </div>
          </div>
        )}
      </div>

      <p className="mt-4 text-center text-[12px] text-[#94A3B8]">
        No account needed · one free scan · your file is never stored
      </p>
    </div>
  );
}
