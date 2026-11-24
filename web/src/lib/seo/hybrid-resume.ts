/**
 * Content for the /hybrid-resume guide: what a hybrid (combination) resume
 * is, when to use it, how it compares with chronological and functional
 * formats, a fill-in template and three finished examples. Plain advice, no
 * statistics. Names and companies in the examples are made up; the template
 * uses [bracketed] placeholders.
 */

import type { GuideSection } from "@/components/site/seo/guide-page";
import type { FaqItem } from "@/lib/faq-ld";

export const HYBRID_RESUME_PUBLISHED = "2026-11-24";
export const HYBRID_RESUME_UPDATED = "2026-11-24";

/** A resume rendered as plain sections. Lines starting with "- " are bullets. */
export type HybridDoc = {
  name: string;
  contact: string;
  sections: { heading: string; lines: string[] }[];
};

export type HybridExample = { id: string; title: string; note: string; doc: HybridDoc };

export function hybridPlainText(d: HybridDoc): string {
  return [d.name, d.contact, ...d.sections.flatMap((s) => ["", s.heading.toUpperCase(), ...s.lines.map((l) => (l.startsWith("- ") ? `• ${l.slice(2)}` : l))])].join("\n");
}

export const HYBRID_QUICK = [
  "A hybrid resume puts a skills section near the top, then lists your jobs most recent first, with dates",
  "Use it for a career change, a technical role, or when your skills matter more than your last job title",
  "Keep every job dated and every achievement under the job where it happened",
  "Aim for 4 to 8 skill lines with proof, not a long list of buzzwords",
  "It reads well in applicant tracking systems as long as you use one column and standard headings",
];

export const HYBRID_WHEN: string[] = [
  "You're changing careers and your last job title doesn't match the role",
  "You're applying for a technical job where tools and certifications are the first filter",
  "You're returning to work after a gap and want your skills to lead",
  "You've held several short or contract roles and want one clear story at the top",
  "You're a recent graduate with projects and internships that show more than your job titles",
];

export const HYBRID_COMPARE: { format: string; order: string; bestFor: string; risk: string }[] = [
  {
    format: "Chronological",
    order: "Summary → Experience (newest first) → Education → Skills",
    bestFor: "Steady progress in one field",
    risk: "Hides strong skills if your titles don't show them",
  },
  {
    format: "Hybrid (combination)",
    order: "Summary → Key skills with proof → Experience (newest first) → Education",
    bestFor: "Career changers, technical roles, returning to work",
    risk: "Gets long if the skills section repeats your bullets",
  },
  {
    format: "Functional",
    order: "Skills groups → short job list, often without dates",
    bestFor: "Rarely the best choice",
    risk: "Recruiters read missing dates as a red flag; parsers lose your history",
  },
];

export const HYBRID_TEMPLATE: HybridDoc = {
  name: "[Your Name]",
  contact: "[City, State] · [Email] · [Phone] · [LinkedIn URL]",
  sections: [
    {
      heading: "Summary",
      lines: ["[Target job title] with [number] years of [relevant background]. Strong in [skill 1], [skill 2] and [skill 3]. [One line on what you want to do next.]"],
    },
    {
      heading: "Key skills",
      lines: [
        "- [Skill area 1]: [what you did with it, with a number or result]",
        "- [Skill area 2]: [what you did with it, with a number or result]",
        "- [Skill area 3]: [what you did with it, with a number or result]",
        "- Tools: [tool], [tool], [tool], [certification]",
      ],
    },
    {
      heading: "Experience",
      lines: [
        "[Job Title] — [Company], [City, State] | [Month Year] – [Month Year]",
        "- [Achievement that proves skill area 1]",
        "- [Achievement that proves skill area 2]",
        "",
        "[Job Title] — [Company], [City, State] | [Month Year] – [Month Year]",
        "- [Achievement]",
        "- [Achievement]",
      ],
    },
    {
      heading: "Education & certifications",
      lines: ["[Degree or certificate] — [School or issuer], [Year]"],
    },
  ],
};

export const HYBRID_EXAMPLES: HybridExample[] = [
  {
    id: "example-career-change",
    title: "Hybrid resume example: teacher to project coordinator",
    note: "A career changer. The skills section translates classroom work into project terms before the reader sees the job title.",
    doc: {
      name: "Maya Thompson",
      contact: "Columbus, OH · maya.thompson@email.com · (614) 555-0182 · linkedin.com/in/mayathompson",
      sections: [
        { heading: "Summary", lines: ["Project coordinator with eight years of planning and running programs in public schools. Google Project Management certified. Known for keeping large groups on schedule and explaining plans to people who don't love details."] },
        {
          heading: "Key skills",
          lines: [
            "- Scheduling and planning: built the yearly schedule for a 12-teacher department, 180 school days and 40 shared deadlines",
            "- Stakeholder communication: ran monthly updates for 150+ families and presented results to the school board",
            "- Budget tracking: managed a $25,000 program budget in Google Sheets with zero overruns over three years",
            "- Tools: Asana, Google Workspace, Excel, Zoom; Google Project Management Certificate",
          ],
        },
        {
          heading: "Experience",
          lines: [
            "Science Teacher & Department Lead — Westfield High School, Columbus, OH | Aug 2018 – Present",
            "- Led a curriculum rollout across 12 teachers, delivered a semester ahead of plan",
            "- Set up an Asana board for department tasks that cut missed deadlines to almost none in one year",
            "- Organized the district STEM fair for 400 students, 30 volunteers and 6 sponsors",
            "",
            "Science Teacher — Lincoln Middle School, Columbus, OH | Aug 2016 – Jun 2018",
            "- Coordinated field trips for 120 students, including budgets, permissions and transport",
          ],
        },
        { heading: "Education & certifications", lines: ["Google Project Management Certificate — Coursera, 2025", "B.S. Biology — Ohio State University, 2016"] },
      ],
    },
  },
  {
    id: "example-it",
    title: "Hybrid resume example: IT support specialist",
    note: "A technical role, where the tools and certifications decide who gets a call. Skills go first, and each job still has dates.",
    doc: {
      name: "Daniel Ruiz",
      contact: "Phoenix, AZ · druiz@email.com · (602) 555-0147 · github.com/druiz",
      sections: [
        { heading: "Summary", lines: ["IT support specialist with four years in help desk and desktop support for teams of 50 to 300. CompTIA A+ and Network+ certified. Calm with frustrated users and careful with documentation."] },
        {
          heading: "Key skills",
          lines: [
            "- Help desk: resolved 35 to 45 tickets a day in Jira Service Management with a 4.8/5 user rating",
            "- Device management: set up and patched 250 laptops with Intune and Jamf",
            "- Accounts and access: managed Active Directory and Microsoft 365 for 300 users",
            "- Tools: Windows 11, macOS, Intune, Jamf, Active Directory, Microsoft 365, PowerShell",
          ],
        },
        {
          heading: "Experience",
          lines: [
            "IT Support Specialist — Desert Ridge Health, Phoenix, AZ | Mar 2023 – Present",
            "- Wrote 60 knowledge-base articles that cut repeat password tickets by about a third",
            "- Moved 120 users to new laptops over two weekends with no lost data",
            "",
            "Help Desk Technician — Sunline Logistics, Tempe, AZ | Jun 2021 – Feb 2023",
            "- First-line support for 3 warehouses; escalated network issues with clear notes and screenshots",
          ],
        },
        { heading: "Education & certifications", lines: ["CompTIA Network+ — 2024", "CompTIA A+ — 2021", "A.A.S. Information Technology — Mesa Community College, 2021"] },
      ],
    },
  },
  {
    id: "example-return-to-work",
    title: "Hybrid resume example: returning to work after a gap",
    note: "Back after five years at home. The gap is shown honestly, and the skills section shows what's current.",
    doc: {
      name: "Priya Shah",
      contact: "Austin, TX · priya.shah@email.com · (512) 555-0129 · linkedin.com/in/priyashah",
      sections: [
        { heading: "Summary", lines: ["Accounts payable specialist with six years of experience, returning to work after a planned career break. Refreshed skills in QuickBooks Online and NetSuite in 2026. Accurate, organized and fast with month-end work."] },
        {
          heading: "Key skills",
          lines: [
            "- Accounts payable: processed 300+ invoices a month with three-way matching",
            "- Month-end close: prepared accruals and reconciliations for a $40M distributor",
            "- Volunteer finance: treasurer for a 200-family school PTA, ran a $60,000 annual budget",
            "- Tools: QuickBooks Online, NetSuite, Excel (pivot tables, XLOOKUP)",
          ],
        },
        {
          heading: "Experience",
          lines: [
            "Career break — family caregiving | Jun 2021 – Present",
            "- PTA Treasurer (volunteer), 2023 – Present; completed QuickBooks Online certification, 2026",
            "",
            "Accounts Payable Specialist — Hill Country Supply, Austin, TX | Mar 2015 – May 2021",
            "- Cut late-payment fees to zero by building a weekly due-date report",
            "- Trained two new hires on vendor setup and invoice coding",
          ],
        },
        { heading: "Education & certifications", lines: ["QuickBooks Online Certified User — 2026", "B.B.A. Accounting — Texas State University, 2014"] },
      ],
    },
  },
];

export const HYBRID_RESUME_SECTIONS: GuideSection[] = [
  {
    id: "what-is",
    title: "What is a hybrid resume?",
    body: [
      "A hybrid resume, also called a combination resume, starts with a short summary and a skills section, then lists your work history in reverse-chronological order with dates. It takes the strength of a skills-based resume (your best qualifications come first) without the weakness (missing dates and a hidden job history).",
      "The key difference from a plain chronological resume is the skills section near the top. Each skill line should carry proof: what you did and, where you can, a number. A list of adjectives doesn't count.",
    ],
  },
  {
    id: "when",
    title: "When to use a hybrid resume",
    body: ["A hybrid format earns its place when your job titles alone don't tell the reader you can do the job:"],
    figure: "when",
    after: [
      "If your last few titles already match the job you want, a standard chronological resume is simpler and works just as well. See the [resume format guide](/resume-format) for the full comparison.",
    ],
  },
  {
    id: "compare",
    title: "Hybrid vs chronological vs functional",
    body: ["All three use the same sections. What changes is the order, and whether your jobs keep their dates."],
    figure: "compare",
  },
  {
    id: "order",
    title: "Hybrid resume section order",
    body: [
      "1. **Contact details** — name, city and state, phone, email, LinkedIn or portfolio.\n2. **Summary** — two or three lines: the job you're targeting, your years of relevant background and your strongest skills.\n3. **Key skills** — four to eight lines, each a skill area plus proof. End with one line of tools and certifications.\n4. **Experience** — most recent first, with company, location and dates. Put the bullets that prove your top skills first under each job.\n5. **Education and certifications** — degree, school and year; recent courses or certificates if they support a change.",
      "Keep it to one page if you have under ten years of experience, two at most otherwise. The [resume length guide](/resume-length) covers when two pages are fine.",
    ],
  },
  {
    id: "template",
    title: "Hybrid resume template",
    body: ["Copy the text, or download it as a Word file, then replace every [bracketed] placeholder:"],
    figure: "template",
  },
  {
    id: "examples",
    title: "Hybrid resume examples",
    body: [
      "Three finished examples for the situations where a hybrid format helps most. Use them as a model for the structure, then write your own content.",
    ],
    figure: "examples",
  },
  {
    id: "ats",
    title: "Is a hybrid resume ATS-friendly?",
    body: [
      "Yes, if you keep the layout simple. Applicant tracking systems look for standard headings and jobs with dates, and a hybrid resume has both. Problems come from the design, not the format: two columns, tables, text boxes, icons for contact details and skill bars can all scramble the parsed result.",
      "Use one column, standard headings (\"Key skills\", \"Experience\", \"Education\") and save as PDF unless the posting asks for Word. You can check how a parser reads your file with the [free ATS check](/free-ats-check).",
    ],
  },
  {
    id: "tips",
    title: "Tips for writing a hybrid resume",
    body: [
      "- **Pick skills from the job posting.** Your skills section should mirror the three or four things the posting asks for most, in its own words where it's honest.\n- **Prove each skill once at the top, then again under a job.** The skills line is the claim; the job bullet is where it happened.\n- **Don't repeat bullets word for word.** Summarize in the skills section and give the detail under the job.\n- **Keep the dates.** Leaving them off is what turns a hybrid resume into a functional one.\n- **Show gaps plainly.** A one-line entry like \"Career break — family caregiving\" is better than a silent hole.",
    ],
  },
];

export const HYBRID_RESUME_FAQS: FaqItem[] = [
  { q: "What is a hybrid resume?", a: "A resume that opens with a summary and a skills section, then lists your jobs most recent first with dates. It's also called a combination resume." },
  { q: "Is a hybrid resume the same as a combination resume?", a: "Yes. Hybrid and combination are two names for the same format: skills near the top, followed by a dated, reverse-chronological work history." },
  { q: "When should I use a hybrid resume?", a: "When your job titles don't show what you can do: a career change, a technical role where tools are the first filter, a return to work after a gap, or a run of short contract jobs." },
  { q: "Is a hybrid resume good for ATS?", a: "Yes, as long as it's one column with standard headings and every job has dates. Avoid tables, text boxes and skill bars, which parsers often misread." },
  { q: "How long should a hybrid resume be?", a: "One page for most people with under ten years of experience; two pages if you have more and every line earns its place." },
  { q: "What's the difference between a hybrid and a functional resume?", a: "A hybrid keeps your jobs and dates in reverse-chronological order under the skills section. A functional resume groups everything by skill and often drops dates, which recruiters and parsers both dislike." },
];

export const HYBRID_RESUME_READING: string[] = ["how-to-tailor-your-resume-for-every-job"];
