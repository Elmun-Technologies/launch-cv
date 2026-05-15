import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { TestimonialEditor, type TestimonialEditorData } from "@/components/admin/testimonial-editor";

export default async function EditTestimonialPage({ params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const { id } = await params;
  const row = await prisma.testimonial.findUnique({ where: { id } });
  if (!row) notFound();

  const initial: TestimonialEditorData = {
    id: row.id,
    authorName: row.authorName,
    authorRole: row.authorRole ?? "",
    authorAvatarUrl: row.authorAvatarUrl ?? "",
    quote: row.quote,
    rating: row.rating ?? 5,
    placement: row.placement,
    order: row.order,
    published: row.published,
  };

  return (
    <AdminShell email={admin.email} pageTitle="Edit testimonial">
      <TestimonialEditor initial={initial} />
    </AdminShell>
  );
}
