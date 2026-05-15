import { prisma } from "@/lib/prisma";

export type PublicTestimonial = {
  id: string;
  authorName: string;
  authorRole: string | null;
  authorAvatarUrl: string | null;
  quote: string;
  rating: number | null;
};

/**
 * Returns published testimonials for a given placement key, ordered.
 * Returns an empty array if the DB call fails (e.g. during build) so callers
 * can gracefully fall back to a hardcoded list.
 */
export async function getTestimonialsFor(placement: string, take = 6): Promise<PublicTestimonial[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      where: { published: true, placement: { has: placement } },
      orderBy: [{ order: "asc" }, { createdAt: "desc" }],
      take,
      select: {
        id: true,
        authorName: true,
        authorRole: true,
        authorAvatarUrl: true,
        quote: true,
        rating: true,
      },
    });
    return rows;
  } catch {
    return [];
  }
}
