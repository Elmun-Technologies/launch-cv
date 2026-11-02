import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { CmsBadge, CmsEmpty, CmsPageHeader, VisibilityBadge, cmsBtnPrimary, cmsTextLinkCls } from "@/components/admin/cms-ui";
import { testimonialPublishProblems } from "@/lib/cms/testimonials";
import { TESTIMONIAL_PLACEMENTS, placementLabel } from "@/components/admin/cms-placements";

const ROW_GRID = "md:grid md:grid-cols-[minmax(0,2.6fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,0.7fr)_auto] md:items-center md:gap-3.5";

export default async function AdminTestimonialsPage() {
  const admin = await requireAdmin("content");
  if (!admin) redirect("/admin-panel/access-denied");

  const rows = await prisma.testimonial.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "desc" }],
  });

  return (
    <AdminShell email={admin.email} pageTitle="Testimonials">
      <CmsPageHeader
        title="Testimonials"
        description={`${rows.length.toLocaleString()} testimonial${rows.length === 1 ? "" : "s"}. Only real quotes with written permission. Hidden until approved.`}
        action={{ href: "/admin-panel/cms/testimonials/new", label: "New testimonial" }}
      />

      <section aria-label="Testimonials" className="lc-card mt-4 rounded-[24px] px-4 pb-2 pt-1 sm:px-6">
        {rows.length === 0 ? (
          <CmsEmpty
            title="No testimonials yet"
            description="Click New testimonial to add the first one."
            action={
              <Link href="/admin-panel/cms/testimonials/new" className={cmsBtnPrimary}>
                New testimonial
              </Link>
            }
          />
        ) : (
          <>
            <div
              aria-hidden="true"
              className={`hidden py-3.5 text-[12px] font-bold tracking-[0.06em] text-[#66647c] ${ROW_GRID}`}
            >
              <span>QUOTE</span>
              <span>AUTHOR</span>
              <span>PLACEMENT</span>
              <span>STATUS</span>
              <span className="w-10" />
            </div>
            <ul>
              {rows.map((r) => (
                <li key={r.id} className={`flex flex-col gap-2 border-t border-[#e2e0ea] py-3.5 text-[14px] first:border-t-0 md:first:border-t ${ROW_GRID}`}>
                  <p className="min-w-0 leading-[21px] text-[#24223a] [overflow-wrap:anywhere]">
                    <span className="line-clamp-3">&ldquo;{r.quote}&rdquo;</span>
                  </p>
                  <div className="min-w-0">
                    <p className="truncate font-bold text-[#121226]">
                      <span className="sr-only">Author: </span>
                      {r.authorName}
                    </p>
                    <p className="truncate text-[12px] text-[#66647c]">{r.authorRole || "No role"}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:contents">
                    <span className="min-w-0 text-[#4a4862]">
                      <span className="sr-only">Placement: </span>
                      {r.placement.length === 0 ? "None" : r.placement.map((p) => placementLabel(TESTIMONIAL_PLACEMENTS, p)).join(", ")}
                      <span className="block text-[12px] text-[#66647c]">Order {r.order}</span>
                    </span>
                    <span>
                      {r.published && testimonialPublishProblems(r).length ? (
                        <CmsBadge tone="amber">Needs permission</CmsBadge>
                      ) : (
                        <VisibilityBadge published={r.published} />
                      )}
                    </span>
                    <Link
                      href={`/admin-panel/cms/testimonials/${r.id}`}
                      className={`${cmsTextLinkCls} ml-auto md:ml-0`}
                      aria-label={`Edit testimonial from ${r.authorName}`}
                    >
                      Edit
                    </Link>
                  </div>
                </li>
              ))}
            </ul>
          </>
        )}
      </section>

      <div className="mt-3.5 rounded-[18px] bg-[#fdf0d5] px-5 py-4 text-[14px] leading-[21px] text-[#7a4600]">
        <b>Rule:</b>{" "}
        a testimonial can be published only with the author&apos;s name, permission date and source attached. Publish only
        real quotes. Pages hide the section when none are published.
      </div>
    </AdminShell>
  );
}
