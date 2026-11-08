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
  /** dictionary: a skills-dictionary keyword · phrase: repeated capitalized term (or, in the scanner, a repeated lower-case phrase) · tool: tool-shaped or repeated name. */
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

/** The terms a job description asks for, most-mentioned first (at most 30). */
export function extractJobTerms(jobDescription: string): JobTerm[] {
  return allJobTerms(jobDescription).slice(0, MAX_TERMS);
}

/** Every term found, most-mentioned first, uncapped. */
function allJobTerms(jobDescription: string): JobTerm[] {
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
    .sort((a, b) => b.count - a.count || (a.source === "dictionary" ? -1 : 0) - (b.source === "dictionary" ? -1 : 0) || a.term.localeCompare(b.term));
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

/* ── Job description scanner (the free /tools page) ──────────────── */

/*
 * The free keyword scanner ranks the same terms by where they appear, not only how often:
 * a term under "Requirements" outweighs one under "Benefits", and a term in the job title
 * outweighs both. It also picks up repeated lower-case phrases ("data pipelines" twice) that
 * the dictionary and the capitalized-name pass miss. The editor's panel is unchanged.
 */

/** What part of the posting a line belongs to. */
export type JdSection = "required" | "preferred" | "duties" | "general" | "company";

export type ScannedTerm = JobTerm & {
  /** required: in a requirements section or a "must" line · preferred: only in "nice to have" lines (and the company blurb) · mentioned: anywhere else. */
  priority: "required" | "preferred" | "mentioned";
  /** In the posting's first line (usually the job title). */
  inTitle: boolean;
  /** Ranking weight: mentions weighted by section, plus the title bonus. */
  score: number;
  /** Only set when resume text was given. */
  present?: boolean;
};

export type JdScan = {
  terms: ScannedTerm[];
  /** True when headings such as "Requirements" or "Nice to have" were recognized. */
  hasSections: boolean;
  /** Only when resume text was given. */
  resume: { found: number; total: number } | null;
};

/** Most terms the scanner lists. */
const MAX_SCAN_TERMS = 40;
/** Most repeated lower-case phrases added on top of the extracted terms. */
const MAX_PHRASES = 10;

const SECTION_WEIGHT: Record<JdSection, number> = { required: 3, duties: 2, general: 2, preferred: 1.5, company: 0.5 };
const TITLE_BONUS = 4;

const HEADING_PREFERRED = /\b(preferred|nice[\s-]to[\s-]haves?|bonus points?|pluses|a plus|desired|good to have|ideally|extra credit)\b/i;
const HEADING_REQUIRED = /\b(requirements?|required|must[\s-]haves?|minimum|basic qualifications|qualifications|what you['’]?ll need|what you need|what you bring|what we['’]?re looking for|who you are|about you|you have|skills|competencies)\b/i;
const HEADING_DUTIES = /\b(responsibilit(y|ies)|what you['’]?ll do|what you will do|duties|day[\s-]to[\s-]day|in this role|the role|your role|you will|the job|key tasks|the opportunity)\b/i;
const HEADING_COMPANY = /\b(about|who we are|benefits|perks|compensation|salary|pay range|why (join|work)|equal (opportunity|employment)|eeo|our (culture|mission|values|story)|location|how to apply|what we offer)\b/i;

const LINE_PREFERRED = /\b(preferred|nice[\s-]to[\s-]have|(is|are|would be) a (big )?plus|bonus|desired|ideally)\b/i;
const LINE_REQUIRED = /\b(required|must|mandatory|minimum of|at least)\b/i;

function headingSection(h: string): JdSection | null {
  if (HEADING_PREFERRED.test(h)) return "preferred";
  if (HEADING_REQUIRED.test(h)) return "required";
  if (HEADING_DUTIES.test(h)) return "duties";
  if (HEADING_COMPANY.test(h)) return "company";
  return null;
}

/** A heading's text if the line is one ("Requirements:", "## What you'll do", "Nice to have"), else null. */
function headingText(line: string): { heading: string; rest: string } | null {
  const t = line.replace(/^[#*_\s]+|[*_\s]+$/g, "");
  if (!t || /^[-•·▪●◦*–]|^\d+[.)]\s/.test(line.trim())) return null;
  const colon = t.match(/^([^:]{2,60}):\s*(.*)$/);
  if (colon && colon[1].split(/\s+/).length <= 6) return { heading: colon[1], rest: colon[2] };
  if (t.split(/\s+/).length <= 6 && !/[.!?,]$/.test(t) && headingSection(t)) return { heading: t, rest: "" };
  return null;
}

type JdLine = { text: string; section: JdSection; title: boolean };

/** The posting split into lines, each tagged with its section. */
function jdLines(raw: string): { lines: JdLine[]; hasSections: boolean } {
  const lines: JdLine[] = [];
  let section: JdSection = "general";
  let hasSections = false;
  let seenText = false;
  for (const line of raw.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const h = headingText(line);
    const hs = h ? headingSection(h.heading) : null;
    if (h && hs) {
      section = hs;
      hasSections = true;
      seenText = true;
      if (h.rest) lines.push({ text: h.rest, section: lineSection(h.rest, section), title: false });
      continue;
    }
    // The first line is the job title when it's short and reads like one.
    const title = !seenText && line.trim().split(/\s+/).length <= 12 && !/[.!?]$/.test(line.trim());
    seenText = true;
    // Sentence by sentence, so "ACLS is preferred" in a paragraph doesn't make the whole paragraph preferred.
    for (const sentence of line.split(/(?<=[.!?;])\s+/)) lines.push({ text: sentence, section: lineSection(sentence, section), title });
  }
  return { lines, hasSections };
}

/** "Senior Data Analyst" from a first line like "Senior Data Analyst – Remote (US)", if it names a job. */
function titleTerm(raw: string, taken: Set<string>): JobTerm | null {
  const first = raw.split(/\r?\n/).find((l) => l.trim())?.trim() ?? "";
  if (!first || first.split(/\s+/).length > 12 || /[.!?]$/.test(first) || headingText(first)) return null;
  const name = first.split(/\s[-–—|]\s|[,(]/)[0].replace(/^[#*_\s]+|[*_\s]+$/g, "").trim();
  const key = normalizeTerm(name);
  if (!key || !TITLE_WORDS.test(name) || name.split(/\s+/).length > 6 || taken.has(key)) return null;
  return { term: name, key, kind: "hard", source: "phrase", count: 1, forms: [key], title: true };
}

/** "Python is a plus" is preferred and "must have SQL" required, whatever the heading says. */
function lineSection(line: string, section: JdSection): JdSection {
  if (section === "company") return section;
  if (LINE_PREFERRED.test(line)) return "preferred";
  if (LINE_REQUIRED.test(line)) return "required";
  return section;
}

/** Times a term appears: normalized forms by whole token, case-sensitive spellings as written. */
function countTerm(t: Pick<JobTerm, "forms" | "exact">, raw: string, padded: string, sentenceAware: boolean): number {
  let n = 0;
  for (const f of t.forms) n += countIn(padded, f);
  for (const e of t.exact ?? []) n += countExact(raw, e, sentenceAware && NOT_SENTENCE_START.has(normalizeTerm(e)));
  return n;
}

/** Whether free text (a pasted resume) uses a term. */
export function termInText(t: Pick<JobTerm, "forms" | "exact">, text: string): boolean {
  return countTerm(t, text, ` ${tokenize(text).join(" ")} `, false) > 0;
}

/** Everyday words that don't make a phrase a skill ("strong communication", "work closely"). */
const PHRASE_GENERIC = new Set(
  "ability abilities strong excellent good great proven demonstrated solid deep high highly well related relevant similar including include includes using use used other others various multiple ensure help helps make makes made build builds building drive drives driving own owns owning work works worked closely support supports supporting manage manages managing lead leads leading partner partners partnering develop develops developing create creates creating provide provides providing maintain maintains maintaining identify identifies improve improves improving deliver delivers delivering based level levels fast paced environment environments best least degree field equivalent written verbal one two three four five first every need needs needed like looking want wants ideal plus preferred required strongly comfortable familiar familiarity understanding knowledge proficiency proficient hands passion passionate love eager self motivated starter detail oriented attention ownership take takes get gets keep keeps grow grows growing growth quickly amazing exciting world class top join remote hybrid onsite people person things thing way ways part along around through over under just only really much many lot lots".split(" "),
);

/** Lower-case two- and three-word phrases that repeat ("data pipelines", "customer onboarding flows"). */
function repeatedPhrases(raw: string, taken: string[]): JobTerm[] {
  const ok = (w: string) => {
    const l = w.toLowerCase();
    return /^[a-z][a-z-]{2,}$/i.test(w) && !STOP_WORDS.has(l) && !BOILERPLATE.has(l) && !PHRASE_GENERIC.has(l) && !MONTHS_DAYS.test(w);
  };
  const by = new Map<string, { display: string; n: number; len: number }>();
  for (const seg of raw.split(/[\n.!?;:,()[\]{}"“”•·|/]+|\s[-–—]\s/)) {
    const words = seg.split(/\s+/).map((w) => w.replace(/^[^A-Za-z]+|[^A-Za-z]+$/g, "").replace(/['’]s$/, "")).filter(Boolean);
    for (let i = 0; i < words.length; i += 1) {
      for (const len of [3, 2]) {
        const gram = words.slice(i, i + len);
        if (gram.length < len || !gram.every(ok)) continue;
        // Lower case only (a sentence may start with a capital): capitalized names are the other pass's job.
        if (gram.some((w, k) => /[A-Z]/.test(k === 0 && i === 0 ? w.slice(1) : w))) continue;
        const key = normalizeTerm(gram.join(" "));
        const cur = by.get(key);
        if (cur) cur.n += 1;
        else by.set(key, { display: gram.join(" "), n: 1, len });
      }
    }
  }
  const overlaps = (a: string, b: string) => ` ${a} `.includes(` ${b} `) || ` ${b} `.includes(` ${a} `);
  const kept: JobTerm[] = [];
  // Three-word phrases first; a two-word phrase inside one only counts for its extra mentions.
  const candidates = [...by.entries()].filter(([, v]) => v.n >= 2).sort((a, b) => b[1].len - a[1].len || b[1].n - a[1].n);
  for (const [key, v] of candidates) {
    if (taken.some((k) => overlaps(k, key))) continue;
    const inside = kept.filter((k) => ` ${k.key} `.includes(` ${key} `)).reduce((n, k) => n + k.count, 0);
    if (v.n - inside < 2) continue;
    const term = /[A-Z]/.test(v.display.slice(1)) ? v.display : v.display.charAt(0).toUpperCase() + v.display.slice(1).toLowerCase();
    kept.push({ term, key, kind: "hard", source: "phrase", count: v.n, forms: [key] });
  }
  return kept.sort((a, b) => b.count - a.count).slice(0, MAX_PHRASES);
}

/**
 * Capitalized names written once, mid-sentence, in a requirements or nice-to-have line
 * ("HubSpot or Marketo experience"): in those lists a lone proper noun is nearly always a
 * tool. Skipped when the word is also written in lower case, or appears in the company blurb.
 */
function listedNames(lines: JdLine[], raw: string, taken: Set<string>): JobTerm[] {
  const spaced = ` ${raw.replace(/[^A-Za-z0-9+#]+/g, " ")} `;
  const companyText = lines.filter((l) => l.section === "company").map((l) => l.text).join(" ");
  const out = new Map<string, JobTerm>();
  for (const l of lines) {
    if (l.section !== "required" && l.section !== "preferred") continue;
    for (const o of capitalizedRuns(l.text).singles) {
      const w = o.words[0];
      const key = normalizeTerm(w);
      if (!key || key.length < 3 || taken.has(key) || out.has(key) || looksLikeName(o)) continue;
      if (ACRONYM_STOP.has(w.toUpperCase()) || MONTHS_DAYS.test(w) || STOP_WORDS.has(key) || BOILERPLATE.has(key) || PHRASE_GENERIC.has(key) || TITLE_WORDS.test(w)) continue;
      if (spaced.includes(` ${w.toLowerCase()} `) || companyText.includes(w)) continue;
      out.set(key, { term: w, key, kind: "tool", source: "tool", count: 1, forms: [key] });
    }
  }
  return [...out.values()];
}

/**
 * Scans a pasted job description: every term it asks for, ranked by mentions weighted by
 * section (requirements > duties > nice-to-have > company blurb) plus the job title. With
 * resume text, each term is marked present or missing. Pure; runs in the browser.
 */
export function scanJobDescription(jobDescription: string, resume?: string): JdScan {
  const raw = jobDescription.slice(0, MAX_JD_CHARS);
  const base = allJobTerms(raw);
  if (!base.length) return { terms: [], hasSections: false, resume: null };
  const { lines, hasSections } = jdLines(raw);
  const title = titleTerm(raw, new Set(base.map((t) => t.key)));
  const named = [...(title ? [title] : []), ...base];
  const withNames = [...named, ...listedNames(lines, raw, new Set(named.map((t) => t.key)))];
  const terms = [...withNames, ...repeatedPhrases(raw, withNames.map((t) => t.key))]
    // "Strong, Strong" written capitalized twice is still not a skill.
    .filter((t) => t.source === "dictionary" || !t.key.split(" ").every((w) => PHRASE_GENERIC.has(w)));
  const padded = lines.map((l) => ` ${tokenize(l.text).join(" ")} `);
  const resumeRaw = resume?.trim() ? resume.slice(0, MAX_JD_CHARS) : "";
  const resumePadded = ` ${tokenize(resumeRaw).join(" ")} `;

  const scanned = terms.map((t): ScannedTerm => {
    let score = 0;
    let mentions = 0;
    let inTitle = false;
    const seen = new Set<JdSection>();
    lines.forEach((l, i) => {
      const n = countTerm(t, l.text, padded[i], true);
      if (!n) return;
      mentions += n;
      score += n * SECTION_WEIGHT[l.section];
      seen.add(l.section);
      if (l.title) inTitle = true;
    });
    // Mentions the line pass can't see (a phrase split over a line break) count at the neutral weight.
    if (mentions < t.count) score += (t.count - mentions) * SECTION_WEIGHT.general;
    if (inTitle) score += TITLE_BONUS;
    const priority = seen.has("required") ? "required" : seen.has("preferred") && !seen.has("duties") && !seen.has("general") ? "preferred" : "mentioned";
    const out: ScannedTerm = { ...t, count: Math.max(mentions, t.count), priority, inTitle, score };
    if (resumeRaw) out.present = countTerm(t, resumeRaw, resumePadded, false) > 0;
    return out;
  });

  const ranked = scanned.sort((a, b) => b.score - a.score || b.count - a.count || a.term.localeCompare(b.term)).slice(0, MAX_SCAN_TERMS);
  return { terms: ranked, hasSections, resume: resumeRaw ? { found: ranked.filter((t) => t.present).length, total: ranked.length } : null };
}
