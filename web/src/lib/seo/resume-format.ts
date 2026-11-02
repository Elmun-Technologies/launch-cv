/**
 * Content for the /resume-format pillar guide.
 *
 * Body copy is Markdown (rendered with the blog's typography). Any number in
 * the copy must point at an entry in RESUME_FORMAT_SOURCES via a footnote link
 * like [source](#source-ladders); don't add unsourced statistics. LaunchCV facts
 * (templates, PDF settings, import formats) come from the codebase:
 * lib/resume-templates.ts, lib/pdf/resume-pdf.tsx, app/resume/new.
 */

export const RESUME_FORMAT_PUBLISHED = "2026-11-02";
export const RESUME_FORMAT_UPDATED = "2026-11-02";

export type FormatSource = { id: string; label: string; url: string; note: string };

/** External sources behind every statistic on the page (checked Nov 2, 2026). */
export const RESUME_FORMAT_SOURCES: FormatSource[] = [
  {
    id: "jobscan-f500",
    label: "Jobscan — 2026 Applicant Tracking System (ATS) Usage Report",
    url: "https://www.jobscan.co/blog/fortune-500-use-applicant-tracking-systems/",
    note: "Jobscan's 2026 check of Fortune 500 career sites detected an applicant tracking system at 97.4% of the companies (487 of 500); its 2025 edition found 97.8%.",
  },
  {
    id: "ladders",
    label: "HR Dive — Eye-tracking study shows recruiters look at resumes for 7 seconds (Ladders, 2018)",
    url: "https://www.hrdive.com/news/eye-tracking-study-shows-recruiters-look-at-resumes-for-7-seconds/541582/",
    note: "Ladders' 2018 eye-tracking study: an average initial resume screen of 7.4 seconds; cluttered layouts, multiple columns and long sentences performed worse.",
  },
  {
    id: "resumego",
    label: "ResumeGo — Settling the debate: one or two page resumes (2018)",
    url: "https://www.resumego.net/research/one-or-two-page-resumes/",
    note: "Simulated hiring study by a resume-writing company: 482 hiring professionals picked two-page resumes 2.3 times as often as one-page versions, with the gap widest for mid-level and management roles.",
  },
  {
    id: "resumego-survey",
    label: "ResumeGo — Survey: How long should a resume be? (2024)",
    url: "https://www.resumego.net/research/how-long-should-a-resume-be/",
    note: "Survey by the same company: 92% of 418 hiring professionals advised keeping a resume to one page.",
  },
];

export type FormatKind = {
  id: "chronological" | "hybrid" | "functional";
  name: string;
  short: string;
  verdict: string;
  /** Visual tone of the overview card. */
  featured?: boolean;
};

export const FORMAT_KINDS: FormatKind[] = [
  {
    id: "chronological",
    name: "Chronological",
    short: "Most recent job first. What recruiters and parsers expect.",
    verdict: "Best for almost everyone",
    featured: true,
  },
  {
    id: "hybrid",
    name: "Hybrid",
    short: "A short skills section on top, then chronological experience.",
    verdict: "Career changers, technical roles",
  },
  {
    id: "functional",
    name: "Functional",
    short: "Skills grouped by theme, jobs listed briefly or not at all.",
    verdict: "Rarely — parsers and recruiters distrust it",
  },
];

export const QUICK_RULES = [
  "Reverse-chronological order: most recent job first",
  "One column; no tables, text boxes or icons in place of words",
  "Standard headings: Summary, Experience, Education, Skills",
  "One page early in your career, two once you have the experience to fill them",
  "A text-based PDF, unless the posting asks for Word",
];

export const FORMAT_TABLE: { format: string; bestFor: string; watchOut: string }[] = [
  {
    format: "Chronological",
    bestFor: "A steady work history in the field you're applying to — most job seekers.",
    watchOut: "Gaps and short stints are easy to spot; explain them briefly instead of hiding them.",
  },
  {
    format: "Hybrid (combination)",
    bestFor: "Career changers, returning workers and technical roles where tools are the first filter.",
    watchOut: "Keep the skills block short. If it pushes your experience to page two, it's too long.",
  },
  {
    format: "Functional",
    bestFor: "Very rare cases, such as a portfolio-driven career with little conventional employment.",
    watchOut: "Without dates under each job, recruiters assume you're hiding something and parsers can't build your history.",
  },
];

export type FormatSection = {
  id: string;
  title: string;
  /** Markdown paragraphs and lists, rendered in order. */
  body: string[];
  /** Optional illustration rendered by the page after the body. */
  figure?: "formats-table" | "section-order" | "templates";
  /** More Markdown after the figure. */
  after?: string[];
};

export const FORMAT_SECTIONS: FormatSection[] = [
  {
    id: "which-format",
    title: "Which resume format to use",
    body: [
      "For most job seekers in the US, a **reverse-chronological** format is the right choice: your most recent job first, each with a title, an employer, dates and a few results. It's what recruiters scan for, and it's the structure applicant tracking systems are built to read.",
      "That matters because the software usually reads your resume before a person does. Jobscan's 2026 check of Fortune 500 career sites detected an applicant tracking system at 487 of the 500 companies (97.4%).[source](#source-jobscan-f500) When a person does look, the first pass is short: in Ladders' 2018 eye-tracking study, recruiters spent an average of 7.4 seconds on an initial screen.[source](#source-ladders) A familiar layout lets both find what they need.",
      "Use a **hybrid** format when your skills matter more than your last job title — a career change, or a technical role where tools are the first filter. Avoid the **functional** format: hiding dates makes recruiters wonder why.",
    ],
  },
  {
    id: "format-types",
    title: "Chronological, hybrid and functional",
    body: [
      "### Chronological (reverse-chronological)",
      "Contact details, a two- or three-line summary, then **Experience** with your current or latest job first. Under each job: title, employer, location, start and end dates, and three to six bullets that show results. Education and skills follow. Choose it whenever your recent jobs are relevant to the one you want.",
      "### Hybrid (combination)",
      "The same structure with a short **Skills** or **Core skills** block near the top, so a reader sees your strongest qualifications first. Your experience is still listed in reverse-chronological order with dates. It suits career changers, people returning after a break, and roles like engineering or data where a recruiter first checks for specific tools.",
      "### Functional (skills-based)",
      "Experience is grouped by skill theme (\"Project management\", \"Client relations\") and jobs appear as a bare list, or not at all. It's meant to hide gaps, and readers know it. ATS parsers also expect each accomplishment to sit under a job with dates; without that, your history can come out empty. If you're tempted by a functional resume, a hybrid usually does the job better.",
    ],
    figure: "formats-table",
  },
  {
    id: "section-order",
    title: "Section order",
    body: [
      "Put the sections in the order a recruiter reads them, and name them the way the software expects:",
      "1. **Contact details** — name, city and state, phone, email, and a LinkedIn or portfolio link if you have one.\n2. **Summary** — two or three lines on who you are and what you're best at. Optional, but useful for a career change.\n3. **Experience** — most recent first. This is the section that gets read.\n4. **Education** — degree, school and year. Move it above Experience only if you graduated in the last year or two and have little work history.\n5. **Certifications and awards** — licenses, certifications or awards that matter for the job. Skip the section if you have none.\n6. **Skills** — one line or a short list of tools and languages. In a hybrid resume, a short version moves near the top.",
      "Plain headings matter more than clever ones. \"Experience\" and \"Work experience\" are recognized everywhere; \"Where I've made an impact\" may not be.",
    ],
    figure: "section-order",
  },
  {
    id: "length",
    title: "Length: one page or two?",
    body: [
      "Aim for **one page** if you're a student, a recent graduate or have only a few years of experience. Go to **two pages** when you have enough relevant experience to fill them — a common rule of thumb is around ten years or a senior role. Three pages or more are for academic CVs and some federal applications, not a standard US resume.",
      "The research is mixed, which is why the answer depends on your experience. In a 2018 simulated hiring study by the resume service ResumeGo, 482 hiring professionals chose two-page resumes 2.3 times as often as one-page versions of the same candidates, with the gap widest for mid-level and management roles.[source](#source-resumego) Yet in the same company's 2024 survey, 92% of 418 hiring professionals said to stick to one page.[source](#source-resumego-survey) Read together: a tight one-page resume is the safe default, and a second page is fine when real, relevant experience fills it — never as padding.",
      "What to cut first: jobs older than 10–15 years that aren't relevant, duties that every person in the role does, and a separate \"References available upon request\" line.",
    ],
  },
  {
    id: "layout-fonts",
    title: "Layout, fonts and margins",
    body: [
      "- **One column.** Text flows top to bottom; nothing sits side by side.\n- **Fonts:** a common sans-serif (Arial, Helvetica, Calibri) or serif (Georgia, Times New Roman), 10–12 pt for body text and 14–20 pt for your name. Stick to one or two fonts.\n- **Margins:** about 0.5 to 1 inch on every side. Below half an inch, the page looks cramped when printed.\n- **Paper size:** US Letter (8.5 × 11 in) is the US standard if you print. For online applications, the ATS reads the text, not the page size.\n- **Bullets** for achievements, short paragraphs only for your summary. Bold your job titles so they stand out in a quick scan.\n- **White space** between sections. It's what lets someone find your last job title in a few seconds.",
      "For reference, LaunchCV's templates are one column with plain-text headings; in the US layout, body text is 10 pt, your name 18 pt and the margins half an inch, in a sans-serif or serif font that's metric-compatible with Helvetica or Times.",
    ],
  },
  {
    id: "dates-contact",
    title: "Dates and contact details",
    body: [
      "**Dates:** use one format for every job and stick to it — \"Apr 2021 – Present\" or \"04/2021 – Present\", not a mix. Put the dates on the same line as each job or right below it. Month and year are enough; years alone can look like you're hiding a gap.",
      "**Contact details:** your name, city and state, phone number and a professional email address, as plain text at the top of the page — not in the document's header or footer area, which some parsers skip. A full street address isn't needed. Add a LinkedIn URL or portfolio if it helps your case.",
      "**Leave off** a photo, date of birth, marital status and Social Security number. None of them is expected on a US resume.",
    ],
  },
  {
    id: "ats-parsing",
    title: "What ATS parsers struggle with",
    body: [
      "An applicant tracking system converts your file to plain text and tries to sort it into fields: name, job titles, employers, dates, skills. These layouts are the usual reasons it gets that wrong:",
      "- **Multiple columns.** Parsers often read straight across the page, mixing your sidebar into your job history. Ladders' study also found multi-column layouts performed worse with human readers.[source](#source-ladders)\n- **Tables.** Cells can be read out of order or dropped.\n- **Text boxes and shapes.** Text inside them is often skipped entirely.\n- **Headers and footers.** Contact details placed there may never reach your profile.\n- **Images, icons and logos.** A phone icon instead of the word \"Phone\", or skill-rating bars, can't be read as text.\n- **Unusual headings.** Creative section names can stop the parser from recognizing your experience.\n- **Scanned or image-only PDFs.** If you can't select the text in your PDF, neither can the software.",
      "You can see exactly how your file reads with LaunchCV's [free ATS check](/free-ats-check): it flags columns, tables, missing contact details and inconsistent dates, and needs no account. For the words themselves, see the [resume keywords](/resume-keywords) lists by role.",
    ],
  },
  {
    id: "file-type",
    title: "File type: PDF or Word",
    body: [
      "**Follow the posting first.** If it asks for a Word document, send a .docx; if it asks for a PDF, send that.",
      "When it doesn't say, a **text-based PDF** is a sensible default: it keeps your layout identical on every screen, and applicant tracking systems can read it as long as the text is real text — exported from a builder or word processor, not scanned or saved as an image. Some parsers still handle Word files more reliably, so a .docx is the safer pick for older portals or when a recruiter wants to edit the file.",
      "Name the file plainly — `Firstname-Lastname-Resume.pdf` — and never send a .pages, image or zipped file. LaunchCV exports PDF; it also imports PDF and Word (.docx) files, so you can bring an existing resume in and keep it in one place.",
    ],
  },
  {
    id: "templates",
    title: "Templates and examples in this format",
    body: [
      "Every LaunchCV template is a one-column, reverse-chronological layout with plain headings, and all four are free with an account, including the PDF export. The previews below are the real templates rendered with sample resumes from our [resume examples](/resume-examples).",
    ],
    figure: "templates",
    after: [
      "Pick one on the [resume templates](/resume-templates) page, or start from a written example for your role and edit it with your own experience.",
    ],
  },
];

export const RESUME_FORMAT_FAQS: { q: string; a: string }[] = [
  {
    q: "What is the best resume format in 2026?",
    a: "Reverse-chronological for most people: your most recent job first, in one column, with standard headings like Experience, Education and Skills, saved as a text-based PDF unless the posting asks for Word.",
  },
  {
    q: "What is the difference between a chronological and a hybrid resume?",
    a: "Both list your jobs most recent first with dates. A hybrid adds a short skills section near the top, so a reader sees your strongest qualifications before your job history. It suits career changers and technical roles.",
  },
  {
    q: "Is a functional resume a bad idea?",
    a: "Usually. It groups experience by skill and hides dates, which recruiters read as a red flag and ATS parsers struggle to turn into a work history. A hybrid resume highlights skills without dropping the dates.",
  },
  {
    q: "Should my resume be one page or two?",
    a: "One page if you're early in your career, two when you have enough relevant experience to fill them — often around ten years or a senior role. Cut old or irrelevant jobs before you shrink the font.",
  },
  {
    q: "Should I send my resume as a PDF or a Word document?",
    a: "Send whatever the posting asks for. If it doesn't say, a text-based PDF keeps your layout intact and can be read by applicant tracking systems; a .docx is safer for older portals or when a recruiter wants to edit it.",
  },
  {
    q: "What font size and margins should a resume use?",
    a: "Body text at 10–12 pt in a common font such as Arial, Calibri, Georgia or Times New Roman, your name at 14–20 pt, and margins of about 0.5 to 1 inch on every side.",
  },
  {
    q: "Can an ATS read a two-column resume?",
    a: "Often not reliably. Many parsers read across the page, so text from two columns gets mixed together. A one-column layout is the safest choice; check yours with a free ATS check to see how it reads.",
  },
];

/** Blog posts to read next (slugs from lib/blog-posts.ts). */
export const RESUME_FORMAT_READING: string[] = [
  "how-to-write-an-ats-friendly-resume",
  "what-is-ats-and-how-does-it-work",
  "how-to-tailor-your-resume-for-every-job",
  "how-to-check-ats-score-of-resume",
];
