import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { BlogPostEditor, type BlogEditorData } from "@/components/admin/blog-post-editor";

const blank: BlogEditorData = {
  id: null,
  slug: "",
  title: "",
  description: "",
  category: "Resume Tips",
  tags: [],
  readingTime: 5,
  authorName: "Launch CV Editorial",
  authorRole: "Career Research Team",
  authorBio: "",
  bodyMd: "",
  coverUrl: "",
  coverAlt: "",
  seoTitle: "",
  seoDescription: "",
  ogImageUrl: "",
  status: "draft",
  scheduledFor: "",
};

export default async function NewBlogPostPage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  return (
    <AdminShell email={admin.email} pageTitle="New blog post">
      <BlogPostEditor initial={blank} />
    </AdminShell>
  );
}
