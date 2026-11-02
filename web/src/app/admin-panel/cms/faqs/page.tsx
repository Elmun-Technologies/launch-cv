import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { CmsEmpty, CmsPageHeader, VisibilityBadge, cmsBtnPrimary, cmsTextLinkCls } from "@/components/admin/cms-ui";
import { FAQ_PLACEMENTS, placementLabel } from "@/components/admin/cms-placements";

const ROW_GRID = "md:grid md:grid-cols-[3rem_minmax(0,2.2fr)_minmax(0,1fr)_minmax(0,0.7fr)_auto] md:items-center md:gap-3.5";

export default async function AdminFaqsPage() {
  const admin = await requireAdmin("content");
  if (!admin) redirect("/admin-panel/access-denied");

  const rows = await prisma.faq.findMany({
    orderBy: [{ placement: "asc" }, { order: "asc" }],
  });

  return (
    <AdminShell email={admin.email} pageTitle="FAQs">
      <CmsPageHeader
        title="FAQs"
        description={`${rows.length.toLocaleString()} question${rows.length === 1 ? "" : "s"} shown on public pages, grouped by placement. Set the order number on each FAQ to change its position.`}
        action={{ href: "/admin-panel/cms/faqs/new", label: "New FAQ" }}
      />

      <section aria-label="FAQs" className="lc-card mt-4 rounded-[24px] px-4 pb-2 pt-1 sm:px-6">
        {rows.length === 0 ? (
          <CmsEmpty
            title="No FAQs yet"
            description="Click New FAQ to add the first question."
            action={
              <Link href="/admin-panel/cms/faqs/new" className={cmsBtnPrimary}>
                New FAQ
              </Link>
            }
          />
        ) : (
          <>
            <div
              aria-hidden="true"
              className={`hidden py-3.5 text-[12px] font-bold tracking-[0.06em] text-[#66647c] ${ROW_GRID}`}
            >
              <span>ORDER</span>
              <span>QUESTION</span>
              <span>PLACEMENT</span>
              <span>STATUS</span>
              <span className="w-10" />
            </div>
            <ul>
              {rows.map((r) => (
                <li key={r.id} className={`flex flex-col gap-2 border-t border-[#e2e0ea] py-3.5 text-[14px] first:border-t-0 md:first:border-t ${ROW_GRID}`}>
                  <span className="hidden font-semibold tabular-nums text-[#66647c] md:block">
                    <span className="sr-only">Order </span>
                    {r.order}
                  </span>
                  <p className="min-w-0 font-bold leading-[21px] text-[#121226] [overflow-wrap:anywhere]">{r.question}</p>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:contents">
                    <span className="text-[#4a4862]">
                      <span className="sr-only">Placement: </span>
                      {placementLabel(FAQ_PLACEMENTS, r.placement)}
                      <span className="text-[#66647c] md:hidden"> · Order {r.order}</span>
                    </span>
                    <span>
                      <VisibilityBadge published={r.published} />
                    </span>
                    <Link href={`/admin-panel/cms/faqs/${r.id}`} className={`${cmsTextLinkCls} ml-auto md:ml-0`} aria-label={`Edit FAQ: ${r.question}`}>
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>
    </AdminShell>
  );
}
