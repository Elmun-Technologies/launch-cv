import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { FaqEditor, type FaqEditorData } from "@/components/admin/faq-editor";

export default async function EditFaqPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const { id } = await params;
  const row = await prisma.faq.findUnique({ where: { id } });
  if (!row) notFound();

  const initial: FaqEditorData = {
    id: row.id,
    question: row.question,
    answer: row.answer,
    placement: row.placement,
    order: row.order,
    published: row.published,
  };

  return (
    <AdminShell email={admin.email} pageTitle="Edit FAQ">
      <FaqEditor initial={initial} />
    </AdminShell>
  );
}
