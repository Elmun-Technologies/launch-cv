import { revalidatePath } from "next/cache";
import { PAGE_COPY, isPageCopyKey } from "@/lib/cms/page-copy";

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
    revalidatePath(placementPath(p));
  }
}

/** Revalidates the page that renders FAQs at the given placement. */
export function bustFaqCache(placement: string) {
  revalidatePath(placementPath(placement));
}

/** Public path for a FAQ/testimonial placement value. */
function placementPath(placement: string): string {
  if (!placement || placement === "home") return "/";
  // The ATS-score feature page was merged into the free checker.
  if (placement === "features/ats-score") return "/free-ats-check";
  return `/${placement}`;
}

/** Revalidates the public pages that show a PageCopy key. */
export function bustPageCopyCache(key: string) {
  const def = isPageCopyKey(key) ? PAGE_COPY[key] : null;
  for (const path of def?.paths ?? ["/"]) {
    if (path.startsWith("layout:")) revalidatePath(path.slice("layout:".length), "layout");
    else revalidatePath(path);
  }
}
