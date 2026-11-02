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
  "/resume-templates": "2026-11-02",
  "/resume-examples": "2026-10-27",
  /** All /resume-examples/[slug] pages (data in lib/resume-examples.ts). */
  "/resume-examples/*": "2026-10-27",
  "/cover-letter-examples": "2026-10-27",
  /** All /cover-letter-examples/[slug] pages (data in lib/cover-letter-examples.ts). */
  "/cover-letter-examples/*": "2026-10-27",
  "/alternatives/jobscan": "2026-11-02",
  "/resume-format": "2026-11-02",
  "/how-to-write-a-resume": "2026-11-02",
  "/resume-length": "2026-11-02",
  "/cover-letter-template": "2026-11-02",
  "/tools": "2026-11-02",
  "/tools/resume-bullet-point-generator": "2026-11-02",
  "/tools/resume-summary-generator": "2026-11-02",
  "/tools/resume-word-counter": "2026-11-02",
  "/resume-action-verbs": "2026-11-02",
  "/resume-keywords": "2026-11-02",
  "/resume-keywords/*": "2026-11-02",
  "/ats": "2026-11-02",
  "/ats/*": "2026-11-02",
  "/legal/privacy": "2026-10-27",
  "/legal/terms": "2026-10-27",
};

export function contentUpdated(path: string): Date {
  return new Date(`${CONTENT_UPDATED[path] ?? "2026-10-27"}T00:00:00Z`);
}
