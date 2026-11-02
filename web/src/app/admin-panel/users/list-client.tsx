"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { useAdminFetch } from "@/components/admin/reauth";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge, statusToTone } from "@/components/admin/status-badge";
import {
  AdminPageHeader,
  Avatar,
  LoadingCard,
  Pager,
  SearchField,
  cellMain,
  cellMuted,
  cellSub,
  cellText,
  pillBtn,
  rowDanger,
  rowLink,
} from "@/components/admin/v5/ui";

interface UserRow {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  resumeCount: number;
  appCount: number;
}

const PER_PAGE = 20;

export function AdminUsersPage() {
  const adminFetch = useAdminFetch();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PER_PAGE) });
      if (search.trim()) params.set("q", search.trim());
      const res = await fetch(`/api/admin-panel/users?${params}`);
      const data = await res.json();
      setUsers(data.rows ?? []);
      setTotal(data.total ?? 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this user permanently?")) return;
    const r = await adminFetch(`/api/admin-panel/users/${id}`, { method: "DELETE" }).catch(() => null);
    if (!r?.ok) {
      const j = r ? await r.json().catch(() => ({})) : {};
      alert((j as { error?: string }).error ?? "Couldn't delete this user.");
      return;
    }
    fetchUsers();
  }

  const columns: DataTableColumn<UserRow>[] = [
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-2.5">
          <Avatar name={u.name} email={u.email} />
          <div className="min-w-0">
            <p className={`truncate ${cellMain}`}>{u.name || "—"}</p>
            <p className={`truncate ${cellSub}`}>{u.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: "role",
      header: "Role",
      render: (u) => <StatusBadge tone={statusToTone(u.role)}>{u.role}</StatusBadge>,
    },
    {
      key: "resumes",
      header: "Resumes",
      align: "right",
      render: (u) => <span className={`${cellText} tabular-nums`}>{u.resumeCount}</span>,
    },
    {
      key: "apps",
      header: "Apps",
      align: "right",
      render: (u) => <span className={`${cellText} tabular-nums`}>{u.appCount}</span>,
    },
    {
      key: "created",
      header: "Joined",
      render: (u) => <span className={`whitespace-nowrap ${cellMuted}`}>{new Date(u.createdAt).toLocaleDateString()}</span>,
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <Link href={`/admin-panel/users/${u.id}`} className={rowLink} aria-label={`View ${u.name || u.email}`}>
            View
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(u.id)}
            className={rowDanger}
            aria-label={`Delete ${u.name || u.email}`}
          >
            Delete
          </button>
        </div>
      ),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  // Client-side search input — re-bound to setSearch + reset to page 1
  return (
    <AdminShell pageTitle="Users">
      <div className="space-y-5">
        <AdminPageHeader
          title="Users"
          description={`${total.toLocaleString()} account${total === 1 ? "" : "s"} total. Open a user to see details.`}
        />

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

        {loading ? (
          <LoadingCard />
        ) : (
          <div>
            <DataTable
              columns={columns}
              rows={users}
              rowKey={(u) => u.id}
              emptyTitle="No users match this search"
              emptyDescription="Try a broader query or clear the search to see everyone."
              emptyAction={
                <button type="button" onClick={() => setSearch("")} className={pillBtn}>
                  Clear search
                </button>
              }
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
