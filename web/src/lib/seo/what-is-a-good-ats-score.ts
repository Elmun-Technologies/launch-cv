/**
 * Content for the /what-is-a-good-ats-score pillar guide.
 *
 * Every claim about "the" ATS score is really a claim about LaunchCV's own
 * score (lib/resume-score.ts) — the bands, weights and five categories below
 * are copied from that file's comments and types, not invented here. Every
 * vendor-specific statement is copied from lib/seo/ats-vendors.ts, which
 * already cites each vendor's own documentation. This page makes no
 * statistical claims about hiring or rejection rates — it has no source
 * list for those because there isn't a verifiable one. If you add a number,
 * cite a primary source the way lib/seo/resume-length.ts does, or leave it
 * out.
 */

import type { GuideSection } from "@/components/site/seo/guide-page";
import { RESUME_SCORE_BANDS, SCORE_CATEGORY_LABELS, SCORE_WEIGHTS } from "@/lib/resume-score";
import { ATS_VENDORS } from "@/lib/seo/ats-vendors";

export const ATS_SCORE_GUIDE_PUBLISHED = "2026-11-07";
export const ATS_SCORE_GUIDE_UPDATED = "2026-11-07";

/** Band thresholds and category weights, read from the scoring code so this page can't drift from it. */
export const SCORE_BAND_FACTS = [
  `${RESUME_SCORE_BANDS.ready}–100 — “Ready to send.” The checks below are close to fully satisfied.`,
  `${RESUME_SCORE_BANDS.readable}–${RESUME_SCORE_BANDS.ready - 1} — “Readable.” The resume parses, but several checks are losing points.`,
  `Below ${RESUME_SCORE_BANDS.readable} — “At risk.” Enough checks are failing that a parser or a recruiter may lose real information.`,
];

export const QUICK_FACTS = [
  `${RESUME_SCORE_BANDS.ready}+ is LaunchCV's “ready to send” band; ${RESUME_SCORE_BANDS.readable}–${RESUME_SCORE_BANDS.ready - 1} is “readable”; below ${RESUME_SCORE_BANDS.readable} is “at risk”`,
  "There's no industry-standard ATS score — Workday, Greenhouse, iCIMS, Taleo, Lever and SuccessFactors each parse resumes with their own software",
  "LaunchCV's score checks five things: content completeness, impact, writing, ATS format and keywords",
  "It runs in your browser from rule-based checks — no AI, no upload, no network call",
  "It estimates parseability and content quality, not your odds of getting an interview",
];

export type ScoreCategoryRow = { id: keyof typeof SCORE_WEIGHTS; what: string };

/** What each category checks, in the order resume-score.ts scores them. Wording follows that file's own comments. */
export const SCORE_CATEGORY_ROWS: ScoreCategoryRow[] = [
  { id: "content", what: "Contact details, a headline, a 25–120 word summary, at least one job with a title and company, 3+ bullets, education and 6+ skills." },
  { id: "impact", what: "The share of bullets with a number or outcome (60% earns full marks), and bullets that open with a duty phrase instead of an action." },
  { id: "writing", what: "Filler words and clichés, repeated opening verbs, bullets of 8–30 words, one consistent end-punctuation style, and no “I” or “my” in bullets." },
  { id: "ats", what: "Standard section names, dates written as Mmm YYYY in one style, no tables or columns, a readable email and phone, and a length of about one to two pages." },
  { id: "keywords", what: "The share of a job description's terms your resume uses (80% earns full marks) — only scored once you add a job description." },
];

export const SCORE_TABLE: string[][] = SCORE_CATEGORY_ROWS.map((r) => [`${SCORE_CATEGORY_LABELS[r.id]} (${SCORE_WEIGHTS[r.id]})`, r.what]);

export const RAISE_SCORE_CHECKLIST = [
  "Fill in every contact field — full name, email, phone and location — plus a headline and a 25–120 word summary",
  "Add at least one job with a title, a company and 3–5 bullets, plus education and 6 or more skills",
  "Rewrite duty-phrase bullets (“Responsible for…”) as an action and a result; aim for a number or outcome in most of them",
  "Cut filler (“various”, “results-driven”, “utilized”) and vary your opening verbs so bullets don't repeat",
  "Keep bullets to 8–30 words, pick one end-punctuation style, and drop “I” and “my”",
  "Use standard headings (Experience, Education, Skills), one column, and Mmm YYYY dates everywhere",
  "Paste in the job description to score how many of its terms your resume actually uses",
];

/** The six vendors with their own LaunchCV guide (lib/seo/ats-vendors.ts), for the "no universal score" section. */
export const VENDOR_LINKS = ATS_VENDORS.map((v) => ({ slug: v.slug, name: v.fullName, tagline: v.tagline }));

export const ATS_SCORE_GUIDE_SECTIONS: GuideSection[] = [
  {
    id: "good-score",
    title: "What's a good ATS score?",
    body: [
      `On LaunchCV, **${RESUME_SCORE_BANDS.ready} or higher** is a good score: we call that band **“ready to send.”** **${RESUME_SCORE_BANDS.readable}–${RESUME_SCORE_BANDS.ready - 1}** is **“readable”** — your resume will parse, but it's losing points somewhere. **Below ${RESUME_SCORE_BANDS.readable}** is **“at risk”**: enough checks are failing that real information is likely getting lost or ignored.`,
      "That's our score, not a number every ATS or every resume checker agrees on — see the next section. What it means in practice: a score in the 80s means the five checks below are mostly satisfied; a score in the 50s usually means a missing section, bullets with no results, or formatting a parser can trip on.",
    ],
  },
  {
    id: "no-universal-score",
    title: "There's no single, universal \"ATS score\"",
    body: [
      "\"ATS score\" is a term resume checkers use, not a number the applicant tracking systems themselves publish or compute. Workday, Greenhouse, iCIMS, Taleo, Lever and SAP SuccessFactors are six different pieces of software, built by six different companies, and each parses a resume with its own rules.",
      "A few examples, from what each vendor documents:",
      "- **Workday** says parsing results can vary with a resume's format and word order, and its admin guide notes that parsing skips the Skills and Languages sections — you fill those in by hand.\n- **Greenhouse**'s resume parser can't handle files over 2.5 MB, and lists graphics, tables, headers and footers among the common causes of a failed parse.\n- **iCIMS** documentation says its parser most often misses content in text boxes, images, annotations and tables, and that a resume with the name only in the header fails to parse.\n- **Oracle Taleo** says a resume uploaded as an image isn't parsed at all, so it never fills the keyword field recruiters search.\n- **Lever** fills a candidate's location field straight from the parsed resume, and lets recruiters search the parsed text directly.\n- **SAP SuccessFactors** says scanned or image-based PDFs \"won't parse as expected,\" while a PDF exported from a text document parses as designed.",
      "Because of that, the same resume can come out looking strong in one system and incomplete in another — and a score from one checker isn't directly comparable to a score from a different one, since they're not necessarily checking the same things. See our guides to each system for the specifics that matter when you apply.",
    ],
    figure: "vendors",
  },
  {
    id: "what-it-measures",
    title: "What our ATS score actually measures",
    body: [
      "LaunchCV's score runs entirely in your browser — rule-based checks, no AI and no network call — and combines five weighted categories into one 0–100 number:",
    ],
    figure: "categories",
    after: [
      "Keywords only counts once you add a job description; without one, the other four categories are reweighted to fill the full 100 points. That's why your score can change without you editing a single word of your resume — adding or removing a job description changes what's being measured, not just the result.",
    ],
  },
  {
    id: "what-it-does-not-tell-you",
    title: "What the score does and doesn't tell you",
    body: [
      "The score estimates two things: how cleanly a parser can read your resume, and how complete and well-written its content is. It is **not** a prediction of whether you'll get an interview. Employers add their own screening questions, requirements and search terms on top of whatever their applicant tracking system parses, and none of that is something a resume checker can see in advance.",
      "Treat the number as a checklist, not a guarantee: a resume at 85 that's honest and specific is worth more than one pushed to 99 by stuffing in keywords that don't match your real experience.",
    ],
  },
  {
    id: "raise-your-score",
    title: "How to raise your score",
    body: ["Work through these in order — each one maps to a category above:"],
    figure: "checklist",
  },
];

export const ATS_SCORE_GUIDE_FAQS: { q: string; a: string }[] = [
  {
    q: "What is a good ATS score?",
    a: `On LaunchCV, ${RESUME_SCORE_BANDS.ready} or higher is "ready to send." ${RESUME_SCORE_BANDS.readable}–${RESUME_SCORE_BANDS.ready - 1} is "readable" — it'll parse, but it's leaving points on the table. Below ${RESUME_SCORE_BANDS.readable} is "at risk."`,
  },
  {
    q: "Is there one universal ATS score every system uses?",
    a: "No. \"ATS score\" is a term resume checkers use; the applicant tracking systems themselves — Workday, Greenhouse, iCIMS, Taleo, Lever, SuccessFactors — don't publish one shared number. Each parses resumes with its own software and its own rules, so scores from different checkers aren't directly comparable.",
  },
  {
    q: "What does the LaunchCV ATS score measure?",
    a: "Five weighted categories: content completeness (25%), impact — bullets with a number or outcome (25%), writing quality (20%), ATS format — headings, dates, layout (15%), and keyword match against a job description you provide (15%, only when a job description is set). It runs in your browser with rule-based checks; no AI, no upload.",
  },
  {
    q: "Does a high ATS score guarantee an interview?",
    a: "No. It estimates how parseable and complete your resume is, not how an employer will screen or rank you. Employers add their own requirements and search terms on top of whatever their system parses.",
  },
  {
    q: "Why did my score change when I didn't edit my resume?",
    a: "The keywords category only counts when you've added a job description; without one, the other four categories are scaled up to fill the full 100 points. Adding or removing a job description changes what's being measured.",
  },
  {
    q: "Which applicant tracking systems does this cover?",
    a: "We publish a guide for each major system — Workday, Greenhouse, iCIMS, Oracle Taleo, Lever and SAP SuccessFactors — covering what each one parses, what it misses, and what to check before you apply.",
  },
];

export const ATS_SCORE_GUIDE_READING: string[] = ["what-is-an-ats-score", "how-to-write-an-ats-friendly-resume"];
