import { prisma } from "@/lib/prisma";

export type PublicFaq = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Every page an FAQ appears on. Rows saved before multi-placement only have
 * the single `placement` column, so that is the fallback.
 */
export function faqPlacements(row: { placement: string; placements?: string[] | null }): string[] {
  const list = (row.placements ?? []).filter(Boolean);
  if (list.length) return list;
  return row.placement ? [row.placement] : [];
}

/**
 * Normalizes a placement list from a request body: strings only, trimmed,
 * no blanks or duplicates. Accepts `placements` (array) or the legacy
 * `placement` (string).
 */
export function readFaqPlacements(body: Record<string, unknown>): string[] | null {
  let raw: unknown[] | null = null;
  if (Array.isArray(body.placements)) raw = body.placements;
  else if (typeof body.placement === "string") raw = [body.placement];
  if (!raw) return null;
  const out: string[] = [];
  for (const p of raw) {
    if (typeof p !== "string") continue;
    const t = p.trim();
    if (t && t.length <= 80 && !out.includes(t)) out.push(t);
  }
  return out.slice(0, 20);
}

/**
 * Returns published FAQs for a given placement, ordered. Matches the
 * `placements` list or the legacy `placement` column (which is kept equal to
 * placements[0] on save). Returns an empty array if the DB call fails so
 * callers can fall back to hardcoded copy.
 */
export async function getFaqsFor(placement: string): Promise<PublicFaq[]> {
  try {
    const rows = await prisma.faq.findMany({
      where: { published: true, OR: [{ placements: { has: placement } }, { placement }] },
      orderBy: [{ order: "asc" }, { createdAt: "asc" }],
      select: { id: true, question: true, answer: true },
    });
    return rows;
  } catch {
    return [];
  }
}
