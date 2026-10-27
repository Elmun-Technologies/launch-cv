"use client";

import { useState } from "react";
import {
  Check, Copy,
  Loader2, Mail, MessageSquare, Plus, Send, Sparkles, Trash2, X,
} from "lucide-react";

export type TemplateRow = {
  id: string; name: string; subject: string; body: string; category: string;
  createdAt: string; updatedAt: string;
};

type Tab = "ai-email" | "templates";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "ai-email", label: "Write with AI", icon: Sparkles },
  { key: "templates", label: "Saved templates", icon: Mail },
];

const EMAIL_TYPES = ["thank-you", "follow-up", "networking", "introduction", "custom"] as const;
const TONES = ["formal", "friendly", "concise"] as const;
const CATS = ["general", "thank-you", "follow-up", "intro"];

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" onClick={() => { void navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className="inline-flex items-center gap-1.5 rounded-xl border border-[#EEEEEB] px-3 py-1.5 text-[12px] font-medium text-[#6B6B6B] transition hover:border-[#2563EB]/20 hover:bg-[#EEF3FF] hover:text-[#2563EB]">
      {ok ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
      {ok ? "Copied" : label}
    </button>
  );
}

export function ExtensionsClient({ initial, resumes }: { initial: TemplateRow[]; resumes: { id: string; title: string }[] }) {
  const [tab, setTab] = useState<Tab>("ai-email");
  const [rows, setRows] = useState(initial);

  const [emailType, setEmailType] = useState<(typeof EMAIL_TYPES)[number]>("thank-you");
  const [emailTone, setEmailTone] = useState<(typeof TONES)[number]>("friendly");
  const [emailResumeId, setEmailResumeId] = useState(resumes[0]?.id ?? "");
  const [recipientName, setRecipientName] = useState("");
  const [recipientRole, setRecipientRole] = useState("");
  const [emailCompany, setEmailCompany] = useState("");
  const [emailContext, setEmailContext] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailResult, setEmailResult] = useState<{ subject: string; body: string; tips: string[] } | null>(null);
  const [emailErr, setEmailErr] = useState<string | null>(null);

  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [tForm, setTForm] = useState({ name: "", subject: "", body: "", category: "general" });
  const [tSaving, setTSaving] = useState(false);
  const [tErr, setTErr] = useState<string | null>(null);

  async function generateEmail() {
    setEmailLoading(true); setEmailErr(null); setEmailResult(null);
    const r = await fetch("/api/ai/generate-email", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: emailType, tone: emailTone, resumeId: emailResumeId || undefined, recipientName: recipientName || undefined, recipientRole: recipientRole || undefined, company: emailCompany || undefined, context: emailContext || undefined }),
    });
    const j = await r.json().catch(() => ({}));
    setEmailLoading(false);
    if (!r.ok) { setEmailErr(j.error ?? "Failed to generate"); return; }
    if (j.result) setEmailResult(j.result);
  }

  async function saveAsTemplate() {
    if (!emailResult) return;
    await fetch("/api/email-templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: `AI: ${emailType}`, subject: emailResult.subject, body: emailResult.body, category: emailType }) });
    await refreshTemplates();
  }

  async function refreshTemplates() {
    const r = await fetch("/api/email-templates");
    const j = await r.json().catch(() => ({}));
    if (r.ok && Array.isArray(j.templates)) setRows(j.templates);
  }

  async function saveTemplate() {
    if (!tForm.name.trim() || !tForm.subject.trim()) { setTErr("Name and subject required"); return; }
    setTSaving(true); setTErr(null);
    const r = await fetch("/api/email-templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tForm) });
    setTSaving(false);
    if (!r.ok) { const j = await r.json().catch(() => ({})); setTErr(j.error ?? "Error"); return; }
    await refreshTemplates(); setShowTemplateForm(false); setTForm({ name: "", subject: "", body: "", category: "general" });
  }

  async function delTemplate(id: string) {
    await fetch(`/api/email-templates/${id}`, { method: "DELETE" });
    setRows((p) => p.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">
          Email templates <span className="text-[#8A8A86]">— follow-ups, thank-yous, intros.</span>
        </h1>
        <p className="mt-1 text-[15px] text-[#6B6B6B]">Draft an email from your resume with AI, or save your own to reuse.</p>
      </div>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-[#E5E5E2]">
        {TABS.map((t) => (
          <button key={t.key} type="button" role="tab" aria-selected={tab === t.key} onClick={() => setTab(t.key)}
            className={`-mb-px flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-2.5 text-[14px] font-medium transition ${
              tab === t.key ? "border-[#111111] text-[#111111]" : "border-transparent text-[#6B6B6B] hover:text-[#111111]"
            }`}>
            <t.icon className="h-4 w-4" />{t.label}
          </button>
        ))}
      </div>

      {/* ═══ AI Email Generator ═══ */}
      {tab === "ai-email" ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-[#EEEEEB] bg-white p-6">
            <h2 className="flex items-center gap-2 text-[17px] font-semibold text-[#111111]"><Sparkles className="h-5 w-5 text-[#2563EB]" /> AI Email Generator</h2>
            <p className="mt-1 text-[13px] text-[#6B6B6B]">Generate professional emails powered by AI and your resume data.</p>
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="text-[12px] font-semibold text-[#3F3F3F]">Email Type</label>
                  <select className="soha-select mt-1" value={emailType} onChange={(e) => setEmailType(e.target.value as typeof emailType)}>{EMAIL_TYPES.map((t) => <option key={t} value={t}>{t.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}</select>
                </div>
                <div><label className="text-[12px] font-semibold text-[#3F3F3F]">Tone</label>
                  <select className="soha-select mt-1" value={emailTone} onChange={(e) => setEmailTone(e.target.value as typeof emailTone)}>{TONES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select>
                </div>
                <div><label className="text-[12px] font-semibold text-[#3F3F3F]">Recipient Name</label><input className="soha-input mt-1" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Jane Smith" /></div>
                <div><label className="text-[12px] font-semibold text-[#3F3F3F]">Their Role</label><input className="soha-input mt-1" value={recipientRole} onChange={(e) => setRecipientRole(e.target.value)} placeholder="Hiring Manager" /></div>
                <div><label className="text-[12px] font-semibold text-[#3F3F3F]">Company</label><input className="soha-input mt-1" value={emailCompany} onChange={(e) => setEmailCompany(e.target.value)} placeholder="Google" /></div>
                <div><label className="text-[12px] font-semibold text-[#3F3F3F]">Use Resume</label>
                  <select className="soha-select mt-1" value={emailResumeId} onChange={(e) => setEmailResumeId(e.target.value)}><option value="">None</option>{resumes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}</select>
                </div>
              </div>
              <div><label className="text-[12px] font-semibold text-[#3F3F3F]">Additional Context</label><textarea className="soha-textarea mt-1 min-h-[80px]" value={emailContext} onChange={(e) => setEmailContext(e.target.value)} placeholder="I interviewed last Tuesday and want to follow up..." /></div>
              {emailErr ? <p className="text-[13px] text-red-500">{emailErr}</p> : null}
              <button type="button" disabled={emailLoading} onClick={() => void generateEmail()} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2563EB] py-3 text-[14px] font-semibold text-white transition hover:bg-[#1D4ED8] disabled:opacity-60">
                {emailLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {emailLoading ? "Generating..." : "Generate Email"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#EEEEEB] bg-white p-6">
            <h3 className="text-[15px] font-semibold text-[#111111]">Generated Email</h3>
            {emailResult ? (
              <div className="mt-4 space-y-4 animate-fadeIn">
                <div className="rounded-xl border border-[#EEEEEB] bg-[#FAFAF9]/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A86]">Subject</p>
                  <p className="mt-1 text-[14px] font-semibold text-[#111111]">{emailResult.subject}</p>
                </div>
                <div className="rounded-xl border border-[#EEEEEB] bg-[#FAFAF9]/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-[#8A8A86]">Body</p>
                  <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-[#3F3F3F]">{emailResult.body}</p>
                </div>
                {emailResult.tips.length > 0 ? (
                  <div className="rounded-xl bg-[#EEF3FF] p-4">
                    <p className="text-[12px] font-semibold text-[#2563EB]">Tips</p>
                    <ul className="mt-2 space-y-1">{emailResult.tips.map((t, i) => <li key={i} className="text-[12px] text-[#6B6B6B]">• {t}</li>)}</ul>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <CopyBtn text={emailResult.subject} label="Copy Subject" />
                  <CopyBtn text={emailResult.body} label="Copy Body" />
                  <CopyBtn text={`Subject: ${emailResult.subject}\n\n${emailResult.body}`} label="Copy All" />
                  <button type="button" onClick={() => void saveAsTemplate()} className="inline-flex items-center gap-1.5 rounded-full bg-[#2563EB] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#1D4ED8]">
                    <Plus className="h-3 w-3" /> Save as Template
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3FF]"><MessageSquare className="h-7 w-7 text-[#2563EB]" /></div>
                <p className="mt-4 text-[14px] font-medium text-[#6B6B6B]">Your generated email will appear here</p>
                <p className="mt-1 text-[12px] text-[#8A8A86]">Fill in the form and click Generate</p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* ═══ Email Templates ═══ */}
      {tab === "templates" ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-semibold text-[#111111]">Email Templates</h2>
            <button type="button" onClick={() => setShowTemplateForm((s) => !s)} className="inline-flex items-center gap-2 rounded-full bg-[#2563EB] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#1D4ED8]">
              {showTemplateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showTemplateForm ? "Close" : "New Template"}
            </button>
          </div>
          {showTemplateForm ? (
            <div className="animate-fadeIn rounded-2xl border border-[#EEEEEB] bg-white p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="text-[12px] font-semibold text-[#3F3F3F]">Name *</label><input className="soha-input mt-1" value={tForm.name} onChange={(e) => setTForm({ ...tForm, name: e.target.value })} /></div>
                <div><label className="text-[12px] font-semibold text-[#3F3F3F]">Category</label><select className="soha-select mt-1" value={tForm.category} onChange={(e) => setTForm({ ...tForm, category: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></div>
                <div className="sm:col-span-2"><label className="text-[12px] font-semibold text-[#3F3F3F]">Subject *</label><input className="soha-input mt-1" value={tForm.subject} onChange={(e) => setTForm({ ...tForm, subject: e.target.value })} /></div>
                <div className="sm:col-span-2"><label className="text-[12px] font-semibold text-[#3F3F3F]">Body</label><textarea className="soha-textarea mt-1 min-h-[100px]" value={tForm.body} onChange={(e) => setTForm({ ...tForm, body: e.target.value })} /></div>
              </div>
              {tErr ? <p className="mt-2 text-[13px] text-red-500">{tErr}</p> : null}
              <div className="mt-4 flex gap-2">
                <button type="button" disabled={tSaving} onClick={() => void saveTemplate()} className="rounded-full bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1D4ED8]">{tSaving ? <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> : null}Save</button>
                <button type="button" onClick={() => setShowTemplateForm(false)} className="rounded-xl border border-[#EEEEEB] px-4 py-2 text-[13px] font-medium text-[#6B6B6B] hover:bg-[#FAFAF9]">Cancel</button>
              </div>
            </div>
          ) : null}
          {rows.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-[#E5E5E2] py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF3FF]"><Mail className="h-6 w-6 text-[#2563EB]" /></div>
              <p className="mt-4 text-[14px] font-medium text-[#6B6B6B]">No templates yet</p>
              <p className="mt-1 text-[12px] text-[#8A8A86]">Create templates or generate them with AI</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {rows.map((t) => (
                <div key={t.id} className="rounded-2xl border border-[#EEEEEB] bg-white p-5 transition hover:shadow-sm">
                  <div className="flex items-start justify-between"><div><p className="text-[14px] font-semibold text-[#111111]">{t.name}</p><span className="mt-1 inline-block rounded-full bg-[#EEF3FF] px-2 py-0.5 text-[11px] font-semibold text-[#2563EB]">{t.category}</span></div>
                    <button type="button" onClick={() => void delTemplate(t.id)} className="rounded-xl p-2 text-[#A3A3A0] hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button></div>
                  <p className="mt-3 text-[12px] text-[#6B6B6B]">Subject: {t.subject}</p>
                  <p className="mt-1 line-clamp-2 text-[12px] text-[#8A8A86]">{t.body}</p>
                  <div className="mt-3 flex gap-1.5 border-t border-[#EEEEEB] pt-3"><CopyBtn text={t.subject} label="Subject" /><CopyBtn text={t.body} label="Body" /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

    </div>
  );
}
