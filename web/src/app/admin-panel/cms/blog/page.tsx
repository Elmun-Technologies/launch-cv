import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import {
  CmsBadge,
  CmsEmpty,
  CmsFilterChips,
  CmsPageHeader,
  CmsSearch,
  blogStatusBadge,
  cmsBtnPrimary,
  cmsDateFmt,
  cmsTextLinkCls,
} from "@/components/admin/cms-ui";

const STATUS_OPTIONS = ["all", "draft", "scheduled", "published", "archived"] as const;
type StatusFilter = (typeof STATUS_OPTIONS)[number];

const STATUS_LABEL: Record<StatusFilter, string> = {
  all: "All",
  draft: "Drafts",
  scheduled: "Scheduled",
  published: "Published",
  archived: "Archived",
};

const ROW_GRID = "md:grid md:grid-cols-[minmax(0,2.4fr)_minmax(0,0.8fr)_minmax(0,0.9fr)_minmax(0,0.5fr)_auto] md:items-center md:gap-3.5";

export default async function AdminBlogListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: StatusFilter }>;
}) {
  const admin = await requireAdmin("content");
  if (!admin) redirect("/admin-panel/access-denied");

  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const statusFilter = (sp.status ?? "all") as StatusFilter;

  const searchWhere: Record<string, unknown> = {};
  if (q) {
    searchWhere.OR = [
      { title: { contains: q, mode: "insensitive" } },
      { slug: { contains: q, mode: "insensitive" } },
      { category: { contains: q, mode: "insensitive" } },
    ];
  }
  const where: Record<string, unknown> = { ...searchWhere };
  if (statusFilter !== "all") where.status = statusFilter;

  const [posts, total, byStatus] = await Promise.all([
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
        readingTime: true,
        publishedAt: true,
        scheduledFor: true,
        updatedAt: true,
      },
    }),
    prisma.blogPost.count({ where }),
    // Per-status counts for the filter chips (same search, any status).
    prisma.blogPost.groupBy({ by: ["status"], where: searchWhere, _count: { _all: true } }),
  ]);

  const counts = new Map<string, number>(byStatus.map((g) => [g.status, g._count._all]));
  const allCount = byStatus.reduce((sum, g) => sum + g._count._all, 0);

  const chips = STATUS_OPTIONS.map((s) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (s !== "all") params.set("status", s);
    const n = s === "all" ? allCount : (counts.get(s) ?? 0);
    return {
      href: `/admin-panel/cms/blog${params.size ? `?${params.toString()}` : ""}`,
      label: `${STATUS_LABEL[s]} · ${n.toLocaleString()}`,
      active: statusFilter === s,
    };
  });

  return (
    <AdminShell email={admin.email} pageTitle="Blog">
      <CmsPageHeader title="Blog posts" action={{ href: "/admin-panel/cms/blog/new", label: "New post" }} />

      <div className="mt-[18px] flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <CmsFilterChips label="Filter by status" items={chips} />
        <CmsSearch
          value={q}
          label="Search posts"
          placeholder="Search by title, slug, or category…"
          hidden={statusFilter !== "all" ? { status: statusFilter } : undefined}
        />
      </div>

      <section aria-label="Posts" className="lc-card mt-4 rounded-[24px] px-4 pb-2 pt-1 sm:px-6">
        {posts.length === 0 ? (
          <CmsEmpty
            title={q ? "No posts match this search" : statusFilter !== "all" ? `No ${STATUS_LABEL[statusFilter].toLowerCase()} posts` : "No blog posts yet"}
            description={
              q
                ? "Try a broader query, change the status filter, or clear the search."
                : statusFilter !== "all"
                  ? "Pick another status filter to see the rest of your posts."
                  : "Click New post to start your first article."
            }
            action={
              !q && statusFilter === "all" ? (
                <Link href="/admin-panel/cms/blog/new" className={cmsBtnPrimary}>
                  New post
                </Link>
              ) : undefined
            }
          />
        ) : (
          <ul>
            {posts.map((p, i) => {
              const badge = blogStatusBadge(p.status);
              return (
                <li
                  key={p.id}
                  className={`flex flex-col gap-2 py-4 text-[14px] ${ROW_GRID} ${i > 0 ? "border-t border-[#e2e0ea]" : ""}`}
                >
                  <div className="min-w-0">
                    <p className="text-[15px] font-bold leading-[21px] text-[#121226] [overflow-wrap:anywhere]">{p.title}</p>
                    <p className="mt-0.5 truncate text-[12px] text-[#66647c]">
                      <span className="lc-mono">/{p.slug}</span> · {p.category}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:contents">
                    <div className="md:justify-self-start">
                      <CmsBadge tone={badge.tone}>{badge.label}</CmsBadge>
                    </div>
                    <div className="text-[#66647c]">
                      {p.status === "scheduled" && p.scheduledFor ? (
                        <span>
                          <span className="sr-only">Scheduled for </span>
                          {cmsDateFmt.format(p.scheduledFor)}
                        </span>
                      ) : p.publishedAt ? (
                        <span>
                          <span className="sr-only">Published </span>
                          {cmsDateFmt.format(p.publishedAt)}
                        </span>
                      ) : (
                        <span>Not published</span>
                      )}
                      <span className="block text-[12px]">Updated {cmsDateFmt.format(p.updatedAt)}</span>
                    </div>
                    <span className="text-[#66647c]">
                      {p.readingTime} min<span className="sr-only"> read</span>
                    </span>
                    <Link
                      href={`/admin-panel/cms/blog/${p.id}`}
                      className={`${cmsTextLinkCls} ml-auto md:ml-0 md:justify-self-end`}
                      aria-label={`Edit “${p.title}”`}
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {total > posts.length ? (
        <p className="mt-3 text-[13px] text-[#66647c]">
          Showing the {posts.length} most recently updated of {total.toLocaleString()} posts. Search or filter to find older ones.
        </p>
      ) : null}
    </AdminShell>
  );
}
