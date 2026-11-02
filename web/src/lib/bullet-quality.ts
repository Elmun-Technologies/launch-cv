/**
 * Rule-based bullet checks for the resume editor. No AI, no network: the rules run on every
 * keystroke, so they stay small and predictable.
 *
 * They are deliberately conservative. A bullet is flagged only when
 *  1. it opens with a duty phrase ("Responsible for", "Worked on", ...), or
 *  2. it is a finished thought (6+ words) with no number, no outcome word and no strong
 *     result verb at the start.
 * Short or half-typed bullets are never flagged, so the chip doesn't nag while someone types.
 *
 * Run the self-checks with: npx tsx src/lib/bullet-quality.check.ts
 */

export type BulletFlag = {
  kind: "duty" | "no-result";
  /** Chip text. */
  label: string;
  /** One sentence for screen readers and the chip's tooltip. */
  hint: string;
};

/** Phrases that describe a duty instead of a result, matched at the start of the bullet. */
export const DUTY_START =
  /^(?:was\s+|i\s+was\s+)?(?:responsible\s+for|duties\s+(?:included|include|were)|worked\s+on|helped(?:\s+with|\s+to)?|tasked\s+with|in\s+charge\s+of|assisted\s+(?:with|in)|involved\s+in|participated\s+in)\b/i;

/** Number words that count as a figure ("doubled", "a dozen", "three"). */
const NUMBER_WORDS =
  /\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|forty|fifty|hundred|hundreds|thousand|thousands|million|millions|billion|dozen|dozens|double|doubled|triple|tripled|half|halved|first|top)\b/i;

/** Words that name an outcome or a change. Stems, so "reduced", "reduces" and "reduction" all count. */
const OUTCOME_WORDS =
  /\b(?:increas|decreas|reduc|cut|cutting|sav|grew|grow|improv|rais|boost|lower|shorten|speed|sped|faster|fewer|less|more|accelerat|expand|eliminat|prevent|avoid|recover|win|won|award|promot|exceed|surpass|beat|record|revenue|profit|margin|retention|conversion|churn|satisfaction|nps|csat|growth|savings|on\s+time|under\s+budget|ahead\s+of\s+schedule|zero|without|resulting|result|so\s+(?:that|they|we|the|our|it)|leading\s+to|which\s+led|enabl|unblock|adopt|launch|ship|deliver|achiev|generat|secur|clos|land|rank|certif)\w*/i;

/** Strong result verbs at the start of a bullet; these read as outcomes even without a number. */
const RESULT_VERB_START =
  /^(?:launched|shipped|delivered|built|created|founded|introduced|designed|redesigned|rebuilt|automated|established|implemented|developed|negotiated|closed|won|led|spearheaded|pioneered|published|opened|migrated|resolved|turned\s+around|streamlined|standardized|standardised)\b/i;

const DUTY: BulletFlag = {
  kind: "duty",
  label: "Duty, not result",
  hint: "This bullet describes a duty. Start with what changed because of your work.",
};

const NO_RESULT: BulletFlag = {
  kind: "no-result",
  label: "No result",
  hint: "This bullet has no number or outcome. Add what changed because of your work.",
};

function words(text: string): string[] {
  return text.trim().split(/\s+/).filter(Boolean);
}

/** The flag for one bullet, or null when it reads fine (or is too short to judge yet). */
export function checkBullet(raw: string): BulletFlag | null {
  const text = raw.replace(/^[\s•\-–—*·]+/, "").trim();
  if (!text) return null;
  if (DUTY_START.test(text)) return DUTY;
  if (words(text).length < 6) return null;
  if (/\d/.test(text) || /[%$€£]/.test(text) || NUMBER_WORDS.test(text)) return null;
  if (OUTCOME_WORDS.test(text)) return null;
  if (RESULT_VERB_START.test(text)) return null;
  return NO_RESULT;
}

/** How many bullets across the resume read like a duty (the strongest of the two flags). */
export function countDutyBullets(bullets: string[]): number {
  return bullets.reduce((n, b) => (checkBullet(b)?.kind === "duty" ? n + 1 : n), 0);
}

/* ── Self-checks ──────────────────────────────────────────────────────── */

/** [bullet, expected flag kind or null]. Kept next to the rules so a change to one shows up in the other. */
export const BULLET_QUALITY_CASES: [string, BulletFlag["kind"] | null][] = [
  // Duty phrases are flagged at the start, whatever follows.
  ["Responsible for the onboarding project", "duty"],
  ["responsible for managing 12 clinics", "duty"],
  ["Duties included scheduling and payroll", "duty"],
  ["Worked on the checkout redesign", "duty"],
  ["Helped with month-end close", "duty"],
  ["Tasked with reducing churn", "duty"],
  ["In charge of the front desk", "duty"],
  ["• Responsible for vendor contracts", "duty"],
  // ...but only at the start.
  ["Took over the project nobody was responsible for and shipped it in 6 weeks", null],
  // Numbers and outcomes pass.
  ["Launched self-scheduling across 41 clinics, cutting no-shows by 23%", null],
  ["Led 9 engineers and 2 designers through quarterly planning", null],
  ["Raised week-1 activation from 38% to 57% with a new onboarding flow", null],
  ["Doubled the size of the newsletter list through a referral program", null],
  ["Reduced patient wait times by reorganizing the triage desk", null],
  ["Trained new hires so they could work the register on their own", null],
  // Strong result verbs pass even without a number.
  ["Built the internal tool the support team now uses for refunds", null],
  // Short or half-typed bullets are never flagged.
  ["Managed the team", null],
  ["", null],
  ["   ", null],
  // A finished bullet with no figure, outcome or result verb.
  ["Ran stakeholder reviews with clinical, legal and sales leads", "no-result"],
  ["Answered phones and greeted visitors at the front desk", "no-result"],
];

/** Runs the cases; returns one line per failure (empty when all pass). */
export function runBulletQualitySelfChecks(): string[] {
  const failures: string[] = [];
  for (const [text, expected] of BULLET_QUALITY_CASES) {
    const got = checkBullet(text)?.kind ?? null;
    if (got !== expected) failures.push(`"${text}": expected ${expected ?? "no flag"}, got ${got ?? "no flag"}`);
  }
  return failures;
}
