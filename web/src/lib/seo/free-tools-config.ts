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
