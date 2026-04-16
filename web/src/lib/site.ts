/** Canonical site origin for SEO, Open Graph, and JSON-LD. */
export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_APP_URL?.trim() || "https://launch-cv.com";
  return raw.replace(/\/$/, "");
}

export function absoluteUrl(pathname: string): string {
  const base = getSiteUrl();
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}
