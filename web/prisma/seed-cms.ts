/**
 * Seeds published blog posts from src/lib/blog-posts.ts into the BlogPost table.
 *
 * Two modes:
 *
 *   1. Manual (explicit publish/sync) — upserts by slug, so edits to
 *      blog-posts.ts are pushed to the DB:
 *        DATABASE_URL=postgresql://… npm run db:seed
 *
 *   2. Build-integrated, opt-in and create-only — chained into `npm run build`
 *      via the `--build-gate` flag. It is a no-op unless the environment sets
 *      BLOG_SEED_ON_BUILD=1, and it only INSERTS missing posts (never updates),
 *      so admin-panel edits are never overwritten on deploy.
 *
 * The build-gated path never throws: on any failure it logs a warning and
 * exits 0, so a seed hiccup can never fail a deploy.
 */

import { PrismaClient } from "@prisma/client";
import { BLOG_POSTS } from "../src/lib/blog-posts";

const buildGated = process.argv.includes("--build-gate");
const seedFlag = (process.env.BLOG_SEED_ON_BUILD ?? "").toLowerCase();
const buildSeedEnabled = ["1", "true", "yes", "on"].includes(seedFlag);
// Auto-deploys never clobber admin edits; manual runs sync git → DB.
const createOnly = buildGated;

function sectionsToMarkdown(sections: Array<{ heading: string; body: string }>): string {
  return sections.map((s) => `## ${s.heading}\n\n${s.body.trim()}`).join("\n\n");
}

async function main() {
  if (buildGated && !buildSeedEnabled) {
    console.log("[seed-cms] Skipped: build-gated and BLOG_SEED_ON_BUILD is not enabled.");
    return;
  }
  if (!process.env.DATABASE_URL) {
    console.warn("[seed-cms] Skipped: DATABASE_URL is not set.");
    return;
  }

  const prisma = new PrismaClient();
  const now = new Date();
  let inserted = 0;
  let updated = 0;
  let skipped = 0;

  try {
    for (const post of BLOG_POSTS) {
      const publishedAt = new Date(post.date);
      const bodyMd = sectionsToMarkdown(post.sections);
      const existing = await prisma.blogPost.findUnique({
        where: { slug: post.slug },
        select: { id: true },
      });

      if (existing && createOnly) {
        skipped++;
        continue;
      }

      const content = {
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
        seoTitle: post.seoTitle ?? undefined,
        seoDescription: post.seoDescription ?? undefined,
        status: "published",
        publishedAt,
      };

      await prisma.blogPost.upsert({
        where: { slug: post.slug },
        create: { slug: post.slug, ...content, createdAt: publishedAt, updatedAt: now },
        update: content,
      });

      if (existing) updated++;
      else inserted++;
    }

    console.log(
      `[seed-cms] Done. Inserted ${inserted}, updated ${updated}, skipped ${skipped} (existing).`,
    );
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((err) => {
  const message = err instanceof Error ? err.message : String(err);
  if (buildGated) {
    // Never fail a deploy over seeding.
    console.warn(`[seed-cms] Non-fatal error during build seed: ${message}`);
    process.exit(0);
  }
  console.error(err);
  process.exit(1);
});
