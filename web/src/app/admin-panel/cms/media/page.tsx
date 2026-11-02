import { redirect } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { CmsBadge, CmsEmpty, CmsFilterChips, CmsPageHeader, CmsSearch, cmsDateFmt } from "@/components/admin/cms-ui";
import { MediaUploadButton } from "@/components/admin/media-upload-button";
import { MEDIA_FILTERS, isMediaFilter, mediaIdsFor, type MediaFilter } from "@/lib/cms/media-usage";

const PAGE_SIZE = 60;

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

function fileName(url: string) {
  return url.split("?")[0].split("/").pop() || url;
}

const EMPTY_FILTER: Record<Exclude<MediaFilter, "all">, { title: string; description: string }> = {
  blog: { title: "No images used in blog posts", description: "Images in a post's body, cover or social image show up here." },
  pages: { title: "No images used on pages", description: "Images in page copy or testimonial avatars show up here." },
  unused: { title: "No unused images", description: "Every image is used in a blog post, page copy or a testimonial." },
};

export default async function AdminMediaPage({ searchParams }: { searchParams: Promise<{ q?: string; filter?: string }> }) {
  const admin = await requireAdmin("content");
  if (!admin) redirect("/admin-panel/access-denied");

  const sp = await searchParams;
  const q = sp.q?.trim() ?? "";
  const filter: MediaFilter = isMediaFilter(sp.filter) ? sp.filter : "all";
  const where = q
    ? {
        OR: [
          { alt: { contains: q, mode: "insensitive" as const } },
          { url: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  // Usage (blog / pages / unused) is computed on the server from the content itself.
  const { ids, usage } = await mediaIdsFor(filter, where);
  const total = ids.length;
  const pageIds = ids.slice(0, PAGE_SIZE);
  const assets = (
    await prisma.mediaAsset.findMany({
      where: { id: { in: pageIds } },
      omit: { data: true },
      include: { uploadedBy: { select: { email: true } } },
    })
  ).sort((a, b) => pageIds.indexOf(a.id) - pageIds.indexOf(b.id));

  const href = (f: MediaFilter) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (f !== "all") params.set("filter", f);
    const s = params.toString();
    return `/admin-panel/cms/media${s ? `?${s}` : ""}`;
  };

  return (
    <AdminShell email={admin.email} pageTitle="Media library">
      <CmsPageHeader
        title="Media library"
        description="Images for blog posts and pages. Stored in the database and served from /media/."
        actions={<MediaUploadButton />}
      />

      <div className="mt-[18px] flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <CmsSearch
          value={q}
          label="Search media"
          placeholder="Search by alt text or file name"
          hidden={filter !== "all" ? { filter } : undefined}
        />
        <CmsFilterChips
          label="Filter by where it's used"
          items={MEDIA_FILTERS.map((f) => ({ href: href(f.value), label: f.label, active: f.value === filter }))}
        />
      </div>
      <p className="mt-2 text-[13px] text-[#66647c]" aria-live="polite">
        {total > assets.length
          ? `Showing the ${assets.length} newest of ${total.toLocaleString()} assets`
          : `${total.toLocaleString()} asset${total === 1 ? "" : "s"}`}
      </p>

      {assets.length === 0 ? (
        <section className="lc-card mt-3 rounded-[24px]">
          <CmsEmpty
            title={q ? "No media matches this search" : filter !== "all" ? EMPTY_FILTER[filter].title : "No media uploaded yet"}
            description={
              q
                ? "Try a broader query or clear the search."
                : filter !== "all"
                  ? EMPTY_FILTER[filter].description
                  : "Use Upload, or add images from the blog editor — they will appear here."
            }
          />
        </section>
      ) : (
        <ul className="mt-3 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {assets.map((a) => {
            const name = a.alt?.trim() || fileName(a.url);
            const u = usage.get(a.id);
            const used = [u?.blog ? "Blog" : null, u?.pages ? "Pages" : null].filter(Boolean).join(" · ");
            return (
              <li key={a.id} className="lc-card min-w-0 rounded-[20px] p-2">
                <div className="relative flex h-[150px] items-center justify-center overflow-hidden rounded-[14px] bg-[#eeecf4] text-[#66647c] sm:h-[130px]">
                  <ImageIcon className="absolute h-6 w-6" aria-hidden="true" />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={a.url} alt={a.alt ?? ""} className="relative h-full w-full object-cover" loading="lazy" />
                </div>
                <div className="px-1.5 pb-1 pt-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <p className="min-w-0 truncate text-[13px] font-bold text-[#121226]" title={name}>
                      {name}
                    </p>
                    {used ? <CmsBadge tone="lilac">{used}</CmsBadge> : <CmsBadge tone="soft">Unused</CmsBadge>}
                  </div>
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
