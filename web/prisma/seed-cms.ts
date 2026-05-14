/**
 * One-shot seed: imports static BLOG_POSTS from src/lib/blog-posts.ts into
 * the new BlogPost Prisma model. Idempotent — upserts by slug.
 *
 * Usage:
 *   DATABASE_URL=postgresql://… npx tsx web/prisma/seed-cms.ts
 *
 * After running successfully and confirming /blog renders from DB,
 * delete src/lib/blog-posts.ts.
 */

import { PrismaClient } from "@prisma/client";
import { BLOG_POSTS } from "../src/lib/blog-posts";

const prisma = new PrismaClient();

function sectionsToMarkdown(
  sections: Array<{ heading: string; body: string }>,
): string {
  return sections
    .map((s) => `## ${s.heading}\n\n${s.body.trim()}`)
    .join("\n\n");
}

async function main() {
  const now = new Date();
  let inserted = 0;
  let updated = 0;

  for (const post of BLOG_POSTS) {
    const publishedAt = new Date(post.date);
    const bodyMd = sectionsToMarkdown(post.sections);

    const existing = await prisma.blogPost.findUnique({ where: { slug: post.slug } });

    await prisma.blogPost.upsert({
      where: { slug: post.slug },
      create: {
        slug: post.slug,
        title: post.title,
        description: post.description,
        category: post.category,
        tags: post.tags,
        readingTime: post.readingTime,
        authorName: post.author.name,
        authorRole: post.author.role,
        authorBio: post.author.bio,
        bodyMd,
        faqs: post.faqs ?? undefined,
        status: "published",
        publishedAt,
        createdAt: publishedAt,
        updatedAt: now,
      },
      update: {
        title: post.title,
        description: post.description,
        category: post.category,
        tags: post.tags,
        readingTime: post.readingTime,
        authorName: post.author.name,
        authorRole: post.author.role,
        authorBio: post.author.bio,
        bodyMd,
        faqs: post.faqs ?? undefined,
        status: "published",
        publishedAt,
      },
    });

    if (existing) updated++;
    else inserted++;
  }

  console.log(`Done. Inserted ${inserted}, updated ${updated}, total ${BLOG_POSTS.length}.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
