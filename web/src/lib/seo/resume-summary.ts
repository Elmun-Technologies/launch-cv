/**
 * Content for the /resume-summary-examples pillar guide.
 *
 * Body copy is Markdown. Every example summary is illustrative: the people,
 * employers and figures are made up to show the shape of a strong summary.
 * The role list is built from RESUME_EXAMPLES, so it grows with the examples.
 * No hiring statistics: add one only with a primary source.
 */

import type { GuideSection } from "@/components/site/seo/guide-page";
import type { FaqItem } from "@/lib/faq-ld";

export const RESUME_SUMMARY_PUBLISHED = "2026-11-08";
export const RESUME_SUMMARY_UPDATED = "2026-11-08";

/** The three-part formula, shown as cards. */
export const SUMMARY_FORMULA: { step: string; label: string; example: string }[] = [
  { step: "1", label: "Who you are", example: "Registered nurse with 6 years in cardiac step-down units" },
  { step: "2", label: "Your strongest proof", example: "Cut patient falls on a 32-bed unit by 40% with hourly rounding" },
  { step: "3", label: "What you bring to this job", example: "Looking to bring telemetry and charge-nurse experience to a Magnet hospital" },
];

export const SUMMARY_QUICK = [
  "Two to four lines, at the top of the resume under your name",
  "Open with your title and years of experience, or your level if you're new",
  "Include one result with a number you can explain in an interview",
  "Use two or three keywords from the job post, in plain sentences",
  "Rewrite it for each kind of role you apply to",
  "Skip clichés like \"hard-working team player\" and \"results-driven\"",
];

/** Weak → strong rewrites. Columns: weak, strong, what changed. */
export const SUMMARY_REWRITES: string[][] = [
  [
    "Hard-working professional looking for a challenging role where I can grow.",
    "Customer support lead with 5 years in SaaS. Cut first-reply time from 9 hours to 2 by rebuilding our ticket routing.",
    "A title, years and a measured result replace a wish.",
  ],
  [
    "Results-driven marketer with excellent communication skills.",
    "B2B content marketer who grew organic sign-ups 3× in 18 months with a 40-article SEO program.",
    "The proof shows the \"results\" instead of claiming them.",
  ],
  [
    "Recent graduate seeking an entry-level position in finance.",
    "Finance graduate (B.S., 3.7 GPA) with an FP&A internship where I built the monthly variance report the CFO now uses.",
    "School, a real internship and one concrete piece of work.",
  ],
  [
    "Experienced manager responsible for a team and various projects.",
    "Operations manager leading 3 shifts and 45 people in a regional warehouse. Raised order accuracy to 99.6% while volume doubled.",
    "Scope (people, shifts) and an outcome replace \"responsible for\".",
  ],
];

export type SituationSummary = { key: string; label: string; when: string; text: string; tip: string };

/** Summaries for situations rather than roles. */
export const SITUATION_SUMMARIES: SituationSummary[] = [
  {
    key: "no-experience",
    label: "No work experience",
    when: "First job, no internships yet",
    text: "Business administration student at Georgia State with a 3.6 GPA. Treasurer of a 120-member student club, where I set up the first budget spreadsheet and kept spending 8% under plan. Comfortable with Excel and Google Sheets and quick to learn new tools.",
    tip: "Use school, clubs, volunteering and projects as your proof. One number still helps.",
  },
  {
    key: "student",
    label: "Student or new graduate",
    when: "Internships, part-time work, projects",
    text: "Computer science graduate from UT Austin with two backend internships. Built a REST API that 3,000 students used for course sign-ups and cut its response time by 60%. Looking for a junior engineering role on a product team.",
    tip: "Lead with the degree, then the most relevant internship or project.",
  },
  {
    key: "career-change",
    label: "Career change",
    when: "Moving into a new field",
    text: "Former high school math teacher moving into data analysis. Completed the Google Data Analytics certificate and built a SQL and Tableau dashboard tracking attendance for 900 students. Brings 7 years of explaining numbers to people who don't love them.",
    tip: "Name the move, show proof of the new skill, then the strength that transfers.",
  },
  {
    key: "gap",
    label: "Returning after a gap",
    when: "Back after caregiving, health or a break",
    text: "Accounts payable specialist with 6 years in manufacturing, returning after two years of family caregiving. Processed 400+ invoices a month with a 0.5% error rate, and recently refreshed my skills with QuickBooks Online certification.",
    tip: "Mention the gap in a few words, then move on to what you can do now.",
  },
  {
    key: "entry-level",
    label: "Entry level",
    when: "Up to 2 years in the field",
    text: "Medical assistant with 18 months in a busy family practice seeing 60 patients a day. Rooms patients, takes vitals and updates Epic charts, and cut check-in time by 4 minutes by preparing charts the night before.",
    tip: "Show the volume you handled; it tells a reader you can keep up.",
  },
  {
    key: "senior",
    label: "Senior or executive",
    when: "10+ years, leading teams or functions",
    text: "VP of Sales who built a mid-market team from 4 to 30 reps across two regions. Grew annual recurring revenue from $8M to $31M in three years while keeping net revenue retention above 115%.",
    tip: "Lead with scope (team, budget, revenue), then the outcome at that scale.",
  },
  {
    key: "promotion",
    label: "Internal promotion",
    when: "Applying for the next role at your company",
    text: "Senior accountant who has run the month-end close for our three US entities for two years and trained the two newest staff accountants. Ready to lead the close team as accounting manager.",
    tip: "Show you're already doing part of the next job.",
  },
  {
    key: "freelance",
    label: "Freelancer or contractor",
    when: "Moving from client work to a full-time role",
    text: "Freelance UX designer with 5 years and 30+ client projects for fintech and health startups. Redesigned a loan application flow that raised completion from 41% to 63%. Looking to join one product team for the long run.",
    tip: "Count the clients, name the industries and pick one result.",
  },
];

export const RESUME_SUMMARY_SECTIONS: GuideSection[] = [
  {
    id: "what-is",
    title: "What is a resume summary?",
    body: [
      "A resume summary is two to four lines at the top of your resume that say who you are, what you've done and what you bring to the job. It's the first thing a recruiter reads, so it decides whether they keep reading.",
      "A good summary isn't a list of adjectives. It reads like a short pitch: your title or level, your strongest proof, and a hint of why you fit this role. Below you'll find a simple formula, rewrites of weak summaries, examples for common situations, and a summary for every role in our [resume examples](/resume-examples).",
    ],
  },
  {
    id: "formula",
    title: "The formula: who you are, your proof, what you bring",
    body: ["Most strong summaries follow the same three parts. Write one sentence for each, then trim:"],
    figure: "formula",
    after: [
      "Put together, that's: *\"Registered nurse with 6 years in cardiac step-down units. Cut patient falls on a 32-bed unit by 40% with hourly rounding. Looking to bring telemetry and charge-nurse experience to a Magnet hospital.\"*",
      "The third sentence is optional. Drop it when the first two already make the fit obvious, or when you need the space.",
    ],
  },
  {
    id: "weak-vs-strong",
    title: "Weak vs. strong resume summaries",
    body: ["The difference is almost always proof. Here's what changes when a summary goes from generic to specific:"],
    figure: "rewrites",
  },
  {
    id: "by-situation",
    title: "Resume summary examples by situation",
    body: [
      "Your situation shapes the summary as much as your job title. Pick the one closest to yours:",
    ],
    figure: "situations",
  },
  {
    id: "by-role",
    title: "Resume summary examples by job",
    body: [
      "Every role below has a full sample resume. The summary shown is from that sample. Open a role for summaries at other levels, bullet examples and the keywords recruiters look for.",
    ],
    figure: "roles",
  },
  {
    id: "summary-vs-objective",
    title: "Resume summary vs. objective",
    body: [
      "An **objective** says what you want (\"seeking a role where I can grow\"). A **summary** says what you offer. Employers care more about the second, so a summary is the better choice for almost everyone.",
      "The exception is a big change with little directly relevant experience, such as a first job or a career switch. Even then, write it as a summary that names your target role, like the career-change example above, rather than an objective about your wishes.",
    ],
  },
  {
    id: "tailor",
    title: "Tailor your summary to each job post",
    body: [
      "Applicant tracking systems and recruiters both look for the job post's main skills near the top. Read the posting, pick the two or three requirements that matter most, and make sure your summary mentions the ones you really have, in plain sentences.",
      "- **Match the title.** If the post says \"Customer Success Manager\" and you were an \"Account Manager\" doing the same work, say so: \"Account manager (customer success) with…\".\n- **Use their words.** If they ask for \"Salesforce\" and \"renewals\", use those words, not \"CRM\" and \"retention\".\n- **Don't stuff keywords.** A summary that reads like a list of terms looks automated to a person.",
      "The free [job description keyword scanner](/tools/job-description-keyword-scanner) shows which terms a posting repeats and which of them your resume already has.",
    ],
  },
  {
    id: "mistakes",
    title: "Common resume summary mistakes",
    body: [
      "- **Clichés.** \"Hard-working\", \"detail-oriented\", \"team player\" and \"results-driven\" describe almost everyone. Show the result instead.\n- **Too long.** More than four lines turns into a paragraph nobody reads. Move the extra detail into your bullets.\n- **First-person pronouns everywhere.** \"I\" is fine once or twice; starting every sentence with it reads like a cover letter.\n- **Numbers you can't explain.** Every figure should hold up in an interview. Round honestly, and leave it out if you're unsure.\n- **The same summary for every job.** A summary written for \"any role\" fits none of them.",
    ],
  },
  {
    id: "write-yours",
    title: "Write yours in a minute",
    body: [
      "Start from the example closest to your situation, swap in your title, your years and one result you're proud of, then cut it to four lines. If you're stuck, the free [resume summary generator](/tools/resume-summary-generator) drafts one from your title, experience and strongest result, and you edit from there.",
      "Once it's in place, run the [free ATS check](/free-ats-check) to see how software reads the top of your resume.",
    ],
  },
];

export const RESUME_SUMMARY_FAQS: FaqItem[] = [
  {
    q: "How long should a resume summary be?",
    a: "Two to four lines, or about 40 to 75 words. Long enough for your title, one strong result and what you bring; short enough to read in a few seconds.",
  },
  {
    q: "Should I write my resume summary in first person?",
    a: "Either works. Most US resumes drop the \"I\" and start with the title (\"Registered nurse with 6 years…\"). If you use \"I\", keep it to once or twice so it doesn't read like a letter.",
  },
  {
    q: "Do I need a summary if I have no experience?",
    a: "It helps. A short summary can point a reader to your degree, a relevant project or a club role before they reach the education section. Use school, volunteering and projects as your proof.",
  },
  {
    q: "Is a resume summary the same as a professional profile?",
    a: "Yes. \"Summary\", \"professional summary\", \"profile\" and \"career summary\" are names for the same section. Pick one heading and keep it short.",
  },
  {
    q: "Should the summary include keywords from the job description?",
    a: "Yes, two or three of the most important ones, written into normal sentences. They help both the applicant tracking system and the recruiter see the match quickly. Only include skills you really have.",
  },
  {
    q: "Can I use the same summary for every application?",
    a: "Keep a base version, then adjust the title and the two or three keywords for each kind of role. A few minutes per application is usually enough.",
  },
];

export const RESUME_SUMMARY_READING: string[] = ["how-to-tailor-your-resume-for-every-job", "how-to-write-an-ats-friendly-resume"];
