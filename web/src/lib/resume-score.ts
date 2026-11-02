/**
 * LaunchCV Score: a 0–100 guide to how finished and readable a resume is, built from
 * transparent, rule-based checks. No AI and no network: it runs in the browser as the
 * person types. It is not a prediction of whether anyone gets an interview.
 *
 * Five categories, each scored 0–100 from the checks listed below it, then weighted:
 *
 *   Content completeness  25  contact details, headline, summary, experience, bullets, education, skills
 *   Impact                25  share of bullets with a number or outcome (target 60%), duty phrases
 *   Writing               20  filler words, repeated opening words, bullet length 8–30 words,
 *                             consistent end punctuation, no "I/my" in bullets
 *   ATS format            15  standard section names, Mmm YYYY dates, no tables or columns,
 *                             readable contact details, length within 1–2 pages
 *   Keywords              15  share of the job description's terms the resume uses (80% = full marks).
 *                             Only when a job description is set; without one the other four are
 *                             scaled to 100.
 *
 * Bands match the ATS report (components/ats-report-parts.tsx): 80+ "Ready to send",
 * 65–79 "Readable", below 65 "At risk".
 *
 * Every lost point produces an item with a message, a fix and (usually) a target the editor
 * can scroll to and focus. The rules are lenient on purpose: half-typed bullets are not
 * judged, a junior with few numbers lands in "Readable", and nothing says "high" unless a
 * recruiter really can't use the resume without it.
 *
 * Self-checks: npx tsx src/lib/resume-score.check.ts
 */
import type { ResumeContent } from "@/types/resume";
import { checkBullet, DUTY_START, type BulletFlag } from "@/lib/bullet-quality";
import { matchKeywords, type KeywordReport, type ScoreTarget } from "@/lib/resume-keywords";

export type { ScoreTarget, KeywordReport } from "@/lib/resume-keywords";

export type ScoreCategoryId = "content" | "impact" | "writing" | "ats" | "keywords";

/** Category weights. Keywords only counts when a job description is set. */
export const SCORE_WEIGHTS: Record<ScoreCategoryId, number> = { content: 25, impact: 25, writing: 20, ats: 15, keywords: 15 };

export const SCORE_CATEGORY_LABELS: Record<ScoreCategoryId, string> = {
  content: "Content completeness",
  impact: "Impact",
  writing: "Writing",
  ats: "ATS format",
  keywords: "Keywords",
};

/** Same thresholds as SCORE_BANDS in components/ats-report-parts.tsx. */
export const RESUME_SCORE_BANDS = { ready: 80, readable: 65 } as const;
export type ScoreBand = "ready" | "readable" | "risk";

export type Severity = "high" | "medium" | "low";

export type ScoreItem = {
  id: string;
  category: ScoreCategoryId;
  severity: Severity;
  /** What's wrong, in one sentence. */
  message: string;
  /** What to do about it. */
  fix: string;
  target?: ScoreTarget;
  /** About how many points of the total this item is worth (rounded; 0 when under 1). */
  points: number;
};

export type ScoreCheck = {
  id: string;
  label: string;
  earned: number;
  max: number;
  /** Short explanation of the result ("4 of 6 bullets"). */
  detail?: string;
};

export type ScoreCategory = {
  id: ScoreCategoryId;
  label: string;
  weight: number;
  /** 0–100. */
  score: number;
  /** False for Keywords without a job description: left out of the total. */
  applicable: boolean;
  checks: ScoreCheck[];
  /** One line under the bar. */
  note?: string;
};

export type BulletChipKind = BulletFlag["kind"] | "filler" | "too-long" | "repeat-start";
export type BulletChip = { kind: BulletChipKind; label: string; hint: string };

export type ResumeScore = {
  total: number;
  band: ScoreBand;
  categories: ScoreCategory[];
  /** Sorted: high, then medium, then low; larger point values first. */
  items: ScoreItem[];
  /** Inline chips per bullet id. */
  bullets: Record<string, BulletChip[]>;
  keywords: KeywordReport | null;
  wordCount: number;
};

export function scoreBand(total: number): ScoreBand {
  if (total >= RESUME_SCORE_BANDS.ready) return "ready";
  if (total >= RESUME_SCORE_BANDS.readable) return "readable";
  return "risk";
}

/* ── Text helpers ─────────────────────────────────────────────────── */

const words = (s: string | undefined) => (s ?? "").trim().split(/\s+/).filter(Boolean);
const cleanBullet = (s: string) => s.replace(/^[\s•\-–—*·]+/, "").trim();
const clip = (s: string, n = 44) => {
  const t = s.replace(/\s+/g, " ").trim();
  return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t;
};

const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;

/** Filler that adds words but no information. Matched case-insensitively on bullets and the summary. */
const FILLER: { re: RegExp; word: string }[] = [
  { re: /\bresponsible for\b/i, word: "responsible for" },
  { re: /\bvarious\b/i, word: "various" },
  // "helped with…" says nothing; "…that helped the site hit 99.8%" is fine.
  { re: /\bhelped (?:with|to|out)\b/i, word: "helped" },
  { re: /\bteam player\b/i, word: "team player" },
  { re: /\bhard[- ]?working\b/i, word: "hard-working" },
  { re: /\bdetail[- ]oriented\b/i, word: "detail-oriented" },
  { re: /\bresults[- ]driven\b/i, word: "results-driven" },
  { re: /\bself[- ]starter\b/i, word: "self-starter" },
  { re: /\bgo[- ]getter\b/i, word: "go-getter" },
  { re: /\bsynerg(?:y|ies|ize)\b/i, word: "synergy" },
  { re: /\bthink(?:ing)? outside the box\b/i, word: "think outside the box" },
  { re: /\butili[sz](?:e|ed|es|ing)\b/i, word: "utilized" },
  { re: /\bduties included\b/i, word: "duties included" },
  { re: /\bin charge of\b/i, word: "in charge of" },
  { re: /\bsuccessfully\b/i, word: "successfully" },
  { re: /\betc\.?(?=\s|$)/i, word: "etc." },
];

function fillerIn(text: string, skipDutyStart: boolean): string[] {
  const t = skipDutyStart ? text.replace(DUTY_START, "") : text;
  return FILLER.filter((f) => f.re.test(t)).map((f) => f.word);
}

/** First-person pronouns in a bullet ("I", "my", "me"). "I" must be the capital word. */
const FIRST_PERSON = /(?:^|[^A-Za-z'’])(?:I|[Mm]y|[Mm]e)(?![A-Za-z'’])/;

/** "Mmm YYYY" (also Sept and full month names), a year, or Present. */
type DateKind = "mmm" | "year" | "present" | "other" | "empty";
function dateKind(raw: string | undefined): DateKind {
  const s = (raw ?? "").trim();
  if (!s) return "empty";
  if (/^(present|current|now|today)$/i.test(s)) return "present";
  if (/^(jan|feb|mar|apr|may|jun|jul|aug|sep|sept|oct|nov|dec)[a-z]*\.?\s+(19|20)\d{2}$/i.test(s)) return "mmm";
  if (/^(19|20)\d{2}$/.test(s)) return "year";
  return "other";
}

/* ── Building blocks ──────────────────────────────────────────────── */

type Draft = { checks: ScoreCheck[]; items: (Omit<ScoreItem, "points" | "category"> & { checkId: string })[] };

function check(d: Draft, id: string, label: string, earned: number, max: number, detail?: string) {
  d.checks.push({ id, label, earned: Math.max(0, Math.min(max, Math.round(earned * 10) / 10)), max, detail });
}

type Flat = { expId: string; bulletId: string; text: string; role: string; index: number; prevText: string | null };

function bulletLabel(b: Flat): string {
  return `“${clip(b.text)}”${b.role ? ` (${clip(b.role, 28)})` : ""}`;
}

const bulletTarget = (b: Flat): ScoreTarget => ({ tab: "experience", key: `bullet:${b.bulletId}`, expId: b.expId });

/* ── Categories ───────────────────────────────────────────────────── */

function contentCategory(c: ResumeContent, bullets: Flat[]): Draft {
  const d: Draft = { checks: [], items: [] };
  const ct = c.contact;

  const name = ct.fullName.trim();
  check(d, "name", "Full name", name ? 8 : 0, 8);
  if (!name) d.items.push({ id: "content.name", checkId: "name", severity: "high", message: "Your resume has no name.", fix: "Add your full name at the top.", target: { tab: "details", key: "contact.fullName" } });

  const email = ct.email.trim();
  check(d, "email", "Email", email ? 8 : 0, 8);
  if (!email) d.items.push({ id: "content.email", checkId: "email", severity: "high", message: "There's no email address.", fix: "Add an email you check, so a recruiter can reach you.", target: { tab: "details", key: "contact.email" } });

  const phone = (ct.phone ?? "").trim();
  check(d, "phone", "Phone", phone ? 5 : 0, 5);
  if (!phone) d.items.push({ id: "content.phone", checkId: "phone", severity: "medium", message: "There's no phone number.", fix: "Add a phone number. Many recruiters call before they email.", target: { tab: "details", key: "contact.phone" } });

  const loc = (ct.location ?? "").trim();
  check(d, "location", "Location", loc ? 4 : 0, 4);
  if (!loc) d.items.push({ id: "content.location", checkId: "location", severity: "low", message: "There's no location.", fix: "Add your city and state or country, or “Remote”. No street address needed.", target: { tab: "details", key: "contact.location" } });

  check(d, "headline", "Headline", c.headline.trim() ? 5 : 0, 5);
  if (!c.headline.trim()) d.items.push({ id: "content.headline", checkId: "headline", severity: "low", message: "There's no headline.", fix: "Add a one-line headline with the job title you're aiming for.", target: { tab: "shortbio", key: "headline" } });

  const sw = words(c.summary).length;
  const summaryPts = sw >= 25 && sw <= 120 ? 15 : sw > 120 ? 11 : sw > 0 ? 8 : 0;
  check(d, "summary", "Summary of 25–120 words", summaryPts, 15, sw ? `${sw} words` : "Empty");
  if (sw === 0) d.items.push({ id: "content.summary", checkId: "summary", severity: "medium", message: "There's no summary.", fix: "Write 2–3 sentences: who you are, what you're good at, and one result you're proud of.", target: { tab: "shortbio", key: "summary" } });
  else if (sw < 25) d.items.push({ id: "content.summary", checkId: "summary", severity: "low", message: `Your summary is ${sw} ${sw === 1 ? "word" : "words"}.`, fix: "Grow it to 2–3 sentences (25–60 words), with one concrete result.", target: { tab: "shortbio", key: "summary" } });
  else if (sw > 120) d.items.push({ id: "content.summary", checkId: "summary", severity: "low", message: `Your summary is ${sw} words, longer than most recruiters read.`, fix: "Trim it to 3–4 sentences. Move details into your bullets.", target: { tab: "shortbio", key: "summary" } });

  const jobs = c.experience.filter((e) => e.role.trim() || e.company.trim() || e.bullets.some((b) => b.text.trim()));
  check(d, "experience", "At least one job", jobs.length ? 20 : 0, 20);
  if (!jobs.length) {
    d.items.push({
      id: "content.experience", checkId: "experience", severity: "high", message: "There's no work experience yet.",
      fix: "Add your most recent job. Internships, part-time work, volunteering and projects all count.",
      target: c.experience[0] ? { tab: "experience", key: `exp:${c.experience[0].id}:role`, expId: c.experience[0].id } : { tab: "experience", key: "experience.add" },
    });
  }

  const untitled = jobs.filter((e) => !e.role.trim() || !e.company.trim());
  check(d, "jobDetails", "Each job has a title and company", jobs.length ? 5 * (1 - untitled.length / jobs.length) : 0, 5);
  for (const e of untitled) {
    const missing = !e.role.trim() ? "role" : "company";
    d.items.push({
      id: `content.job.${e.id}`, checkId: "jobDetails", severity: "medium",
      message: `${e.role.trim() || e.company.trim() || "A job"} has no ${missing === "role" ? "job title" : "company name"}.`,
      fix: missing === "role" ? "Add the job title you held." : "Add the company or organization name.",
      target: { tab: "experience", key: `exp:${e.id}:${missing}`, expId: e.id },
    });
  }

  const nb = bullets.length;
  check(d, "bullets", "3 or more bullets", nb >= 3 ? 10 : nb > 0 ? 5 : 0, 10, `${nb} ${nb === 1 ? "bullet" : "bullets"}`);
  for (const e of jobs) {
    if (e.bullets.some((b) => b.text.trim())) continue;
    d.items.push({
      id: `content.bullets.${e.id}`, checkId: "bullets", severity: nb === 0 ? "high" : "medium",
      message: `${e.role.trim() || e.company.trim() || "A job"} has no bullets.`,
      fix: "Add 3–5 bullets: what you did and what changed because of it.",
      target: { tab: "experience", key: `exp:${e.id}:addBullet`, expId: e.id },
    });
  }
  if (nb > 0 && nb < 3 && d.items.every((i) => i.checkId !== "bullets")) {
    const last = bullets[bullets.length - 1];
    d.items.push({ id: "content.bullets", checkId: "bullets", severity: "low", message: `Only ${nb} ${nb === 1 ? "bullet" : "bullets"} so far.`, fix: "Aim for 3–5 bullets on your most recent job.", target: { tab: "experience", key: `exp:${last.expId}:addBullet`, expId: last.expId } });
  }

  const edu = c.education.filter((e) => e.school.trim() || e.degree.trim());
  check(d, "education", "Education", edu.length ? 10 : 0, 10);
  if (!edu.length) {
    d.items.push({
      id: "content.education", checkId: "education", severity: "medium", message: "There's no education.",
      fix: "Add your degree, bootcamp, diploma or high school.",
      target: c.education[0] ? { tab: "education", key: `edu:${c.education[0].id}:school` } : { tab: "education", key: "education.add" },
    });
  }

  const ns = c.skills.filter((s) => s.trim()).length;
  check(d, "skills", "6 or more skills", ns >= 6 ? 10 : ns > 0 ? 5 : 0, 10, `${ns} ${ns === 1 ? "skill" : "skills"}`);
  if (ns < 6) {
    d.items.push({
      id: "content.skills", checkId: "skills", severity: ns === 0 ? "medium" : "low",
      message: ns === 0 ? "There are no skills listed." : `Only ${ns} ${ns === 1 ? "skill" : "skills"} listed.`,
      fix: "List 6–15 skills and tools you'd be happy to be asked about in an interview.",
      target: { tab: "skills", key: "skills.add" },
    });
  }
  return d;
}

function impactCategory(c: ResumeContent, bullets: Flat[]): Draft {
  const d: Draft = { checks: [], items: [] };
  const flagged = bullets.map((b) => ({ b, flag: checkBullet(b.text) }));
  // Bullets of 6+ words are "finished" and judged; shorter ones may still be half-typed.
  const judged = flagged.filter(({ b, flag }) => flag?.kind === "duty" || words(cleanBullet(b.text)).length >= 6);
  const withResult = judged.filter(({ flag }) => !flag);
  const duty = flagged.filter(({ flag }) => flag?.kind === "duty");

  if (!bullets.length) {
    check(d, "results", "Bullets with a number or outcome", 0, 70, "No bullets yet");
    check(d, "duty", "No duty phrases", 0, 30, "No bullets yet");
    return d;
  }
  if (!judged.length) {
    check(d, "results", "Bullets with a number or outcome", 35, 70, "Bullets too short to judge");
    d.items.push({ id: "impact.short", checkId: "results", severity: "low", message: "Your bullets are too short to show a result yet.", fix: "Write each as a full sentence: what you did, and what changed because of it.", target: bulletTarget(bullets[0]) });
  } else {
    const ratio = withResult.length / judged.length;
    check(d, "results", "Bullets with a number or outcome (60% is full marks)", 70 * Math.min(1, ratio / 0.6), 70, `${withResult.length} of ${judged.length} bullets`);
    if (ratio < 0.6) {
      for (const { b, flag } of judged) {
        if (flag?.kind !== "no-result") continue;
        d.items.push({
          id: `impact.result.${b.bulletId}`, checkId: "results", severity: "medium",
          message: `${bulletLabel(b)} has no number or outcome.`,
          fix: "Add what changed: people served, time saved, a % or an amount, or the result. An honest estimate (“about 20 a week”) is fine.",
          target: bulletTarget(b),
        });
      }
    }
  }
  check(d, "duty", "No duty phrases", Math.max(0, 30 - duty.length * 10), 30, duty.length ? `${duty.length} ${duty.length === 1 ? "bullet starts" : "bullets start"} with a duty` : "None");
  for (const { b } of duty) {
    d.items.push({
      id: `impact.duty.${b.bulletId}`, checkId: "duty", severity: "medium",
      message: `${bulletLabel(b)} starts with a duty phrase.`,
      fix: "Start with an action verb and say what you achieved, not what you were assigned.",
      target: bulletTarget(b),
    });
  }
  return d;
}

function writingCategory(c: ResumeContent, bullets: Flat[], chips: Record<string, BulletChip[]>): Draft {
  const d: Draft = { checks: [], items: [] };
  const addChip = (id: string, chip: BulletChip) => { (chips[id] ??= []).push(chip); };

  if (!bullets.length && !c.summary.trim()) {
    for (const [id, label, max] of [["filler", "No filler words", 25], ["repeats", "Varied opening words", 20], ["length", "Bullets of 8–30 words", 25], ["punctuation", "Consistent end punctuation", 10], ["firstPerson", "No “I” or “my” in bullets", 20]] as const) {
      check(d, id, label, 0, max, "Nothing to check yet");
    }
    return d;
  }

  // Filler words: bullets and the summary. A duty opening is already flagged under Impact.
  let fillerHits = 0;
  for (const b of bullets) {
    const found = fillerIn(cleanBullet(b.text), true);
    if (!found.length) continue;
    fillerHits += 1;
    const list = found.map((w) => `“${w}”`).join(", ");
    addChip(b.bulletId, { kind: "filler", label: "Filler words", hint: `Cut ${list}: say exactly what you did.` });
    d.items.push({ id: `writing.filler.${b.bulletId}`, checkId: "filler", severity: "low", message: `${bulletLabel(b)} uses ${list}.`, fix: "Cut the filler and name the action and the result.", target: bulletTarget(b) });
  }
  const summaryFiller = fillerIn(c.summary, false);
  if (summaryFiller.length) {
    fillerHits += 1;
    d.items.push({ id: "writing.filler.summary", checkId: "filler", severity: "low", message: `Your summary uses ${summaryFiller.map((w) => `“${w}”`).join(", ")}.`, fix: "Swap the cliché for a fact: years of experience, a specialty, a result.", target: { tab: "shortbio", key: "summary" } });
  }
  check(d, "filler", "No filler words", 25 - fillerHits * 5, 25, fillerHits ? `${fillerHits} ${fillerHits === 1 ? "place" : "places"}` : "None");

  // Opening words: the same as the bullet just above, or one verb starting many bullets.
  let repeatHits = 0;
  const first = (t: string) => (words(cleanBullet(t))[0] ?? "").toLowerCase().replace(/[^a-z'’-]/g, "");
  for (const b of bullets) {
    if (!b.prevText) continue;
    const a = first(b.text);
    if (!a || a.length < 2 || words(b.text).length < 3 || words(b.prevText).length < 3 || a !== first(b.prevText)) continue;
    repeatHits += 1;
    const verb = words(cleanBullet(b.text))[0];
    addChip(b.bulletId, { kind: "repeat-start", label: "Starts like the last one", hint: `This bullet and the one above both start with “${verb}”. Try a different verb.` });
    d.items.push({ id: `writing.repeat.${b.bulletId}`, checkId: "repeats", severity: "low", message: `${bulletLabel(b)} starts with “${verb}”, like the bullet above it.`, fix: "Open with a different, specific verb.", target: bulletTarget(b) });
  }
  const openers = new Map<string, Flat[]>();
  for (const b of bullets) {
    const a = first(b.text);
    if (a.length >= 2 && words(b.text).length >= 3) openers.set(a, [...(openers.get(a) ?? []), b]);
  }
  for (const [w, list] of openers) {
    if (list.length <= 3 || list.length / bullets.length < 0.25) continue;
    repeatHits += 1;
    const verb = words(cleanBullet(list[0].text))[0];
    d.items.push({ id: `writing.opener.${w}`, checkId: "repeats", severity: "low", message: `${list.length} bullets start with “${verb}”.`, fix: "Vary your opening verbs so each bullet reads as its own result.", target: bulletTarget(list[1]) });
  }
  check(d, "repeats", "Varied opening words", 20 - repeatHits * 5, 20, repeatHits ? `${repeatHits} ${repeatHits === 1 ? "repeat" : "repeats"}` : "None");

  // Length: 8–30 words reads as one complete, scannable line or two.
  if (bullets.length) {
    let ok = 0;
    for (const b of bullets) {
      const n = words(cleanBullet(b.text)).length;
      if (n >= 8 && n <= 30) { ok += 1; continue; }
      if (n > 30) {
        addChip(b.bulletId, { kind: "too-long", label: "Too long", hint: `${n} words. Aim for 8–30: split it, or cut the setup.` });
        d.items.push({ id: `writing.long.${b.bulletId}`, checkId: "length", severity: "low", message: `${bulletLabel(b)} is ${n} words.`, fix: "Keep bullets to 8–30 words. Split it in two, or cut the setup.", target: bulletTarget(b) });
      } else {
        d.items.push({ id: `writing.short.${b.bulletId}`, checkId: "length", severity: "low", message: `${bulletLabel(b)} is ${n} ${n === 1 ? "word" : "words"}.`, fix: "Aim for 8–30 words: the action, how, and what changed.", target: bulletTarget(b) });
      }
    }
    check(d, "length", "Bullets of 8–30 words", 25 * (ok / bullets.length), 25, `${ok} of ${bullets.length} bullets`);
  } else {
    check(d, "length", "Bullets of 8–30 words", 0, 25, "No bullets yet");
  }

  // End punctuation: either every bullet ends with a full stop or none does.
  const sentences = bullets.filter((b) => words(b.text).length >= 3);
  const withStop = sentences.filter((b) => /[.!]\s*$/.test(b.text));
  const without = sentences.filter((b) => !/[.!]\s*$/.test(b.text));
  const mixed = sentences.length >= 3 && withStop.length > 0 && without.length > 0;
  check(d, "punctuation", "Consistent end punctuation", mixed ? 0 : sentences.length ? 10 : 0, 10, mixed ? `${withStop.length} with a full stop, ${without.length} without` : sentences.length ? "Consistent" : "No bullets yet");
  if (mixed) {
    const minority = withStop.length <= without.length ? withStop : without;
    const style = minority === withStop ? "Remove the full stop" : "Add a full stop";
    d.items.push({
      id: "writing.punctuation", checkId: "punctuation", severity: "low",
      message: `${withStop.length} ${withStop.length === 1 ? "bullet ends" : "bullets end"} with a full stop and ${without.length} ${without.length === 1 ? "doesn't" : "don't"}.`,
      fix: `Pick one style. ${style} on ${minority.length === 1 ? "this bullet" : `these ${minority.length} bullets`}, starting with ${bulletLabel(minority[0])}.`,
      target: bulletTarget(minority[0]),
    });
  }

  // First person: bullets read as "I" already; the summary may use it.
  const fp = bullets.filter((b) => FIRST_PERSON.test(b.text));
  check(d, "firstPerson", "No “I” or “my” in bullets", bullets.length ? 20 - fp.length * 5 : 0, 20, bullets.length ? (fp.length ? `${fp.length} ${fp.length === 1 ? "bullet" : "bullets"}` : "None") : "No bullets yet");
  for (const b of fp) {
    d.items.push({ id: `writing.firstPerson.${b.bulletId}`, checkId: "firstPerson", severity: "low", message: `${bulletLabel(b)} uses “I” or “my”.`, fix: "Drop the pronoun and start with the verb (“Cleared a backlog…”, not “I cleared my backlog…”).", target: bulletTarget(b) });
  }
  return d;
}

function atsCategory(c: ResumeContent, wordCount: number): Draft {
  const d: Draft = { checks: [], items: [] };
  // LaunchCV templates always print "Experience", "Education", "Skills" headings in one column.
  check(d, "sections", "Standard section names", 20, 20, "Set by the template");
  check(d, "layout", "No tables or columns", 15, 15, "Set by the template");

  // Dates: Mmm YYYY (or a year, or Present), the same style throughout.
  type Field = { expId: string; field: "start" | "end"; kind: DateKind; value: string; role: string };
  const fields: Field[] = [];
  for (const e of c.experience) {
    if (!e.role.trim() && !e.company.trim() && !e.start.trim() && !e.end.trim()) continue;
    fields.push({ expId: e.id, field: "start", kind: dateKind(e.start), value: e.start, role: e.role.trim() || e.company.trim() || "A job" });
    fields.push({ expId: e.id, field: "end", kind: dateKind(e.end), value: e.end, role: e.role.trim() || e.company.trim() || "A job" });
  }
  if (fields.length) {
    const styles = fields.filter((f) => f.kind === "mmm" || f.kind === "year");
    const mmmCount = styles.filter((f) => f.kind === "mmm").length;
    const majority: DateKind = mmmCount >= styles.length - mmmCount ? "mmm" : "year";
    let good = 0;
    for (const f of fields) {
      const target: ScoreTarget = { tab: "experience", key: `exp:${f.expId}:${f.field}`, expId: f.expId };
      const what = f.field === "start" ? "start date" : "end date";
      if (f.kind === "present" && f.field === "end") { good += 1; continue; }
      if (f.kind === majority) { good += 1; continue; }
      if (f.kind === "empty") {
        d.items.push({ id: `ats.date.${f.expId}.${f.field}`, checkId: "dates", severity: "medium", message: `${f.role} has no ${what}.`, fix: f.field === "end" ? "Add the end date, or “Present” if you still work there." : "Add the start date as Mmm YYYY, e.g. “Mar 2022”.", target });
      } else if (f.kind === "other" || (f.kind === "present" && f.field === "start")) {
        d.items.push({ id: `ats.date.${f.expId}.${f.field}`, checkId: "dates", severity: "medium", message: `${f.role}'s ${what} “${clip(f.value, 20)}” may not be read as a date.`, fix: "Write dates as Mmm YYYY, e.g. “Mar 2022”.", target });
      } else {
        d.items.push({ id: `ats.date.${f.expId}.${f.field}`, checkId: "dates", severity: "low", message: `${f.role}'s ${what} “${clip(f.value, 20)}” doesn't match your other dates.`, fix: majority === "mmm" ? "Use the same Mmm YYYY style everywhere, e.g. “Mar 2022”." : "Use the same style everywhere; Mmm YYYY (“Mar 2022”) reads best.", target });
      }
    }
    check(d, "dates", "Dates as Mmm YYYY, one style", 25 * (good / fields.length), 25, `${good} of ${fields.length} dates`);
  } else {
    check(d, "dates", "Dates as Mmm YYYY, one style", 25, 25, "No dates yet");
  }

  // Contact details a parser can read: a valid email, a phone made of digits.
  const ct = c.contact;
  const problems: ScoreItem["id"][] = [];
  const email = ct.email.trim();
  if (email && !EMAIL_RE.test(email)) {
    problems.push("email");
    d.items.push({ id: "ats.email", checkId: "contact", severity: "high", message: `“${clip(email, 30)}” doesn't look like an email address.`, fix: "Check the spelling: name@example.com, with no spaces.", target: { tab: "details", key: "contact.email" } });
  }
  const phone = (ct.phone ?? "").trim();
  const digits = phone.replace(/\D/g, "").length;
  if (phone && (digits < 7 || digits > 15 || /[^\d\s+().\-x/ext]/i.test(phone))) {
    problems.push("phone");
    d.items.push({ id: "ats.phone", checkId: "contact", severity: "medium", message: `“${clip(phone, 24)}” may not be read as a phone number.`, fix: "Write it with digits only, e.g. (512) 555-0142 or +44 20 7946 0958.", target: { tab: "details", key: "contact.phone" } });
  }
  const name = ct.fullName.trim();
  if (name && /[^\p{L}\p{M}\s.'’-]/u.test(name)) {
    problems.push("name");
    d.items.push({ id: "ats.name", checkId: "contact", severity: "low", message: "Your name has symbols or numbers in it.", fix: "Use letters only; parsers may skip a name with symbols or emoji.", target: { tab: "details", key: "contact.fullName" } });
  }
  check(d, "contact", "Contact details readable", 20 - problems.length * 7, 20, problems.length ? `Check your ${problems.join(" and ")}` : "Readable");

  // Length: about 150–1,100 words fills one to two pages in our templates.
  const lengthPts = wordCount < 150 ? 20 * (wordCount / 150) : wordCount <= 1100 ? 20 : wordCount <= 1400 ? 10 : 0;
  check(d, "length", "1–2 pages long", lengthPts, 20, `${wordCount} words`);
  if (wordCount < 150) {
    d.items.push({ id: "ats.short", checkId: "length", severity: wordCount < 50 ? "medium" : "low", message: `Your resume is ${wordCount} ${wordCount === 1 ? "word" : "words"}, well under a page.`, fix: "Most one-page resumes run 300–600 words. Add bullets to your jobs first.", target: c.experience[0] ? { tab: "experience", key: `exp:${c.experience[0].id}:addBullet`, expId: c.experience[0].id } : { tab: "experience", key: "experience.add" } });
  } else if (wordCount > 1100) {
    d.items.push({ id: "ats.long", checkId: "length", severity: wordCount > 1400 ? "medium" : "low", message: `Your resume is ${wordCount} words, likely over two pages.`, fix: "Cut older jobs to 2–3 bullets and trim the summary.", target: { tab: "experience", key: c.experience[c.experience.length - 1] ? `exp:${c.experience[c.experience.length - 1].id}:role` : "experience.add", expId: c.experience[c.experience.length - 1]?.id } });
  }
  return d;
}

function keywordsCategory(report: KeywordReport): Draft {
  const d: Draft = { checks: [], items: [] };
  const target = 0.8;
  check(d, "coverage", "Job terms you use (80% is full marks)", 100 * Math.min(1, report.share / target), 100, `${report.found} of ${report.total} terms`);
  if (report.share < target) {
    for (const t of report.terms) {
      if (t.present || !t.suggestion) continue;
      d.items.push({
        id: `keywords.${t.key}`, checkId: "coverage", severity: "low",
        message: `The job asks for “${t.term}”${t.count > 1 ? ` (${t.count} times)` : ""}; your resume doesn't mention it.`,
        fix: t.suggestion.text,
        target: t.suggestion.target,
      });
    }
  }
  return d;
}

/* ── Score ────────────────────────────────────────────────────────── */

export function countWords(c: ResumeContent): number {
  const parts = [
    c.contact.fullName, c.contact.email, c.contact.phone, c.contact.location, ...(c.contact.links ?? []),
    c.headline, c.summary,
    ...c.experience.flatMap((e) => [e.role, e.company, e.start, e.end, e.location, ...e.bullets.map((b) => b.text)]),
    ...c.education.flatMap((e) => [e.school, e.degree, e.start, e.end, e.gpa, ...(e.achievements ?? [])]),
    ...(c.certifications ?? []).flatMap((x) => [x.name, x.issuer, x.date]),
    ...(c.achievements ?? []).flatMap((x) => [x.title, x.description, x.date]),
    ...(c.recommendations ?? []).flatMap((x) => [x.recommenderName, x.recommenderRole, x.company, x.text]),
    ...c.skills,
  ];
  return parts.reduce((n, p) => n + words(p).length, 0);
}

const SEVERITY_ORDER: Record<Severity, number> = { high: 0, medium: 1, low: 2 };

/** Scores resume content, optionally against a job description. Pure and deterministic. */
export function scoreResume(content: ResumeContent, opts: { jobDescription?: string } = {}): ResumeScore {
  const c = content;
  const bullets: Flat[] = [];
  for (const e of c.experience) {
    let prev: string | null = null;
    e.bullets.forEach((b, index) => {
      if (!b.text.trim()) return;
      bullets.push({ expId: e.id, bulletId: b.id, text: b.text, role: e.role.trim() || e.company.trim(), index, prevText: prev });
      prev = b.text;
    });
  }

  const chips: Record<string, BulletChip[]> = {};
  for (const b of bullets) {
    const flag = checkBullet(b.text);
    if (flag) chips[b.bulletId] = [{ kind: flag.kind, label: flag.label, hint: flag.hint }];
  }

  const wordCount = countWords(c);
  const jd = (opts.jobDescription ?? "").trim();
  const keywords = jd ? matchKeywords(c, jd) : null;
  // Fewer than 3 terms found means the text wasn't a job description we can use.
  const keywordsApplicable = !!keywords && keywords.total >= 3;

  const drafts: Record<ScoreCategoryId, Draft> = {
    content: contentCategory(c, bullets),
    impact: impactCategory(c, bullets),
    writing: writingCategory(c, bullets, chips),
    ats: atsCategory(c, wordCount),
    keywords: keywordsApplicable ? keywordsCategory(keywords) : { checks: [], items: [] },
  };

  const ids: ScoreCategoryId[] = ["content", "impact", "writing", "ats", "keywords"];
  const applicableWeight = ids.reduce((n, id) => n + (id !== "keywords" || keywordsApplicable ? SCORE_WEIGHTS[id] : 0), 0);

  const categories: ScoreCategory[] = ids.map((id) => {
    const d = drafts[id];
    const max = d.checks.reduce((n, ch) => n + ch.max, 0);
    const earned = d.checks.reduce((n, ch) => n + ch.earned, 0);
    const applicable = id !== "keywords" || keywordsApplicable;
    const note =
      id === "keywords"
        ? keywordsApplicable
          ? `${keywords!.found} of ${keywords!.total} job terms`
          : jd
            ? "Not enough job terms found in that text"
            : "Add a job description to check"
        : (id === "impact" || id === "writing") && !bullets.length
          ? "Add bullets to check this"
          : undefined;
    return { id, label: SCORE_CATEGORY_LABELS[id], weight: SCORE_WEIGHTS[id], score: max ? Math.round((earned / max) * 100) : 0, applicable, checks: d.checks, note };
  });

  const total = Math.round(categories.reduce((n, cat) => n + (cat.applicable ? cat.score * cat.weight : 0), 0) / applicableWeight);

  // Each check's lost points, in total-score points, shared between that check's items.
  const items: ScoreItem[] = [];
  for (const id of ids) {
    const d = drafts[id];
    const cat = categories.find((x) => x.id === id)!;
    if (!cat.applicable) continue;
    const catMax = d.checks.reduce((n, ch) => n + ch.max, 0) || 1;
    for (const ch of d.checks) {
      const mine = d.items.filter((i) => i.checkId === ch.id);
      if (!mine.length) continue;
      const lost = ((ch.max - ch.earned) / catMax) * 100 * (cat.weight / applicableWeight);
      const each = Math.round(lost / mine.length);
      for (const it of mine) {
        const { checkId, ...rest } = it;
        void checkId;
        items.push({ ...rest, category: id, points: each });
      }
    }
  }
  items.sort((a, b) => SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity] || b.points - a.points);

  return { total, band: scoreBand(total), categories, items, bullets: chips, keywords, wordCount };
}
