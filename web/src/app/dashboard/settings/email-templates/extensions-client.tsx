"use client";

import { useState } from "react";
import { Check, Copy, Loader2, Plus, Sparkles, Trash2, X } from "lucide-react";
import { ToolNotice } from "@/components/tool-notice";
import { isVerifyEmailResponse } from "@/components/verify-email-notice";
import {
  Badge,
  PageHeader,
  SelectField,
  btnLgPrimary,
  btnSmDark,
  btnSmSoft,
  cardCls,
  cardTitleCls,
  fieldLabelCls,
  inputCls,
  segItemCls,
  segWrapCls,
  textareaCls,
} from "@/components/app/account/ui";

export type TemplateRow = {
  id: string; name: string; subject: string; body: string; category: string;
  createdAt: string; updatedAt: string;
};

type Tab = "ai-email" | "templates";

const TABS: { key: Tab; label: string }[] = [
  { key: "ai-email", label: "Write with AI" },
  { key: "templates", label: "Saved templates" },
];

const EMAIL_TYPE_LABEL: Record<string, string> = {
  "thank-you": "Thank-you note",
  "follow-up": "Follow-up",
  networking: "Networking",
  introduction: "Introduction",
  custom: "Something else",
};

const EMAIL_TYPES = ["thank-you", "follow-up", "networking", "introduction", "custom"] as const;
const TONES = ["formal", "friendly", "concise"] as const;
const CATS = ["general", "thank-you", "follow-up", "intro"];

function CopyBtn({ text, label = "Copy", variant = "soft" }: { text: string; label?: string; variant?: "soft" | "dark" }) {
  const [ok, setOk] = useState(false);
  return (
    <button
      type="button"
      onClick={() => { void navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}
      className={variant === "dark" ? btnSmDark : btnSmSoft}
    >
      {ok ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
      <span aria-live="polite">{ok ? "Copied" : label}</span>
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
  const [emailUpgrade, setEmailUpgrade] = useState(false);
  const [emailVerify, setEmailVerify] = useState(false);

  const [showTemplateForm, setShowTemplateForm] = useState(false);
  const [tForm, setTForm] = useState({ name: "", subject: "", body: "", category: "general" });
  const [tSaving, setTSaving] = useState(false);
  const [tErr, setTErr] = useState<string | null>(null);

  async function generateEmail() {
    setEmailLoading(true); setEmailErr(null); setEmailUpgrade(false); setEmailVerify(false); setEmailResult(null);
    const r = await fetch("/api/ai/generate-email", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: emailType, tone: emailTone, resumeId: emailResumeId || undefined, recipientName: recipientName || undefined, recipientRole: recipientRole || undefined, company: emailCompany || undefined, context: emailContext || undefined }),
    });
    const j = await r.json().catch(() => ({}));
    setEmailLoading(false);
    if (!r.ok) {
      setEmailUpgrade(j.code === "USAGE_LIMIT" && !!j.upgrade);
      setEmailVerify(isVerifyEmailResponse(j));
      setEmailErr(typeof j.error === "string" ? j.error : "Couldn't write the email. Please try again.");
      return;
    }
    if (j.result) setEmailResult(j.result);
  }

  async function saveAsTemplate() {
    if (!emailResult) return;
    await fetch("/api/email-templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: EMAIL_TYPE_LABEL[emailType] ?? "Email", subject: emailResult.subject, body: emailResult.body, category: emailType }) });
    await refreshTemplates();
  }

  async function refreshTemplates() {
    const r = await fetch("/api/email-templates");
    const j = await r.json().catch(() => ({}));
    if (r.ok && Array.isArray(j.templates)) setRows(j.templates);
  }

  async function saveTemplate() {
    if (!tForm.name.trim() || !tForm.subject.trim()) { setTErr("Add a name and a subject."); return; }
    setTSaving(true); setTErr(null);
    const r = await fetch("/api/email-templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(tForm) });
    setTSaving(false);
    if (!r.ok) { const j = await r.json().catch(() => ({})); setTErr(typeof j.error === "string" ? j.error : "Couldn't save. Please try again."); return; }
    await refreshTemplates(); setShowTemplateForm(false); setTForm({ name: "", subject: "", body: "", category: "general" });
  }

  async function delTemplate(id: string) {
    await fetch(`/api/email-templates/${id}`, { method: "DELETE" });
    setRows((p) => p.filter((t) => t.id !== id));
  }

  function onTabKey(e: React.KeyboardEvent<HTMLButtonElement>) {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const i = TABS.findIndex((t) => t.key === tab);
    const next = TABS[(i + (e.key === "ArrowRight" ? 1 : TABS.length - 1)) % TABS.length].key;
    setTab(next);
    document.getElementById(`em-tab-${next}`)?.focus();
  }

  return (
    <div className="mx-auto w-full max-w-[1160px] pb-12">
      <PageHeader title="Email templates" lead="Draft an email from your resume with AI, or save your own to reuse." />

      <div className="relative mt-5 max-w-full overflow-x-auto sm:mt-[22px]">
        <div role="tablist" aria-label="Email templates" className={segWrapCls}>
          {TABS.map((t) => (
            <button
              key={t.key}
              id={`em-tab-${t.key}`}
              type="button"
              role="tab"
              aria-selected={tab === t.key}
              aria-controls={`em-panel-${t.key}`}
              tabIndex={tab === t.key ? 0 : -1}
              onClick={() => setTab(t.key)}
              onKeyDown={onTabKey}
              className={segItemCls(tab === t.key)}
            >
              {t.key === "templates" ? `${t.label} · ${rows.length}` : t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ═══ AI Email Generator ═══ */}
      {tab === "ai-email" ? (
        <div id="em-panel-ai-email" role="tabpanel" aria-labelledby="em-tab-ai-email" className="mt-5 grid items-start gap-4 sm:gap-5 lg:grid-cols-[0.8fr_1.2fr]">
          <section aria-labelledby="em-form-title" className={cardCls}>
            <h2 id="em-form-title" className="sr-only">Write an email</h2>
            <p className="text-[14px] leading-[21px] text-[#4a4862]">
              Pick the kind of email and who it&apos;s for. The draft uses details from the resume you choose.
            </p>
            <div className="mt-4 flex flex-col gap-3">
              <div>
                <label htmlFor="em-type" className={fieldLabelCls}>Kind of email</label>
                <SelectField id="em-type" className="mt-1.5" value={emailType} onChange={(e) => setEmailType(e.target.value as typeof emailType)}>
                  {EMAIL_TYPES.map((t) => <option key={t} value={t}>{EMAIL_TYPE_LABEL[t]}</option>)}
                </SelectField>
              </div>
              <div>
                <label htmlFor="em-resume" className={fieldLabelCls}>Resume to draw from</label>
                <SelectField id="em-resume" className="mt-1.5" value={emailResumeId} onChange={(e) => setEmailResumeId(e.target.value)}>
                  <option value="">None</option>
                  {resumes.map((r) => <option key={r.id} value={r.id}>{r.title}</option>)}
                </SelectField>
              </div>
              <div className="grid gap-3 sm:grid-cols-2 sm:gap-2.5">
                <div>
                  <label htmlFor="em-name" className={fieldLabelCls}>Their name</label>
                  <input id="em-name" className={`${inputCls} mt-1.5`} value={recipientName} onChange={(e) => setRecipientName(e.target.value)} placeholder="Jane Smith" />
                </div>
                <div>
                  <label htmlFor="em-role" className={fieldLabelCls}>Their role</label>
                  <input id="em-role" className={`${inputCls} mt-1.5`} value={recipientRole} onChange={(e) => setRecipientRole(e.target.value)} placeholder="Hiring manager" />
                </div>
              </div>
              <div>
                <label htmlFor="em-company" className={fieldLabelCls}>Company</label>
                <input id="em-company" className={`${inputCls} mt-1.5`} value={emailCompany} onChange={(e) => setEmailCompany(e.target.value)} placeholder="Northwind" />
              </div>
              <div>
                <label htmlFor="em-context" className={fieldLabelCls}>Anything it should mention</label>
                <textarea id="em-context" className={`${textareaCls} mt-1.5`} value={emailContext} onChange={(e) => setEmailContext(e.target.value)} placeholder="We spoke on Tuesday about the onboarding project…" />
              </div>
              <fieldset>
                <legend className={fieldLabelCls}>Tone</legend>
                <div className="mt-1.5 flex flex-wrap gap-1">
                  {TONES.map((t) => {
                    const on = emailTone === t;
                    return (
                      <label
                        key={t}
                        className={`relative inline-flex min-h-11 cursor-pointer items-center rounded-full px-4 text-[14px] font-bold transition-colors has-[:focus-visible]:outline-3 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-[#5440e8] motion-reduce:transition-none ${
                          on ? "bg-[#111118] text-white" : "bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]"
                        }`}
                      >
                        <input
                          type="radio"
                          name="em-tone"
                          value={t}
                          checked={on}
                          onChange={() => setEmailTone(t)}
                          className="sr-only"
                        />
                        {t.charAt(0).toUpperCase() + t.slice(1)}
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              {emailErr ? <ToolNotice message={emailErr} upgrade={emailUpgrade} verifyEmail={emailVerify} location="email_paywall" /> : null}
            </div>
            <button type="button" disabled={emailLoading} onClick={() => void generateEmail()} className={`${btnLgPrimary} mt-[18px] w-full`}>
              {emailLoading ? <Loader2 className="h-[18px] w-[18px] animate-spin" aria-hidden /> : <Sparkles className="h-[18px] w-[18px]" aria-hidden />}
              {emailLoading ? "Writing…" : "Write the email"}
            </button>
          </section>

          <section aria-labelledby="em-draft-title" className={cardCls}>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 id="em-draft-title" className={cardTitleCls}>Draft</h2>
              {emailResult ? (
                <div className="flex flex-wrap gap-1.5">
                  <CopyBtn text={`Subject: ${emailResult.subject}\n\n${emailResult.body}`} label="Copy all" variant="dark" />
                  <button type="button" onClick={() => void saveAsTemplate()} className={btnSmSoft}>
                    <Plus className="h-4 w-4" aria-hidden /> Save as template
                  </button>
                </div>
              ) : null}
            </div>
            {emailResult ? (
              <div className="mt-4">
                <p className={fieldLabelCls}>Subject</p>
                <p className="mt-1.5 flex min-h-12 items-center rounded-[14px] border-[1.5px] border-[#e2e0ea] px-4 py-2.5 text-[15px] font-semibold text-[#121226]">
                  {emailResult.subject}
                </p>
                <p className={`${fieldLabelCls} mt-3`}>Body</p>
                <div className="mt-1.5 whitespace-pre-wrap rounded-[14px] border-[1.5px] border-[#e2e0ea] p-4 text-[15px] leading-[25px] text-[#24223a] sm:p-5">
                  {emailResult.body}
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  <CopyBtn text={emailResult.subject} label="Copy subject" />
                  <CopyBtn text={emailResult.body} label="Copy body" />
                </div>
                {emailResult.tips.length > 0 ? (
                  <div className="mt-4 rounded-2xl bg-[#f7f6fb] px-4 py-3.5">
                    <p className="text-[12px] font-extrabold tracking-[0.06em] text-[#66647c]">TIPS</p>
                    <ul className="mt-1.5 flex flex-col gap-1">
                      {emailResult.tips.map((t, i) => <li key={i} className="text-[14px] leading-[21px] text-[#24223a]">{t}</li>)}
                    </ul>
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="mt-4 rounded-[20px] border-2 border-dashed border-[#d9d4f2] px-5 py-12 text-center">
                <p className="text-[15px] font-bold text-[#121226]">Your draft shows up here</p>
                <p className="mt-1 text-[14px] text-[#4a4862]">Subject, body and a few tips. Edit it before you send.</p>
              </div>
            )}
          </section>
        </div>
      ) : null}

      {/* ═══ Email Templates ═══ */}
      {tab === "templates" ? (
        <div id="em-panel-templates" role="tabpanel" aria-labelledby="em-tab-templates" className="mt-5 flex flex-col gap-4 sm:gap-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className={cardTitleCls}>Saved templates</h2>
            <button type="button" onClick={() => setShowTemplateForm((s) => !s)} aria-expanded={showTemplateForm} className={btnSmDark}>
              {showTemplateForm ? <X className="h-4 w-4" aria-hidden /> : <Plus className="h-4 w-4" aria-hidden />}
              {showTemplateForm ? "Close" : "New template"}
            </button>
          </div>
          {showTemplateForm ? (
            <section aria-label="New template" className={cardCls}>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label htmlFor="tpl-name" className={fieldLabelCls}>Name</label>
                  <input id="tpl-name" className={`${inputCls} mt-1.5`} value={tForm.name} onChange={(e) => setTForm({ ...tForm, name: e.target.value })} />
                </div>
                <div>
                  <label htmlFor="tpl-cat" className={fieldLabelCls}>Category</label>
                  <SelectField id="tpl-cat" className="mt-1.5" value={tForm.category} onChange={(e) => setTForm({ ...tForm, category: e.target.value })}>
                    {CATS.map((c) => <option key={c}>{c}</option>)}
                  </SelectField>
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="tpl-subject" className={fieldLabelCls}>Subject</label>
                  <input id="tpl-subject" className={`${inputCls} mt-1.5`} value={tForm.subject} onChange={(e) => setTForm({ ...tForm, subject: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label htmlFor="tpl-body" className={fieldLabelCls}>Body</label>
                  <textarea id="tpl-body" className={`${textareaCls} mt-1.5 min-h-[120px]`} value={tForm.body} onChange={(e) => setTForm({ ...tForm, body: e.target.value })} />
                </div>
              </div>
              {tErr ? <p role="alert" className="mt-3 text-[14px] font-semibold text-[#a3262b]">{tErr}</p> : null}
              <div className="mt-4 flex flex-wrap gap-2">
                <button type="button" disabled={tSaving} onClick={() => void saveTemplate()} className={btnSmDark}>
                  {tSaving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}Save
                </button>
                <button type="button" onClick={() => setShowTemplateForm(false)} className={btnSmSoft}>Cancel</button>
              </div>
            </section>
          ) : null}
          {rows.length === 0 ? (
            <div className="flex flex-col items-center rounded-[24px] border-2 border-dashed border-[#d9d4f2] px-5 py-12 text-center">
              <p className="text-[16px] font-bold text-[#121226]">No saved templates yet</p>
              <p className="mt-1 max-w-[380px] text-[14px] leading-[21px] text-[#4a4862]">Write your own, or save a draft from the Write with AI tab to reuse it.</p>
            </div>
          ) : (
            <ul className="grid gap-3 sm:grid-cols-2 sm:gap-4 xl:grid-cols-3">
              {rows.map((t) => (
                <li key={t.id} className="lc-card flex flex-col rounded-[22px] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="break-words text-[16px] font-bold text-[#121226]">{t.name}</h3>
                      <Badge tone="lilac" className="mt-1.5">{t.category}</Badge>
                    </div>
                    <button
                      type="button"
                      onClick={() => void delTemplate(t.id)}
                      aria-label={`Delete ${t.name}`}
                      className="-mr-2 -mt-2 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#66647c] transition-colors hover:bg-[#fbe2e3] hover:text-[#a3262b] focus-visible:rounded-full!"
                    >
                      <Trash2 className="h-[18px] w-[18px]" aria-hidden />
                    </button>
                  </div>
                  <p className="mt-3 break-words text-[14px] font-semibold text-[#24223a]">
                    <span className="font-normal text-[#66647c]">Subject:</span> {t.subject}
                  </p>
                  <p className="mt-1 line-clamp-3 flex-1 break-words text-[14px] leading-[21px] text-[#4a4862]">{t.body}</p>
                  <div className="mt-3.5 flex flex-wrap gap-1.5 border-t border-[#e2e0ea] pt-3.5">
                    <CopyBtn text={t.subject} label="Subject" />
                    <CopyBtn text={t.body} label="Body" />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}
    </div>
  );
}
