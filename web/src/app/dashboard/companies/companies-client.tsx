"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight, Loader2, Plus, Search, SlidersHorizontal, X } from "lucide-react";

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

type FormState = {
  name: string;
  industry: string;
  location: string;
  size: string;
  type: string;
  website: string;
  foundedYear: string;
};

const EMPTY_FORM: FormState = {
  name: "",
  industry: "",
  location: "",
  size: "",
  type: "Public company",
  website: "",
  foundedYear: "",
};

function toForm(company: CompanyRow | null): FormState {
  if (!company) return { ...EMPTY_FORM };
  return {
    name: company.name,
    industry: company.industry ?? "",
    location: company.location ?? "",
    size: company.size ?? "",
    type: company.type ?? "Public company",
    website: company.website ?? "",
    foundedYear: company.foundedYear ?? "",
  };
}

export function CompaniesClient({ initial }: { initial: CompanyRow[] }) {
  const [rows, setRows] = useState<CompanyRow[]>(initial);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [total, setTotal] = useState(initial.length);
  const [totalPages, setTotalPages] = useState(Math.max(1, Math.ceil(initial.length / 6)));
  const [groupBy, setGroupBy] = useState("none");
  const [editing, setEditing] = useState<CompanyRow | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function refresh(opts?: { nextPage?: number; nextQuery?: string; nextPageSize?: number }) {
    const finalPage = opts?.nextPage ?? page;
    const finalQuery = opts?.nextQuery ?? query;
    const finalPageSize = opts?.nextPageSize ?? pageSize;
    setLoading(true);
    const params = new URLSearchParams({
      page: String(finalPage),
      pageSize: String(finalPageSize),
    });
    if (finalQuery.trim()) params.set("q", finalQuery.trim());
    const r = await fetch(`/api/companies?${params.toString()}`);
    const j = await r.json().catch(() => ({}));
    setLoading(false);
    if (r.ok && Array.isArray(j.companies)) {
      setRows(j.companies as CompanyRow[]);
      setTotal(Number(j.pagination?.total ?? j.companies.length));
      setTotalPages(Number(j.pagination?.totalPages ?? 1));
      setPage(Number(j.pagination?.page ?? finalPage));
      setPageSize(Number(j.pagination?.pageSize ?? finalPageSize));
    }
  }

  useEffect(() => {
    void refresh({ nextPage: 1, nextQuery: query });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  async function saveCompany(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!form.name.trim()) {
      setErr("Company name is required");
      return;
    }
    setSaving(true);
    setErr(null);
    const payload = {
      name: form.name.trim(),
      industry: form.industry.trim() || null,
      location: form.location.trim() || null,
      size: form.size || null,
      type: form.type || null,
      website: form.website || null,
      foundedYear: form.foundedYear || null,
    };

    const r = await fetch(editing ? `/api/companies/${editing.id}` : "/api/companies", {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!r.ok) {
      const j = await r.json().catch(() => ({}));
      setErr(j.error ?? "Could not save company");
      return;
    }
    setShowModal(false);
    setEditing(null);
    setForm(EMPTY_FORM);
    await refresh();
  }

  function openCreate() {
    setEditing(null);
    setErr(null);
    setForm(EMPTY_FORM);
    setShowModal(true);
  }

  function openEdit(row: CompanyRow) {
    setEditing(row);
    setErr(null);
    setForm(toForm(row));
    setShowModal(true);
  }

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative w-full max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              className="soha-input h-10 pl-9"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <select
              className="soha-select !h-10 !w-40 !text-sm"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="none">Group by : None</option>
              <option value="type">Group by : Type</option>
              <option value="size">Group by : Size</option>
            </select>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-gray-200 bg-white px-4 text-sm font-medium text-gray-500"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Menu
            </button>
            <button
              type="button"
              onClick={openCreate}
              className="inline-flex h-10 items-center rounded-lg border border-[#7C5CFC] px-4 text-sm font-semibold text-[#7C5CFC] transition hover:bg-violet-50"
            >
              <Plus className="mr-1 h-4 w-4" />
              Add a New Job
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_1px_3px_rgba(16,24,40,0.04)]">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left">
            <thead className="border-b border-gray-100 bg-gray-50/70 text-[12px] uppercase tracking-wider text-gray-400">
              <tr>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-4 py-3 font-semibold">Industry</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Size</th>
                <th className="px-4 py-3 font-semibold">Type</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                    <Loader2 className="mr-2 inline h-4 w-4 animate-spin" />
                    Loading companies...
                  </td>
                </tr>
              ) : rows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-gray-500">
                    No companies found.
                  </td>
                </tr>
              ) : (
                rows.map((row) => (
                  <tr key={row.id} className="text-sm">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-200 to-indigo-300 text-xs font-bold text-white">
                          {row.name.slice(0, 1).toUpperCase()}
                        </div>
                        <span className="font-semibold text-gray-800">{row.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-4 font-medium text-gray-700">{row.industry ?? "Design"}</td>
                    <td className="px-4 py-4 font-semibold text-[#2F7D67]">{row.location ?? "Bangladesh"}</td>
                    <td className="px-4 py-4 text-gray-500">{row.size ?? "11-50 Employees"}</td>
                    <td className="px-4 py-4 text-gray-500">{row.type ?? "Public Company"}</td>
                    <td className="px-4 py-4 text-right">
                      <button
                        type="button"
                        onClick={() => openEdit(row)}
                        className="rounded-lg border border-[#7C5CFC] px-4 py-1.5 text-sm font-semibold text-[#7C5CFC] transition hover:bg-violet-50"
                      >
                        Edit
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>Result per page</span>
            <select
              className="rounded-md border border-gray-200 bg-white px-2 py-1 text-sm text-gray-700"
              value={pageSize}
              onChange={(e) => {
                const next = Number(e.target.value);
                setPage(1);
                void refresh({ nextPage: 1, nextPageSize: next });
              }}
            >
              <option value={6}>6</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="flex items-center gap-1 text-sm">
            <button
              type="button"
              onClick={() => void refresh({ nextPage: Math.max(1, page - 1) })}
              disabled={page <= 1 || loading}
              className="rounded-md border border-gray-200 px-2 py-1 text-gray-500 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {Array.from({ length: Math.min(5, totalPages) }).map((_, idx) => {
              const p = idx + Math.max(1, Math.min(page - 2, totalPages - 4));
              if (p > totalPages) return null;
              return (
                <button
                  key={p}
                  type="button"
                  onClick={() => void refresh({ nextPage: p })}
                  className={`h-8 min-w-8 rounded-md px-2 ${
                    p === page ? "bg-violet-50 font-semibold text-[#7C5CFC]" : "text-gray-500"
                  }`}
                >
                  {p}
                </button>
              );
            })}
            <button
              type="button"
              onClick={() => void refresh({ nextPage: Math.min(totalPages, page + 1) })}
              disabled={page >= totalPages || loading}
              className="rounded-md border border-gray-200 px-2 py-1 text-gray-500 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="ml-2 text-xs text-gray-400">Total: {total}</span>
          </div>
        </div>
      </div>

      {showModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4">
          <div className="w-full max-w-lg rounded-2xl border border-gray-100 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-[20px] font-bold text-gray-900">{editing ? "Edit Company" : "Add a New Company"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="h-5 w-5" /></button>
            </div>
            <form className="space-y-4" onSubmit={(e) => void saveCompany(e)}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-semibold text-gray-900">Name*</label><input className="soha-input mt-1.5" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} placeholder="Us Dollar" /></div>
                <div><label className="text-sm font-semibold text-gray-900">Industry*</label><select className="soha-select mt-1.5" value={form.industry} onChange={(e) => setForm((p) => ({ ...p, industry: e.target.value }))}><option value="">Select</option><option>1.000</option><option>Design</option><option>Technology</option><option>Finance</option></select></div>
              </div>
              <div><label className="text-sm font-semibold text-gray-900">Company Size*</label><select className="soha-select mt-1.5" value={form.size} onChange={(e) => setForm((p) => ({ ...p, size: e.target.value }))}><option value="">Select</option><option>Product Designer</option><option>1-10</option><option>11-50</option><option>51-200</option><option>201-500</option></select></div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><label className="text-sm font-semibold text-gray-900">Company Type*</label><select className="soha-select mt-1.5" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}><option>Public company</option><option>Private company</option><option>Startup</option><option>Agency</option></select></div>
                <div><label className="text-sm font-semibold text-gray-900">Linkdin*</label><div className="mt-1.5 flex"><span className="flex items-center rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 px-3 text-sm text-gray-500">HTTPS://</span><input className="soha-input rounded-l-none" value={form.website} onChange={(e) => setForm((p) => ({ ...p, website: e.target.value }))} placeholder="www.linkdin.com" /></div></div>
                <div><label className="text-sm font-semibold text-gray-900">Location</label><input className="soha-input mt-1.5" value={form.location} onChange={(e) => setForm((p) => ({ ...p, location: e.target.value }))} placeholder="Bangladesh" /></div>
                <div><label className="text-sm font-semibold text-gray-900">Phone Number</label><input className="soha-input mt-1.5" value={form.foundedYear} onChange={(e) => setForm((p) => ({ ...p, foundedYear: e.target.value }))} placeholder="+8801988784435" /></div>
              </div>
              <div><label className="text-sm font-semibold text-gray-900">Twitter</label><input className="soha-input mt-1.5" placeholder="https://twitter.com//naimur" /></div>
              <label className="inline-flex items-center gap-2 text-sm text-gray-600"><input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-blue-500" />I currently work here</label>
              {err ? <p className="text-sm text-red-600">{err}</p> : null}
              <div className="flex gap-3">
                <button type="submit" disabled={saving} className="rounded-full bg-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#6B4CE0] disabled:opacity-70">{saving ? <Loader2 className="mr-1 inline h-4 w-4 animate-spin" /> : null}Save</button>
                <button type="button" onClick={() => setShowModal(false)} className="rounded-full border border-[#7C5CFC] px-6 py-2.5 text-sm font-semibold text-[#7C5CFC] transition hover:bg-violet-50">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      ) : null}
    </div>
  );
}
