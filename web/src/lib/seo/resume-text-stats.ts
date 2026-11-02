/**
 * Resume text statistics for the free word counter. Pure functions, run in
 * the browser — nothing is sent to a server.
 */

/** Rough capacity of one letter-size page in a one-column layout, 10.5–11 pt. */
export const WORDS_PER_PAGE = 475;
export const LINES_PER_PAGE = 50;
/** Average adult silent-reading speed (words per minute). */
export const READING_WPM = 238;
/** Bullets longer than this usually wrap to three lines. */
export const LONG_BULLET_WORDS = 30;

/** Weak openers, filler and clichés recruiters skim past, with what to do instead. */
export const FILLER_PHRASES: { phrase: string; tip: string; pattern: RegExp }[] = [
  { phrase: "responsible for", tip: "Start with a verb", pattern: /\bresponsible for\b/gi },
  { phrase: "duties included", tip: "Start with a verb", pattern: /\bduties (?:included|include)\b/gi },
  { phrase: "other duties as assigned", tip: "Cut it", pattern: /\b(?:various )?other duties(?: as assigned)?\b/gi },
  { phrase: "tasked with", tip: "Say what you did", pattern: /\btasked with\b/gi },
  { phrase: "in charge of", tip: "Use “led” or “ran”", pattern: /\bin charge of\b/gi },
  { phrase: "worked on", tip: "Name what you built or changed", pattern: /\bworked on\b/gi },
  { phrase: "helped with / assisted with", tip: "Say your part", pattern: /\b(?:helped|assisted) (?:with|in)\b/gi },
  { phrase: "team player", tip: "Show it in a bullet", pattern: /\bteam[- ]player\b/gi },
  { phrase: "hard-working", tip: "Show it with a result", pattern: /\bhard[- ]?working\b/gi },
  { phrase: "detail-oriented", tip: "Show it with a result", pattern: /\bdetail[- ]oriented\b/gi },
  { phrase: "results-driven", tip: "Show the results instead", pattern: /\bresults?[- ](?:driven|oriented)\b/gi },
  { phrase: "self-starter", tip: "Show something you started", pattern: /\bself[- ]starter\b/gi },
  { phrase: "go-getter", tip: "Cut it", pattern: /\bgo[- ]getter\b/gi },
  { phrase: "highly motivated", tip: "Cut it", pattern: /\bhighly motivated\b/gi },
  { phrase: "strong work ethic", tip: "Show it in a bullet", pattern: /\bstrong work ethic\b/gi },
  { phrase: "excellent communication skills", tip: "Show it in a bullet", pattern: /\b(?:excellent|strong|great) (?:verbal and written |written and verbal |interpersonal and )?communication skills\b/gi },
  { phrase: "proven track record", tip: "Give the record itself", pattern: /\bproven track record\b/gi },
  { phrase: "think outside the box", tip: "Name the idea", pattern: /\b(?:think(?:ing)?|thinker) outside (?:of )?the box\b/gi },
  { phrase: "fast learner", tip: "Show something you picked up", pattern: /\b(?:fast|quick) learner\b/gi },
  { phrase: "passionate about", tip: "Show what you did about it", pattern: /\bpassionate (?:about|for)\b/gi },
  { phrase: "dynamic", tip: "Cut it if it describes you", pattern: /\bdynamic\b/gi },
  { phrase: "synergy", tip: "Say who worked with whom", pattern: /\bsynerg(?:y|ies|ize|ized)\b/gi },
  { phrase: "wear many hats", tip: "List the hats", pattern: /\b(?:wear|wore|wearing) many hats\b/gi },
  { phrase: "utilized", tip: "Use “used”", pattern: /\butiliz(?:e|ed|es|ing)\b/gi },
  { phrase: "successfully", tip: "Cut it — the result says it", pattern: /\bsuccessfully\b/gi },
  { phrase: "on a daily basis", tip: "Use “daily”", pattern: /\bon a (?:daily|weekly|monthly|regular) basis\b/gi },
  { phrase: "references available upon request", tip: "Cut it", pattern: /\breferences (?:are )?available (?:upon|on) request\b/gi },
];

/** Common words that don't count as "repeated" (articles, pronouns, resume glue). */
const STOP = new Set(
  (
    "a an the and or but nor of to in on at by for with from as into over under per via is are was were be been being am " +
    "it its this that these those their there they them he she his her we our you your i me my mine us who whom which what when where why how " +
    "not no yes so than then too very can could will would should may might must do does did done have has had having " +
    "all any each every both few more most other some such only own same also just about up down out off again further once " +
    "here new etc inc llc co ltd com www http https"
  ).split(" "),
);

const BULLET_RE = /^\s*(?:[•●○◦▪▫■□‣⁃∙·➢➤►▶✓✔\-–—*+]|\d{1,2}[.)])\s+/;
const WORD_RE = /[A-Za-z0-9][A-Za-z0-9'’.\-+#/&]*/g;

function words(s: string): string[] {
  return (s.match(WORD_RE) ?? []).map((w) => w.replace(/[.\-'’/&]+$/, "")).filter((w) => /[A-Za-z0-9]/.test(w));
}

export type TextStats = {
  words: number;
  characters: number;
  charactersNoSpaces: number;
  lines: number;
  bullets: number;
  avgBulletWords: number;
  longBullets: number;
  pages: number;
  readingSeconds: number;
  repeated: { word: string; count: number }[];
  filler: { phrase: string; tip: string; count: number }[];
  fillerTotal: number;
};

export function analyzeResumeText(text: string): TextStats {
  const all = words(text);
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const bulletLines = lines.filter((l) => BULLET_RE.test(l));
  const bulletWordCounts = bulletLines.map((l) => words(l.replace(BULLET_RE, "")).length);
  const bulletWords = bulletWordCounts.reduce((a, b) => a + b, 0);

  const freq = new Map<string, number>();
  for (const w of all) {
    const k = w.toLowerCase().replace(/[’']s$/, "");
    if (k.length < 3 || STOP.has(k) || /^\d+$/.test(k)) continue;
    freq.set(k, (freq.get(k) ?? 0) + 1);
  }
  const repeated = [...freq.entries()]
    .filter(([, c]) => c >= 3)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 8)
    .map(([word, count]) => ({ word, count }));

  const filler = FILLER_PHRASES.map((f) => ({ phrase: f.phrase, tip: f.tip, count: (text.match(f.pattern) ?? []).length }))
    .filter((f) => f.count > 0)
    .sort((a, b) => b.count - a.count);

  const pagesRaw = Math.max(all.length / WORDS_PER_PAGE, lines.length / LINES_PER_PAGE);

  return {
    words: all.length,
    characters: text.length,
    charactersNoSpaces: text.replace(/\s/g, "").length,
    lines: lines.length,
    bullets: bulletLines.length,
    avgBulletWords: bulletLines.length ? Math.round(bulletWords / bulletLines.length) : 0,
    longBullets: bulletWordCounts.filter((n) => n > LONG_BULLET_WORDS).length,
    pages: all.length === 0 ? 0 : Math.max(0.1, Math.round(pagesRaw * 10) / 10),
    readingSeconds: Math.round((all.length / READING_WPM) * 60),
    repeated,
    filler,
    fillerTotal: filler.reduce((a, f) => a + f.count, 0),
  };
}

/** Plain-English verdict on length for the "Words" tile. */
export function wordVerdict(n: number): string {
  if (n === 0) return "Paste your resume";
  if (n < WORDS_PER_PAGE / 2) return "Short — room for detail";
  if (n <= WORDS_PER_PAGE * 1.1) return "About 1 page of text";
  if (n <= WORDS_PER_PAGE * 2.1) return "About 2 pages of text";
  return "Long — trim to 2 pages";
}

export function pageVerdict(p: number): string {
  if (p === 0) return "—";
  if (p <= 1) return "Fits on 1 page";
  if (p <= 2) return "OK if you have 10+ years";
  return "Aim for 2 or fewer";
}

export function formatReading(sec: number): string {
  if (sec <= 0) return "0 sec";
  if (sec < 60) return `${sec} sec`;
  // Short enough for a small tile at 360px: "2.5 min".
  return `${Math.round((sec / 60) * 10) / 10} min`;
}
