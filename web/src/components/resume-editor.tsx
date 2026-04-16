"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ResumeContent } from "@/types/resume";
import { ResumePreview, type TemplateStyle } from "@/components/resume-preview";
import { VoiceInput } from "@/components/voice-input";
import { ExperienceReviewModal } from "@/components/experience-review-modal";
import { shouldOfferSatisfactionSurvey } from "@/lib/satisfaction-survey";
import {
  Award, Edit3, Loader2, Check, MessageSquare, Plus, Send, ShieldCheck, Sparkles, Trash2, UploadCloud, X, Download, Save,
  Home, FileText, Briefcase, Users, Building2, HelpCircle, Settings, Puzzle, Gift,
  User, GraduationCap, AlignLeft, Wrench, Mic, ChevronRight, ChevronLeft,
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

const TABS = [
  { key: "details", label: "Your Details", subtitle: "Contact info & personal details", icon: User },
  { key: "experience", label: "Experience", subtitle: "Work history & achievements", icon: Briefcase },
  { key: "education", label: "Education", subtitle: "Degrees & certifications", icon: GraduationCap },
  { key: "shortbio", label: "Short Bio", subtitle: "Summary, headline & template", icon: AlignLeft },
  { key: "skills", label: "Skills", subtitle: "Technical & professional skills", icon: Wrench },
] as const;
type TabKey = (typeof TABS)[number]["key"];

const NAV_TOP = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/dashboard/resumes", icon: FileText, label: "Resumes" },
  { href: "/dashboard/job-tracker", icon: Briefcase, label: "Job Tracker" },
  { href: "/dashboard/contacts", icon: Users, label: "Contacts" },
  { href: "/dashboard/companies", icon: Building2, label: "Companies" },
  { href: "/dashboard/support", icon: HelpCircle, label: "Support" },
];

const NAV_BOTTOM = [
  { href: "/dashboard/settings", icon: Settings, label: "Settings" },
  { href: "/dashboard/settings/email-templates", icon: Puzzle, label: "Templates" },
  { href: "/dashboard/referrals", icon: Gift, label: "Referrals" },
];

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
  const [wantsEmails, setWantsEmails] = useState(true);
  const [agreeTerms, setAgreeTerms] = useState(true);
  const [twitter, setTwitter] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [stateVal, setStateVal] = useState("");
  const [websiteVal, setWebsiteVal] = useState("");
  const [newSkill, setNewSkill] = useState("");
  const [showSkillInput, setShowSkillInput] = useState(false);
  const [template, setTemplate] = useState<TemplateStyle>("classic");
  const [previewFlipped, setPreviewFlipped] = useState(false);
  const [liveScore, setLiveScore] = useState<{ score: number; fixes: string[] } | null>(null);
  const [scoringBusy, setScoringBusy] = useState(false);
  const [enhancing, setEnhancing] = useState(false);
  const [enhanceResult, setEnhanceResult] = useState<Array<{ experienceId: string; bulletId: string; original: string; improved: string; change_summary: string }> | null>(null);
  const [showOverwrite, setShowOverwrite] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [overwriteProfile, setOverwriteProfile] = useState("");
  const [overwriteData, setOverwriteData] = useState("");
  const [deleteEmail, setDeleteEmail] = useState("");
  const [importing, setImporting] = useState(false);
  const [importErr, setImportErr] = useState<string | null>(null);
  const [linkedinText, setLinkedinText] = useState("");
  const [linkedinImporting, setLinkedinImporting] = useState(false);
  const [bioNoteText, setBioNoteText] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const savedTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const surveyDelayRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pathname = usePathname();
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

  function onPdfExportClick() {
    window.open(`/api/resumes/${resumeId}/pdf`, "_blank", "noopener,noreferrer");
    if (!shouldOfferSatisfactionSurvey()) return;
    if (surveyDelayRef.current != null) return;
    setSurveyContext("pdf_export");
    surveyDelayRef.current = setTimeout(() => {
      surveyDelayRef.current = null;
      setSurveyOpen(true);
    }, 2200);
  }

  const addExp = () => setContent((c) => ({ ...c, experience: [...c.experience, { id: uid(), company: "", role: "", start: "", end: "", location: "", bullets: [] }] }));
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

  const firstName = content.contact.fullName?.split(" ")[0] ?? "";
  const lastName = content.contact.fullName?.split(" ").slice(1).join(" ") ?? "";
  function setName(f: string, l: string) { setContent((c) => ({ ...c, contact: { ...c.contact, fullName: `${f} ${l}`.trim() } })); }

  const activeTabIdx = TABS.findIndex((t) => t.key === activeTab);

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

  function renderNavFooter() {
    const isLast = activeTabIdx === TABS.length - 1;
    const isFirst = activeTabIdx === 0;
    return (
      <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-5">
        <button
          type="button"
          onClick={prevTab}
          disabled={isFirst}
          className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2.5 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex items-center gap-1.5">
          {TABS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === activeTabIdx ? "w-6 bg-[#7C5CFC]" : i < activeTabIdx ? "w-1.5 bg-[#7C5CFC]/40" : "w-1.5 bg-gray-200"}`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={() => { void doSave(); nextTab(); }}
          className="inline-flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]"
        >
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
          {isLast ? "Save & Finish" : "Save & Next"}
          {!isLast && <ChevronRight className="h-4 w-4" />}
        </button>
      </div>
    );
  }

  function renderEmptyState(icon: React.ElementType, title: string, desc: string, actionLabel: string, onAction: () => void) {
    const Icon = icon;
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 bg-gray-50/50 px-6 py-12 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
          <Icon className="h-7 w-7 text-[#7C5CFC]" />
        </div>
        <h3 className="mt-4 text-[16px] font-bold text-gray-900">{title}</h3>
        <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-gray-500">{desc}</p>
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]"
        >
          <Plus className="h-4 w-4" /> {actionLabel}
        </button>
      </div>
    );
  }

  function renderDetailsTab() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-[18px] font-bold text-gray-900">Contact Information</h2>
          <p className="mt-1 text-[13px] text-gray-500">This is how recruiters will reach you</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[13px] font-semibold text-gray-700">First Name <span className="text-red-400">*</span></label>
            <input className="soha-input mt-1.5" value={firstName} onChange={(e) => setName(e.target.value, lastName)} placeholder="John" />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-gray-700">Last Name <span className="text-red-400">*</span></label>
            <input className="soha-input mt-1.5" value={lastName} onChange={(e) => setName(firstName, e.target.value)} placeholder="Doe" />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-gray-700">Email <span className="text-red-400">*</span></label>
            <input className="soha-input mt-1.5" type="email" value={content.contact.email} onChange={(e) => setContent((c) => ({ ...c, contact: { ...c.contact, email: e.target.value } }))} placeholder="john@example.com" />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-gray-700">Phone <span className="text-red-400">*</span></label>
            <input className="soha-input mt-1.5" value={content.contact.phone ?? ""} onChange={(e) => setContent((c) => ({ ...c, contact: { ...c.contact, phone: e.target.value } }))} placeholder="+1 (555) 123-4567" />
          </div>
        </div>

        <div>
          <label className="text-[13px] font-semibold text-gray-700">LinkedIn</label>
          <div className="mt-1.5 flex">
            <span className="flex items-center rounded-l-xl border border-r-0 border-gray-200 bg-gray-50 px-3 text-[13px] text-gray-400">https://</span>
            <input className="soha-input rounded-l-none" value={(content.contact.links ?? [])[0]?.replace(/^https?:\/\//i, "") ?? ""} onChange={(e) => setContent((c) => ({ ...c, contact: { ...c.contact, links: [`https://${e.target.value.replace(/^https?:\/\//i, "")}`] } }))} placeholder="linkedin.com/in/your-name" />
          </div>
        </div>

        <div>
          <label className="text-[13px] font-semibold text-gray-700">Twitter / X</label>
          <input className="soha-input mt-1.5" value={twitter} onChange={(e) => setTwitter(e.target.value)} placeholder="@username" />
        </div>

        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-[16px] font-bold text-gray-900">Address</h3>
          <p className="mt-1 text-[12px] text-gray-400">Optional — some jobs require a location</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-[13px] font-semibold text-gray-700">Address</label>
            <input className="soha-input mt-1.5" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="123 Main St" />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-gray-700">City</label>
            <input className="soha-input mt-1.5" value={city} onChange={(e) => setCity(e.target.value)} placeholder="San Francisco" />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-gray-700">State</label>
            <input className="soha-input mt-1.5" value={stateVal} onChange={(e) => setStateVal(e.target.value)} placeholder="CA" />
          </div>
          <div>
            <label className="text-[13px] font-semibold text-gray-700">Website</label>
            <input className="soha-input mt-1.5" value={websiteVal} onChange={(e) => setWebsiteVal(e.target.value)} placeholder="www.example.com" />
          </div>
        </div>

        <div className="space-y-2.5 border-t border-gray-100 pt-5">
          <label className="inline-flex items-center gap-2.5 text-[13px] text-gray-600">
            <input type="checkbox" checked={wantsEmails} onChange={(e) => setWantsEmails(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#7C5CFC] focus:ring-[#7C5CFC]" />
            Yes, I want to receive career tips via email
          </label>
          <label className="inline-flex items-center gap-2.5 text-[13px] text-gray-600">
            <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-[#7C5CFC] focus:ring-[#7C5CFC]" />
            I agree to the Terms, Privacy and Fees
          </label>
        </div>

        {renderNavFooter()}
      </div>
    );
  }

  function renderExperienceTab() {
    if (content.experience.length === 0) {
      return (
        <div className="space-y-5">
          {renderEmptyState(
            Briefcase,
            "No experience added yet",
            "Click the button below or use voice input to describe your work history. Our AI will help you write impactful bullet points.",
            "Add Experience",
            addExp,
          )}
          {renderNavFooter()}
        </div>
      );
    }

    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-[18px] font-bold text-gray-900">Experience</h2>
          <p className="mt-1 text-[13px] text-gray-500">Add your work history, most recent first</p>
        </div>
        {content.experience.map((ex) => (
          <div key={ex.id} className="rounded-xl border border-gray-100 bg-white p-4 transition hover:shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-gray-900">{ex.role || ex.company || "New Experience"}{ex.company && ex.role ? ` at ${ex.company}` : ""}</h3>
              <button type="button" onClick={() => delExp(ex.id)} className="rounded-lg p-1.5 text-gray-300 transition hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
            </div>
            <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
              <input className="soha-input" value={ex.role} onChange={(e) => setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === ex.id ? { ...x, role: e.target.value } : x) }))} placeholder="Job Title" />
              <input className="soha-input" value={ex.company} onChange={(e) => setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === ex.id ? { ...x, company: e.target.value } : x) }))} placeholder="Company" />
              <input className="soha-input" value={ex.location ?? ""} onChange={(e) => setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === ex.id ? { ...x, location: e.target.value } : x) }))} placeholder="Location" />
              <input className="soha-input" value={`${ex.start}${ex.end ? ` - ${ex.end}` : ""}`} onChange={(e) => { const parts = e.target.value.split(" - "); setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === ex.id ? { ...x, start: parts[0] ?? "", end: parts[1] ?? "" } : x) })); }} placeholder="Jun 2022 - Dec 2023" />
            </div>

            {ex.bullets.length > 0 && (
              <div className="mt-3 space-y-1.5 border-t border-gray-50 pt-3">
                {ex.bullets.map((b) => (
                  <div key={b.id} className="group flex items-start gap-2">
                    <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gray-300" />
                    <input className="soha-input flex-1 !border-0 !bg-transparent !px-0 !shadow-none" value={b.text} onChange={(e) => setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === ex.id ? { ...x, bullets: x.bullets.map((bb) => bb.id === b.id ? { ...bb, text: e.target.value } : bb) } : x) }))} placeholder="Describe an achievement..." />
                    <button type="button" onClick={() => setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === ex.id ? { ...x, bullets: x.bullets.filter((bb) => bb.id !== b.id) } : x) }))} className="mt-2 text-gray-200 opacity-0 transition group-hover:opacity-100 hover:text-red-500"><X className="h-3.5 w-3.5" /></button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-3 border-t border-gray-50 pt-3">
              <button type="button" onClick={() => addBullet(ex.id)} className="inline-flex items-center gap-1 text-[13px] font-medium text-[#7C5CFC] transition hover:text-[#6B4CE0]"><Plus className="h-3.5 w-3.5" />Add achievement</button>
              <VoiceInput
                placeholder="Speak to add bullet"
                onTranscript={(text) => {
                  const newBullet = { id: uid(), text: text.trim(), evidenceIds: [] as string[] };
                  setContent((c) => ({ ...c, experience: c.experience.map((x) => x.id === ex.id ? { ...x, bullets: [...x.bullets, newBullet] } : x) }));
                }}
              />
            </div>
          </div>
        ))}

        <div className="flex flex-wrap gap-3">
          <button type="button" onClick={addExp} className="inline-flex items-center gap-1.5 rounded-xl bg-[#7C5CFC] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]"><Plus className="h-4 w-4" />Add Experience</button>
          <button type="button" disabled={enhancing || content.experience.length === 0} onClick={async () => {
            setEnhancing(true); setEnhanceResult(null);
            const r = await fetch("/api/ai/impact-rewrite", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeId }) });
            const j = await r.json().catch(() => ({}));
            setEnhancing(false);
            if (r.ok && j.result?.rewrites) setEnhanceResult(j.result.rewrites);
          }} className="inline-flex items-center gap-1.5 rounded-xl border-2 border-[#7C5CFC] px-5 py-2.5 text-[13px] font-semibold text-[#7C5CFC] transition hover:bg-violet-50 disabled:opacity-50">
            {enhancing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {enhancing ? "Enhancing..." : "Enhance All with AI"}
          </button>
        </div>

        {enhanceResult ? (
          <div className="mt-2 space-y-2.5 rounded-2xl border border-violet-100 bg-violet-50/30 p-5">
            <h3 className="flex items-center gap-2 text-[14px] font-bold text-[#7C5CFC]">
              <Sparkles className="h-4 w-4" /> AI-Enhanced Bullets
            </h3>
            {enhanceResult.map((rw) => (
              <div key={`${rw.experienceId}-${rw.bulletId}`} className="rounded-xl border border-violet-100 bg-white p-4">
                <p className="text-[12px] text-gray-400 line-through">{rw.original}</p>
                <p className="mt-1.5 text-[13px] font-medium text-gray-900">{rw.improved}</p>
                <p className="mt-1 text-[12px] text-[#7C5CFC]">{rw.change_summary}</p>
                <button type="button" onClick={() => {
                  setContent((c) => ({ ...c, experience: c.experience.map((ex) => ex.id === rw.experienceId ? { ...ex, bullets: ex.bullets.map((b) => b.id === rw.bulletId ? { ...b, text: rw.improved } : b) } : ex) }));
                }} className="mt-2.5 rounded-lg bg-[#7C5CFC] px-3.5 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#6B4CE0]">Apply</button>
              </div>
            ))}
          </div>
        ) : null}

        {renderNavFooter()}
      </div>
    );
  }

  function renderEducationTab() {
    const certs = content.certifications ?? [];
    const achievements = content.achievements ?? [];
    const recs = content.recommendations ?? [];

    return (
      <div className="space-y-8">
        {/* ── Section 1: Education / Universities ── */}
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-50"><GraduationCap className="h-4 w-4 text-[#7C5CFC]" /></div>
            <div><h2 className="text-[16px] font-bold text-gray-900">Education</h2><p className="text-[11px] text-gray-400">Degrees, universities, bootcamps</p></div>
          </div>
          {content.education.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-6 text-center">
              <p className="text-[13px] text-gray-400">No education added yet</p>
              <button type="button" onClick={addEdu} className="mt-3 inline-flex items-center gap-1.5 rounded-xl bg-[#7C5CFC] px-4 py-2 text-[12px] font-semibold text-white"><Plus className="h-3.5 w-3.5" />Add Education</button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {content.education.map((ed) => (
                <div key={ed.id} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-bold text-gray-900">{ed.school || "New School"}</p>
                    <button type="button" onClick={() => delEdu(ed.id)} className="rounded-lg p-1 text-gray-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input className="soha-input" value={ed.school} onChange={(e) => setContent((c) => ({ ...c, education: c.education.map((x) => x.id === ed.id ? { ...x, school: e.target.value } : x) }))} placeholder="School name" />
                    <input className="soha-input" value={ed.degree} onChange={(e) => setContent((c) => ({ ...c, education: c.education.map((x) => x.id === ed.id ? { ...x, degree: e.target.value } : x) }))} placeholder="Degree (e.g. B.S. Computer Science)" />
                    <input className="soha-input" value={ed.start} onChange={(e) => setContent((c) => ({ ...c, education: c.education.map((x) => x.id === ed.id ? { ...x, start: e.target.value } : x) }))} placeholder="Start year" />
                    <input className="soha-input" value={ed.end} onChange={(e) => setContent((c) => ({ ...c, education: c.education.map((x) => x.id === ed.id ? { ...x, end: e.target.value } : x) }))} placeholder="End year" />
                    <input className="soha-input" value={ed.gpa ?? ""} onChange={(e) => setContent((c) => ({ ...c, education: c.education.map((x) => x.id === ed.id ? { ...x, gpa: e.target.value } : x) }))} placeholder="GPA (optional, e.g. 3.8/4.0)" />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addEdu} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7C5CFC]"><Plus className="h-3.5 w-3.5" />Add Another</button>
            </div>
          )}
        </div>

        {/* ── Section 2: Certifications ── */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50"><ShieldCheck className="h-4 w-4 text-amber-600" /></div>
            <div><h2 className="text-[16px] font-bold text-gray-900">Certifications & Licenses</h2><p className="text-[11px] text-gray-400">Professional certifications, courses, licenses</p></div>
          </div>
          {certs.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-5 text-center">
              <p className="text-[13px] text-gray-400">No certifications yet — add AWS, Google, PMP, etc.</p>
              <button type="button" onClick={addCert} className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7C5CFC]"><Plus className="h-3.5 w-3.5" />Add Certification</button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {certs.map((c) => (
                <div key={c.id} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-bold text-gray-900">{c.name || "New Certification"}</p>
                    <button type="button" onClick={() => delCert(c.id)} className="rounded-lg p-1 text-gray-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input className="soha-input" value={c.name} onChange={(e) => setContent((ct) => ({ ...ct, certifications: (ct.certifications ?? []).map((x) => x.id === c.id ? { ...x, name: e.target.value } : x) }))} placeholder="Certification name (e.g. AWS Solutions Architect)" />
                    <input className="soha-input" value={c.issuer} onChange={(e) => setContent((ct) => ({ ...ct, certifications: (ct.certifications ?? []).map((x) => x.id === c.id ? { ...x, issuer: e.target.value } : x) }))} placeholder="Issuing organization" />
                    <input className="soha-input" value={c.date} onChange={(e) => setContent((ct) => ({ ...ct, certifications: (ct.certifications ?? []).map((x) => x.id === c.id ? { ...x, date: e.target.value } : x) }))} placeholder="Date obtained" />
                    <input className="soha-input" value={c.url ?? ""} onChange={(e) => setContent((ct) => ({ ...ct, certifications: (ct.certifications ?? []).map((x) => x.id === c.id ? { ...x, url: e.target.value } : x) }))} placeholder="Credential URL (optional)" />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addCert} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7C5CFC]"><Plus className="h-3.5 w-3.5" />Add Another</button>
            </div>
          )}
        </div>

        {/* ── Section 3: Achievements & Awards ── */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50"><Award className="h-4 w-4 text-emerald-600" /></div>
            <div><h2 className="text-[16px] font-bold text-gray-900">Achievements & Awards</h2><p className="text-[11px] text-gray-400">Honors, scholarships, competitions, notable results</p></div>
          </div>
          {achievements.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-5 text-center">
              <p className="text-[13px] text-gray-400">Stand out — add awards, scholarships, or notable achievements</p>
              <button type="button" onClick={addAchievement} className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7C5CFC]"><Plus className="h-3.5 w-3.5" />Add Achievement</button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {achievements.map((a) => (
                <div key={a.id} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-bold text-gray-900">{a.title || "New Achievement"}</p>
                    <button type="button" onClick={() => delAchievement(a.id)} className="rounded-lg p-1 text-gray-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input className="soha-input" value={a.title} onChange={(e) => setContent((c) => ({ ...c, achievements: (c.achievements ?? []).map((x) => x.id === a.id ? { ...x, title: e.target.value } : x) }))} placeholder="Achievement title" />
                    <input className="soha-input" value={a.date ?? ""} onChange={(e) => setContent((c) => ({ ...c, achievements: (c.achievements ?? []).map((x) => x.id === a.id ? { ...x, date: e.target.value } : x) }))} placeholder="Date / Year" />
                    <textarea className="soha-textarea sm:col-span-2" value={a.description} onChange={(e) => setContent((c) => ({ ...c, achievements: (c.achievements ?? []).map((x) => x.id === a.id ? { ...x, description: e.target.value } : x) }))} placeholder="Describe the achievement..." />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addAchievement} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7C5CFC]"><Plus className="h-3.5 w-3.5" />Add Another</button>
            </div>
          )}
        </div>

        {/* ── Section 4: Recommendations ── */}
        <div className="border-t border-gray-100 pt-6">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-50"><MessageSquare className="h-4 w-4 text-blue-600" /></div>
            <div><h2 className="text-[16px] font-bold text-gray-900">Recommendations</h2><p className="text-[11px] text-gray-400">References or recommendation letters from colleagues</p></div>
          </div>
          {recs.length === 0 ? (
            <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-5 text-center">
              <p className="text-[13px] text-gray-400">Add references — recruiters value peer endorsements</p>
              <button type="button" onClick={addRec} className="mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7C5CFC]"><Plus className="h-3.5 w-3.5" />Add Recommendation</button>
            </div>
          ) : (
            <div className="mt-3 space-y-3">
              {recs.map((r) => (
                <div key={r.id} className="rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-[14px] font-bold text-gray-900">{r.recommenderName || "New Recommendation"}</p>
                    <button type="button" onClick={() => delRec(r.id)} className="rounded-lg p-1 text-gray-300 hover:text-red-500"><Trash2 className="h-3.5 w-3.5" /></button>
                  </div>
                  <div className="mt-3 grid gap-2 sm:grid-cols-2">
                    <input className="soha-input" value={r.recommenderName} onChange={(e) => setContent((c) => ({ ...c, recommendations: (c.recommendations ?? []).map((x) => x.id === r.id ? { ...x, recommenderName: e.target.value } : x) }))} placeholder="Recommender name" />
                    <input className="soha-input" value={r.recommenderRole} onChange={(e) => setContent((c) => ({ ...c, recommendations: (c.recommendations ?? []).map((x) => x.id === r.id ? { ...x, recommenderRole: e.target.value } : x) }))} placeholder="Their role (e.g. Engineering Manager)" />
                    <input className="soha-input" value={r.company} onChange={(e) => setContent((c) => ({ ...c, recommendations: (c.recommendations ?? []).map((x) => x.id === r.id ? { ...x, company: e.target.value } : x) }))} placeholder="Company" />
                    <input className="soha-input" value={r.relationship} onChange={(e) => setContent((c) => ({ ...c, recommendations: (c.recommendations ?? []).map((x) => x.id === r.id ? { ...x, relationship: e.target.value } : x) }))} placeholder="Relationship (e.g. Direct Manager)" />
                    <textarea className="soha-textarea sm:col-span-2 min-h-[80px]" value={r.text} onChange={(e) => setContent((c) => ({ ...c, recommendations: (c.recommendations ?? []).map((x) => x.id === r.id ? { ...x, text: e.target.value } : x) }))} placeholder="Recommendation text or key quote..." />
                  </div>
                </div>
              ))}
              <button type="button" onClick={addRec} className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7C5CFC]"><Plus className="h-3.5 w-3.5" />Add Another</button>
            </div>
          )}
        </div>

        {renderNavFooter()}
      </div>
    );
  }

  function renderShortBioTab() {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-[18px] font-bold text-gray-900">Professional Summary &amp; Bio</h2>
          <p className="mt-1 text-[13px] text-gray-500">A strong summary is the first thing recruiters read</p>
        </div>

        <div>
          <label className="text-[13px] font-semibold text-gray-700">Headline</label>
          <input className="soha-input mt-1.5" value={content.headline} onChange={(e) => setContent((c) => ({ ...c, headline: e.target.value }))} placeholder="Senior Software Engineer | Full-Stack Developer" />
        </div>

        <div>
          <label className="text-[13px] font-semibold text-gray-700">Professional Summary</label>
          <textarea className="soha-textarea mt-1.5 min-h-[140px]" value={content.summary} onChange={(e) => setContent((c) => ({ ...c, summary: e.target.value }))} placeholder="Write a compelling professional summary highlighting your key achievements and career goals..." />
          <div className="mt-2 flex items-center justify-between">
            <p className="text-[12px] text-gray-400">{content.summary.length}/500 characters recommended</p>
            <VoiceInput
              placeholder="Speak your summary"
              onTranscript={(text) => setContent((c) => ({ ...c, summary: c.summary + (c.summary ? " " : "") + text.trim() }))}
            />
          </div>
        </div>

        <div className="border-t border-gray-100 pt-5">
          <h3 className="text-[16px] font-bold text-gray-900">Choose Template</h3>
          <p className="mt-1 text-[12px] text-gray-400">This affects how your resume looks when exported</p>
          <div className="mt-4 grid grid-cols-4 gap-3">
            {(["classic", "modern", "minimal", "executive"] as TemplateStyle[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTemplate(t)}
                className={`cursor-pointer rounded-xl border-2 p-3.5 text-center text-[12px] font-semibold capitalize transition ${
                  template === t ? "border-[#7C5CFC] bg-violet-50 text-[#7C5CFC] shadow-sm shadow-violet-100" : "border-gray-200 text-gray-500 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <div className={`mx-auto mb-2.5 h-14 w-11 rounded-lg border-2 ${
                  t === "classic" ? "border-[#7C5CFC] bg-violet-50" :
                  t === "modern" ? "border-purple-400 bg-purple-50" :
                  t === "minimal" ? "border-gray-300 bg-white" :
                  "border-amber-400 bg-amber-50"
                }`} />
                {t}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 border-t border-gray-100 pt-5">
          <button type="button" onClick={() => setShowOverwrite(true)} className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-50">
            <UploadCloud className="h-4 w-4" /> Import LinkedIn / File
          </button>
        </div>

        {renderNavFooter()}
      </div>
    );
  }

  function renderOverwriteModal() {
    if (!showOverwrite) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-gray-900">Import Work History</h3>
            <button type="button" onClick={() => setShowOverwrite(false)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"><X className="h-5 w-5" /></button>
          </div>
          <p className="mt-1 text-[13px] text-gray-500">This will overwrite your current resume content</p>

          <div className="mt-5 space-y-4">
            <div>
              <label className="text-[13px] font-semibold text-gray-700">Paste LinkedIn Profile Text</label>
              <textarea className="soha-textarea mt-1.5 min-h-[100px]" placeholder="Copy your LinkedIn profile page text and paste it here..." value={linkedinText} onChange={(e) => setLinkedinText(e.target.value)} />
              <button type="button" disabled={linkedinImporting || linkedinText.length < 50} onClick={async () => {
                setLinkedinImporting(true); setImportErr(null);
                const r = await fetch("/api/import/linkedin-text", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ text: linkedinText }) });
                const j = await r.json().catch(() => ({}));
                setLinkedinImporting(false);
                if (!r.ok) { setImportErr(j.error ?? "Import failed"); return; }
                if (j.content) { setContent(j.content as ResumeContent); setShowOverwrite(false); setLinkedinText(""); }
              }} className="mt-2.5 inline-flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0] disabled:opacity-50">
                {linkedinImporting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {linkedinImporting ? "Parsing with AI..." : "Import from LinkedIn"}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gray-200" />
              <span className="text-[12px] text-gray-400">or upload a file</span>
              <div className="h-px flex-1 bg-gray-200" />
            </div>

            <label className="flex min-h-[140px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 text-center transition hover:border-[#7C5CFC] hover:bg-violet-50/30">
              <input type="file" className="hidden" accept=".doc,.pdf,.docx" onChange={async (e) => {
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
              {importing ? <Loader2 className="h-8 w-8 animate-spin text-[#7C5CFC]" /> : <UploadCloud className="h-8 w-8 text-[#7C5CFC]" />}
              <p className="mt-2.5 text-[13px] font-medium text-gray-600">{importing ? "Parsing with AI..." : "Drag & drop or click to select a file"}</p>
              <p className="mt-1 text-[12px] text-gray-400">PDF, DOC, DOCX (max 4MB)</p>
            </label>

            {importErr ? <p className="rounded-lg bg-red-50 px-3 py-2 text-[13px] text-red-600">{importErr}</p> : null}
          </div>

          <div className="mt-5 flex gap-3">
            <button type="button" onClick={() => setShowOverwrite(false)} className="flex-1 rounded-xl border border-gray-200 px-5 py-2.5 text-[13px] font-semibold text-gray-600 transition hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  function renderDeleteModal() {
    if (!showDeleteConfirm) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm">
        <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <h3 className="text-[18px] font-bold text-gray-900">Are you sure you want to remove this?</h3>
            <button type="button" onClick={() => setShowDeleteConfirm(false)} className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"><X className="h-5 w-5" /></button>
          </div>
          <p className="mt-2 text-[13px] text-gray-500">This action cannot be undone.</p>
          <div className="mt-4">
            <label className="text-[13px] font-semibold text-gray-700">Confirm by entering email</label>
            <input className="soha-input mt-1.5" placeholder="name@email.com" value={deleteEmail} onChange={(e) => setDeleteEmail(e.target.value)} />
          </div>
          <label className="mt-3 inline-flex items-center gap-2 text-[13px] text-gray-600">
            <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-[#7C5CFC] focus:ring-[#7C5CFC]" />
            Your credentials are encrypted &amp; can be revoked at any time
          </label>
          <div className="mt-5 flex gap-3">
            <button type="button" onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-xl bg-[#7C5CFC] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]">No, Keep</button>
            <button type="button" onClick={() => setShowDeleteConfirm(false)} className="flex-1 rounded-xl border-2 border-red-200 px-5 py-2.5 text-[13px] font-semibold text-red-600 transition hover:bg-red-50">Yes, Delete</button>
          </div>
        </div>
      </div>
    );
  }

  function renderSkillCategory(label: string, items: string[]) {
    if (items.length === 0) return null;
    return (
      <div className="space-y-2.5">
        <h3 className="text-[15px] font-bold text-gray-900">{label}</h3>
        <div className="flex flex-wrap gap-2">
          {items.map((s) => (
            <span key={s} className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-[13px] font-medium text-gray-700 transition hover:border-red-200 hover:bg-red-50">
              {s}
              <button type="button" onClick={() => removeSkill(s)} className="text-gray-300 transition group-hover:text-red-500"><X className="h-3 w-3" /></button>
            </span>
          ))}
        </div>
      </div>
    );
  }

  function renderSkillsTab() {
    if (content.skills.length === 0) {
      return (
        <div className="space-y-5">
          {renderEmptyState(
            Wrench,
            "No skills added yet",
            "Type a skill below and press Enter, or use voice input. Aim for 8-15 relevant skills that match your target role.",
            "Start Adding Skills",
            () => setShowSkillInput(true),
          )}
          <div className="flex gap-2">
            <input className="soha-input flex-1" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addSkillToList(); }} placeholder="Type a skill and press Enter" />
            <button type="button" onClick={addSkillToList} className="rounded-xl bg-[#7C5CFC] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]">Add</button>
          </div>
          {renderNavFooter()}
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-[18px] font-bold text-gray-900">Skills</h2>
          <p className="mt-1 text-[13px] text-gray-500">Skills are auto-grouped. Click the X to remove any skill.</p>
        </div>
        {renderSkillCategory("Industry Knowledge", industrySkills)}
        {renderSkillCategory("Tools & Technologies", toolsSkills)}
        {renderSkillCategory("Other Skills", otherSkills)}
        <div className="border-t border-gray-100 pt-4">
          <label className="text-[13px] font-semibold text-gray-700">Add a new skill</label>
          <div className="mt-1.5 flex gap-2">
            <input className="soha-input flex-1" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") addSkillToList(); }} placeholder="Type a skill and press Enter" />
            <button type="button" onClick={addSkillToList} className="rounded-xl bg-[#7C5CFC] px-5 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]">Add</button>
          </div>
        </div>
        {renderNavFooter()}
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-gray-50">
      <div className="flex min-h-0 flex-1">
        {/* ── Sidebar ── */}
        <aside className="hidden w-[64px] shrink-0 flex-col items-center border-r border-gray-100 bg-white py-4 lg:flex">
          <Link href="/dashboard" className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#7C5CFC] text-[12px] font-bold text-white shadow-sm shadow-violet-200">
            L
          </Link>

          <nav className="mt-5 flex flex-col items-center gap-1">
            {NAV_TOP.map((n) => {
              const isActive = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  title={n.label}
                  className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    isActive
                      ? "bg-violet-50 text-[#7C5CFC]"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }`}
                >
                  <n.icon className="h-[18px] w-[18px]" />
                  <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 lg:block">
                    {n.label}
                  </span>
                </Link>
              );
            })}
          </nav>

          <nav className="mt-auto flex flex-col items-center gap-1">
            {NAV_BOTTOM.map((n) => {
              const isActive = pathname === n.href;
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  title={n.label}
                  className={`group relative flex h-10 w-10 items-center justify-center rounded-xl transition ${
                    isActive
                      ? "bg-violet-50 text-[#7C5CFC]"
                      : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                  }`}
                >
                  <n.icon className="h-[18px] w-[18px]" />
                  <span className="pointer-events-none absolute left-full ml-2 hidden whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 lg:block">
                    {n.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* ── Main Area ── */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-gray-100 bg-white px-6 py-3">
            <div className="min-w-0">
              <h1 className="text-[16px] font-bold text-gray-900">Resume Editor</h1>
              <p className="truncate text-[12px] text-gray-400">{content.contact.fullName || content.headline || title}</p>
            </div>
            <div className="flex items-center gap-2.5">
              <span className="hidden text-[12px] text-gray-400 sm:block">
                {justSaved ? "All changes saved" : saving ? "Saving..." : "Auto-save on"}
              </span>
              <button
                type="button"
                onClick={onPdfExportClick}
                className="inline-flex items-center gap-1.5 rounded-xl border border-gray-200 px-4 py-2 text-[13px] font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                <Download className="h-4 w-4" /> PDF
              </button>
              <button type="button" onClick={() => void doSave()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#7C5CFC] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : justSaved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                {saving ? "Saving..." : justSaved ? "Saved" : "Save"}
              </button>
            </div>
          </header>

          {error ? <div className="bg-red-50 px-6 py-2 text-[13px] font-medium text-red-600">{error}</div> : null}

          <div className="flex-1 overflow-y-auto p-5">
            {/* Tab Navigation */}
            <div className="rounded-2xl border border-gray-100 bg-white p-1.5 shadow-sm">
              <div className="flex items-center gap-1">
                {TABS.map((t, idx) => {
                  const active = t.key === activeTab;
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.key}
                      type="button"
                      onClick={() => setActiveTab(t.key)}
                      className={`group relative flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-[13px] font-semibold transition ${
                        active
                          ? "bg-[#7C5CFC] text-white shadow-sm shadow-violet-200"
                          : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{t.label}</span>
                      {/* Tooltip on hover for subtitle */}
                      <span className="pointer-events-none absolute -bottom-8 left-1/2 z-10 hidden -translate-x-1/2 whitespace-nowrap rounded-lg bg-gray-900 px-2.5 py-1 text-[11px] font-medium text-white opacity-0 shadow-lg transition group-hover:opacity-100 sm:block">
                        {t.subtitle}
                      </span>
                    </button>
                  );
                })}
              </div>
              {/* Step indicator */}
              <div className="mt-1.5 flex items-center justify-center gap-1.5 pb-1">
                <span className="text-[11px] font-medium text-gray-400">Step {activeTabIdx + 1} of {TABS.length}</span>
                <span className="text-gray-300">·</span>
                {TABS.map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 rounded-full transition-all ${i === activeTabIdx ? "w-5 bg-[#7C5CFC]" : i < activeTabIdx ? "w-1.5 bg-[#7C5CFC]/40" : "w-1.5 bg-gray-200"}`}
                  />
                ))}
              </div>
            </div>

            {/* Content Grid */}
            <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1fr)_400px]">
              <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                {activeTab === "details" ? renderDetailsTab() : null}
                {activeTab === "experience" ? renderExperienceTab() : null}
                {activeTab === "education" ? renderEducationTab() : null}
                {activeTab === "shortbio" ? renderShortBioTab() : null}
                {activeTab === "skills" ? renderSkillsTab() : null}
              </div>
              <div className="rounded-2xl border border-gray-100 bg-white shadow-sm" style={{ perspective: "1200px" }}>
                <div
                  className="relative transition-transform duration-600"
                  style={{ transformStyle: "preserve-3d", transform: previewFlipped ? "rotateY(180deg)" : "rotateY(0)" }}
                >
                  {/* Front: Preview — hover overlay + click to flip */}
                  <div
                    className="group relative cursor-pointer overflow-y-auto"
                    style={{ backfaceVisibility: "hidden" }}
                    onClick={async () => {
                      setPreviewFlipped(true);
                      if (!liveScore && !scoringBusy) {
                        setScoringBusy(true);
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
                        setScoringBusy(false);
                      }
                    }}
                  >
                    <div className="p-4">
                      <ResumePreview content={content} regionMode={regionMode} title={title} template={template} />
                    </div>
                    {/* Hover overlay */}
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                      <div className="flex flex-col items-center opacity-0 transition-all duration-300 group-hover:opacity-100">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-xl">
                          <Sparkles className="h-6 w-6 text-[#7C5CFC]" />
                        </div>
                        <p className="mt-3 rounded-full bg-white/90 px-4 py-1.5 text-[13px] font-bold text-gray-900 shadow-lg backdrop-blur">View Score</p>
                      </div>
                    </div>
                  </div>

                  {/* Back: Scoring — click to flip back */}
                  <div
                    className="absolute inset-0 cursor-pointer overflow-y-auto p-5"
                    style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
                    onClick={() => setPreviewFlipped(false)}
                  >
                    <div className="mb-4 border-b border-gray-100 pb-2.5">
                      <p className="text-center text-[11px] text-gray-400">Click anywhere to go back to preview</p>
                    </div>
                    {liveScore ? (
                      <div className="space-y-5">
                        {/* Score Circle */}
                        <div className="flex flex-col items-center py-2">
                          <div className="relative">
                            <svg width="120" height="120" viewBox="0 0 120 120">
                              <circle cx="60" cy="60" r="52" fill="none" stroke="#f0f0f0" strokeWidth="8" />
                              <circle
                                cx="60" cy="60" r="52" fill="none"
                                stroke={liveScore.score >= 70 ? "#10b981" : liveScore.score >= 40 ? "#f59e0b" : "#ef4444"}
                                strokeWidth="8" strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 52}`}
                                strokeDashoffset={`${2 * Math.PI * 52 * (1 - liveScore.score / 100)}`}
                                transform="rotate(-90 60 60)"
                                className="transition-all duration-1000"
                              />
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                              <span className="text-[32px] font-bold text-gray-900">{liveScore.score}</span>
                              <span className="text-[11px] text-gray-400">/100</span>
                            </div>
                          </div>
                          <p className="mt-3 text-[14px] font-bold text-gray-900">
                            {liveScore.score >= 80 ? "Excellent!" : liveScore.score >= 60 ? "Good start!" : liveScore.score >= 40 ? "Needs improvement" : "Needs significant work"}
                          </p>
                          <p className="mt-1 text-[12px] text-gray-500">Based on AI analysis of your resume</p>
                        </div>

                        {/* Quick Stats */}
                        <div className="grid grid-cols-3 gap-2">
                          <div className="rounded-xl bg-gray-50 p-3 text-center">
                            <p className="text-[16px] font-bold text-gray-900">{content.experience.length}</p>
                            <p className="text-[10px] text-gray-400">Jobs</p>
                          </div>
                          <div className="rounded-xl bg-gray-50 p-3 text-center">
                            <p className="text-[16px] font-bold text-gray-900">{content.skills.length}</p>
                            <p className="text-[10px] text-gray-400">Skills</p>
                          </div>
                          <div className="rounded-xl bg-gray-50 p-3 text-center">
                            <p className="text-[16px] font-bold text-gray-900">{content.experience.reduce((s, e) => s + e.bullets.length, 0)}</p>
                            <p className="text-[10px] text-gray-400">Bullets</p>
                          </div>
                        </div>

                        {/* Recommendations */}
                        {liveScore.fixes.length > 0 ? (
                          <div>
                            <h4 className="text-[13px] font-bold text-gray-900">Recommendations</h4>
                            <div className="mt-3 space-y-2">
                              {liveScore.fixes.map((fix, i) => (
                                <div key={i} className="flex items-start gap-2.5 rounded-xl bg-amber-50/50 p-3">
                                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-amber-100 text-[10px] font-bold text-amber-600">{i + 1}</span>
                                  <p className="text-[12px] leading-relaxed text-gray-700">{fix}</p>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {/* Checklist */}
                        <div>
                          <h4 className="text-[13px] font-bold text-gray-900">Completeness</h4>
                          <div className="mt-3 space-y-2">
                            {[
                              { label: "Contact info", done: !!(content.contact.email && content.contact.phone) },
                              { label: "Professional summary", done: content.summary.length > 30 },
                              { label: "Work experience", done: content.experience.length > 0 },
                              { label: "Education", done: content.education.length > 0 },
                              { label: "Skills (8+)", done: content.skills.length >= 8 },
                              { label: "Quantified bullets", done: content.experience.some((e) => e.bullets.some((b) => /\d/.test(b.text))) },
                            ].map((item) => (
                              <div key={item.label} className="flex items-center gap-2.5">
                                <div className={`flex h-5 w-5 items-center justify-center rounded-full ${item.done ? "bg-emerald-100" : "bg-gray-100"}`}>
                                  {item.done ? <Check className="h-3 w-3 text-emerald-600" /> : <X className="h-3 w-3 text-gray-400" />}
                                </div>
                                <span className={`text-[12px] ${item.done ? "text-gray-700" : "text-gray-400"}`}>{item.label}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={async (e) => {
                            e.stopPropagation();
                            setScoringBusy(true);
                            try {
                              const r = await fetch("/api/ai/role-fit", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeId }) });
                              const j = await r.json().catch(() => ({}));
                              if (r.ok && j.result) { setLiveScore({ score: j.result.overall ?? 0, fixes: j.result.prioritized_fixes ?? [] }); }
                              else { setLiveScore({ score: calculateLocalScore(content), fixes: generateLocalFixes(content) }); }
                            } catch { setLiveScore({ score: calculateLocalScore(content), fixes: generateLocalFixes(content) }); }
                            setScoringBusy(false);
                          }}
                          className="w-full rounded-xl border border-gray-200 py-2.5 text-[12px] font-semibold text-gray-600 transition hover:bg-gray-50"
                        >
                          {scoringBusy ? <Loader2 className="mr-1 inline h-3 w-3 animate-spin" /> : null}
                          Re-score Resume
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center py-16 text-center">
                        <Loader2 className="h-8 w-8 animate-spin text-[#7C5CFC]" />
                        <p className="mt-4 text-[14px] font-semibold text-gray-900">Analyzing your resume...</p>
                        <p className="mt-1 text-[12px] text-gray-400">AI is scoring your content</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {renderOverwriteModal()}
      {renderDeleteModal()}
      <ExperienceReviewModal open={surveyOpen} onClose={() => setSurveyOpen(false)} context={surveyContext} />
    </div>
  );
}
