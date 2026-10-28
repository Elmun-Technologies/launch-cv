"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, FileText, Loader2, UploadCloud } from "lucide-react";
import { ExperienceReviewModal } from "@/components/experience-review-modal";
import { Logo } from "@/components/logo";
import { shouldOfferSatisfactionSurvey } from "@/lib/satisfaction-survey";
import { TEMPLATE_SPECS, TEMPLATE_STYLES, type TemplateStyle } from "@/lib/resume-templates";

type Severity = "high" | "medium" | "low";
type Issue = { area: string; message: string; fix: string; severity: Severity };
type ImportedContent = {
  summary?: string;
  skills?: string[];
  experience?: { bullets?: unknown[] }[];
  education?: unknown[];
  contact?: { email?: string; phone?: string };
};

const SEVERITY: Record<Severity, { label: string; cls: string }> = {
  high: { label: "High", cls: "text-[#C2341B]" },
  medium: { label: "Medium", cls: "text-[#C2700A]" },
  low: { label: "Low", cls: "text-[#6B6B6B]" },
};

/** Checks we can run on the imported content without AI, so every account gets them. */
function checkContent(c: ImportedContent): Issue[] {
  const issues: Issue[] = [];
  const skills = c.skills ?? [];
  const bullets = (c.experience ?? []).reduce((n, e) => n + (e.bullets?.length ?? 0), 0);
  if (!c.contact?.email)
    issues.push({ area: "Contact", severity: "high", message: "No email address found", fix: "Add the email you want recruiters to use, at the top of the page." });
  if (bullets < 4)
    issues.push({
      area: "Experience",
      severity: "high",
      message: bullets === 0 ? "No bullet points found under your jobs" : `Only ${bullets} bullet ${bullets === 1 ? "point" : "points"} across your jobs`,
      fix: "Give each recent job 3–5 bullets that start with a verb and end with a result, ideally a number.",
    });
  if (!c.summary || c.summary.trim().length < 30)
    issues.push({ area: "Summary", severity: "medium", message: "The summary is missing or very short", fix: "Write two or three lines: your level, your field and one result you're proud of." });
  if (skills.length < 5)
    issues.push({
      area: "Skills",
      severity: "medium",
      message: skills.length === 0 ? "No skills listed" : `Only ${skills.length} ${skills.length === 1 ? "skill" : "skills"} listed`,
      fix: "List 8–15 tools and skills, using the same words the job posts you want use.",
    });
  if (!c.contact?.phone) issues.push({ area: "Contact", severity: "low", message: "No phone number found", fix: "Optional, but many recruiters call before they email." });
  if ((c.education ?? []).length === 0)
    issues.push({ area: "Education", severity: "low", message: "No education found", fix: "Add your highest degree, the school and the year — or a relevant certificate." });
  return issues;
}

function readParam(name: string) {
  return new URLSearchParams(window.location.search).get(name);
}

export default function NewResumePage() {
  const fileRef = useRef<HTMLInputElement>(null);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [step, setStep] = useState<"idle" | "parsing" | "checking" | "done" | "error">("idle");
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [dragging, setDragging] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [fit, setFit] = useState<{ score: number; fixes: string[] } | null>(null);
  const [surveyOpen, setSurveyOpen] = useState(false);
  /** Set when arriving from a resume example page (?example=<slug>) or the templates page (?template=<style>). */
  const [exampleSlug, setExampleSlug] = useState<string | null>(null);
  const [template, setTemplate] = useState<TemplateStyle | null>(null);

  useEffect(() => {
    const slug = readParam("example");
    const t = readParam("template");
    queueMicrotask(() => {
      if (slug && /^[a-z0-9-]{2,80}$/.test(slug)) setExampleSlug(slug);
      if (t && TEMPLATE_STYLES.includes(t as TemplateStyle)) setTemplate(t as TemplateStyle);
    });
  }, []);

  const exampleRole = exampleSlug ? exampleSlug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()) : "";

  useEffect(() => {
    if (step !== "done" || !resumeId || !shouldOfferSatisfactionSurvey()) return undefined;
    const t = setTimeout(() => setSurveyOpen(true), 12000);
    return () => clearTimeout(t);
  }, [step, resumeId]);

  /** Carry the template picked on the templates page into the editor. */
  function rememberTemplate(id: string) {
    if (!template) return;
    try {
      window.localStorage.setItem(`lcv_tpl_${id}`, template);
    } catch {
      // storage unavailable: the editor falls back to Classic
    }
  }

  async function handleCreate(example?: string) {
    setCreating(true);
    setCreateErr(null);
    const r = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New resume", vertical: "software", regionMode: "us", ...(example ? { example } : {}) }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (r?.ok && j.id) {
      rememberTemplate(j.id);
      window.location.href = `/resume/${j.id}/edit`;
      return;
    }
    setCreating(false);
    setCreateErr(typeof j.error === "string" ? j.error : "Couldn't create the resume. Please try again.");
  }

  async function importFile(file: File) {
    if (!/\.(pdf|docx?)$/i.test(file.name)) {
      setStep("error");
      setUploadErr("That file type isn't supported. Upload a PDF or Word (.docx) file.");
      return;
    }
    setFileName(file.name);
    setStep("parsing");
    setUploadErr(null);
    setFit(null);

    const fd = new FormData();
    fd.append("file", file);
    const parseRes = await fetch("/api/import/resume-file", { method: "POST", body: fd }).catch(() => null);
    const parseJ = parseRes ? await parseRes.json().catch(() => ({})) : {};
    if (!parseRes?.ok || !parseJ.content) {
      setStep("error");
      setUploadErr(typeof parseJ.error === "string" ? parseJ.error : "We couldn't read that file.");
      return;
    }

    setStep("checking");
    const createRes = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: file.name.replace(/\.(pdf|docx?)$/i, ""), vertical: "software", regionMode: "us" }),
    }).catch(() => null);
    const createJ = createRes ? await createRes.json().catch(() => ({})) : {};
    if (!createRes?.ok || !createJ.id) {
      setStep("error");
      setUploadErr("We read your file but couldn't save the resume. Please try again.");
      return;
    }
    await fetch(`/api/resumes/${createJ.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: parseJ.content }),
    }).catch(() => null);
    setResumeId(createJ.id);
    rememberTemplate(createJ.id);

    const content = parseJ.content as ImportedContent;
    setIssues(checkContent(content));
    setSkills((content.skills ?? []).slice(0, 15));

    // The role-fit score is an AI tool; on accounts without a plan it simply isn't shown.
    const fitRes = await fetch("/api/ai/role-fit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ resumeId: createJ.id }),
    }).catch(() => null);
    const fitJ = fitRes?.ok ? await fitRes.json().catch(() => ({})) : {};
    if (fitJ.result && typeof fitJ.result.overall === "number") {
      setFit({ score: fitJ.result.overall, fixes: (fitJ.result.prioritized_fixes ?? []).slice(0, 5) });
    }
    setStep("done");
  }

  function onFiles(files: FileList | null) {
    const f = files?.[0];
    if (f) void importFile(f);
  }

  const reset = () => {
    setStep("idle");
    setUploadErr(null);
    setFileName("");
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#FAFAF9] text-[#111111]">
      <header className="flex h-[60px] items-center justify-between border-b border-[#EEEEEB] bg-white px-4 sm:px-6">
        <Logo variant="light" size="md" href="/dashboard" />
        <Link href="/dashboard" className="inline-flex items-center gap-1.5 text-[14px] text-[#3F3F3F] hover:text-[#111111]">
          <ArrowLeft className="h-4 w-4" aria-hidden /> Back to dashboard
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[880px] flex-1 px-4 py-10 sm:px-6 sm:py-14">
        <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={(e) => onFiles(e.target.files)} />

        {step === "idle" ? (
          <>
            {exampleSlug ? (
              <div className="mb-8 flex flex-col gap-4 rounded-[16px] border border-[#DCE6FF] bg-[#EEF3FF] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[17px] font-semibold">Start from the {exampleRole} example</p>
                  <p className="mt-1 max-w-[520px] text-[14px] leading-[1.55] text-[#3F3F3F]">
                    We&apos;ll copy its summary, experience and skills into a new resume with your name and email. Replace the sample
                    details with your own before you send it.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => void handleCreate(exampleSlug)}
                  disabled={creating}
                  className="soha-btn-primary inline-flex shrink-0 items-center justify-center gap-2 disabled:opacity-60"
                >
                  {creating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                  Use this example
                </button>
              </div>
            ) : null}

            <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[40px]">
              New resume. <span className="text-[#8A8A86]">Start with the one you have.</span>
            </h1>
            <p className="mt-3 max-w-[600px] text-[16px] leading-[1.6] text-[#3F3F3F]">
              Import a PDF or Word file and every section is filled in for you to review. No file? Start from a blank page or an example.
            </p>
            {template ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#E5E5E2] bg-white px-3 py-1.5 text-[13px] text-[#3F3F3F]">
                <Check className="h-3.5 w-3.5 text-[#0E7A48]" aria-hidden /> Template: {TEMPLATE_SPECS[template].label}
              </p>
            ) : null}

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragging(false);
                onFiles(e.dataTransfer.files);
              }}
              className={`mt-8 flex w-full flex-col items-center rounded-[18px] border-2 border-dashed px-6 py-12 text-center transition ${
                dragging ? "border-[#2563EB] bg-[#EEF3FF]" : "border-[#D9D9D5] bg-white hover:border-[#111111]"
              }`}
            >
              <UploadCloud className="h-7 w-7 text-[#3F3F3F]" aria-hidden />
              <span className="mt-3 text-[17px] font-semibold">Import my resume</span>
              <span className="mt-1 text-[14px] text-[#6B6B6B]">Drop a file here or choose one · PDF or DOCX, up to 4 MB</span>
              <span className="soha-btn-primary mt-5 inline-flex items-center">Choose file</span>
            </button>

            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <button
                type="button"
                onClick={() => void handleCreate()}
                disabled={creating}
                className="group flex items-start justify-between gap-4 rounded-[16px] border border-[#E5E5E2] bg-white p-5 text-left transition hover:border-[#111111] disabled:opacity-60"
              >
                <span>
                  <span className="flex items-center gap-2 text-[16px] font-semibold">
                    <FileText className="h-4 w-4 text-[#3F3F3F]" aria-hidden /> Blank page
                  </span>
                  <span className="mt-1 block text-[14px] leading-[1.5] text-[#6B6B6B]">
                    Fill in each section with a live preview of the PDF.
                  </span>
                </span>
                {creating && !exampleSlug ? (
                  <Loader2 className="mt-1 h-4 w-4 shrink-0 animate-spin text-[#6B6B6B]" aria-hidden />
                ) : (
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#6E6E6A] transition group-hover:translate-x-0.5" aria-hidden />
                )}
              </button>
              <Link
                href="/resume-examples"
                className="group flex items-start justify-between gap-4 rounded-[16px] border border-[#E5E5E2] bg-white p-5 transition hover:border-[#111111]"
              >
                <span>
                  <span className="block text-[16px] font-semibold">From an example</span>
                  <span className="mt-1 block text-[14px] leading-[1.5] text-[#6B6B6B]">
                    16 roles, from nurse to software engineer. Pick one and make it yours.
                  </span>
                </span>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[#6E6E6A] transition group-hover:translate-x-0.5" aria-hidden />
              </Link>
            </div>
            {createErr ? (
              <p role="alert" className="mt-4 text-[14px] text-[#B42318]">
                {createErr}
              </p>
            ) : null}
          </>
        ) : null}

        {step === "parsing" || step === "checking" ? (
          <div className="mx-auto max-w-[520px] rounded-[18px] border border-[#E5E5E2] bg-white p-8" role="status" aria-live="polite">
            <p className="flex items-center gap-2 truncate text-[14px] text-[#6B6B6B]">
              <FileText className="h-4 w-4 shrink-0" aria-hidden /> {fileName}
            </p>
            <h1 className="mt-3 text-[24px] font-semibold tracking-[-0.02em]">Importing your resume…</h1>
            <ol className="mt-6 flex flex-col gap-3 text-[15px]">
              {[
                { k: "parsing", l: "Reading the file and finding each section" },
                { k: "checking", l: "Saving it and checking for gaps" },
              ].map((s, i) => {
                const done = step === "checking" && i === 0;
                const active = step === s.k;
                return (
                  <li key={s.k} className="flex items-center gap-3">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[12px] ${
                        done ? "bg-[#111111] text-white" : active ? "border border-[#111111]" : "border border-[#D9D9D5] text-[#8A8A86]"
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : active ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : i + 1}
                    </span>
                    <span className={active || done ? "text-[#111111]" : "text-[#8A8A86]"}>{s.l}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-6 text-[13px] text-[#6E6E6A]">Usually 15–30 seconds.</p>
          </div>
        ) : null}

        {step === "error" ? (
          <div className="mx-auto max-w-[520px] rounded-[18px] border border-[#E5E5E2] bg-white p-8">
            <h1 className="text-[24px] font-semibold tracking-[-0.02em]">We couldn&apos;t import that file</h1>
            <p role="alert" className="mt-3 rounded-[10px] bg-[#FDF2F0] px-4 py-3 text-[14px] text-[#B42318]">
              {uploadErr}
            </p>
            <p className="mt-4 text-[14px] leading-[1.55] text-[#3F3F3F]">
              Scanned PDFs and files saved as images can&apos;t be read. If you have the Word version, try that.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  reset();
                  fileRef.current?.click();
                }}
                className="soha-btn-primary"
              >
                Choose another file
              </button>
              <button type="button" onClick={() => void handleCreate()} disabled={creating} className="soha-btn-secondary disabled:opacity-60">
                Start from a blank page
              </button>
            </div>
          </div>
        ) : null}

        {step === "done" && resumeId ? (
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-[14px] text-[#0E7A48]">
                  <Check className="h-4 w-4" aria-hidden /> Imported
                </p>
                <h1 className="mt-1 truncate text-[28px] font-semibold tracking-[-0.02em]">{fileName.replace(/\.(pdf|docx?)$/i, "")}</h1>
                <p className="mt-1 text-[15px] text-[#6B6B6B]">
                  {issues.length === 0 ? "Nothing obvious is missing. Check each section in the editor." : `${issues.length} things to look at before you send it.`}
                </p>
              </div>
              <Link href={`/resume/${resumeId}/edit`} className="soha-btn-primary inline-flex shrink-0 items-center justify-center gap-2">
                Open in editor <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>

            {issues.length > 0 ? (
              <section className="rounded-[16px] border border-[#E5E5E2] bg-white">
                <h2 className="border-b border-[#EEEEEB] px-6 py-4 text-[17px] font-semibold">What to fix first</h2>
                <ul className="divide-y divide-[#EEEEEB]">
                  {issues.map((i) => (
                    <li key={i.message} className="grid gap-1 px-6 py-4 sm:grid-cols-[1fr_80px] sm:gap-4">
                      <div>
                        <p className="text-[15px] font-medium">
                          <span className="text-[#6B6B6B]">{i.area} · </span>
                          {i.message}
                        </p>
                        <p className="mt-1 text-[14px] leading-[1.55] text-[#3F3F3F]">{i.fix}</p>
                      </div>
                      <p className={`text-[14px] font-medium sm:text-right ${SEVERITY[i.severity].cls}`}>{SEVERITY[i.severity].label}</p>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <div className="grid gap-5 md:grid-cols-2">
              <section className="rounded-[16px] border border-[#E5E5E2] bg-white p-6">
                <h2 className="text-[17px] font-semibold">Skills we found</h2>
                {skills.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <li key={s} className="rounded-full bg-[#F5F5F3] px-3 py-1 text-[13px] text-[#3F3F3F]">
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-[14px] text-[#6B6B6B]">None yet — add them in the editor&apos;s Skills step.</p>
                )}
              </section>

              {fit ? (
                <section className="rounded-[16px] border border-[#E5E5E2] bg-white p-6">
                  <h2 className="flex items-baseline justify-between text-[17px] font-semibold">
                    Role-fit score
                    <span className={fit.score >= 75 ? "text-[#12A15E]" : fit.score >= 50 ? "text-[#C2700A]" : "text-[#C2341B]"}>{fit.score}</span>
                  </h2>
                  {fit.fixes.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-[1.55] text-[#3F3F3F]">
                      {fit.fixes.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ) : (
                <section className="rounded-[16px] border border-[#E5E5E2] bg-white p-6">
                  <h2 className="text-[17px] font-semibold">Next, aim it at a job</h2>
                  <p className="mt-1 text-[14px] leading-[1.55] text-[#6B6B6B]">
                    Paste a job post to see which of its keywords your resume already covers.
                  </p>
                  <Link
                    href={`/resume/${resumeId}/jd`}
                    className="mt-4 inline-flex items-center gap-1.5 text-[14px] font-medium text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]"
                  >
                    Match to a job <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </section>
              )}
            </div>

            <button type="button" onClick={reset} className="self-start text-[14px] text-[#6B6B6B] underline underline-offset-2 hover:text-[#111111]">
              Import a different file
            </button>
          </div>
        ) : null}
      </main>

      <ExperienceReviewModal open={surveyOpen} onClose={() => setSurveyOpen(false)} context="upload_diagnostic" />
    </div>
  );
}
