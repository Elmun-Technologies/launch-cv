import { prisma } from "@/lib/prisma";

export type PublicFaq = {
  id: string;
  question: string;
  answer: string;
};

/**
 * Returns published FAQs for a given placement, ordered. Returns an empty
 * array if the DB call fails so callers can fall back to hardcoded copy.
 */
export async function getFaqsFor(placement: string): Promise<PublicFaq[]> {
  try {
    const rows = await prisma.faq.findMany({
      where: { published: true, placement },
      orderBy: { order: "asc" },
      select: { id: true, question: true, answer: true },
    });
    return rows;
  } catch {
    return [];
  }
}
