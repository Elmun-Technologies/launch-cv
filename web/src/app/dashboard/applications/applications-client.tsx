"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { ChecklistItem } from "@/lib/application-checklist";
import { defaultApplicationChecklist } from "@/lib/application-checklist";
import { Plus, Loader2, FileText, Target, CheckSquare, FolderOpen } from "lucide-react";

export type ApplicationRow = {
  id: string; resumeId: string; jdRunId: string | null; jdText: string;
  title: string | null; company: string | null; status: string; checklist: unknown;
  createdAt: string; resume: { id: string; title: string };
};

const STATUS_STYLES: Record<string, string> = {
  draft: "soha-badge", bookmarked: "soha-badge", applied: "soha-badge-blue",
  applying: "soha-badge-blue", interview: "soha-badge-amber", interviewing: "soha-badge-amber",
  negotiating: "soha-badge-amber", offer: "soha-badge-emerald", accepted: "soha-badge-emerald",
  rejected: "soha-badge-red",
};

function normalizeChecklist(raw: unknown): ChecklistItem[] {
  if (!Array.isArray(raw)) return defaultApplicationChecklist();
  const out: ChecklistItem[] = [];
  for (const x of raw) {
    if (!x || typeof x !== "object") continue;
    const o = x as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.label !== "string" || typeof o.done !== "boolean") continue;
    out.push({ id: o.id, label: o.label, done: o.done });
  }
  return out.length ? out : defaultApplicationChecklist();
}

export function ApplicationsClient({ initial, resumes }: { initial: ApplicationRow[]; resumes: { id: string; title: string }[] }) {
  const [apps, setApps] = useState(initial);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [resumeId, setResumeId] = useState(resumes[0]?.id ?? "");
  const [jdText, setJdText] = useState("");
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const resumeOptions = useMemo(() => resumes.map((r) => [r.id, r.title] as const), [resumes]);

  async function refresh() {
    const res = await fetch("/api/applications");
    const j = await res.json().catch(() => ({}));
    if (res.ok && Array.isArray(j.applications)) {
      setApps(j.applications.map((a: ApplicationRow & { createdAt: Date }) => ({
        ...a, createdAt: typeof a.createdAt === "string" ? a.createdAt : new Date(a.createdAt).toISOString(),
      })));
    }
  }

  async function toggleChecklist(app: ApplicationRow, itemId: string) {
    const list = normalizeChecklist(app.checklist);
    const next = list.map((i) => (i.id === itemId ? { ...i, done: !i.done } : i));
    const res = await fetch(`/api/applications/${app.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ checklist: next }) });
    if (res.ok) setApps((prev) => prev.map((x) => (x.id === app.id ? { ...x, checklist: next } : x)));
  }

  async function createManual() {
    setErr(null);
    if (!resumeId || jdText.length < 40) { setErr("Resume and JD (min 40 characters) are required."); return; }
    setCreating(true);
    const res = await fetch("/api/applications", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ resumeId, jdText, title: title.trim() || undefined, company: company.trim() || undefined }) });
    setCreating(false);
    const j = await res.json().catch(() => ({}));
    if (!res.ok) { setErr(j.error ?? "Error"); return; }
    await refresh(); setJdText(""); setTitle(""); setCompany(""); setShowForm(false);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Applications</h1>
          <p className="mt-1 text-sm text-gray-500">Job postings, checklist, and resume history.</p>
        </div>
        <button type="button" onClick={() => setShowForm((s) => !s)} className="soha-btn-primary text-sm"><Plus className="h-4 w-4" /> New application</button>
      </div>

      {showForm ? (
        <div className="animate-fadeIn soha-card space-y-4">
          <h2 className="text-sm font-semibold text-gray-900">New application</h2>
          {resumes.length === 0 ? <p className="text-sm text-gray-500">Create a resume first.</p> : (
            <>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><label className="soha-label">Resume</label><select className="soha-select mt-1.5" value={resumeId} onChange={(e) => setResumeId(e.target.value)}>{resumeOptions.map(([id, t]) => <option key={id} value={id}>{t}</option>)}</select></div>
                <div><label className="soha-label">Job title</label><input className="soha-input mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Senior backend" /></div>
                <div className="sm:col-span-2"><label className="soha-label">Company</label><input className="soha-input mt-1.5" value={company} onChange={(e) => setCompany(e.target.value)} /></div>
                <div className="sm:col-span-2"><label className="soha-label">Job description</label><textarea className="soha-textarea mt-1.5" value={jdText} onChange={(e) => setJdText(e.target.value)} /></div>
              </div>
              {err ? <p className="text-sm text-red-600">{err}</p> : null}
              <button type="button" disabled={creating || jdText.length < 40 || !resumeId} onClick={() => void createManual()} className="soha-btn-primary text-sm">
                {creating ? <Loader2 className="h-4 w-4 animate-spin" /> : null} {creating ? "Saving..." : "Add"}
              </button>
            </>
          )}
        </div>
      ) : null}

      {apps.length === 0 ? (
        <div className="soha-empty"><FolderOpen className="h-12 w-12 text-gray-300" /><h3 className="mt-4 text-sm font-semibold text-gray-700">No applications yet</h3><p className="mt-1 text-sm text-gray-500">Add an application from JD analysis or using the button above.</p></div>
      ) : (
        <div className="space-y-3">
          {apps.map((app) => {
            const list = normalizeChecklist(app.checklist);
            const done = list.filter((i) => i.done).length;
            return (
              <div key={app.id} className="soha-card animate-fadeIn">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-semibold text-gray-900">{app.title || "No title specified"}</h3>
                      {app.company ? <span className="text-sm text-gray-500">· {app.company}</span> : null}
                    </div>
                    <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      <span className={STATUS_STYLES[app.status] ?? "soha-badge"}>{app.status}</span>
                      <span>{app.resume.title}</span>
                      <span>· {new Date(app.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <Link href={`/resume/${app.resume.id}/edit`} className="soha-btn-ghost text-xs"><FileText className="h-3 w-3" /> Resume</Link>
                    {app.jdRunId ? <Link href={`/resume/${app.resume.id}/jd`} className="soha-btn-ghost text-xs"><Target className="h-3 w-3" /> JD</Link> : null}
                  </div>
                </div>
                <div className="mt-3 border-t border-gray-100 pt-3">
                  <div className="mb-2 flex items-center justify-between text-xs">
                    <span className="flex items-center gap-1.5 font-medium text-gray-600"><CheckSquare className="h-3 w-3" /> Checklist</span>
                    <span className="text-gray-400">{done}/{list.length}</span>
                  </div>
                  <div className="space-y-1">
                    {list.map((item) => (
                      <label key={item.id} className="flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition hover:bg-gray-50">
                        <input type="checkbox" checked={item.done} onChange={() => void toggleChecklist(app, item.id)} className="h-3.5 w-3.5 rounded border-gray-300 text-blue-500 focus:ring-blue-200" />
                        <span className={item.done ? "text-gray-400 line-through" : "text-gray-700"}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
