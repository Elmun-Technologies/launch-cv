/**
 * One-off corrections to published blog content that lives in the database.
 * Each fix replaces an exact old phrase only where it still appears, so it is
 * idempotent and never touches text an editor has since rewritten.
 * Runs during `npm run build`; never fails a deploy.
 */
import { PrismaClient } from "@prisma/client";
import fixes from "./content-fixes.json";

const FIELDS = ["title", "description", "bodyMd", "seoTitle", "seoDescription"] as const;

async function main() {
  if (!process.env.DATABASE_URL) return;
  const prisma = new PrismaClient();
  try {
    let changed = 0;
    type Replace = { from: string; to: string };
    type SetField = { slug: string; field: (typeof FIELDS)[number]; set: string; onlyIf: (string | null)[] };
    for (const fix of fixes as (Replace | SetField)[]) {
      if ("set" in fix) {
        // Set a field on one post, but only while it still holds a value we expect (never over an editor's change).
        const post = await prisma.blogPost.findUnique({ where: { slug: fix.slug }, select: { id: true, [fix.field]: true } });
        const current = post ? ((post as Record<string, string | null>)[fix.field] ?? null) : undefined;
        if (post && current !== fix.set && fix.onlyIf.includes(current as string | null)) {
          await prisma.blogPost.update({ where: { id: post.id }, data: { [fix.field]: fix.set } });
          changed++;
        }
        continue;
      }
      for (const field of FIELDS) {
        const rows = await prisma.blogPost.findMany({
          where: { [field]: { contains: fix.from } },
          select: { id: true, [field]: true },
        });
        for (const row of rows) {
          const value = (row as Record<string, string | null>)[field];
          if (!value) continue;
          await prisma.blogPost.update({ where: { id: row.id }, data: { [field]: value.split(fix.from).join(fix.to) } });
          changed++;
        }
      }
    }
    console.log(`[content-fixes] ${changed} field(s) updated`);
  } catch (e) {
    console.warn("[content-fixes] skipped:", e instanceof Error ? e.message : e);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
