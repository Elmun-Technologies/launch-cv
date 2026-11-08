/**
 * Content for the /how-to-write-a-resume pillar guide.
 *
 * Body copy is Markdown (rendered with the blog's typography). This page makes
 * no statistical claims, so it has no source list; if you add a number about
 * hiring or recruiters, cite a primary source the way lib/seo/resume-format.ts
 * does. Example bullets, summaries and keywords are read from
 * lib/resume-examples.ts, never retyped here.
 */

import type { GuideSection } from "@/components/site/seo/guide-page";
import type { BulletRewrite } from "@/components/site/seo/bullet-rewrites";
import { getResumeExample } from "@/lib/resume-examples";

export const HOW_TO_PUBLISHED = "2026-11-02";
export const HOW_TO_UPDATED = "2026-11-02";

/** The eight steps, shown as the overview band under the hero. */
export const HOW_TO_STEPS: { t: string; d: string }[] = [
  { t: "Contact details", d: "Name, city and state, phone, email and one link, as plain text." },
  { t: "Summary", d: "Two or three lines: your level, your focus and one result." },
  { t: "Experience", d: "Most recent job first, with bullets that show results." },
  { t: "Skills", d: "The tools and skills the job asks for, named the same way." },
  { t: "Education", d: "Degree, school and year, plus licenses and certifications." },
  { t: "Tailor it", d: "Match your wording and order to each job post." },
  { t: "Format for ATS", d: "One column, standard headings, a text-based file." },
  { t: "Proofread", d: "Read it slowly, out loud, and check every date and link." },
];

export const HOW_TO_QUICK = [
  "Start from a reverse-chronological, one-column layout",
  "Write bullets as action + what you did + what changed",
  "Use numbers you can explain in an interview",
  "Name skills the way the job post names them",
  "Tailor the summary and bullet order for every application",
  "Send a text-based PDF unless the posting asks for Word",
];

export const HOW_TO_PROOFREAD = [
  "Your name, phone number and email are correct, and every link opens",
  "Job titles, employers and dates match your LinkedIn profile",
  "Every date uses the same format, and nothing overlaps by mistake",
  "Bullets in past jobs use the past tense; your current job uses the present",
  "Each bullet starts with a verb, and no two start with the same one in a row",
  "Company names, tools and certifications are spelled the way their owners spell them",
  "You've read it out loud once, slowly, start to finish",
  "The file opens as expected, and you can select the text in the PDF",
];

/** Before/after bullets from the resume examples, as [example slug, bullet skill label]. */
const REWRITE_PICKS: [string, string][] = [
  ["software-engineer", "Performance"],
  ["registered-nurse", "Patient education"],
  ["sales-representative", "Sales process"],
  ["customer-service-representative", "Resolution"],
  ["teacher", "Student growth"],
  ["administrative-assistant", "Events"],
];

export function howToRewrites(): BulletRewrite[] {
  return REWRITE_PICKS.flatMap(([slug, skill]) => {
    const e = getResumeExample(slug);
    const b = e?.bullets.find((x) => x.skill === skill);
    return e && b ? [{ slug, role: e.role, skill: b.skill, weak: b.weak, strong: b.strong }] : [];
  });
}

/** Resume example used for the contact header, summaries and tailoring figures. */
export const HOW_TO_SUMMARY_EXAMPLE = "data-analyst";
/** Resume example shown in full at the end of the guide. */
export const HOW_TO_FULL_EXAMPLE = "product-manager";

export const HOW_TO_SECTIONS: GuideSection[] = [
  {
    id: "before-you-start",
    title: "Before you start",
    body: [
      "A resume has one job: get you to an interview for a specific role. Everything below follows from that. Before you write a word, gather three things: the job post you're applying to, a list of your past jobs with start and end dates, and any results you can back up — sales closed, time saved, people trained, projects shipped.",
      "Then pick the layout. For almost everyone in the US that's a **reverse-chronological** resume: one column, your most recent job first, standard headings. The [resume format guide](/resume-format) explains why and covers the exceptions. The eight steps below fill that layout in, top to bottom.",
    ],
  },
  {
    id: "contact",
    title: "Step 1: Contact details",
    body: [
      "Put your name at the top, larger than anything else, followed by one line with your **city and state, phone number, professional email** and, if you have one, a **LinkedIn or portfolio link**. A full street address isn't needed.",
      "Type these as plain text in the body of the page — not in the document's header area, which some applicant tracking systems skip, and not behind icons. Leave off a photo, date of birth, marital status and Social Security number; none of them belong on a US resume.",
    ],
    figure: "contact",
  },
  {
    id: "summary",
    title: "Step 2: A short summary",
    body: [
      "A summary is two or three lines that tell the reader who you are and what you're best at: **your level, your focus and one result.** It replaces the old \"objective statement\", which talked about what you wanted rather than what you offer.",
      "Skip adjectives a reader can't check — \"hard-working\", \"detail-oriented\", \"results-driven\". A number or a named area of work does more. Here is how the same kind of summary changes with experience, from our data analyst resume example:",
    ],
    figure: "summaries",
    after: [
      "Stuck on yours? The free [resume summary generator](/tools/resume-summary-generator) drafts one from your title, experience and strongest result, and you edit it from there.",
    ],
  },
  {
    id: "experience",
    title: "Step 3: Experience, with achievement bullets",
    body: [
      "This is the section that gets read. List your jobs **most recent first**. For each one, give your job title, the employer, the city and state (or \"Remote\"), and start and end dates as month and year. Under each job, write three to six bullets — more for your current role, fewer for older ones.",
      "Each bullet should show what changed because you were there, not what your job description said. A reliable pattern is:",
      "**Action verb + what you did + the result.** A duty says what you were supposed to do; an achievement says what happened because you did it.",
      "- **Start with a strong verb** — led, built, cut, launched, negotiated — not \"responsible for\" or \"helped with\". The [resume action verbs](/resume-action-verbs) list has alternatives by skill.\n- **Add a number when you have one** — money, time, volume, people, percentages — and only numbers you could explain in an interview.\n- **No number? Show scope instead:** how many people used it, how often, for whom, or what it replaced.\n- **Keep each bullet to one or two lines.** If it wraps to a third, split it or cut the least useful words.",
      "Here are duty-style bullets rewritten as achievements, taken from our resume examples:",
    ],
    figure: "rewrites",
    after: [
      "If you have a bullet that still reads like a duty, paste it into the free [resume bullet point generator](/tools/resume-bullet-point-generator) and it suggests achievement-style rewrites you can edit with your real numbers.",
    ],
  },
  {
    id: "skills",
    title: "Step 4: Skills",
    body: [
      "List the **hard skills, tools and certifications** the job calls for and that you'd be comfortable being asked about: software, programming languages, methods, equipment, languages you speak. One or two lines of comma-separated terms is easier to scan than a grid.",
      "Name each skill the way the job post names it. If the posting says \"Salesforce\" and \"forecasting\", write those words, not \"CRM tools\" and \"planning\". The [resume keywords](/resume-keywords) pages list the terms that come up for each role.",
      "Leave out rating bars, stars and percentages next to skills — a parser can't read them and a recruiter can't interpret \"80% Excel\". Soft skills such as communication or leadership are better shown in an experience bullet than claimed in a list.",
    ],
  },
  {
    id: "education",
    title: "Step 5: Education and certifications",
    body: [
      "Give your **degree, school and graduation year** (or \"Expected May 2027\" if you're still studying). Add honors, a relevant minor or a strong GPA only while you're a student or recent graduate; after a few years of work, the degree line is enough.",
      "If you graduated recently and have little work history, move Education above Experience and add relevant coursework, projects or internships. Otherwise it sits below Experience.",
      "Licenses and certifications that the job requires — RN, CPA, PMP, a teaching license — deserve their own short section or a clear line under Education, with the issuing body and the year.",
    ],
  },
  {
    id: "tailoring",
    title: "Step 6: Tailor it to the job post",
    body: [
      "One resume sent to every opening reads like one. Keep a full master version with everything you've done, then make a copy for each application and adjust it:",
      "1. **Read the post twice.** Mark the job title, the required skills and tools, and the two or three outcomes the role is clearly hired to deliver.\n2. **Mirror the wording where it's true.** If you've done the thing, use the posting's term for it — in a bullet, and in your skills line.\n3. **Reorder.** Put the bullets that match the posting first under each job, and move the most relevant job details up.\n4. **Rewrite the summary** so its first line answers the posting's headline need.\n5. **Cut what doesn't help** for this role, to keep the length in check.",
      "Here is what that looks like in practice. In our data analyst resume example, the bullets themselves carry the skills recruiters search for — highlighted below — rather than leaving them in a list at the bottom:",
    ],
    figure: "tailoring",
    after: [
      "Never add a skill or a result you don't have to match a post. Interviews test the resume, and a mismatch costs more than a missing keyword.",
    ],
  },
  {
    id: "ats-formatting",
    title: "Step 7: Format it for ATS and for people",
    body: [
      "Many employers read applications through an applicant tracking system (ATS), which turns your file into text and sorts it into fields. Formatting that confuses the parser can leave your job history empty even when the page looks fine. Keep it simple:",
      "- **One column**, with nothing side by side.\n- **Standard headings:** Summary, Experience, Education, Skills.\n- **No tables, text boxes, icons or images** in place of words.\n- **A common font** at a readable size, with consistent dates and spacing.\n- **A text-based PDF** — exported, not scanned — unless the posting asks for Word. Name it plainly, like `Firstname-Lastname-Resume.pdf`.",
      "Length is part of formatting too: one page early in your career, two once your relevant experience fills them. The [resume length guide](/resume-length) covers each experience level, what to cut and the federal two-page rule.",
      "To see how a parser reads your file, run it through the [free ATS check](/free-ats-check). It flags columns, tables, missing contact details and inconsistent dates, and needs no account.",
    ],
  },
  {
    id: "proofreading",
    title: "Step 8: Proofread before you send",
    body: [
      "Typos are the easiest reason to be passed over, and the easiest to fix. Proofread on a different day from the one you wrote it if you can, and check it against this list:",
    ],
    figure: "proofreading",
    after: [
      "Then ask someone who knows your field to skim it once and tell you what they remember. If it isn't your strongest result, move that result higher.",
    ],
  },
  {
    id: "full-example",
    title: "Put it together: a full example",
    body: [
      "Here is a complete resume that follows every step above, rendered in one of LaunchCV's templates. Compare its bullets with your own: each starts with a verb and ends with what changed.",
    ],
    figure: "full-example",
    after: [
      "There are written examples for more roles — from registered nurse and teacher to software engineer and accountant — on the [resume examples](/resume-examples) page, each with summaries and bullets you can adapt.",
    ],
  },
  {
    id: "next-steps",
    title: "Next: the cover letter",
    body: [
      "Many applications still ask for a cover letter, and a short, specific one helps when you're changing careers or writing to a hiring manager directly. Start from the copyable [cover letter template](/cover-letter-template), which explains each paragraph and includes a filled-in example.",
      "Keep \"References available upon request\" off the resume itself. Prepare a separate [references page](/resume-references) instead, and send it only when it's asked for.",
    ],
  },
];

export const HOW_TO_FAQS: { q: string; a: string }[] = [
  {
    q: "How do I write a resume for the first time?",
    a: "Start with a one-column, reverse-chronological layout. Add your contact details, a two-line summary, then your experience — including internships, part-time jobs, volunteering or projects — with bullets that show what you achieved. Finish with education and skills, and keep it to one page.",
  },
  {
    q: "What should a resume include?",
    a: "Contact details, a short summary, work experience with dates and achievement bullets, education, and a skills section. Add certifications, licenses or relevant projects when they matter for the job.",
  },
  {
    q: "How many bullet points should each job have?",
    a: "Three to six for your current or most relevant job, and fewer for older or less relevant ones. Each bullet should show a result, not repeat a duty.",
  },
  {
    q: "Should I write a different resume for every job?",
    a: "Keep one master resume, then tailor a copy for each application: adjust the summary, reorder bullets so the most relevant come first, and use the job post's wording for skills you actually have.",
  },
  {
    q: "Do I need a summary or an objective?",
    a: "A short summary is more useful than an objective, because it says what you offer instead of what you want. Make it two or three lines with your level, your focus and one result.",
  },
  {
    q: "What should I leave off my resume?",
    a: "A photo, date of birth, marital status, Social Security number, a full street address, \"References available upon request\", and jobs from long ago that have nothing to do with the role.",
  },
  {
    q: "Should I use a resume template?",
    a: "Yes, if it's a simple one-column template with standard headings. Avoid designs with sidebars, tables, icons or skill bars, which applicant tracking systems often read incorrectly.",
  },
];

/** Blog posts to read next (slugs from lib/blog-posts.ts). */
export const HOW_TO_READING: string[] = [
  "how-to-write-an-ats-friendly-resume",
  "how-to-tailor-your-resume-for-every-job",
  "what-is-ats-and-how-does-it-work",
  "cover-letter-tips-that-actually-work",
];
