"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState, useSyncExternalStore, type ReactNode, type TextareaHTMLAttributes } from "react";
import Link from "next/link";
import type { ResumeContent } from "@/types/resume";
import { ResumePreview, type TemplateStyle } from "@/components/resume-preview";
import { TEMPLATE_SPECS, TEMPLATE_STYLES, parseTemplate } from "@/lib/resume-templates";
import { VoiceInput } from "@/components/voice-input";
import { ExperienceReviewModal } from "@/components/experience-review-modal";
import { shouldOfferSatisfactionSurvey } from "@/lib/satisfaction-survey";
import { siteFontVars } from "@/lib/site-fonts";
import { scoreResume, type BulletChip, type ScoreTarget } from "@/lib/resume-score";
import { KeywordPanel, ScoreCard } from "@/components/resume-score-panel";
import { ScoreRing } from "@/components/ats-report-parts";
import {
  Award, Loader2, Check, MessageSquare, Plus, ShieldCheck, Sparkles, Trash2, UploadCloud, X, Download,
  Briefcase, GraduationCap, Wrench, ChevronRight, ChevronLeft, ChevronUp, ArrowLeft, GripVertical, MoreHorizontal,
} from "lucide-react";

function uid() { return crypto.randomUUID(); }

/** Bullets are one line of text: pasted line breaks become spaces. */
function oneLine(s: string) { return s.replace(/\s*[\r\n]+\s*/g, " "); }

/** A one-row textarea that grows with its text, so long bullets wrap instead of scrolling out of view. */
function AutoGrowTextarea({ value, inputRef, ...rest }: TextareaHTMLAttributes<HTMLTextAreaElement> & {
  value: string;
  inputRef?: (el: HTMLTextAreaElement | null) => void;
}) {
  const el = useRef<HTMLTextAreaElement | null>(null);
  const fit = useCallback(() => {
    const t = el.current;
    if (!t) return;
    t.style.height = "auto";
    t.style.height = `${t.scrollHeight}px`;
  }, []);
  useLayoutEffect(fit, [value, fit]);
  // Re-measure when the width changes (rotation, window resize, the preview column toggling).
  useEffect(() => {
    const t = el.current;
    if (!t || typeof ResizeObserver === "undefined") return undefined;
    let width = t.clientWidth;
    const ro = new ResizeObserver(() => {
      if (t.clientWidth !== width) { width = t.clientWidth; fit(); }
    });
    ro.observe(t);
    return () => ro.disconnect();
  }, [fit]);
  return (
    <textarea
      {...rest}
      rows={1}
      value={value}
      ref={(node) => { el.current = node; inputRef?.(node); }}
    />
  );
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

/** `value`, updated only after it has stopped changing for `ms` (the score runs on this, not on every key). */
function useDebounced<T>(value: T, ms: number): T {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), ms);
    return () => clearTimeout(t);
  }, [value, ms]);
  return v;
}

/** True from the three-column breakpoint (Tailwind xl, 1280px) up. False on the server. */
function useIsXl(): boolean {
  return useSyncExternalStore(
    (cb) => {
      const mq = window.matchMedia("(min-width: 1280px)");
      mq.addEventListener("change", cb);
      return () => mq.removeEventListener("change", cb);
    },
    () => window.matchMedia("(min-width: 1280px)").matches,
    () => false,
  );
}

const CHIP_TONE: Record<BulletChip["kind"], string> = {
  duty: "bg-[#fdf0d5] text-[#7a4600]",
  "no-result": "bg-[#fdf0d5] text-[#7a4600]",
  filler: "bg-[#f1eff8] text-[#4a4862]",
  "too-long": "bg-[#f1eff8] text-[#4a4862]",
  "repeat-start": "bg-[#f1eff8] text-[#4a4862]",
};

export function ResumeEditor({ resumeId, initialTitle, initialVertical, initialRegion, initialContent }: {
  resumeId: string; initialTitle: string; initialVertical: string; initialRegion: string; initialContent: ResumeContent;
}) {
  const [title] = useState(initialTitle);
  const [vertical] = useState(initialVertical);
  const [regionMode] = useState(initialRegion);
  const [content, setContent] = useState<ResumeContent>(initialContent);
  const [saving, setSaving] = useState(false);
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
  // Target job description, remembered per resume in this browser (like the template).
  const [jd, setJdState] = useState("");
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = window.localStorage.getItem(`lcv_jd_${resumeId}`);
    } catch {
      // storage unavailable
    }
    if (saved) setJdState(saved);
  }, [resumeId]);
  function setJd(v: string) {
    setJdState(v);
    try {
      if (v.trim()) window.localStorage.setItem(`lcv_jd_${resumeId}`, v);
      else window.localStorage.removeItem(`lcv_jd_${resumeId}`);
    } catch {
      // storage unavailable — the text still applies for this session
    }
  }
  /** Below the 3-column breakpoint the form and the preview share the screen via an Edit / Preview toggle. */
  const [mobileView, setMobileView] = useState<"edit" | "preview">("edit");
  /** Experience entry shown expanded; undefined = the first one, null = all collapsed. */
  const [openExpId, setOpenExpId] = useState<string | null | undefined>(undefined);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceError, setEnhanceError] = useState<{ message: string; upgrade: boolean } | null>(null);
  const [enhanceResult, setEnhanceResult] = useState<Array<{ experienceId: string; bulletId: string; original: string; improved: string; change_summary: string }> | null>(null);
  const [showOverwrite, setShowOverwrite] = useState(false);
  const [importing, setImporting] = useState(false);
  const [importErr, setImportErr] = useState<string | null>(null);
  const [linkedinText, setLinkedinText] = useState("");
  const [linkedinImporting, setLinkedinImporting] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const surveyDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [surveyOpen, setSurveyOpen] = useState(false);
  const [surveyContext, setSurveyContext] = useState("pdf_export");
  /** Suggestions the user closed with "Keep mine" (bullet ids). */
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  /** Bullet whose suggestion is being re-requested ("Try another"). */
  const [retrying, setRetrying] = useState<string | null>(null);
  const [retryNote, setRetryNote] = useState<{ bulletId: string; message: string; upgrade: boolean } | null>(null);
  /** Polite announcements: bullet moves, voice additions. */
  const [liveMsg, setLiveMsg] = useState("");
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement | null>(null);
  /** Bullet fields and drag handles by bullet id, so focus can follow a bullet when it moves or is added. */
  const bulletEls = useRef(new Map<string, HTMLTextAreaElement>());
  const handleEls = useRef(new Map<string, HTMLButtonElement>());
  const focusNext = useRef<{ id: string; part: "text" | "handle"; caret?: "end" } | null>(null);
  const drag = useRef<{ expId: string; bulletId: string; pointerId: number } | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  /** The bullet being typed in: its "No result" chip waits until the person moves on. */
  const [typingBullet, setTypingBullet] = useState<string | null>(null);
  const isXl = useIsXl();

  // LaunchCV Score: rule-based (lib/resume-score.ts), recomputed 300 ms after typing stops.
  const scoredContent = useDebounced(content, 300);
  const scoredJd = useDebounced(jd, 300);
  const score = useMemo(() => scoreResume(scoredContent, { jobDescription: scoredJd }), [scoredContent, scoredJd]);

  const payload = useMemo(() => ({ title, vertical, regionMode, content }), [title, vertical, regionMode, content]);

  const doSave = useCallback(async () => {
    setSaving(true); setError(null);
    try {
      const res = await fetch(`/api/resumes/${resumeId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      if (!res.ok) { const j = await res.json().catch(() => ({})); throw new Error(j.error ?? "Save error"); }
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

  // After a bullet is added or moved, put focus back on it (moving a node in the DOM drops focus).
  useEffect(() => {
    const want = focusNext.current;
    if (!want) return;
    focusNext.current = null;
    const node = want.part === "handle" ? handleEls.current.get(want.id) : bulletEls.current.get(want.id);
    if (!node) return;
    node.focus({ preventScroll: false });
    if (want.caret === "end" && node instanceof HTMLTextAreaElement) node.setSelectionRange(node.value.length, node.value.length);
  });

  /** Opens the section a score item or keyword suggestion is about, then scrolls to and focuses its field. */
  function jumpTo(t: ScoreTarget) {
    setActiveTab(t.tab);
    setMobileView("edit");
    if (t.expId) setOpenExpId(t.expId);
    let tries = 0;
    const go = () => {
      const node = document.querySelector<HTMLElement>(`[data-score-target="${CSS.escape(t.key)}"]`);
      if (!node) {
        // The section renders on the next frame or two.
        if ((tries += 1) < 20) requestAnimationFrame(go);
        else document.getElementById("lc-section-title")?.scrollIntoView({ block: "start" });
        return;
      }
      const smooth = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      node.scrollIntoView({ block: "center", behavior: smooth ? "smooth" : "auto" });
      node.focus({ preventScroll: true });
    };
    requestAnimationFrame(go);
  }

  function addSkillFromJob(term: string) {
    setContent((c) => (c.skills.some((k) => k.trim().toLowerCase() === term.toLowerCase()) ? c : { ...c, skills: [...c.skills, term] }));
    setLiveMsg(`Added ${term} to your skills.`);
  }

  // The "More" menu on phones closes on Escape (focus back to its button) or a tap outside it.
  useEffect(() => {
    if (!moreOpen) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      setMoreOpen(false);
      moreRef.current?.querySelector<HTMLButtonElement>("button[aria-controls]")?.focus();
    };
    const onDown = (e: PointerEvent) => { if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false); };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onDown);
    return () => { window.removeEventListener("keydown", onKey); window.removeEventListener("pointerdown", onDown); };
  }, [moreOpen]);

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
  /** Adds an empty bullet after `afterId` (or at the end) and focuses it. */
  const addBullet = (expId: string, afterId?: string) => {
    const id = uid();
    setContent((c) => ({
      ...c,
      experience: c.experience.map((ex) => {
        if (ex.id !== expId) return ex;
        const at = afterId ? ex.bullets.findIndex((b) => b.id === afterId) + 1 : ex.bullets.length;
        const bullets = [...ex.bullets];
        bullets.splice(at > 0 ? at : bullets.length, 0, { id, text: "", evidenceIds: [] });
        return { ...ex, bullets };
      }),
    }));
    focusNext.current = { id, part: "text" };
  };
  const setBulletText = (expId: string, bulletId: string, text: string) =>
    setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === expId ? { ...x, bullets: x.bullets.map((bb) => bb.id === bulletId ? { ...bb, text } : bb) } : x) }));
  const removeBullet = (expId: string, bulletId: string) =>
    setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === expId ? { ...x, bullets: x.bullets.filter((bb) => bb.id !== bulletId) } : x) }));
  /** Moves a bullet to position `to` (0-based) within its job; returns false when it can't move. */
  function moveBullet(expId: string, bulletId: string, to: number, focusPart?: "text" | "handle"): boolean {
    const ex = content.experience.find((x) => x.id === expId);
    if (!ex) return false;
    const from = ex.bullets.findIndex((b) => b.id === bulletId);
    if (from < 0 || to < 0 || to >= ex.bullets.length || to === from) return false;
    setContent((c) => ({
      ...c,
      experience: c.experience.map((x) => {
        if (x.id !== expId) return x;
        const bullets = [...x.bullets];
        const [moved] = bullets.splice(from, 1);
        bullets.splice(to, 0, moved);
        return { ...x, bullets };
      }),
    }));
    if (focusPart) focusNext.current = { id: bulletId, part: focusPart };
    return true;
  }
  function announceMove(expId: string, to: number) {
    const n = content.experience.find((x) => x.id === expId)?.bullets.length ?? 0;
    setLiveMsg(`Bullet moved to position ${to + 1} of ${n}.`);
  }

  /**
   * Pointer drag on a bullet's handle (mouse, pen or touch): the bullet swaps places as the pointer
   * passes another bullet's middle. Listens on window, because React may move the dragged row's
   * DOM node while it reorders, which would drop pointer capture.
   */
  function onHandlePointerDown(e: React.PointerEvent<HTMLButtonElement>, expId: string, bulletId: string) {
    if (e.button !== 0 || drag.current) return;
    const list = e.currentTarget.closest("ul");
    if (!list) return;
    e.preventDefault(); // no text selection while dragging
    const pointerId = e.pointerId;
    drag.current = { expId, bulletId, pointerId };
    setDraggingId(bulletId);
    const rows = () => [...list.querySelectorAll<HTMLElement>(":scope > li[data-bullet-id]")];

    const onMove = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      const all = rows();
      const from = all.findIndex((r) => r.dataset.bulletId === bulletId);
      if (from < 0) return;
      let to = from;
      all.forEach((r, i) => {
        const box = r.getBoundingClientRect();
        const mid = box.top + box.height / 2;
        if (i < from && ev.clientY < mid) to = Math.min(to, i);
        if (i > from && ev.clientY > mid) to = Math.max(to, i);
      });
      if (to === from) return;
      setContent((c) => ({
        ...c,
        experience: c.experience.map((x) => {
          if (x.id !== expId) return x;
          const bullets = [...x.bullets];
          const at = bullets.findIndex((b) => b.id === bulletId);
          if (at < 0) return x;
          const [moved] = bullets.splice(at, 1);
          bullets.splice(to, 0, moved);
          return { ...x, bullets };
        }),
      }));
    };
    const onEnd = (ev: PointerEvent) => {
      if (ev.pointerId !== pointerId) return;
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onEnd);
      window.removeEventListener("pointercancel", onEnd);
      drag.current = null;
      setDraggingId(null);
      const all = rows();
      const at = all.findIndex((r) => r.dataset.bulletId === bulletId);
      if (at >= 0) setLiveMsg(`Bullet moved to position ${at + 1} of ${all.length}.`);
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onEnd);
    window.addEventListener("pointercancel", onEnd);
  }
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

  type Rewrite = NonNullable<typeof enhanceResult>[number];

  /** "Try another": asks the same rewrite API again (one more use, like the first call) and swaps in this bullet's new suggestion. */
  async function retryRewrite(rw: Rewrite) {
    if (retrying) return;
    setRetrying(rw.bulletId);
    setRetryNote(null);
    // The API rewrites what's saved, so save the latest edits first.
    if (timer.current) clearTimeout(timer.current);
    await doSave();
    const r = await fetch("/api/ai/impact-rewrite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeId }) }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setRetrying(null);
    if (!r?.ok || !Array.isArray(j.result?.rewrites)) {
      setRetryNote({ bulletId: rw.bulletId, message: j.error ?? "Couldn't get another suggestion. Please try again.", upgrade: Boolean(j.upgrade) });
      return;
    }
    const fresh = (j.result.rewrites as Rewrite[]).find((x) => x.bulletId === rw.bulletId);
    if (!fresh?.improved?.trim() || fresh.improved.trim() === rw.improved.trim()) {
      setRetryNote({ bulletId: rw.bulletId, message: "No different suggestion this time. You can edit the bullet yourself, or try again.", upgrade: false });
      return;
    }
    setEnhanceResult((list) => (list ?? []).map((x) => (x.bulletId === rw.bulletId ? { ...fresh, experienceId: rw.experienceId, bulletId: rw.bulletId } : x)));
    setLiveMsg("New suggestion ready.");
  }

  /** Where dictation goes: the summary, the skills list, or (anywhere else) a new bullet on the open job. */
  const voiceTarget: "summary" | "skills" | "bullet" = activeTab === "shortbio" ? "summary" : activeTab === "skills" ? "skills" : "bullet";
  function openJobId(): string | null {
    if (openExpId === null) return content.experience[0]?.id ?? null;
    return content.experience.some((e) => e.id === openExpId) ? (openExpId as string) : (content.experience[0]?.id ?? null);
  }
  function onVoice(raw: string) {
    const text = oneLine(raw).trim();
    if (!text) return;
    if (voiceTarget === "summary") {
      setContent((c) => ({ ...c, summary: c.summary + (c.summary ? " " : "") + text }));
      setLiveMsg("Added to your summary.");
      return;
    }
    if (voiceTarget === "skills") {
      const said = text.split(/\s*(?:,|;|\band\b)\s*/i).map((s) => s.trim().replace(/\.$/, "")).filter(Boolean);
      setContent((c) => ({ ...c, skills: [...c.skills, ...said.filter((s) => !c.skills.some((k) => k.toLowerCase() === s.toLowerCase()))] }));
      setLiveMsg(`Added ${said.length} ${said.length === 1 ? "skill" : "skills"}.`);
      return;
    }
    const bullet = { id: uid(), text, evidenceIds: [] as string[] };
    const jobId = openJobId();
    if (jobId) {
      setContent((c) => ({ ...c, experience: c.experience.map((x) => (x.id === jobId ? { ...x, bullets: [...x.bullets, bullet] } : x)) }));
      setOpenExpId(jobId);
    } else {
      const id = uid();
      setContent((c) => ({ ...c, experience: [...c.experience, { id, company: "", role: "", start: "", end: "", location: "", bullets: [bullet] }] }));
      setOpenExpId(id);
    }
    setActiveTab("experience");
    setMobileView("edit");
    setLiveMsg("Added a bullet to your experience.");
  }

  async function enhanceAll() {
    setEnhancing(true); setEnhanceResult(null); setEnhanceError(null); setDismissed(new Set()); setRetryNote(null);
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

  function renderEmptyState(icon: React.ElementType, heading: string, desc: string, actionLabel: string, onAction: () => void, scoreTarget?: string) {
    const Icon = icon;
    return (
      <div className="flex flex-col items-center rounded-[20px] border-2 border-dashed border-[#c9c0ff] bg-[#f7f6fb] px-6 py-10 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#e4dfff]">
          <Icon className="h-6 w-6 text-[#5440e8]" aria-hidden="true" />
        </div>
        <h3 className="mt-4 text-[17px] font-extrabold tracking-[-0.01em] text-[#121226]">{heading}</h3>
        <p className="mt-1.5 max-w-sm text-[14px] leading-[21px] text-[#4a4862]">{desc}</p>
        <button type="button" data-score-target={scoreTarget} onClick={onAction} className={`${btnPrimarySm} mt-5`}>
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
          <input className={inputCls} value={content.contact.fullName} data-score-target="contact.fullName" onChange={(e) => setContact({ fullName: e.target.value })} placeholder="Maria Lopez" autoComplete="name" />
        </Field>
        <Field label="Email">
          <input className={inputCls} type="email" value={content.contact.email} data-score-target="contact.email" onChange={(e) => setContact({ email: e.target.value })} placeholder="maria.lopez@email.com" autoComplete="email" />
        </Field>
        <Field label="Phone" hint="optional">
          <input className={inputCls} type="tel" value={content.contact.phone ?? ""} data-score-target="contact.phone" onChange={(e) => setContact({ phone: e.target.value })} placeholder="(512) 555-0142" autoComplete="tel" />
        </Field>
        <Field label="Location" hint="optional" help="City and state or country is enough. Leave out your street address." className="sm:col-span-2">
          <input className={inputCls} value={content.contact.location ?? ""} data-score-target="contact.location" onChange={(e) => setContact({ location: e.target.value })} placeholder="Austin, TX — or Remote" autoComplete="address-level2" />
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
          <input className={inputCls} value={content.headline} data-score-target="headline" onChange={(e) => setContent((c) => ({ ...c, headline: e.target.value }))} placeholder="Senior Software Engineer | Full-Stack Developer" />
        </Field>
        <div>
          <Field label="Summary">
            <textarea className={`${textareaCls} min-h-[160px]`} value={content.summary} data-score-target="summary" onChange={(e) => setContent((c) => ({ ...c, summary: e.target.value }))} placeholder="Write a compelling professional summary highlighting your key achievements and career goals..." />
          </Field>
          <p className="mt-2 text-[13px] text-[#66647c]">{content.summary.length}/500 characters recommended</p>
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
            "experience.add",
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
          const rewrites = (enhanceResult ?? []).filter((rw) => rw.experienceId === ex.id && !dismissed.has(rw.bulletId));
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
            // Phones: no inner frame, so long bullets get the card's full width (canvas App-Editor-mobile).
            <div key={ex.id} className="rounded-[20px] pb-2 sm:border-[1.5px] sm:border-[#c9c0ff] sm:p-5">
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
                  <input className={inputCls} value={ex.role} data-score-target={`exp:${ex.id}:role`} onChange={(e) => setExp(ex.id, { role: e.target.value })} placeholder="Product Manager" />
                </Field>
                <Field label="Company">
                  <input className={inputCls} value={ex.company} data-score-target={`exp:${ex.id}:company`} onChange={(e) => setExp(ex.id, { company: e.target.value })} placeholder="Company name" />
                </Field>
                <Field label="Start">
                  <input className={inputCls} value={ex.start} data-score-target={`exp:${ex.id}:start`} onChange={(e) => setExp(ex.id, { start: e.target.value })} placeholder="Jun 2022" />
                </Field>
                <Field label="End">
                  <input className={inputCls} value={ex.end} data-score-target={`exp:${ex.id}:end`} onChange={(e) => setExp(ex.id, { end: e.target.value })} placeholder="Dec 2023 or Present" />
                </Field>
                <Field label="Location" hint="optional" className="sm:col-span-2">
                  <input className={inputCls} value={ex.location ?? ""} onChange={(e) => setExp(ex.id, { location: e.target.value })} placeholder="City, state — or Remote" />
                </Field>
              </div>

              <p id={`${ex.id}-bullets`} className="mb-2 mt-[18px] text-[13px] font-bold text-[#4a4862]">Bullets</p>
              <p id={`${ex.id}-bullets-help`} className="sr-only">
                Enter adds the next bullet. Alt plus the up or down arrow moves a bullet; so do the arrow keys on its drag handle.
              </p>
              {ex.bullets.length > 0 ? (
                <ul aria-labelledby={`${ex.id}-bullets`} className="flex flex-col gap-1.5">
                  {ex.bullets.map((b, i) => {
                    const rw = rewrites.find((r) => r.bulletId === b.id);
                    // "No result" waits while the bullet is being typed; the other chips are about what's already there.
                    const chips = (score.bullets[b.id] ?? []).filter((ch) => !(ch.kind === "no-result" && typingBullet === b.id));
                    const n = ex.bullets.length;
                    const note = retryNote?.bulletId === b.id ? retryNote : null;
                    return (
                      <li key={b.id} data-bullet-id={b.id} className="flex flex-col gap-1.5">
                        <div
                          className={`flex items-start gap-0.5 rounded-[14px] bg-[#f7f6fb] pl-1 transition-shadow focus-within:ring-2 focus-within:ring-[#5440e8] ${
                            draggingId === b.id ? "relative z-10 shadow-[0_14px_28px_-14px_rgba(36,24,120,0.55)] ring-2 ring-[#c9c0ff]" : ""
                          }`}
                        >
                          <button
                            type="button"
                            ref={(node) => { if (node) handleEls.current.set(b.id, node); else handleEls.current.delete(b.id); }}
                            aria-label={`Move bullet ${i + 1} of ${n}`}
                            aria-describedby={`${ex.id}-bullets-help`}
                            onPointerDown={(e) => onHandlePointerDown(e, ex.id, b.id)}
                            onKeyDown={(e) => {
                              const to = e.key === "ArrowUp" ? i - 1 : e.key === "ArrowDown" ? i + 1 : e.key === "Home" ? 0 : e.key === "End" ? n - 1 : null;
                              if (to === null) return;
                              e.preventDefault();
                              if (moveBullet(ex.id, b.id, to, "handle")) announceMove(ex.id, to);
                            }}
                            className={`inline-flex h-11 w-8 shrink-0 touch-none select-none items-center justify-center rounded-[10px] text-[#9a97b0] transition-colors hover:text-[#4a4862] focus-visible:rounded-[10px]! ${
                              draggingId === b.id ? "cursor-grabbing" : "cursor-grab"
                            }`}
                          >
                            <GripVertical className="h-4 w-4" aria-hidden="true" />
                          </button>
                          <AutoGrowTextarea
                            aria-label={`Bullet ${i + 1}`}
                            aria-describedby={chips.length ? `${b.id}-flag` : undefined}
                            data-score-target={`bullet:${b.id}`}
                            onFocus={() => setTypingBullet(b.id)}
                            onBlur={() => setTypingBullet((cur) => (cur === b.id ? null : cur))}
                            inputRef={(node) => { if (node) bulletEls.current.set(b.id, node); else bulletEls.current.delete(b.id); }}
                            className="block min-h-11 min-w-0 flex-1 resize-none overflow-hidden bg-transparent px-1.5 py-[11px] text-[16px] leading-[22px] text-[#121226] outline-none placeholder:text-[#706e88] focus-visible:outline-none! sm:text-[14px] sm:leading-[21px] sm:py-3"
                            value={b.text}
                            onChange={(e) => setBulletText(ex.id, b.id, oneLine(e.target.value))}
                            onKeyDown={(e) => {
                              if (e.nativeEvent.isComposing) return;
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addBullet(ex.id, b.id);
                              } else if (e.altKey && (e.key === "ArrowUp" || e.key === "ArrowDown")) {
                                e.preventDefault();
                                const to = e.key === "ArrowUp" ? i - 1 : i + 1;
                                if (moveBullet(ex.id, b.id, to, "text")) announceMove(ex.id, to);
                              } else if (e.key === "Backspace" && b.text === "" && n > 1) {
                                // An empty bullet goes away on Backspace, like a list in a text editor.
                                e.preventDefault();
                                const prev = ex.bullets[i - 1] ?? ex.bullets[i + 1];
                                removeBullet(ex.id, b.id);
                                if (prev) focusNext.current = { id: prev.id, part: "text", caret: "end" };
                              }
                            }}
                            placeholder="Describe an achievement..."
                          />
                          <button
                            type="button"
                            aria-label={`Remove bullet ${i + 1}`}
                            onClick={() => removeBullet(ex.id, b.id)}
                            className={iconBtn}
                          >
                            <X className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>
                        {chips.length ? (
                          <p id={`${b.id}-flag`} className="-mt-0.5 flex flex-wrap gap-1 pl-9">
                            {chips.map((ch) => (
                              <span key={ch.kind} title={ch.hint} className={`rounded-full px-2 py-[3px] text-[12px] font-bold leading-[14px] ${CHIP_TONE[ch.kind]}`}>
                                {ch.label}
                                <span className="sr-only">: {ch.hint}</span>
                              </span>
                            ))}
                          </p>
                        ) : null}
                        {rw ? (
                          <div className="rounded-2xl bg-[#5440e8] px-4 py-3.5 text-white" aria-busy={retrying === b.id || undefined}>
                            <p className="inline-flex items-center gap-1.5 text-[12px] font-extrabold tracking-[0.06em] text-[#e4dfff]">
                              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" /> SUGGESTED REWRITE
                              <span className="sr-only"> for bullet {i + 1}</span>
                            </p>
                            <p className="mt-2 text-[15px] font-semibold leading-[22px]">{rw.improved}</p>
                            {rw.change_summary ? <p className="mt-1 text-[13px] leading-5 text-[#e4dfff]">{rw.change_summary}</p> : null}
                            <p className="mt-1.5 text-[12px] leading-[18px] text-[#e4dfff]">
                              Uses only your facts{rw.improved.includes("[number]") ? " — replace [number] with your real figure." : "."}
                            </p>
                            <div className="mt-3 flex flex-wrap items-center gap-1.5">
                              {b.text === rw.improved ? (
                                <>
                                  <span className="inline-flex min-h-10 items-center gap-1.5 pr-2 text-[13px] font-bold text-white">
                                    <Check className="h-4 w-4" aria-hidden="true" /> Applied
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => setDismissed((s) => new Set(s).add(b.id))}
                                    className="inline-flex min-h-10 items-center rounded-full px-3.5 text-[13px] font-bold text-[#e4dfff] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-white!"
                                  >
                                    Close<span className="sr-only"> suggestion for bullet {i + 1}</span>
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    type="button"
                                    onClick={() => setBulletText(ex.id, b.id, rw.improved)}
                                    className="inline-flex min-h-10 items-center rounded-full bg-white px-3.5 text-[13px] font-bold text-[#121226] transition-colors hover:bg-[#e4dfff] focus-visible:outline-white!"
                                  >
                                    Use this<span className="sr-only"> rewrite for bullet {i + 1}</span>
                                  </button>
                                  <button
                                    type="button"
                                    disabled={retrying !== null}
                                    onClick={() => void retryRewrite(rw)}
                                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-white/[0.14] px-3.5 text-[13px] font-bold text-white transition-colors hover:bg-white/25 focus-visible:outline-white! disabled:opacity-70"
                                  >
                                    {retrying === b.id ? <Loader2 className="h-3.5 w-3.5 motion-safe:animate-spin" aria-hidden="true" /> : null}
                                    {retrying === b.id ? "Trying another…" : "Try another"}
                                    <span className="sr-only"> rewrite for bullet {i + 1}</span>
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => { setDismissed((s) => new Set(s).add(b.id)); focusNext.current = { id: b.id, part: "text" }; }}
                                    className="inline-flex min-h-10 items-center rounded-full px-3.5 text-[13px] font-bold text-[#e4dfff] transition-colors hover:bg-white/10 hover:text-white focus-visible:outline-white!"
                                  >
                                    Keep mine<span className="sr-only"> for bullet {i + 1}</span>
                                  </button>
                                </>
                              )}
                            </div>
                            {note ? (
                              <p role="status" className="mt-2.5 text-[13px] leading-5 text-white">
                                {note.message}{" "}
                                {note.upgrade ? (
                                  <Link href="/dashboard/settings/subscription" className="font-bold underline underline-offset-2">See plans</Link>
                                ) : null}
                              </p>
                            ) : null}
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
                <button type="button" data-score-target={`exp:${ex.id}:addBullet`} onClick={() => addBullet(ex.id)} className={textBtn}>
                  <Plus className="h-4 w-4" aria-hidden="true" /> Add bullet
                </button>
              </div>
            </div>
          );
        })}

        <button type="button" data-score-target="experience.add" onClick={addExp} className={dashedBtn}>
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
          {renderEmptyState(GraduationCap, "No education added yet", "Add degrees, universities or bootcamps.", "Add education", addEdu, "education.add")}
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
                  <input className={inputCls} value={ed.school} data-score-target={`edu:${ed.id}:school`} onChange={(e) => setEdu(ed.id, { school: e.target.value })} placeholder="School name" />
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
        <button type="button" data-score-target="education.add" onClick={addEdu} className={dashedBtn}>
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
          {renderEmptyState(ShieldCheck, "No certifications yet", "Add AWS, Google, PMP and other certifications, courses or licenses.", "Add certification", addCert, "certifications.add")}
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
        <button type="button" data-score-target="certifications.add" onClick={addCert} className={dashedBtn}>
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
            data-score-target="skills.add"
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

  const saveLabel = saving ? "Saving…" : error ? "Not saved" : "Saved";

  /** LaunchCV Score card and the "Target a job" panel. Rendered once: in the side column from xl up, under the form below it. */
  function renderScorePanels(className: string) {
    return (
      <div className={`flex flex-col gap-3 ${className}`}>
        <ScoreCard score={score} onJump={jumpTo} />
        <KeywordPanel
          resumeId={resumeId}
          jd={jd}
          onJdChange={setJd}
          score={score}
          skills={content.skills}
          onJump={jumpTo}
          onAddSkill={addSkillFromJob}
        />
      </div>
    );
  }

  function renderPreviewColumn() {
    return (
      <div
        className={`${mobileView === "edit" ? "hidden xl:flex" : "flex"} mx-auto w-full max-w-[560px] flex-col gap-3 lg:col-start-2 xl:sticky xl:top-6 xl:col-start-auto xl:max-h-[calc(100vh-48px)] xl:max-w-none xl:overflow-y-auto xl:overscroll-contain xl:rounded-[22px] xl:p-1 xl:-m-1`}
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
            <span className={saving ? "text-[#3a2bb8]" : error ? "text-[#a3222a]" : ""}>{saveLabel}</span>
          </span>
        </div>

        {isXl ? renderScorePanels("") : null}

        <div id="resume-preview" className="scroll-mt-4 rounded-[28px] bg-[#c9c0ff] p-4 sm:p-6">
          <div className="lc-float rounded-[6px]">
            <ResumePreview content={content} regionMode={regionMode} title={title} template={template} />
          </div>
        </div>
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

  const badge = error
    ? { cls: "bg-[#fbe2e3] text-[#8f1d22]", text: "Not saved" }
    : saving
      ? { cls: "bg-[#e4dfff] text-[#3a2bb8]", text: "Saving…" }
      : { cls: "bg-[#dcf5ea] text-[#0b4f35]", text: "Saved" };

  return (
    <div className={`lc-site ${siteFontVars} min-h-screen`}>
      <header className="border-b border-[#e2e0ea] bg-white">
        {/* Three columns from xl up, so the tool tabs sit in the middle whatever the side columns hold. */}
        <div className="flex items-center gap-3 px-4 py-3 sm:gap-5 sm:px-7 sm:py-3.5 xl:grid xl:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 sm:gap-3">
            <Link
              href="/dashboard/resumes"
              aria-label="Back to resumes"
              className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#f1eff8] text-[#121226] transition-colors hover:bg-[#e4dfff] focus-visible:rounded-full! sm:h-10 sm:w-10"
            >
              <ArrowLeft className="h-[18px] w-[18px]" aria-hidden="true" />
            </Link>
            <h1 className="min-w-0 flex-1 truncate text-[15px] font-bold text-[#121226] sm:flex-initial sm:text-[16px]">{title}</h1>
            <span role="status" className={`shrink-0 rounded-full px-2.5 py-[5px] text-[12px] font-bold ${badge.cls}`}>
              {badge.text}
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

          {/* Phones get Word and PDF in the bar at the bottom of the page instead. */}
          <div className="flex shrink-0 items-center gap-2 max-sm:hidden xl:justify-self-end">
            <a
              href={`/api/resumes/${resumeId}/docx`}
              download
              className={`${pill} shrink-0 bg-[#f1eff8] text-[14px] text-[#121226] hover:bg-[#e4dfff]`}
            >
              <span><span className="sr-only">Download as </span>Word</span>
            </a>
            <button type="button" onClick={onPdfExportClick} className={`${btnDarkSm} shrink-0`}>
              <Download className="h-4 w-4" aria-hidden="true" /> <span><span className="sr-only">Download </span>PDF</span>
            </button>
          </div>
        </div>

        {/* Tablets: the tools on a row of their own. Phones reach them from "More" in the bottom bar. */}
        <nav aria-label="Resume tools" className="hidden overflow-x-auto border-t border-[#e2e0ea] sm:block xl:hidden">
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

      <main className="mx-auto max-w-[1480px] px-4 pb-14 pt-4 sm:px-6 sm:pt-6 lg:px-10 lg:pt-8">
        {/* Edit / Preview toggle (below the three-column layout) */}
        <div className="mb-4 flex items-center gap-2 xl:hidden">
        <div role="group" aria-label="View" className="flex flex-1 gap-1 rounded-full bg-white p-1 lg:max-w-[360px] lg:flex-initial lg:basis-[360px]">
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
          <button
            type="button"
            onClick={() => {
              const card = document.getElementById("lcv-score");
              card?.scrollIntoView({ block: "start", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
            }}
            className="inline-flex min-h-[52px] shrink-0 items-center gap-2 rounded-full bg-white pl-1.5 pr-4 text-[14px] font-bold text-[#121226] transition-colors hover:bg-[#e4dfff]"
          >
            <span aria-hidden="true">
              <ScoreRing score={score.total} size={40} />
            </span>
            <span><span className="sr-only">LaunchCV Score {score.total}. </span>Score</span>
          </button>
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
            <div className="flex flex-wrap items-start gap-x-2 gap-y-3">
              <div className="mr-auto min-w-0 flex-1 basis-[240px] pr-1">
                <h2 id="lc-section-title" className="text-[20px] font-extrabold tracking-[-0.01em] text-[#121226] sm:text-[24px]">{activeMeta.title}</h2>
                <p className="mt-1 text-[14px] text-[#66647c]">{activeMeta.subtitle}</p>
              </div>
              {/* Phones: Import is under "More" and Voice in the bottom bar. */}
              <button type="button" onClick={() => setShowOverwrite(true)} className={`${btnSoftSm} shrink-0 max-sm:hidden`}>
                <UploadCloud className="h-4 w-4" aria-hidden="true" /> Import
              </button>
              {activeTab === "shortbio" || activeTab === "experience" || activeTab === "skills" ? (
                <VoiceInput placeholder="Voice" className="max-sm:hidden" onTranscript={onVoice} />
              ) : null}
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

        {/* Score and job keywords below the form, under the three-column breakpoint */}
        {!isXl ? renderScorePanels("mt-3 lg:ml-[230px]") : null}
        {/* Phones: Voice | PDF, with Import, Word and the other tools under "More". */}
        <div className="mt-3 flex flex-wrap gap-2 sm:hidden">
          <VoiceInput
            placeholder="Voice"
            className="min-h-12! flex-1 justify-center bg-white! text-[15px]! hover:bg-[#e4dfff]!"
            onTranscript={onVoice}
          />
          <button type="button" onClick={onPdfExportClick} className={`${btnDarkSm} min-h-12 flex-1 text-[15px]`}>
            <Download className="h-4 w-4" aria-hidden="true" /> <span><span className="sr-only">Download </span>PDF</span>
          </button>
          <div ref={moreRef} className="relative">
            <button
              type="button"
              aria-expanded={moreOpen}
              aria-controls="lc-editor-more"
              aria-label="More: import, Word and resume tools"
              onClick={() => setMoreOpen((v) => !v)}
              className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-white text-[#121226] transition-colors hover:bg-[#e4dfff] focus-visible:rounded-full!"
            >
              <MoreHorizontal className="h-5 w-5" aria-hidden="true" />
            </button>
            <div
              id="lc-editor-more"
              hidden={!moreOpen}
              className="lc-float absolute bottom-[calc(100%+8px)] right-0 z-30 w-[min(280px,calc(100vw-32px))] rounded-[20px] bg-white p-1.5"
            >
              <button
                type="button"
                onClick={() => { setMoreOpen(false); setShowOverwrite(true); }}
                className="flex min-h-11 w-full items-center gap-2.5 rounded-[14px] px-3.5 text-left text-[15px] font-semibold text-[#121226] hover:bg-[#f1eff8] focus-visible:rounded-[14px]!"
              >
                <UploadCloud className="h-4 w-4 text-[#5440e8]" aria-hidden="true" /> Import a resume
              </button>
              <a
                href={`/api/resumes/${resumeId}/docx`}
                download
                onClick={() => setMoreOpen(false)}
                className="flex min-h-11 w-full items-center gap-2.5 rounded-[14px] px-3.5 text-[15px] font-semibold text-[#121226] hover:bg-[#f1eff8] focus-visible:rounded-[14px]!"
              >
                <Download className="h-4 w-4 text-[#5440e8]" aria-hidden="true" /> Download Word
              </a>
              <nav aria-label="Resume tools" className="mt-1 border-t border-[#e2e0ea] pt-1">
                <ul>
                  {tools.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="flex min-h-11 items-center rounded-[14px] px-3.5 text-[15px] font-semibold text-[#4a4862] hover:bg-[#f1eff8] hover:text-[#121226] focus-visible:rounded-[14px]!">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">{liveMsg}</p>
      </main>

      {renderOverwriteModal()}

      <ExperienceReviewModal open={surveyOpen} onClose={() => setSurveyOpen(false)} context={surveyContext} />
    </div>
  );
}
