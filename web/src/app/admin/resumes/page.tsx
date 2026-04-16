"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, ChevronLeft, ChevronRight, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";

interface ResumeRow {
  id: string;
  title: string;
  vertical: string;
  regionMode: string;
  updatedAt: string;
  user: { name: string | null; email: string };
}

export default function AdminResumesPage() {
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const perPage = 20;

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/resumes?${params}`);
      const data = await res.json();
      setResumes(data.resumes ?? []);
      setTotal(data.total ?? 0);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  async function handleDelete(id: string) {
    if (!confirm("Delete this resume?")) return;
    await fetch(`/api/admin/resumes/${id}`, { method: "DELETE" });
    fetchResumes();
  }

  return (
    <AdminShell pageTitle="Resumes">
      <div className="space-y-6">
        <h2 className="text-[28px] font-bold text-gray-900">Resumes</h2>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search resumes…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full rounded-xl border border-gray-200 bg-white py-2 pl-9 pr-4 text-[13px] text-gray-900 outline-none focus:border-[#7C5CFC] focus:ring-2 focus:ring-[#7C5CFC]/20"
          />
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Title</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">User</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Vertical</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Region</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Updated</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[13px] text-gray-400">Loading…</td>
                </tr>
              ) : resumes.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[13px] text-gray-400">No resumes found</td>
                </tr>
              ) : (
                resumes.map((r) => (
                  <tr key={r.id} className="transition hover:bg-gray-50/60">
                    <td className="px-5 py-3 text-[13px] font-medium text-gray-900">{r.title}</td>
                    <td className="px-5 py-3">
                      <p className="text-[13px] text-gray-900">{r.user.name || "—"}</p>
                      <p className="text-[11px] text-gray-400">{r.user.email}</p>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">{r.vertical}</td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">{r.regionMode}</td>
                    <td className="px-5 py-3 text-[13px] text-gray-500">
                      {new Date(r.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => handleDelete(r.id)}
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[13px] text-gray-500">{total} resume{total !== 1 ? "s" : ""} total</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[13px] text-gray-600">Page {page} of {totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="rounded-lg border border-gray-200 p-1.5 text-gray-500 transition hover:bg-gray-50 disabled:opacity-40"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </AdminShell>
  );
}
