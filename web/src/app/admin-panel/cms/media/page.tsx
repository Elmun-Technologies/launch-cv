import { redirect } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { CmsEmpty, CmsPageHeader, CmsSearch, cmsDateFmt } from "@/components/admin/cms-ui";
import { MediaUploadButton } from "@/components/admin/media-upload-button";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function fileName(url: string) {
  return url.split("?")[0].split("/").pop() || url;
}

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const admin = await requireAdmin("content");
  if (!admin) redirect("/admin-panel/access-denied");

  const q = (await searchParams).q?.trim() ?? "";
  const where = q
    ? {
        OR: [
          { alt: { contains: q, mode: "insensitive" as const } },
          { url: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const [assets, total] = await Promise.all([
    prisma.mediaAsset.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 60,
      omit: { data: true },
      include: { uploadedBy: { select: { email: true } } },
    }),
    prisma.mediaAsset.count({ where }),
  ]);

  return (
    <AdminShell email={admin.email} pageTitle="Media library">
      <CmsPageHeader
        title="Media library"
        description="Images for blog posts and pages. Stored in the database and served from /media/."
        actions={<MediaUploadButton />}
      />

      <div className="mt-[18px] flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CmsSearch value={q} label="Search media" placeholder="Search by alt text or file name" />
        <p className="text-[13px] text-[#66647c]">
          {total > assets.length
            ? `Showing the ${assets.length} newest of ${total.toLocaleString()} assets`
            : `${total.toLocaleString()} asset${total === 1 ? "" : "s"}`}
        </p>
      </div>

      {assets.length === 0 ? (
        <section className="lc-card mt-4 rounded-[24px]">
          <CmsEmpty
            title={q ? "No media matches this search" : "No media uploaded yet"}
            description={
              q
                ? "Try a broader query or clear the search."
                : "Use Upload, or add images from the blog editor — they will appear here."
            }
          />
        </section>
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((a) => {
            const name = a.alt?.trim() || fileName(a.url);
            return (
              <li key={a.id} className="lc-card min-w-0 rounded-[20px] p-2">
                <div className="relative flex h-[150px] items-center justify-center overflow-hidden rounded-[14px] bg-[#eeecf4] text-[#66647c] sm:h-[130px]">
                  <ImageIcon className="absolute h-6 w-6" aria-hidden="true" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.url} alt={a.alt ?? ""} className="relative h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="px-1.5 pb-1 pt-2.5">
                  <p className="truncate text-[13px] font-bold text-[#121226]" title={name}>
                    {name}
                  </p>
                  <p className="lc-mono mt-0.5 truncate text-[11px] text-[#66647c]" title={a.url}>
                    {a.url}
                  </p>
                  <p className="mt-1 flex items-center justify-between gap-2 text-[12px] text-[#66647c]">
                    <span>{a.mimeType.split("/")[1]?.toUpperCase() ?? a.mimeType}</span>
                    <span>{formatBytes(a.sizeBytes)}</span>
                  </p>
                  <p className="mt-0.5 truncate text-[12px] text-[#66647c]">
                    {a.uploadedBy?.email ?? "—"} · {cmsDateFmt.format(a.createdAt)}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </AdminShell>
  );
}
