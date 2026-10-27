"use client";

import { useState, useEffect, useCallback } from "react";
import { Briefcase } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { ResourceListPage } from "@/components/admin/resource-list-page";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge, statusToTone } from "@/components/admin/status-badge";

interface AppRow {
  id: string;
  title: string | null;
  company: string | null;
  status: string;
  createdAt: string;
  user: { name: string | null; email: string };
}

// Values the job tracker actually stores.
const STATUS_OPTIONS = ["all", "bookmarked", "applying", "interviewing", "negotiating", "accepted", "rejected"];
const PER_PAGE = 20;

export default function AdminApplicationsPage() {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PER_PAGE) });
      if (statusFilter !== "all") params.set("status", statusFilter);
      const res = await fetch(`/api/admin-panel/applications?${params}`);
      const data = await res.json();
      setApps(data.rows ?? []);
      setTotal(data.total ?? 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const columns: DataTableColumn<AppRow>[] = [
    {
      key: "title",
      header: "Role",
      truncate: "max-w-[240px]",
      render: (a) => <span className="font-medium text-[#111111]">{a.title || "Untitled"}</span>,
    },
    {
      key: "company",
      header: "Company",
      render: (a) => <span className="text-[12px] text-[#3F3F3F]">{a.company || "—"}</span>,
    },
    {
      key: "user",
      header: "User",
      render: (a) => (
        <div className="min-w-0">
          <p className="truncate text-[12px] text-[#111111]">{a.user.name || "—"}</p>
          <p className="truncate text-[11px] text-[#8A8A86]">{a.user.email}</p>
        </div>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (a) => <StatusBadge tone={statusToTone(a.status)}>{a.status}</StatusBadge>,
    },
    {
      key: "created",
      header: "Created",
      render: (a) => (
        <span className="text-[12px] text-[#6B6B6B]">{new Date(a.createdAt).toLocaleDateString()}</span>
      ),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <AdminShell pageTitle="Applications">
      <ResourceListPage
        title="Applications"
        description={`${total.toLocaleString()} application${total === 1 ? "" : "s"} tracked across all users.`}
        filters={
          <div className="flex flex-wrap gap-1">
            {STATUS_OPTIONS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => {
                  setStatusFilter(s);
                  setPage(1);
                }}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold capitalize transition ${
                  statusFilter === s
                    ? "bg-[#111111] text-white"
                    : "bg-[#F5F5F3] text-[#3F3F3F] hover:bg-[#E5E5E2]"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        }
      >
        {loading ? (
          <div className="rounded-xl border border-[#E5E5E2] bg-white px-5 py-12 text-center text-[13px] text-[#8A8A86]">
            Loading…
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={apps}
              rowKey={(a) => a.id}
              emptyTitle="No applications for this filter"
              emptyDescription="Switch to a different status filter or All."
            />
            <div className="mt-4 flex items-center justify-between text-[12px] text-[#6B6B6B]">
              <p>
                <Briefcase className="mr-1 inline h-3 w-3 align-text-bottom" />
                {total.toLocaleString()} total
              </p>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="rounded-md border border-[#E5E5E2] bg-white px-3 py-1 font-semibold text-[#111111] transition hover:bg-[#FAFAF9] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Previous
                </button>
                <span className="px-2">Page {page} of {totalPages}</span>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= totalPages}
                  className="rounded-md border border-[#E5E5E2] bg-white px-3 py-1 font-semibold text-[#111111] transition hover:bg-[#FAFAF9] disabled:cursor-not-allowed disabled:opacity-40"
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
