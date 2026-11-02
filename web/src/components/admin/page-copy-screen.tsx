import { prisma } from "@/lib/prisma";
import { PageCopyEditor } from "@/components/admin/page-copy-editor";
import { CmsPageHeader } from "@/components/admin/cms-ui";
import { PageCopySectionNav } from "@/components/admin/page-copy-sections";
import { PAGE_COPY, cleanPageCopy, type PageCopyKey } from "@/lib/cms/page-copy";
import { PAGE_COPY_HISTORY, listPageCopyVersions, pageCopyPreviewPath } from "@/lib/cms/page-copy-history";

/** First string in a saved copy object, trimmed to a short line (labels a version). */
function summarize(data: unknown): string {
  if (!data || typeof data !== "object" || Array.isArray(data)) return "";
  for (const v of Object.values(data as Record<string, unknown>)) {
    const s = typeof v === "string" ? v : Array.isArray(v) && typeof v[0] === "string" ? v[0] : "";
    if (s.trim()) return s.length > 90 ? `${s.slice(0, 89)}…` : s;
  }
  return "";
}

/**
 * Page copy screen: the section list and the editor for `pageKey`.
 * `listFirst` is the index route — on phones it shows only the list (the
 * editor is one tap away); from lg up both show, with the first section open.
 */
export async function PageCopyScreen({ pageKey, listFirst = false }: { pageKey: PageCopyKey; listFirst?: boolean }) {
  const config = PAGE_COPY[pageKey];
  const [row, allRows, versions] = await Promise.all([
    prisma.pageCopy.findUnique({ where: { key: pageKey } }),
    prisma.pageCopy.findMany({ select: { key: true, updatedAt: true } }),
    listPageCopyVersions(pageKey),
  ]);
  // Show every field: saved values over the current defaults (unknown saved fields are dropped).
  const dataToEdit = { ...config.defaults, ...cleanPageCopy(pageKey, row?.data) };
  const updated = new Map(allRows.map((r) => [r.key, r.updatedAt]));

  return (
    <>
      <CmsPageHeader
        title="Page copy"
        description="Edit marketing text without a deploy. Each section maps to a part of the public site."
      />
      <div className="mt-[18px] grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className={listFirst ? "" : "hidden lg:block"}>
          <PageCopySectionNav activeKey={pageKey} updated={updated} />
        </div>
        <div className={listFirst ? "hidden lg:block" : ""}>
          <PageCopyEditor
            key={pageKey}
            pageKey={pageKey}
            label={config.label}
            description={config.description}
            initialJson={JSON.stringify(dataToEdit, null, 2)}
            defaults={config.defaults as Record<string, unknown>}
            max={config.max as Record<string, number>}
            previewHref={pageCopyPreviewPath(pageKey)}
            versions={versions.map((v) => ({
              id: v.id,
              createdAt: v.createdAt.toISOString(),
              savedByEmail: v.savedByEmail,
              summary: summarize(v.data),
            }))}
            historyLimit={PAGE_COPY_HISTORY}
          />
        </div>
      </div>
    </>
  );
}
