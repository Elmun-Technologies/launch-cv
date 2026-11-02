import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { PageCopyEditor } from "@/components/admin/page-copy-editor";
import { CmsPageHeader } from "@/components/admin/cms-ui";
import { PageCopySectionNav } from "@/components/admin/page-copy-sections";
import { PAGE_COPY, cleanPageCopy, isPageCopyKey } from "@/lib/cms/page-copy";


export default async function EditPageCopy({ params }: { params: Promise<{ key: string }> }) {
  const admin = await requireAdmin("content");
  if (!admin) redirect("/admin-panel/access-denied");

  const { key } = await params;
  const decodedKey = decodeURIComponent(key);
  if (!isPageCopyKey(decodedKey)) notFound();
  const config = PAGE_COPY[decodedKey];

  const [row, allRows] = await Promise.all([
    prisma.pageCopy.findUnique({ where: { key: decodedKey } }),
    prisma.pageCopy.findMany({ select: { key: true, updatedAt: true } }),
  ]);
  // Show every field: saved values over the current defaults (unknown saved fields are dropped).
  const dataToEdit = { ...config.defaults, ...cleanPageCopy(decodedKey, row?.data) };
  const initialJson = JSON.stringify(dataToEdit, null, 2);
  const updated = new Map(allRows.map((r) => [r.key, r.updatedAt]));

  return (
    <AdminShell email={admin.email} pageTitle="Edit page copy">
      {/* Desktop: master list + editor side by side. Phones: the editor alone, with a back link. */}
      <CmsPageHeader
        title="Page copy"
        description="Edit marketing-page text without touching code. Each key maps to a section on the public site."
      />
      <div className="mt-[18px] grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="hidden lg:block">
          <PageCopySectionNav activeKey={decodedKey} updated={updated} />
        </div>
        <PageCopyEditor
          pageKey={decodedKey}
          label={config.label}
          description={config.description}
          initialJson={initialJson}
        />
      </div>
    </AdminShell>
  );
}
