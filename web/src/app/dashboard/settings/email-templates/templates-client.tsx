"use client";

import { useState } from "react";
import { Plus, Loader2, Mail, Copy, Check, Trash2, X } from "lucide-react";

export type TemplateRow = {
  id: string; name: string; subject: string; body: string; category: string;
  createdAt: string; updatedAt: string;
};

const CATS = ["general", "thank-you", "follow-up", "intro"];
const EMPTY = { name: "", subject: "", body: "", category: "general" };

function CopyBtn({ text }: { text: string }) {
  const [ok, setOk] = useState(false);
  return (
    <button type="button" className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[11px] font-medium text-gray-500 transition hover:bg-violet-50 hover:text-[#7C5CFC]" onClick={() => { void navigator.clipboard.writeText(text); setOk(true); setTimeout(() => setOk(false), 1500); }}>
      {ok ? <Check className="h-3 w-3 text-[#7C5CFC]" /> : <Copy className="h-3 w-3" />}
      {ok ? "Copied" : "Copy"}
    </button>
  );
}

export function TemplatesClient({ initial }: { initial: TemplateRow[] }) {
  const [rows, setRows] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function refresh() {
    const r = await fetch("/api/email-templates");
    const j = await r.json().catch(() => ({}));
    if (r.ok && Array.isArray(j.templates)) setRows(j.templates);
  }

  async function save() {
    if (!form.name.trim() || !form.subject.trim()) { setErr("Name and subject are required"); return; }
    setSaving(true); setErr(null);
    const r = await fetch("/api/email-templates", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    setSaving(false);
    if (!r.ok) { const j = await r.json().catch(() => ({})); setErr(j.error ?? "Error"); return; }
    await refresh(); setShowForm(false); setForm(EMPTY);
  }

  async function del(id: string) {
    if (!confirm("Are you sure you want to delete this?")) return;
    await fetch(`/api/email-templates/${id}`, { method: "DELETE" });
    setRows((p) => p.filter((t) => t.id !== id));
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-[15px] font-bold text-gray-900">Email Templates</h1>
        <button type="button" onClick={() => setShowForm((s) => !s)} className="inline-flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0] hover:shadow-[0_4px_12px_rgba(124,92,252,0.25)]">
          {showForm ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
          {showForm ? "Close" : "New Template"}
        </button>
      </div>

      {showForm ? (
        <div className="animate-fadeIn rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-[13px] font-semibold text-gray-900">Template Name *</label>
                <input className="soha-input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Say Thank You" />
              </div>
              <div>
                <label className="text-[13px] font-semibold text-gray-900">Category</label>
                <select className="soha-select mt-1" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="sm:col-span-2">
                <label className="text-[13px] font-semibold text-gray-900">Subject *</label>
                <input className="soha-input mt-1" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className="text-[13px] font-semibold text-gray-900">Body</label>
                <textarea className="soha-textarea mt-1 min-h-[120px]" value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} />
              </div>
            </div>
            {err ? <p className="text-[13px] text-red-600">{err}</p> : null}
            <div className="flex gap-2">
              <button type="button" disabled={saving} onClick={() => void save()} className="inline-flex items-center gap-2 rounded-xl bg-[#7C5CFC] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Save
              </button>
              <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY); }} className="rounded-xl border border-[#7C5CFC]/20 px-4 py-2 text-[13px] font-semibold text-[#7C5CFC] transition hover:bg-violet-50">Cancel</button>
            </div>
          </div>
        </div>
      ) : null}

      {rows.length === 0 ? (
        <div className="soha-empty">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50">
            <Mail className="h-6 w-6 text-[#7C5CFC]" />
          </div>
          <h3 className="mt-4 text-[13px] font-semibold text-gray-700">No templates yet</h3>
          <p className="mt-1 text-[13px] text-gray-500">Create thank-you, follow-up, and other templates.</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {rows.map((t) => (
            <div key={t.id} className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:border-[#7C5CFC]/10 hover:shadow-md">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="text-[13px] font-semibold text-gray-900">{t.name}</h3>
                  <span className="soha-badge-blue mt-1">{t.category}</span>
                </div>
                <button type="button" onClick={() => void del(t.id)} className="flex h-8 w-8 items-center justify-center rounded-xl text-gray-300 transition hover:bg-red-50 hover:text-red-500"><Trash2 className="h-4 w-4" /></button>
              </div>
              <p className="mt-3 text-[11px] font-medium text-gray-600">Subject: {t.subject}</p>
              <p className="mt-1 line-clamp-2 text-[11px] text-gray-400">{t.body}</p>
              <div className="mt-3 flex gap-1.5 border-t border-gray-100 pt-3">
                <CopyBtn text={t.subject} />
                <CopyBtn text={t.body} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
