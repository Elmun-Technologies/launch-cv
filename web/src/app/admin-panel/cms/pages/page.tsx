import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { CmsPageHeader } from "@/components/admin/cms-ui";
import { PageCopySectionNav } from "@/components/admin/page-copy-sections";

export default async function AdminPagesIndex() {
  const admin = await requireAdmin("content");
  if (!admin) redirect("/admin-panel/access-denied");

  const rows = await prisma.pageCopy.findMany({
    select: { key: true, updatedAt: true },
  });
  const updated = new Map(rows.map((r) => [r.key, r.updatedAt]));

  return (
    <AdminShell email={admin.email} pageTitle="Page copy">
      <CmsPageHeader
        title="Page copy"
        description="Edit marketing-page text without touching code. Each key maps to a section on the public site."
      />

      <div className="mt-[18px] grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <PageCopySectionNav updated={updated} />
        <section className="lc-card hidden rounded-[24px] p-6 lg:block">
          <h2 className="text-[18px] font-extrabold text-[#121226]">Pick a section to edit</h2>
          <p className="mt-2 max-w-[520px] text-[14px] leading-[21px] text-[#4a4862]">
            Choose a section on the left to edit its copy. Sections marked “Using code defaults” have never been saved, so
            the editor starts from the text that ships with the site.
          </p>
        </section>
      </div>
    </AdminShell>
  );
}
