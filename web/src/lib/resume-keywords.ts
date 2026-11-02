/**
 * Job-description keywords for the editor's "Target a job" panel. Deterministic, no AI:
 *
 *  1. Dictionary terms: the job text is matched against every keyword of the 88 resume
 *     examples (lib/skills-dictionary.ts).
 *  2. Named things the dictionary doesn't know: capitalized multi-word terms that repeat
 *     ("Salesforce Marketing Cloud" twice), tool-shaped words (HubSpot, GA4, SQL) and
 *     capitalized single words that repeat mid-sentence (Terraform, Terraform).
 *
 * Text is compared after lower-casing, folding plurals ("APIs" = "API") and splitting on
 * punctuation ("CI/CD" = "CI CD", "first-contact" = "first contact"). Common English words
 * that are also product names (Go, Word, Canvas, Epic, Spark…) only count when written as
 * the product, capitalized and mid-sentence.
 *
 * Pure: runs in the browser as the person types.
 */
import type { ResumeContent } from "@/types/resume";
import { SKILLS_DICTIONARY } from "@/lib/skills-dictionary";
import type { SkillKind } from "@/lib/skills-dictionary-source";

/** Where an item in the editor lives. `key` matches a `data-score-target` attribute in the editor. */
export type ScoreTarget = {
  tab: "details" | "shortbio" | "experience" | "education" | "skills" | "certifications";
  key: string;
  /** Experience entry to expand before focusing. */
  expId?: string;
};

export type JobTerm = {
  /** As shown on the chip. */
  term: string;
  /** Normalized key (unique within one extraction). */
  key: string;
  kind: SkillKind;
  /** dictionary: a skills-dictionary keyword · phrase: repeated capitalized term · tool: tool-shaped or repeated name. */
  source: "dictionary" | "phrase" | "tool";
  /** Times it appears in the job description. */
  count: number;
  /** Normalized spellings that count as a match. */
  forms: string[];
  /** Case-sensitive spellings (for Go, R, Word…), matched on the raw text instead. */
  exact?: string[];
  /** A job title ("Senior Product Manager"): it belongs in the headline. */
  title?: boolean;
};

export type KeywordPlacement = "skills" | "bullet" | "summary" | "headline" | "certifications";

export type KeywordSuggestion = {
  where: KeywordPlacement;
  /** One sentence: where it fits and why. */
  text: string;
  target: ScoreTarget;
  /** Only tools and hard skills get one-click "Add to skills". Never offered for bullets' text. */
  canAddSkill: boolean;
};

export type KeywordMatch = JobTerm & { present: boolean; suggestion?: KeywordSuggestion };

export type KeywordReport = {
  terms: KeywordMatch[];
  found: number;
  total: number;
  /** found / total, 0–1. */
  share: number;
};

/** Most terms we show; more than this is noise from a long posting. */
const MAX_TERMS = 30;
/** Job text beyond this is ignored (a posting is rarely over 1,500 words). */
const MAX_JD_CHARS = 20_000;

/* ── Normalization ────────────────────────────────────────────────── */

/** Folds plurals: "APIs" → "api", "analyses" stays close enough, "processes" → "process". */
function stem(w: string): string {
  if (w.length <= 3 || /\d/.test(w)) return w;
  if (/ies$/.test(w) && w.length > 4) return `${w.slice(0, -3)}y`;
  if (/sses$/.test(w)) return w.slice(0, -2);
  // "APIs", "KPIs": a short acronym's plural, not "basis" or "analysis".
  if (w.length === 4 && /is$/.test(w)) return w.slice(0, -1);
  if (/(ss|us|is|os)$/.test(w)) return w;
  if (/(sh|ch|x|z)es$/.test(w)) return w.slice(0, -2);
  if (/s$/.test(w)) return w.slice(0, -1);
  return w;
}

/** Lower-cased, punctuation-split, plural-folded tokens. "&" reads as "and". */
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/['’]s\b/g, "")
    .replace(/[^a-z0-9+#&.]+/g, " ")
    .split(" ")
    .map((t) => t.replace(/^[.]+|[.]+$/g, ""))
    .filter(Boolean)
    .map((t) => (t === "&" ? "and" : stem(t)));
}

export function normalizeTerm(text: string): string {
  return tokenize(text).join(" ");
}

/** Words that never make a keyword on their own. */
export const STOP_WORDS = new Set(
  "a an and are as at be been but by can do for from has have if in into is it its of on or our so than that the their them then there these they this to up was we were what when where which who will with within without you your yours yourself able across all also any about after again against am being both each few more most other own same such too very via per etc".split(" "),
);

/** Job-posting boilerplate: words that start or fill headings, not skills. */
const BOILERPLATE = new Set(
  "about apply benefits bonus career careers company compensation description duties employer equal essential experience job join location looking must nice opportunity our perks plus position preferred qualifications remote required requirements responsibilities role salary team us we what who why you your year years day days week weeks month months hour hours full time part benefit insurance dental vision health paid holiday holidays vacation pto culture mission values office hybrid onsite overview summary key skills minimum ideal candidate successful will can work working new please note".split(" "),
);

const MONTHS_DAYS = /^(january|february|march|april|may|june|july|august|september|october|november|december|monday|tuesday|wednesday|thursday|friday|saturday|sunday)$/i;

/** Acronyms that are posting boilerplate, not skills. */
const ACRONYM_STOP = new Set([
  "EEO", "EOE", "USA", "US", "UK", "EU", "PTO", "FAQ", "LLC", "INC", "CEO", "CFO", "CTO", "COO", "VP", "HR", "AM", "PM",
  "ET", "PT", "PST", "EST", "CST", "MST", "ID", "OK", "TBD", "NA", "ASAP", "WFH", "DEI", "ADA", "FTE", "OTE", "USD", "W2",
  "W-2", "II", "III", "IV", "AND", "OR", "THE", "FOR", "NEW", "OUR", "YOU", "WE", "IT", "ALL",
  // US state and territory codes ("Austin, TX").
  ..."AL AK AZ AR CA CO CT DE DC FL GA HI IA ID IL IN KS KY LA MA MD ME MI MN MO MS MT NC ND NE NH NJ NM NV NY OH OK OR PA PR RI SC SD TN TX UT VA VT WA WI WV WY".split(" "),
]);

/** Dictionary terms that are also everyday words: they must appear exactly as written. */
const CASE_SENSITIVE = new Set(["go", "word", "canvas", "spark", "epic", "outlook", "looker", "asana", "era", "closing", "excel", "encompass", "gusto", "workday", "access", "pyxis", "modifier", "appeal"]);
/** …and these also not as the first word of a sentence ("Go above and beyond", "Closing date"). */
const NOT_SENTENCE_START = new Set(["go", "word", "canvas", "spark", "epic", "closing", "encompass", "gusto", "appeal", "modifier", "access"]);

/** Words that make a capitalized phrase a job title. */
const TITLE_WORDS = /\b(manager|engineer|developer|designer|analyst|director|lead|specialist|coordinator|consultant|associate|assistant|officer|administrator|architect|scientist|nurse|accountant|representative|executive|technician|supervisor|strategist|teacher|recruiter|advisor|agent)\b/i;

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Counts whole-token occurrences of `form` in a padded normalized string. */
function countIn(padded: string, form: string): number {
  if (!form) return 0;
  const needle = ` ${form} `;
  let n = 0;
  let at = padded.indexOf(needle);
  while (at !== -1) {
    n += 1;
    at = padded.indexOf(needle, at + needle.length - 1);
  }
  return n;
}

/** Case-sensitive count of `word` in raw text, optionally skipping sentence starts. */
function countExact(raw: string, word: string, notSentenceStart: boolean): number {
  const re = new RegExp(`(?<![A-Za-z0-9])${escapeRe(word)}(?![A-Za-z0-9&+#'’-])`, "g");
  let n = 0;
  for (const m of raw.matchAll(re)) {
    if (notSentenceStart) {
      const before = raw.slice(0, m.index).replace(/[ \t]+$/, "");
      if (!before || /[.!?:;\n•·*\-–—(]$/.test(before)) continue;
    }
    n += 1;
  }
  return n;
}

/* ── Dictionary ───────────────────────────────────────────────────── */

type DictEntry = { term: string; kind: SkillKind; key: string; forms: string[]; exact?: string[]; notStart: boolean; alternatives: boolean };

let dictCache: DictEntry[] | null = null;

function dictionary(): DictEntry[] {
  if (dictCache) return dictCache;
  dictCache = SKILLS_DICTIONARY.map(([term, kind]) => {
    // "Registered Nurse (RN)": both the name and the abbreviation count.
    const paren = term.match(/\(([^)]+)\)/)?.[1];
    const main = term.replace(/\s*\([^)]*\)\s*/g, " ").trim();
    // "Agile / Scrum": either side counts.
    const alternatives = /\s\/\s/.test(main);
    const spellings = [...(alternatives ? main.split(/\s\/\s/) : [main]), ...(paren && normalizeTerm(paren).length >= 2 ? [paren] : [])];
    const forms: string[] = [];
    const exact: string[] = [];
    let notStart = false;
    for (const s of spellings) {
      const f = normalizeTerm(s);
      if (!f) continue;
      if (f.length <= 2 || CASE_SENSITIVE.has(f)) {
        exact.push(s.trim());
        notStart = notStart || NOT_SENTENCE_START.has(f);
      } else forms.push(f);
    }
    return { term, kind, key: normalizeTerm(main), forms, exact: exact.length ? exact : undefined, notStart, alternatives };
  });
  return dictCache;
}

/* ── Extraction ───────────────────────────────────────────────────── */

type Occurrence = { words: string[]; prev: string; next: string; possessive: boolean };

/** Capitalized runs ("Salesforce Marketing Cloud") and single capitalized words, with neighbours. */
function capitalizedRuns(raw: string): { runs: Occurrence[]; singles: Occurrence[] } {
  const runs: Occurrence[] = [];
  const singles: Occurrence[] = [];
  const isCap = (w: string) => /^[A-Z]/.test(w);
  const connector = (w: string) => /^(of|&)$/.test(w);
  const skip = (w: string) => BOILERPLATE.has(w.toLowerCase()) || STOP_WORDS.has(w.toLowerCase()) || connector(w);
  // Sentences, then the comma-separated pieces of each; only a sentence's first piece starts in sentence case.
  for (const sentence of raw.split(/[\n.!?;:•·|()[\]{}"“”]+|\s[-–—]\s/)) {
    sentence.split(",").forEach((piece, pieceIdx) => {
      const pairs = piece
        .split(/[\s/]+/)
        .map((r) => ({ raw: r, w: r.replace(/^[^A-Za-z0-9]+|[^A-Za-z0-9+#]+$/g, "").replace(/['’]s$/, "") }))
        .filter((p) => p.w);
      const words = pairs.map((p) => p.w);
      let i = 0;
      while (i < words.length) {
        if (!isCap(words[i])) { i += 1; continue; }
        let j = i;
        // Extend through capitalized words, allowing "of" or "&" between two of them.
        while (j + 1 < words.length && (isCap(words[j + 1]) || (connector(words[j + 1]) && j + 2 < words.length && isCap(words[j + 2])))) j += 1;
        let start = i;
        // Sentence case: a sentence's first word may be an ordinary word ("Manage Google Ads"),
        // unless the run is three or more words long (a Title Case heading or name).
        if (start === 0 && pieceIdx === 0 && j - i < 2 && !/^[A-Z0-9]{2,}$/.test(words[0]) && !/[a-z][A-Z]/.test(words[0])) start += 1;
        let end = j;
        // Trim boilerplate and connectors from both ends.
        while (start <= end && skip(words[start])) start += 1;
        while (end >= start && skip(words[end])) end -= 1;
        if (start <= end) {
          const occ: Occurrence = {
            words: words.slice(start, end + 1),
            prev: (words[start - 1] ?? "").toLowerCase(),
            next: (words[end + 1] ?? "").toLowerCase(),
            possessive: /['’]s$/.test(pairs[end].raw.replace(/[^A-Za-z'’]+$/, "")),
          };
          // A boilerplate word inside the run ("Benefits Package") disqualifies it.
          if (!occ.words.some((w) => BOILERPLATE.has(w.toLowerCase()))) (occ.words.length >= 2 ? runs : singles).push(occ);
        }
        i = j + 1;
      }
    });
  }
  return { runs, singles };
}

/** Company and place names: "at Acme", "join Acme", "Acme is", "Acme's". */
function looksLikeName(occ: Occurrence): boolean {
  return /^(at|join|about|to|from|near)$/.test(occ.prev) || /^(is|offers|has|was|provides|helps|believes|serves|builds|inc|llc|ltd)$/.test(occ.next) || occ.possessive;
}

function toolShaped(w: string): boolean {
  if (/[a-z][A-Z]/.test(w) && /^[A-Za-z0-9+#.]+$/.test(w)) return true; // HubSpot, eClinicalWorks, GitHub
  if (/^[A-Z][A-Z0-9+#&.]{1,6}$/.test(w) && (w.match(/[A-Z]/g)?.length ?? 0) >= 2) return true; // SQL, AWS, B2B
  if (/^[A-Za-z]+\d+[A-Za-z0-9]*$/.test(w) && /[A-Z]/.test(w)) return true; // GA4, EC2
  return false;
}

/** The terms a job description asks for, most-mentioned first. */
export function extractJobTerms(jobDescription: string): JobTerm[] {
  const raw = jobDescription.slice(0, MAX_JD_CHARS);
  if (raw.trim().length < 20) return [];
  const padded = ` ${tokenize(raw).join(" ")} `;
  const found = new Map<string, JobTerm & { alternatives: boolean }>();

  for (const d of dictionary()) {
    let count = 0;
    for (const f of d.forms) count += countIn(padded, f);
    for (const e of d.exact ?? []) count += countExact(raw, e, d.notStart);
    if (count === 0) continue;
    const prev = found.get(d.key);
    if (prev) { prev.count = Math.max(prev.count, count); continue; }
    found.set(d.key, { term: d.term, key: d.key, kind: d.kind, source: "dictionary", count, forms: d.forms, exact: d.exact, alternatives: d.alternatives });
  }
  // "Agile / Scrum" is dropped when "Agile" or "Scrum" was found on its own.
  for (const [key, t] of found) {
    if (t.alternatives && t.forms.some((f) => f !== key && found.has(f))) found.delete(key);
  }

  const { runs, singles } = capitalizedRuns(raw);
  const named = new Set<string>();
  const tally = (list: Occurrence[]) => {
    const by = new Map<string, { display: string; n: number; words: string[] }>();
    for (const o of list) {
      const key = normalizeTerm(o.words.join(" "));
      if (!key) continue;
      if (looksLikeName(o)) named.add(key);
      const cur = by.get(key);
      if (cur) cur.n += 1;
      else by.set(key, { display: o.words.join(" "), n: 1, words: o.words });
    }
    return by;
  };

  for (const [key, r] of tally(runs)) {
    if (r.n < 2 || named.has(key) || found.has(key)) continue;
    if (key.split(" ").every((w) => STOP_WORDS.has(w) || BOILERPLATE.has(w))) continue;
    if (r.words.some((w) => MONTHS_DAYS.test(w))) continue;
    // A repeated proper name that isn't the company is usually a product or method ("Salesforce Marketing Cloud").
    const title = TITLE_WORDS.test(r.display);
    found.set(key, { term: r.display, key, kind: title ? "hard" : "tool", source: "phrase", count: r.n, forms: [key], title, alternatives: false });
  }

  for (const [key, r] of tally(singles)) {
    const w = r.display;
    if (named.has(key) || found.has(key) || key.length < 2) continue;
    if (ACRONYM_STOP.has(w.toUpperCase()) && !/[a-z]/.test(w)) continue;
    if (MONTHS_DAYS.test(w) || STOP_WORDS.has(key) || BOILERPLATE.has(key)) continue;
    // Tool-shaped words count once; plain capitalized words must repeat mid-sentence.
    if (!toolShaped(w) && (r.n < 2 || w.length < 3)) continue;
    found.set(key, { term: w, key, kind: "tool", source: "tool", count: r.n, forms: [key], alternatives: false });
  }

  // "Salesforce" only ever written as part of "Salesforce Marketing Cloud" is one term, not two.
  for (const [key, t] of found) {
    if (t.source !== "dictionary") continue;
    const inside = [...found.values()].filter((o) => o.source !== "dictionary" && o.key !== key && ` ${o.key} `.includes(` ${key} `));
    if (inside.length && inside.reduce((n, o) => n + o.count, 0) >= t.count) found.delete(key);
  }

  return [...found.values()]
    .map((t): JobTerm => {
      const { alternatives, ...rest } = t;
      void alternatives;
      return rest;
    })
    .sort((a, b) => b.count - a.count || (a.source === "dictionary" ? -1 : 0) - (b.source === "dictionary" ? -1 : 0) || a.term.localeCompare(b.term))
    .slice(0, MAX_TERMS);
}

/* ── Matching against the resume ─────────────────────────────────── */

/** All resume text a recruiter or parser reads, one string. */
export function resumeText(c: ResumeContent): string {
  return [
    c.headline,
    c.summary,
    ...c.experience.flatMap((e) => [e.role, e.company, ...e.bullets.map((b) => b.text)]),
    ...c.education.flatMap((e) => [e.degree, e.school, ...(e.achievements ?? [])]),
    ...(c.certifications ?? []).flatMap((x) => [x.name, x.issuer]),
    ...(c.achievements ?? []).flatMap((x) => [x.title, x.description]),
    c.skills.join(", "),
  ]
    .filter(Boolean)
    .join("\n");
}

/** Content words of a term, plus a short prefix for longer words ("forecast" finds "forecasting"). */
function relatedRoots(term: string): string[] {
  return tokenize(term)
    .filter((w) => w.length >= 4 && !STOP_WORDS.has(w) && !/^(management|skill|experience|ability|knowledge|strong|excellent)$/.test(w))
    .map((w) => (w.length >= 7 ? w.slice(0, 6) : w));
}

function clip(s: string, n = 48): string {
  const t = s.trim();
  return t.length > n ? `${t.slice(0, n - 1).trimEnd()}…` : t;
}

function suggestFor(t: JobTerm, c: ResumeContent): KeywordSuggestion {
  const isSkill = !t.title && (t.kind === "tool" || t.kind === "hard");
  const roots = relatedRoots(t.term);
  let best: { expId: string; bulletId: string; text: string; role: string; hits: number } | null = null;
  if (roots.length) {
    for (const e of c.experience) {
      for (const b of e.bullets) {
        const toks = tokenize(b.text);
        const hits = roots.filter((r) => toks.some((w) => w.startsWith(r))).length;
        if (hits > 0 && (!best || hits > best.hits)) best = { expId: e.id, bulletId: b.id, text: b.text, role: e.role || e.company, hits };
      }
    }
  }
  if (t.kind === "credential") {
    return {
      where: "certifications",
      text: "A licence or certification. If you hold it, list it under Certifications with the issuer.",
      target: { tab: "certifications", key: "certifications.add" },
      canAddSkill: false,
    };
  }
  if (t.title) {
    return {
      where: "headline",
      text: "The job title. If it fits you, use it in your headline.",
      target: { tab: "shortbio", key: "headline" },
      canAddSkill: false,
    };
  }
  if (best) {
    return {
      where: "bullet",
      text: `Your bullet “${clip(best.text)}”${best.role ? ` (${clip(best.role, 30)})` : ""} mentions related work. If you did this, say so there in your own words.`,
      target: { tab: "experience", key: `bullet:${best.bulletId}`, expId: best.expId },
      canAddSkill: isSkill,
    };
  }
  if (isSkill) {
    return {
      where: "skills",
      text: "A skill or tool. If you have it, add it to Skills, and mention where you used it in a bullet.",
      target: { tab: "skills", key: "skills.add" },
      canAddSkill: true,
    };
  }
  return {
    where: "summary",
    text: t.kind === "soft"
      ? "A soft skill. Show it in your summary or a bullet with an example, rather than listing it."
      : "If it describes your work, mention it in your summary.",
    target: { tab: "shortbio", key: "summary" },
    canAddSkill: false,
  };
}

/** Which job terms the resume already uses, and where each missing one could go. */
export function matchKeywords(c: ResumeContent, jobDescription: string): KeywordReport {
  const terms = extractJobTerms(jobDescription);
  const text = resumeText(c);
  const padded = ` ${tokenize(text).join(" ")} `;
  const skillsLower = new Set(c.skills.map((s) => s.trim().toLowerCase()));
  const matches: KeywordMatch[] = terms.map((t) => {
    const present =
      skillsLower.has(t.term.toLowerCase()) ||
      t.forms.some((f) => countIn(padded, f) > 0) ||
      (t.exact ?? []).some((e) => countExact(text, e, false) > 0 || skillsLower.has(e.toLowerCase()));
    return present ? { ...t, present } : { ...t, present, suggestion: suggestFor(t, c) };
  });
  const found = matches.filter((m) => m.present).length;
  return { terms: matches, found, total: matches.length, share: matches.length ? found / matches.length : 0 };
}
