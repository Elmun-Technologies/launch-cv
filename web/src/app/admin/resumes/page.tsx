"use client";

import { useState, useEffect, useCallback } from "react";
import { Trash2, FileText } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { ResourceListPage } from "@/components/admin/resource-list-page";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";

interface ResumeRow {
  id: string;
  title: string;
  vertical: string;
  regionMode: string;
  updatedAt: string;
  user: { name: string | null; email: string };
}

const PER_PAGE = 20;

export default function AdminResumesPage() {
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), perPage: String(PER_PAGE) });
      if (search) params.set("search", search);
      const res = await fetch(`/api/admin/resumes?${params}`);
      const data = await res.json();
      setResumes(data.resumes ?? []);
      setTotal(data.total ?? 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this resume?")) return;
    await fetch(`/api/admin/resumes/${id}`, { method: "DELETE" });
    fetchResumes();
  }

  const columns: DataTableColumn<ResumeRow>[] = [
    {
      key: "title",
      header: "Title",
      truncate: "max-w-[280px]",
      render: (r) => <span className="font-medium text-[#0F172A]">{r.title}</span>,
    },
    {
      key: "user",
      header: "User",
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate text-[12px] text-[#0F172A]">{r.user.name || "—"}</p>
          <p className="truncate text-[11px] text-[#94A3B8]">{r.user.email}</p>
        </div>
      ),
    },
    { key: "vertical", header: "Vertical", render: (r) => <span className="text-[12px] text-[#475569]">{r.vertical}</span> },
    { key: "region", header: "Region", render: (r) => <span className="text-[12px] text-[#475569]">{r.regionMode}</span> },
    {
      key: "updated",
      header: "Updated",
      render: (r) => <span className="text-[12px] text-[#64748B]">{new Date(r.updatedAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <button
          type="button"
          onClick={() => handleDelete(r.id)}
          className="rounded-md p-1.5 text-[#94A3B8] transition hover:bg-red-50 hover:text-red-600"
          aria-label="Delete resume"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      ),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <AdminShell pageTitle="Resumes">
      <ResourceListPage
        title="Resumes"
        description={`${total.toLocaleString()} resume${total === 1 ? "" : "s"} across all users.`}
      >
        <div className="relative max-w-[360px]">
          <input
            type="search"
            placeholder="Search resumes…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="block w-full rounded-lg border border-[#E2E8F0] bg-white px-3 py-2 text-[13px] text-[#0F172A] outline-none transition placeholder:text-[#94A3B8] hover:border-[#CBD5E1] focus:border-[#1A56DB] focus:ring-2 focus:ring-[#1A56DB]/15"
          />
        </div>

        {loading ? (
          <div className="rounded-xl border border-[#E2E8F0] bg-white px-5 py-12 text-center text-[13px] text-[#94A3B8]">
            Loading…
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={resumes}
              rowKey={(r) => r.id}
              emptyTitle="No resumes match this search"
              emptyDescription="Try a broader query or clear the search."
            />
            <div className="mt-4 flex items-center justify-between text-[12px] text-[#64748B]">
              <p>
                <FileText className="mr-1 inline h-3 w-3 align-text-bottom" />
                {total.toLocaleString()} total
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-[#E2E8F0] bg-white px-3 py-1 font-semibold text-[#0F172A] transition hover:bg-[#FAFBFC] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-2">Page {page} of {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="rounded-md border border-[#E2E8F0] bg-white px-3 py-1 font-semibold text-[#0F172A] transition hover:bg-[#FAFBFC] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </ResourceListPage>
    </AdminShell>
  );
}
