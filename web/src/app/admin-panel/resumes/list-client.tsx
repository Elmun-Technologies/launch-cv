"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminShell } from "@/components/admin-shell";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import {
  AdminPageHeader,
  LoadingCard,
  Pager,
  SearchField,
  cellMain,
  cellMuted,
  cellSub,
  cellText,
  rowDanger,
} from "@/components/admin/v5/ui";

interface ResumeRow {
  id: string;
  title: string;
  vertical: string;
  regionMode: string;
  updatedAt: string;
  user: { name: string | null; email: string };
}

const PER_PAGE = 20;

export function AdminResumesPage() {
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PER_PAGE) });
      if (search.trim()) params.set("q", search.trim());
      const res = await fetch(`/api/admin-panel/resumes?${params}`);
      const data = await res.json();
      setResumes(data.rows ?? []);
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
    await fetch(`/api/admin-panel/resumes/${id}`, { method: "DELETE" });
    fetchResumes();
  }

  const columns: DataTableColumn<ResumeRow>[] = [
    {
      key: "title",
      header: "Title",
      truncate: "max-w-[280px]",
      render: (r) => <span className={cellMain}>{r.title}</span>,
    },
    {
      key: "user",
      header: "Owner",
      render: (r) => (
        <div className="min-w-0">
          <p className={`truncate ${cellText}`}>{r.user.name || "—"}</p>
          <p className={`truncate ${cellSub}`}>{r.user.email}</p>
        </div>
      ),
    },
    { key: "vertical", header: "Vertical", render: (r) => <span className={cellText}>{r.vertical}</span> },
    { key: "region", header: "Region", render: (r) => <span className={cellText}>{r.regionMode}</span> },
    {
      key: "updated",
      header: "Updated",
      render: (r) => <span className={`whitespace-nowrap ${cellMuted}`}>{new Date(r.updatedAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (r) => (
        <button
          type="button"
          onClick={() => handleDelete(r.id)}
          className={rowDanger}
          aria-label={`Delete resume ${r.title}`}
        >
          Delete
        </button>
      ),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <AdminShell pageTitle="Resumes">
      <div className="space-y-5">
        <AdminPageHeader
          title="Resumes"
          description={`${total.toLocaleString()} resume${total === 1 ? "" : "s"} across all users.`}
        />

        <SearchField
          id="admin-resumes-search"
          label="Search resumes"
          placeholder="Search resumes…"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        {loading ? (
          <LoadingCard />
        ) : (
          <div>
            <DataTable
              columns={columns}
              rows={resumes}
              rowKey={(r) => r.id}
              emptyTitle="No resumes match this search"
              emptyDescription="Try a broader query or clear the search."
            />
            <Pager
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
              summary={`${total.toLocaleString()} total`}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
