import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { PageCopyScreen } from "@/components/admin/page-copy-screen";
import { PAGE_COPY, type PageCopyKey } from "@/lib/cms/page-copy";

export default async function AdminPagesIndex() {
  const admin = await requireAdmin("content");
  if (!admin) redirect("/admin-panel/access-denied");

  // The first section opens by default (from lg up; phones see the list first).
  const firstKey = Object.keys(PAGE_COPY)[0] as PageCopyKey;

  return (
    <AdminShell email={admin.email} pageTitle="Page copy">
      <PageCopyScreen pageKey={firstKey} listFirst />
    </AdminShell>
  );
}
