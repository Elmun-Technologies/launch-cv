"use client";

import { useEffect, useMemo, useState } from "react";
import { CalendarClock, ChevronRight, Loader2, Plus, Trash2, Users } from "lucide-react";
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
  appBtnPrimary,
  drawerPanelCls,
  fieldCls,
  focusCls,
  labelCls,
  overlayCls,
  textareaCls,
  useDialogFocus,
} from "@/components/app/jobs/ui";

export type ContactRow = {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  company: string | null;
  role: string | null;
  relationship: string | null;
  goal: string | null;
  status: string;
  linkedinUrl: string | null;
  createdAt: string;
  lastContactAt: string | null;
  followUpAt: string | null;
};

const RELATIONSHIPS = ["Recruiter", "Hiring manager", "Referral", "Former colleague", "Mentor", "Friend", "Other"];
const STATUSES = ["To reach out", "Contacted", "Replied", "Meeting scheduled", "Follow up", "Connected"];

type Form = {
  name: string;
  role: string;
  company: string;
  email: string;
  phone: string;
  linkedinUrl: string;
  relationship: string;
  status: string;
  lastContactAt: string;
  followUpAt: string;
  goal: string;
};

const EMPTY: Form = {
  name: "",
  role: "",
  company: "",
  email: "",
  phone: "",
  linkedinUrl: "",
  relationship: "Recruiter",
  status: "To reach out",
  lastContactAt: "",
  followUpAt: "",
  goal: "",
};

const dateInput = (v: string | null) => (v ? v.slice(0, 10) : "");
const fmt = (v: string | null) => {
  if (!v) return "—";
  const d = new Date(v);
  const sameYear = d.getUTCFullYear() === new Date().getUTCFullYear();
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", ...(sameYear ? {} : { year: "numeric" }), timeZone: "UTC" });
};
const today = () => new Date().toISOString().slice(0, 10);
const isDue = (c: ContactRow, day: string) => !!c.followUpAt && c.followUpAt.slice(0, 10) <= day;

function toForm(c: ContactRow): Form {
  return {
    name: c.name,
    role: c.role ?? "",
    company: c.company ?? "",
    email: c.email ?? "",
    phone: c.phone ?? "",
    linkedinUrl: c.linkedinUrl ?? "",
    relationship: c.relationship ?? "Other",
    status: c.status && c.status !== "active" ? c.status : "To reach out",
    lastContactAt: dateInput(c.lastContactAt),
    followUpAt: dateInput(c.followUpAt),
    goal: c.goal ?? "",
  };
}

function normalizeUrl(v: string) {
  const t = v.trim();
  if (!t) return null;
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

/** Desktop table columns: name (role · company), how you know them, status, next step, email/LinkedIn. */
const GRID = "md:grid-cols-[1.6fr_1fr_1fr_1.2fr_130px]";

/** Recruiters filter: the role (or how you know them) says recruiter / talent. */
const isRecruiter = (c: ContactRow) => /recruit|talent/i.test(`${c.role ?? ""} ${c.relationship ?? ""}`);

/** Only open http(s) LinkedIn links stored on the contact. */
function safeHref(url: string | null): string | null {
  if (!url) return null;
  const u = /^https?:\/\//i.test(url.trim()) ? url.trim() : `https://${url.trim()}`;
  try {
    const parsed = new URL(u);
    return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.toString() : null;
  } catch {
    return null;
  }
}

function ContactDrawer({
  initial,
  editing,
  onClose,
  onSaved,
  onDeleted,
}: {
  initial: Form;
  editing: ContactRow | null;
  onClose: () => void;
  onSaved: (c: ContactRow) => void;
  onDeleted: (id: string) => void;
}) {
  const [f, setF] = useState<Form>(initial);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const formRef = useDialogFocus<HTMLFormElement>();
  const set = (k: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF((p) => ({ ...p, [k]: e.target.value }));

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!f.name.trim()) return setErr("Add a name.");
    setSaving(true);
    setErr(null);
    const body = {
      name: f.name.trim(),
      role: f.role.trim() || null,
      company: f.company.trim() || null,
      email: f.email.trim() || null,
      phone: f.phone.trim() || null,
      linkedinUrl: normalizeUrl(f.linkedinUrl),
      relationship: f.relationship,
      status: f.status,
      goal: f.goal.trim() || null,
      lastContactAt: f.lastContactAt || null,
      followUpAt: f.followUpAt || null,
    };
    const res = await fetch(editing ? `/api/contacts/${editing.id}` : "/api/contacts", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    const j = res ? await res.json().catch(() => ({})) : {};
    setSaving(false);
    if (!res?.ok) {
      const msg = typeof j.error === "string" ? j.error : "Couldn't save. Please try again.";
      return setErr(msg === "Invalid linkedinUrl" ? "That LinkedIn link doesn't look right." : msg);
    }
    const c = (j.contact ?? j) as Partial<ContactRow> & { lastContactAt?: string | null; followUpAt?: string | null };
    onSaved({
      id: String(c.id ?? editing?.id),
      name: body.name,
      email: body.email,
      phone: body.phone,
      company: body.company,
      role: body.role,
      relationship: body.relationship,
      goal: body.goal,
      status: body.status,
      linkedinUrl: body.linkedinUrl,
      createdAt: c.createdAt ?? editing?.createdAt ?? new Date().toISOString(),
      lastContactAt: body.lastContactAt ? `${body.lastContactAt}T00:00:00.000Z` : null,
      followUpAt: body.followUpAt ? `${body.followUpAt}T00:00:00.000Z` : null,
    });
  }

  async function del() {
    if (!editing || !confirm(`Delete ${editing.name}?`)) return;
    const res = await fetch(`/api/contacts/${editing.id}`, { method: "DELETE" }).catch(() => null);
    if (res?.ok) onDeleted(editing.id);
    else setErr("Couldn't delete this contact.");
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={editing ? "Edit contact" : "Add a contact"}>
      <div className={overlayCls} onClick={onClose} />
      <form ref={formRef} onSubmit={save} className={drawerPanelCls}>
        <div className="flex items-center justify-between gap-4 px-5 pb-2 pt-6 sm:px-7 sm:pt-7">
          <h2 className="min-w-0 break-words text-[22px] font-extrabold tracking-[-0.02em] sm:text-[24px]">{editing ? editing.name : "Add a contact"}</h2>
          <CloseButton onClick={onClose} />
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-4 sm:px-7">
          <label>
            <span className={labelCls}>Name</span>
            <input className={fieldCls} value={f.name} onChange={set("name")} autoFocus={!editing} placeholder="Alex Morgan" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Role</span>
              <input className={fieldCls} value={f.role} onChange={set("role")} placeholder="Engineering manager" />
            </label>
            <label>
              <span className={labelCls}>Company</span>
              <input className={fieldCls} value={f.company} onChange={set("company")} placeholder="Northwind" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>How you know them</span>
              <SelectField value={f.relationship} onChange={set("relationship")}>
                {RELATIONSHIPS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </SelectField>
            </label>
            <label>
              <span className={labelCls}>Status</span>
              <SelectField value={f.status} onChange={set("status")}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </SelectField>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Last contact</span>
              <input type="date" className={fieldCls} value={f.lastContactAt} onChange={set("lastContactAt")} />
            </label>
            <label>
              <span className={labelCls}>Follow up on</span>
              <input type="date" className={fieldCls} value={f.followUpAt} onChange={set("followUpAt")} />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Email</span>
              <input type="email" className={fieldCls} value={f.email} onChange={set("email")} />
            </label>
            <label>
              <span className={labelCls}>Phone</span>
              <input type="tel" className={fieldCls} value={f.phone} onChange={set("phone")} />
            </label>
          </div>
          <label>
            <span className={labelCls}>LinkedIn</span>
            <input className={fieldCls} value={f.linkedinUrl} onChange={set("linkedinUrl")} placeholder="linkedin.com/in/alex-morgan" />
          </label>
          <label>
            <span className={labelCls}>Notes</span>
            <textarea
              className={textareaCls}
              value={f.goal}
              onChange={set("goal")}
              maxLength={2000}
              placeholder="What you talked about, what you're asking for, who introduced you."
            />
          </label>
          {err ? <ErrorNote>{err}</ErrorNote> : null}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[#e2e0ea] px-5 py-4 sm:px-7">
          {editing ? (
            <button type="button" onClick={() => void del()} className={`${appBtnDanger} -ml-3`}>
              <Trash2 className="h-4 w-4" aria-hidden /> Delete
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={saving} className={appBtnPrimary}>
            {saving ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden /> : null}
            {editing ? "Save" : "Add contact"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function ContactsClient({ initial }: { initial: ContactRow[] }) {
  const [rows, setRows] = useState<ContactRow[]>(initial);
  const [query, setQuery] = useState("");
  const [view, setView] = useState<"all" | "due" | "recruiters">("all");
  const [drawer, setDrawer] = useState<{ form: Form; editing: ContactRow | null } | null>(null);
  const t = today();

  const dueCount = rows.filter((c) => isDue(c, t)).length;
  const recruiterCount = rows.filter(isRecruiter).length;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((c) => (view === "due" ? isDue(c, t) : view === "recruiters" ? isRecruiter(c) : true))
      .filter((c) => !q || [c.name, c.company, c.role, c.email].some((v) => v?.toLowerCase().includes(q)));
  }, [rows, query, view, t]);

  function saved(c: ContactRow) {
    setRows((p) => [c, ...p.filter((x) => x.id !== c.id)]);
    setDrawer(null);
  }

  const openNew = () => setDrawer({ form: EMPTY, editing: null });

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 text-[#121226] sm:gap-6">
      <PageHeader
        title="Contacts"
        lead="Recruiters, referrals and hiring managers, with a reminder to follow up."
        actions={
          <button type="button" onClick={openNew} className={appBtnPrimary}>
            <Plus className="h-4 w-4" aria-hidden strokeWidth={2.2} /> Add contact
          </button>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<Users className="h-8 w-8" aria-hidden strokeWidth={1.8} />}
          title="No contacts yet"
          actions={
            <button type="button" onClick={openNew} className={appBtnPrimary}>
              <Plus className="h-4 w-4" aria-hidden strokeWidth={2.2} /> Add your first contact
            </button>
          }
        >
          Most offers come through people. Add the recruiter who messaged you or the friend who can refer you, and set a date
          to follow up.
        </EmptyState>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchField
              value={query}
              onChange={setQuery}
              label="Search contacts"
              placeholder="Search name, company or email"
              className="w-full sm:w-[340px]"
            />
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter contacts">
              <FilterChip pressed={view === "all"} onClick={() => setView("all")}>
                All
              </FilterChip>
              <FilterChip pressed={view === "due"} onClick={() => setView("due")}>
                Follow-ups due{dueCount ? ` · ${dueCount}` : ""}
              </FilterChip>
              <FilterChip pressed={view === "recruiters"} onClick={() => setView("recruiters")}>
                Recruiters{recruiterCount ? ` · ${recruiterCount}` : ""}
              </FilterChip>
            </div>
          </div>

          <div className="lc-card overflow-hidden rounded-[24px]">
            <div className={`hidden gap-4 px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c] md:grid ${GRID}`} aria-hidden="true">
              <span>Name</span>
              <span>How you know them</span>
              <span>Status</span>
              <span>Next</span>
              <span className="text-right">Reach out</span>
            </div>
            {shown.length === 0 ? (
              <p className="border-t border-[#e2e0ea] px-5 py-10 text-center text-[14px] text-[#66647c]">No contacts match.</p>
            ) : (
              <ul>
                {shown.map((c) => {
                  const due = isDue(c, t);
                  const status = c.status && c.status !== "active" ? c.status : null;
                  const li = safeHref(c.linkedinUrl);
                  return (
                    <li
                      key={c.id}
                      className={`relative grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 border-t border-[#e2e0ea] px-4 py-4 text-[14px] transition-colors first:border-t-0 hover:bg-[#f7f6fb] motion-reduce:transition-none sm:px-5 md:gap-4 md:first:border-t ${GRID}`}
                    >
                        <span className="flex min-w-0 items-center gap-2.5">
                          <InitialTile name={c.name} size={32} />
                          <span className="min-w-0">
                            {/* The name opens the contact; its hit area covers the whole row (links sit above it). */}
                            <button
                              type="button"
                              onClick={() => setDrawer({ form: toForm(c), editing: c })}
                              className={`block max-w-full truncate text-left text-[15px] font-bold text-[#121226] before:absolute before:inset-0 before:content-[''] ${focusCls} focus-visible:rounded-md!`}
                            >
                              {c.name}
                            </button>
                            <span className="block truncate text-[13px] text-[#66647c]">
                              {[c.role, c.company].filter(Boolean).join(" · ") || c.email || "—"}
                            </span>
                            {/* Phone: relationship, status and dates as one line. */}
                            <span className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px] text-[#4a4862] md:hidden">
                              {c.relationship ? <span>{c.relationship}</span> : null}
                              {status ? <StatusBadge status={status} /> : null}
                            </span>
                            <span className="mt-1 block text-[13px] md:hidden">
                              <NextStep c={c} due={due} today={t} />
                            </span>
                          </span>
                        </span>
                        <span className="hidden text-[#24223a] md:block">{c.relationship || "—"}</span>
                        <span className="hidden md:block">{status ? <StatusBadge status={status} /> : <span className="text-[#4a4862]">—</span>}</span>
                        <span className="hidden md:block">
                          <NextStep c={c} due={due} today={t} />
                        </span>
                        <span className="relative z-10 flex items-center justify-end gap-x-1 text-[14px] font-bold text-[#5440e8]">
                          {c.email ? (
                            <a href={`mailto:${c.email}`} className={`lc-link inline-flex min-h-11 items-center px-1 hover:text-[#3a2bb8] ${focusCls}`}>
                              Email<span className="sr-only"> {c.name}</span>
                            </a>
                          ) : null}
                          {c.email && li ? <span aria-hidden="true" className="text-[#66647c]">·</span> : null}
                          {li ? (
                            <a href={li} target="_blank" rel="noopener noreferrer" className={`lc-link inline-flex min-h-11 items-center px-1 hover:text-[#3a2bb8] ${focusCls}`}>
                              LinkedIn<span className="sr-only"> profile of {c.name} (opens in a new tab)</span>
                            </a>
                          ) : null}
                          {!c.email && !li ? <ChevronRight className="h-5 w-5 text-[#66647c]" aria-hidden /> : null}
                        </span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}

      {drawer ? (
        <ContactDrawer
          key={drawer.editing?.id ?? "new"}
          initial={drawer.form}
          editing={drawer.editing}
          onClose={() => setDrawer(null)}
          onSaved={saved}
          onDeleted={(id) => {
            setRows((p) => p.filter((x) => x.id !== id));
            setDrawer(null);
          }}
        />
      ) : null}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "Connected" || status === "Replied" || status === "Meeting scheduled"
      ? "bg-[#dcf5ea] text-[#0b4f35]"
      : status === "Follow up"
        ? "bg-[#fdf0d5] text-[#7a4600]"
        : status === "Contacted"
          ? "bg-[#e4dfff] text-[#3a2bb8]"
          : "bg-[#f1eff8] text-[#4a4862]";
  return <span className={`inline-block rounded-full px-2.5 py-[5px] text-[12px] font-bold ${tone}`}>{status}</span>;
}

/** Follow-up date first (red when due), last contact underneath. */
function NextStep({ c, due, today: day }: { c: ContactRow; due: boolean; today: string }) {
  return (
    <span className="flex flex-col gap-0.5">
      {c.followUpAt ? (
        <span className={`inline-flex items-center gap-1.5 ${due ? "font-bold text-[#c42b30]" : "text-[#24223a]"}`}>
          <CalendarClock className="h-4 w-4 shrink-0" aria-hidden />
          Follow up {due && c.followUpAt.slice(0, 10) === day ? "today" : fmt(c.followUpAt)}
        </span>
      ) : (
        <span className="text-[#66647c]">No follow-up set</span>
      )}
      {c.lastContactAt ? <span className="text-[12px] text-[#66647c]">Last contact {fmt(c.lastContactAt)}</span> : null}
    </span>
  );
}
