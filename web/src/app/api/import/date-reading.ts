/**
 * Import parsers return each job's dates normalized ("May 2022", "Present") plus the date text
 * exactly as it was written (`dateText`). When the two disagree in a way a reader could get
 * wrong — a two-digit year, or a month or year in the result that isn't in the source — the
 * review screen asks the user to check them.
 */

export type DateReading = {
  /** Position of the job in content.experience. */
  index: number;
  /** The date text as written in the file, e.g. "’22 — now". */
  raw: string;
  start: string;
  end: string;
};

const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
const MONTH_RE = /\b(jan(?:uary)?|feb(?:ruary)?|mar(?:ch)?|apr(?:il)?|may|june?|july?|aug(?:ust)?|sept?(?:ember)?|oct(?:ober)?|nov(?:ember)?|dec(?:ember)?)\b/gi;

function monthsIn(s: string): Set<number> {
  const out = new Set<number>();
  for (const m of s.matchAll(MONTH_RE)) out.add(MONTHS.indexOf(m[1].slice(0, 3).toLowerCase()));
  // Numeric months next to a four-digit year: 05/2022, 5.2022, 2022-05.
  for (const m of s.matchAll(/\b(0?[1-9]|1[0-2])[/.-](?:19|20)\d{2}\b/g)) out.add(Number(m[1]) - 1);
  for (const m of s.matchAll(/\b(?:19|20)\d{2}[/.-](0?[1-9]|1[0-2])\b/g)) out.add(Number(m[1]) - 1);
  return out;
}

function yearsIn(s: string): Set<number> {
  return new Set([...s.matchAll(/\b(19|20)\d{2}\b/g)].map((m) => Number(m[0])));
}

/** "’22", "'22", "05/22", "5-22": a year written with two digits. */
function hasTwoDigitYear(s: string): boolean {
  return /['’‘`]\d{2}\b/.test(s) || /\b\d{1,2}[/.-]\d{2}\b(?![/.-]?\d)/.test(s);
}

/** Any month or year in `parsed` that `source` doesn't contain. */
function addsToSource(source: string, parsed: string): boolean {
  const srcMonths = monthsIn(source);
  const srcYears = yearsIn(source);
  return [...monthsIn(parsed)].some((m) => !srcMonths.has(m)) || [...yearsIn(parsed)].some((y) => !srcYears.has(y));
}

/** True when the parsed dates should be checked against what was written. */
export function dateNeedsCheck(raw: string, start: string, end: string): boolean {
  const source = raw.trim();
  if (!source) return false;
  if (hasTwoDigitYear(source)) return true;
  // "Mar 2019 – 2022": compare each side, so "Mar" on the start doesn't excuse "Mar 2022" on the end.
  const sides = source.split(/\s+(?:-|–|—|to|until|through)\s+|\s*[–—]\s*/i).filter(Boolean);
  if (sides.length === 2) return addsToSource(sides[0], start) || addsToSource(sides[1], end);
  return addsToSource(source, `${start} ${end}`);
}

/**
 * Pulls `dateText` off each job (it isn't part of ResumeContent) and returns the readings that
 * need a second look. Mutates `experience` in place.
 */
export function takeDateReadings(experience: unknown): DateReading[] {
  if (!Array.isArray(experience)) return [];
  const out: DateReading[] = [];
  experience.forEach((job, index) => {
    if (!job || typeof job !== "object") return;
    const j = job as Record<string, unknown>;
    const raw = typeof j.dateText === "string" ? j.dateText.trim().slice(0, 80) : "";
    delete j.dateText;
    const start = typeof j.start === "string" ? j.start : "";
    const end = typeof j.end === "string" ? j.end : "";
    if (raw && dateNeedsCheck(raw, start, end)) out.push({ index, raw, start, end });
  });
  return out;
}

/** Prompt lines shared by both import parsers. */
export const DATE_PROMPT = `- For each job, write start and end as "MMM YYYY" (e.g. "May 2022") when a month is given, "YYYY" when only the year is, and "Present" for a current job. Never add a month that isn't in the text.
- For each job, also return dateText: the job's date range copied exactly as written in the text (e.g. "’22 — now"), or "" if there is none.`;
