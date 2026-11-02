import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { CmsEmpty, CmsPageHeader, cmsBtnPrimary } from "@/components/admin/cms-ui";
import { FAQ_PLACEMENTS, placementLabel } from "@/components/admin/cms-placements";
import { FaqOrderList } from "@/components/admin/faq-order-list";
import { faqPlacements } from "@/lib/cms/faqs";

export default async function AdminFaqsPage() {
  const admin = await requireAdmin("content");
  if (!admin) redirect("/admin-panel/access-denied");

  const rows = await prisma.faq.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  });

  return (
    <AdminShell email={admin.email} pageTitle="FAQs">
      <CmsPageHeader
        title="FAQs"
        description={`${rows.length.toLocaleString()} question${rows.length === 1 ? "" : "s"} shown on public pages. Drag to reorder, or use the arrow buttons.`}
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
          <FaqOrderList
            initial={rows.map((r) => ({
              id: r.id,
              question: r.question,
              published: r.published,
              placementLabel: faqPlacements(r)
                .map((p) => placementLabel(FAQ_PLACEMENTS, p))
                .join(", "),
            }))}
          />
        )}
      </section>
    </AdminShell>
  );
}
