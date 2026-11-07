/**
 * Resume keyword pages (/resume-keywords and /resume-keywords/[role]).
 *
 * The keywords themselves come from each role's resume example
 * (lib/resume-examples.ts). This file only sorts them into groups and works
 * out where the sample resume and the bullet examples already use them. A
 * keyword not listed under tools, credentials or soft skills is a hard skill.
 * Nothing here invents new keywords or statistics.
 */
import { RESUME_EXAMPLES, getResumeExample, type ExampleJob, type ResumeExample } from "@/lib/resume-examples";
import { fitTitle } from "@/lib/build-metadata";
import { withArticle } from "@/lib/article";

export const KEYWORDS_UPDATED = "2026-11-02";

export type KeywordGroupId = "hard" | "tools" | "credentials" | "soft";

export const GROUP_LABEL: Record<KeywordGroupId, string> = {
  hard: "Hard skills",
  tools: "Tools & software",
  credentials: "Licenses & certifications",
  soft: "Soft skills",
};

type Sorting = { tools?: string[]; credentials?: string[]; soft?: string[] };

/** Keyed by resume example slug. Strings must match the example's keywords exactly. */
const SORTING: Record<string, Sorting> = {
  "software-engineer": { tools: ["React", "Node.js", "PostgreSQL", "AWS", "Docker", "Kubernetes", "Git"] },
  "product-manager": { tools: ["Jira", "Amplitude", "Figma"], soft: ["Stakeholder management"] },
  "data-analyst": { tools: ["Excel", "Tableau", "Power BI", "Looker", "dbt", "Snowflake", "BigQuery"] },
  "marketing-manager": { tools: ["HubSpot", "Salesforce", "Google Analytics"] },
  "financial-analyst": { tools: ["Excel", "Power BI", "NetSuite", "SAP"] },
  "ux-designer": { tools: ["Figma"] },
  "customer-service-representative": { tools: ["Zendesk", "Salesforce", "Freshdesk", "CRM"], soft: ["Conflict resolution", "De-escalation"] },
  "hr-generalist": { tools: ["HRIS", "Workday", "BambooHR", "ADP"], credentials: ["SHRM"] },
  "registered-nurse": { tools: ["Epic", "Cerner"], credentials: ["Registered Nurse (RN)", "BSN", "RN license", "BLS", "ACLS"] },
  teacher: { tools: ["Google Classroom", "Canvas"], credentials: ["Teaching license"], soft: ["Parent communication"] },
  "sales-representative": { tools: ["Salesforce", "HubSpot", "CRM"], soft: ["Negotiation"] },
  "project-manager": { tools: ["MS Project", "Jira", "Smartsheet", "Asana"], credentials: ["PMP"], soft: ["Stakeholder management"] },
  accountant: { tools: ["NetSuite", "QuickBooks", "SAP", "Excel"], credentials: ["CPA"] },
  "data-scientist": { tools: ["scikit-learn", "TensorFlow", "PyTorch", "XGBoost", "Spark", "MLflow", "AWS"] },
  "business-analyst": { tools: ["Power BI", "Tableau", "Visio", "Jira"], credentials: ["CBAP"], soft: ["Stakeholder management"] },
  "administrative-assistant": {
    tools: ["Microsoft Office", "Microsoft 365", "Outlook", "Excel", "Word", "PowerPoint", "Google Workspace"],
    soft: ["Confidentiality"],
  },
};

export type KeywordItem = { term: string; inSample: boolean };
export type KeywordGroup = { id: KeywordGroupId; label: string; items: KeywordItem[] };

const ORDER: KeywordGroupId[] = ["hard", "tools", "credentials", "soft"];

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Whole-word match. Short terms ("R", "Go", "SQL", "CPA") match case-sensitively
 * so that "go" or "r" in ordinary prose doesn't count; longer terms ignore case.
 */
export function mentions(text: string, term: string): boolean {
  const flags = term.length <= 3 ? "" : "i";
  return new RegExp(`(^|[^A-Za-z0-9])${escapeRe(term)}(?![A-Za-z0-9])`, flags).test(text);
}

/** Every line of the sample resume, as one string. */
export function sampleResumeText(e: ResumeExample): string {
  const r = e.resume;
  return [r.headline, r.summary, ...r.jobs.flatMap((j) => [j.title, ...j.bullets]), r.education, r.skills.join(" · ")].join("\n");
}

export function keywordGroups(e: ResumeExample): KeywordGroup[] {
  const s = SORTING[e.slug] ?? e.keywordSort ?? {};
  const text = sampleResumeText(e);
  const groupOf = (k: string): KeywordGroupId =>
    s.credentials?.includes(k) ? "credentials" : s.tools?.includes(k) ? "tools" : s.soft?.includes(k) ? "soft" : "hard";
  return ORDER.map((id) => ({
    id,
    label: GROUP_LABEL[id],
    items: e.keywords.filter((k) => groupOf(k) === id).map((term) => ({ term, inSample: mentions(text, term) })),
  })).filter((g) => g.items.length > 0);
}

export function keywordStats(e: ResumeExample) {
  const groups = keywordGroups(e);
  const inSample = groups.reduce((n, g) => n + g.items.filter((i) => i.inSample).length, 0);
  return { groups, total: e.keywords.length, inSample };
}

/** Keywords from the role's list that appear in a piece of text, in list order. */
export function keywordsIn(e: ResumeExample, text: string): string[] {
  return e.keywords.filter((k) => mentions(text, k));
}

export type ContextRow = {
  /** Keyword(s) the row is about, or the bullet example's skill label. */
  label: string;
  weak: string;
  strong: string;
  /** Keywords from the role's list that the strong version uses (for highlighting). */
  used: string[];
};

/**
 * "Put keywords in bullets" rows. First, bullets from the sample resume that
 * already use a keyword (weak = the keyword only in a skills list). When the
 * sample has fewer than three of those, the role's before/after bullet
 * examples fill the table up to four rows.
 */
export function contextRows(e: ResumeExample, max = 4): ContextRow[] {
  const fromSample: ContextRow[] = e.resume.jobs
    .flatMap((j) => j.bullets)
    .map((b) => ({ b, used: keywordsIn(e, b) }))
    .filter((x) => x.used.length > 0)
    .map(({ b, used }) => ({ label: used.join(", "), weak: `Skills: ${used.join(", ")}`, strong: b, used }));
  // Each row has to add a keyword not shown yet, so two Kubernetes bullets don't both show.
  const covered = new Set<string>();
  const rows: ContextRow[] = [];
  for (const r of fromSample) {
    if (rows.length >= max) break;
    if (r.used.every((k) => covered.has(k.toLowerCase()))) continue;
    r.used.forEach((k) => covered.add(k.toLowerCase()));
    rows.push(r);
  }
  if (rows.length >= 3) return rows;
  for (const b of e.bullets) {
    if (rows.length >= max) break;
    if (covered.has(b.skill.toLowerCase())) continue;
    covered.add(b.skill.toLowerCase());
    rows.push({ label: b.skill, weak: b.weak, strong: b.strong, used: keywordsIn(e, b.strong) });
  }
  return rows;
}

/** Short keywords for the decorative hero panel (long ones would crowd it). */
export function heroKeywords(e: ResumeExample, n = 7): string[] {
  return e.keywords.filter((k) => k.length <= 22).slice(0, n);
}

/** Roles that have a keyword page (all resume examples). */
export const KEYWORD_ROLES = RESUME_EXAMPLES;
export const getKeywordRole = getResumeExample;

/** "HR Generalist" → "HR generalist": lowercases words but keeps acronyms. */
export function roleLower(role: string): string {
  return role.replace(/\b[A-Z][a-z]+\b/g, (w) => w.toLowerCase());
}

/** Short role name for headings: "PM", "RN", else the lowercased role. */
const ROLE_SHORT: Record<string, string> = {
  "product-manager": "PM",
  "registered-nurse": "RN",
  "project-manager": "PM",
  "hr-generalist": "HR generalist",
  "ux-designer": "UX designer",
};
export function roleShort(e: ResumeExample): string {
  return ROLE_SHORT[e.slug] ?? roleLower(e.role);
}

/** Natural-language list: "a, b and c". */
export function listJoin(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

// "{role} resume skills" outsearches "{role} resume keywords" by about 16x
// (Keyword Planner, Nov 2026) — same page, title retargeted to the bigger term.
export function keywordPageTitle(e: ResumeExample): string {
  return fitTitle(
    `${e.role} Resume Skills (2026 List)`,
    `${e.role} Resume Skills (2026)`,
    `${e.role} Resume Skills`,
    `${e.role} Resume Keywords`,
  );
}

/** 120–160 characters for every role (checked when the data changes). */
export function keywordPageDescription(e: ResumeExample): string {
  const SHORT: Record<KeywordGroupId, string> = { hard: "skills", tools: "tools", credentials: "certifications", soft: "soft skills" };
  const groups = listJoin(keywordGroups(e).map((g) => SHORT[g.id]));
  const n = e.keywords.length;
  const role = roleLower(e.role);
  const [k1, k2, k3] = e.keywords;
  const candidates = [
    `${n} ${role} resume keywords like ${k1}, ${k2} and ${k3}, sorted into ${groups}, with tips on using them honestly to get past ATS screening.`,
    `${n} ${role} resume keywords like ${k1}, ${k2} and ${k3}, plus how to use them honestly in bullets so ATS software and recruiters find them.`,
    `${n} ${role} resume keywords like ${k1} and ${k2}, plus how to use them honestly in bullets so ATS software and recruiters find them.`,
    `${n} ${role} resume keywords, sorted into ${groups}, plus how to use them honestly in bullets so ATS software and recruiters find them.`,
    `${n} ${role} resume keywords, sorted by type, plus how to use them honestly in your bullets so ATS software and recruiters can find them.`,
  ];
  return candidates.find((c) => c.length >= 120 && c.length <= 160) ?? candidates[candidates.length - 1];
}

/** Rules for honest keyword use, shared by the index and every role page. */
export const HONEST_RULES: { t: string; d: string }[] = [
  {
    t: "Mirror the job post's wording",
    d: "If the post says a skill one way, write it that way too, as long as it's accurate. Recruiters often search for the exact term.",
  },
  {
    t: "Only claim what you can back up",
    d: "Every keyword on your resume is fair game in an interview. If you couldn't talk about it for two minutes, leave it out.",
  },
  {
    t: "Show it in a bullet",
    d: "A skills list says you have it; a bullet shows what you did with it and what changed. Use both.",
  },
  {
    t: "No stuffing, no hidden text",
    d: "Repeating a word or hiding keywords in white text doesn't make you a better match. A person reads the resume in the end.",
  },
];

/** Role-specific FAQ, built from the role's own data. Rendered on the page and in FAQPage JSON-LD. */
/** Where this role's keywords sit in its own sample resume: summary terms, and one bullet that uses a term. */
function sampleUse(e: ResumeExample): { summary: string[]; bullet: { term: string; job: ExampleJob } | null } {
  const summary = keywordsIn(e, e.resume.summary).slice(0, 3);
  for (const job of e.resume.jobs) {
    for (const b of job.bullets) {
      const term = keywordsIn(e, b).find((k) => !summary.includes(k));
      if (term) return { summary, bullet: { term, job } };
    }
  }
  return { summary, bullet: null };
}

/**
 * HONEST_RULES with this role's own terms in them, so each role page explains
 * the rules with its own keywords rather than repeating the same paragraph.
 */
export function honestRulesFor(e: ResumeExample): { t: string; d: string }[] {
  const role = roleLower(e.role);
  const groups = keywordGroups(e);
  const hard = groups.find((g) => g.id === "hard")?.items.map((i) => i.term) ?? [];
  const tool = groups.find((g) => g.id === "tools")?.items[0]?.term;
  // The FAQ on the same page uses keywords[0]; the rule uses the next term so the two don't repeat.
  const k1 = e.keywords[1] ?? e.keywords[0];
  const claim = hard.find((h) => h !== k1) ?? hard[0] ?? k1;
  const { bullet } = sampleUse(e);
  return [
    {
      t: HONEST_RULES[0].t,
      d: `If ${withArticle(role)} post says "${k1}", write "${k1}", not a near-synonym — as long as it's accurate. Recruiters search for the post's exact term.`,
    },
    {
      t: HONEST_RULES[1].t,
      d: `Expect to be asked about every term you list. If you couldn't spend two minutes on ${claim} — what you did and what changed — leave it out.`,
    },
    {
      t: HONEST_RULES[2].t,
      d: bullet
        ? `A skills list says you know ${bullet.term}. A bullet like the one under ${bullet.job.title} in the example above shows what you did with it.`
        : tool
          ? `Listing ${tool} says you've used it; a bullet that says what you did with ${tool} and what changed proves it.`
          : HONEST_RULES[2].d,
    },
    HONEST_RULES[3],
  ];
}

export function keywordFaqs(e: ResumeExample): { q: string; a: string }[] {
  const role = roleLower(e.role);
  const groups = keywordGroups(e);
  const tools = groups.find((g) => g.id === "tools")?.items.map((i) => i.term) ?? [];
  const creds = groups.find((g) => g.id === "credentials")?.items.map((i) => i.term) ?? [];
  const firstName = e.resume.name.split(" ")[0];
  const inSample = groups.reduce((n, g) => n + g.items.filter((i) => i.inSample).length, 0);
  const use = sampleUse(e);
  const whereAnswer = [
    "In your summary, a short skills section and, above all, the bullets under each job, where you show what you did with the skill.",
    use.summary.length ? `In ${firstName}'s sample, ${listJoin(use.summary)} ${use.summary.length > 1 ? "are" : "is"} in the summary` : "",
    use.bullet ? `${use.summary.length ? "and" : `In ${firstName}'s sample,`} ${use.bullet.term} shows up in a bullet under ${use.bullet.job.title}.` : use.summary.length ? "." : "",
    "Plain text in the body of the page is easiest for applicant tracking systems to read.",
  ]
    .filter(Boolean)
    .join(" ")
    .replace(" summary .", " summary.");
  const faqs: { q: string; a: string }[] = [
    {
      q: `How many keywords should ${withArticle(role)} resume have?`,
      a: `There's no magic number. ${firstName}'s sample resume uses ${inSample === e.keywords.length ? `all ${inSample} terms on this page, because each one fit that job` : `${inSample} of the ${e.keywords.length} terms on this page — the ones that fit that job`}. Cover what your post asks for that you can back up, each where it fits; repeating a keyword doesn't help.`,
    },
    {
      q: "Should I copy keywords exactly from the job post?",
      a: `Use the post's wording for skills you really have. If ${withArticle(role)} post says "${e.keywords[0]}", write "${e.keywords[0]}" rather than a synonym, so a recruiter searching for that term finds you. Don't add skills you don't have just because the post lists them.`,
    },
    {
      q: "Where should keywords go on my resume?",
      a: whereAnswer,
    },
  ];
  if (tools.length > 0) {
    faqs.push({
      q: `Which tools should I list on ${withArticle(role)} resume?`,
      a: `The ones you've used and the post mentions. Common ones in ${role} posts include ${listJoin(tools.slice(0, 5))}. Name the tool in the bullet where you used it, not only in the skills list.`,
    });
  }
  if (creds.length > 0) {
    faqs.push({
      q: `How should I list ${listJoin(creds.slice(0, 2))} on my resume?`,
      a: `Spell ${creds.length > 1 ? "them" : "it"} the way the job post does, and include both the abbreviation and the full name if you have room. Put licenses and certifications in their own section or next to your education, and only list ones that are current.`,
    });
  }
  return faqs;
}
