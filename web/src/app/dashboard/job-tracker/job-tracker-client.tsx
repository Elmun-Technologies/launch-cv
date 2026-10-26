"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search, X } from "lucide-react";

export type JobRow = {
  id: string;
  resumeId: string;
  title: string | null;
  company: string | null;
  status: string;
  jdExcerpt: string;
  createdAt: string;
  updatedAt: string;
  resume: { id: string; title: string };
};

type NoteRow = { id: string; content: string; createdAt: string };

const STAGES = [
  { key: "bookmarked", label: "Saved" },
  { key: "applying", label: "Applied" },
  { key: "interviewing", label: "Interviewing" },
  { key: "negotiating", label: "Offer" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Closed" },
] as const;

type StageKey = (typeof STAGES)[number]["key"];

/** Older rows used other spellings; fold them into the board's columns. */
const STAGE_OF: Record<string, StageKey> = {
  bookmarked: "bookmarked",
  draft: "bookmarked",
  applying: "applying",
  applied: "applying",
  interviewing: "interviewing",
  interview: "interviewing",
  negotiating: "negotiating",
  offer: "negotiating",
  accepted: "accepted",
  rejected: "rejected",
  closed: "rejected",
};

const stageOf = (s: string): StageKey => STAGE_OF[s] ?? "bookmarked";

const inputCls =
  "h-[42px] w-full rounded-[10px] border border-[#D9D9D5] bg-white px-3 text-[14px] text-[#111111] outline-none placeholder:text-[#8A8A86] focus:border-[#111111] focus:ring-4 focus:ring-black/5";
const labelCls = "mb-1.5 block text-[13px] font-medium text-[#111111]";

function fmtDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function JobTrackerClient({
  initial,
  resumes,
}: {
  initial: JobRow[];
  resumes: { id: string; title: string }[];
}) {
  const [rows, setRows] = useState<JobRow[]>(initial);
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => `${r.company ?? ""} ${r.title ?? ""}`.toLowerCase().includes(q));
  }, [rows, query]);

  const selected = rows.find((r) => r.id === selectedId) ?? null;

  async function updateStage(id: string, status: StageKey) {
    const prev = rows;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, status } : r)));
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    }).catch(() => null);
    if (!res?.ok) setRows(prev);
  }

  async function remove(id: string) {
    if (!window.confirm("Delete this application? Notes attached to it are kept.")) return;
    const res = await fetch(`/api/applications/${id}`, { method: "DELETE" }).catch(() => null);
    if (res?.ok) {
      setRows((rs) => rs.filter((r) => r.id !== id));
      setSelectedId(null);
    }
  }

  return (
    <div className="mx-auto flex max-w-[1400px] flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-[26px] font-semibold tracking-[-0.025em]">Job tracker</h1>
          <p className="mt-1 text-[15px] text-[#6B6B6B]">
            {rows.length === 0
              ? "Every job you apply to, with the resume you sent."
              : `${rows.length} ${rows.length === 1 ? "application" : "applications"}`}
          </p>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          {rows.length > 0 ? (
            <label className="relative flex-1 sm:w-[260px] sm:flex-none">
              <span className="sr-only">Search applications</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8A86]" aria-hidden />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search company or role"
                className={`${inputCls} rounded-full pl-9`}
              />
            </label>
          ) : null}
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="inline-flex h-[42px] shrink-0 items-center gap-1.5 rounded-full bg-[#111111] px-4 text-[14px] font-medium text-white hover:bg-black"
          >
            <Plus className="h-4 w-4" aria-hidden /> Add job
          </button>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="flex flex-col items-center rounded-[16px] border border-dashed border-[#D9D9D5] bg-white px-6 py-16 text-center">
          <p className="text-[17px] font-semibold">No applications yet</p>
          <p className="mt-1.5 max-w-[420px] text-[15px] leading-[1.55] text-[#6B6B6B]">
            Add a job with its posting and the resume you&apos;re sending. Then move it along as you hear back.
          </p>
          <button
            type="button"
            onClick={() => setShowCreate(true)}
            className="mt-5 inline-flex h-11 items-center rounded-full bg-[#2563EB] px-5 text-[14px] font-medium text-white hover:bg-[#1D4ED8]"
          >
            Add your first job
          </button>
        </div>
      ) : (
        <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0">
          <div className="grid min-w-[1080px] grid-cols-6 gap-3">
            {STAGES.map((st) => {
              const items = filtered.filter((r) => stageOf(r.status) === st.key);
              return (
                <section key={st.key} aria-label={st.label} className="flex flex-col rounded-[14px] bg-[#F5F5F3] p-2.5">
                  <h2 className="flex items-center justify-between px-1.5 pb-2.5 pt-1 text-[13px] font-medium text-[#3F3F3F]">
                    {st.label}
                    <span className="text-[#8A8A86]">{items.length}</span>
                  </h2>
                  <div className="flex flex-col gap-2">
                    {items.map((r) => (
                      <button
                        key={r.id}
                        type="button"
                        onClick={() => setSelectedId(r.id)}
                        className="rounded-[10px] border border-[#E5E5E2] bg-white p-3 text-left hover:border-[#111111]"
                      >
                        <p className="truncate text-[14px] font-medium">{r.company || "Company not set"}</p>
                        <p className="mt-0.5 truncate text-[13px] text-[#3F3F3F]">{r.title || "Role not set"}</p>
                        <p className="mt-2 truncate text-[12px] text-[#8A8A86]">
                          {fmtDate(r.updatedAt)} · {r.resume.title}
                        </p>
                      </button>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        </div>
      )}

      {selected ? (
        <ApplicationDrawer
          app={selected}
          onClose={() => setSelectedId(null)}
          onStage={(s) => void updateStage(selected.id, s)}
          onDelete={() => void remove(selected.id)}
        />
      ) : null}

      {showCreate ? (
        <CreateDialog
          resumes={resumes}
          onClose={() => setShowCreate(false)}
          onCreated={(row) => {
            setRows((rs) => [row, ...rs]);
            setShowCreate(false);
          }}
        />
      ) : null}
    </div>
  );
}

function ApplicationDrawer({
  app,
  onClose,
  onStage,
  onDelete,
}: {
  app: JobRow;
  onClose: () => void;
  onStage: (s: StageKey) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState<NoteRow[] | null>(null);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let c = true;
    (async () => {
      const r = await fetch(`/api/notes?applicationId=${app.id}`).catch(() => null);
      const j = r ? await r.json().catch(() => ({})) : {};
      if (c) setNotes(r?.ok && Array.isArray(j.notes) ? j.notes : []);
    })();
    return () => {
      c = false;
    };
  }, [app.id]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function addNote() {
    if (!text.trim()) return;
    setSaving(true);
    const r = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ applicationId: app.id, content: text.trim() }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    setSaving(false);
    if (r?.ok && j.note) {
      setNotes((n) => [j.note as NoteRow, ...(n ?? [])]);
      setText("");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Application details">
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      <aside className="relative flex h-full w-full max-w-[460px] flex-col overflow-y-auto bg-white shadow-xl">
        <div className="flex items-start justify-between gap-4 border-b border-[#EEEEEB] px-6 py-5">
          <div className="min-w-0">
            <p className="truncate text-[19px] font-semibold">{app.company || "Company not set"}</p>
            <p className="truncate text-[15px] text-[#3F3F3F]">{app.title || "Role not set"}</p>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-[#6B6B6B] hover:bg-[#F5F5F3]">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-5">
          <div>
            <p className={labelCls}>Stage</p>
            <div className="flex flex-wrap gap-1.5">
              {STAGES.map((s) => {
                const on = stageOf(app.status) === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => onStage(s.key)}
                    aria-pressed={on}
                    className={`h-8 rounded-full px-3 text-[13px] ${
                      on ? "bg-[#111111] text-white" : "border border-[#D9D9D5] text-[#3F3F3F] hover:border-[#111111]"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className={labelCls}>Resume sent</p>
            <Link href={`/resume/${app.resumeId}/edit`} className="text-[14px] text-[#1D4ED8] hover:underline">
              {app.resume.title}
            </Link>
          </div>

          <div>
            <p className={labelCls}>Prepare</p>
            <div className="flex flex-wrap gap-2">
              {[
                { href: `/resume/${app.resumeId}/jd`, l: "Match to this job" },
                { href: `/resume/${app.resumeId}/fit`, l: "Role-fit check" },
                { href: `/resume/${app.resumeId}/packet`, l: "Interview packet" },
              ].map((x) => (
                <Link
                  key={x.href}
                  href={x.href}
                  className="inline-flex h-9 items-center rounded-full border border-[#D9D9D5] px-3.5 text-[13px] font-medium hover:border-[#111111]"
                >
                  {x.l}
                </Link>
              ))}
            </div>
          </div>

          {app.jdExcerpt ? (
            <div>
              <p className={labelCls}>Job post</p>
              <p className="max-h-[160px] overflow-y-auto whitespace-pre-line rounded-[10px] bg-[#F5F5F3] p-3 text-[13px] leading-[1.55] text-[#3F3F3F]">
                {app.jdExcerpt}
              </p>
            </div>
          ) : null}

          <div>
            <label htmlFor="note" className={labelCls}>
              Notes
            </label>
            <textarea
              id="note"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="Recruiter name, interview date, salary range…"
              className={`${inputCls} h-auto py-2.5`}
            />
            <button
              type="button"
              onClick={() => void addNote()}
              disabled={saving || !text.trim()}
              className="mt-2 inline-flex h-9 items-center gap-1.5 rounded-full bg-[#111111] px-4 text-[13px] font-medium text-white disabled:opacity-40"
            >
              {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden /> : null}
              Add note
            </button>
            <ul className="mt-3">
              {notes === null ? (
                <li className="text-[13px] text-[#8A8A86]">Loading notes…</li>
              ) : (
                notes.map((n) => (
                  <li key={n.id} className="border-t border-[#EEEEEB] py-2.5 text-[14px]">
                    <p className="whitespace-pre-line">{n.content}</p>
                    <p className="mt-1 text-[12px] text-[#8A8A86]">{fmtDate(n.createdAt)}</p>
                  </li>
                ))
              )}
            </ul>
          </div>

          <p className="border-t border-[#EEEEEB] pt-4 text-[13px] text-[#6B6B6B]">
            Added {fmtDate(app.createdAt)} ·{" "}
            <button type="button" onClick={onDelete} className="text-[#B42318] hover:underline">
              Delete application
            </button>
          </p>
        </div>
      </aside>
    </div>
  );
}

function CreateDialog({
  resumes,
  onClose,
  onCreated,
}: {
  resumes: { id: string; title: string }[];
  onClose: () => void;
  onCreated: (row: JobRow) => void;
}) {
  const [form, setForm] = useState({ resumeId: resumes[0]?.id ?? "", company: "", title: "", jdText: "", status: "applying" as StageKey });
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    if (!form.resumeId) return setErr("Create a resume first, then add the job.");
    if (form.jdText.trim().length < 40) return setErr("Paste the job post (at least a few lines) so we can match your resume to it.");
    setSaving(true);
    const r = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId: form.resumeId,
        jdText: form.jdText.trim(),
        title: form.title.trim() || undefined,
        company: form.company.trim() || undefined,
      }),
    }).catch(() => null);
    const j = r ? await r.json().catch(() => ({})) : {};
    if (!r?.ok || !j.application?.id) {
      setSaving(false);
      return setErr(typeof j.error === "string" ? j.error : "Couldn't save the job. Please try again.");
    }
    if (form.status !== "bookmarked") {
      await fetch(`/api/applications/${j.application.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: form.status }),
      }).catch(() => null);
    }
    const now = new Date().toISOString();
    onCreated({
      id: j.application.id,
      resumeId: form.resumeId,
      company: form.company.trim() || null,
      title: form.title.trim() || null,
      status: form.status,
      jdExcerpt: form.jdText.trim().slice(0, 1200),
      createdAt: now,
      updatedAt: now,
      resume: { id: form.resumeId, title: resumes.find((x) => x.id === form.resumeId)?.title ?? "Resume" },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-label="Add a job">
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      <form
        onSubmit={submit}
        className="relative flex max-h-[92vh] w-full max-w-[520px] flex-col gap-4 overflow-y-auto rounded-t-[20px] bg-white p-6 shadow-xl sm:rounded-[20px]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[19px] font-semibold">Add a job</h2>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-[#6B6B6B] hover:bg-[#F5F5F3]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className={labelCls}>Company</span>
            <input className={inputCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} autoFocus />
          </label>
          <label>
            <span className={labelCls}>Role</span>
            <input className={inputCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
        </div>
        <label>
          <span className={labelCls}>Job post</span>
          <textarea
            className={`${inputCls} h-auto py-2.5`}
            rows={6}
            value={form.jdText}
            onChange={(e) => setForm({ ...form, jdText: e.target.value })}
            placeholder="Paste the full job description"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className={labelCls}>Resume you&apos;re sending</span>
            <select className={inputCls} value={form.resumeId} onChange={(e) => setForm({ ...form, resumeId: e.target.value })}>
              {resumes.length === 0 ? <option value="">No resumes yet</option> : null}
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className={labelCls}>Stage</span>
            <select
              className={inputCls}
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as StageKey })}
            >
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        {err ? (
          <p role="alert" className="rounded-[10px] bg-[#FDF2F0] px-3 py-2.5 text-[14px] text-[#B42318]">
            {err}
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="h-11 rounded-full px-4 text-[14px] text-[#3F3F3F] hover:bg-[#F5F5F3]">
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex h-11 items-center gap-2 rounded-full bg-[#2563EB] px-5 text-[14px] font-medium text-white hover:bg-[#1D4ED8] disabled:opacity-60"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
            Save job
          </button>
        </div>
      </form>
    </div>
  );
}
