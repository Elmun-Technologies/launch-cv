/** Deterministic, rule-based signals extracted from raw resume text. These are
 *  computed without any AI call and passed to the model as ground truth so the
 *  ATS score is grounded and consistent across identical inputs — not a fresh
 *  hallucination each time. Pure and side-effect free (easily testable). */

export type AtsSignals = {
  wordCount: number;
  hasEmail: boolean;
  hasPhone: boolean;
  hasLinks: boolean;
  sections: {
    experience: boolean;
    education: boolean;
    skills: boolean;
    summary: boolean;
  };
  bulletCount: number;
  /** Share of bullets that contain a number or % (0–1, rounded to 2dp). */
  quantifiedBulletRatio: number;
  dateFormatsDetected: string[];
  mixedDateFormats: boolean;
  /** Whitespace/pipe patterns that suggest a multi-column or table layout. */
  columnOrTableHint: boolean;
  /** Heavy use of ALL-CAPS words, which some parsers mis-handle. */
  allCapsHeavy: boolean;
};

const BULLET_RE = /^\s*[-•*▪●◦‣·]\s+/;
const EMAIL_RE = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i;
const PHONE_RE = /(?:\+?\d[\s().-]?){8,}\d/;
const LINK_RE = /(https?:\/\/|www\.|linkedin\.com|github\.com|behance\.net|dribbble\.com)/i;

const DATE_PATTERNS: { label: string; re: RegExp }[] = [
  { label: "MMM YYYY", re: /\b(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s+\d{4}\b/i },
  { label: "MM/YYYY", re: /\b\d{1,2}\/\d{2,4}\b/ },
  { label: "YYYY-MM", re: /\b(?:19|20)\d{2}-\d{1,2}\b/ },
];

function hasSection(lower: string, terms: RegExp): boolean {
  return terms.test(lower);
}

export function analyzeAtsSignals(input: string): AtsSignals {
  const text = input.slice(0, 40_000); // hard cap so a pathological upload can't stall
  const lower = text.toLowerCase();
  const lines = text.split(/\r?\n/);
  const words = text.split(/\s+/).filter(Boolean);

  const bulletLines = lines.filter((l) => BULLET_RE.test(l));
  const quantifiedBullets = bulletLines.filter((l) => /\d|%/.test(l));

  const dateFormatsDetected = DATE_PATTERNS.filter((p) => p.re.test(text)).map((p) => p.label);

  // Column/table hint: many lines with a run of 3+ internal spaces, or pipes.
  const gappyLines = lines.filter((l) => /\S {3,}\S/.test(l)).length;
  const pipeLines = lines.filter((l) => (l.match(/\|/g)?.length ?? 0) >= 1).length;
  const nonEmptyLines = Math.max(1, lines.filter((l) => l.trim().length > 0).length);
  const columnOrTableHint = gappyLines / nonEmptyLines > 0.25 || pipeLines / nonEmptyLines > 0.25;

  // ALL-CAPS heavy: share of caps words (len>=3, has letters) among alpha words.
  const alphaWords = words.filter((w) => /[a-z]/i.test(w));
  const capsWords = alphaWords.filter((w) => w.length >= 3 && w === w.toUpperCase() && /[A-Z]/.test(w));
  const allCapsHeavy = alphaWords.length > 0 && capsWords.length / alphaWords.length > 0.15;

  return {
    wordCount: words.length,
    hasEmail: EMAIL_RE.test(text),
    hasPhone: PHONE_RE.test(text),
    hasLinks: LINK_RE.test(text),
    sections: {
      experience: hasSection(lower, /\b(experience|employment|work history|professional background)\b/),
      education: hasSection(lower, /\beducation\b/),
      skills: hasSection(lower, /\b(skills|technologies|competencies)\b/),
      summary: hasSection(lower, /\b(summary|profile|objective|about)\b/),
    },
    bulletCount: bulletLines.length,
    quantifiedBulletRatio:
      bulletLines.length === 0
        ? 0
        : Math.round((quantifiedBullets.length / bulletLines.length) * 100) / 100,
    dateFormatsDetected,
    mixedDateFormats: dateFormatsDetected.length >= 2,
    columnOrTableHint,
    allCapsHeavy,
  };
}
