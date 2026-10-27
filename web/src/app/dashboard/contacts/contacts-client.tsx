"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, Plus, Search, X } from "lucide-react";

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

const labelCls = "mb-1.5 block text-[13px] font-medium text-[#3F3F3F]";

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
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      <form onSubmit={save} className="relative flex h-full w-full max-w-[480px] flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#EEEEEB] px-6 py-5">
          <p className="text-[19px] font-semibold">{editing ? editing.name : "Add a contact"}</p>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-[#6B6B6B] hover:bg-[#F5F5F3]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          <label>
            <span className={labelCls}>Name</span>
            <input className="soha-input" value={f.name} onChange={set("name")} autoFocus={!editing} placeholder="Alex Morgan" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Role</span>
              <input className="soha-input" value={f.role} onChange={set("role")} placeholder="Engineering manager" />
            </label>
            <label>
              <span className={labelCls}>Company</span>
              <input className="soha-input" value={f.company} onChange={set("company")} placeholder="Northwind" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>How you know them</span>
              <select className="soha-select" value={f.relationship} onChange={set("relationship")}>
                {RELATIONSHIPS.map((r) => (
                  <option key={r}>{r}</option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelCls}>Status</span>
              <select className="soha-select" value={f.status} onChange={set("status")}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Last contact</span>
              <input type="date" className="soha-input" value={f.lastContactAt} onChange={set("lastContactAt")} />
            </label>
            <label>
              <span className={labelCls}>Follow up on</span>
              <input type="date" className="soha-input" value={f.followUpAt} onChange={set("followUpAt")} />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Email</span>
              <input type="email" className="soha-input" value={f.email} onChange={set("email")} />
            </label>
            <label>
              <span className={labelCls}>Phone</span>
              <input type="tel" className="soha-input" value={f.phone} onChange={set("phone")} />
            </label>
          </div>
          <label>
            <span className={labelCls}>LinkedIn</span>
            <input className="soha-input" value={f.linkedinUrl} onChange={set("linkedinUrl")} placeholder="linkedin.com/in/alex-morgan" />
          </label>
          <label>
            <span className={labelCls}>Notes</span>
            <textarea
              className="soha-textarea min-h-[96px]"
              value={f.goal}
              onChange={set("goal")}
              maxLength={2000}
              placeholder="What you talked about, what you're asking for, who introduced you."
            />
          </label>
          {err ? (
            <p role="alert" className="text-[14px] text-[#B42318]">
              {err}
            </p>
          ) : null}
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-[#EEEEEB] px-6 py-4">
          {editing ? (
            <button type="button" onClick={() => void del()} className="text-[14px] text-[#B42318] hover:underline">
              Delete
            </button>
          ) : (
            <span />
          )}
          <button type="submit" disabled={saving} className="soha-btn-primary inline-flex items-center gap-2">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden /> : null}
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
  const [dueOnly, setDueOnly] = useState(false);
  const [drawer, setDrawer] = useState<{ form: Form; editing: ContactRow | null } | null>(null);
  const t = today();

  const dueCount = rows.filter((c) => isDue(c, t)).length;

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((c) => !dueOnly || isDue(c, t))
      .filter((c) => !q || [c.name, c.company, c.role, c.email].some((v) => v?.toLowerCase().includes(q)));
  }, [rows, query, dueOnly, t]);

  function saved(c: ContactRow) {
    setRows((p) => [c, ...p.filter((x) => x.id !== c.id)]);
    setDrawer(null);
  }

  return (
    <div className="mx-auto flex max-w-[1080px] flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">
            Contacts <span className="text-[#8A8A86]">— the people who can get you hired.</span>
          </h1>
          <p className="mt-1 text-[15px] text-[#6B6B6B]">Recruiters, referrals and hiring managers, with a reminder to follow up.</p>
        </div>
        <button type="button" onClick={() => setDrawer({ form: EMPTY, editing: null })} className="soha-btn-primary inline-flex shrink-0 items-center gap-1.5">
          <Plus className="h-4 w-4" aria-hidden /> Add contact
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-[#D9D9D5] bg-white px-6 py-14 text-center">
          <p className="text-[17px] font-semibold">No contacts yet</p>
          <p className="mx-auto mt-1 max-w-[420px] text-[14px] text-[#6B6B6B]">
            Most offers come through people. Add the recruiter who messaged you or the friend who can refer you, and set a
            date to follow up.
          </p>
          <button type="button" onClick={() => setDrawer({ form: EMPTY, editing: null })} className="soha-btn-secondary mt-5">
            Add your first contact
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative sm:w-[320px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6E6A]" aria-hidden />
              <input
                className="soha-input pl-9"
                placeholder="Search name, company or email"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search contacts"
              />
            </div>
            <button
              type="button"
              aria-pressed={dueOnly}
              onClick={() => setDueOnly((d) => !d)}
              className={`h-9 self-start rounded-full px-4 text-[13px] sm:self-auto ${
                dueOnly ? "bg-[#111111] text-white" : "border border-[#D9D9D5] text-[#3F3F3F] hover:border-[#111111]"
              }`}
            >
              Follow-ups due{dueCount ? ` · ${dueCount}` : ""}
            </button>
          </div>

          <div className="overflow-hidden rounded-[14px] border border-[#E5E5E2] bg-white">
            <div className="hidden grid-cols-[1.6fr_1fr_1fr_0.7fr_0.7fr] gap-4 border-b border-[#EEEEEB] px-5 py-3 text-[13px] text-[#6B6B6B] md:grid">
              <span>Name</span>
              <span>How you know them</span>
              <span>Status</span>
              <span>Last contact</span>
              <span>Follow up</span>
            </div>
            {shown.length === 0 ? (
              <p className="px-5 py-8 text-center text-[14px] text-[#6B6B6B]">No contacts match.</p>
            ) : (
              <ul>
                {shown.map((c) => (
                  <li key={c.id} className="border-t border-[#EEEEEB] first:border-t-0">
                    <button
                      type="button"
                      onClick={() => setDrawer({ form: toForm(c), editing: c })}
                      className="grid w-full gap-1 px-5 py-3.5 text-left hover:bg-[#FAFAF9] md:grid-cols-[1.6fr_1fr_1fr_0.7fr_0.7fr] md:items-center md:gap-4"
                    >
                      <span className="min-w-0">
                        <span className="flex items-center gap-1.5 truncate text-[15px] font-medium text-[#111111]">
                          {c.name}
                          {c.linkedinUrl ? <ExternalLink className="h-3.5 w-3.5 shrink-0 text-[#6E6E6A]" aria-label="Has LinkedIn" /> : null}
                        </span>
                        <span className="block truncate text-[13px] text-[#6B6B6B]">
                          {[c.role, c.company].filter(Boolean).join(" · ") || c.email || "—"}
                        </span>
                      </span>
                      <span className="text-[14px] text-[#3F3F3F]">{c.relationship || "—"}</span>
                      <span className="text-[14px] text-[#3F3F3F]">{c.status && c.status !== "active" ? c.status : "—"}</span>
                      <span className="text-[14px] text-[#6B6B6B]">
                        <span className="md:hidden">Last contact </span>
                        {fmt(c.lastContactAt)}
                      </span>
                      <span className={`text-[14px] ${isDue(c, t) ? "font-medium text-[#C2341B]" : "text-[#6B6B6B]"}`}>
                        <span className="md:hidden">Follow up </span>
                        {isDue(c, t) && c.followUpAt?.slice(0, 10) === t ? "Today" : fmt(c.followUpAt)}
                      </span>
                    </button>
                  </li>
                ))}
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
