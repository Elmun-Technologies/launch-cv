"use client";

import { useState } from "react";
import {
  Check, Copy, ExternalLink, Globe, Keyboard,
  Loader2, Mail, MessageSquare, Mic, Monitor, Plus, Send, Sparkles, Trash2, X, Zap,
} from "lucide-react";

export type TemplateRow = {
  id: string; name: string; subject: string; body: string; category: string;
  createdAt: string; updatedAt: string;
};

type Tab = "ai-email" | "templates" | "quick-actions" | "integrations" | "shortcuts" | "browser-ext";

const TABS: { key: Tab; label: string; icon: React.ElementType }[] = [
  { key: "ai-email", label: "AI Email", icon: Sparkles },
  { key: "templates", label: "Templates", icon: Mail },
  { key: "quick-actions", label: "Quick Actions", icon: Zap },
  { key: "integrations", label: "Integrations", icon: Globe },
  { key: "shortcuts", label: "Shortcuts", icon: Keyboard },
  { key: "browser-ext", label: "Browser Ext", icon: Monitor },
];

const EMAIL_TYPES = ["thank-you", "follow-up", "networking", "introduction", "custom"] as const;
const TONES = ["formal", "friendly", "concise"] as const;
const CATS = ["general", "thank-you", "follow-up", "intro"];

function CopyBtn({ text, label = "Copy" }: { text: string; label?: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" onClick={() => { void navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className="inline-flex items-center gap-1.5 rounded-xl border border-gray-100 px-3 py-1.5 text-[12px] font-medium text-gray-500 transition hover:border-[#7C5CFC]/20 hover:bg-violet-50 hover:text-[#7C5CFC]">
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
      {/* Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-2xl border border-gray-100 bg-white p-1.5">
        {TABS.map((t) => (
          <button key={t.key} type="button" onClick={() => setTab(t.key)}
            className={`flex items-center gap-2 whitespace-nowrap rounded-xl px-4 py-2.5 text-[13px] font-semibold transition ${
              tab === t.key ? "bg-[#7C5CFC] text-white shadow-sm shadow-violet-500/20" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
            }`}>
            <t.icon className="h-4 w-4" />{t.label}
          </button>
        ))}
      </div>

      {/* ═══ AI Email Generator ═══ */}
      {tab === "ai-email" ? (
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h2 className="flex items-center gap-2 text-[17px] font-bold text-gray-900"><Sparkles className="h-5 w-5 text-[#7C5CFC]" /> AI Email Generator</h2>
            <p className="mt-1 text-[13px] text-gray-500">Generate professional emails powered by AI and your resume data.</p>
            <div className="mt-5 space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="text-[12px] font-semibold text-gray-700">Email Type</label>
                  <select className="soha-select mt-1" value={emailType} onChange={(e) => setEmailType(e.target.value as typeof emailType)}>{EMAIL_TYPES.map((t) => <option key={t} value={t}>{t.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}</option>)}</select>
                </div>
                <div><label className="text-[12px] font-semibold text-gray-700">Tone</label>
                  <select className="soha-select mt-1" value={emailTone} onChange={(e) => setEmailTone(e.target.value as typeof emailTone)}>{TONES.map((t) => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}</select>
                </div>
                <div><label className="text-[12px] font-semibold text-gray-700">Recipient Name</label><input className="soha-input mt-1" value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Jane Smith" /></div>
                <div><label className="text-[12px] font-semibold text-gray-700">Their Role</label><input className="soha-input mt-1" value={recipientRole} onChange={(e) => setRecipientRole(e.target.value)} placeholder="Hiring Manager" /></div>
                <div><label className="text-[12px] font-semibold text-gray-700">Company</label><input className="soha-input mt-1" value={emailCompany} onChange={(e) => setEmailCompany(e.target.value)} placeholder="Google" /></div>
                <div><label className="text-[12px] font-semibold text-gray-700">Use Resume</label>
                  <select className="soha-select mt-1" value={emailResumeId} onChange={(e) => setEmailResumeId(e.target.value)}><option value="">None</option>{resumes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}</select>
                </div>
              </div>
              <div><label className="text-[12px] font-semibold text-gray-700">Additional Context</label><textarea className="soha-textarea mt-1 min-h-[80px]" value={emailContext} onChange={(e) => setEmailContext(e.target.value)} placeholder="I interviewed last Tuesday and want to follow up..." /></div>
              {emailErr ? <p className="text-[13px] text-red-500">{emailErr}</p> : null}
              <button type="button" disabled={emailLoading} onClick={() => void generateEmail()} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#7C5CFC] py-3 text-[14px] font-bold text-white transition hover:bg-[#6B4CE0] disabled:opacity-60">
                {emailLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                {emailLoading ? "Generating..." : "Generate Email"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-100 bg-white p-6">
            <h3 className="text-[15px] font-bold text-gray-900">Generated Email</h3>
            {emailResult ? (
              <div className="mt-4 space-y-4 animate-fadeIn">
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Subject</p>
                  <p className="mt-1 text-[14px] font-semibold text-gray-900">{emailResult.subject}</p>
                </div>
                <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
                  <p className="text-[11px] font-semibold uppercase tracking-wider text-gray-400">Body</p>
                  <p className="mt-2 whitespace-pre-wrap text-[13px] leading-relaxed text-gray-700">{emailResult.body}</p>
                </div>
                {emailResult.tips.length > 0 ? (
                  <div className="rounded-xl bg-violet-50 p-4">
                    <p className="text-[12px] font-bold text-[#7C5CFC]">Tips</p>
                    <ul className="mt-2 space-y-1">{emailResult.tips.map((t, i) => <li key={i} className="text-[12px] text-gray-600">• {t}</li>)}</ul>
                  </div>
                ) : null}
                <div className="flex flex-wrap gap-2">
                  <CopyBtn text={emailResult.subject} label="Copy Subject" />
                  <CopyBtn text={emailResult.body} label="Copy Body" />
                  <CopyBtn text={`Subject: ${emailResult.subject}\n\n${emailResult.body}`} label="Copy All" />
                  <button type="button" onClick={() => void saveAsTemplate()} className="inline-flex items-center gap-1.5 rounded-xl bg-[#7C5CFC] px-3 py-1.5 text-[12px] font-semibold text-white transition hover:bg-[#6B4CE0]">
                    <Plus className="h-3 w-3" /> Save as Template
                  </button>
                </div>
              </div>
            ) : (
              <div className="mt-8 flex flex-col items-center py-8 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50"><MessageSquare className="h-7 w-7 text-[#7C5CFC]" /></div>
                <p className="mt-4 text-[14px] font-medium text-gray-500">Your generated email will appear here</p>
                <p className="mt-1 text-[12px] text-gray-400">Fill in the form and click Generate</p>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* ═══ Email Templates ═══ */}
      {tab === "templates" ? (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-[17px] font-bold text-gray-900">Email Templates</h2>
            <button type="button" onClick={() => setShowTemplateForm((s) => !s)} className="inline-flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-4 py-2.5 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]">
              {showTemplateForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
              {showTemplateForm ? "Close" : "New Template"}
            </button>
          </div>
          {showTemplateForm ? (
            <div className="animate-fadeIn rounded-2xl border border-gray-100 bg-white p-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="text-[12px] font-semibold text-gray-700">Name *</label><input className="soha-input mt-1" value={tForm.name} onChange={(e) => setTForm({ ...tForm, name: e.target.value })} /></div>
                <div><label className="text-[12px] font-semibold text-gray-700">Category</label><select className="soha-select mt-1" value={tForm.category} onChange={(e) => setTForm({ ...tForm, category: e.target.value })}>{CATS.map((c) => <option key={c}>{c}</option>)}</select></div>
                <div className="sm:col-span-2"><label className="text-[12px] font-semibold text-gray-700">Subject *</label><input className="soha-input mt-1" value={tForm.subject} onChange={(e) => setTForm({ ...tForm, subject: e.target.value })} /></div>
                <div className="sm:col-span-2"><label className="text-[12px] font-semibold text-gray-700">Body</label><textarea className="soha-textarea mt-1 min-h-[100px]" value={tForm.body} onChange={(e) => setTForm({ ...tForm, body: e.target.value })} /></div>
              </div>
              {tErr ? <p className="mt-2 text-[13px] text-red-500">{tErr}</p> : null}
              <div className="mt-4 flex gap-2">
                <button type="button" disabled={tSaving} onClick={() => void saveTemplate()} className="rounded-xl bg-[#7C5CFC] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]">{tSaving ? <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> : null}Save</button>
                <button type="button" onClick={() => setShowTemplateForm(false)} className="rounded-xl border border-gray-100 px-4 py-2 text-[13px] font-medium text-gray-600 hover:bg-gray-50">Cancel</button>
              </div>
            </div>
          ) : null}
          {rows.length === 0 ? (
            <div className="flex flex-col items-center rounded-2xl border border-dashed border-gray-200 py-12 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50"><Mail className="h-6 w-6 text-[#7C5CFC]" /></div>
              <p className="mt-4 text-[14px] font-medium text-gray-500">No templates yet</p>
              <p className="mt-1 text-[12px] text-gray-400">Create templates or generate them with AI</p>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              {rows.map((t) => (
                <div key={t.id} className="rounded-2xl border border-gray-100 bg-white p-5 transition hover:shadow-sm">
                  <div className="flex items-start justify-between"><div><p className="text-[14px] font-semibold text-gray-900">{t.name}</p><span className="mt-1 inline-block rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-semibold text-[#7C5CFC]">{t.category}</span></div>
                    <button type="button" onClick={() => void delTemplate(t.id)} className="rounded-xl p-2 text-gray-300 hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button></div>
                  <p className="mt-3 text-[12px] text-gray-500">Subject: {t.subject}</p>
                  <p className="mt-1 line-clamp-2 text-[12px] text-gray-400">{t.body}</p>
                  <div className="mt-3 flex gap-1.5 border-t border-gray-50 pt-3"><CopyBtn text={t.subject} label="Subject" /><CopyBtn text={t.body} label="Body" /></div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : null}

      {/* ═══ Quick Actions ═══ */}
      {tab === "quick-actions" ? (
        <div className="space-y-5">
          <h2 className="text-[17px] font-bold text-gray-900">Quick Actions</h2>
          <p className="text-[13px] text-gray-500">One-click shortcuts to common tasks across Launch CV.</p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { href: "/resume/new", label: "Create New Resume", desc: "Start from scratch or import", icon: Plus, color: "bg-violet-50 text-[#7C5CFC]" },
              { href: "/dashboard/resumes", label: "Export PDF", desc: "Download any resume as PDF", icon: Mail, color: "bg-amber-50 text-amber-600" },
              { href: "/dashboard/job-tracker", label: "Track Application", desc: "Add a new job to pipeline", icon: Zap, color: "bg-emerald-50 text-emerald-600" },
              { href: "/dashboard/contacts", label: "Add Contact", desc: "Save a new networking contact", icon: Globe, color: "bg-blue-50 text-blue-600" },
              { href: "/dashboard/companies", label: "Add Company", desc: "Track a target company", icon: Globe, color: "bg-pink-50 text-pink-600" },
              { href: "/dashboard/settings", label: "Account Settings", desc: "Update your profile", icon: Keyboard, color: "bg-gray-50 text-gray-600" },
            ].map((a) => (
              <a key={a.href} href={a.href} className="group flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5 transition hover:border-[#7C5CFC]/20 hover:shadow-sm">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${a.color}`}><a.icon className="h-5 w-5" /></div>
                <div><p className="text-[14px] font-semibold text-gray-900">{a.label}</p><p className="text-[12px] text-gray-400">{a.desc}</p></div>
              </a>
            ))}
          </div>
        </div>
      ) : null}

      {/* ═══ Integrations ═══ */}
      {tab === "integrations" ? (
        <div className="space-y-5">
          <h2 className="text-[17px] font-bold text-gray-900">Integrations</h2>
          <p className="text-[13px] text-gray-500">Connect Launch CV with your favorite tools.</p>
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { name: "LinkedIn", desc: "Import profile data and sync connections", status: "active", icon: "in" },
              { name: "Google Docs", desc: "Export resumes directly to Google Docs", status: "coming", icon: "G" },
              { name: "Gmail", desc: "Send emails directly from Launch CV", status: "coming", icon: "M" },
              { name: "Notion", desc: "Sync job tracking data to Notion", status: "coming", icon: "N" },
              { name: "Slack", desc: "Get notifications for application updates", status: "coming", icon: "S" },
              { name: "Zapier", desc: "Connect with 5000+ apps", status: "coming", icon: "Z" },
            ].map((i) => (
              <div key={i.name} className="flex items-center gap-4 rounded-2xl border border-gray-100 bg-white p-5">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gray-50 text-[16px] font-bold text-gray-600">{i.icon}</div>
                <div className="flex-1"><p className="text-[14px] font-semibold text-gray-900">{i.name}</p><p className="text-[12px] text-gray-400">{i.desc}</p></div>
                <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${i.status === "active" ? "bg-emerald-50 text-emerald-600" : "bg-gray-50 text-gray-400"}`}>
                  {i.status === "active" ? "Active" : "Coming Soon"}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ═══ Keyboard Shortcuts ═══ */}
      {tab === "shortcuts" ? (
        <div className="space-y-5">
          <h2 className="text-[17px] font-bold text-gray-900">Keyboard Shortcuts</h2>
          <p className="text-[13px] text-gray-500">Navigate Launch CV faster with keyboard shortcuts.</p>
          <div className="rounded-2xl border border-gray-100 bg-white divide-y divide-gray-50">
            {[
              { keys: ["⌘", "N"], action: "Create new resume" },
              { keys: ["⌘", "S"], action: "Save current document" },
              { keys: ["⌘", "P"], action: "Export as PDF" },
              { keys: ["⌘", "K"], action: "Open command palette" },
              { keys: ["⌘", "J"], action: "Go to Job Tracker" },
              { keys: ["⌘", "/"], action: "Toggle keyboard shortcuts" },
              { keys: ["⌘", "⇧", "E"], action: "Open Extensions" },
              { keys: ["⌘", "⇧", "I"], action: "Import from LinkedIn" },
              { keys: ["Esc"], action: "Close modal / Go back" },
            ].map((s) => (
              <div key={s.action} className="flex items-center justify-between px-5 py-3.5">
                <span className="text-[13px] text-gray-700">{s.action}</span>
                <div className="flex gap-1">
                  {s.keys.map((k) => (
                    <kbd key={k} className="flex h-7 min-w-7 items-center justify-center rounded-lg border border-gray-200 bg-gray-50 px-2 text-[12px] font-semibold text-gray-500">{k}</kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {/* ═══ Browser Extension ═══ */}
      {tab === "browser-ext" ? (
        <div className="space-y-5">
          <div className="rounded-2xl border border-gray-100 bg-white p-8 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-50">
              <Monitor className="h-8 w-8 text-[#7C5CFC]" />
            </div>
            <h2 className="mt-5 text-[20px] font-bold text-gray-900">Chrome Extension</h2>
            <p className="mx-auto mt-2 max-w-md text-[14px] leading-relaxed text-gray-500">
              Import LinkedIn profiles directly into Launch CV with one click.
              Auto-fill job descriptions from any job board. Coming soon.
            </p>
            <div className="mt-8 flex flex-col items-center gap-3">
              <button type="button" className="inline-flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-6 py-3 text-[14px] font-bold text-white opacity-60 cursor-not-allowed">
                <Monitor className="h-5 w-5" /> Install Extension (Coming Soon)
              </button>
              <p className="text-[12px] text-gray-400">Get notified when it launches:</p>
              <div className="flex w-full max-w-sm gap-2">
                <input className="soha-input flex-1" placeholder="your@email.com" />
                <button type="button" className="rounded-xl bg-[#7C5CFC] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]">Notify Me</button>
              </div>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { title: "One-Click Import", desc: "Import your LinkedIn profile into Launch CV without copy-pasting" },
              { title: "Auto-Fill JD", desc: "Automatically capture job descriptions from LinkedIn, Indeed, Glassdoor" },
              { title: "Quick Apply", desc: "Generate tailored resumes right from the job posting page" },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl border border-gray-100 bg-white p-5">
                <h3 className="text-[14px] font-bold text-gray-900">{f.title}</h3>
                <p className="mt-2 text-[12px] leading-relaxed text-gray-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
