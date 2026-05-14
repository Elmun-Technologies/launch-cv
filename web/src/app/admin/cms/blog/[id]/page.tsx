import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { BlogPostEditor, type BlogEditorData } from "@/components/admin/blog-post-editor";

function toLocalInputValue(d: Date | null): string {
  if (!d) return "";
  const offset = d.getTimezoneOffset();
  return new Date(d.getTime() - offset * 60_000).toISOString().slice(0, 16);
}

export default async function EditBlogPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await requireAdmin();
  if (!admin) redirect("/dashboard");

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });
  if (!post) notFound();

  const status: BlogEditorData["status"] =
    post.status === "published" || post.status === "scheduled" || post.status === "archived"
      ? post.status
      : "draft";

  const initial: BlogEditorData = {
    id: post.id,
    slug: post.slug,
    title: post.title,
    description: post.description,
    category: post.category,
    tags: post.tags,
    readingTime: post.readingTime,
    authorName: post.authorName,
    authorRole: post.authorRole ?? "",
    authorBio: post.authorBio ?? "",
    bodyMd: post.bodyMd,
    coverUrl: post.coverUrl ?? "",
    coverAlt: post.coverAlt ?? "",
    seoTitle: post.seoTitle ?? "",
    seoDescription: post.seoDescription ?? "",
    ogImageUrl: post.ogImageUrl ?? "",
    status,
    scheduledFor: toLocalInputValue(post.scheduledFor),
  };

  return (
    <AdminShell email={admin.email} pageTitle="Edit blog post">
      <BlogPostEditor initial={initial} />
    </AdminShell>
  );
}
