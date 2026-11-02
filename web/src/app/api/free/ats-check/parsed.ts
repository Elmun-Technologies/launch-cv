/**
 * "What the software read": a deterministic parse of the extracted resume text,
 * with no AI. It answers the questions a parser answers first — is there a
 * name, email and phone; does each dated role have a job title; are the dates
 * in a format software reads; is there a skills list and an education line.
 *
 * Section detection uses the same section words as `analyzeAtsSignals` (the
 * free check's ground-truth signals) and defers to its answer on whether a
 * section exists at all, so the two never disagree.
 */
import type { AtsSignals } from "@/lib/ats-signals";
import type { FreeAtsParsed } from "@/types/ai-results";

type SectionKey = "experience" | "education" | "skills" | "summary" | "other";

/** Same terms as lib/ats-signals.ts. */
const SECTION_TERMS: { key: Exclude<SectionKey, "other">; re: RegExp }[] = [
  { key: "experience", re: /\b(experience|employment|work history|professional background)\b/i },
  { key: "education", re: /\beducation\b/i },
  { key: "skills", re: /\b(skills|technologies|competencies)\b/i },
  { key: "summary", re: /\b(summary|profile|objective|about)\b/i },
];

/** Other headings that end a section (projects, certifications…). */
const OTHER_HEADING_RE =
  /^(projects?|certifications?|licenses?|awards?|honou?rs|languages?|interests|hobbies|volunteer(ing)?|publications?|references|achievements|courses|training|activities|leadership)$/i;

const BULLET_RE = /^\s*[-•*▪●◦‣·]\s*/;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
/** The checker's pattern, plus "(512) 555-0199" style numbers it misses. */
const PHONE_RE = /(?:\+?\d[\s().-]?){8,}\d|(?:\+?\d{1,3}[\s.-]?)?\(\d{3}\)\s?\d{3}[\s.-]?\d{4}/;

const MONTH = "(?:jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\\.?";
/** One date as people write them on resumes, readable or not. */
const DATE = `(?:${MONTH}\\s+(?:\\d{4}|['’‘]?\\d{2})|\\d{1,2}\\/(?:\\d{4}|\\d{2})|(?:19|20)\\d{2}(?:-\\d{1,2})?|['’‘]\\d{2})`;
const END = "(?:present|current|now|today)";
const RANGE_RE = new RegExp(`(?<![\\w/.-])(${DATE})\\s*(?:–|—|-|to|until|through)\\s*(${DATE}|${END}|\\d{2}\\b)`, "gi");
const SINGLE_RE = new RegExp(`(?<![\\w/.-])${DATE}(?![\\w/])`, "gi");

/** Formats parsers read reliably: "May 2022", "05/2022", "2022", "2022-05", "Present". */
function readableDate(token: string): boolean {
  const t = token.trim();
  return (
    new RegExp(`^${MONTH}\\s+\\d{4}$`, "i").test(t) ||
    /^\d{1,2}\/\d{4}$/.test(t) ||
    /^(19|20)\d{2}$/.test(t) ||
    /^(19|20)\d{2}-(0?[1-9]|1[0-2])$/.test(t) ||
    new RegExp(`^${END}$`, "i").test(t)
  );
}

const TITLE_RE =
  /\b(manager|engineer|developer|designer|analyst|director|lead|specialist|coordinator|consultant|associate|assistant|intern|officer|head|vp|vice president|president|administrator|architect|scientist|teacher|nurse|accountant|representative|executive|owner|founder|co-founder|technician|supervisor|strategist|editor|writer|producer|researcher|advisor|adviser|agent|clerk|cashier|chef|cook|driver|operator|instructor|professor|therapist|pharmacist|physician|attorney|lawyer|paralegal|recruiter|marketer|programmer|tester|mechanic|electrician|planner|buyer|controller|auditor|economist|counsel+or|trainer|principal|partner|fellow|pm|cto|ceo|cfo|coo)\b/i;

const DEGREE_RE =
  /\b(b\.?\s?a\.?|b\.?\s?s\.?c?\.?|bachelor'?s?|master'?s?|m\.?\s?s\.?c?\.?|m\.?\s?a\.?|mba|ph\.?\s?d\.?|associate'?s?|diploma|degree|university|college|institute|school)\b/i;

type Line = { text: string; section: SectionKey | null };
/** Lines tagged with the section they sit in, plus which headings appeared (even empty ones). */
type Tagged = { lines: Line[]; headings: Set<SectionKey> };

/** Heading → section key, or null when the line is ordinary text. */
function headingOf(raw: string, allowCaps = true): SectionKey | null {
  const t = raw.trim().replace(BULLET_RE, "").replace(/[:\s]+$/, "");
  if (!t || t.length > 40 || /\d/.test(t)) return null;
  if (t.split(/\s+/).length > 4) return null;
  for (const s of SECTION_TERMS) if (s.re.test(t)) return s.key;
  if (OTHER_HEADING_RE.test(t)) return "other";
  // A short all-caps line ("MY JOURNEY") still starts a new part of the page.
  if (allowCaps && t.length >= 4 && t === t.toUpperCase() && /[A-Z]/.test(t) && [2, 3].includes(t.split(/\s+/).length)) return "other";
  return null;
}

function tagLines(text: string): Tagged {
  const lines = text.split(/\r?\n/).map((l) => l.replace(/\s+$/, ""));
  let current: SectionKey | null = null;
  const out: Line[] = [];
  const headings = new Set<SectionKey>();
  let seenFirst = false;
  for (const l of lines) {
    if (!l.trim()) continue;
    // The first line is the name, never a heading.
    // "Skills: SQL, Python" — a heading with its content on the same line.
    const inline = seenFirst ? l.match(/^\s*([^:]{2,30}):\s*(\S.*)$/) : null;
    const inlineHeading = inline ? headingOf(inline[1], false) : null;
    if (inline && inlineHeading) {
      current = inlineHeading;
      headings.add(current);
      out.push({ text: inline[2].trim(), section: current });
      continue;
    }
    const h = seenFirst ? headingOf(l) : null;
    seenFirst = true;
    if (h) {
      current = h;
      headings.add(h);
      continue;
    }
    out.push({ text: l.trim(), section: current });
  }
  return { lines: out, headings };
}

function clip(s: string, n = 80): string {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

function datesIn(text: string): { readable: number; total: number } {
  const ranges = [...text.matchAll(RANGE_RE)];
  if (ranges.length) {
    return { total: ranges.length, readable: ranges.filter((m) => readableDate(m[1]) && readableDate(m[2])).length };
  }
  const singles = [...text.matchAll(SINGLE_RE)].map((m) => m[0]);
  return { total: singles.length, readable: singles.filter(readableDate).length };
}

function jobTitlesIn(lines: Line[]): { found: number; total: number } {
  const hasExperience = lines.some((l) => l.section === "experience");
  // Without an experience heading the roles still sit somewhere: look everywhere but education/skills.
  const pool = lines.filter((l) =>
    hasExperience ? l.section === "experience" : l.section !== "education" && l.section !== "skills",
  );
  let total = 0;
  let found = 0;
  pool.forEach((l, i) => {
    RANGE_RE.lastIndex = 0;
    if (!RANGE_RE.test(l.text)) return;
    RANGE_RE.lastIndex = 0;
    total += 1;
    const near = pool.slice(Math.max(0, i - 2), i + 3);
    const titled = near.some((n) => {
      if (BULLET_RE.test(n.text) || n.text.length > 90) return false;
      return TITLE_RE.test(n.text.replace(RANGE_RE, ""));
    });
    RANGE_RE.lastIndex = 0;
    if (titled) found += 1;
  });
  return { found, total };
}

function skillsIn(lines: Line[], headings: Set<SectionKey>, text: string): string[] | null {
  let raw = lines.filter((l) => l.section === "skills").map((l) => l.text);
  if (!headings.has("skills")) {
    // "Skills: SQL, Python" on one line, with no heading of its own.
    const inline = text.match(/^\s*(?:[a-z ]{0,20})?(?:skills|technologies|competencies)\s*:\s*(.+)$/im);
    if (!inline) return null;
    raw = [inline[1]];
  }
  const items = raw
    .flatMap((l) => l.replace(BULLET_RE, "").split(/[,;•|·▪●]|\s{2,}/))
    .map((s) => s.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}+#)]+$/gu, "").trim())
    .filter((s) => s.length >= 1 && s.length <= 40);
  return [...new Set(items)].slice(0, 40);
}

function educationIn(lines: Line[], text: string): string | null {
  const edu = lines.filter((l) => l.section === "education").map((l) => l.text.replace(BULLET_RE, ""));
  const pick = edu.find((l) => DEGREE_RE.test(l)) ?? edu[0];
  if (pick) return clip(pick);
  // No heading: a degree line anywhere still counts.
  const any = text.split(/\r?\n/).find((l) => /\b(b\.?a\.?|b\.?s\.?|bachelor|master|mba|ph\.?d)\b/i.test(l) && l.trim().length <= 120);
  return any ? clip(any.replace(BULLET_RE, "")) : null;
}

export function parseResumeForReport(input: string, signals: AtsSignals): FreeAtsParsed {
  const text = input.slice(0, 40_000);
  const { lines, headings } = tagLines(text);
  const first = text.split(/\r?\n/).find((l) => l.trim());
  const name = first ? clip(first, 80) : null;
  const nameLooksRight = !!name && /^[\p{L}'’.-]+(?:\s+[\p{L}'’.-]+){1,3}$/u.test(name);

  return {
    name,
    nameLooksRight,
    email: signals.hasEmail || EMAIL_RE.test(text),
    phone: signals.hasPhone || PHONE_RE.test(text),
    jobTitles: jobTitlesIn(lines),
    dates: datesIn(text),
    skills: signals.sections.skills ? skillsIn(lines, headings, text) : null,
    education: signals.sections.education ? educationIn(lines, text) : null,
  };
}
