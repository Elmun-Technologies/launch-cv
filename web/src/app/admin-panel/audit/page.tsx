import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { DataTable, Pagination, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { AdminPageHeader, SearchField, cellMuted, chipCls } from "@/components/admin/v5/ui";
import { AUDIT_GROUPS, auditWhere, describeDiff, resolveTargets, targetLabel, type AuditGroup } from "@/lib/admin-audit";
import { fmtDateTime } from "@/lib/admin-dates";
import { maskIp } from "@/lib/admin-labels";
import { ExportAuditButton } from "./export-button";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 50;

type Row = {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  createdAt: Date;
  actor: { email: string } | null;
  ip: string | null;
  diff: unknown;
};

function actionTone(action: string) {
  if (action.endsWith(".delete") || action.endsWith(".failed") || action === "user.suspend") return "red" as const;
  if (action.endsWith(".publish") || action.endsWith(".create") || action.endsWith(".enable")) return "green" as const;
  if (action.endsWith(".update") || action.endsWith(".schedule") || action.endsWith(".grant")) return "blue" as const;
  if (action.endsWith(".archive") || action.endsWith(".unpublish") || action.endsWith(".export") || action.endsWith(".reset")) return "amber" as const;
  return "default" as const;
}

function requestNow() {
  return Date.now();
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string; action?: string; q?: string; group?: string; page?: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const sp = await searchParams;
  const q = (sp.q ?? "").trim().slice(0, 200);
  const entity = sp.entity?.slice(0, 64) || undefined;
  const action = sp.action?.slice(0, 64) || undefined;
  const group: AuditGroup = AUDIT_GROUPS.find((g) => g.id === sp.group)?.id ?? "all";
  const page = Math.max(1, Math.min(10_000, Number.parseInt(sp.page ?? "1", 10) || 1));
  const now = requestNow();

  const where = await auditWhere({ q, entity, group, action });
  const [rows, total, entityCounts] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
      include: { actor: { select: { email: true } } },
    }),
    prisma.auditLog.count({ where }),
    prisma.auditLog.groupBy({
      by: ["entity"],
      _count: { entity: true },
      orderBy: { _count: { entity: "desc" } },
      take: 10,
    }),
  ]);
  const targets = await resolveTargets(rows);

  const query = (over: Record<string, string | undefined>) => {
    const p = new URLSearchParams();
    const merged = { q: q || undefined, entity, action, group: group === "all" ? undefined : group, ...over };
    for (const [k, v] of Object.entries(merged)) if (v) p.set(k, v);
    const s = p.toString();
    return `/admin-panel/audit${s ? `?${s}` : ""}`;
  };
  const exportQuery = new URLSearchParams(
    Object.entries({ q: q || undefined, entity, action, group: group === "all" ? undefined : group }).filter((e): e is [string, string] => !!e[1]),
  ).toString();

  const columns: DataTableColumn<Row>[] = [
    {
      key: "when",
      header: "When (UTC)",
      render: (r) => (
        <time dateTime={r.createdAt.toISOString()} className={`whitespace-nowrap ${cellMuted}`}>
          {fmtDateTime(r.createdAt, now)}
        </time>
      ),
    },
    {
      key: "actor",
      header: "Actor",
      truncate: "max-w-[220px]",
      render: (r) => <span className="text-[14px] font-semibold text-[#121226]">{r.actor?.email ?? "—"}</span>,
    },
    {
      key: "action",
      header: "Action",
      render: (r) => <StatusBadge tone={actionTone(r.action)}>{r.action}</StatusBadge>,
    },
    {
      key: "target",
      header: "Target",
      truncate: "max-w-[220px]",
      render: (r) =>
        r.entity === "User" && r.entityId && targets.has(`User:${r.entityId}`) ? (
          <Link href={`/admin-panel/users/${r.entityId}`} className="text-[13px] text-[#121226] hover:text-[#5440e8]">
            {targetLabel(targets, r)}
          </Link>
        ) : (
          <span className="text-[13px] text-[#121226]">{targetLabel(targets, r)}</span>
        ),
    },
    {
      key: "change",
      header: "Change",
      render: (r) => <span className="block max-w-[320px] break-words text-[13px] text-[#4a4862]">{describeDiff(r.action, r.diff)}</span>,
    },
    {
      key: "ip",
      header: "IP",
      render: (r) => <span className="lc-mono whitespace-nowrap text-[12px] text-[#66647c]">{maskIp(r.ip)}</span>,
    },
  ];

  const filtered = !!(q || entity || action || group !== "all");

  return (
    <AdminShell email={admin.email} pageTitle="Audit log">
      <div className="space-y-5">
        <AdminPageHeader
          title="Audit log"
          description={`Every admin action, newest first — ${total.toLocaleString("en-US")} ${filtered ? "matching" : "recorded"}. Entries can't be edited or deleted from the panel.`}
          actions={<ExportAuditButton query={exportQuery} />}
        />

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <form method="get" action="/admin-panel/audit" role="search" className="w-full lg:max-w-[380px]">
            {entity ? <input type="hidden" name="entity" value={entity} /> : null}
            {action ? <input type="hidden" name="action" value={action} /> : null}
            {group !== "all" ? <input type="hidden" name="group" value={group} /> : null}
            <SearchField id="audit-search" name="q" label="Search actor, action or target" placeholder="Search actor, action or target" defaultValue={q} />
          </form>
          <nav aria-label="Filter by kind of action" className="flex flex-wrap gap-1.5">
            {AUDIT_GROUPS.map((g) => (
              <Link key={g.id} href={query({ group: g.id === "all" ? undefined : g.id, page: undefined })} aria-current={group === g.id ? "page" : undefined} className={chipCls(group === g.id)}>
                {g.label}
              </Link>
            ))}
          </nav>
        </div>

        {entityCounts.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="flex items-center gap-1.5 text-[13px] font-bold text-[#4a4862]">
              <ShieldCheck className="h-4 w-4 text-[#5440e8]" aria-hidden="true" />
              By entity
            </span>
            <ul className="flex flex-wrap gap-1.5">
              {entity ? (
                <li>
                  <Link href={query({ entity: undefined })} className="inline-flex min-h-9 items-center rounded-full bg-white px-3 text-[12px] font-semibold text-[#5440e8] hover:bg-[#e4dfff]">
                    All entities
                  </Link>
                </li>
              ) : null}
              {entityCounts.map((e) => {
                const on = entity === e.entity;
                return (
                  <li key={e.entity}>
                    <Link
                      href={query({ entity: on ? undefined : e.entity })}
                      aria-current={on ? "page" : undefined}
                      className={`inline-flex min-h-9 items-center rounded-full px-3 text-[12px] font-semibold transition-colors ${
                        on ? "bg-[#111118] text-white" : "bg-white text-[#121226] hover:bg-[#e4dfff]"
                      }`}
                    >
                      {e.entity}
                      <span className={`ml-1.5 tabular-nums ${on ? "text-[#e4dfff]" : "text-[#66647c]"}`}>{e._count.entity}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ) : null}

        <div>
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(r) => r.id}
            emptyTitle={filtered ? "Nothing matches these filters" : "No audit events yet"}
            emptyDescription={
              filtered ? "Clear the search or pick another filter." : "Changes to content, users, settings and keys will appear here as they happen."
            }
          />
          {total > PAGE_SIZE ? <Pagination page={page} pageSize={PAGE_SIZE} total={total} baseQuery={query({})} /> : null}
        </div>
      </div>
    </AdminShell>
  );
}
