import { redirect } from "next/navigation";
import { Image as ImageIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { ResourceListPage } from "@/components/admin/resource-list-page";
import { EmptyState } from "@/components/admin/empty-state";

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
}

export default async function AdminMediaPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const assets = await prisma.mediaAsset.findMany({
    orderBy: { createdAt: "desc" },
    take: 60,
    include: { uploadedBy: { select: { email: true } } },
  });

  return (
    <AdminShell email={admin.email} pageTitle="Media library">
      <ResourceListPage
        title="Media library"
        description={`${assets.length.toLocaleString()} asset${assets.length === 1 ? "" : "s"}. Uploaded via the blog editor or admin tools.`}
      >
        {assets.length === 0 ? (
          <EmptyState
            icon={ImageIcon}
            title="No media uploaded yet"
            description="Images uploaded through the blog editor will appear here."
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {assets.map((a) => (
              <div key={a.id} className="overflow-hidden rounded-xl border border-[#E2E8F0] bg-white">
                <div className="relative aspect-[4/3] bg-[#F1F5F9]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={a.url}
                    alt={a.alt ?? ""}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
                <div className="px-4 py-3">
                  <p className="truncate font-mono text-[11px] text-[#0F172A]">{a.url}</p>
                  <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#94A3B8]">
                    <span>{a.mimeType.split("/")[1]?.toUpperCase() ?? a.mimeType}</span>
                    <span>{formatBytes(a.sizeBytes)}</span>
                  </div>
                  <p className="mt-1 truncate text-[11px] text-[#64748B]">
                    {a.uploadedBy?.email ?? "—"} · {a.createdAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </ResourceListPage>
    </AdminShell>
  );
}
