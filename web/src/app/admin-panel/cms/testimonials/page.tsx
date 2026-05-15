import { redirect } from "next/navigation";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { ResourceListPage } from "@/components/admin/resource-list-page";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";

type Row = {
  id: string;
  authorName: string;
  authorRole: string | null;
  quote: string;
  placement: string[];
  order: number;
  published: boolean;
};

export default async function AdminTestimonialsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const rows = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  const columns: DataTableColumn<Row>[] = [
    {
      key: "author",
      header: "Author",
      truncate: "max-w-[200px]",
      render: (r) => (
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-[#0F172A]">{r.authorName}</p>
          <p className="truncate text-[12px] text-[#64748B]">{r.authorRole || "—"}</p>
        </div>
      ),
    },
    {
      key: "quote",
      header: "Quote",
      truncate: "max-w-[360px]",
      render: (r) => <span className="text-[13px] text-[#475569]">&ldquo;{r.quote}&rdquo;</span>,
    },
    {
      key: "placement",
      header: "Placement",
      render: (r) => (
        <div className="flex flex-wrap gap-1">
          {r.placement.length === 0 ? (
            <span className="text-[12px] text-[#94A3B8]">None</span>
          ) : (
            r.placement.map((p) => (
              <span key={p} className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[11px] text-[#475569]">
                {p}
              </span>
            ))
          )}
        </div>
      ),
    },
    {
      key: "order",
      header: "Order",
      align: "right",
      render: (r) => <span className="font-mono text-[12px] text-[#475569]">{r.order}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (r) =>
        r.published ? (
          <StatusBadge tone="green" dot>Published</StatusBadge>
        ) : (
          <StatusBadge tone="default">Hidden</StatusBadge>
        ),
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <Link
          href={`/admin-panel/cms/testimonials/${r.id}`}
          className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#0F172A] transition hover:bg-[#FAFBFC]"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </Link>
      ),
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="Testimonials">
      <ResourceListPage
        title="Testimonials"
        description={`${rows.length.toLocaleString()} testimonial${rows.length === 1 ? "" : "s"}. Used on home and feature pages.`}
        primaryAction={{ href: "/admin-panel/cms/testimonials/new", label: "New testimonial" }}
      >
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          emptyTitle="No testimonials yet"
          emptyDescription="Click New testimonial to add the first one."
        />
      </ResourceListPage>
    </AdminShell>
  );
}
