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
 * What still blocks a testimonial from being published: the author's name,
 * the date they gave written permission, and where they said it. Empty when
 * it may be published. Used by the API (enforced) and the editor (hints).
 */
export function testimonialPublishProblems(t: {
  authorName?: string | null;
  quote?: string | null;
  permissionDate?: Date | string | null;
  source?: string | null;
}): string[] {
  const out: string[] = [];
  if (!t.authorName?.trim()) out.push("author name");
  if (!t.quote?.trim()) out.push("quote");
  const d = t.permissionDate ? new Date(t.permissionDate) : null;
  if (!d || isNaN(d.getTime())) out.push("permission date");
  if (!t.source?.trim()) out.push("source");
  return out;
}

/**
 * Reads a permission date from a request body: null or "" clears it, a
 * YYYY-MM-DD or ISO string sets it, anything else is "invalid". A date in
 * the future is invalid too: permission can't have been given tomorrow.
 */
export function readPermissionDate(v: unknown): Date | null | "invalid" {
  if (v === null || v === undefined || v === "") return null;
  if (typeof v !== "string") return "invalid";
  const d = new Date(/^\d{4}-\d{2}-\d{2}$/.test(v) ? `${v}T00:00:00.000Z` : v);
  if (isNaN(d.getTime()) || d.getTime() > Date.now() + 36 * 3600_000) return "invalid";
  return d;
}

/** Trims a source string; blank or non-string becomes null. Capped at 300 characters. */
export function readSource(v: unknown): string | null {
  if (typeof v !== "string") return null;
  const t = v.trim().slice(0, 300);
  return t || null;
}

/**
 * Returns published testimonials for a given placement key, ordered. Only
 * rows with a recorded permission date and source are shown, even if an
 * older row was published before those fields existed.
 * Returns an empty array if the DB call fails (e.g. during build) so callers
 * can gracefully fall back to a hardcoded list.
 */
export async function getTestimonialsFor(placement: string, take = 6): Promise<PublicTestimonial[]> {
  try {
    const rows = await prisma.testimonial.findMany({
      where: {
        published: true,
        placement: { has: placement },
        permissionDate: { not: null },
        source: { not: null },
        NOT: [{ source: "" }, { authorName: "" }],
      },
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
