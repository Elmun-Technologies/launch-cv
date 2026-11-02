import { redirect, notFound } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { PageCopyScreen } from "@/components/admin/page-copy-screen";
import { isPageCopyKey } from "@/lib/cms/page-copy";

export default async function EditPageCopy({ params }: { params: Promise<{ key: string }> }) {
  const admin = await requireAdmin("content");
  if (!admin) redirect("/admin-panel/access-denied");

  const { key } = await params;
  const decodedKey = decodeURIComponent(key);
  if (!isPageCopyKey(decodedKey)) notFound();

  return (
    <AdminShell email={admin.email} pageTitle="Edit page copy">
      {/* Desktop: master list + editor side by side. Phones: the editor alone, with a back link. */}
      <PageCopyScreen pageKey={decodedKey} />
    </AdminShell>
  );
}
