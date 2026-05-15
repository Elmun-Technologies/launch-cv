import { revalidatePath } from "next/cache";

/** Invalidates the cached versions of /blog and /blog/[slug] for a post. */
export function bustBlogCache(slug: string, prevSlug?: string) {
  revalidatePath("/blog");
  revalidatePath(`/blog/${slug}`);
  if (prevSlug && prevSlug !== slug) revalidatePath(`/blog/${prevSlug}`);
  revalidatePath("/sitemap.xml");
}

/** Revalidates every public page that may render testimonials. */
export function bustTestimonialCache(placements: string[]) {
  // Home shows the global testimonial set, so always bust it.
  revalidatePath("/");
  for (const p of placements) {
    if (p === "home" || !p) continue;
    revalidatePath(`/${p}`);
  }
}

/** Revalidates the page that renders FAQs at the given placement. */
export function bustFaqCache(placement: string) {
  if (placement === "home") {
    revalidatePath("/");
    return;
  }
  revalidatePath(`/${placement}`);
}

/** Revalidates the public page tied to a PageCopy key. */
export function bustPageCopyCache(key: string) {
  // key looks like "home.hero" → invalidate "/"; "features.ats-score" → "/features/ats-score"
  const [page, ...rest] = key.split(".");
  if (!page) return;
  if (page === "home" || page === "index") {
    revalidatePath("/");
    return;
  }
  const path = rest.length > 0 ? `/${page}/${rest.join("/")}` : `/${page}`;
  revalidatePath(path);
}
