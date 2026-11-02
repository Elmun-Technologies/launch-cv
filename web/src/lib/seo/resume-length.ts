/**
 * Content for the /resume-length pillar guide.
 *
 * Body copy is Markdown. The only external facts on the page are the federal
 * (USAJOBS) rules, and each one points at RESUME_LENGTH_SOURCES through a
 * footnote link like [source](#source-opm-applicants). Don't add hiring
 * statistics without a primary source.
 */

import type { GuideSection } from "@/components/site/seo/guide-page";
import type { SourceItem } from "@/components/site/seo/source-list";

export const RESUME_LENGTH_PUBLISHED = "2026-11-02";
export const RESUME_LENGTH_UPDATED = "2026-11-02";

/** Sources for the federal two-page rule (checked Nov 2, 2026). */
export const RESUME_LENGTH_SOURCES: SourceItem[] = [
  {
    id: "opm-applicants",
    label: "OPM — Applicant Guidance on the Two-Page Resume Limit",
    url: "https://www.opm.gov/policy-data-oversight/hiring-information/merit-hiring-plan-resources/applicant-guidance-on-the-two-page-resume-limit/",
    note: "U.S. Office of Personnel Management guidance for applicants: resumes submitted through USAJOBS are limited to two pages, and the transition period ended on September 27, 2025.",
  },
  {
    id: "usajobs-help",
    label: "USAJOBS Help Center — Update your resume now so it meets new resume requirements",
    url: "https://help.usajobs.gov/faq/application/documents/resume/page-limit",
    note: "USAJOBS will not let you upload or build a resume longer than two pages, and recommends saving your resume as a PDF to keep its formatting and page count.",
  },
  {
    id: "opm-agencies",
    label: "OPM — Agency Guidance on the Two-Page Limit on Resume Length",
    url: "https://www.opm.gov/policy-data-oversight/hiring-information/merit-hiring-plan-resources/agency-guidance-on-the-two-page-limit-on-resume-length/",
    note: "OPM guidance for agencies: the limit covers Title 5 competitive and excepted service announcements; an applicant whose only resume is longer than two pages is ineligible for further consideration; some agencies outside Title 5 may accept longer resumes if the announcement says how.",
  },
];

export type LengthCard = { name: string; audience: string; note: string; featured?: boolean };

/** Overview band under the hero. */
export const LENGTH_CARDS: LengthCard[] = [
  { name: "One page", audience: "Students, new grads, early career", note: "The default until your relevant experience no longer fits.", featured: true },
  { name: "Two pages", audience: "Mid-career and senior", note: "When real, relevant experience fills the second page." },
  { name: "Two pages, max", audience: "Federal jobs on USAJOBS", note: "A hard limit: USAJOBS won't accept a longer resume." },
  { name: "No set limit", audience: "Academic CVs", note: "A full record of research, teaching and publications." },
];

export const LENGTH_QUICK = [
  "One page if you're a student, a recent graduate or early in your career",
  "Two pages when you have enough relevant experience to fill them",
  "Never three pages for a standard US resume",
  "Federal resumes on USAJOBS: two pages at most",
  "Academic CVs run as long as your record — unless the application sets a limit",
  "Cut content before you shrink the font or margins",
];

export const LENGTH_TABLE: string[][] = [
  ["Student or recent graduate", "One page", "Education can go first. Internships, projects and part-time jobs count as experience."],
  ["Early career", "One page", "Two or three jobs with your strongest results. Drop high school and unrelated summer jobs."],
  ["Mid-career", "One or two pages", "Two pages once the relevant experience fills them — a common rule of thumb is around ten years."],
  ["Senior or executive", "Two pages", "Lead with scope and outcomes. Summarize early roles in a line each."],
  ["Career changer", "One page, usually", "Keep what transfers to the new field; one line each for roles that don't."],
  ["Federal (USAJOBS)", "Two pages at most", "A hard limit. Read the announcement for anything else it requires."],
  ["Academic CV", "No set limit", "Grows with publications, grants and teaching. Follow any limit in the application."],
];

export const LENGTH_CUTS = [
  "Jobs older than 10–15 years that have nothing to do with the role — or reduce them to one line each",
  "Bullets that describe duties everyone in the job has, rather than what you achieved",
  "An objective statement; a two-line summary does more",
  "\"References available upon request\" — employers will ask",
  "High school, once you have a college degree or a few years of work",
  "Every tool you've ever touched; keep the ones the job asks for",
  "Hobbies and interests, unless they're directly relevant to the role",
  "A second bullet that makes the same point as the first",
];

export const RESUME_LENGTH_SECTIONS: GuideSection[] = [
  {
    id: "short-answer",
    title: "How long should a resume be?",
    body: [
      "For most job seekers in the US, **one page** is right early in your career and **two pages** once you have enough relevant experience to fill them. A standard US resume shouldn't go beyond two.",
      "Two cases follow different rules. **Federal resumes** submitted through USAJOBS are capped at two pages,[source](#source-opm-applicants) and an **academic CV** has no set length, because it's meant to list your full record. Both are covered below.",
      "The real test isn't the page count but whether every line earns its place. A tight one-page resume beats a padded two-page one, and a two-page resume full of relevant results beats one squeezed into tiny type.",
    ],
  },
  {
    id: "by-experience",
    title: "Resume length by experience level",
    body: ["Use this as a starting point, then adjust for the job you're applying to:"],
    figure: "length-table",
  },
  {
    id: "one-page",
    title: "When one page is the right length",
    body: [
      "Stick to one page if you're a student, a recent graduate, or have a few years of experience. It's also the better choice when you're changing careers and most of your history doesn't relate to the new role, or when a posting or recruiter asks for one page.",
      "One page forces choices, and that's useful: a reader sees only your strongest, most relevant results. If you're short of content, add internships, projects, volunteering or relevant coursework before you stretch the spacing.",
    ],
  },
  {
    id: "two-pages",
    title: "When two pages are better",
    body: [
      "Go to two pages when you have enough **relevant** experience that cutting it would hide something the employer needs to see — typically mid-career and senior roles, or technical and regulated jobs where projects, licenses and certifications take space.",
      "- **Put your best material on page one.** Your summary, current role and strongest results should all appear before the break.\n- **Fill the second page properly.** A few lines spilling onto page two look like an afterthought — either edit down to one page or add relevant detail.\n- **Add your name and a page number** to the second page, so it can't be separated from the first if printed.\n- **Keep the layout identical** on both pages: same fonts, margins and heading style.",
    ],
  },
  {
    id: "what-to-cut",
    title: "What to cut to get to one page (or two)",
    body: [
      "Cut content before you touch the layout. Shrinking the font below 10 pt or the margins below half an inch makes the page harder to read and doesn't fool anyone. Start here:",
    ],
    figure: "cuts",
    after: [
      "Then tighten what's left. Most bullets lose a few words without losing meaning: \"Responsible for managing\" becomes \"Managed\", \"in order to\" becomes \"to\". The [how to write a resume](/how-to-write-a-resume) guide shows how to turn a duty into a short achievement bullet.",
    ],
  },
  {
    id: "word-count",
    title: "Check your length with a word counter",
    body: [
      "Page count depends on your template, font and margins, so the same resume can run to one page in one layout and two in another. Paste your text into the free [resume word counter](/tools/resume-word-counter) to see its word count, an estimated page count, how long your bullets are and which filler phrases you can cut. Nothing is uploaded.",
      "Before you send it, export the final PDF and check the page count there — that's the version the employer sees.",
    ],
  },
  {
    id: "federal",
    title: "Federal resumes: the USAJOBS two-page limit",
    body: [
      "Federal resumes used to run much longer than private-sector ones. That changed in 2025: the Office of Personnel Management (OPM) set a **two-page limit** for resumes submitted through USAJOBS, and the transition period ended on September 27, 2025.[source](#source-opm-applicants)",
      "- **USAJOBS enforces it.** The site won't let you upload or build a resume longer than two pages, so resumes saved to your profile before the change may need editing before you apply.[source](#source-usajobs-help)\n- **A longer resume can cost you the job.** Under OPM's guidance to agencies, an applicant whose only resume is longer than two pages is ineligible for further consideration.[source](#source-opm-agencies)\n- **It covers most announcements.** The limit applies to Title 5 competitive and excepted service announcements. Some agencies outside Title 5 may accept a longer resume, but only when the announcement says so and explains how.[source](#source-opm-agencies)\n- **Save it as a PDF.** USAJOBS recommends uploading a PDF so your formatting and page count stay the same.[source](#source-usajobs-help)",
      "Two pages is a ceiling, not a target. Read each announcement's qualifications and \"How you will be evaluated\" sections, and make sure your resume shows the specific experience they ask for — that matters more than how much you fit in. Rules can change, so check the announcement and the USAJOBS Help Center before you apply.",
    ],
  },
  {
    id: "academic-cv",
    title: "Academic CVs are different",
    body: [
      "In the US, a **curriculum vitae (CV)** is the document for faculty, research and many postdoctoral and graduate school applications. Unlike a resume, it's meant to be complete: education, publications, presentations, grants, teaching, service and awards. It has no conventional page limit and grows as your career does.",
      "Two cautions. First, follow any limit the application sets — some fellowships and grant programs ask for a short CV or a specific format. Second, don't send an academic CV for an industry job. Turn it into a one- or two-page resume that leads with results and skills, and keep publications to the few that matter for the role.",
    ],
  },
  {
    id: "example",
    title: "One page, in practice",
    body: [
      "Here is one of our written resume examples in a LaunchCV template, drawn to scale on a US Letter page. A summary, results-focused bullets, education and a skills line fit on one page with room to spare. Before you move to two pages, ask whether your extra lines are as relevant as these.",
    ],
    figure: "example",
    after: ["Find more by role on the [resume examples](/resume-examples) page, and the layout rules behind them in the [resume format](/resume-format) guide."],
  },
];

export const RESUME_LENGTH_FAQS: { q: string; a: string }[] = [
  {
    q: "Is a two-page resume OK?",
    a: "Yes, when you have enough relevant experience to fill both pages — usually mid-career or senior roles. Put your strongest material on page one and fill most of page two, or edit down to one.",
  },
  {
    q: "Should a resume be one page?",
    a: "One page is the right default for students, recent graduates and people early in their career. It's no longer a strict rule once you have more relevant experience than one page can hold.",
  },
  {
    q: "Can a resume be three pages?",
    a: "Not for a standard US job application. Three pages or more are for academic CVs. Federal resumes submitted through USAJOBS are limited to two pages.",
  },
  {
    q: "How long can a federal resume be?",
    a: "Two pages at most for resumes submitted through USAJOBS. The site won't accept a longer one, and under OPM guidance an applicant whose only resume is longer than two pages is ineligible for further consideration.",
  },
  {
    q: "How far back should a resume go?",
    a: "Usually the last 10 to 15 years. Older jobs that relate to the role can stay as a single line each; unrelated ones can go.",
  },
  {
    q: "Should I make the font smaller to fit one page?",
    a: "No. Keep body text at 10–12 pt and margins at about 0.5 to 1 inch, and cut content instead. A cramped page is harder to read than a well-filled second page.",
  },
  {
    q: "What's the difference between a CV and a resume in the US?",
    a: "A resume is a short, tailored summary of your experience for a specific job, usually one or two pages. A CV is a complete academic record used for faculty, research and many graduate school applications, and has no set length.",
  },
];

export const RESUME_LENGTH_READING: string[] = ["how-to-write-an-ats-friendly-resume", "how-to-tailor-your-resume-for-every-job"];

/** Resume example shown at the end of the guide. */
export const RESUME_LENGTH_EXAMPLE = "software-engineer";
