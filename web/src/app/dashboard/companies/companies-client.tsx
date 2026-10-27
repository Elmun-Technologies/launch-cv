"use client";

import { useEffect, useMemo, useState } from "react";
import { ExternalLink, Loader2, Plus, Search, X } from "lucide-react";

export type CompanyRow = {
  id: string;
  name: string;
  industry: string | null;
  location: string | null;
  size: string | null;
  type: string | null;
  website: string | null;
  foundedYear?: string | null;
  description?: string | null;
  createdAt: string;
};

const INDUSTRIES = ["Technology", "Finance", "Healthcare", "Retail", "Education", "Design", "Consulting", "Other"];
const SIZES = ["1-10", "11-50", "51-200", "201-500", "501-5,000", "5,000+"];
const TYPES = ["Public company", "Private company", "Startup", "Agency", "Non-profit"];

type Form = { name: string; industry: string; location: string; size: string; type: string; website: string; description: string };

const EMPTY: Form = { name: "", industry: "", location: "", size: "", type: "", website: "", description: "" };

const toForm = (c: CompanyRow): Form => ({
  name: c.name,
  industry: c.industry ?? "",
  location: c.location ?? "",
  size: c.size ?? "",
  type: c.type ?? "",
  website: c.website ?? "",
  description: c.description ?? "",
});

function normalizeUrl(v: string) {
  const t = v.trim();
  if (!t) return null;
  return /^https?:\/\//i.test(t) ? t : `https://${t}`;
}

const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
};

const labelCls = "mb-1.5 block text-[13px] font-medium text-[#3F3F3F]";

function CompanyDrawer({
  initial,
  editing,
  onClose,
  onSaved,
  onDeleted,
}: {
  initial: Form;
  editing: CompanyRow | null;
  onClose: () => void;
  onSaved: (c: CompanyRow) => void;
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
    if (!f.name.trim()) return setErr("Add the company name.");
    setSaving(true);
    setErr(null);
    const body = {
      name: f.name.trim(),
      industry: f.industry || null,
      location: f.location.trim() || null,
      size: f.size || null,
      type: f.type || null,
      website: normalizeUrl(f.website),
      description: f.description.trim() || null,
    };
    const res = await fetch(editing ? `/api/companies/${editing.id}` : "/api/companies", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => null);
    const j = res ? await res.json().catch(() => ({})) : {};
    setSaving(false);
    if (!res?.ok) {
      const msg = typeof j.error === "string" ? j.error : "Couldn't save. Please try again.";
      return setErr(msg === "Invalid website" ? "That website link doesn't look right." : msg);
    }
    onSaved({
      id: String(j.company?.id ?? editing?.id),
      ...body,
      foundedYear: editing?.foundedYear ?? null,
      createdAt: j.company?.createdAt ?? editing?.createdAt ?? new Date().toISOString(),
    });
  }

  async function del() {
    if (!editing || !confirm(`Delete ${editing.name}?`)) return;
    const res = await fetch(`/api/companies/${editing.id}`, { method: "DELETE" }).catch(() => null);
    if (res?.ok) onDeleted(editing.id);
    else setErr("Couldn't delete this company.");
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label={editing ? "Edit company" : "Add a company"}>
      <div className="absolute inset-0 bg-black/25" onClick={onClose} />
      <form onSubmit={save} className="relative flex h-full w-full max-w-[480px] flex-col bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-[#EEEEEB] px-6 py-5">
          <p className="text-[19px] font-semibold">{editing ? editing.name : "Add a company"}</p>
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-full p-1.5 text-[#6B6B6B] hover:bg-[#F5F5F3]">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-6 py-5">
          <label>
            <span className={labelCls}>Company</span>
            <input className="soha-input" value={f.name} onChange={set("name")} autoFocus={!editing} placeholder="Northwind" />
          </label>
          <label>
            <span className={labelCls}>Website</span>
            <input className="soha-input" value={f.website} onChange={set("website")} placeholder="northwind.com" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Industry</span>
              <select className="soha-select" value={f.industry} onChange={set("industry")}>
                <option value="">—</option>
                {INDUSTRIES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelCls}>Location</span>
              <input className="soha-input" value={f.location} onChange={set("location")} placeholder="Remote, or a city" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Size</span>
              <select className="soha-select" value={f.size} onChange={set("size")}>
                <option value="">—</option>
                {SIZES.map((x) => (
                  <option key={x} value={x}>
                    {x} people
                  </option>
                ))}
              </select>
            </label>
            <label>
              <span className={labelCls}>Type</span>
              <select className="soha-select" value={f.type} onChange={set("type")}>
                <option value="">—</option>
                {TYPES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </select>
            </label>
          </div>
          <label>
            <span className={labelCls}>Notes</span>
            <textarea
              className="soha-textarea min-h-[120px]"
              value={f.description}
              onChange={set("description")}
              maxLength={8000}
              placeholder="Why you want to work here, open roles, who you know there."
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
            {editing ? "Save" : "Add company"}
          </button>
        </div>
      </form>
    </div>
  );
}

export function CompaniesClient({ initial }: { initial: CompanyRow[] }) {
  const [rows, setRows] = useState<CompanyRow[]>(initial);
  const [query, setQuery] = useState("");
  const [drawer, setDrawer] = useState<{ form: Form; editing: CompanyRow | null } | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? rows.filter((c) => [c.name, c.industry, c.location].some((v) => v?.toLowerCase().includes(q))) : rows;
  }, [rows, query]);

  return (
    <div className="mx-auto flex max-w-[1080px] flex-col gap-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">
            Companies <span className="text-[#8A8A86]">— where you want to work.</span>
          </h1>
          <p className="mt-1 text-[15px] text-[#6B6B6B]">Keep a shortlist of target employers and what you know about each.</p>
        </div>
        <button type="button" onClick={() => setDrawer({ form: EMPTY, editing: null })} className="soha-btn-primary inline-flex shrink-0 items-center gap-1.5">
          <Plus className="h-4 w-4" aria-hidden /> Add company
        </button>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-[14px] border border-dashed border-[#D9D9D5] bg-white px-6 py-14 text-center">
          <p className="text-[17px] font-semibold">No target companies yet</p>
          <p className="mx-auto mt-1 max-w-[420px] text-[14px] text-[#6B6B6B]">
            A focused list of 10–20 companies beats applying everywhere. Add the ones you&apos;d be excited to join.
          </p>
          <button type="button" onClick={() => setDrawer({ form: EMPTY, editing: null })} className="soha-btn-secondary mt-5">
            Add your first company
          </button>
        </div>
      ) : (
        <>
          <div className="relative sm:w-[320px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#8A8A86]" aria-hidden />
            <input
              className="soha-input pl-9"
              placeholder="Search name, industry or location"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Search companies"
            />
          </div>
          <div className="overflow-hidden rounded-[14px] border border-[#E5E5E2] bg-white">
            <div className="hidden grid-cols-[1.6fr_1fr_1fr_0.8fr_1fr] gap-4 border-b border-[#EEEEEB] px-5 py-3 text-[13px] text-[#6B6B6B] md:grid">
              <span>Company</span>
              <span>Industry</span>
              <span>Location</span>
              <span>Size</span>
              <span>Type</span>
            </div>
            {shown.length === 0 ? (
              <p className="px-5 py-8 text-center text-[14px] text-[#6B6B6B]">No companies match.</p>
            ) : (
              <ul>
                {shown.map((c) => (
                  <li key={c.id} className="border-t border-[#EEEEEB] first:border-t-0">
                    <button
                      type="button"
                      onClick={() => setDrawer({ form: toForm(c), editing: c })}
                      className="grid w-full gap-1 px-5 py-3.5 text-left hover:bg-[#FAFAF9] md:grid-cols-[1.6fr_1fr_1fr_0.8fr_1fr] md:items-center md:gap-4"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-[15px] font-medium text-[#111111]">{c.name}</span>
                        {c.website ? (
                          <span className="flex items-center gap-1 truncate text-[13px] text-[#6B6B6B]">
                            {hostOf(c.website)} <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                          </span>
                        ) : null}
                      </span>
                      <span className="text-[14px] text-[#3F3F3F]">{c.industry || "—"}</span>
                      <span className="text-[14px] text-[#3F3F3F]">{c.location || "—"}</span>
                      <span className="text-[14px] text-[#6B6B6B]">{c.size ? `${c.size} people` : "—"}</span>
                      <span className="text-[14px] text-[#6B6B6B]">{c.type || "—"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {drawer ? (
        <CompanyDrawer
          key={drawer.editing?.id ?? "new"}
          initial={drawer.form}
          editing={drawer.editing}
          onClose={() => setDrawer(null)}
          onSaved={(c) => {
            setRows((p) => [c, ...p.filter((x) => x.id !== c.id)]);
            setDrawer(null);
          }}
          onDeleted={(id) => {
            setRows((p) => p.filter((x) => x.id !== id));
            setDrawer(null);
          }}
        />
      ) : null}
    </div>
  );
}
