"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Download, Loader2 } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { useAdminFetch } from "@/components/admin/reauth";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  AdminPageHeader,
  Avatar,
  ChipButton,
  ChipGroup,
  LoadingCard,
  Pager,
  SearchField,
  cellMain,
  cellMuted,
  cellSub,
  cellText,
  pillBtn,
  rowLink,
} from "@/components/admin/v5/ui";
import { fmtDate, fmtDateTime } from "@/lib/admin-dates";
import { billingStatusDisplay, isStaffRole, planLabel, roleLabel } from "@/lib/admin-labels";
import { downloadResponse } from "@/lib/admin-csv";
import type { AdminUserRow } from "@/lib/admin-user-list";

const PER_PAGE = 20;

const FILTERS = [
  { id: "all", label: "All" },
  { id: "paying", label: "Paying" },
  { id: "free", label: "Free" },
  { id: "past_due", label: "Past due" },
] as const;
type Filter = (typeof FILTERS)[number]["id"];

export function AdminUsersPage({ email }: { email: string }) {
  const adminFetch = useAdminFetch();
  const [users, setUsers] = useState<AdminUserRow[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Wait for a pause in typing before searching.
  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PER_PAGE), filter });
      if (query) params.set("q", query);
      const res = await fetch(`/api/admin-panel/users?${params}`);
      const data = await res.json();
      setUsers(data.rows ?? []);
      setTotal(data.total ?? 0);
    } catch {
      setError("Couldn't load users. Refresh to try again.");
    } finally {
      setLoading(false);
    }
  }, [page, query, filter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function exportCsv() {
    setExporting(true);
    setError(null);
    const params = new URLSearchParams({ filter });
    if (query) params.set("q", query);
    const r = await adminFetch(`/api/admin-panel/users/export?${params}`).catch(() => null);
    if (r?.ok) await downloadResponse(r, "launchcv-users.csv");
    else setError((r && (await r.json().catch(() => ({}))).error) || "Couldn't export users.");
    setExporting(false);
  }

  const columns: DataTableColumn<AdminUserRow>[] = [
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={u.name} email={u.email} />
          <div className="min-w-0">
            <p className={`flex items-center gap-1.5 ${cellMain}`}>
              <span className="truncate">{u.name || u.email.split("@")[0]}</span>
              {isStaffRole(u.role) ? <StatusBadge tone="slate">{roleLabel(u.role)}</StatusBadge> : null}
              {u.suspended ? <StatusBadge tone="red">Suspended</StatusBadge> : null}
            </p>
            <p className={`truncate ${cellSub}`}>{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "plan",
      header: "Plan",
      render: (u) => <span className={cellText}>{planLabel(u.plan)}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (u) => {
        if (u.status === "none") return <span className={cellMuted}>—</span>;
        const s = billingStatusDisplay(u.status);
        return <StatusBadge tone={s.tone}>{s.label}</StatusBadge>;
      },
    },
    {
      key: "resumes",
      header: "Resumes",
      align: "right",
      render: (u) => <span className={`${cellText} tabular-nums`}>{u.resumeCount}</span>,
    },
    {
      key: "created",
      header: "Joined",
      render: (u) => (
        <time dateTime={u.createdAt} title={`${fmtDateTime(u.createdAt)} UTC`} className={`whitespace-nowrap ${cellMuted}`}>
          {fmtDate(u.createdAt)}
        </time>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (u) => (
        <Link href={`/admin-panel/users/${u.id}`} className={rowLink} aria-label={`View ${u.name || u.email}`}>
          View
        </Link>
      ),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const filterLabel = FILTERS.find((f) => f.id === filter)!.label.toLowerCase();

  return (
    <AdminShell email={email} pageTitle="Users">
      <div className="space-y-5">
        <AdminPageHeader
          title="Users"
          description={`${total.toLocaleString("en-US")} ${filter === "all" ? "" : `${filterLabel} `}account${total === 1 ? "" : "s"}. Open a user to see details.`}
          actions={
            <button type="button" onClick={exportCsv} disabled={exporting} className={pillBtn}>
              {exporting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : <Download className="h-4 w-4" aria-hidden="true" />}
              {exporting ? "Exporting…" : "Export CSV"}
            </button>
          }
        />

        {error ? (
          <p role="alert" className="rounded-2xl bg-[#fbe2e3] px-4 py-3 text-[14px] font-semibold text-[#a3222a]">
            {error}
          </p>
        ) : null}

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchField
            id="admin-users-search"
            label="Search users by name or email"
            placeholder="Search name or email"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <ChipGroup label="Filter users by billing">
            {FILTERS.map((f) => (
              <ChipButton
                key={f.id}
                active={filter === f.id}
                onClick={() => {
                  setFilter(f.id);
                  setPage(1);
                }}
              >
                {f.label}
              </ChipButton>
            ))}
          </ChipGroup>
        </div>

        {loading ? (
          <LoadingCard />
        ) : (
          <div>
            <DataTable
              columns={columns}
              rows={users}
              rowKey={(u) => u.id}
              emptyTitle={query ? "No users match this search" : `No ${filterLabel === "all" ? "" : `${filterLabel} `}users`}
              emptyDescription={query ? "Try a broader query or clear the search." : "Users show up here as they sign up and pay."}
              emptyAction={
                query || filter !== "all" ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSearch("");
                      setFilter("all");
                    }}
                    className={pillBtn}
                  >
                    Show everyone
                  </button>
                ) : undefined
              }
            />
            <Pager
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
              summary={`${total.toLocaleString("en-US")} total`}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
