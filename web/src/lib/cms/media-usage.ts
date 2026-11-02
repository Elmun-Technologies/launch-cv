import { prisma } from "@/lib/prisma";

export type MediaUsage = { blog: boolean; pages: boolean };
export type MediaFilter = "all" | "blog" | "pages" | "unused";

export const MEDIA_FILTERS: { value: MediaFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "blog", label: "Blog" },
  { value: "pages", label: "Pages" },
  { value: "unused", label: "Unused" },
];

export function isMediaFilter(v: unknown): v is MediaFilter {
  return v === "all" || v === "blog" || v === "pages" || v === "unused";
}

/** "/media/abc.webp" from a stored URL, absolute or relative. */
function mediaPath(url: string): string {
  try {
    return new URL(url, "https://x.invalid").pathname;
  } catch {
    return url;
  }
}

/**
 * Where each media asset is referenced, computed on the server from the
 * content itself:
 * - blog: any blog post's body, cover image or Open Graph image;
 * - pages: saved page copy, or a testimonial avatar (shown on public pages).
 * An asset with neither is unused. Matching is on the asset's path, so both
 * "/media/x.webp" and "https://launch-cv.com/media/x.webp" count.
 */
export async function mediaUsage(assets: { id: string; url: string }[]): Promise<Map<string, MediaUsage>> {
  const [posts, copies, testimonials] = await Promise.all([
    prisma.blogPost.findMany({ select: { bodyMd: true, coverUrl: true, ogImageUrl: true } }),
    prisma.pageCopy.findMany({ select: { data: true } }),
    prisma.testimonial.findMany({ where: { authorAvatarUrl: { not: null } }, select: { authorAvatarUrl: true } }),
  ]);
  const blogText = posts.map((p) => `${p.bodyMd}\n${p.coverUrl ?? ""}\n${p.ogImageUrl ?? ""}`).join("\n");
  const pagesText = [...copies.map((c) => JSON.stringify(c.data)), ...testimonials.map((t) => t.authorAvatarUrl ?? "")].join("\n");

  const out = new Map<string, MediaUsage>();
  for (const a of assets) {
    const path = mediaPath(a.url);
    const needle = path && path !== "/" ? path : a.url;
    out.set(a.id, { blog: !!needle && blogText.includes(needle), pages: !!needle && pagesText.includes(needle) });
  }
  return out;
}

/** Asset ids matching a usage filter, newest first. */
export async function mediaIdsFor(filter: MediaFilter, where: object): Promise<{ ids: string[]; usage: Map<string, MediaUsage> }> {
  const all = await prisma.mediaAsset.findMany({ where, orderBy: { createdAt: "desc" }, select: { id: true, url: true } });
  const usage = await mediaUsage(all);
  const ids = all
    .filter((a) => {
      const u = usage.get(a.id)!;
      if (filter === "blog") return u.blog;
      if (filter === "pages") return u.pages;
      if (filter === "unused") return !u.blog && !u.pages;
      return true;
    })
    .map((a) => a.id);
  return { ids, usage };
}
