"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { BriefcaseBusiness, Check, ExternalLink, Loader2, Plus, Target, Trash2, UserCheck, FileText } from "lucide-react";
import { normalizeChecklist, type ChecklistItem } from "@/lib/application-checklist";
import {
  CloseButton,
  EmptyState,
  ErrorNote,
  FilterChip,
  InitialTile,
  PageHeader,
  SearchField,
  SelectField,
  appBtnDanger,
  appBtnGhost,
  appBtnPrimary,
  appBtnSoft,
  drawerPanelCls,
  fieldCls,
  focusCls,
  labelCls,
  overlayCls,
  sectionLabelCls,
  textareaCls,
  useDialogFocus,
} from "@/components/app/jobs/ui";

export type JobRow = {
  id: string;
  resumeId: string;
  title: string | null;
  company: string | null;
  status: string;
  jdExcerpt: string;
  createdAt: string;
  updatedAt: string;
  checklist: ChecklistItem[];
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

/** v5 tints per stage: column ground and the badge in the drawer. */
const STAGE_TONE: Record<StageKey, { column: string; badge: string }> = {
  bookmarked: { column: "bg-[#f1eff8]", badge: "bg-[#f1eff8] text-[#4a4862]" },
  applying: { column: "bg-[#f1eff8]", badge: "bg-[#f1eff8] text-[#4a4862]" },
  interviewing: { column: "bg-[#e4dfff]", badge: "bg-[#e4dfff] text-[#3a2bb8]" },
  negotiating: { column: "bg-[#dcf5ea]", badge: "bg-[#dcf5ea] text-[#0b4f35]" },
  accepted: { column: "bg-[#dcf5ea]", badge: "bg-[#dcf5ea] text-[#0b4f35]" },
  rejected: { column: "bg-[#f1eff8]", badge: "bg-[#f1eff8] text-[#4a4862]" },
};

const STAGE_LABEL: Record<StageKey, string> = Object.fromEntries(STAGES.map((s) => [s.key, s.label])) as Record<StageKey, string>;

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
  /** Stage preselected in the Add dialog when it's opened from a column. */
  const [createStage, setCreateStage] = useState<StageKey>("applying");
  /** Phone view shows one stage at a time; null = pick the first busy stage. */
  const [phoneStage, setPhoneStage] = useState<StageKey | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => `${r.company ?? ""} ${r.title ?? ""}`.toLowerCase().includes(q));
  }, [rows, query]);

  const byStage = useMemo(() => {
    const m = Object.fromEntries(STAGES.map((s) => [s.key, [] as JobRow[]])) as Record<StageKey, JobRow[]>;
    for (const r of filtered) m[stageOf(r.status)].push(r);
    return m;
  }, [filtered]);

  const activePhoneStage: StageKey =
    phoneStage ?? (byStage.applying.length ? "applying" : (STAGES.find((s) => byStage[s.key].length)?.key ?? "applying"));

  const interviewingCount = rows.filter((r) => stageOf(r.status) === "interviewing").length;

  const selected = rows.find((r) => r.id === selectedId) ?? null;

  function openCreate(stage: StageKey = "applying") {
    setCreateStage(stage);
    setShowCreate(true);
  }

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

  async function updateChecklist(id: string, checklist: ChecklistItem[]) {
    const prev = rows;
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, checklist } : r)));
    const res = await fetch(`/api/applications/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checklist }),
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

  const addJobBtn = (
    <button type="button" onClick={() => openCreate()} className={appBtnPrimary}>
      <Plus className="h-4 w-4" aria-hidden strokeWidth={2.2} /> Add a job
    </button>
  );

  return (
    <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-5 text-[#121226] sm:gap-6">
      <PageHeader
        title="Job tracker"
        lead={
          rows.length === 0
            ? "Every job you apply to, with the resume you sent."
            : `${rows.length} ${rows.length === 1 ? "application" : "applications"}${
                interviewingCount ? ` · ${interviewingCount} interviewing` : ""
              }`
        }
        actions={
          <>
            {rows.length > 0 ? (
              <SearchField
                value={query}
                onChange={setQuery}
                label="Search applications"
                placeholder="Search company or role"
                className="min-w-0 flex-1 md:w-[280px] md:flex-none"
              />
            ) : null}
            {addJobBtn}
          </>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<BriefcaseBusiness className="h-8 w-8" aria-hidden strokeWidth={1.8} />}
          title="No applications yet"
          actions={
            <button type="button" onClick={() => openCreate()} className={appBtnPrimary}>
              <Plus className="h-4 w-4" aria-hidden strokeWidth={2.2} /> Add your first job
            </button>
          }
        >
          Add a job with its posting and the resume you&apos;re sending. Then move it along as you hear back.
        </EmptyState>
      ) : (
        <>
          {/* PHONE: one stage at a time */}
          <div className="md:hidden">
            <div className="relative overflow-x-auto pb-1" role="group" aria-label="Stage">
              <div className="flex w-max gap-1.5">
                {STAGES.map((st) => (
                  <FilterChip key={st.key} pressed={activePhoneStage === st.key} onClick={() => setPhoneStage(st.key)}>
                    {st.label} · {byStage[st.key].length}
                  </FilterChip>
                ))}
              </div>
            </div>
            <div className="mt-3 flex flex-col gap-2">
              {byStage[activePhoneStage].length === 0 ? (
                <p className="rounded-[18px] bg-[#f1eff8] px-4 py-5 text-[14px] text-[#66647c]">
                  {query.trim() ? "No applications match your search." : `Nothing in ${STAGE_LABEL[activePhoneStage]} yet.`}
                </p>
              ) : (
                byStage[activePhoneStage].map((r) => <JobCard key={r.id} row={r} onOpen={() => setSelectedId(r.id)} />)
              )}
              <AddToStageButton label={STAGE_LABEL[activePhoneStage]} onClick={() => openCreate(activePhoneStage)} />
            </div>
          </div>

          {/* TABLET+ : the board. Scrolls inside its own box when the screen is narrow. */}
          <div className="relative hidden overflow-x-auto pb-2 md:block">
            <div className="grid min-w-[1020px] grid-cols-6 gap-2.5">
              {STAGES.map((st) => {
                const items = byStage[st.key];
                return (
                  <section
                    key={st.key}
                    aria-label={st.label}
                    className={`flex min-h-[520px] flex-col gap-2.5 rounded-[22px] p-3 ${STAGE_TONE[st.key].column}`}
                  >
                    <h2 className="flex items-center justify-between px-1.5 py-1 text-[15px] font-bold text-[#121226]">
                      {st.label}
                      <span className="rounded-full bg-white px-[9px] py-0.5 text-[12px] font-extrabold tabular-nums">
                        <span className="sr-only">Applications: </span>
                        {items.length}
                      </span>
                    </h2>
                    {items.length === 0 ? <p className="mx-1.5 my-2 text-[13px] text-[#66647c]">Nothing here yet.</p> : null}
                    {items.map((r) => (
                      <JobCard key={r.id} row={r} onOpen={() => setSelectedId(r.id)} />
                    ))}
                    <AddToStageButton label={st.label} onClick={() => openCreate(st.key)} />
                  </section>
                );
              })}
            </div>
          </div>
        </>
      )}

      {selected ? (
        <ApplicationDrawer
          app={selected}
          onClose={() => setSelectedId(null)}
          onStage={(s) => void updateStage(selected.id, s)}
          onChecklist={(next) => void updateChecklist(selected.id, next)}
          onDelete={() => void remove(selected.id)}
        />
      ) : null}

      {showCreate ? (
        <CreateDialog
          resumes={resumes}
          initialStage={createStage}
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

function AddToStageButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Add a job to ${label}`}
      className={`flex min-h-11 items-center justify-center gap-1.5 rounded-[14px] border-[1.5px] border-dashed border-[#c9c0ff] px-3 text-[13px] font-bold text-[#3a2bb8] transition-colors hover:border-[#5440e8] hover:bg-white/60 motion-reduce:transition-none focus-visible:rounded-[14px]! ${focusCls}`}
    >
      <Plus className="h-3.5 w-3.5" aria-hidden /> Add
    </button>
  );
}

function JobCard({ row: r, onOpen }: { row: JobRow; onOpen: () => void }) {
  const hot = stageOf(r.status) === "interviewing";
  const done = r.checklist.filter((i) => i.done).length;
  const total = r.checklist.length;
  const company = r.company || "Company not set";
  return (
    <button
      type="button"
      onClick={onOpen}
      className={`lc-rise w-full rounded-[18px] p-4 text-left shadow-[0_1px_2px_rgba(18,18,38,0.04),0_10px_20px_-16px_rgba(18,18,38,0.3)] motion-reduce:transition-none motion-reduce:hover:transform-none focus-visible:rounded-[18px]! ${focusCls} ${
        hot ? "bg-[#5440e8] text-white" : "bg-white text-[#121226]"
      }`}
    >
      <span className="flex min-w-0 items-center gap-2.5">
        <InitialTile name={company} tone={hot ? "bg-white" : "bg-[#f1eff8]"} />
        <span className="min-w-0">
          <span className="block truncate text-[15px] font-bold">{company}</span>
          <span className={`block truncate text-[13px] ${hot ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>{r.title || "Role not set"}</span>
        </span>
      </span>
      <span className={`mt-3 block truncate text-[12px] ${hot ? "text-[#e4dfff]" : "text-[#66647c]"}`}>
        {fmtDate(r.updatedAt)} · {r.resume.title}
      </span>
      {total > 0 ? (
        <span className="mt-2.5 flex items-center gap-2 text-[12px] font-bold">
          <Check className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span className="shrink-0">
            Checklist {done}/{total}
          </span>
          <span aria-hidden="true" className={`h-[5px] flex-1 overflow-hidden rounded-full ${hot ? "bg-white/25" : "bg-[#efedf7]"}`}>
            <span className={`block h-full rounded-full ${hot ? "bg-white" : "bg-[#5440e8]"}`} style={{ width: `${Math.round((done / total) * 100)}%` }} />
          </span>
        </span>
      ) : null}
    </button>
  );
}

function ApplicationDrawer({
  app,
  onClose,
  onStage,
  onChecklist,
  onDelete,
}: {
  app: JobRow;
  onClose: () => void;
  onStage: (s: StageKey) => void;
  onChecklist: (next: ChecklistItem[]) => void;
  onDelete: () => void;
}) {
  const [notes, setNotes] = useState<NoteRow[] | null>(null);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const panelRef = useDialogFocus<HTMLElement>();

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

  const stage = stageOf(app.status);
  const doneCount = app.checklist.filter((i) => i.done).length;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Application details">
      <div className={overlayCls} onClick={onClose} />
      <aside ref={panelRef} tabIndex={-1} className={`${drawerPanelCls} overflow-y-auto outline-none`}>
        <div className="flex items-start justify-between gap-4 px-5 pb-1 pt-6 sm:px-7 sm:pt-7">
          <div className="min-w-0">
            <span className={`inline-block rounded-full px-2.5 py-[5px] text-[12px] font-bold ${STAGE_TONE[stage].badge}`}>{STAGE_LABEL[stage]}</span>
            <h2 className="mt-2.5 break-words text-[22px] font-extrabold leading-[1.2] tracking-[-0.02em] sm:text-[24px]">
              {app.title || "Role not set"}
            </h2>
            <p className="mt-0.5 break-words text-[15px] text-[#4a4862]">{app.company || "Company not set"}</p>
          </div>
          <CloseButton onClick={onClose} />
        </div>

        <div className="flex flex-col gap-6 px-5 pb-8 pt-5 sm:px-7">
          <div>
            <p className={`${sectionLabelCls} mb-2`}>Prepare</p>
            <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
              <Link href={`/resume/${app.resumeId}/packet`} className={`${appBtnPrimary} min-[400px]:col-span-2`}>
                <FileText className="h-4 w-4" aria-hidden /> Interview packet
              </Link>
              <Link href={`/resume/${app.resumeId}/jd`} className={`${appBtnSoft}`}>
                <Target className="h-4 w-4" aria-hidden /> Match to this job
              </Link>
              <Link href={`/resume/${app.resumeId}/fit`} className={`${appBtnSoft}`}>
                <UserCheck className="h-4 w-4" aria-hidden /> Role-fit check
              </Link>
            </div>
          </div>

          <div>
            <p className={`${sectionLabelCls} mb-2`}>Stage</p>
            <div className="flex flex-wrap gap-1.5">
              {STAGES.map((s) => {
                const on = stage === s.key;
                return (
                  <button
                    key={s.key}
                    type="button"
                    onClick={() => onStage(s.key)}
                    aria-pressed={on}
                    className={`inline-flex min-h-11 items-center rounded-full px-3.5 text-[14px] font-semibold transition-colors motion-reduce:transition-none focus-visible:rounded-full! ${focusCls} ${
                      on ? "bg-[#111118] text-white" : "bg-[#f1eff8] text-[#121226] hover:bg-[#e4dfff]"
                    }`}
                  >
                    {s.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className={`${sectionLabelCls} mb-2`}>
              Checklist{" "}
              <span className="font-semibold text-[#66647c]">
                {doneCount}/{app.checklist.length}
              </span>
            </p>
            <ul className="flex flex-col">
              {app.checklist.map((item) => (
                <li key={item.id} className="border-t border-[#e2e0ea]">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={item.done}
                    onClick={() => onChecklist(app.checklist.map((i) => (i.id === item.id ? { ...i, done: !i.done } : i)))}
                    className={`flex min-h-11 w-full items-center gap-2.5 rounded-lg py-2.5 text-left text-[14px] transition-colors hover:bg-[#f7f6fb] motion-reduce:transition-none ${focusCls}`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-[6px] ${
                        item.done ? "bg-[#5440e8] text-white" : "border-[1.5px] border-[#c9c7d8] bg-white"
                      }`}
                    >
                      {item.done ? <Check className="h-3.5 w-3.5" aria-hidden strokeWidth={3} /> : null}
                    </span>
                    <span className={item.done ? "text-[#66647c] line-through" : "text-[#121226]"}>{item.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className={`${sectionLabelCls} mb-2`}>Resume sent</p>
            <Link
              href={`/resume/${app.resumeId}/edit`}
              className={`group flex min-h-12 items-center justify-between gap-3 rounded-[14px] bg-[#f7f6fb] px-3.5 py-3 text-[14px] transition-colors hover:bg-[#f1eff8] motion-reduce:transition-none focus-visible:rounded-[14px]! ${focusCls}`}
            >
              <b className="min-w-0 truncate font-bold">{app.resume.title}</b>
              <span className="inline-flex shrink-0 items-center gap-1 font-bold text-[#5440e8]">
                Open <ExternalLink className="h-3.5 w-3.5" aria-hidden />
              </span>
            </Link>
          </div>

          {app.jdExcerpt ? (
            <div>
              <p className={`${sectionLabelCls} mb-2`}>Job post</p>
              <p
                tabIndex={0}
                aria-label="Job post excerpt"
                className={`max-h-[180px] overflow-y-auto whitespace-pre-line rounded-[14px] bg-[#f7f6fb] px-3.5 py-3 text-[13px] leading-[1.6] text-[#4a4862] focus-visible:rounded-[14px]! ${focusCls}`}
              >
                {app.jdExcerpt}
              </p>
            </div>
          ) : null}

          <div>
            <label htmlFor="note" className={`${sectionLabelCls} mb-2 block`}>
              Notes
            </label>
            <textarea
              id="note"
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="Recruiter name, interview date, salary range…"
              className={textareaCls}
            />
            <button type="button" onClick={() => void addNote()} disabled={saving || !text.trim()} className={`${appBtnPrimary} mt-2`}>
              {saving ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden /> : null}
              Add note
            </button>
            <ul className="mt-3">
              {notes === null ? (
                <li className="text-[13px] text-[#66647c]">Loading notes…</li>
              ) : (
                notes.map((n) => (
                  <li key={n.id} className="border-t border-[#e2e0ea] py-3 text-[14px] leading-[1.5] text-[#24223a]">
                    <p className="whitespace-pre-line">{n.content}</p>
                    <p className="mt-1 text-[12px] text-[#66647c]">{fmtDate(n.createdAt)}</p>
                  </li>
                ))
              )}
            </ul>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[#e2e0ea] pt-4 text-[13px] text-[#66647c]">
            <span>Added {fmtDate(app.createdAt)}</span>
            <button type="button" onClick={onDelete} className={`${appBtnDanger} -mr-3`}>
              <Trash2 className="h-4 w-4" aria-hidden /> Delete application
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}

function CreateDialog({
  resumes,
  initialStage,
  onClose,
  onCreated,
}: {
  resumes: { id: string; title: string }[];
  initialStage: StageKey;
  onClose: () => void;
  onCreated: (row: JobRow) => void;
}) {
  const [form, setForm] = useState({ resumeId: resumes[0]?.id ?? "", company: "", title: "", jdText: "", status: initialStage });
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const formRef = useDialogFocus<HTMLFormElement>();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

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
      checklist: normalizeChecklist(j.application.checklist),
      createdAt: now,
      updatedAt: now,
      resume: { id: form.resumeId, title: resumes.find((x) => x.id === form.resumeId)?.title ?? "Resume" },
    });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-6" role="dialog" aria-modal="true" aria-label="Add a job">
      <div className={overlayCls} onClick={onClose} />
      <form
        ref={formRef}
        onSubmit={submit}
        className="lc-float relative flex max-h-[92vh] w-full max-w-[560px] flex-col gap-4 overflow-y-auto rounded-t-[28px] bg-white p-5 text-[#121226] sm:rounded-[28px] sm:p-7"
      >
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-[22px] font-extrabold tracking-[-0.02em] sm:text-[24px]">Add a job</h2>
          <CloseButton onClick={onClose} />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className={labelCls}>Company</span>
            <input className={fieldCls} value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} autoFocus />
          </label>
          <label>
            <span className={labelCls}>Role</span>
            <input className={fieldCls} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </label>
        </div>
        <label>
          <span className={labelCls}>Job post</span>
          <textarea
            className={`${textareaCls} min-h-[150px]`}
            rows={6}
            value={form.jdText}
            onChange={(e) => setForm({ ...form, jdText: e.target.value })}
            placeholder="Paste the full job description"
          />
        </label>
        <div className="grid gap-3 sm:grid-cols-2">
          <label>
            <span className={labelCls}>Resume you&apos;re sending</span>
            <SelectField value={form.resumeId} onChange={(e) => setForm({ ...form, resumeId: e.target.value })}>
              {resumes.length === 0 ? <option value="">No resumes yet</option> : null}
              {resumes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.title}
                </option>
              ))}
            </SelectField>
          </label>
          <label>
            <span className={labelCls}>Stage</span>
            <SelectField value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as StageKey })}>
              {STAGES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </SelectField>
          </label>
        </div>
        {err ? <ErrorNote>{err}</ErrorNote> : null}
        <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:justify-end">
          <button type="button" onClick={onClose} className={appBtnGhost}>
            Cancel
          </button>
          <button type="submit" disabled={saving} className={appBtnPrimary}>
            {saving ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden /> : null}
            Save job
          </button>
        </div>
      </form>
    </div>
  );
}
