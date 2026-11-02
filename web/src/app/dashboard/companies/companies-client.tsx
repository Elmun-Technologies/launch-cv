"use client";

import { useEffect, useMemo, useState } from "react";
import { Building2, ChevronRight, ExternalLink, Loader2, Plus, Trash2 } from "lucide-react";
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
  /** Furthest stage of the user's tracked jobs at this company (by name); null when none are tracked. */
  status?: CompanyStatus | null;
};

export type CompanyStatus = "Saved" | "Applied" | "Interviewing" | "Offer" | "Closed";

const STATUS_TONE: Record<CompanyStatus, string> = {
  Saved: "bg-[#f1eff8] text-[#4a4862]",
  Applied: "bg-[#f1eff8] text-[#121226]",
  Interviewing: "bg-[#e4dfff] text-[#3a2bb8]",
  Offer: "bg-[#dcf5ea] text-[#0b4f35]",
  Closed: "bg-[#f1eff8] text-[#66647c]",
};

const FILTERS = ["All", "Applied", "Interviewing", "Saved"] as const;
type Filter = (typeof FILTERS)[number];

function StatusBadge({ status }: { status: CompanyStatus | null | undefined }) {
  if (!status) return <span className="text-[#4a4862]">—</span>;
  return <span className={`inline-block rounded-full px-2.5 py-[5px] text-[12px] font-bold ${STATUS_TONE[status]}`}>{status}</span>;
}

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

/** Desktop table columns: company, industry, location, size, status, open. */
const GRID = "md:grid-cols-[1.6fr_1.1fr_1.1fr_0.8fr_1fr_56px]";

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
      status: editing?.status ?? null,
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
      <div className={overlayCls} onClick={onClose} />
      <form ref={formRef} onSubmit={save} className={drawerPanelCls}>
        <div className="flex items-center justify-between gap-4 px-5 pb-2 pt-6 sm:px-7 sm:pt-7">
          <h2 className="min-w-0 break-words text-[22px] font-extrabold tracking-[-0.02em] sm:text-[24px]">{editing ? editing.name : "Add a company"}</h2>
          <CloseButton onClick={onClose} />
        </div>
        <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-5 py-4 sm:px-7">
          <label>
            <span className={labelCls}>Company</span>
            <input className={fieldCls} value={f.name} onChange={set("name")} autoFocus={!editing} placeholder="Northwind" />
          </label>
          <label>
            <span className={labelCls}>Website</span>
            <input className={fieldCls} value={f.website} onChange={set("website")} placeholder="northwind.com" />
          </label>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Industry</span>
              <SelectField value={f.industry} onChange={set("industry")}>
                <option value="">—</option>
                {INDUSTRIES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </SelectField>
            </label>
            <label>
              <span className={labelCls}>Location</span>
              <input className={fieldCls} value={f.location} onChange={set("location")} placeholder="Remote, or a city" />
            </label>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label>
              <span className={labelCls}>Size</span>
              <SelectField value={f.size} onChange={set("size")}>
                <option value="">—</option>
                {SIZES.map((x) => (
                  <option key={x} value={x}>
                    {x} people
                  </option>
                ))}
              </SelectField>
            </label>
            <label>
              <span className={labelCls}>Type</span>
              <SelectField value={f.type} onChange={set("type")}>
                <option value="">—</option>
                {TYPES.map((x) => (
                  <option key={x}>{x}</option>
                ))}
              </SelectField>
            </label>
          </div>
          <label>
            <span className={labelCls}>Notes</span>
            <textarea
              className={`${textareaCls} min-h-[120px]`}
              value={f.description}
              onChange={set("description")}
              maxLength={8000}
              placeholder="Why you want to work here, open roles, who you know there."
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
  const [filter, setFilter] = useState<Filter>("All");
  const [drawer, setDrawer] = useState<{ form: Form; editing: CompanyRow | null } | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows
      .filter((c) => filter === "All" || c.status === filter)
      .filter((c) => !q || [c.name, c.industry, c.location].some((v) => v?.toLowerCase().includes(q)));
  }, [rows, query, filter]);

  const openNew = () => setDrawer({ form: EMPTY, editing: null });

  return (
    <div className="mx-auto flex w-full max-w-[1180px] flex-col gap-5 text-[#121226] sm:gap-6">
      <PageHeader
        title="Companies"
        lead="Keep a shortlist of target employers and what you know about each."
        actions={
          <button type="button" onClick={openNew} className={appBtnPrimary}>
            <Plus className="h-4 w-4" aria-hidden strokeWidth={2.2} /> Add company
          </button>
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon={<Building2 className="h-8 w-8" aria-hidden strokeWidth={1.8} />}
          title="No target companies yet"
          actions={
            <button type="button" onClick={openNew} className={appBtnPrimary}>
              <Plus className="h-4 w-4" aria-hidden strokeWidth={2.2} /> Add your first company
            </button>
          }
        >
          A focused list of 10–20 companies beats applying everywhere. Add the ones you&apos;d be excited to join.
        </EmptyState>
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <SearchField
              value={query}
              onChange={setQuery}
              label="Search companies"
              placeholder="Search name, industry or location"
              className="w-full sm:w-[340px]"
            />
            <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by application status">
              {FILTERS.map((f) => (
                <FilterChip key={f} pressed={filter === f} onClick={() => setFilter(f)}>
                  {f}
                </FilterChip>
              ))}
            </div>
          </div>
          <div className="lc-card overflow-hidden rounded-[24px]">
            <div className={`hidden gap-4 px-5 py-3.5 text-[12px] font-bold uppercase tracking-[0.06em] text-[#66647c] md:grid ${GRID}`} aria-hidden="true">
              <span>Company</span>
              <span>Industry</span>
              <span>Location</span>
              <span>Size</span>
              <span>Status</span>
              <span />
            </div>
            {shown.length === 0 ? (
              <p className="border-t border-[#e2e0ea] px-5 py-10 text-center text-[14px] text-[#66647c]">
                {filter !== "All" && !query.trim() ? `No companies with a job at “${filter}” in your tracker.` : "No companies match."}
              </p>
            ) : (
              <ul>
                {shown.map((c) => (
                  <li key={c.id} className="border-t border-[#e2e0ea] first:border-t-0 md:first:border-t">
                    <button
                      type="button"
                      onClick={() => setDrawer({ form: toForm(c), editing: c })}
                      className={`group grid w-full grid-cols-[1fr_auto] items-center gap-x-3 gap-y-1 px-4 py-4 text-left text-[14px] transition-colors hover:bg-[#f7f6fb] motion-reduce:transition-none sm:px-5 md:gap-4 ${GRID} ${focusCls} focus-visible:-outline-offset-[3px]!`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <InitialTile name={c.name} size={32} tone="bg-[#e4dfff]" />
                        <span className="min-w-0">
                          <span className="block truncate text-[15px] font-bold text-[#121226]">{c.name}</span>
                          {c.website ? (
                            <span className="flex items-center gap-1 truncate text-[13px] text-[#66647c]">
                              {hostOf(c.website)} <ExternalLink className="h-3 w-3 shrink-0" aria-hidden />
                            </span>
                          ) : null}
                          {/* Phone: the rest of the row as one muted line. */}
                          <span className="mt-0.5 block truncate text-[13px] text-[#4a4862] md:hidden">
                            {[c.industry, c.location, c.size ? `${c.size} people` : null, c.type].filter(Boolean).join(" · ") || "No details yet"}
                          </span>
                          {c.status ? (
                            <span className="mt-1.5 block md:hidden">
                              <StatusBadge status={c.status} />
                            </span>
                          ) : null}
                        </span>
                      </span>
                      <span className="hidden text-[#24223a] md:block">{c.industry || "—"}</span>
                      <span className="hidden text-[#24223a] md:block">{c.location || "—"}</span>
                      <span className="hidden text-[#4a4862] md:block">{c.size ? `${c.size} people` : "—"}</span>
                      <span className="hidden md:block">
                        <StatusBadge status={c.status} />
                      </span>
                      <span className="inline-flex items-center justify-end font-bold text-[#5440e8]">
                        <span className="hidden md:inline">Open</span>
                        <ChevronRight className="h-5 w-5 md:hidden" aria-hidden />
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
