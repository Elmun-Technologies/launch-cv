"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { AdminShell } from "@/components/admin-shell";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import {
  AdminPageHeader,
  ChipButton,
  ChipGroup,
  LoadingCard,
  Pager,
  StatTile,
  cellMain,
  cellMuted,
  cellText,
} from "@/components/admin/v5/ui";
import { APP_STAGES, appStatusBadge } from "@/lib/admin-labels";
import { fmtDate, fmtDateTime } from "@/lib/admin-dates";

interface AppRow {
  id: string;
  title: string | null;
  company: string | null;
  status: string;
  createdAt: string;
  user: { id: string; name: string | null; email: string };
}

const PER_PAGE = 20;
const CHIPS = [{ key: "all", label: "All" }, ...APP_STAGES.map((s) => ({ key: s.key as string, label: s.label })), { key: "draft", label: "Draft" }];

export function AdminApplicationsPage({ email }: { email: string }) {
  const [apps, setApps] = useState<AppRow[]>([]);
  const [stage, setStage] = useState("all");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [stageCounts, setStageCounts] = useState<Record<string, number> | null>(null);
  const [drafts, setDrafts] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchApps = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: String(PER_PAGE), stage });
      const res = await fetch(`/api/admin-panel/applications?${params}`);
      const data = await res.json();
      setApps(data.rows ?? []);
      setTotal(data.total ?? 0);
      setStageCounts(data.stageCounts ?? null);
      setDrafts(data.drafts ?? 0);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, [page, stage]);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const columns: DataTableColumn<AppRow>[] = [
    { key: "company", header: "Company", render: (a) => <span className={cellMain}>{a.company || "—"}</span> },
    { key: "title", header: "Role", truncate: "max-w-[240px]", render: (a) => <span className={cellText}>{a.title || "Untitled"}</span> },
    {
      key: "user",
      header: "User",
      truncate: "max-w-[240px]",
      render: (a) => (
        <Link href={`/admin-panel/users/${a.user.id}`} className={`${cellText} hover:text-[#5440e8]`}>
          {a.user.email}
        </Link>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (a) => {
        const b = appStatusBadge(a.status);
        return <StatusBadge tone={b.tone}>{b.label}</StatusBadge>;
      },
    },
    {
      key: "created",
      header: "Created",
      render: (a) => (
        <time dateTime={a.createdAt} title={`${fmtDateTime(a.createdAt)} UTC`} className={`whitespace-nowrap ${cellMuted}`}>
          {fmtDate(a.createdAt)}
        </time>
      ),
    },
  ];

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));
  const allCount = stageCounts ? Object.values(stageCounts).reduce((a, n) => a + n, 0) : null;

  return (
    <AdminShell email={email} pageTitle="Applications">
      <div className="space-y-5">
        <AdminPageHeader
          title="Applications"
          description={
            allCount === null
              ? "Jobs tracked across all users, in the same stages as the job tracker."
              : `${allCount.toLocaleString("en-US")} application${allCount === 1 ? "" : "s"} tracked across all users, in the same stages as the job tracker.`
          }
        />

        <ChipGroup label="Filter by stage">
          {CHIPS.map((c) => (
            <ChipButton
              key={c.key}
              active={stage === c.key}
              onClick={() => {
                setStage(c.key);
                setPage(1);
              }}
            >
              {c.label}
            </ChipButton>
          ))}
        </ChipGroup>

        {stageCounts ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {APP_STAGES.map((s) => (
              <StatTile
                key={s.key}
                compact
                label={s.label}
                value={stageCounts[s.key] ?? 0}
                hint={s.key === "bookmarked" && drafts > 0 ? `incl. ${drafts} draft${drafts === 1 ? "" : "s"}` : undefined}
              />
            ))}
          </div>
        ) : null}

        {loading ? (
          <LoadingCard />
        ) : (
          <div>
            <DataTable
              columns={columns}
              rows={apps}
              rowKey={(a) => a.id}
              emptyTitle="No applications in this stage"
              emptyDescription="Pick another stage or All."
            />
            <Pager
              page={page}
              totalPages={totalPages}
              onPrev={() => setPage((p) => Math.max(1, p - 1))}
              onNext={() => setPage((p) => p + 1)}
              summary={`${total.toLocaleString("en-US")} ${stage === "all" ? "total" : "in this stage"}`}
            />
          </div>
        )}
      </div>
    </AdminShell>
  );
}
