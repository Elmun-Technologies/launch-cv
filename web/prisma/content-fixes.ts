/**
 * One-off corrections to published blog content that lives in the database.
 * Each fix replaces an exact old phrase only where it still appears, so it is
 * idempotent and never touches text an editor has since rewritten.
 * Runs during `npm run build`; never fails a deploy.
 */
import { Prisma, PrismaClient } from "@prisma/client";
import fixes from "./content-fixes.json";

const FIELDS = ["title", "description", "bodyMd", "seoTitle", "seoDescription"] as const;

async function main() {
  if (!process.env.DATABASE_URL) return;
  const prisma = new PrismaClient();
  try {
    let changed = 0;
    type Replace = { from: string; to: string };
    // `status` lets a fix retire a post (published → archived) once it has been merged into another page and redirected.
    type SetField = { slug: string; field: (typeof FIELDS)[number] | "status"; set: string; onlyIf: (string | null)[] };
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
      // FAQ answers live in a JSON column; replace inside the serialized JSON so the shape is kept.
      const from = JSON.stringify(fix.from).slice(1, -1);
      const to = JSON.stringify(fix.to).slice(1, -1);
      const withFaqs = await prisma.blogPost.findMany({ where: { NOT: { faqs: { equals: Prisma.DbNull } } }, select: { id: true, faqs: true } });
      for (const row of withFaqs) {
        const json = JSON.stringify(row.faqs);
        if (!json.includes(from)) continue;
        await prisma.blogPost.update({ where: { id: row.id }, data: { faqs: JSON.parse(json.split(from).join(to)) } });
        changed++;
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
