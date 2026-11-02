"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import Link from "next/link";
import type { ResumeContent } from "@/types/resume";
import { ResumePreview, type TemplateStyle } from "@/components/resume-preview";
import { TEMPLATE_SPECS, TEMPLATE_STYLES, parseTemplate } from "@/lib/resume-templates";
import { VoiceInput } from "@/components/voice-input";
import { ExperienceReviewModal } from "@/components/experience-review-modal";
import { shouldOfferSatisfactionSurvey } from "@/lib/satisfaction-survey";
import { siteFontVars } from "@/lib/site-fonts";
import {
  Award, Loader2, Check, MessageSquare, Plus, ShieldCheck, Sparkles, Trash2, UploadCloud, X, Download,
  Briefcase, GraduationCap, Wrench, ChevronRight, ChevronLeft, ChevronUp, ArrowLeft,
} from "lucide-react";

function uid() { return crypto.randomUUID(); }

function calculateLocalScore(c: ResumeContent): number {
  let score = 0;
  if (c.contact.fullName) score += 8;
  if (c.contact.email) score += 8;
  if (c.contact.phone) score += 5;
  if (c.contact.location) score += 4;
  if ((c.contact.links ?? []).length > 0) score += 5;
  if (c.headline && c.headline.length > 5) score += 8;
  if (c.summary && c.summary.length > 30) score += 10;
  if (c.summary && c.summary.length > 100) score += 5;
  score += Math.min(20, c.experience.length * 7);
  const bulletCount = c.experience.reduce((s, e) => s + e.bullets.length, 0);
  score += Math.min(12, bulletCount * 2);
  const hasMetrics = c.experience.some((e) => e.bullets.some((b) => /\d/.test(b.text)));
  if (hasMetrics) score += 8;
  if (c.education.length > 0) score += 7;
  score += Math.min(10, Math.floor(c.skills.length / 2));
  return Math.min(100, score);
}

function generateLocalFixes(c: ResumeContent): string[] {
  const fixes: string[] = [];
  if (!c.summary || c.summary.length < 30) fixes.push("Add a professional summary (at least 2-3 sentences).");
  if (c.skills.length < 8) fixes.push(`Add more skills — you have ${c.skills.length}, aim for 8-15.`);
  if (c.experience.length === 0) fixes.push("Add your work experience with specific achievements.");
  const bulletCount = c.experience.reduce((s, e) => s + e.bullets.length, 0);
  if (bulletCount < 5) fixes.push("Add more achievement bullets to your experience entries.");
  const hasMetrics = c.experience.some((e) => e.bullets.some((b) => /\d/.test(b.text)));
  if (!hasMetrics) fixes.push("Include quantifiable metrics in your bullets (numbers, percentages, revenue).");
  if (!c.contact.phone) fixes.push("Add a phone number to your contact information.");
  if ((c.contact.links ?? []).length === 0) fixes.push("Add a LinkedIn profile or portfolio link.");
  if (c.education.length === 0) fixes.push("Add your educational background.");
  return fixes.slice(0, 6);
}

/** Editor sections, in the order of the side navigation and the Back / Next steps. */
const TABS = [
  { key: "details", label: "Contact details", short: "Contact", title: "Contact details", subtitle: "The top of your resume — how a recruiter reaches you." },
  { key: "shortbio", label: "Summary", short: "Summary", title: "Summary and headline", subtitle: "A strong summary is the first thing recruiters read." },
  { key: "experience", label: "Experience", short: "Experience", title: "Experience", subtitle: "Add your work history, most recent first." },
  { key: "education", label: "Education", short: "Education", title: "Education", subtitle: "Degrees, universities, bootcamps." },
  { key: "skills", label: "Skills", short: "Skills", title: "Skills", subtitle: "Skills are auto-grouped. Select × to remove a skill." },
  { key: "certifications", label: "Certifications", short: "Certifications", title: "Certifications & licenses", subtitle: "Professional certifications, courses, licenses." },
  { key: "achievements", label: "Achievements", short: "Achievements", title: "Achievements & awards", subtitle: "Honors, scholarships, competitions, notable results." },
  { key: "recommendations", label: "Recommendations", short: "Recommendations", title: "Recommendations", subtitle: "References or recommendation letters from colleagues." },
] as const;
type TabKey = (typeof TABS)[number]["key"];

/* ── v5 style tokens (see components/site/ui.tsx and auth-layout.tsx) ── */

/** Hover lift for buttons; the movement only runs when the user allows motion. */
const lift =
  "transition-[background-color,box-shadow,transform,color] duration-200 motion-safe:hover:-translate-y-0.5 hover:shadow-[0_14px_28px_-14px_rgba(36,24,120,0.55)] active:translate-y-0";
const pill = `${lift} inline-flex min-h-11 items-center justify-center gap-2 rounded-full px-4 text-[14px] font-semibold sm:min-h-10 disabled:pointer-events-none disabled:opacity-60`;
const btnSoftSm = `${pill} bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]`;
const btnDarkSm = `${pill} bg-[#111118] text-white hover:bg-[#2a2940]`;
const btnPrimarySm = `${pill} bg-[#5440e8] text-white hover:bg-[#4430d6]`;
const textBtn =
  "inline-flex min-h-11 items-center gap-1.5 rounded-full text-[14px] font-bold text-[#5440e8] transition-colors hover:text-[#3a2bb8]";
const dashedBtn =
  "flex min-h-12 w-full items-center justify-center gap-2 rounded-[18px] border-2 border-dashed border-[#c9c0ff] px-4 text-[14px] font-bold text-[#3a2bb8] transition-colors hover:border-[#5440e8] hover:bg-[#f7f6fb]";
const iconBtn =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#66647c] transition-colors hover:bg-[#fbe2e3] hover:text-[#c42b30]";

const labelCls = "block text-[13px] font-bold text-[#4a4862]";
const hintCls = "font-normal text-[#66647c]";
/** 48px tall; 16px text on phones (no iOS zoom). Focus swaps the global outline for a border + ring. */
const inputCls =
  "mt-1.5 block h-12 w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white px-4 text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! focus-visible:rounded-[14px]! sm:text-[15px]";
const textareaCls =
  "mt-1.5 block min-h-[110px] w-full rounded-[14px] border-[1.5px] border-[#e2e0ea] bg-white px-4 py-3 text-[16px] leading-6 text-[#121226] outline-none transition-[border-color,box-shadow] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! focus-visible:rounded-[14px]! sm:text-[15px]";

function Field({ label, hint, help, className = "", children }: {
  label: string; hint?: string; help?: string; className?: string; children: ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className={labelCls}>
        {label}
        {hint ? <span className={hintCls}> · {hint}</span> : null}
      </span>
      {children}
      {help ? <span className="mt-1.5 block text-[13px] text-[#66647c]">{help}</span> : null}
    </label>
  );
}

function ScoreRing({ value, size, label }: { value: number; size: number; label: string }) {
  const r = 44;
  const circ = 2 * Math.PI * r;
  const color = value >= 70 ? "#22b07d" : value >= 40 ? "#b87300" : "#c42b30";
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" role="img" aria-label={label} className="shrink-0">
      <circle cx="50" cy="50" r={r} fill="none" stroke="#efedf7" strokeWidth="12" />
      <circle
        cx="50" cy="50" r={r} fill="none" stroke={color} strokeWidth="12" strokeLinecap="round"
        strokeDasharray={`${(circ * Math.max(0, Math.min(100, value))) / 100} ${circ}`}
        transform="rotate(-90 50 50)"
        className="motion-safe:transition-[stroke-dasharray] motion-safe:duration-1000"
      />
      <text x="50" y="59" textAnchor="middle" fontSize="28" fontWeight="700" fill="#121226" fontFamily="var(--font-figtree), sans-serif">
        {value}
      </text>
    </svg>
  );
}

function CheckDot({ done }: { done: boolean }) {
  return done ? (
    <span className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#22b07d]">
      <Check className="h-[11px] w-[11px] text-white" strokeWidth={3} aria-hidden="true" />
      <span className="sr-only">(done)</span>
    </span>
  ) : (
    <span className="inline-flex h-[18px] w-[18px] shrink-0 rounded-full border-[1.5px] border-[#c9c7d8]">
      <span className="sr-only">(not started)</span>
    </span>
  );
}

export function ResumeEditor({ resumeId, initialTitle, initialVertical, initialRegion, initialContent }: {
  resumeId: string; initialTitle: string; initialVertical: string; initialRegion: string; initialContent: ResumeContent;
}) {
  const [title] = useState(initialTitle);
  const [vertical] = useState(initialVertical);
  const [regionMode] = useState(initialRegion);
  const [content, setContent] = useState<ResumeContent>(initialContent);
  const [saving, setSaving] = useState(false);
  const [justSaved, setJustSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<TabKey>("details");
  const [newSkill, setNewSkill] = useState("");
  const [, setShowSkillInput] = useState(false);
  const skillInputRef = useRef<HTMLInputElement | null>(null);
  // Remembered per resume in this browser; sent with every PDF export.
  const [template, setTemplateState] = useState<TemplateStyle>("classic");
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(`lcv_tpl_${resumeId}`);
    } catch {
      // storage unavailable
    }
    if (saved) setTemplateState(parseTemplate(saved));
  }, [resumeId]);
  function setTemplate(t: TemplateStyle) {
    setTemplateState(t);
    try {
      window.localStorage.setItem(`lcv_tpl_${resumeId}`, t);
    } catch {
      // storage unavailable — the choice still applies for this session
    }
  }
  const [previewFlipped, setPreviewFlipped] = useState(false);
  /** Below the 3-column breakpoint the form and the preview share the screen via an Edit / Preview toggle. */
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  /** Experience entry shown expanded; undefined = the first one, null = all collapsed. */
  const [openExpId, setOpenExpId] = useState<string | null | undefined>(undefined);
  const [liveScore, setLiveScore] = useState<{ score: number; fixes: string[] } | null>(null);
  const [scoringBusy, setScoringBusy] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState<{ message: string; upgrade: boolean } | null>(null);
  const [enhanceResult, setEnhanceResult] = useState<Array<{ experienceId: string; bulletId: string; original: string; improved: string; change_summary: string }> | null>(null);
  const [showOverwrite, setShowOverwrite] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importErr, setImportErr] = useState<string | null>(null);
  const [linkedinText, setLinkedinText] = useState("");
  const [linkedinImporting, setLinkedinImporting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const surveyDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [surveyContext, setSurveyContext] = useState("pdf_export");

  const payload = useMemo(() => ({ title, vertical, regionMode, content }), [title, vertical, regionMode, content]);

  const doSave = useCallback(async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error ?? "Save error"); }
      setJustSaved(true);
      if (savedTimer.current) clearTimeout(savedTimer.current);
      savedTimer.current = setTimeout(() => setJustSaved(false), 2000);
    } catch (e) { setError(e instanceof Error ? e.message : "Error"); }
    finally { setSaving(false); }
  }, [payload, resumeId]);

  useEffect(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => void doSave(), 1500);
    return () => { if (timer.current) clearTimeout(timer.current); };
  }, [payload, doSave]);

  useEffect(() => () => {
    if (surveyDelayRef.current) clearTimeout(surveyDelayRef.current);
  }, []);

  // Escape closes the import dialog.
  useEffect(() => {
    if (!showOverwrite) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") setShowOverwrite(false); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [showOverwrite]);

  function onPdfExportClick() {
    window.open(`/api/resumes/${resumeId}/pdf?template=${template}`, "_blank", "noopener,noreferrer");
    if (!shouldOfferSatisfactionSurvey()) return;
    if (surveyDelayRef.current != null) return;
    setSurveyContext("pdf_export");
    surveyDelayRef.current = setTimeout(() => {
      surveyDelayRef.current = null;
      setSurveyOpen(true);
    }, 2200);
  }

  const addExp = () => {
    const id = uid();
    setContent((c) => ({ ...c, experience: [...c.experience, { id, company: "", role: "", start: "", end: "", location: "", bullets: [] }] }));
    setOpenExpId(id);
  };
  const addBullet = (expId: string) => setContent((c) => ({ ...c, experience: c.experience.map((ex) => ex.id === expId ? { ...ex, bullets: [...ex.bullets, { id: uid(), text: "", evidenceIds: [] }] } : ex) }));
  const delExp = (id: string) => setContent((c) => ({ ...c, experience: c.experience.filter((x) => x.id !== id) }));
  const addEdu = () => setContent((c) => ({ ...c, education: [...c.education, { id: uid(), school: "", degree: "", start: "", end: "", gpa: "", achievements: [] }] }));
  const delEdu = (id: string) => setContent((c) => ({ ...c, education: c.education.filter((x) => x.id !== id) }));
  const addCert = () => setContent((c) => ({ ...c, certifications: [...(c.certifications ?? []), { id: uid(), name: "", issuer: "", date: "", url: "" }] }));
  const delCert = (id: string) => setContent((c) => ({ ...c, certifications: (c.certifications ?? []).filter((x) => x.id !== id) }));
  const addAchievement = () => setContent((c) => ({ ...c, achievements: [...(c.achievements ?? []), { id: uid(), title: "", description: "", date: "" }] }));
  const delAchievement = (id: string) => setContent((c) => ({ ...c, achievements: (c.achievements ?? []).filter((x) => x.id !== id) }));
  const addRec = () => setContent((c) => ({ ...c, recommendations: [...(c.recommendations ?? []), { id: uid(), recommenderName: "", recommenderRole: "", company: "", relationship: "", text: "" }] }));
  const delRec = (id: string) => setContent((c) => ({ ...c, recommendations: (c.recommendations ?? []).filter((x) => x.id !== id) }));

  const activeTabIdx = TABS.findIndex((t) => t.key === activeTab);
  const activeMeta = TABS[activeTabIdx];

  function goToTab(key: TabKey) {
    setActiveTab(key);
    setMobileView("edit");
  }
  function nextTab() {
    const idx = TABS.findIndex((t) => t.key === activeTab);
    if (idx < TABS.length - 1) setActiveTab(TABS[idx + 1].key);
  }
  function prevTab() {
    const idx = TABS.findIndex((t) => t.key === activeTab);
    if (idx > 0) setActiveTab(TABS[idx - 1].key);
  }

  function addSkillToList() {
    if (!newSkill.trim()) return;
    setContent((c) => ({ ...c, skills: [...c.skills, newSkill.trim()] }));
    setNewSkill("");
  }
  function removeSkill(s: string) { setContent((c) => ({ ...c, skills: c.skills.filter((x) => x !== s) })); }

  const industrySkills = content.skills.slice(0, Math.ceil(content.skills.length / 3));
  const toolsSkills = content.skills.slice(Math.ceil(content.skills.length / 3), Math.ceil((content.skills.length * 2) / 3));
  const otherSkills = content.skills.slice(Math.ceil((content.skills.length * 2) / 3));

  /** Which sections already hold the user's content (drives the check marks in the section nav). */
  const sectionDone: Record<TabKey, boolean> = {
    details: Boolean(content.contact.fullName.trim() && content.contact.email.trim()),
    shortbio: content.summary.trim().length > 0,
    experience: content.experience.length > 0,
    education: content.education.length > 0,
    skills: content.skills.length > 0,
    certifications: (content.certifications ?? []).length > 0,
    achievements: (content.achievements ?? []).length > 0,
    recommendations: (content.recommendations ?? []).length > 0,
  };
  const sectionsDoneCount = TABS.filter((t) => sectionDone[t.key]).length;

  const checklist = [
    { label: "Contact info", done: !!(content.contact.email && content.contact.phone) },
    { label: "Professional summary", done: content.summary.length > 30 },
    { label: "Work experience", done: content.experience.length > 0 },
    { label: "Education", done: content.education.length > 0 },
    { label: "Skills (8+)", done: content.skills.length >= 8 },
    { label: "Quantified bullets", done: content.experience.some((e) => e.bullets.some((b) => /\d/.test(b.text))) },
  ];
  const completeness = Math.round((checklist.filter((i) => i.done).length / checklist.length) * 100);

  async function scoreResume() {
    try {
      const r = await fetch("/api/ai/role-fit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeId }) });
      const j = await r.json().catch(() => ({}));
      if (r.ok && j.result) {
        setLiveScore({ score: j.result.overall ?? 0, fixes: j.result.prioritized_fixes ?? [] });
      } else {
        setLiveScore({ score: calculateLocalScore(content), fixes: generateLocalFixes(content) });
      }
    } catch {
      setLiveScore({ score: calculateLocalScore(content), fixes: generateLocalFixes(content) });
    }
  }

  /** Flip the preview to the score side; scores the resume the first time. */
  async function openScore() {
    setPreviewFlipped(true);
    setMobileView("preview");
    if (!liveScore && !scoringBusy) {
      setScoringBusy(true);
      await scoreResume();
      setScoringBusy(false);
    }
  }

  async function rescore() {
    setScoringBusy(true);
    await scoreResume();
    setScoringBusy(false);
  }

  async function enhanceAll() {
    setEnhancing(true); setEnhanceResult(null); setEnhanceError(null);
    const r = await fetch("/api/ai/impact-rewrite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeId }) }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setEnhancing(false);
    if (r?.ok && j.result?.rewrites) setEnhanceResult(j.result.rewrites);
    else setEnhanceError({ message: j.error ?? "Couldn't enhance your bullets. Please try again.", upgrade: Boolean(j.upgrade) });
  }

  /* ── Shared pieces ─────────────────────────────────────────────── */

  function renderNavFooter() {
    const isLast = activeTabIdx === TABS.length - 1;
    const isFirst = activeTabIdx === 0;
    return (
      <div className="mt-8 flex items-center justify-between gap-3 border-t border-[#e2e0ea] pt-5">
        <button type="button" onClick={prevTab} disabled={isFirst} className={btnSoftSm}>
          <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Back
        </button>
        <div className="flex flex-col items-center gap-1.5">
          <span className="text-[12px] font-semibold text-[#66647c]">Step {activeTabIdx + 1} of {TABS.length}</span>
          <div className="hidden items-center gap-1 sm:flex" aria-hidden="true">
            {TABS.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full motion-safe:transition-all ${i === activeTabIdx ? "w-5 bg-[#5440e8]" : i < activeTabIdx ? "w-1.5 bg-[#5440e8]/40" : "w-1.5 bg-[#e2e0ea]"}`}
              />
            ))}
          </div>
        </div>
        <button type="button" onClick={() => { void doSave(); nextTab(); }} className={btnDarkSm}>
          {saving ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : null}
          {isLast ? "Finish" : "Next"}
          {!isLast && <ChevronRight className="h-4 w-4" aria-hidden="true" />}
        </button>
      </div>
    );
  }

  function renderEmptyState(icon: React.ElementType, heading: string, desc: string, actionLabel: string, onAction: () => void) {
    const Icon = icon;
    return (
      <div className="flex flex-col items-center rounded-[20px] border-2 border-dashed border-[#c9c0ff] bg-[#f7f6fb] px-6 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e4dfff]">
          <Icon className="h-6 w-6 text-[#5440e8]" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-[17px] font-extrabold tracking-[-0.01em] text-[#121226]">{heading}</h3>
        <p className="mt-1.5 max-w-sm text-[14px] leading-[21px] text-[#4a4862]">{desc}</p>
        <button type="button" onClick={onAction} className={`${btnPrimarySm} mt-5`}>
          <Plus className="h-4 w-4" aria-hidden="true" /> {actionLabel}
        </button>
      </div>
    );
  }

  function renderEntry(heading: string, deleteLabel: string, onDelete: () => void, children: ReactNode) {
    return (
      <div className="rounded-[20px] border-[1.5px] border-[#e2e0ea] p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h3 className="min-w-0 truncate text-[15px] font-bold text-[#121226]">{heading}</h3>
          <button type="button" onClick={onDelete} aria-label={deleteLabel} className={`${iconBtn} -mr-2`}>
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">{children}</div>
      </div>
    );
  }

  /* ── Sections ──────────────────────────────────────────────────── */

  function renderDetailsTab() {
    const links = content.contact.links ?? [];
    const setContact = (patch: Partial<ResumeContent["contact"]>) => setContent((c) => ({ ...c, contact: { ...c.contact, ...patch } }));
    /** links[0] is LinkedIn, links[1] a portfolio or website; renderers skip empty slots. */
    const setLink = (i: number, v: string) => {
      const next = [links[0] ?? "", links[1] ?? "", ...links.slice(2)];
      next[i] = v.trim();
      while (next.length && !next[next.length - 1]) next.pop();
      setContact({ links: next });
    };
    return (
      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <Field label="Full name" className="sm:col-span-2">
          <input className={inputCls} value={content.contact.fullName} onChange={(e) => setContact({ fullName: e.target.value })} placeholder="Maria Lopez" autoComplete="name" />
        </Field>
        <Field label="Email">
          <input className={inputCls} type="email" value={content.contact.email} onChange={(e) => setContact({ email: e.target.value })} placeholder="maria.lopez@email.com" autoComplete="email" />
        </Field>
        <Field label="Phone" hint="optional">
          <input className={inputCls} type="tel" value={content.contact.phone ?? ""} onChange={(e) => setContact({ phone: e.target.value })} placeholder="(512) 555-0142" autoComplete="tel" />
        </Field>
        <Field label="Location" hint="optional" help="City and state or country is enough. Leave out your street address." className="sm:col-span-2">
          <input className={inputCls} value={content.contact.location ?? ""} onChange={(e) => setContact({ location: e.target.value })} placeholder="Austin, TX — or Remote" autoComplete="address-level2" />
        </Field>
        <Field label="LinkedIn" hint="optional">
          <input className={inputCls} value={links[0] ?? ""} onChange={(e) => setLink(0, e.target.value)} placeholder="linkedin.com/in/marialopez" />
        </Field>
        <Field label="Portfolio or website" hint="optional">
          <input className={inputCls} value={links[1] ?? ""} onChange={(e) => setLink(1, e.target.value)} placeholder="marialopez.com" autoComplete="url" />
        </Field>
      </div>
    );
  }

  function renderShortBioTab() {
    return (
      <div className="mt-5 space-y-4">
        <Field label="Headline">
          <input className={inputCls} value={content.headline} onChange={(e) => setContent((c) => ({ ...c, headline: e.target.value }))} placeholder="Senior Software Engineer | Full-Stack Developer" />
        </Field>
        <div>
          <Field label="Summary">
            <textarea className={`${textareaCls} min-h-[160px]`} value={content.summary} onChange={(e) => setContent((c) => ({ ...c, summary: e.target.value }))} placeholder="Write a compelling professional summary highlighting your key achievements and career goals..." />
          </Field>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-[13px] text-[#66647c]">{content.summary.length}/500 characters recommended</p>
            <VoiceInput
              placeholder="Speak your summary"
              onTranscript={(text) => setContent((c) => ({ ...c, summary: c.summary + (c.summary ? " " : "") + text.trim() }))}
            />
          </div>
        </div>
      </div>
    );
  }

  function renderExperienceTab() {
    if (content.experience.length === 0) {
      return (
        <div className="mt-5">
          {renderEmptyState(
            Briefcase,
            "No experience added yet",
            "Click the button below or use voice input to describe your work history. Our AI will help you write impactful bullet points.",
            "Add experience",
            addExp,
          )}
        </div>
      );
    }

    const openId = openExpId === null
      ? null
      : content.experience.some((e) => e.id === openExpId) ? openExpId : content.experience[0].id;
    const setExp = (id: string, patch: Partial<ResumeContent["experience"][number]>) =>
      setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === id ? { ...x, ...patch } : x) }));

    return (
      <div className="mt-5 space-y-2.5">
        {content.experience.map((ex) => {
          const name = `${ex.role || ex.company || "New job"}${ex.company && ex.role ? ` at ${ex.company}` : ""}`;
          const rewrites = (enhanceResult ?? []).filter((rw) => rw.experienceId === ex.id);
          const pending = rewrites.filter((rw) => ex.bullets.some((b) => b.id === rw.bulletId && b.text !== rw.improved)).length;
          const dates = [ex.start, ex.end].filter(Boolean).join(" – ");

          if (ex.id !== openId) {
            return (
              <button
                key={ex.id}
                type="button"
                aria-expanded={false}
                onClick={() => setOpenExpId(ex.id)}
                className="flex w-full items-center justify-between gap-3 rounded-[20px] bg-[#f7f6fb] px-4 py-4 text-left transition-colors hover:bg-[#efedf7] sm:px-5"
              >
                <span className="min-w-0">
                  <span className="block truncate text-[15px] font-bold text-[#121226]">{ex.role || ex.company || "New job"}</span>
                  <span className="block truncate text-[14px] text-[#66647c]">
                    {[ex.role ? ex.company : "", dates].filter(Boolean).join(" · ") || "No details yet"}
                  </span>
                </span>
                <span className="flex shrink-0 items-center gap-2">
                  {pending > 0 ? (
                    <span className="rounded-full bg-[#e4dfff] px-2.5 py-[5px] text-[12px] font-bold text-[#3a2bb8]">
                      {pending} {pending === 1 ? "suggestion" : "suggestions"}
                    </span>
                  ) : null}
                  <span className="text-[13px] font-bold text-[#5440e8]">Edit<span className="sr-only"> {name}</span></span>
                </span>
              </button>
            );
          }

          return (
            <div key={ex.id} className="rounded-[20px] border-[1.5px] border-[#c9c0ff] p-4 sm:p-5">
              <div className="flex items-center justify-between gap-2">
                <h3 className="min-w-0 truncate text-[15px] font-bold text-[#121226]">{name}</h3>
                <div className="-mr-2 flex shrink-0 items-center">
                  {content.experience.length > 1 ? (
                    <button type="button" aria-expanded={true} aria-label={`Collapse ${name}`} onClick={() => setOpenExpId(null)} className={`${iconBtn} hover:bg-[#f1eff8]! hover:text-[#121226]!`}>
                      <ChevronUp className="h-4 w-4" aria-hidden="true" />
                    </button>
                  ) : null}
                  <button type="button" onClick={() => delExp(ex.id)} aria-label={`Delete ${name}`} className={iconBtn}>
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <Field label="Job title">
                  <input className={inputCls} value={ex.role} onChange={(e) => setExp(ex.id, { role: e.target.value })} placeholder="Product Manager" />
                </Field>
                <Field label="Company">
                  <input className={inputCls} value={ex.company} onChange={(e) => setExp(ex.id, { company: e.target.value })} placeholder="Company name" />
                </Field>
                <Field label="Start">
                  <input className={inputCls} value={ex.start} onChange={(e) => setExp(ex.id, { start: e.target.value })} placeholder="Jun 2022" />
                </Field>
                <Field label="End">
                  <input className={inputCls} value={ex.end} onChange={(e) => setExp(ex.id, { end: e.target.value })} placeholder="Dec 2023 or Present" />
                </Field>
                <Field label="Location" hint="optional" className="sm:col-span-2">
                  <input className={inputCls} value={ex.location ?? ""} onChange={(e) => setExp(ex.id, { location: e.target.value })} placeholder="City, state — or Remote" />
                </Field>
              </div>

              <p className="mb-2 mt-[18px] text-[13px] font-bold text-[#4a4862]">Bullets</p>
              {ex.bullets.length > 0 ? (
                <ul className="flex flex-col gap-1.5">
                  {ex.bullets.map((b, i) => {
                    const rw = rewrites.find((r) => r.bulletId === b.id);
                    return (
                      <li key={b.id} className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-1 rounded-[14px] bg-[#f7f6fb] pl-3.5 transition-shadow focus-within:ring-2 focus-within:ring-[#5440e8]">
                          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#b3b0c8]" />
                          <input
                            aria-label={`Bullet ${i + 1}`}
                            className="min-h-12 min-w-0 flex-1 bg-transparent px-2 text-[16px] leading-[21px] text-[#121226] outline-none placeholder:text-[#706e88] focus-visible:outline-none! sm:text-[14px]"
                            value={b.text}
                            onChange={(e) => setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === ex.id ? { ...x, bullets: x.bullets.map((bb) => bb.id === b.id ? { ...bb, text: e.target.value } : bb) } : x) }))}
                            placeholder="Describe an achievement..."
                          />
                          <button
                            type="button"
                            aria-label={`Remove bullet ${i + 1}`}
                            onClick={() => setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === ex.id ? { ...x, bullets: x.bullets.filter((bb) => bb.id !== b.id) } : x) }))}
                            className={iconBtn}
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                        {rw ? (
                          <div className="rounded-2xl bg-[#5440e8] px-4 py-3.5 text-white">
                            <p className="inline-flex items-center gap-1.5 text-[12px] font-extrabold tracking-[0.06em] text-[#e4dfff]">
                              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> SUGGESTED REWRITE
                            </p>
                            <p className="mt-2 text-[15px] font-semibold leading-[22px]">{rw.improved}</p>
                            {rw.change_summary ? <p className="mt-1 text-[13px] leading-5 text-[#e4dfff]">{rw.change_summary}</p> : null}
                            <div className="mt-3">
                              {b.text === rw.improved ? (
                                <span className="inline-flex min-h-10 items-center gap-1.5 text-[13px] font-bold text-white">
                                  <Check className="h-4 w-4" aria-hidden="true" /> Applied
                                </span>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === rw.experienceId ? { ...x, bullets: x.bullets.map((bb) => bb.id === rw.bulletId ? { ...bb, text: rw.improved } : bb) } : x) }));
                                  }}
                                  className="inline-flex min-h-10 items-center rounded-full bg-white px-4 text-[13px] font-bold text-[#121226] transition-colors hover:bg-[#e4dfff] focus-visible:outline-white!"
                                >
                                  Use this<span className="sr-only"> rewrite for bullet {i + 1}</span>
                                </button>
                              )}
                            </div>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              ) : (
                <p className="text-[14px] text-[#66647c]">No bullets yet. Add one, or say it out loud.</p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
                <button type="button" onClick={() => addBullet(ex.id)} className={textBtn}>
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add bullet
                </button>
                <VoiceInput
                  placeholder="Speak to add bullet"
                  onTranscript={(text) => {
                    const newBullet = { id: uid(), text: text.trim(), evidenceIds: [] as string[] };
                    setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === ex.id ? { ...x, bullets: [...x.bullets, newBullet] } : x) }));
                  }}
                />
              </div>
            </div>
          );
        })}

        <button type="button" onClick={addExp} className={dashedBtn}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add experience
        </button>

        <div className="flex flex-col gap-3 rounded-[20px] bg-[#f7f6fb] p-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-[14px] leading-[21px] text-[#4a4862]">
            <b className="text-[#121226]">Rewrite your bullets with AI.</b> Suggestions appear under each bullet for you to accept.
          </p>
          <button type="button" disabled={enhancing || content.experience.length === 0} onClick={() => void enhanceAll()} className={`${btnPrimarySm} shrink-0`}>
            {enhancing ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : <Sparkles className="h-4 w-4" aria-hidden="true" />}
            {enhancing ? "Enhancing..." : "Enhance all with AI"}
          </button>
        </div>

        {enhanceResult ? (
          <p role="status" className="rounded-2xl bg-[#e4dfff] px-4 py-3 text-[14px] font-semibold text-[#3a2bb8]">
            {enhanceResult.length === 0
              ? "No rewrites suggested — your bullets already read well."
              : `${enhanceResult.length} suggested ${enhanceResult.length === 1 ? "rewrite" : "rewrites"} — open each job to review them.`}
          </p>
        ) : null}

        {enhanceError ? (
          <div
            role={enhanceError.upgrade ? "status" : "alert"}
            className={`flex flex-col gap-3 rounded-2xl px-4 py-3.5 sm:flex-row sm:items-center sm:justify-between ${
              enhanceError.upgrade ? "bg-[#e4dfff]" : "bg-[#fbe2e3]"
            }`}
          >
            <p className={`text-[14px] leading-[21px] ${enhanceError.upgrade ? "text-[#121226]" : "text-[#a3222a]"}`}>{enhanceError.message}</p>
            {enhanceError.upgrade ? (
              <Link href="/dashboard/settings/subscription" className={`${btnPrimarySm} shrink-0`}>See plans</Link>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  function renderEducationTab() {
    if (content.education.length === 0) {
      return (
        <div className="mt-5">
          {renderEmptyState(GraduationCap, "No education added yet", "Add degrees, universities or bootcamps.", "Add education", addEdu)}
        </div>
      );
    }
    const setEdu = (id: string, patch: Partial<ResumeContent["education"][number]>) =>
      setContent((c) => ({ ...c, education: c.education.map((x) => x.id === id ? { ...x, ...patch } : x) }));
    return (
      <div className="mt-5 space-y-2.5">
        {content.education.map((ed) =>
          <div key={ed.id}>
            {renderEntry(ed.school || "New school", `Delete ${ed.school || "this education entry"}`, () => delEdu(ed.id), (
              <>
                <Field label="School">
                  <input className={inputCls} value={ed.school} onChange={(e) => setEdu(ed.id, { school: e.target.value })} placeholder="School name" />
                </Field>
                <Field label="Degree">
                  <input className={inputCls} value={ed.degree} onChange={(e) => setEdu(ed.id, { degree: e.target.value })} placeholder="e.g. B.S. Computer Science" />
                </Field>
                <Field label="Start year">
                  <input className={inputCls} value={ed.start} onChange={(e) => setEdu(ed.id, { start: e.target.value })} placeholder="2014" />
                </Field>
                <Field label="End year">
                  <input className={inputCls} value={ed.end} onChange={(e) => setEdu(ed.id, { end: e.target.value })} placeholder="2018" />
                </Field>
                <Field label="GPA" hint="optional">
                  <input className={inputCls} value={ed.gpa ?? ""} onChange={(e) => setEdu(ed.id, { gpa: e.target.value })} placeholder="e.g. 3.8/4.0" />
                </Field>
              </>
            ))}
          </div>,
        )}
        <button type="button" onClick={addEdu} className={dashedBtn}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add education
        </button>
      </div>
    );
  }

  function renderCertificationsTab() {
    const certs = content.certifications ?? [];
    if (certs.length === 0) {
      return (
        <div className="mt-5">
          {renderEmptyState(ShieldCheck, "No certifications yet", "Add AWS, Google, PMP and other certifications, courses or licenses.", "Add certification", addCert)}
        </div>
      );
    }
    const setCert = (id: string, patch: Partial<NonNullable<ResumeContent["certifications"]>[number]>) =>
      setContent((ct) => ({ ...ct, certifications: (ct.certifications ?? []).map((x) => x.id === id ? { ...x, ...patch } : x) }));
    return (
      <div className="mt-5 space-y-2.5">
        {certs.map((c) =>
          <div key={c.id}>
            {renderEntry(c.name || "New certification", `Delete ${c.name || "this certification"}`, () => delCert(c.id), (
              <>
                <Field label="Certification name">
                  <input className={inputCls} value={c.name} onChange={(e) => setCert(c.id, { name: e.target.value })} placeholder="e.g. AWS Solutions Architect" />
                </Field>
                <Field label="Issuing organization">
                  <input className={inputCls} value={c.issuer} onChange={(e) => setCert(c.id, { issuer: e.target.value })} placeholder="e.g. Amazon Web Services" />
                </Field>
                <Field label="Date obtained">
                  <input className={inputCls} value={c.date} onChange={(e) => setCert(c.id, { date: e.target.value })} placeholder="e.g. Mar 2024" />
                </Field>
                <Field label="Credential URL" hint="optional">
                  <input className={inputCls} value={c.url ?? ""} onChange={(e) => setCert(c.id, { url: e.target.value })} placeholder="https://" />
                </Field>
              </>
            ))}
          </div>,
        )}
        <button type="button" onClick={addCert} className={dashedBtn}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add certification
        </button>
      </div>
    );
  }

  function renderAchievementsTab() {
    const achievements = content.achievements ?? [];
    if (achievements.length === 0) {
      return (
        <div className="mt-5">
          {renderEmptyState(Award, "No achievements yet", "Stand out — add awards, scholarships, or notable achievements.", "Add achievement", addAchievement)}
        </div>
      );
    }
    const setAch = (id: string, patch: Partial<NonNullable<ResumeContent["achievements"]>[number]>) =>
      setContent((c) => ({ ...c, achievements: (c.achievements ?? []).map((x) => x.id === id ? { ...x, ...patch } : x) }));
    return (
      <div className="mt-5 space-y-2.5">
        {achievements.map((a) =>
          <div key={a.id}>
            {renderEntry(a.title || "New achievement", `Delete ${a.title || "this achievement"}`, () => delAchievement(a.id), (
              <>
                <Field label="Achievement title">
                  <input className={inputCls} value={a.title} onChange={(e) => setAch(a.id, { title: e.target.value })} placeholder="e.g. Dean's List" />
                </Field>
                <Field label="Date or year">
                  <input className={inputCls} value={a.date ?? ""} onChange={(e) => setAch(a.id, { date: e.target.value })} placeholder="e.g. 2023" />
                </Field>
                <Field label="Description" className="sm:col-span-2">
                  <textarea className={textareaCls} value={a.description} onChange={(e) => setAch(a.id, { description: e.target.value })} placeholder="Describe the achievement..." />
                </Field>
              </>
            ))}
          </div>,
        )}
        <button type="button" onClick={addAchievement} className={dashedBtn}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add achievement
        </button>
      </div>
    );
  }

  function renderRecommendationsTab() {
    const recs = content.recommendations ?? [];
    if (recs.length === 0) {
      return (
        <div className="mt-5">
          {renderEmptyState(MessageSquare, "No recommendations yet", "Add references — recruiters value peer endorsements.", "Add recommendation", addRec)}
        </div>
      );
    }
    const setRec = (id: string, patch: Partial<NonNullable<ResumeContent["recommendations"]>[number]>) =>
      setContent((c) => ({ ...c, recommendations: (c.recommendations ?? []).map((x) => x.id === id ? { ...x, ...patch } : x) }));
    return (
      <div className="mt-5 space-y-2.5">
        {recs.map((r) =>
          <div key={r.id}>
            {renderEntry(r.recommenderName || "New recommendation", `Delete ${r.recommenderName ? `recommendation from ${r.recommenderName}` : "this recommendation"}`, () => delRec(r.id), (
              <>
                <Field label="Recommender name">
                  <input className={inputCls} value={r.recommenderName} onChange={(e) => setRec(r.id, { recommenderName: e.target.value })} placeholder="Full name" />
                </Field>
                <Field label="Their role">
                  <input className={inputCls} value={r.recommenderRole} onChange={(e) => setRec(r.id, { recommenderRole: e.target.value })} placeholder="e.g. Engineering Manager" />
                </Field>
                <Field label="Company">
                  <input className={inputCls} value={r.company} onChange={(e) => setRec(r.id, { company: e.target.value })} placeholder="Company name" />
                </Field>
                <Field label="Relationship">
                  <input className={inputCls} value={r.relationship} onChange={(e) => setRec(r.id, { relationship: e.target.value })} placeholder="e.g. Direct manager" />
                </Field>
                <Field label="Recommendation" className="sm:col-span-2">
                  <textarea className={`${textareaCls} min-h-[100px]`} value={r.text} onChange={(e) => setRec(r.id, { text: e.target.value })} placeholder="Recommendation text or key quote..." />
                </Field>
              </>
            ))}
          </div>,
        )}
        <button type="button" onClick={addRec} className={dashedBtn}>
          <Plus className="h-4 w-4" aria-hidden="true" /> Add recommendation
        </button>
      </div>
    );
  }

  function renderSkillCategory(label: string, items: string[]) {
    if (items.length === 0) return null;
    return (
      <div>
        <h3 className="text-[14px] font-bold text-[#121226]">{label}</h3>
        <ul className="mt-2.5 flex flex-wrap gap-2">
          {items.map((s) => (
            <li key={s} className="inline-flex items-center gap-0.5 rounded-full bg-[#f1eff8] py-0.5 pl-3.5 pr-0.5 text-[14px] font-semibold text-[#121226]">
              {s}
              <button
                type="button"
                onClick={() => removeSkill(s)}
                aria-label={`Remove ${s}`}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full text-[#66647c] transition-colors hover:bg-[#fbe2e3] hover:text-[#c42b30] sm:h-8 sm:w-8"
              >
                <X className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  function renderSkillInput() {
    return (
      <div>
        <label htmlFor="lc-new-skill" className={labelCls}>Add a new skill</label>
        <div className="mt-1.5 flex gap-2">
          <input
            id="lc-new-skill"
            ref={skillInputRef}
            className={`${inputCls} mt-0! min-w-0 flex-1`}
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") addSkillToList(); }}
            placeholder="Type a skill and press Enter"
          />
          <button type="button" onClick={addSkillToList} className={`${btnPrimarySm} min-h-12! shrink-0 px-5`}>Add</button>
        </div>
      </div>
    );
  }

  function renderSkillsTab() {
    if (content.skills.length === 0) {
      return (
        <div className="mt-5 space-y-5">
          {renderEmptyState(
            Wrench,
            "No skills added yet",
            "Type a skill below and press Enter, or use voice input. Aim for 8-15 relevant skills that match your target role.",
            "Add your first skill",
            () => { setShowSkillInput(true); skillInputRef.current?.focus(); },
          )}
          {renderSkillInput()}
        </div>
      );
    }

    return (
      <div className="mt-5 space-y-6">
        {renderSkillCategory("Industry knowledge", industrySkills)}
        {renderSkillCategory("Tools & technologies", toolsSkills)}
        {renderSkillCategory("Other skills", otherSkills)}
        <div className="border-t border-[#e2e0ea] pt-5">{renderSkillInput()}</div>
      </div>
    );
  }

  function renderOverwriteModal() {
    if (!showOverwrite) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-[#121226]/45 p-3 backdrop-blur-sm sm:items-center sm:p-4">
        <div role="dialog" aria-modal="true" aria-labelledby="lc-import-title" className="lc-float max-h-[calc(100svh-24px)] w-full max-w-lg overflow-y-auto rounded-[28px] bg-white p-5 sm:p-7">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h2 id="lc-import-title" className="text-[22px] font-extrabold tracking-[-0.02em] text-[#121226]">Import work history</h2>
              <p className="mt-1 text-[14px] text-[#4a4862]">This will overwrite your current resume content.</p>
            </div>
            <button type="button" onClick={() => setShowOverwrite(false)} aria-label="Close" className={`${iconBtn} -mr-2 -mt-1 hover:bg-[#f1eff8]! hover:text-[#121226]!`}>
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <Field label="Paste your LinkedIn profile text">
                <textarea className={`${textareaCls} min-h-[110px]`} placeholder="Copy your LinkedIn profile page text and paste it here..." value={linkedinText} onChange={(e) => setLinkedinText(e.target.value)} />
              </Field>
              <button type="button" disabled={linkedinImporting || linkedinText.length < 50} onClick={async () => {
                setLinkedinImporting(true); setImportErr(null);
                const r = await fetch("/api/import/linkedin-text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: linkedinText }) });
                const j = await r.json().catch(() => ({}));
                setLinkedinImporting(false);
                if (!r.ok) { setImportErr(j.error ?? "Import failed"); return; }
                if (j.content) { setContent(j.content as ResumeContent); setShowOverwrite(false); setLinkedinText(""); }
              }} className={`${btnPrimarySm} mt-3`}>
                {linkedinImporting ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : null}
                {linkedinImporting ? "Parsing with AI..." : "Import from LinkedIn"}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-[#e2e0ea]" />
              <span className="text-[13px] text-[#66647c]">or upload a file</span>
              <div className="h-px flex-1 bg-[#e2e0ea]" />
            </div>

            <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-[20px] border-2 border-dashed border-[#c9c0ff] bg-[#f7f6fb] px-4 text-center transition-colors hover:border-[#5440e8] hover:bg-[#f1eff8] focus-within:border-[#5440e8] focus-within:ring-4 focus-within:ring-[#5440e8]/15">
              <input type="file" className="sr-only" accept=".doc,.pdf,.docx" onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setImporting(true); setImportErr(null);
                const fd = new FormData();
                fd.append("file", file);
                const r = await fetch("/api/import/resume-file", { method: "POST", body: fd });
                const j = await r.json().catch(() => ({}));
                setImporting(false);
                if (!r.ok) { setImportErr(j.error ?? "Import failed"); return; }
                if (j.content) {
                  setContent(j.content as ResumeContent);
                  setShowOverwrite(false);
                }
              }} />
              {importing ? <Loader2 className="h-8 w-8 text-[#5440e8] motion-safe:animate-spin" aria-hidden="true" /> : <UploadCloud className="h-8 w-8 text-[#5440e8]" aria-hidden="true" />}
              <p className="mt-2.5 text-[14px] font-semibold text-[#121226]">{importing ? "Parsing with AI..." : "Drag & drop or click to select a file"}</p>
              <p className="mt-1 text-[13px] text-[#66647c]">PDF, DOC, DOCX (max 4MB)</p>
            </label>

            {importErr ? <p role="alert" className="rounded-2xl bg-[#fbe2e3] px-4 py-3 text-[14px] text-[#a3222a]">{importErr}</p> : null}
          </div>

          <div className="mt-5">
            <button type="button" onClick={() => setShowOverwrite(false)} className={`${btnSoftSm} w-full`}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Preview column ───────────────────────────────────────────── */

  const saveLabel = saving ? "Saving…" : justSaved ? "Saved" : null;

  function renderScoreCard(className: string) {
    return (
      <div className={`lc-card items-center gap-4 rounded-[22px] px-4 py-4 sm:px-5 ${className}`}>
        {liveScore ? (
          <ScoreRing value={liveScore.score} size={56} label={`Score ${liveScore.score} out of 100`} />
        ) : (
          <ScoreRing value={completeness} size={56} label={`Completeness ${completeness} percent`} />
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[15px] font-extrabold text-[#121226]">
            {liveScore ? `Score ${liveScore.score} · Completeness ${completeness}%` : `Completeness ${completeness}%`}
          </p>
          <p className="mt-0.5 text-[13px] leading-[19px] text-[#66647c]">
            {liveScore
              ? liveScore.fixes[0] ?? "Nothing urgent to fix right now."
              : "Score your resume to see what to fix first."}
          </p>
        </div>
        <button
          type="button"
          onClick={() => (previewFlipped ? setPreviewFlipped(false) : void openScore())}
          className="inline-flex min-h-11 shrink-0 items-center rounded-full px-2 text-[13px] font-bold text-[#5440e8] transition-colors hover:text-[#3a2bb8]"
        >
          {previewFlipped ? "Back to preview" : "View score"}
        </button>
      </div>
    );
  }

  function renderPreviewColumn() {
    return (
      <div
        id="resume-preview"
        className={`${mobileView === "edit" ? "hidden xl:flex" : "flex"} mx-auto w-full max-w-[560px] scroll-mt-4 flex-col gap-3 lg:col-start-2 xl:sticky xl:top-6 xl:col-start-auto xl:max-w-none`}
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div role="group" aria-label="Template" className="flex gap-1 rounded-full bg-white p-1">
            {TEMPLATE_STYLES.map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={template === t}
                onClick={() => setTemplate(t)}
                className={`min-h-10 rounded-full px-3 text-[13px] font-bold transition-colors sm:min-h-8 ${
                  template === t ? "bg-[#111118] text-white" : "text-[#4a4862] hover:bg-[#f1eff8] hover:text-[#121226]"
                }`}
              >
                {TEMPLATE_SPECS[t].label}
              </button>
            ))}
          </div>
          <span aria-hidden="true" className="hidden items-center gap-1.5 text-[13px] font-bold text-[#0b7a4f] xl:inline-flex">
            {saving ? <Loader2 className="h-3.5 w-3.5 text-[#5440e8] motion-safe:animate-spin" /> : <Check className="h-3.5 w-3.5" strokeWidth={2.6} />}
            <span className={saving ? "text-[#3a2bb8]" : ""}>{saveLabel ?? "Autosave on"}</span>
          </span>
        </div>

        <div className="rounded-[28px] bg-[#c9c0ff] p-4 sm:p-6" style={{ perspective: "1200px" }}>
          <div
            className="relative motion-safe:transition-transform motion-safe:duration-[600ms]"
            style={{ transformStyle: "preserve-3d", transform: previewFlipped ? "rotateY(180deg)" : "rotateY(0)" }}
          >
            {/* Front: preview — hover overlay + click to flip */}
            <div
              aria-hidden={previewFlipped || undefined}
              className="group relative cursor-pointer"
              style={{ backfaceVisibility: "hidden" }}
              onClick={() => void openScore()}
            >
              <div className="lc-float rounded-[6px]">
                <ResumePreview content={content} regionMode={regionMode} title={title} template={template} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center rounded-[6px] bg-[#111118]/0 transition-colors duration-300 group-hover:bg-[#111118]/35">
                <span className="rounded-full bg-white px-4 py-2 text-[13px] font-bold text-[#121226] opacity-0 shadow-lg transition-opacity duration-300 group-hover:opacity-100">
                  <Sparkles className="mr-1.5 inline h-4 w-4 text-[#5440e8]" aria-hidden="true" />
                  View score
                </span>
              </div>
            </div>

            {/* Back: scoring — click to flip back */}
            <div
              inert={!previewFlipped}
              className="absolute inset-0 cursor-pointer overflow-y-auto rounded-[20px] bg-white p-5"
              style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
              onClick={() => setPreviewFlipped(false)}
            >
              <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#e2e0ea] pb-3">
                <p className="text-[12px] text-[#66647c]">Click anywhere to go back to preview</p>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); setPreviewFlipped(false); }}
                  className="inline-flex min-h-10 shrink-0 items-center gap-1 rounded-full bg-[#f1eff8] px-3 text-[13px] font-bold text-[#121226] transition-colors hover:bg-[#e4dfff]"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" /> Preview
                </button>
              </div>
              {liveScore ? (
                <div className="space-y-5" aria-live="polite">
                  <div className="flex flex-col items-center py-1 text-center">
                    <ScoreRing value={liveScore.score} size={120} label={`Score ${liveScore.score} out of 100`} />
                    <p className="mt-3 text-[16px] font-extrabold text-[#121226]">
                      {liveScore.score >= 80 ? "Excellent!" : liveScore.score >= 60 ? "Good start!" : liveScore.score >= 40 ? "Needs improvement" : "Needs significant work"}
                    </p>
                    <p className="mt-1 text-[13px] text-[#66647c]">Based on AI analysis of your resume</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { n: content.experience.length, l: "Jobs" },
                      { n: content.skills.length, l: "Skills" },
                      { n: content.experience.reduce((s, e) => s + e.bullets.length, 0), l: "Bullets" },
                    ].map((s) => (
                      <div key={s.l} className="rounded-2xl bg-[#f7f6fb] p-3 text-center">
                        <p className="lc-mono text-[18px] text-[#121226]">{s.n}</p>
                        <p className="text-[12px] text-[#66647c]">{s.l}</p>
                      </div>
                    ))}
                  </div>

                  {liveScore.fixes.length > 0 ? (
                    <div>
                      <h3 className="text-[14px] font-bold text-[#121226]">Recommendations</h3>
                      <ol className="mt-3 space-y-2">
                        {liveScore.fixes.map((fix, i) => (
                          <li key={i} className="flex items-start gap-2.5 rounded-2xl bg-[#fdf0d5] p-3">
                            <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white text-[11px] font-bold text-[#a15c00]">{i + 1}</span>
                            <p className="text-[13px] leading-5 text-[#4a4862]">{fix}</p>
                          </li>
                        ))}
                      </ol>
                    </div>
                  ) : null}

                  <div>
                    <h3 className="text-[14px] font-bold text-[#121226]">Completeness</h3>
                    <ul className="mt-3 space-y-2">
                      {checklist.map((item) => (
                        <li key={item.label} className="flex items-center gap-2.5">
                          <span className={`flex h-5 w-5 items-center justify-center rounded-full ${item.done ? "bg-[#dcf5ea]" : "bg-[#f1eff8]"}`}>
                            {item.done ? <Check className="h-3 w-3 text-[#0b7a4f]" aria-hidden="true" /> : <X className="h-3 w-3 text-[#66647c]" aria-hidden="true" />}
                          </span>
                          <span className={`text-[13px] ${item.done ? "text-[#121226]" : "text-[#66647c]"}`}>
                            {item.label}
                            <span className="sr-only">{item.done ? " — done" : " — missing"}</span>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); void rescore(); }}
                    className={`${btnSoftSm} w-full`}
                  >
                    {scoringBusy ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" /> : null}
                    Re-score resume
                  </button>
                </div>
              ) : (
                <div role="status" className="flex flex-col items-center justify-center py-16 text-center">
                  <Loader2 className="h-8 w-8 text-[#5440e8] motion-safe:animate-spin" aria-hidden="true" />
                  <p className="mt-4 text-[15px] font-bold text-[#121226]">Analyzing your resume...</p>
                  <p className="mt-1 text-[13px] text-[#66647c]">AI is scoring your content</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {renderScoreCard("hidden xl:flex")}
      </div>
    );
  }

  /* ── Page ──────────────────────────────────────────────────────── */

  const tools = [
    { href: `/resume/${resumeId}/jd`, label: "Match to a job" },
    { href: `/resume/${resumeId}/fit`, label: "Role fit" },
    { href: `/resume/${resumeId}/packet`, label: "Cover letter & interview" },
    { href: `/resume/${resumeId}/evidence`, label: "Consistency" },
    { href: `/resume/${resumeId}/snapshots`, label: "Versions" },
  ];

  const badge = saving
    ? { cls: "bg-[#e4dfff] text-[#3a2bb8]", text: "Saving…" }
    : justSaved
      ? { cls: "bg-[#dcf5ea] text-[#0b4f35]", text: "Saved" }
      : null;

  return (
    <div className={`lc-site ${siteFontVars} min-h-screen`}>
      <header className="border-b border-[#e2e0ea] bg-white">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:gap-5 sm:px-7 sm:py-3.5">
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <Link
              href="/dashboard/resumes"
              aria-label="Back to resumes"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1eff8] text-[#121226] transition-colors hover:bg-[#e4dfff] focus-visible:rounded-full! sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" />
            </Link>
            <h1 className="min-w-0 truncate text-[15px] font-bold text-[#121226] sm:text-[16px]">{title}</h1>
            <span role="status" className={`shrink-0 rounded-full px-2.5 py-[5px] text-[12px] font-bold ${badge ? badge.cls : "bg-[#f1eff8] text-[#4a4862]"}`}>
              {badge ? badge.text : (
                <>
                  <span className="sm:hidden">Autosave</span>
                  <span className="hidden sm:inline">Changes save automatically</span>
                </>
              )}
            </span>
          </div>

          <nav aria-label="Resume tools" className="hidden shrink-0 gap-0.5 rounded-full bg-[#f1eff8] p-1 xl:flex">
            <Link href={`/resume/${resumeId}/edit`} aria-current="page" className="rounded-full bg-[#111118] px-4 py-2.5 text-[14px] font-bold text-white focus-visible:rounded-full!">
              Edit
            </Link>
            {tools.map((l) => (
              <Link key={l.href} href={l.href} className="whitespace-nowrap rounded-full px-4 py-2.5 text-[14px] font-semibold text-[#4a4862] transition-colors hover:bg-white hover:text-[#121226] focus-visible:rounded-full!">
                {l.label}
              </Link>
            ))}
          </nav>

          <a
            href={`/api/resumes/${resumeId}/docx`}
            download
            className={`${pill} hidden shrink-0 bg-[#f1eff8] text-[14px] text-[#121226] hover:bg-[#e4dfff] sm:inline-flex`}
          >
            <span><span className="sr-only">Download as </span>Word</span>
          </a>
          <button type="button" onClick={onPdfExportClick} className={`${btnDarkSm} hidden shrink-0 sm:inline-flex`}>
            <Download className="h-4 w-4" aria-hidden="true" /> <span><span className="sr-only">Download </span>PDF</span>
          </button>
        </div>

        <nav aria-label="Resume tools" className="overflow-x-auto border-t border-[#e2e0ea] xl:hidden">
          <ul className="flex w-max gap-1.5 px-4 py-2 sm:px-7">
            {tools.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-10 items-center whitespace-nowrap rounded-full bg-[#f1eff8] px-3.5 text-[13px] font-semibold text-[#4a4862] transition-colors hover:bg-[#e4dfff] hover:text-[#121226] focus-visible:rounded-full!">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {error ? (
        <div role="alert" className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1 bg-[#fbe2e3] px-4 py-2.5 text-[14px] text-[#a3222a] sm:px-7">
          <span>Couldn&apos;t save your last change: {error}</span>
          <button type="button" onClick={() => void doSave()} className="inline-flex min-h-10 shrink-0 items-center font-bold underline underline-offset-2">
            Try again
          </button>
        </div>
      ) : null}

      <main className="mx-auto max-w-[1400px] px-4 pb-14 pt-4 sm:px-6 sm:pt-6 lg:px-10 lg:pt-8">
        {/* Edit / Preview toggle (below the three-column layout) */}
        <div role="group" aria-label="View" className="mb-4 flex gap-1 rounded-full bg-white p-1 xl:hidden lg:max-w-[360px]">
          {(["edit", "preview"] as const).map((v) => (
            <button
              key={v}
              type="button"
              aria-pressed={mobileView === v}
              onClick={() => setMobileView(v)}
              className={`min-h-11 flex-1 rounded-full text-[14px] font-bold transition-colors ${
                mobileView === v ? "bg-[#111118] text-white" : "text-[#4a4862] hover:bg-[#f1eff8] hover:text-[#121226]"
              }`}
            >
              {v === "edit" ? "Edit" : "Preview"}
            </button>
          ))}
        </div>

        {/* Section chips (phones and tablets) */}
        <nav aria-label="Sections" className={`-mx-4 mb-3.5 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:hidden ${mobileView === "preview" ? "hidden" : ""}`}>
          <ul className="flex w-max gap-1.5">
            {TABS.map((t) => {
              const active = t.key === activeTab;
              return (
                <li key={t.key}>
                  <button
                    type="button"
                    aria-current={active ? "step" : undefined}
                    onClick={() => goToTab(t.key)}
                    className={`inline-flex min-h-11 items-center gap-1.5 whitespace-nowrap rounded-full px-4 text-[14px] font-bold transition-colors ${
                      active ? "bg-[#5440e8] text-white" : "bg-white text-[#121226] hover:bg-[#e4dfff]"
                    }`}
                  >
                    {t.short}
                    <span className="sr-only">{sectionDone[t.key] ? " (done)" : ""}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="grid items-start gap-5 lg:grid-cols-[210px_minmax(0,1fr)] xl:grid-cols-[210px_minmax(0,1fr)_440px] min-[1400px]:grid-cols-[210px_minmax(0,1fr)_500px]">
          {/* Section nav (desktop) */}
          <nav aria-label="Sections" className="lc-card hidden flex-col gap-0.5 rounded-[22px] p-2.5 lg:sticky lg:top-6 lg:flex">
            {TABS.map((t) => {
              const active = t.key === activeTab;
              return (
                <button
                  key={t.key}
                  type="button"
                  aria-current={active ? "step" : undefined}
                  onClick={() => goToTab(t.key)}
                  className={`flex min-h-11 items-center justify-between gap-2 rounded-[14px] px-3.5 text-left text-[14px] transition-colors focus-visible:rounded-[14px]! ${
                    active ? "bg-[#111118] font-extrabold text-white" : "font-semibold text-[#24223a] hover:bg-[#f1eff8]"
                  }`}
                >
                  {t.label}
                  <CheckDot done={sectionDone[t.key]} />
                </button>
              );
            })}
            <p className="mx-1 mb-1 mt-2.5 rounded-[14px] bg-[#f1eff8] p-3 text-[12px] leading-[18px] text-[#4a4862]">
              <b className="text-[#121226]">{sectionsDoneCount} of {TABS.length}</b> sections done
            </p>
          </nav>

          {/* Form */}
          <section
            aria-labelledby="lc-section-title"
            className={`${mobileView === "preview" ? "hidden xl:block" : ""} min-w-0 rounded-[22px] bg-white p-[18px] sm:rounded-[28px] sm:p-[26px]`}
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 id="lc-section-title" className="text-[20px] font-extrabold tracking-[-0.01em] text-[#121226] sm:text-[24px]">{activeMeta.title}</h2>
                <p className="mt-1 text-[14px] text-[#66647c]">{activeMeta.subtitle}</p>
              </div>
              <button type="button" onClick={() => setShowOverwrite(true)} className={`${btnSoftSm} hidden shrink-0 sm:inline-flex`}>
                <UploadCloud className="h-4 w-4" aria-hidden="true" /> Import
              </button>
            </div>

            {activeTab === "details" ? renderDetailsTab() : null}
            {activeTab === "shortbio" ? renderShortBioTab() : null}
            {activeTab === "experience" ? renderExperienceTab() : null}
            {activeTab === "education" ? renderEducationTab() : null}
            {activeTab === "skills" ? renderSkillsTab() : null}
            {activeTab === "certifications" ? renderCertificationsTab() : null}
            {activeTab === "achievements" ? renderAchievementsTab() : null}
            {activeTab === "recommendations" ? renderRecommendationsTab() : null}

            {renderNavFooter()}
          </section>

          {renderPreviewColumn()}
        </div>

        {/* Score summary + actions below the three-column layout */}
        {renderScoreCard(`mt-3 xl:hidden ${mobileView === "edit" ? "flex" : "flex lg:ml-[230px] lg:max-w-[560px]"}`)}
        <div className="mt-3 grid grid-cols-3 gap-2 sm:hidden">
          <button type="button" onClick={() => setShowOverwrite(true)} className={`${pill} min-h-12 bg-white text-[15px] text-[#121226] hover:bg-[#e4dfff]`}>
            <UploadCloud className="h-4 w-4" aria-hidden="true" /> Import
          </button>
          <a href={`/api/resumes/${resumeId}/docx`} download className={`${pill} min-h-12 bg-white text-[15px] text-[#121226] hover:bg-[#e4dfff]`}>
            <span><span className="sr-only">Download as </span>Word</span>
          </a>
          <button type="button" onClick={onPdfExportClick} className={`${btnDarkSm} min-h-12 text-[15px]`}>
            <Download className="h-4 w-4" aria-hidden="true" /> <span><span className="sr-only">Download </span>PDF</span>
          </button>
        </div>
      </main>

      {renderOverwriteModal()}

      <ExperienceReviewModal open={surveyOpen} onClose={() => setSurveyOpen(false)} context={surveyContext} />
    </div>
  );
}
