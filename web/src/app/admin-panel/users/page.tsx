"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Pencil, Trash2, Users as UsersIcon } from "lucide-react";
import { AdminShell } from "@/components/admin-shell";
import { ResourceListPage } from "@/components/admin/resource-list-page";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge, statusToTone } from "@/components/admin/status-badge";

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

export default function AdminUsersPage() {
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
    await fetch(`/api/admin-panel/users/${id}`, { method: "DELETE" });
    fetchUsers();
  }

  const columns: DataTableColumn<UserRow>[] = [
    {
      key: "user",
      header: "User",
      render: (u) => (
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#111111] text-[11px] font-semibold text-white">
            {(u.name || u.email)[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-medium text-[#111111]">{u.name || "—"}</p>
            <p className="truncate text-[12px] text-[#6B6B6B]">{u.email}</p>
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
      render: (u) => <span className="font-mono text-[12px] text-[#3F3F3F]">{u.resumeCount}</span>,
    },
    {
      key: "apps",
      header: "Apps",
      align: "right",
      render: (u) => (
        <span className="font-mono text-[12px] text-[#3F3F3F]">{u.appCount}</span>
      ),
    },
    {
      key: "created",
      header: "Created",
      render: (u) => (
        <span className="text-[12px] text-[#6B6B6B]">
          {new Date(u.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (u) => (
        <div className="flex items-center justify-end gap-1">
          <Link
            href={`/admin-panel/users/${u.id}`}
            className="rounded-md p-1.5 text-[#6E6E6A] transition hover:bg-[#F5F5F3] hover:text-[#2563EB]"
            aria-label="Edit user"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(u.id)}
            className="rounded-md p-1.5 text-[#6E6E6A] transition hover:bg-red-50 hover:text-red-600"
            aria-label="Delete user"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ),
    },
  ];

  // Client-side search input — re-bound to setSearch + reset to page 1
  return (
    <AdminShell pageTitle="Users">
      <ResourceListPage
        title="Users"
        description={`${total.toLocaleString()} account${total === 1 ? "" : "s"} total. Click a row to view details.`}
      >
        <div className="relative max-w-[360px]">
          <input
            type="search"
            placeholder="Search by name or email…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="block w-full rounded-lg border border-[#E5E5E2] bg-white px-3 py-2 text-[13px] text-[#111111] outline-none transition placeholder:text-[#8A8A86] hover:border-[#D9D9D5] focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/15"
          />
        </div>

        {loading ? (
          <div className="rounded-xl border border-[#E5E5E2] bg-white px-5 py-12 text-center text-[13px] text-[#6E6E6A]">
            Loading…
          </div>
        ) : (
          <>
            <DataTable
              columns={columns}
              rows={users}
              rowKey={(u) => u.id}
              emptyTitle="No users match this search"
              emptyDescription="Try a broader query or clear the search to see everyone."
              emptyAction={
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="inline-flex items-center gap-1 rounded-lg border border-[#E5E5E2] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#111111] transition hover:bg-[#FAFAF9]"
                >
                  Clear search
                </button>
              }
            />
            <div className="mt-4 flex items-center justify-between text-[12px] text-[#6B6B6B]">
              <p>
                <UsersIcon className="mr-1 inline h-3 w-3 align-text-bottom" />
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
                <span className="px-2">
                  Page {page} of {Math.max(1, Math.ceil(total / PER_PAGE))}
                </span>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(total / PER_PAGE)}
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
