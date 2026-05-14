import { NextResponse, type NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { signPreviewToken } from "@/lib/cms/preview-token";

/** Returns a signed preview-token URL for a blog post by id. */
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "unauthorized" }, { status: 403 });

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id }, select: { slug: true } });
  if (!post) return NextResponse.json({ error: "not_found" }, { status: 404 });

  const token = signPreviewToken(post.slug);
  return NextResponse.json({ slug: post.slug, token, path: `/blog/${post.slug}?preview=${token}` });
}
