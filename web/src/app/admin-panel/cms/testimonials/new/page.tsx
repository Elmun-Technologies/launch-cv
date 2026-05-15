import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { TestimonialEditor, type TestimonialEditorData } from "@/components/admin/testimonial-editor";

const blank: TestimonialEditorData = {
  id: null,
  authorName: "",
  authorRole: "",
  authorAvatarUrl: "",
  quote: "",
  rating: 5,
  placement: ["home"],
  order: 0,
  published: true,
};

export default async function NewTestimonialPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  return (
    <AdminShell email={admin.email} pageTitle="New testimonial">
      <TestimonialEditor initial={blank} />
    </AdminShell>
  );
}
