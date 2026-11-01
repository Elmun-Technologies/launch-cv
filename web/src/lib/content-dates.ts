/**
 * When each public page's content last changed in a way a reader would notice.
 * Used for sitemap <lastmod>. Update the date in the same commit that changes
 * the page's copy or data — never bump it just to look fresh (search engines
 * learn to ignore lastmod that always says "now").
 */
export const CONTENT_UPDATED: Record<string, string> = {
  "/": "2026-11-01",
  "/free-ats-check": "2026-10-27",
  "/features": "2026-10-27",
  "/features/jd-alignment": "2026-10-27",
  "/features/resume-builder": "2026-11-01",
  "/features/cover-letter": "2026-10-27",
  "/features/interview-prep": "2026-11-01",
  "/features/voice-input": "2026-10-27",
  "/pricing": "2026-11-01",
  "/compare/ats-resume-checkers": "2026-11-01",
  "/about": "2026-10-27",
  "/contact": "2026-10-27",
  "/resume-templates": "2026-10-27",
  "/resume-examples": "2026-10-27",
  /** All /resume-examples/[slug] pages (data in lib/resume-examples.ts). */
  "/resume-examples/*": "2026-10-27",
  "/cover-letter-examples": "2026-10-27",
  /** All /cover-letter-examples/[slug] pages (data in lib/cover-letter-examples.ts). */
  "/cover-letter-examples/*": "2026-10-27",
  "/legal/privacy": "2026-10-27",
  "/legal/terms": "2026-10-27",
};

export function contentUpdated(path: string): Date {
  return new Date(`${CONTENT_UPDATED[path] ?? "2026-10-27"}T00:00:00Z`);
}
