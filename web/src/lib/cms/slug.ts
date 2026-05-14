/** Generates a URL-safe slug from any title. */
export function slugify(input: string): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip diacritics
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

/**
 * Given a desired slug and a function that checks existence, returns a unique
 * slug by appending -2, -3, … until the existence check returns false.
 */
export async function uniqueSlug(
  desired: string,
  exists: (candidate: string) => Promise<boolean>,
): Promise<string> {
  const base = slugify(desired) || "post";
  if (!(await exists(base))) return base;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}-${i}`;
    if (!(await exists(candidate))) return candidate;
  }
  // Fallback — practically never hit.
  return `${base}-${Date.now()}`;
}
