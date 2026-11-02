"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { useAdminFetch } from "@/components/admin/reauth";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import {
  AdminPageHeader,
  ChipButton,
  ChipGroup,
  LoadingCard,
  Pager,
  SearchField,
  cellMain,
  cellMuted,
  cellText,
  rowDanger,
} from "@/components/admin/v5/ui";
import { VERTICAL_GROUPS, regionLabel, verticalLabel } from "@/lib/admin-labels";
import { fmtAgo, fmtDateTime } from "@/lib/admin-dates";

interface ResumeRow {
  id: string;
  title: string;
  vertical: string;
  regionMode: string;
  updatedAt: string;
  ats: number | null;
  user: { id: string; name: string | null; email: string };
}

const PER_PAGE = 20;
const GROUPS = [{ id: "all", label: "All" }, ...VERTICAL_GROUPS.map((g) => ({ id: g.id, label: g.label }))];

export function AdminResumesPage({ email }: { email: string }) {
  const adminFetch = useAdminFetch();
  const [resumes, setResumes] = useState<ResumeRow[]>([]);
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [group, setGroup] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setQuery(search.trim()), 250);
    return () => clearTimeout(t);
  }, [search]);

  const fetchResumes = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PER_PAGE), group });
      if (query) params.set("q", query);
      const res = await fetch(`/api/admin-panel/resumes?${params}`);
      const data = await res.json();
      setResumes(data.rows ?? []);
      setTotal(data.total ?? 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, query, group]);

  useEffect(() => {
    fetchResumes();
  }, [fetchResumes]);

  async function handleDelete(id: string) {
    if (!confirm("Delete this resume?")) return;
    const r = await adminFetch(`/api/admin-panel/resumes/${id}`, { method: "DELETE" }).catch(() => null);
    if (!r?.ok) {
      const j = r ? await r.json().catch(() => ({})) : {};
      alert((j as { error?: string }).error ?? "Couldn't delete this resume.");
      return;
    }
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
      truncate: "max-w-[240px]",
      render: (r) => (
        <Link href={`/admin-panel/users/${r.user.id}`} className={`${cellText} hover:text-[#5440e8]`}>
          {r.user.email}
        </Link>
      ),
    },
    { key: "vertical", header: "Vertical", render: (r) => <span className={`whitespace-nowrap ${cellText}`}>{verticalLabel(r.vertical)}</span> },
    { key: "region", header: "Region", render: (r) => <span className={cellText}>{regionLabel(r.regionMode)}</span> },
    {
      key: "ats",
      header: "ATS",
      align: "right",
      render: (r) => (r.ats === null ? <span className={cellMuted}>—</span> : <span className={`${cellText} tabular-nums`}>{r.ats}</span>),
    },
    {
      key: "updated",
      header: "Updated",
      render: (r) => (
        <time dateTime={r.updatedAt} title={`${fmtDateTime(r.updatedAt)} UTC`} className={`whitespace-nowrap ${cellMuted}`}>
          {fmtAgo(r.updatedAt)}
        </time>
      ),
    },
    {
      key: "actions",
      header: "Actions",
      align: "right",
      render: (r) => (
        <button type="button" onClick={() => handleDelete(r.id)} className={rowDanger} aria-label={`Delete resume ${r.title}`}>
          Delete
        </button>
      ),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  return (
    <AdminShell email={email} pageTitle="Resumes">
      <div className="space-y-5">
        <AdminPageHeader
          title="Resumes"
          description={`${total.toLocaleString("en-US")} resume${total === 1 ? "" : "s"}${group === "all" ? " across all users" : ""}. ATS is the score of each resume's latest job match.`}
        />

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <SearchField
            id="admin-resumes-search"
            label="Search resumes by title or owner"
            placeholder="Search resumes…"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <ChipGroup label="Filter by vertical">
            {GROUPS.map((g) => (
              <ChipButton
                key={g.id}
                active={group === g.id}
                onClick={() => {
                  setGroup(g.id);
                  setPage(1);
                }}
              >
                {g.label}
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
              rows={resumes}
              rowKey={(r) => r.id}
              emptyTitle={query ? "No resumes match this search" : "No resumes here yet"}
              emptyDescription={query ? "Try a broader query or clear the search." : "Resumes in this vertical show up as users create them."}
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
