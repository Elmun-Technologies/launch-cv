"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowLeft, ArrowRight, Check, FileText, ClipboardPaste, Loader2, Upload, UploadCloud } from "lucide-react";
import { ExperienceReviewModal } from "@/components/experience-review-modal";
import { SiteMark } from "@/components/site/brand";
import { appBtnPrimary, appBtnSmDark, appBtnSoft, appBtnWhite, appInput, appLink, badge, scoreTone } from "@/components/app/shell/ui";
import { siteFontVars } from "@/lib/site-fonts";
import { shouldOfferSatisfactionSurvey } from "@/lib/satisfaction-survey";
import { TEMPLATE_SPECS, TEMPLATE_STYLES, type TemplateStyle } from "@/lib/resume-templates";

type Severity = "high" | "medium" | "low";
type Issue = { area: string; message: string; fix: string; severity: Severity };
type ImportedContent = {
  summary?: string;
  skills?: string[];
  experience?: { role?: string; company?: string; start?: string; end?: string; bullets?: unknown[] }[];
  education?: unknown[];
  contact?: { fullName?: string; email?: string; phone?: string };
};
type FoundJob = { role: string; company: string; dates: string; bullets: number };
type Found = { jobs: FoundJob[]; contact: boolean; education: number; skills: number };
type Example = { slug: string; role: string };

const SEVERITY: Record<Severity, { label: string; cls: string }> = {
  high: { label: "High", cls: "bg-[#fbe2e3] text-[#8f1d22]" },
  medium: { label: "Medium", cls: "bg-[#fdf0d5] text-[#7a4600]" },
  low: { label: "Low", cls: "bg-[#f1eff8] text-[#4a4862]" },
};

const LINKEDIN_MIN = 50;

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

/** What the import pulled out, for the review screen. */
function summarize(c: ImportedContent): Found {
  const jobs = (c.experience ?? []).map((e) => ({
    role: (e.role ?? "").trim(),
    company: (e.company ?? "").trim(),
    dates: [e.start, e.end].filter((d) => typeof d === "string" && d.trim()).join(" – "),
    bullets: e.bullets?.length ?? 0,
  }));
  return { jobs, contact: !!(c.contact?.email || c.contact?.phone), education: (c.education ?? []).length, skills: (c.skills ?? []).length };
}

/** "contact details, 1 education entry and 14 skills were also found" (lowercase, no period), or "". */
function foundLine(f: Found): string {
  const parts: string[] = [];
  if (f.contact) parts.push("contact details");
  if (f.education > 0) parts.push(`${f.education} education ${f.education === 1 ? "entry" : "entries"}`);
  if (f.skills > 0) parts.push(`${f.skills} ${f.skills === 1 ? "skill" : "skills"}`);
  if (parts.length === 0) return "";
  const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
  const singular = parts.length === 1 && !f.contact && (f.education === 1 || f.skills === 1);
  return `${list} ${singular ? "was" : "were"} also found`;
}

function readParam(name: string) {
  return new URLSearchParams(window.location.search).get(name);
}

export function NewResumeClient({ examples, quick }: { examples: Example[]; quick: Example[] }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const exampleRef = useRef<HTMLHeadingElement>(null);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [step, setStep] = useState<"idle" | "parsing" | "checking" | "done" | "error">("idle");
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [source, setSource] = useState<"file" | "linkedin">("file");
  const [dragging, setDragging] = useState(false);
  const [resumeId, setResumeId] = useState<string | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [skills, setSkills] = useState<string[]>([]);
  const [found, setFound] = useState<Found | null>(null);
  const [fit, setFit] = useState<{ score: number; fixes: string[] } | null>(null);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [linkedinText, setLinkedinText] = useState("");
  const [linkedinErr, setLinkedinErr] = useState<string | null>(null);
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

  const exampleRole = exampleSlug
    ? (examples.find((e) => e.slug === exampleSlug)?.role ?? exampleSlug.replace(/-/g, " ").replace(/^./, (c) => c.toUpperCase()))
    : "";

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

  /** Shared pipeline for both sources: parse → create → save content → checks → optional role-fit. */
  async function runImport(opts: {
    label: string;
    parse: () => Promise<Response>;
    readErr: string;
    title: (content: ImportedContent) => string;
  }) {
    setFileName(opts.label);
    setStep("parsing");
    setUploadErr(null);
    setFit(null);

    const parseRes = await opts.parse().catch(() => null);
    const parseJ = parseRes ? await parseRes.json().catch(() => ({})) : {};
    if (!parseRes?.ok || !parseJ.content) {
      setStep("error");
      setUploadErr(typeof parseJ.error === "string" ? parseJ.error : opts.readErr);
      return;
    }

    const content = parseJ.content as ImportedContent;
    setStep("checking");
    const createRes = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: opts.title(content), vertical: "software", regionMode: "us" }),
    }).catch(() => null);
    const createJ = createRes ? await createRes.json().catch(() => ({})) : {};
    if (!createRes?.ok || !createJ.id) {
      setStep("error");
      setUploadErr(`We read your ${opts.label === "LinkedIn profile text" ? "profile" : "file"} but couldn't save the resume. Please try again.`);
      return;
    }
    await fetch(`/api/resumes/${createJ.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: parseJ.content }),
    }).catch(() => null);
    setResumeId(createJ.id);
    rememberTemplate(createJ.id);

    setIssues(checkContent(content));
    setSkills((content.skills ?? []).slice(0, 15));
    setFound(summarize(content));

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

  async function importFile(file: File) {
    if (!/\.(pdf|docx?)$/i.test(file.name)) {
      setSource("file");
      setStep("error");
      setUploadErr("That file type isn't supported. Upload a PDF or Word (.docx) file.");
      return;
    }
    setSource("file");
    const fd = new FormData();
    fd.append("file", file);
    await runImport({
      label: file.name,
      parse: () => fetch("/api/import/resume-file", { method: "POST", body: fd }),
      readErr: "We couldn't read that file.",
      title: () => file.name.replace(/\.(pdf|docx?)$/i, ""),
    });
  }

  async function importLinkedIn() {
    const text = linkedinText.trim();
    if (text.length < LINKEDIN_MIN) {
      setLinkedinErr(`Paste at least ${LINKEDIN_MIN} characters of your profile — the About, Experience and Skills sections work best.`);
      return;
    }
    setLinkedinErr(null);
    setSource("linkedin");
    await runImport({
      label: "LinkedIn profile text",
      parse: () =>
        fetch("/api/import/linkedin-text", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
        }),
      readErr: "We couldn't read that text.",
      title: (c) => (c.contact?.fullName?.trim() ? `${c.contact.fullName.trim()} — LinkedIn` : "LinkedIn import"),
    });
  }

  function onFiles(files: FileList | null) {
    const f = files?.[0];
    if (f) void importFile(f);
  }

  const reset = () => {
    setStep("idle");
    setUploadErr(null);
    setFileName("");
    setFound(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  function pickExample(slug: string) {
    setExampleSlug(slug);
    setCreateErr(null);
    requestAnimationFrame(() => {
      exampleRef.current?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      exampleRef.current?.focus({ preventScroll: true });
    });
  }

  const busy = step === "parsing" || step === "checking";
  const card = "rounded-[24px] bg-white p-6 sm:rounded-[28px] sm:p-7";
  const iconTile = "inline-flex h-12 w-12 items-center justify-center rounded-2xl";
  const jobs = found?.jobs ?? [];

  return (
    <div className={`lc-site ${siteFontVars} flex min-h-screen flex-col`}>
      <header className="flex items-center justify-between gap-4 border-b border-[#e2e0ea] bg-white px-4 py-2.5 sm:px-6 lg:px-10 lg:py-[18px]">
        <Link href="/dashboard" aria-label="LaunchCV dashboard" className="focus-visible:outline-[#5440e8]! focus-visible:rounded-xl! group inline-flex min-h-11 items-center gap-2.5 rounded-xl text-[#121226]">
          <SiteMark size={32} className="transition-transform duration-300 group-hover:-rotate-6 motion-reduce:transition-none motion-reduce:group-hover:rotate-0" />
          <span className="text-[20px] font-extrabold tracking-[-0.02em]">
            launch<span className="text-[#5440e8]">cv</span>
          </span>
        </Link>
        <Link
          href="/dashboard"
          className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-[14px] font-bold text-[#4a4862] transition-colors hover:bg-[#f1eff8] hover:text-[#121226]"
        >
          {step === "done" ? (
            <>
              <ArrowLeft className="h-4 w-4" aria-hidden /> Back to dashboard
            </>
          ) : (
            "Cancel"
          )}
        </Link>
      </header>

      <main className="mx-auto w-full max-w-[1040px] flex-1 px-4 pb-14 pt-6 sm:px-6 sm:pt-10 lg:px-0">
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => onFiles(e.target.files)}
        />

        {step === "idle" ? (
          <>
            <Link href="/dashboard/resumes" className={`${appLink} gap-1.5`}>
              <ArrowLeft className="h-4 w-4" aria-hidden /> Resumes
            </Link>

            {exampleSlug ? (
              <section
                aria-labelledby="example-start"
                className="mt-4 flex flex-col gap-4 rounded-[24px] bg-[#111118] p-6 text-white sm:rounded-[28px] sm:flex-row sm:items-center sm:justify-between sm:p-7"
              >
                <div className="min-w-0">
                  <h2 id="example-start" ref={exampleRef} tabIndex={-1} className="text-[20px] font-extrabold leading-[26px] outline-none">
                    Start from the {exampleRole} example
                  </h2>
                  <p className="mt-1.5 max-w-[560px] text-[14px] leading-[21px] text-[#c9c7d8]">
                    We&apos;ll copy its summary, experience and skills into a new resume with your name and email. Replace the sample details
                    with your own before you send it.
                  </p>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                  <button type="button" onClick={() => void handleCreate(exampleSlug)} disabled={creating} className={appBtnWhite}>
                    {creating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                    Use this example
                  </button>
                  <button
                    type="button"
                    onClick={() => setExampleSlug(null)}
                    disabled={creating}
                    className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! inline-flex min-h-11 items-center justify-center rounded-full px-4 text-[14px] font-semibold text-[#c9c7d8] transition-colors hover:bg-white/10 hover:text-white disabled:opacity-60"
                  >
                    Not now
                  </button>
                </div>
              </section>
            ) : null}

            <h1 className="mt-[18px] text-[34px] font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-[48px] sm:leading-[52px]">
              New resume. <span className="text-[#7c7a94]">Start from what you have.</span>
            </h1>
            {template ? (
              <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[13px] font-semibold text-[#4a4862]">
                <Check className="h-3.5 w-3.5 text-[#0b7a4f]" aria-hidden /> Template: {TEMPLATE_SPECS[template].label}
              </p>
            ) : null}

            <div className="mt-6 grid gap-4 sm:mt-8 lg:grid-cols-[1.2fr_1fr]">
              {/* IMPORT A FILE */}
              <section aria-labelledby="import-file" className="flex flex-col rounded-[24px] bg-[#5440e8] p-6 text-white sm:rounded-[28px] sm:p-7">
                <span aria-hidden="true" className={`${iconTile} bg-white text-[#5440e8]`}>
                  <Upload className="h-[22px] w-[22px]" strokeWidth={2} />
                </span>
                <h2 id="import-file" className="mt-[18px] text-[22px] font-extrabold">
                  Import your resume
                </h2>
                <p className="mt-1.5 text-[15px] leading-[23px] text-[#e4dfff]">
                  We read your PDF or Word file and fill in every section. You check what we found before you edit.
                </p>
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
                  className={`mt-5 flex min-h-[220px] flex-1 flex-col items-center justify-center rounded-[20px] border-2 border-dashed p-7 text-center transition-colors focus-visible:rounded-[20px]! focus-visible:outline-white! sm:min-h-[260px] ${
                    dragging ? "border-white bg-white/20" : "border-[#c9c0ff] bg-white/[0.08] hover:border-white hover:bg-white/[0.14]"
                  }`}
                >
                  <span aria-hidden="true" className="mb-3.5 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white text-[#5440e8]">
                    <UploadCloud className="h-7 w-7" strokeWidth={1.8} />
                  </span>
                  <span className="text-[18px] font-bold">
                    Drop a file or <span className="underline underline-offset-4">choose one</span>
                  </span>
                  <span className="mt-1 text-[13px] text-[#e4dfff]">PDF, DOC, DOCX · max 4 MB</span>
                </button>
              </section>

              <div className="flex flex-col gap-4">
                {/* LINKEDIN */}
                <section aria-labelledby="import-linkedin" className={card}>
                  <span aria-hidden="true" className={`${iconTile} bg-[#e4dfff] text-[#3a2bb8]`}>
                    <ClipboardPaste className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  </span>
                  <h2 id="import-linkedin" className="mt-[18px] text-[22px] font-extrabold">
                    Paste your LinkedIn
                  </h2>
                  <p className="mt-1.5 text-[15px] leading-[23px] text-[#4a4862]">
                    Copy your profile text and paste it — we&apos;ll split it into sections.
                  </p>
                  <form
                    className="mt-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      void importLinkedIn();
                    }}
                  >
                    <label htmlFor="linkedin-text" className="block text-[14px] font-semibold text-[#121226]">
                      LinkedIn profile text
                    </label>
                    <textarea
                      id="linkedin-text"
                      name="linkedinText"
                      rows={4}
                      maxLength={30000}
                      value={linkedinText}
                      onChange={(e) => {
                        setLinkedinText(e.target.value);
                        if (linkedinErr) setLinkedinErr(null);
                      }}
                      placeholder="Paste your LinkedIn profile text"
                      aria-describedby={linkedinErr ? "linkedin-err" : "linkedin-hint"}
                      aria-invalid={linkedinErr ? true : undefined}
                      className={`${appInput} mt-1.5 min-h-[96px] resize-y py-3 leading-6`}
                    />
                    {linkedinErr ? (
                      <p id="linkedin-err" role="alert" className="mt-2 text-[13px] font-medium text-[#b42318]">
                        {linkedinErr}
                      </p>
                    ) : (
                      <p id="linkedin-hint" className="mt-2 text-[13px] text-[#66647c]">
                        On your profile, select all the text from About to Skills and copy it.
                      </p>
                    )}
                    <button type="submit" disabled={busy || creating} className={`${appBtnSmDark} mt-3`}>
                      Import from LinkedIn
                    </button>
                  </form>
                </section>

                {/* BLANK */}
                <section aria-labelledby="start-blank" className={card}>
                  <span aria-hidden="true" className={`${iconTile} bg-[#e4dfff] text-[#3a2bb8]`}>
                    <FileText className="h-[22px] w-[22px]" strokeWidth={1.8} />
                  </span>
                  <h2 id="start-blank" className="mt-[18px] text-[22px] font-extrabold">
                    Start blank
                  </h2>
                  <p className="mt-1.5 text-[15px] leading-[23px] text-[#4a4862]">
                    Fill in each section with a live preview of the PDF. You can switch templates any time.
                  </p>
                  <button type="button" onClick={() => void handleCreate()} disabled={creating} className={`${appBtnSmDark} mt-4`}>
                    {creating && !exampleSlug ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                    Start blank
                  </button>
                </section>
              </div>
            </div>

            {createErr ? (
              <p role="alert" className="mt-4 rounded-2xl bg-[#fbe2e3] px-4 py-3 text-[14px] font-medium text-[#8f1d22]">
                {createErr}
              </p>
            ) : null}

            {/* EXAMPLES */}
            <section aria-labelledby="from-example" className={`${card} mt-4`}>
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 id="from-example" className="text-[22px] font-extrabold">
                    Or start from an example
                  </h2>
                  <p className="mt-1 text-[15px] text-[#4a4862]">A full resume for your role — swap in your details.</p>
                </div>
                <Link href="/resume-examples" className={appLink}>
                  All {examples.length} <span aria-hidden="true">&nbsp;→</span>
                </Link>
              </div>
              <ul className="mt-4 flex flex-wrap gap-2">
                {quick.map((e) => (
                  <li key={e.slug}>
                    <button
                      type="button"
                      onClick={() => pickExample(e.slug)}
                      aria-pressed={exampleSlug === e.slug}
                      className={`focus-visible:outline-[#5440e8]! focus-visible:rounded-full! min-h-11 rounded-full px-4 text-[14px] font-semibold transition-colors ${
                        exampleSlug === e.slug ? "bg-[#111118] text-white" : "bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]"
                      }`}
                    >
                      {e.role}
                    </button>
                  </li>
                ))}
              </ul>
            </section>
          </>
        ) : null}

        {busy ? (
          <div className="lc-card mx-auto mt-4 max-w-[560px] rounded-[28px] p-7 sm:mt-10 sm:p-9" role="status" aria-live="polite">
            <p className="flex items-center gap-2 truncate text-[14px] text-[#66647c]">
              {source === "linkedin" ? <ClipboardPaste className="h-4 w-4 shrink-0" aria-hidden /> : <FileText className="h-4 w-4 shrink-0" aria-hidden />}
              {fileName}
            </p>
            <h1 className="mt-3 text-[28px] font-extrabold tracking-[-0.03em]">Importing your resume…</h1>
            <ol className="mt-6 flex flex-col gap-3.5 text-[15px]">
              {[
                { k: "parsing", l: source === "linkedin" ? "Reading the text and finding each section" : "Reading the file and finding each section" },
                { k: "checking", l: "Saving it and checking for gaps" },
              ].map((s, i) => {
                const done = step === "checking" && i === 0;
                const active = step === s.k;
                return (
                  <li key={s.k} className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                        done ? "bg-[#5440e8] text-white" : active ? "bg-[#e4dfff] text-[#3a2bb8]" : "bg-[#f1eff8] text-[#66647c]"
                      }`}
                    >
                      {done ? <Check className="h-3.5 w-3.5" aria-hidden /> : active ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : i + 1}
                    </span>
                    <span className={active || done ? "font-semibold text-[#121226]" : "text-[#66647c]"}>{s.l}</span>
                  </li>
                );
              })}
            </ol>
            <p className="mt-6 text-[13px] text-[#66647c]">Usually 15–30 seconds.</p>
          </div>
        ) : null}

        {step === "error" ? (
          <div className="lc-card mx-auto mt-4 max-w-[560px] rounded-[28px] p-7 sm:mt-10 sm:p-9">
            <h1 className="text-[28px] font-extrabold leading-[1.15] tracking-[-0.03em]">
              {source === "linkedin" ? "We couldn't import that text" : "We couldn't import that file"}
            </h1>
            <p role="alert" className="mt-4 rounded-2xl bg-[#fbe2e3] px-4 py-3 text-[14px] font-medium text-[#8f1d22]">
              {uploadErr}
            </p>
            <p className="mt-4 text-[14px] leading-[1.55] text-[#4a4862]">
              {source === "linkedin"
                ? "Copy the whole profile page — About, Experience, Education and Skills — and paste it again."
                : "Scanned PDFs and files saved as images can't be read. If you have the Word version, try that."}
            </p>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              {source === "linkedin" ? (
                <button type="button" onClick={reset} className={appBtnPrimary}>
                  Try again
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    reset();
                    fileRef.current?.click();
                  }}
                  className={appBtnPrimary}
                >
                  Choose another file
                </button>
              )}
              <button type="button" onClick={() => void handleCreate()} disabled={creating} className={appBtnSoft}>
                {creating ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
                Start from a blank page
              </button>
            </div>
            {createErr ? (
              <p role="alert" className="mt-4 text-[14px] font-medium text-[#8f1d22]">
                {createErr}
              </p>
            ) : null}
          </div>
        ) : null}

        {step === "done" && resumeId ? (
          <div className="mx-auto max-w-[980px]">
            <p className="flex items-center gap-2 text-[18px] font-semibold tracking-[-0.01em] text-[#5440e8] sm:text-[20px]">
              <Check className="h-5 w-5" aria-hidden /> Imported
            </p>
            <h1 className="mt-3 text-[32px] font-extrabold leading-[1.08] tracking-[-0.04em] sm:text-[44px] sm:leading-[48px]">
              {jobs.length > 0 ? `We found ${jobs.length} ${jobs.length === 1 ? "job" : "jobs"}.` : "We read your resume."}{" "}
              <span className="text-[#7c7a94]">Check {jobs.length === 1 ? "it" : jobs.length > 1 ? "them" : "each section"} in the editor.</span>
            </h1>
            <p className="mt-2.5 text-[16px] leading-6 text-[#4a4862]">
              From {source === "linkedin" ? "your LinkedIn profile text" : <span className="break-all">{fileName}</span>}
              {found && foundLine(found) ? ` · ${foundLine(found)}.` : "."}
            </p>

            {jobs.length > 0 ? (
              <ul className="mt-6 flex flex-col gap-2.5">
                {jobs.map((j, i) => (
                  <li key={i} className="lc-card grid grid-cols-[auto_1fr_auto] items-center gap-3.5 rounded-[22px] px-4 py-4 sm:gap-[18px] sm:px-[22px] sm:py-5">
                    <span aria-hidden="true" className="inline-flex h-6 w-6 items-center justify-center rounded-[7px] bg-[#5440e8] text-white">
                      <Check className="h-4 w-4" strokeWidth={2.6} />
                    </span>
                    <span className="min-w-0">
                      <b className="text-[16px] sm:text-[17px]">{j.role || "Untitled role"}</b>
                      {j.company ? <span className="text-[#4a4862]"> · {j.company}</span> : null}
                      <span className="mt-[3px] block text-[13px] text-[#66647c]">
                        {[j.dates, `${j.bullets} ${j.bullets === 1 ? "bullet" : "bullets"}`].filter(Boolean).join(" · ")}
                      </span>
                    </span>
                    <Link href={`/resume/${resumeId}/edit`} className={appLink}>
                      Edit<span className="sr-only"> {j.role || "this job"}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            ) : null}

            {issues.length > 0 ? (
              <section aria-labelledby="fix-first" className="mt-5 rounded-[22px] bg-white">
                <h2 id="fix-first" className="flex items-center gap-2.5 border-b border-[#e2e0ea] px-5 py-4 text-[17px] font-extrabold sm:px-6">
                  <AlertTriangle className="h-[18px] w-[18px] text-[#a15c00]" aria-hidden /> What to fix first
                  <span className="text-[14px] font-semibold text-[#66647c]">· {issues.length}</span>
                </h2>
                <ul className="divide-y divide-[#e2e0ea]">
                  {issues.map((i) => (
                    <li key={i.message} className="flex flex-col gap-2 px-5 py-4 sm:flex-row sm:items-start sm:justify-between sm:gap-4 sm:px-6">
                      <div className="min-w-0">
                        <p className="text-[15px] font-semibold">
                          <span className="text-[#66647c]">{i.area} · </span>
                          {i.message}
                        </p>
                        <p className="mt-1 text-[14px] leading-[1.55] text-[#4a4862]">{i.fix}</p>
                      </div>
                      <span className={`${badge} self-start ${SEVERITY[i.severity].cls}`}>
                        <span className="sr-only">Priority: </span>
                        {SEVERITY[i.severity].label}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : (
              <p className="mt-5 rounded-[18px] bg-[#dcf5ea] px-[18px] py-3.5 text-[14px] font-medium text-[#0b4f35]">
                Nothing obvious is missing. Check each section in the editor.
              </p>
            )}

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <section aria-labelledby="skills-found" className="rounded-[22px] bg-white p-6">
                <h2 id="skills-found" className="text-[17px] font-extrabold">
                  Skills we found
                </h2>
                {skills.length > 0 ? (
                  <ul className="mt-3 flex flex-wrap gap-2">
                    {skills.map((s) => (
                      <li key={s} className="rounded-full bg-[#f1eff8] px-3 py-1.5 text-[13px] font-semibold text-[#121226]">
                        {s}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-[14px] text-[#4a4862]">None yet — add them in the editor&apos;s Skills step.</p>
                )}
              </section>

              {fit ? (
                <section aria-labelledby="fit-score" className="rounded-[22px] bg-white p-6">
                  <h2 id="fit-score" className="flex items-center justify-between gap-3 text-[17px] font-extrabold">
                    Role-fit score
                    <span className={`${badge} text-[14px]!`} style={{ background: scoreTone(fit.score).bg, color: scoreTone(fit.score).fg }}>
                      {fit.score}
                    </span>
                  </h2>
                  {fit.fixes.length > 0 ? (
                    <ul className="mt-3 list-disc space-y-1.5 pl-5 text-[14px] leading-[1.55] text-[#4a4862]">
                      {fit.fixes.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                  ) : null}
                </section>
              ) : (
                <section aria-labelledby="aim-job" className="rounded-[22px] bg-white p-6">
                  <h2 id="aim-job" className="text-[17px] font-extrabold">
                    Next, aim it at a job
                  </h2>
                  <p className="mt-1 text-[14px] leading-[1.55] text-[#4a4862]">
                    Paste a job post to see which of its keywords your resume already covers.
                  </p>
                  <Link href={`/resume/${resumeId}/jd`} className={`${appLink} mt-2 gap-1.5`}>
                    Match to a job <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                  </Link>
                </section>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={reset}
                className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-3 text-[15px] font-bold text-[#4a4862] transition-colors hover:bg-white hover:text-[#121226] sm:justify-start"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> {source === "linkedin" ? "Import something else" : "Import a different file"}
              </button>
              <Link href={`/resume/${resumeId}/edit`} className={appBtnPrimary}>
                Open in editor <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
          </div>
        ) : null}
      </main>

      <ExperienceReviewModal open={surveyOpen} onClose={() => setSurveyOpen(false)} context="upload_diagnostic" />
    </div>
  );
}
