"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check, Clock, FileText, ClipboardPaste, Loader2, Upload, UploadCloud } from "lucide-react";
import { ExperienceReviewModal } from "@/components/experience-review-modal";
import { SiteMark } from "@/components/site/brand";
import { appBtnPrimary, appBtnSmDark, appBtnSoft, appBtnWhite, appInput, appLink } from "@/components/app/shell/ui";
import { siteFontVars } from "@/lib/site-fonts";
import { shouldOfferSatisfactionSurvey } from "@/lib/satisfaction-survey";
import { TEMPLATE_SPECS, TEMPLATE_STYLES, type TemplateStyle } from "@/lib/resume-templates";

type ImportedJob = {
  id?: string;
  role?: string;
  company?: string;
  start?: string;
  end?: string;
  location?: string;
  bullets?: unknown[];
};
type ImportedContent = {
  summary?: string;
  skills?: string[];
  experience?: ImportedJob[];
  education?: unknown[];
  contact?: { fullName?: string; email?: string; phone?: string };
};
/** A job on the review screen: what the parser found, whether it's ticked, and the user's fixes. */
type ReviewJob = { key: string; include: boolean; role: string; company: string; start: string; end: string; bullets: number; source: ImportedJob };
/** From the import API: dates the parser normalized from text that could be read more than one way. */
type DateReading = { index: number; raw: string; start: string; end: string };
type Example = { slug: string; role: string; vertical: string };

const LINKEDIN_MIN = 50;

/** "contact details, 1 education entry and 14 skills were also found" (lowercase, no period), or "". */
function foundLine(c: ImportedContent): string {
  const contact = !!(c.contact?.email || c.contact?.phone);
  const education = (c.education ?? []).length;
  const skills = (c.skills ?? []).length;
  const parts: string[] = [];
  if (contact) parts.push("contact details");
  if (education > 0) parts.push(`${education} education ${education === 1 ? "entry" : "entries"}`);
  if (skills > 0) parts.push(`${skills} ${skills === 1 ? "skill" : "skills"}`);
  if (parts.length === 0) return "";
  const list = parts.length === 1 ? parts[0] : `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]}`;
  const singular = parts.length === 1 && !contact && (education === 1 || skills === 1);
  return `${list} ${singular ? "was" : "were"} also found`;
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

function readParam(name: string) {
  return new URLSearchParams(window.location.search).get(name);
}

export function NewResumeClient({
  examples,
  quick,
  target,
  defaultVertical,
}: {
  examples: Example[];
  quick: Example[];
  /** The role picked during onboarding, if any. */
  target: Example | null;
  /** Vertical for blank and imported resumes (from the onboarding role; "software" otherwise). */
  defaultVertical: string;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const exampleRef = useRef<HTMLHeadingElement>(null);
  const reviewHeadingRef = useRef<HTMLHeadingElement>(null);
  const [creating, setCreating] = useState(false);
  const [createErr, setCreateErr] = useState<string | null>(null);
  const [step, setStep] = useState<"idle" | "parsing" | "review" | "error">("idle");
  const [uploadErr, setUploadErr] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [source, setSource] = useState<"file" | "linkedin">("file");
  const [dragging, setDragging] = useState(false);
  /** Parsed but not saved: nothing reaches the database until the user confirms the review. */
  const [imported, setImported] = useState<{ content: ImportedContent; title: string } | null>(null);
  const [reviewJobs, setReviewJobs] = useState<ReviewJob[]>([]);
  const [dateReadings, setDateReadings] = useState<DateReading[]>([]);
  const [editingJob, setEditingJob] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saveErr, setSaveErr] = useState<string | null>(null);
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
    if (step !== "review" || !shouldOfferSatisfactionSurvey()) return undefined;
    const t = setTimeout(() => setSurveyOpen(true), 12000);
    return () => clearTimeout(t);
  }, [step]);

  // Move focus to the review heading so screen readers start from "We found N jobs".
  useEffect(() => {
    if (step === "review") reviewHeadingRef.current?.focus();
  }, [step]);

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
    const vertical = (example && examples.find((e) => e.slug === example)?.vertical) || defaultVertical;
    const r = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "New resume", vertical, regionMode: "us", ...(example ? { example } : {}) }),
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

  /** Shared pipeline for both sources: parse, then show the review. Saving waits for the user's confirmation. */
  async function runImport(opts: {
    label: string;
    parse: () => Promise<Response>;
    readErr: string;
    title: (content: ImportedContent) => string;
  }) {
    setFileName(opts.label);
    setStep("parsing");
    setUploadErr(null);
    setSaveErr(null);

    const parseRes = await opts.parse().catch(() => null);
    const parseJ = parseRes ? await parseRes.json().catch(() => ({})) : {};
    if (!parseRes?.ok || !parseJ.content || typeof parseJ.content !== "object") {
      setStep("error");
      setUploadErr(typeof parseJ.error === "string" ? parseJ.error : opts.readErr);
      return;
    }

    const content = parseJ.content as ImportedContent;
    const jobs = Array.isArray(content.experience) ? content.experience : [];
    setImported({ content, title: opts.title(content) });
    setReviewJobs(
      jobs.map((j, i) => ({
        key: `${i}-${str(j.id)}`,
        include: true,
        role: str(j.role),
        company: str(j.company),
        start: str(j.start),
        end: str(j.end),
        bullets: Array.isArray(j.bullets) ? j.bullets.length : 0,
        source: j,
      })),
    );
    setDateReadings(
      Array.isArray(parseJ.dateReadings)
        ? (parseJ.dateReadings as DateReading[]).filter((d) => d && typeof d.index === "number" && typeof d.raw === "string" && d.index < jobs.length)
        : [],
    );
    setEditingJob(null);
    setStep("review");
  }

  /** Creates the resume with only the ticked jobs, then opens it. */
  async function confirmImport() {
    if (!imported || saving) return;
    setSaving(true);
    setSaveErr(null);
    const content = {
      ...imported.content,
      experience: reviewJobs
        .filter((j) => j.include)
        .map((j) => ({ ...j.source, role: j.role, company: j.company, start: j.start, end: j.end })),
    };
    const failed = `We read your ${source === "linkedin" ? "profile" : "file"} but couldn't save the resume. Please try again.`;
    const createRes = await fetch("/api/resumes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: imported.title.slice(0, 200) || "Imported resume", vertical: defaultVertical, regionMode: "us" }),
    }).catch(() => null);
    const createJ = createRes ? await createRes.json().catch(() => ({})) : {};
    if (!createRes?.ok || !createJ.id) {
      setSaving(false);
      setSaveErr(failed);
      return;
    }
    const patchRes = await fetch(`/api/resumes/${createJ.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    }).catch(() => null);
    if (!patchRes?.ok) {
      // Don't leave an empty resume behind.
      await fetch(`/api/resumes/${createJ.id}`, { method: "DELETE" }).catch(() => null);
      setSaving(false);
      setSaveErr(failed);
      return;
    }
    rememberTemplate(createJ.id);
    window.location.href = `/resume/${createJ.id}/edit`;
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

  /** Back to the start. Nothing was saved yet, so there is nothing to clean up. */
  const reset = () => {
    setStep("idle");
    setUploadErr(null);
    setSaveErr(null);
    setFileName("");
    setImported(null);
    setReviewJobs([]);
    setDateReadings([]);
    setEditingJob(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  function setJob(key: string, patch: Partial<ReviewJob>) {
    setReviewJobs((js) => js.map((j) => (j.key === key ? { ...j, ...patch } : j)));
  }

  function pickExample(slug: string) {
    setExampleSlug(slug);
    setCreateErr(null);
    requestAnimationFrame(() => {
      exampleRef.current?.scrollIntoView({ block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      exampleRef.current?.focus({ preventScroll: true });
    });
  }

  const busy = step === "parsing";
  const card = "rounded-[24px] bg-white p-6 sm:rounded-[28px] sm:p-7";
  const iconTile = "inline-flex h-12 w-12 items-center justify-center rounded-2xl";
  const included = reviewJobs.filter((j) => j.include).length;
  const datesToCheck = dateReadings.filter((d) => {
    const j = reviewJobs[d.index];
    // Once the user has changed the dates themselves, the note has done its job.
    return j && j.start === d.start && j.end === d.end;
  });

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
          Cancel
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
                    {creating ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden /> : null}
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
                  <span className="mt-1 text-[13px] text-white">PDF, DOC, DOCX · max 4 MB</span>
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
                    {creating && !exampleSlug ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden /> : null}
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
                  <p className="mt-1 text-[15px] text-[#4a4862]">
                    {target
                      ? `A full resume for ${target.role} and related roles — swap in your details.`
                      : "A full resume for your role — swap in your details."}
                  </p>
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
                { k: "review", l: "You check what we found before it's added" },
              ].map((s, i) => {
                const active = step === s.k;
                return (
                  <li key={s.k} className="flex items-center gap-3">
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold ${
                        active ? "bg-[#e4dfff] text-[#3a2bb8]" : "bg-[#f1eff8] text-[#66647c]"
                      }`}
                    >
                      {active ? <Loader2 className="h-3.5 w-3.5 motion-safe:animate-spin" aria-hidden /> : i + 1}
                    </span>
                    <span className={active ? "font-semibold text-[#121226]" : "text-[#66647c]"}>{s.l}</span>
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
                {creating ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden /> : null}
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

        {step === "review" && imported ? (
          <div className="mx-auto max-w-[980px] lg:pt-2">
            <p className="text-[18px] font-semibold tracking-[-0.01em] text-[#5440e8] sm:text-[20px]">/ Import · step 2 of 2</p>
            <h1 ref={reviewHeadingRef} tabIndex={-1} className="mt-3 text-[32px] font-extrabold leading-[1.08] tracking-[-0.04em] outline-none sm:text-[44px] sm:leading-[48px]">
              {reviewJobs.length > 0 ? `We found ${reviewJobs.length} ${reviewJobs.length === 1 ? "job" : "jobs"}.` : "We read your resume."}{" "}
              <span className="text-[#7c7a94]">
                {reviewJobs.length > 0 ? `Check ${reviewJobs.length === 1 ? "it" : "them"} before they’re added.` : "Check it in the editor."}
              </span>
            </h1>
            <p className="mt-2.5 text-[16px] leading-6 text-[#4a4862]">
              From {source === "linkedin" ? "your LinkedIn profile text" : <span className="break-all">{fileName}</span>}
              {foundLine(imported.content) ? ` · ${foundLine(imported.content)}.` : "."}
            </p>

            {reviewJobs.length > 0 ? (
              <fieldset className="mt-6">
                <legend className="sr-only">Jobs to add to your resume</legend>
                <ul className="flex flex-col gap-2.5">
                  {reviewJobs.map((j) => {
                    const id = `job-${j.key}`;
                    const name = j.role || j.company || "Untitled role";
                    const editing = editingJob === j.key;
                    const dates = [j.start, j.end].filter(Boolean).join(" – ");
                    return (
                      <li
                        key={j.key}
                        className={`rounded-[22px] px-4 py-4 transition-colors sm:px-[22px] sm:py-5 ${j.include ? "lc-card" : "bg-[#f7f6fb]"}`}
                      >
                        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3.5 sm:gap-[18px]">
                          <span className="relative inline-flex h-6 w-6">
                            <input
                              id={id}
                              type="checkbox"
                              checked={j.include}
                              onChange={(e) => setJob(j.key, { include: e.target.checked })}
                              className="peer absolute inset-0 m-0 h-6 w-6 cursor-pointer opacity-0"
                            />
                            <span
                              aria-hidden="true"
                              className={`pointer-events-none inline-flex h-6 w-6 items-center justify-center rounded-[7px] peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#5440e8] ${
                                j.include ? "bg-[#5440e8] text-white" : "border-2 border-[#c9c7d8] bg-white"
                              }`}
                            >
                              {j.include ? <Check className="h-3.5 w-3.5" strokeWidth={3} /> : null}
                            </span>
                          </span>
                          <label htmlFor={id} className="min-w-0 cursor-pointer">
                            <b className={`text-[16px] sm:text-[17px] ${j.include ? "" : "text-[#4a4862]"}`}>{j.role || "Untitled role"}</b>
                            {j.company ? <span className="text-[#4a4862]"> · {j.company}</span> : null}
                            <span className="mt-[3px] block text-[13px] text-[#66647c]">
                              {[dates, `${j.bullets} ${j.bullets === 1 ? "bullet" : "bullets"}`].filter(Boolean).join(" · ")}
                              {j.include ? null : <span className="sr-only"> — won’t be added</span>}
                            </span>
                          </label>
                          <button
                            type="button"
                            aria-expanded={editing}
                            aria-controls={`${id}-edit`}
                            onClick={() => setEditingJob(editing ? null : j.key)}
                            className={`${appLink} rounded-full px-1`}
                          >
                            {editing ? "Done" : "Edit"}
                            <span className="sr-only"> {name}</span>
                          </button>
                        </div>
                        {editing ? (
                          <div id={`${id}-edit`} className="mt-4 grid gap-3 sm:grid-cols-2">
                            {(
                              [
                                ["role", "Job title"],
                                ["company", "Company"],
                                ["start", "Start"],
                                ["end", "End"],
                              ] as const
                            ).map(([k, label]) => (
                              <label key={k} className="block text-[13px] font-bold text-[#4a4862]">
                                {label}
                                <input
                                  value={j[k]}
                                  onChange={(e) => setJob(j.key, { [k]: e.target.value })}
                                  placeholder={k === "start" ? "May 2022" : k === "end" ? "Present" : undefined}
                                  className={`${appInput} mt-1.5 h-12 font-normal`}
                                />
                              </label>
                            ))}
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            ) : null}

            {datesToCheck.length > 0 ? (
              <ul className="mt-3.5 flex flex-col gap-2 rounded-[18px] bg-[#fdf0d5] px-[18px] py-3.5 text-[14px] text-[#7a4600]">
                {datesToCheck.map((d) => {
                  const j = reviewJobs[d.index];
                  return (
                    <li key={d.index} className="flex items-start gap-3">
                      <Clock className="mt-px h-[18px] w-[18px] shrink-0" strokeWidth={1.8} aria-hidden />
                      <span>
                        {datesToCheck.length > 1 ? <b>{j.role || j.company || "A job"}: </b> : null}“{d.raw}” was read as{" "}
                        <b>{[d.start, d.end].filter(Boolean).join(" – ")}</b>. Check the dates look right.
                      </span>
                    </li>
                  );
                })}
              </ul>
            ) : null}

            {saveErr ? (
              <p role="alert" className="mt-4 rounded-2xl bg-[#fbe2e3] px-4 py-3 text-[14px] font-medium text-[#8f1d22]">
                {saveErr}
              </p>
            ) : null}

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
              <button
                type="button"
                onClick={reset}
                disabled={saving}
                className="focus-visible:outline-[#5440e8]! focus-visible:rounded-full! inline-flex min-h-11 items-center justify-center gap-1.5 rounded-full px-3 text-[15px] font-bold text-[#4a4862] transition-colors hover:bg-white hover:text-[#121226] disabled:opacity-60 sm:-ml-3 sm:justify-start"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden /> {source === "linkedin" ? "Import something else" : "Import a different file"}
              </button>
              <button type="button" onClick={() => void confirmImport()} disabled={saving} className={appBtnPrimary}>
                {saving ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden /> : null}
                {reviewJobs.length === 0 || included === 0
                  ? "Open the editor"
                  : `Add ${included} ${included === 1 ? "job" : "jobs"} and open the editor`}
              </button>
            </div>
            <p className="sr-only" aria-live="polite">
              {saving ? "Saving your resume…" : `${included} of ${reviewJobs.length} jobs selected.`}
            </p>
          </div>
        ) : null}
      </main>

      <ExperienceReviewModal open={surveyOpen} onClose={() => setSurveyOpen(false)} context="upload_diagnostic" />
    </div>
  );
}
