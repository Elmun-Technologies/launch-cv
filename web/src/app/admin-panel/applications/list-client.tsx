"use client";

import { useState, useEffect, useCallback } from "react";
import { AdminShell } from "@/components/admin-shell";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge, statusToTone } from "@/components/admin/status-badge";
import {
  AdminPageHeader,
  ChipButton,
  ChipGroup,
  LoadingCard,
  Pager,
  cellMain,
  cellMuted,
  cellSub,
  cellText,
} from "@/components/admin/v5/ui";

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

export function AdminApplicationsPage() {
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
      key: "company",
      header: "Company",
      render: (a) => <span className={cellMain}>{a.company || "—"}</span>,
    },
    {
      key: "title",
      header: "Role",
      truncate: "max-w-[240px]",
      render: (a) => <span className={cellText}>{a.title || "Untitled"}</span>,
    },
    {
      key: "user",
      header: "User",
      render: (a) => (
        <div className="min-w-0">
          <p className={`truncate ${cellText}`}>{a.user.name || "—"}</p>
          <p className={`truncate ${cellSub}`}>{a.user.email}</p>
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
      render: (a) => <span className={`whitespace-nowrap ${cellMuted}`}>{new Date(a.createdAt).toLocaleDateString()}</span>,
    },
  ];

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <AdminShell pageTitle="Applications">
      <div className="space-y-5">
        <AdminPageHeader
          title="Applications"
          description={`${total.toLocaleString()} application${total === 1 ? "" : "s"} tracked across all users.`}
        />

        <ChipGroup label="Filter by status">
          {STATUS_OPTIONS.map((s) => (
            <ChipButton
              key={s}
              active={statusFilter === s}
              onClick={() => {
                setStatusFilter(s);
                setPage(1);
              }}
            >
              <span className="capitalize">{s}</span>
            </ChipButton>
          ))}
        </ChipGroup>

        {loading ? (
          <LoadingCard />
        ) : (
          <div>
            <DataTable
              columns={columns}
              rows={apps}
              rowKey={(a) => a.id}
              emptyTitle="No applications for this filter"
              emptyDescription="Switch to a different status filter or All."
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
