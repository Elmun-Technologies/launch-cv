/**
 * Isomorphic config for the free AI writing tools: field limits shared by the
 * forms (maxLength) and the API routes (zod), and the level options.
 */

export const BULLET_LIMITS = { role: 80, duty: 400, metric: 120 } as const;
export const SUMMARY_LIMITS = { role: 80, specialty: 100, strength: 200, minStrengths: 2, maxStrengths: 4, maxYears: 50 } as const;

export const LEVELS = [
  { value: "entry", label: "Entry level" },
  { value: "experienced", label: "Experienced" },
  { value: "senior", label: "Senior" },
  { value: "manager", label: "Manager or lead" },
] as const;
export type Level = (typeof LEVELS)[number]["value"];

/** What the generator routes return on success. */
export type BulletResponse = { bullets: string[]; remaining?: number | null; limit?: number };
export type SummaryOption = { label: string; text: string };
export type SummaryResponse = { summaries: SummaryOption[]; remaining?: number | null; limit?: number };

/* ── Resignation letter generator ─────────────────────────────────────────── */

export const RESIGNATION_LIMITS = { name: 80, company: 100, position: 100, maxDaysAway: 366 } as const;

export const RESIGNATION_TONES = [
  { value: "formal", label: "Formal" },
  { value: "friendly", label: "Friendly" },
  { value: "brief", label: "Brief" },
] as const;
export type ResignationTone = (typeof RESIGNATION_TONES)[number]["value"];

/** `hint` tells the model how (and how far) to mention the reason; "none" means not at all. */
export const RESIGNATION_REASONS = [
  { value: "none", label: "Prefer not to say", hint: "Do not give, hint at or invent any reason for leaving." },
  { value: "new_job", label: "New job", hint: "The writer has accepted a new role. Do not name or describe the new employer, title or pay." },
  { value: "career_change", label: "Career change", hint: "The writer is changing careers. Do not name the new field." },
  { value: "school", label: "Going back to school", hint: "The writer is going back to school. Do not name a school or program." },
  { value: "relocation", label: "Moving away", hint: "The writer is relocating. Do not name a place." },
  { value: "personal", label: "Personal or family reasons", hint: "The writer is leaving for personal or family reasons. Give no details." },
  { value: "health", label: "Health reasons", hint: "The writer is leaving to focus on their health. Give no medical details." },
  { value: "retirement", label: "Retirement", hint: "The writer is retiring." },
] as const;
export type ResignationReason = (typeof RESIGNATION_REASONS)[number]["value"];

/** "2026-11-13" → "Friday, November 13, 2026", or null if it isn't a real date within a year of today. */
export function formatLastDay(iso: string, now = new Date()): string | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const d = new Date(`${iso}T12:00:00Z`);
  if (Number.isNaN(d.getTime()) || d.toISOString().slice(0, 10) !== iso) return null;
  if (Math.abs(d.getTime() - now.getTime()) > RESIGNATION_LIMITS.maxDaysAway * 86_400_000) return null;
  return d.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });
}

export type ResignationLetter = { label: string; text: string };
export type ResignationResponse = { letters: ResignationLetter[]; remaining?: number | null; limit?: number };

/** Caps for the no-account Word download (/api/free/letter-docx). */
export const LETTER_DOCX_LIMITS = { maxChars: 6000, maxBodyBytes: 16_000, maxBlocks: 60, perIpPerHour: 30 } as const;
