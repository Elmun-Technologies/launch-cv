import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { FaqEditor, type FaqEditorData } from "@/components/admin/faq-editor";

const blank: FaqEditorData = {
  id: null,
  question: "",
  answer: "",
  placement: "pricing",
  order: 0,
  published: true,
};

export default async function NewFaqPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  return (
    <AdminShell email={admin.email} pageTitle="New FAQ">
      <FaqEditor initial={blank} />
    </AdminShell>
  );
}
