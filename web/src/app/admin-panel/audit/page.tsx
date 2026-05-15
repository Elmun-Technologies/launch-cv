import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { ResourceListPage } from "@/components/admin/resource-list-page";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";

type Row = {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  createdAt: Date;
  actor: { email: string } | null;
  ip: string | null;
};

function actionTone(action: string) {
  if (action.endsWith(".delete")) return "red" as const;
  if (action.endsWith(".publish") || action.endsWith(".create")) return "green" as const;
  if (action.endsWith(".update") || action.endsWith(".schedule")) return "blue" as const;
  if (action.endsWith(".archive") || action.endsWith(".unpublish")) return "amber" as const;
  return "default" as const;
}

export default async function AdminAuditPage({
  searchParams,
}: {
  searchParams: Promise<{ entity?: string; action?: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const sp = await searchParams;
  const where: Record<string, unknown> = {};
  if (sp.entity) where.entity = sp.entity;
  if (sp.action) where.action = sp.action;

  const [rows, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { actor: { select: { email: true } } },
    }),
    prisma.auditLog.count({ where }),
  ]);

  const entityCounts = await prisma.auditLog.groupBy({
    by: ["entity"],
    _count: { entity: true },
    orderBy: { _count: { entity: "desc" } },
    take: 10,
  });

  const dateFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const columns: DataTableColumn<Row>[] = [
    {
      key: "when",
      header: "When",
      render: (r) => <span className="text-[12px] text-[#64748B]">{dateFmt.format(r.createdAt)}</span>,
    },
    {
      key: "actor",
      header: "Actor",
      render: (r) => (
        <span className="text-[12px] text-[#0F172A]">{r.actor?.email ?? "—"}</span>
      ),
    },
    {
      key: "action",
      header: "Action",
      render: (r) => <StatusBadge tone={actionTone(r.action)}>{r.action}</StatusBadge>,
    },
    {
      key: "entity",
      header: "Entity",
      render: (r) => <span className="font-mono text-[11px] text-[#475569]">{r.entity}</span>,
    },
    {
      key: "entityId",
      header: "Target",
      truncate: "max-w-[160px]",
      render: (r) => (
        <span className="font-mono text-[11px] text-[#94A3B8]">{r.entityId ?? "—"}</span>
      ),
    },
    {
      key: "ip",
      header: "IP",
      render: (r) => <span className="font-mono text-[11px] text-[#94A3B8]">{r.ip ?? "—"}</span>,
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="Audit log">
      <ResourceListPage
        title="Audit log"
        description={`${total.toLocaleString()} action${total === 1 ? "" : "s"} recorded. Newest 100 shown. Every admin mutation (publish, delete, role change, …) is logged automatically.`}
        intro={
          entityCounts.length > 0 ? (
            <div className="flex flex-wrap items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-[#1A56DB]" />
              <span className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">By entity</span>
              {entityCounts.map((e) => (
                <span key={e.entity} className="rounded-full bg-[#F1F5F9] px-2.5 py-0.5 text-[12px] font-medium text-[#475569]">
                  {e.entity} · {e._count.entity}
                </span>
              ))}
            </div>
          ) : null
        }
      >
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          emptyTitle="No audit events yet"
          emptyDescription="Mutations to CMS content, users, and subscriptions will appear here as they happen."
        />
      </ResourceListPage>
    </AdminShell>
  );
}
