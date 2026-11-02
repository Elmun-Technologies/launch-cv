/** Self-checks for lib/resume-score.ts and lib/resume-keywords.ts. Run: npx tsx src/lib/resume-score.check.ts */
import { emptyResumeContent, type ResumeContent } from "@/types/resume";
import { RESUME_EXAMPLES } from "@/lib/resume-examples";
import { exampleToContent } from "@/lib/example-to-content";
import { SCORE_BANDS } from "@/components/ats-report-parts";
import { buildSkillsDictionary } from "@/lib/skills-dictionary-source";
import { SKILLS_DICTIONARY } from "@/lib/skills-dictionary";
import { RESUME_SCORE_BANDS, SCORE_WEIGHTS, scoreResume, type ResumeScore } from "@/lib/resume-score";
import { extractJobTerms, matchKeywords, normalizeTerm } from "@/lib/resume-keywords";

const failures: string[] = [];
let count = 0;
function expect(ok: boolean, what: string) {
  count += 1;
  if (!ok) failures.push(what);
}

let n = 0;
const id = () => `t${(n += 1)}`;
function job(role: string, company: string, start: string, end: string, bullets: string[]) {
  return { id: id(), role, company, start, end, location: "", bullets: bullets.map((text) => ({ id: id(), text, evidenceIds: [] })) };
}
function resume(patch: Partial<ResumeContent>): ResumeContent {
  return { ...emptyResumeContent(), ...patch };
}
/** Every target points at something that exists in the content. */
function targetsResolve(s: ResumeScore, c: ResumeContent, label: string) {
  const bulletIds = new Set(c.experience.flatMap((e) => e.bullets.map((b) => b.id)));
  const expIds = new Set(c.experience.map((e) => e.id));
  for (const it of s.items) {
    const key = it.target?.key ?? "";
    if (key.startsWith("bullet:")) expect(bulletIds.has(key.slice(7)), `${label}: item ${it.id} targets a missing bullet`);
    if (key.startsWith("exp:")) expect(expIds.has(key.split(":")[1]), `${label}: item ${it.id} targets a missing job`);
    expect(!!it.message && !!it.fix, `${label}: item ${it.id} has a message and a fix`);
  }
}

/* ── Constants ─────────────────────────────────────────────────────── */

expect(SCORE_WEIGHTS.content + SCORE_WEIGHTS.impact + SCORE_WEIGHTS.writing + SCORE_WEIGHTS.ats + SCORE_WEIGHTS.keywords === 100, "weights add up to 100");
expect(RESUME_SCORE_BANDS.ready === SCORE_BANDS.ready && RESUME_SCORE_BANDS.readable === SCORE_BANDS.readable, "bands match the ATS report");
expect(JSON.stringify(buildSkillsDictionary()) === JSON.stringify(SKILLS_DICTIONARY), "skills-dictionary.ts is up to date (run npx tsx scripts/gen-skills-dictionary.ts)");

/* ── Empty resume ──────────────────────────────────────────────────── */
{
  const c = emptyResumeContent();
  const s = scoreResume(c);
  expect(s.total < 20, `empty: total ${s.total} < 20`);
  expect(s.band === "risk", "empty: band is at risk");
  expect(s.items.some((i) => i.id === "content.name" && i.severity === "high"), "empty: asks for a name");
  expect(s.items.some((i) => i.id === "content.experience" && i.target?.key === "experience.add"), "empty: experience item targets the add button");
  expect(!s.categories.find((x) => x.id === "keywords")!.applicable, "empty: keywords not applicable without a job description");
  expect(s.items.every((i) => i.category !== "impact" && i.category !== "writing"), "empty: no impact or writing nags before there are bullets");
  targetsResolve(s, c, "empty");
  // An empty job entry the user just added doesn't produce date or title nags.
  const c2 = resume({ experience: [job("", "", "", "", [])] });
  const s2 = scoreResume(c2);
  expect(!s2.items.some((i) => i.id.startsWith("ats.date") || i.id.startsWith("content.job.")), "empty job entry: no date or title nags");
  expect(s2.items.find((i) => i.id === "content.experience")?.target?.key === `exp:${c2.experience[0].id}:role`, "empty job entry: experience item focuses its title");
}

/* ── A complete, strong resume ─────────────────────────────────────── */
const perfect = resume({
  contact: { fullName: "Maria Lopez", email: "maria.lopez@email.com", phone: "(512) 555-0142", location: "Austin, TX", links: ["linkedin.com/in/marialopez"] },
  headline: "Senior Product Manager | Growth and Onboarding",
  summary:
    "Product manager with 8 years in B2B SaaS, focused on onboarding and activation. I run tight discovery with design and engineering, ship in small steps and measure everything. Most recently raised week-1 activation from 38% to 57%.",
  experience: [
    job("Senior Product Manager", "Brightline Health", "Apr 2021", "Present", [
      "Raised week-1 activation from 38% to 57% by rebuilding onboarding around a guided setup checklist",
      "Launched self-scheduling across 41 clinics, cutting no-shows by 23% in the first two quarters",
      "Led 9 engineers and 2 designers through quarterly planning with a single ranked roadmap",
      "Cut support tickets about billing by 31% after rewriting invoices with the finance team",
    ]),
    job("Product Manager", "Fieldnote", "Jul 2018", "Mar 2021", [
      "Shipped a mobile offline mode used by 12,000 field reps within six months of launch",
      "Grew trial-to-paid conversion from 9% to 14% with a pricing page and plan comparison test",
      "Reduced release cycle from monthly to weekly by introducing feature flags with engineering",
    ]),
  ],
  education: [{ id: "ed1", school: "University of Texas at Austin", degree: "B.S. Information Systems", start: "2010", end: "2014" }],
  skills: ["Product strategy", "Roadmapping", "A/B testing", "SQL", "Amplitude", "Figma", "Jira", "User research"],
});
{
  const s = scoreResume(perfect);
  expect(s.total >= 90, `perfect: total ${s.total} >= 90`);
  expect(s.band === "ready", "perfect: band is ready to send");
  expect(!s.items.some((i) => i.severity !== "low"), `perfect: only low items (got ${s.items.filter((i) => i.severity !== "low").map((i) => i.id).join(", ")})`);
  expect(Object.keys(s.bullets).length === 0, `perfect: no bullet chips (got ${JSON.stringify(s.bullets)})`);
  targetsResolve(s, perfect, "perfect");
}

/* ── A junior with no numbers ──────────────────────────────────────── */
const junior = resume({
  contact: { fullName: "Sam Lee", email: "sam.lee@email.com", phone: "", location: "Columbus, OH" },
  headline: "Marketing graduate",
  summary: "Recent marketing graduate who has run social accounts for a student club and a local bakery. Comfortable with Canva, Instagram and writing short posts.",
  experience: [
    job("Social Media Intern", "Crumb & Co. Bakery", "May 2024", "Aug 2024", [
      "Planned and posted weekly Instagram content for a neighborhood bakery",
      "Photographed new menu items and wrote captions in the owner's voice",
      "Answered customer messages and passed catering requests to the manager",
    ]),
    job("Club Secretary", "Ohio State Marketing Association", "Sep 2022", "May 2024", [
      "Kept meeting notes and sent the weekly newsletter to members",
      "Organized guest speaker events with local agencies",
    ]),
  ],
  education: [{ id: "ed1", school: "Ohio State University", degree: "B.A. Marketing", start: "2020", end: "2024" }],
  skills: ["Social media", "Canva", "Copywriting", "Photography", "Google Analytics", "Instagram"],
});
{
  const s = scoreResume(junior);
  expect(s.total >= 60 && s.total < 90, `junior: total ${s.total} in 60–89`);
  expect(!s.items.some((i) => i.severity === "high"), "junior: no high-severity items");
  const impact = s.categories.find((x) => x.id === "impact")!;
  expect(impact.score < 60, `junior: impact ${impact.score} reflects missing results`);
  expect(s.items.filter((i) => i.category === "impact").every((i) => i.severity === "medium" && /estimate/.test(i.fix)), "junior: impact items are medium and suggest honest estimates");
  targetsResolve(s, junior, "junior");
}

/* ── Every written example scores well ─────────────────────────────── */
{
  const low: string[] = [];
  const high: string[] = [];
  for (const e of RESUME_EXAMPLES) {
    for (const [label, c] of [["sample", exampleToContent(e)], ["owner", exampleToContent(e, { name: "Maria Lopez", email: "maria@example.com" })]] as const) {
      const s = scoreResume(c);
      if (s.total < 80) low.push(`${e.slug}/${label}=${s.total}`);
      if (s.items.some((i) => i.severity === "high")) high.push(`${e.slug}/${label}`);
      targetsResolve(s, c, e.slug);
    }
  }
  expect(low.length === 0, `examples score 80+ (below: ${low.join(", ")})`);
  expect(high.length === 0, `examples have no high-severity items (${high.join(", ")})`);
}

/* ── Bullet chips ─────────────────────────────────────────────────── */
{
  const c = resume({
    experience: [
      job("Cashier", "Corner Market", "Jan 2023", "Present", [
        "Responsible",
        "Answered phones and greeted",
        "Helped with various tasks around the store and the stockroom during busy weekend shifts",
        "Led the morning restock so shelves were full before opening at 7am",
        "Led the evening close and counted the cash drawer with zero errors over 18 months",
        "Trained new cashiers on the register, the returns policy, the loyalty program sign-up script, gift card activation, price checks, voids and the end-of-day report so they could cover shifts without a supervisor",
        "I cut my checkout line wait by opening a second register at 5pm",
      ]),
    ],
  });
  const s = scoreResume(c);
  const ids = c.experience[0].bullets.map((b) => b.id);
  const kinds = (i: number) => (s.bullets[ids[i]] ?? []).map((x) => x.kind).sort().join(",");
  expect(kinds(0) === "", `half-typed one word: no chips (got ${kinds(0)})`);
  expect(kinds(1) === "", `half-typed four words: no chips (got ${kinds(1)})`);
  expect(kinds(2) === "duty,filler", `duty + "various": duty and filler (got ${kinds(2)})`);
  expect(kinds(3) === "", `result bullet: no chips (got ${kinds(3)})`);
  expect(kinds(4) === "repeat-start", `"Led" after "Led": repeat-start (got ${kinds(4)})`);
  expect(kinds(5) === "too-long", `35+ words: too-long (got ${kinds(5)})`);
  expect(s.items.some((i) => i.id === `writing.firstPerson.${ids[6]}`), "first person in a bullet is an item");
  expect(!s.items.some((i) => i.id === `writing.firstPerson.${ids[3]}`), "no first-person item for a clean bullet");
  // "Helped" at the start is a duty, so it isn't also counted as filler.
  const helped = scoreResume(resume({ experience: [job("A", "B", "Jan 2020", "Present", ["Helped with month-end close for a team of six accountants"])] }));
  expect(!(helped.bullets[Object.keys(helped.bullets)[0]] ?? []).some((x) => x.kind === "filler"), "duty opening is not double-counted as filler");
  // Mixed full stops.
  const mixed = scoreResume(resume({ experience: [job("A", "B", "Jan 2020", "Present", ["Cut costs by 10% across the region.", "Grew revenue by 12% in two quarters.", "Hired 4 engineers for the platform team"])] }));
  expect(mixed.items.some((i) => i.id === "writing.punctuation" && i.target?.key === `bullet:${mixed.items.find((x) => x.id === "writing.punctuation")!.target!.key.slice(7)}`), "mixed punctuation is flagged with a bullet target");
  expect(scoreResume(perfect).items.every((i) => i.id !== "writing.punctuation"), "consistent punctuation passes");
}

/* ── Dates ─────────────────────────────────────────────────────────── */
{
  const c = resume({ experience: [job("Analyst", "Acme", "03/2021", "Present", ["Built the weekly sales report used by 30 managers across the region"]), job("Intern", "Beta", "Jun 2019", "2020", ["Cleaned 4 years of CRM data before a Salesforce migration in spring"])] });
  const s = scoreResume(c);
  expect(s.items.some((i) => i.id === `ats.date.${c.experience[0].id}.start` && i.severity === "medium"), "03/2021 is flagged as unreadable");
  expect(s.items.some((i) => i.id === `ats.date.${c.experience[1].id}.end` && i.severity === "low"), "a lone year among Mmm YYYY dates is a low item");
  expect(!s.items.some((i) => i.id === `ats.date.${c.experience[0].id}.end`), "Present is accepted");
}

/* ── Keywords ──────────────────────────────────────────────────────── */
const JD = `About Acme Health
Acme Health is a fast-growing digital health company. Join Acme Health and help patients.

Senior Product Manager, Growth
We're looking for a Senior Product Manager to own our onboarding and activation funnel.

What you'll do:
- Own the product roadmap for onboarding and activation
- Run A/B testing and experiments with Amplitude and Looker
- Write PRDs and user stories; work in Agile/Scrum with engineering
- Partner with Salesforce Marketing Cloud admins on lifecycle email
- Go deep on SQL to answer your own questions
- Strong stakeholder management

Requirements:
- 5+ years of product management experience
- Experience with Salesforce Marketing Cloud and HubSpot
- Familiar with GA4, Mixpanel and Mixpanel cohorts, REST APIs
- Excellent communication. Closing date: Dec 1.
Benefits: Health, Dental, Vision, 401k, PTO. Acme Health is an EEO employer. Based in Austin, TX.`;
{
  const terms = extractJobTerms(JD).map((t) => t.term);
  for (const want of ["A/B testing", "Amplitude", "SQL", "HubSpot", "PRDs", "Product roadmap", "Salesforce Marketing Cloud", "Mixpanel", "GA4", "Stakeholder management", "Senior Product Manager", "Agile", "Scrum", "REST APIs"]) {
    expect(terms.includes(want), `JD: finds "${want}" (got ${terms.join(" | ")})`);
  }
  // "Salesforce" only appears inside "Salesforce Marketing Cloud".
  for (const not of ["Salesforce", "Acme Health", "Acme", "Health", "TX", "Austin", "EEO", "Go", "Closing", "Dental", "Agile / Scrum", "PTO"]) {
    expect(!terms.includes(not), `JD: ignores "${not}"`);
  }
  expect(extractJobTerms("Backend services in Go and Python; strong R skills").map((t) => t.term).includes("Go"), "JD: Go the language counts mid-sentence");
  expect(extractJobTerms("Backend services in Go and Python; strong R skills").map((t) => t.term).includes("R"), "JD: R counts as a standalone capital");
  expect(!extractJobTerms("Go above and beyond for R&D customers every day of the week").map((t) => t.term).some((t) => t === "Go" || t === "R"), "JD: sentence-start Go and R&D don't count");
  expect(normalizeTerm("REST APIs") === normalizeTerm("rest api"), "plurals and case fold");
  expect(normalizeTerm("CI/CD") === normalizeTerm("CI CD") && normalizeTerm("first-contact resolution") === normalizeTerm("first contact resolution"), "punctuation folds");
  expect(extractJobTerms("short").length === 0, "too-short text gives no terms");

  const report = matchKeywords(perfect, JD);
  const by = (t: string) => report.terms.find((x) => x.term === t);
  expect(!!by("A/B testing")?.present && !!by("SQL")?.present && !!by("Amplitude")?.present, "resume terms are found (A/B testing, SQL, Amplitude)");
  expect(by("Onboarding")?.present === true, "onboarding found in bullets");
  expect(by("HubSpot")?.present === false && by("HubSpot")?.suggestion?.where === "skills" && by("HubSpot")?.suggestion?.canAddSkill === true, "missing tool goes to Skills with Add");
  expect(by("Senior Product Manager")?.present === true, "title present in headline");
  const roadmap = by("Product roadmap");
  expect(roadmap?.present === false && roadmap.suggestion?.where === "bullet" && roadmap.suggestion.target.key.startsWith("bullet:"), `missing "Product roadmap" points at the roadmap bullet (got ${roadmap?.suggestion?.where})`);
  const comm = by("Communication");
  expect(comm?.suggestion?.canAddSkill === false, "soft skills don't get one-click Add to skills");
  expect(report.terms.every((t) => t.present || t.suggestion), "every missing term has a suggestion");

  const s = scoreResume(perfect, { jobDescription: JD });
  const kw = s.categories.find((x) => x.id === "keywords")!;
  expect(kw.applicable && kw.score > 0 && kw.score <= 100, "keywords category applies with a job description");
  expect(s.items.filter((i) => i.category === "keywords").every((i) => i.severity === "low" && !!i.target), "keyword items are low and targeted");
  const noJd = scoreResume(perfect);
  const four = noJd.categories.filter((x) => x.id !== "keywords");
  expect(noJd.total === Math.round(four.reduce((a, x) => a + x.score * x.weight, 0) / 85), "without a job description the other four are scaled to 100");
  const junk = scoreResume(perfect, { jobDescription: "hello there, this is not a job post at all really" });
  expect(!junk.categories.find((x) => x.id === "keywords")!.applicable, "text with under 3 terms leaves keywords out");
}

/* ── Deterministic ─────────────────────────────────────────────────── */
expect(JSON.stringify(scoreResume(junior, { jobDescription: JD })) === JSON.stringify(scoreResume(junior, { jobDescription: JD })), "same input, same output");

if (failures.length) {
  console.error(`resume-score: ${failures.length} of ${count} checks failed`);
  for (const f of failures) console.error(`  ✗ ${f}`);
  process.exit(1);
}
console.log(`resume-score: all ${count} checks pass`);
