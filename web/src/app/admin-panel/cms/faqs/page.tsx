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
  question: string;
  placement: string;
  order: number;
  published: boolean;
};

export default async function AdminFaqsPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const rows = await prisma.faq.findMany({
    orderBy: [{ placement: "asc" }, { order: "asc" }],
  });

  const columns: DataTableColumn<Row>[] = [
    {
      key: "question",
      header: "Question",
      truncate: "max-w-[420px]",
      render: (r) => <span className="font-medium text-[#0F172A]">{r.question}</span>,
    },
    {
      key: "placement",
      header: "Placement",
      render: (r) => <span className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[11px] text-[#475569]">{r.placement}</span>,
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
        r.published ? <StatusBadge tone="green" dot>Published</StatusBadge> : <StatusBadge tone="default">Hidden</StatusBadge>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (r) => (
        <Link
          href={`/admin-panel/cms/faqs/${r.id}`}
          className="inline-flex items-center gap-1 rounded-md border border-[#E2E8F0] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#0F172A] transition hover:bg-[#FAFBFC]"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </Link>
      ),
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="FAQs">
      <ResourceListPage
        title="FAQs"
        description={`${rows.length.toLocaleString()} FAQ${rows.length === 1 ? "" : "s"}. Grouped by placement (pricing, home, feature pages).`}
        primaryAction={{ href: "/admin-panel/cms/faqs/new", label: "New FAQ" }}
      >
        <DataTable
          columns={columns}
          rows={rows}
          rowKey={(r) => r.id}
          emptyTitle="No FAQs yet"
          emptyDescription="Click New FAQ to add the first question."
        />
      </ResourceListPage>
    </AdminShell>
  );
}
