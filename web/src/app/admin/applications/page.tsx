"use client";

import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";

interface AppRow {
  id: string;
  title: string | null;
  company: string | null;
  status: string;
  createdAt: string;
  user: { name: string | null; email: string };
}

const STATUS_OPTIONS = ["all", "draft", "applied", "interview", "offer", "rejected"];

const statusColors: Record<string, string> = {
  draft: "bg-gray-100 text-gray-600",
  applied: "bg-blue-100 text-blue-700",
  interview: "bg-amber-100 text-amber-700",
  offer: "bg-emerald-100 text-emerald-700",
  rejected: "bg-red-100 text-red-700",
};

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const perPage = 20;

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), perPage: String(perPage) });
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin/applications?${params}`);
      const data = await res.json();
      setApps(data.applications ?? []);
      setTotal(data.total ?? 0);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const totalPages = Math.max(1, Math.ceil(total / perPage));

  return (
    <AdminShell pageTitle="Applications">
      <div className="space-y-6">
        <h2 className="text-[28px] font-bold text-gray-900">Applications</h2>

        {/* Filter */}
        <div className="flex items-center gap-3">
          <span className="text-[13px] font-medium text-gray-500">Status:</span>
          <div className="flex gap-1">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`rounded-full px-3 py-1 text-[12px] font-medium capitalize transition ${
                  statusFilter === s
                    ? "bg-[#7C5CFC] text-white"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Title</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Company</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">User</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Status</th>
                <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-gray-500">Created</th>
                <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-gray-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[13px] text-gray-400">Loading…</td>
                </tr>
              ) : apps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[13px] text-gray-400">No applications found</td>
                </tr>
              ) : (
                apps.map((a) => (
                  <tr key={a.id} className="transition hover:bg-gray-50/60">
                    <td className="px-5 py-3 text-[13px] font-medium text-gray-900">{a.title || "Untitled"}</td>
                    <td className="px-5 py-3 text-[13px] text-gray-600">{a.company || "—"}</td>
                    <td className="px-5 py-3">
                      <p className="text-[13px] text-gray-900">{a.user.name || "—"}</p>
                      <p className="text-[11px] text-gray-400">{a.user.email}</p>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${statusColors[a.status] ?? "bg-gray-100 text-gray-600"}`}>
                        {a.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-[13px] text-gray-500">
                      {new Date(a.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <a
                        href={`/admin/users/${a.user ? "" : ""}`}
                        className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-[#7C5CFC]"
                      >
                        <Eye className="h-4 w-4" />
                      </a>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-[13px] text-gray-500">{total} application{total !== 1 ? "s" : ""} total</p>
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
