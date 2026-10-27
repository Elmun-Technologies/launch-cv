import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { ResourceListPage } from "@/components/admin/resource-list-page";
import { DataTable, type DataTableColumn } from "@/components/admin/data-table";
import { StatusBadge } from "@/components/admin/status-badge";
import { Pencil } from "lucide-react";

type BlogRow = {
  id: string;
  slug: string;
  title: string;
  category: string;
  status: string;
  publishedAt: Date | null;
  scheduledFor: Date | null;
  updatedAt: Date;
  authorName: string;
};

const STATUS_OPTIONS = ["all", "draft", "scheduled", "published", "archived"] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

function statusTone(s: string) {
  if (s === "published") return "green" as const;
  if (s === "scheduled") return "blue" as const;
  if (s === "draft") return "amber" as const;
  if (s === "archived") return "default" as const;
  return "default" as const;
}

export default async function AdminBlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: StatusFilter }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const statusFilter = (sp.status ?? "all") as StatusFilter;

  const where: Record<string, unknown> = {};
  if (statusFilter !== "all") where.status = statusFilter;
  if (q) {
    where.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
    ];
  }

  const [posts, total] = await Promise.all([
    prisma.blogPost.findMany({
      where,
      orderBy: { updatedAt: "desc" },
      take: 50,
      select: {
        id: true,
        slug: true,
        title: true,
        category: true,
        status: true,
        publishedAt: true,
        scheduledFor: true,
        updatedAt: true,
        authorName: true,
      },
    }),
    prisma.blogPost.count({ where }),
  ]);

  const dateFmt = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" });

  const columns: DataTableColumn<BlogRow>[] = [
    {
      key: "title",
      header: "Title",
      truncate: "max-w-[320px]",
      render: (p) => (
        <div className="min-w-0">
          <p className="truncate font-medium text-[#111111]">{p.title}</p>
          <p className="truncate font-mono text-[11px] text-[#6E6E6A]">/{p.slug}</p>
        </div>
      ),
    },
    {
      key: "category",
      header: "Category",
      render: (p) => <span className="text-[12px] text-[#3F3F3F]">{p.category}</span>,
    },
    {
      key: "status",
      header: "Status",
      render: (p) => (
        <div className="flex flex-col gap-1">
          <StatusBadge tone={statusTone(p.status)} dot>
            {p.status}
          </StatusBadge>
          {p.status === "scheduled" && p.scheduledFor ? (
            <span className="text-[10px] text-[#6E6E6A]">{dateFmt.format(p.scheduledFor)}</span>
          ) : null}
        </div>
      ),
    },
    {
      key: "published",
      header: "Published",
      render: (p) => (
        <span className="text-[12px] text-[#6B6B6B]">
          {p.publishedAt ? dateFmt.format(p.publishedAt) : "—"}
        </span>
      ),
    },
    {
      key: "updated",
      header: "Updated",
      render: (p) => <span className="text-[12px] text-[#6B6B6B]">{dateFmt.format(p.updatedAt)}</span>,
    },
    {
      key: "actions",
      header: "",
      align: "right",
      render: (p) => (
        <Link
          href={`/admin-panel/cms/blog/${p.id}`}
          className="inline-flex items-center gap-1 rounded-md border border-[#E5E5E2] bg-white px-2.5 py-1 text-[12px] font-semibold text-[#111111] transition hover:bg-[#FAFAF9]"
        >
          <Pencil className="h-3 w-3" />
          Edit
        </Link>
      ),
    },
  ];

  return (
    <AdminShell email={admin.email} pageTitle="Blog">
      <ResourceListPage
        title="Blog posts"
        description={`${total.toLocaleString()} post${total === 1 ? "" : "s"}. Click Edit on a row to manage status, copy, and SEO.`}
        searchValue={q}
        searchPlaceholder="Search by title, slug, or category…"
        primaryAction={{ href: "/admin-panel/cms/blog/new", label: "New post" }}
        filters={
          <div className="flex flex-wrap gap-1">
            {STATUS_OPTIONS.map((s) => {
              const params = new URLSearchParams();
              if (q) params.set("q", q);
              if (s !== "all") params.set("status", s);
              const href = `/admin-panel/cms/blog${params.size ? `?${params.toString()}` : ""}`;
              const isActive = statusFilter === s;
              return (
                <Link
                  key={s}
                  href={href}
                  className={`rounded-full px-3 py-1 text-[12px] font-semibold capitalize transition ${
                    isActive ? "bg-[#111111] text-white" : "bg-[#F5F5F3] text-[#3F3F3F] hover:bg-[#E5E5E2]"
                  }`}
                >
                  {s}
                </Link>
              );
            })}
          </div>
        }
      >
        <DataTable
          columns={columns}
          rows={posts}
          rowKey={(p) => p.id}
          emptyTitle={q ? "No posts match this search" : "No blog posts yet"}
          emptyDescription={
            q
              ? "Try a broader query, change the status filter, or clear the search."
              : "Click New post to start your first article."
          }
        />
      </ResourceListPage>
    </AdminShell>
  );
}
