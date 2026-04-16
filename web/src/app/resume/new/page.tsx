"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ExperienceReviewModal } from "@/components/experience-review-modal";
import { shouldOfferSatisfactionSurvey } from "@/lib/satisfaction-survey";
import {
  FileText, Loader2, UploadCloud, CheckCircle, AlertTriangle,
  ArrowRight, BarChart3, Target, Sparkles, X, ArrowLeft,
  ChevronDown, Check, AlertCircle, Info, Building2, Plus,
  Lightbulb, Zap, Mic, Search, MessageSquare, FileUp,
  ArrowUpRight, RefreshCw, Shield,
} from "lucide-react";

type DiagnosticResult = {
  score: number;
  issues: { type: string; message: string; severity: "high" | "medium" | "low" }[];
  keywords: string[];
  suggestions: string[];
};

const SEVERITY_CONFIG = {
  high: { label: "Critical Issues", bg: "bg-red-50", text: "text-red-600", border: "border-l-red-500", badge: "bg-red-100 text-red-700", Icon: AlertCircle },
  medium: { label: "Medium Priority", bg: "bg-amber-50", text: "text-amber-600", border: "border-l-amber-400", badge: "bg-amber-100 text-amber-700", Icon: AlertTriangle },
  low: { label: "Low Priority", bg: "bg-gray-50", text: "text-gray-500", border: "border-l-gray-300", badge: "bg-gray-100 text-gray-600", Icon: Info },
} as const;

const SEVERITY_ORDER: ("high" | "medium" | "low")[] = ["high", "medium", "low"];

function getScoreInfo(score: number) {
  if (score >= 80) return { label: "Excellent!", desc: "Your resume is well-crafted and competitive.", gradient: "from-emerald-500 to-emerald-600", bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500" };
  if (score >= 60) return { label: "Good start!", desc: "A few improvements will make it stand out.", gradient: "from-amber-400 to-amber-500", bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-500" };
  if (score >= 40) return { label: "Needs work", desc: "Several areas need attention for better results.", gradient: "from-orange-400 to-orange-500", bg: "bg-orange-50", text: "text-orange-700", bar: "bg-orange-500" };
  return { label: "Needs improvement", desc: "Your resume has significant gaps. Let's fix them together.", gradient: "from-red-400 to-red-500", bg: "bg-red-50", text: "text-red-700", bar: "bg-red-500" };
}

export default function NewResumePage() {
  const [creating, setCreating] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadStep, setUploadStep] = useState<"idle" | "parsing" | "scoring" | "done" | "error">("idle");
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [diagnostic, setDiagnostic] = useState<DiagnosticResult | null>(null);
  const [collapsedSeverity, setCollapsedSeverity] = useState<Record<string, boolean>>({});
  const [expandedFix, setExpandedFix] = useState<Record<number, boolean>>({});
  const [surveyOpen, setSurveyOpen] = useState(false);
  const surveyDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (uploadStep !== "done" || !resumeId) return undefined;
    if (!shouldOfferSatisfactionSurvey()) return undefined;
    if (surveyDelayRef.current != null) return undefined;
    surveyDelayRef.current = setTimeout(() => {
      surveyDelayRef.current = null;
      setSurveyOpen(true);
    }, 12000);
    return () => {
      if (surveyDelayRef.current) {
        clearTimeout(surveyDelayRef.current);
        surveyDelayRef.current = null;
      }
    };
  }, [uploadStep, resumeId]);

  async function handleCreate() {
    setCreating(true);
    const r = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New Resume", vertical: "software", regionMode: "us" }),
    });
    const j = await r.json().catch(() => ({}));
    if (r.ok && j.id) {
      window.location.href = `/resume/${j.id}/edit`;
    } else {
      setCreating(false);
    }
  }

  async function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    setUploading(true);
    setUploadStep("parsing");
    setUploadErr(null);
    setDiagnostic(null);

    const fd = new FormData();
    fd.append("file", file);
    const parseRes = await fetch("/api/import/resume-file", { method: "POST", body: fd });
    const parseJ = await parseRes.json().catch(() => ({}));

    if (!parseRes.ok || !parseJ.content) {
      setUploadStep("error");
      setUploadErr(parseJ.error ?? "Could not parse the file");
      setUploading(false);
      return;
    }

    setUploadStep("scoring");

    const createRes = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: file.name.replace(/\.(pdf|docx?)/i, ""), vertical: "software", regionMode: "us" }),
    });
    const createJ = await createRes.json().catch(() => ({}));

    if (!createRes.ok || !createJ.id) {
      setUploadStep("error");
      setUploadErr("Could not create resume");
      setUploading(false);
      return;
    }

    await fetch(`/api/resumes/${createJ.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: parseJ.content }),
    });

    setResumeId(createJ.id);

    try {
      const fitRes = await fetch("/api/ai/role-fit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resumeId: createJ.id }),
      });
      const fitJ = await fitRes.json().catch(() => ({}));

      if (fitRes.ok && fitJ.result) {
        const content = parseJ.content;
        const allSkills = content.skills ?? [];
        const bulletCount = (content.experience ?? []).reduce((sum: number, ex: { bullets: unknown[] }) => sum + (ex.bullets?.length ?? 0), 0);

        const issues: DiagnosticResult["issues"] = [];

        if (!content.summary || content.summary.length < 30) {
          issues.push({ type: "Summary", message: "Professional summary is missing or too short", severity: "high" });
        }
        if (allSkills.length < 5) {
          issues.push({ type: "Skills", message: `Only ${allSkills.length} skills listed. Aim for 8-15`, severity: "medium" });
        }
        if (bulletCount < 4) {
          issues.push({ type: "Experience", message: "Too few achievement bullets. Add more quantifiable results", severity: "high" });
        }
        if (!content.contact?.email) {
          issues.push({ type: "Contact", message: "Email address is missing", severity: "high" });
        }
        if (!content.contact?.phone) {
          issues.push({ type: "Contact", message: "Phone number is missing", severity: "medium" });
        }
        if ((content.education ?? []).length === 0) {
          issues.push({ type: "Education", message: "No education entries found", severity: "low" });
        }

        for (const fix of fitJ.result.prioritized_fixes ?? []) {
          issues.push({ type: "AI Suggestion", message: fix, severity: "medium" });
        }

        setDiagnostic({
          score: fitJ.result.overall ?? 0,
          issues,
          keywords: allSkills.slice(0, 12),
          suggestions: (fitJ.result.prioritized_fixes ?? []).slice(0, 5),
        });
      }
    } catch {
      // scoring optional
    }

    setUploadStep("done");
    setUploading(false);
  }

  const toggleSeverity = (key: string) =>
    setCollapsedSeverity((prev) => ({ ...prev, [key]: !prev[key] }));

  const toggleFix = (idx: number) =>
    setExpandedFix((prev) => ({ ...prev, [idx]: !prev[idx] }));

  const progressSteps = [
    { key: "upload", label: "Uploading", desc: "Sending your file securely" },
    { key: "parsing", label: "AI Parsing", desc: "Extracting resume structure" },
    { key: "scoring", label: "Scoring", desc: "Analyzing quality & gaps" },
  ];

  function stepStatus(stepKey: string): "done" | "active" | "pending" {
    if (uploadStep === "parsing") {
      if (stepKey === "upload") return "done";
      if (stepKey === "parsing") return "active";
      return "pending";
    }
    if (uploadStep === "scoring") {
      if (stepKey === "scoring") return "active";
      return "done";
    }
    return "pending";
  }

  const fixSuggestions: Record<string, string> = {
    Summary: "Add a 2-3 sentence professional summary that highlights your years of experience, key skills, and career goals.",
    Skills: "List 8-15 relevant skills including both hard skills (tools, languages) and soft skills. Match them to your target job description.",
    Experience: "Add specific achievements with numbers: 'Increased sales by 30%' is better than 'Responsible for sales'.",
    Contact: "Make sure your email and phone are included so recruiters can reach you.",
    Education: "Add your highest degree, school name, and graduation year at minimum.",
    "AI Suggestion": "Review and incorporate this AI-generated recommendation into your resume.",
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAFA]">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .anim-in { animation: fadeInUp 0.5s ease-out both; }
        .anim-d1 { animation: fadeInUp 0.5s ease-out 0.08s both; }
        .anim-d2 { animation: fadeInUp 0.5s ease-out 0.16s both; }
        .anim-d3 { animation: fadeInUp 0.5s ease-out 0.24s both; }
        .anim-d4 { animation: fadeInUp 0.5s ease-out 0.32s both; }
        .anim-d5 { animation: fadeInUp 0.5s ease-out 0.40s both; }
        @keyframes pulseViolet {
          0% { box-shadow: 0 0 0 0 rgba(124,92,252,0.4); }
          70% { box-shadow: 0 0 0 10px rgba(124,92,252,0); }
          100% { box-shadow: 0 0 0 0 rgba(124,92,252,0); }
        }
        .pulse-violet { animation: pulseViolet 2s ease-out infinite; }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .shimmer {
          background: linear-gradient(90deg, transparent 25%, rgba(255,255,255,0.15) 50%, transparent 75%);
          background-size: 200% 100%;
          animation: shimmer 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3.5">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#7C5CFC] text-[12px] font-bold text-white">L</span>
          <span className="text-[15px] font-bold text-gray-900">Launch CV</span>
        </Link>
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 rounded-xl border border-gray-100 px-4 py-2 text-[13px] font-medium text-gray-500 transition hover:border-gray-200 hover:bg-gray-50 hover:text-gray-700"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
      </header>

      <main className="flex flex-1 items-start justify-center px-4 py-12 sm:py-16">
        <div className="w-full max-w-4xl">

          {/* ── IDLE: Guided Onboarding ── */}
          {uploadStep === "idle" && (
            <div className="anim-in">
              <div className="text-center">
                <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFC] to-[#9B7DFF]">
                  <Sparkles className="h-7 w-7 text-white" />
                </div>
                <h1 className="text-[32px] font-extrabold tracking-tight text-gray-900 sm:text-[36px]">
                  Let&apos;s build your resume
                </h1>
                <p className="mx-auto mt-3 max-w-lg text-[15px] leading-relaxed text-gray-500">
                  Choose how you&apos;d like to get started. Either way, our AI will guide you every step.
                </p>
              </div>

              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {/* Card 1: Start from Scratch */}
                <button
                  type="button"
                  onClick={() => void handleCreate()}
                  disabled={creating}
                  className="group relative flex flex-col rounded-2xl border-2 border-gray-100 bg-white p-8 text-left transition-all duration-200 hover:border-[#7C5CFC]/30 hover:shadow-xl hover:shadow-violet-100/50 disabled:opacity-60"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#7C5CFC] to-[#9B7DFF] shadow-lg shadow-violet-200/50">
                    <Sparkles className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="mt-6 text-[20px] font-bold text-gray-900">Start from Scratch</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                    Perfect if you want full control. Our AI will guide you step by step.
                  </p>

                  <div className="mt-5 space-y-2.5">
                    {[
                      { icon: Zap, text: "AI-powered suggestions" },
                      { icon: FileText, text: "12+ industry templates" },
                      { icon: Mic, text: "Voice input supported" },
                    ].map((b) => (
                      <div key={b.text} className="flex items-center gap-2.5 text-[13px] text-gray-600">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                          <b.icon className="h-3.5 w-3.5 text-[#7C5CFC]" />
                        </div>
                        {b.text}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl bg-[#7C5CFC] py-3.5 text-[14px] font-semibold text-white transition-colors group-hover:bg-[#6B4CE0]">
                    {creating ? <Loader2 className="h-4.5 w-4.5 animate-spin" /> : <Sparkles className="h-4.5 w-4.5" />}
                    {creating ? "Creating…" : "Start Fresh"}
                  </div>
                </button>

                {/* Card 2: Upload & Improve */}
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="group relative flex flex-col rounded-2xl border-2 border-gray-100 bg-white p-8 text-left transition-all duration-200 hover:border-amber-200 hover:shadow-xl hover:shadow-amber-100/40"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 shadow-lg shadow-amber-200/50">
                    <UploadCloud className="h-8 w-8 text-white" />
                  </div>
                  <h2 className="mt-6 text-[20px] font-bold text-gray-900">Upload &amp; Improve</h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                    Already have a resume? Upload it and we&apos;ll score it, find issues, and help you fix them.
                  </p>

                  <div className="mt-5 space-y-2.5">
                    {[
                      { icon: BarChart3, text: "Instant AI scoring" },
                      { icon: Search, text: "Find missing keywords" },
                      { icon: MessageSquare, text: "Get improvement suggestions" },
                    ].map((b) => (
                      <div key={b.text} className="flex items-center gap-2.5 text-[13px] text-gray-600">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                          <b.icon className="h-3.5 w-3.5 text-amber-600" />
                        </div>
                        {b.text}
                      </div>
                    ))}
                  </div>

                  <div className="mt-8 flex w-full items-center justify-center gap-2.5 rounded-xl border-2 border-[#7C5CFC] py-3.5 text-[14px] font-semibold text-[#7C5CFC] transition-colors group-hover:bg-violet-50">
                    <UploadCloud className="h-4.5 w-4.5" /> Upload File
                  </div>
                  <p className="mt-3 text-center text-[12px] text-gray-400">PDF, DOCX (max 4MB)</p>
                </button>
              </div>

              <p className="mt-8 text-center text-[13px] text-gray-400">
                Not sure?{" "}
                <button type="button" onClick={() => void handleCreate()} className="font-medium text-[#7C5CFC] underline underline-offset-2 transition hover:text-[#6B4CE0]">
                  Start fresh
                </button>{" "}
                — you can always import later.
              </p>

              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => void handleFileSelect(e)} />
            </div>
          )}

          {/* ── PROCESSING: Clean Stepper ── */}
          {(uploadStep === "parsing" || uploadStep === "scoring") && (
            <div className="anim-in mx-auto max-w-xl">
              <div className="rounded-2xl border border-gray-100 bg-white px-8 py-12 shadow-sm">
                {/* Stepper */}
                <div className="mx-auto flex max-w-md items-start justify-between">
                  {progressSteps.map((step, idx) => {
                    const status = stepStatus(step.key);
                    return (
                      <div key={step.key} className="relative flex flex-1 flex-col items-center">
                        {idx > 0 && (
                          <div className="absolute right-1/2 top-[18px] h-[2px] w-full">
                            <div className={`h-full w-full rounded-full transition-all duration-700 ${status === "pending" ? "bg-gray-200" : "bg-[#7C5CFC]"}`} />
                          </div>
                        )}
                        <div
                          className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full text-[13px] font-bold transition-all duration-300 ${
                            status === "done"
                              ? "bg-emerald-500 text-white"
                              : status === "active"
                                ? "pulse-violet bg-[#7C5CFC] text-white"
                                : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {status === "done" ? <Check className="h-4 w-4" /> : idx + 1}
                        </div>
                        <span className={`mt-2.5 text-[12px] font-semibold ${status === "active" ? "text-[#7C5CFC]" : status === "done" ? "text-emerald-600" : "text-gray-400"}`}>
                          {step.label}
                        </span>
                        <span className={`mt-0.5 text-[11px] ${status === "active" ? "text-[#7C5CFC]/70" : "text-gray-300"}`}>
                          {step.desc}
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div className="mt-12 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
                    <Loader2 className="h-7 w-7 animate-spin text-[#7C5CFC]" />
                  </div>
                  <h2 className="mt-5 text-[20px] font-bold text-gray-900">
                    {uploadStep === "parsing" ? "Parsing your resume…" : "Running AI diagnostics…"}
                  </h2>
                  <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                    {uploadStep === "parsing"
                      ? `Extracting structured data from your file`
                      : "Scoring content, finding gaps, and generating suggestions"}
                  </p>
                </div>

                <div className="mx-auto mt-8 flex max-w-sm items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                  <FileUp className="h-4 w-4 shrink-0 text-gray-400" />
                  <p className="truncate text-[13px] font-medium text-gray-600">{fileName}</p>
                </div>

                <p className="mt-4 text-center text-[12px] text-gray-400">This usually takes 15–30 seconds</p>
              </div>
            </div>
          )}

          {/* ── ERROR ── */}
          {uploadStep === "error" && (
            <div className="anim-in mx-auto max-w-lg">
              <div className="rounded-2xl border border-red-100 bg-white p-10 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50">
                  <AlertTriangle className="h-8 w-8 text-red-500" />
                </div>
                <h2 className="mt-6 text-[22px] font-bold text-gray-900">Something went wrong</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                  We couldn&apos;t process your file. Here&apos;s what happened:
                </p>
                <div className="mx-auto mt-4 max-w-sm rounded-xl bg-red-50 px-4 py-3">
                  <p className="text-[13px] font-medium text-red-600">{uploadErr}</p>
                </div>

                <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                  <button
                    type="button"
                    onClick={() => { setUploadStep("idle"); setUploadErr(null); }}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#6B4CE0]"
                  >
                    <RefreshCw className="h-4 w-4" /> Try Again
                  </button>
                  <button
                    type="button"
                    onClick={() => { setUploadStep("idle"); setUploadErr(null); }}
                    className="inline-flex items-center gap-2 rounded-xl border-2 border-gray-200 px-6 py-3 text-[14px] font-semibold text-gray-700 transition hover:bg-gray-50"
                  >
                    <FileText className="h-4 w-4" /> Try DOCX Instead
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => void handleCreate()}
                  className="mt-4 text-[13px] font-medium text-gray-400 underline underline-offset-2 transition hover:text-[#7C5CFC]"
                >
                  Or start from scratch
                </button>
              </div>
            </div>
          )}

          {/* ── DIAGNOSTIC RESULTS ── */}
          {uploadStep === "done" && diagnostic && (() => {
            const info = getScoreInfo(diagnostic.score);
            const highCount = diagnostic.issues.filter((i) => i.severity === "high").length;
            const medCount = diagnostic.issues.filter((i) => i.severity === "medium").length;

            return (
              <div className="space-y-6">
                {/* Header */}
                <div className="anim-in text-center">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50">
                    <CheckCircle className="h-6 w-6 text-emerald-500" />
                  </div>
                  <h2 className="mt-4 text-[28px] font-extrabold tracking-tight text-gray-900">Resume Analysis Complete</h2>
                  <p className="mt-1.5 text-[14px] text-gray-500">
                    Full diagnostic report for <span className="font-semibold text-gray-700">{fileName}</span>
                  </p>
                </div>

                <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
                  {/* ── Left Column ── */}
                  <div className="space-y-6">
                    {/* Score Card */}
                    <div className="anim-d1 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
                      <div className={`relative bg-gradient-to-r ${info.gradient} px-8 py-8`}>
                        <div className="shimmer absolute inset-0" />
                        <div className="relative flex items-center gap-6">
                          <div className="flex flex-col items-center">
                            <div className="flex items-baseline gap-1">
                              <span className="text-[56px] font-extrabold leading-none text-white">{diagnostic.score}</span>
                              <span className="text-[20px] font-semibold text-white/70">/100</span>
                            </div>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[18px] font-bold text-white">{info.label}</p>
                            <p className="mt-1 text-[14px] leading-relaxed text-white/80">{info.desc}</p>
                          </div>
                        </div>
                        <div className="relative mt-5">
                          <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                            <div
                              className="h-full rounded-full bg-white/90 transition-all duration-1000 ease-out"
                              style={{ width: `${diagnostic.score}%` }}
                            />
                          </div>
                          <div className="mt-2 flex justify-between text-[11px] font-medium text-white/60">
                            <span>0</span>
                            <span>100</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex divide-x divide-gray-100 border-t border-gray-100">
                        <div className="flex flex-1 items-center gap-3 px-5 py-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                            <AlertCircle className="h-4.5 w-4.5 text-red-500" />
                          </div>
                          <div>
                            <p className="text-[18px] font-bold text-gray-900">{highCount}</p>
                            <p className="text-[12px] text-gray-400">Critical</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-center gap-3 px-5 py-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50">
                            <AlertTriangle className="h-4.5 w-4.5 text-amber-500" />
                          </div>
                          <div>
                            <p className="text-[18px] font-bold text-gray-900">{medCount}</p>
                            <p className="text-[12px] text-gray-400">Medium</p>
                          </div>
                        </div>
                        <div className="flex flex-1 items-center gap-3 px-5 py-4">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50">
                            <BarChart3 className="h-4.5 w-4.5 text-[#7C5CFC]" />
                          </div>
                          <div>
                            <p className="text-[18px] font-bold text-gray-900">{diagnostic.keywords.length}</p>
                            <p className="text-[12px] text-gray-400">Keywords</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Issues Section */}
                    {diagnostic.issues.length > 0 && (
                      <div className="anim-d2 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center gap-3">
                          <h3 className="text-[17px] font-bold text-gray-900">Here&apos;s what we found</h3>
                          <span className="rounded-full bg-gray-100 px-2.5 py-1 text-[12px] font-bold text-gray-600">
                            {diagnostic.issues.length} issues
                          </span>
                        </div>

                        <div className="mt-5 space-y-6">
                          {SEVERITY_ORDER.map((sev) => {
                            const items = diagnostic.issues.filter((i) => i.severity === sev);
                            if (items.length === 0) return null;
                            const cfg = SEVERITY_CONFIG[sev];
                            const collapsed = collapsedSeverity[sev] ?? false;

                            return (
                              <div key={sev}>
                                <button
                                  type="button"
                                  onClick={() => toggleSeverity(sev)}
                                  className="flex w-full items-center gap-2.5"
                                >
                                  <ChevronDown
                                    className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${collapsed ? "-rotate-90" : ""}`}
                                  />
                                  <span className={`text-[14px] font-bold ${cfg.text}`}>{cfg.label}</span>
                                  <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${cfg.badge}`}>
                                    {items.length}
                                  </span>
                                </button>

                                {!collapsed && (
                                  <div className="mt-3 space-y-2.5 pl-2">
                                    {items.map((issue, i) => {
                                      const globalIdx = diagnostic.issues.indexOf(issue);
                                      const isFixExpanded = expandedFix[globalIdx] ?? false;
                                      return (
                                        <div
                                          key={i}
                                          className={`relative overflow-hidden rounded-xl border border-gray-100 border-l-[4px] ${cfg.border} bg-white transition-shadow hover:shadow-sm`}
                                        >
                                          <div className="flex items-start gap-3.5 p-4">
                                            <cfg.Icon className={`mt-0.5 h-5 w-5 shrink-0 ${cfg.text}`} />
                                            <div className="min-w-0 flex-1">
                                              <div className="flex items-center gap-2">
                                                <span className={`inline-block rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide ${cfg.badge}`}>
                                                  {issue.type}
                                                </span>
                                                <span className="ml-auto text-[11px] font-medium text-gray-300">#{i + 1}</span>
                                              </div>
                                              <p className="mt-1.5 text-[13px] leading-relaxed text-gray-700">{issue.message}</p>
                                              <button
                                                type="button"
                                                onClick={() => toggleFix(globalIdx)}
                                                className="mt-2.5 inline-flex items-center gap-1.5 text-[12px] font-semibold text-[#7C5CFC] transition hover:text-[#6B4CE0]"
                                              >
                                                <Lightbulb className="h-3.5 w-3.5" />
                                                {isFixExpanded ? "Hide suggestion" : "How to fix"}
                                              </button>
                                            </div>
                                          </div>
                                          {isFixExpanded && (
                                            <div className="border-t border-gray-100 bg-violet-50/50 px-4 py-3">
                                              <p className="text-[12px] leading-relaxed text-gray-600">
                                                {fixSuggestions[issue.type] ?? "Open the editor to address this issue with AI-powered guidance."}
                                              </p>
                                            </div>
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Keywords */}
                    <div className="anim-d3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                      <h3 className="flex items-center gap-2 text-[17px] font-bold text-gray-900">
                        <Shield className="h-5 w-5 text-[#7C5CFC]" />
                        Skills we detected
                      </h3>
                      {diagnostic.keywords.length > 0 ? (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {diagnostic.keywords.map((kw) => (
                            <span
                              key={kw}
                              className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3.5 py-1.5 text-[13px] font-medium text-emerald-700"
                            >
                              <Check className="h-3 w-3" />
                              {kw}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <div className="mt-4 rounded-xl bg-gray-50 px-4 py-6 text-center">
                          <Search className="mx-auto h-6 w-6 text-gray-300" />
                          <p className="mt-2 text-[13px] text-gray-500">No skills detected — add them in the editor</p>
                        </div>
                      )}

                      {diagnostic.suggestions.length > 0 && (
                        <div className="mt-5">
                          <p className="text-[12px] font-semibold uppercase tracking-wider text-gray-400">Consider Adding</p>
                          <div className="mt-2.5 flex flex-wrap gap-2">
                            {diagnostic.suggestions.map((s, i) => (
                              <span
                                key={i}
                                className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-gray-300 bg-gray-50 px-3.5 py-1.5 text-[13px] font-medium text-gray-500"
                              >
                                <Plus className="h-3 w-3" />
                                {s}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* ── Right Column ── */}
                  <div className="space-y-6">
                    {/* What to do next */}
                    <div className="anim-d2 rounded-2xl border-2 border-[#7C5CFC]/20 bg-gradient-to-b from-violet-50/60 to-white p-6 shadow-sm">
                      <h3 className="flex items-center gap-2 text-[17px] font-bold text-gray-900">
                        <Target className="h-5 w-5 text-[#7C5CFC]" />
                        What to do next
                      </h3>
                      <p className="mt-1 text-[13px] text-gray-500">Follow these steps to improve your score</p>

                      <div className="mt-5 space-y-1">
                        {[
                          { num: "1", text: "Fix critical issues first", href: `/resume/${resumeId}/edit`, icon: AlertCircle, color: "text-red-500" },
                          { num: "2", text: "Add missing keywords", href: `/resume/${resumeId}/edit`, icon: Plus, color: "text-amber-500" },
                          { num: "3", text: "Tailor to a specific job", href: `/resume/${resumeId}/jd`, icon: Target, color: "text-[#7C5CFC]" },
                          { num: "4", text: "Match to a target company", href: "/dashboard/company-matcher", icon: Building2, color: "text-emerald-500" },
                        ].map((step) => (
                          <Link
                            key={step.num}
                            href={step.href}
                            className="group flex items-center gap-3 rounded-xl px-3 py-3 transition hover:bg-white hover:shadow-sm"
                          >
                            <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-[12px] font-bold ${step.color}`}>
                              {step.num}
                            </div>
                            <span className="flex-1 text-[13px] font-medium text-gray-700">{step.text}</span>
                            <ArrowUpRight className="h-4 w-4 text-gray-300 transition group-hover:text-[#7C5CFC]" />
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="anim-d3 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                      <h3 className="text-[15px] font-bold text-gray-900">Quick Actions</h3>
                      <div className="mt-4 space-y-2.5">
                        <Link
                          href={`/resume/${resumeId}/edit`}
                          className="flex items-center justify-center gap-2 rounded-xl bg-[#7C5CFC] py-3 text-[14px] font-semibold text-white transition hover:bg-[#6B4CE0] hover:shadow-md hover:shadow-violet-200/50"
                        >
                          <Sparkles className="h-4 w-4" /> Open in Editor
                        </Link>
                        <Link
                          href={`/resume/${resumeId}/jd`}
                          className="flex items-center justify-center gap-2 rounded-xl border-2 border-[#7C5CFC] py-3 text-[14px] font-semibold text-[#7C5CFC] transition hover:bg-violet-50"
                        >
                          <Target className="h-4 w-4" /> Tailor to Job Description
                        </Link>
                        <Link
                          href="/dashboard/company-matcher"
                          className="flex items-center justify-center gap-2 rounded-xl border-2 border-gray-200 py-3 text-[14px] font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                          <Building2 className="h-4 w-4" /> Match to Company
                        </Link>
                        <button
                          type="button"
                          onClick={() => { setUploadStep("idle"); setDiagnostic(null); setFileName(""); }}
                          className="flex w-full items-center justify-center gap-1.5 py-2 text-[13px] font-medium text-gray-400 transition hover:text-[#7C5CFC]"
                        >
                          <UploadCloud className="h-3.5 w-3.5" /> Upload Different File
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Done but no diagnostic */}
          {uploadStep === "done" && !diagnostic && (
            <div className="anim-in mx-auto max-w-md">
              <div className="rounded-2xl border border-gray-100 bg-white p-12 text-center shadow-sm">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50">
                  <CheckCircle className="h-8 w-8 text-emerald-500" />
                </div>
                <h2 className="mt-6 text-[22px] font-bold text-gray-900">Resume Uploaded!</h2>
                <p className="mt-2 text-[14px] leading-relaxed text-gray-500">
                  Your resume has been parsed and saved successfully. Open the editor to start improving it.
                </p>
                <Link
                  href={`/resume/${resumeId}/edit`}
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-8 py-3.5 text-[14px] font-bold text-white transition hover:bg-[#6B4CE0]"
                >
                  Open in Editor <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}

        </div>
      </main>
      <ExperienceReviewModal
        open={surveyOpen}
        onClose={() => setSurveyOpen(false)}
        context="upload_diagnostic"
      />
    </div>
  );
}
