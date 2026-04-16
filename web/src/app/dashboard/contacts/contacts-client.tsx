"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  FilePlus2,
  Loader2,
  Menu,
  Plus,
  Search,
  Send,
  SlidersHorizontal,
  UploadCloud,
  X,
} from "lucide-react";

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

type ResumeLite = { id: string; title: string };

type FormState = {
  name: string;
  relationship: string;
  goal: string;
  status: string;
  dateSaved: string;
  usernamePrefix: string;
  usernameValue: string;
  wantsEmails: boolean;
  followUp: string;
  linkedin: string;
  lastContact: string;
  description: string;
  profilePrefix: string;
  profileValue: string;
  summaryEmail: string;
};

const EMPTY: FormState = {
  name: "",
  relationship: "Co-worker",
  goal: "Networking",
  status: "Meeting scheduled",
  dateSaved: "",
  usernamePrefix: "https://",
  usernameValue: "",
  wantsEmails: true,
  followUp: "",
  linkedin: "",
  lastContact: "",
  description: "",
  profilePrefix: "https://",
  profileValue: "",
  summaryEmail: "",
};

function isoToDateValue(v: string | null | undefined) {
  if (!v) return "";
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function toForm(c: ContactRow | null): FormState {
  if (!c) return { ...EMPTY, dateSaved: new Date().toLocaleDateString("en-GB") };
  const linkedRaw = c.linkedinUrl ?? "";
  const clean = linkedRaw.replace(/^https?:\/\//i, "");
  return {
    name: c.name ?? "",
    relationship: c.relationship ?? "Co-worker",
    goal: c.goal ?? "Networking",
    status: c.status || "Meeting scheduled",
    dateSaved: new Date(c.createdAt).toLocaleDateString("en-GB"),
    usernamePrefix: "https://",
    usernameValue: clean,
    wantsEmails: true,
    followUp: isoToDateValue(c.followUpAt),
    linkedin: linkedRaw,
    lastContact: isoToDateValue(c.lastContactAt),
    description: c.role ?? "",
    profilePrefix: "https://",
    profileValue: clean,
    summaryEmail: c.email ?? "",
  };
}

export function ContactsClient({ initial, resumes }: { initial: ContactRow[]; resumes: ResumeLite[] }) {
  const [rows, setRows] = useState<ContactRow[]>(initial);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [groupBy, setGroupBy] = useState("none");
  const [selected, setSelected] = useState<ContactRow | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [creatingJob, setCreatingJob] = useState(false);
  const [uploads, setUploads] = useState<Array<{ id: string; name: string; progress: number }>>([]);

  const filtered = useMemo(
    () => rows.filter((r) => r.name.toLowerCase().includes(query.toLowerCase())),
    [rows, query],
  );

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const paged = filtered.slice((page - 1) * pageSize, page * pageSize);

  useEffect(() => {
    queueMicrotask(() => setPage(1));
  }, [query]);

  useEffect(() => {
    if (selected) queueMicrotask(() => setForm(toForm(selected)));
  }, [selected]);

  async function refreshContacts() {
    const r = await fetch("/api/contacts");
    const j = await r.json().catch(() => ({}));
    if (r.ok && Array.isArray(j.contacts)) setRows(j.contacts);
  }

  async function saveContact() {
    if (!form.name.trim()) { setErr("Name is required"); return; }
    setSaving(true); setErr(null);
    const linkedinUrl = form.linkedin.trim()
      ? form.linkedin.trim()
      : form.usernameValue.trim()
        ? `https://${form.usernameValue.trim()}`
        : "";

    const body = {
      name: form.name.trim(),
      email: form.summaryEmail.trim() || undefined,
      role: form.description.trim() || undefined,
      relationship: form.relationship,
      goal: form.goal,
      status: form.status,
      linkedinUrl: linkedinUrl || undefined,
      lastContactAt: form.lastContact || null,
      followUpAt: form.followUp || null,
    };

    const r = await fetch(selected ? `/api/contacts/${selected.id}` : "/api/contacts", {
      method: selected ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setSaving(false);
    if (!r.ok) { const j = await r.json().catch(() => ({})); setErr(j.error ?? "Error"); return; }
    await refreshContacts();
    setSelected(null);
  }

  function openEdit(row: ContactRow) {
    setSelected(row);
    setForm(toForm(row));
  }

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createF, setCreateF] = useState({ firstName: "", lastName: "", jobTitle: "", company: "", website: "", location: "", phone: "", twitter: "", wantsEmails: true });
  const [createBusy, setCreateBusy] = useState(false);

  function openCreate() {
    setCreateF({ firstName: "", lastName: "", jobTitle: "", company: "", website: "", location: "", phone: "", twitter: "", wantsEmails: true });
    setShowCreateModal(true);
  }

  async function submitCreate() {
    const name = `${createF.firstName.trim()} ${createF.lastName.trim()}`.trim();
    if (!name) { setErr("Name is required"); return; }
    setCreateBusy(true); setErr(null);
    const r = await fetch("/api/contacts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        role: createF.jobTitle.trim() || undefined,
        company: createF.company.trim() || undefined,
        phone: createF.phone.trim() || undefined,
        linkedinUrl: createF.website.trim() ? `https://${createF.website.trim().replace(/^https?:\/\//i, "")}` : undefined,
      }),
    });
    setCreateBusy(false);
    if (!r.ok) { const j = await r.json().catch(() => ({})); setErr(j.error ?? "Error"); return; }
    await refreshContacts();
    setShowCreateModal(false);
  }

  async function createRelatedJob() {
    if (resumes.length === 0) { setErr("Create a resume first"); return; }
    setCreatingJob(true); setErr(null);
    const r = await fetch("/api/applications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        resumeId: resumes[0].id,
        title: form.description.trim() || "Networking Follow-up",
        company: selected?.company ?? "Target Company",
        jdText: "This job opportunity is tracked from networking outreach. Responsibilities include communication with hiring teams, sending follow-up updates, and maintaining a professional relationship pipeline with clear outcomes.",
      }),
    });
    setCreatingJob(false);
    if (!r.ok) { const j = await r.json().catch(() => ({})); setErr(j.error ?? "Error"); }
  }

  function onPickFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploads((prev) => [...files.map((f, i) => ({ id: `${Date.now()}-${i}`, name: f.name, progress: 0 })), ...prev].slice(0, 3));
  }

  if (selected || form.name) {
    return (
      <div className="space-y-5">
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-gray-900">Networking</h2>
            <button type="button" onClick={() => { setSelected(null); setForm(EMPTY); }} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-4 lg:border-r lg:border-gray-100 lg:pr-5">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-gray-900">Relationship*</label>
                  <input className="soha-input mt-1.5" value={form.relationship} onChange={(e) => setForm({ ...form, relationship: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">Goal*</label>
                  <select className="soha-select mt-1.5" value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
                    <option>Networking</option><option>Referral</option><option>Information</option><option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">Status*</label>
                  <select className="soha-select mt-1.5" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option>Meeting scheduled</option><option>Contacted</option><option>Follow up</option><option>Connected</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">Date saved*</label>
                  <input className="soha-input mt-1.5" value={form.dateSaved} readOnly />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-semibold text-gray-900">Username*</label>
                  <div className="mt-1.5 flex">
                    <input className="soha-input w-16 rounded-r-none border-r-0 text-center" value={form.usernamePrefix} onChange={(e) => setForm({ ...form, usernamePrefix: e.target.value })} />
                    <input className="soha-input rounded-l-none" value={form.usernameValue} onChange={(e) => setForm({ ...form, usernameValue: e.target.value })} placeholder="www.linkdin.com" />
                  </div>
                </div>
              </div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" checked={form.wantsEmails} onChange={(e) => setForm({ ...form, wantsEmails: e.target.checked })} className="h-4 w-4 rounded border-gray-300 text-blue-500" />
                Yes, I want to receive emails
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-gray-900">Follow up</label>
                  <input type="date" className="soha-input mt-1.5" value={form.followUp} onChange={(e) => setForm({ ...form, followUp: e.target.value })} />
                </div>
                <div>
                  <label className="text-sm font-semibold text-gray-900">LinkedIn</label>
                  <input className="soha-input mt-1.5" value={form.linkedin} onChange={(e) => setForm({ ...form, linkedin: e.target.value })} placeholder="https://www.linkdein.com" />
                </div>
              </div>
              <div className="flex gap-3 pt-1">
                <button type="button" disabled={saving} onClick={() => void saveContact()} className="rounded-full bg-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6B4CE0]">
                  {saving ? <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> : null}Save
                </button>
                <button type="button" onClick={() => { setSelected(null); setForm(EMPTY); }} className="rounded-full border border-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-[#7C5CFC] transition hover:bg-violet-50">Cancel</button>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-gray-900">Last contact</label>
                <input type="date" className="soha-input mt-1.5" value={form.lastContact} onChange={(e) => setForm({ ...form, lastContact: e.target.value })} />
              </div>
              <textarea className="soha-textarea min-h-[100px]" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brif discription for your profile. URLs are hyperlinked" />
              <div>
                <label className="text-sm font-semibold text-gray-900">URL</label>
                <div className="mt-1.5 flex">
                  <input className="soha-input w-16 rounded-r-none border-r-0 text-center" value={form.profilePrefix} onChange={(e) => setForm({ ...form, profilePrefix: e.target.value })} />
                  <input className="soha-input rounded-l-none" value={form.profileValue} onChange={(e) => setForm({ ...form, profileValue: e.target.value })} placeholder="www.linkdin.com" />
                </div>
              </div>
              <div>
                <h3 className="text-[20px] font-bold text-gray-900">Personal Summaries</h3>
                <p className="mt-1 text-xs text-gray-500">This information will be displayed publicly so be careful what you share.</p>
                <div className="mt-3">
                  <label className="text-sm font-semibold text-gray-900">E-mail</label>
                  <input className="soha-input mt-1.5" value={form.summaryEmail} onChange={(e) => setForm({ ...form, summaryEmail: e.target.value })} placeholder="www.@gmail.com" />
                </div>
              </div>
            </div>
          </div>
          {err ? <p className="mt-3 text-sm text-red-600">{err}</p> : null}
        </div>

        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
          <div className="flex items-center justify-between">
            <h2 className="text-[20px] font-bold text-gray-900">Related Jobs</h2>
            <X className="h-5 w-5 text-gray-400" />
          </div>
          <div className="mt-4 grid gap-4 lg:grid-cols-[1fr_1.2fr]">
            <label className="flex min-h-[200px] cursor-pointer flex-col items-center justify-center rounded-xl border border-dashed border-gray-200 bg-white text-center transition hover:border-[#80C7FF]">
              <input type="file" multiple className="hidden" onChange={onPickFiles} />
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-50 text-[#7C5CFC]"><UploadCloud className="h-7 w-7" /></div>
              <p className="mt-3 text-lg font-semibold text-gray-900">Drag & Drop file here</p>
              <p className="mt-1 text-sm text-gray-400">or click to browse (4mb max)</p>
            </label>
            <div className="space-y-3">
              {(uploads.length ? uploads : [{ id: "p1", name: "Prototype screenshot05.mp4", progress: 0 }, { id: "p2", name: "Prototype screenshot05.mp4", progress: 0 }, { id: "p3", name: "Prototype screenshot05.mp4", progress: 0 }]).map((u) => (
                <div key={u.id} className="flex items-center gap-3 rounded-lg border border-gray-100 p-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-violet-50 text-[#7C5CFC]"><FilePlus2 className="h-4 w-4" /></div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-gray-700">{u.name}</p>
                    <div className="mt-1 h-2 w-full rounded-full bg-[#E7F3FF]"><div className="h-full rounded-full bg-[#7C5CFC]" style={{ width: `${u.progress}%` }} /></div>
                  </div>
                  <span className="text-sm text-gray-400">{String(u.progress).padStart(2, "0")}%</span>
                  <button type="button" onClick={() => setUploads((p) => p.filter((x) => x.id !== u.id))} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
                </div>
              ))}
              <button type="button" onClick={() => void createRelatedJob()} disabled={creatingJob} className="mt-1 w-full rounded-full bg-[#7C5CFC] py-2.5 text-sm font-semibold text-white transition hover:bg-[#6B4CE0] disabled:opacity-70">
                {creatingJob ? <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> : <Plus className="mr-1 inline h-4 w-4" />}
                Create a New Job
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="relative w-72">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input className="soha-input h-10 pl-9" placeholder="Search" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
            <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-sm text-gray-500"><SlidersHorizontal className="h-4 w-4" /></button>
            <button type="button" className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 text-sm text-gray-500">K</button>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select className="soha-select !h-10 !w-40 !text-sm" value={groupBy} onChange={(e) => setGroupBy(e.target.value)}>
              <option value="none">Group by : None</option>
              <option value="company">Group by : Company</option>
              <option value="status">Group by : Status</option>
            </select>
            <button type="button" className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-500"><Menu className="h-4 w-4" />Menu</button>
            <button type="button" onClick={openCreate} className="inline-flex h-10 items-center rounded-lg border border-[#7C5CFC] px-4 text-sm font-semibold text-[#7C5CFC] transition hover:bg-violet-50">
              <Plus className="mr-1 h-4 w-4" />Add a New Job
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] text-left">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-[12px] uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Full Name</th>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Goal</th>
                <th className="px-4 py-3 font-semibold">Follow Up</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {paged.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-gray-500">No contacts found.</td></tr>
              ) : (
                paged.map((row) => (
                  <tr key={row.id} className="text-sm">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 text-xs font-bold text-white">
                          {row.name.slice(0, 1).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">{row.name} *</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-gray-700">{row.company ?? "Acme Corp"}</td>
                    <td className="px-4 py-4 text-gray-500">Bangladesh</td>
                    <td className="px-4 py-4">
                      <span className="rounded-full bg-[#EAF8E8] px-3 py-1 text-xs font-semibold text-[#73B76A]">
                        {row.status === "active" ? "Add Status" : row.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-gray-500">{row.goal ?? "Add Goal"}</td>
                    <td className="px-4 py-4 text-gray-500">{row.followUpAt ? new Date(row.followUpAt).toLocaleDateString() : "Add Date"}</td>
                    <td className="px-4 py-4 text-right">
                      <button type="button" onClick={() => openEdit(row)} className="rounded-lg border border-[#7C5CFC] px-4 py-1.5 text-sm font-semibold text-[#7C5CFC] transition hover:bg-violet-50">Edit</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Result per page:</span>
            <select className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <button type="button" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="rounded-md border border-gray-200 px-2 py-1 text-gray-500 disabled:opacity-50"><ChevronLeft className="h-4 w-4" /></button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              const p = idx + Math.max(1, Math.min(page - 2, totalPages - 4));
              if (p > totalPages) return null;
              return (
                <button key={p} type="button" onClick={() => setPage(p)} className={`h-8 min-w-8 rounded-md px-2 ${p === page ? "bg-violet-50 font-semibold text-[#7C5CFC]" : "text-gray-500"}`}>{p}</button>
              );
            })}
            <button type="button" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page >= totalPages} className="rounded-md border border-gray-200 px-2 py-1 text-gray-500 disabled:opacity-50"><ChevronRight className="h-4 w-4" /></button>
          </div>
        </div>
      </div>

      {showCreateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-gray-900">Add a New Contact</h3>
              <button type="button" onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-semibold text-gray-900">First Name*</label><input className="soha-input mt-1.5" value={createF.firstName} onChange={(e) => setCreateF((p) => ({ ...p, firstName: e.target.value }))} placeholder="Us Dollar" /></div>
                <div><label className="text-sm font-semibold text-gray-900">Last Name*</label><input className="soha-input mt-1.5" value={createF.lastName} onChange={(e) => setCreateF((p) => ({ ...p, lastName: e.target.value }))} placeholder="1.000" /></div>
              </div>
              <div><label className="text-sm font-semibold text-gray-900">Job Title*</label><input className="soha-input mt-1.5" value={createF.jobTitle} onChange={(e) => setCreateF((p) => ({ ...p, jobTitle: e.target.value }))} placeholder="Product Designer" /></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-semibold text-gray-900">Company*</label><input className="soha-input mt-1.5" value={createF.company} onChange={(e) => setCreateF((p) => ({ ...p, company: e.target.value }))} placeholder="Webflow" /></div>
                <div><label className="text-sm font-semibold text-gray-900">Website*</label><div className="mt-1.5 flex"><span className="flex items-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">HTTPS://</span><input className="soha-input rounded-l-none" value={createF.website} onChange={(e) => setCreateF((p) => ({ ...p, website: e.target.value }))} placeholder="www.linkdin.com" /></div></div>
                <div><label className="text-sm font-semibold text-gray-900">Location</label><input className="soha-input mt-1.5" value={createF.location} onChange={(e) => setCreateF((p) => ({ ...p, location: e.target.value }))} placeholder="Bangladesh" /></div>
                <div><label className="text-sm font-semibold text-gray-900">Phone Number</label><input className="soha-input mt-1.5" value={createF.phone} onChange={(e) => setCreateF((p) => ({ ...p, phone: e.target.value }))} placeholder="+8801988784435" /></div>
              </div>
              <div><label className="text-sm font-semibold text-gray-900">Twitter</label><input className="soha-input mt-1.5" value={createF.twitter} onChange={(e) => setCreateF((p) => ({ ...p, twitter: e.target.value }))} placeholder="https://twitter.com//naimur" /></div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" checked={createF.wantsEmails} onChange={(e) => setCreateF((p) => ({ ...p, wantsEmails: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-blue-500" />Yes, I want to receive emails</label>
              {err ? <p className="text-sm text-red-600">{err}</p> : null}
              <div className="flex gap-3">
                <button type="button" onClick={() => void submitCreate()} disabled={createBusy} className="rounded-full bg-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6B4CE0] disabled:opacity-70">{createBusy ? <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> : null}Save</button>
                <button type="button" onClick={() => setShowCreateModal(false)} className="rounded-full border border-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-[#7C5CFC] transition hover:bg-violet-50">Cancel</button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
