import { ResumeSheet } from "@/components/site/resume-sheet";
import { FeaturePage, Stage, ExampleTag, BeforeAfter, type FeaturePageData } from "@/components/marketing/feature-page";
import { buildMarketingMetadata, FEATURES_OG_IMAGE } from "@/lib/build-metadata";
import { entryPriceLabel } from "@/lib/monetization";

export const metadata = buildMarketingMetadata({
  title: "AI Resume Builder — ATS-Friendly, PDF & Word Export",
  description:
    "Build or import your resume, rewrite weak bullets with AI, pick one of 4 ATS-friendly templates and download a PDF or Word file. Check your ATS score free.",
  pathname: "/features/resume-builder",
  image: FEATURES_OG_IMAGE,
  keywords: [
    "AI resume builder",
    "ATS friendly resume builder",
    "resume builder with templates",
    "online resume maker",
    "resume bullet point generator",
  ],
});

const TEMPLATES = ["Classic", "Modern", "Minimal", "Executive"];

const stage = (
  <Stage bg="#5440e8" poster="BUILD" posterColor="#6a58ee">
    <ResumeSheet
      example="product-manager"
      className="absolute bottom-0 right-4 h-[230px] w-[190px] [--peek:0.233] sm:h-[300px] sm:w-[240px] sm:[--peek:0.294] lg:right-6 lg:h-[420px] lg:w-[300px] lg:[--peek:0.368]"
    />
    <div className="lc-float lc-drift absolute left-4 top-[88px] w-[220px] rounded-[18px] bg-white p-3.5 text-[#121226] sm:w-[280px] lg:left-8 lg:top-[150px] lg:w-[290px] xl:w-[330px] lg:rounded-[22px] lg:p-[18px]">
      <p className="flex justify-between gap-2 text-[11px] font-bold tracking-[0.06em] text-[#66647c] lg:text-[12px]">
        <span>EXPERIENCE · BULLET 2</span>
        <ExampleTag />
      </p>
      <p className="mt-1.5 text-[13px] text-[#66647c] line-through lg:mt-2 lg:text-[14px]">Responsible for onboarding</p>
      <p className="mt-1 text-[14px] font-semibold leading-[19px] lg:text-[16px] lg:leading-[22px]">Redesigned onboarding; week-1 activation rose from 38% to 57%.</p>
      <div className="mt-2.5 flex gap-1.5 lg:mt-3">
        <span className="rounded-full bg-[#5440e8] px-2.5 py-[5px] text-[12px] font-bold text-white">Use rewrite</span>
        <span className="rounded-full bg-[#f1eff8] px-2.5 py-[5px] text-[12px] font-bold">Keep mine</span>
      </div>
    </div>
    <div className="lc-float lc-drift-2 absolute left-4 top-[250px] rounded-[18px] bg-white p-3 text-[#121226] lg:left-8 lg:top-[400px] lg:rounded-[22px] lg:p-[18px]">
      <p className="sr-only">Templates:</p>
      <ul className="grid grid-cols-2 gap-1.5 lg:flex">
        {TEMPLATES.map((t) => (
          <li key={t} className={`rounded-full px-3 py-[7px] text-center text-[12px] font-semibold lg:text-[13px] ${t === "Modern" ? "bg-[#c9c0ff]" : "bg-[#f1eff8]"}`}>
            {t}
          </li>
        ))}
      </ul>
    </div>
    <span className="lc-poster absolute bottom-6 left-6 -rotate-[5deg] rounded-full bg-[#ff7a33] px-[15px] py-[9px] text-[12px] text-[#111118] lg:bottom-10 lg:left-10 lg:text-[13px]">
      FREE PDF
    </span>
  </Stage>
);

const f: FeaturePageData = {
  path: "/features/resume-builder",
  name: "Resume Builder",
  h1: "A resume builder that reads like the software.",
  h1Tail: "One column, plain headings, results in every bullet.",
  lead:
    "Start from scratch, import a file or paste your LinkedIn profile. Fill in each section with a live preview, turn duty-style bullets into results with AI, and export a PDF that applicant tracking systems can parse.",
  facts: ["4 ATS-friendly templates", "Import PDF, DOCX or LinkedIn", "Preview matches the PDF"],
  cta: { label: "Build my resume — free", href: `/register?next=${encodeURIComponent("/resume/new")}` },
  stage,
  example: {
    title: "What the bullet rewrite does.",
    caption: "Example rewrite. Suggestions keep your facts; if no number can be inferred, the wording changes instead of a figure being invented.",
    body: (
      <div className="flex flex-col gap-3 sm:gap-4">
        <BeforeAfter
          before="Responsible for onboarding new customers."
          after="Owned onboarding for new B2B customers, cutting time to first value from 14 days to 6."
        />
        <BeforeAfter before="Helped the team with reporting." after="Built the weekly revenue report the sales team used to prioritize renewals." />
      </div>
    ),
  },
  stepsTail: "From blank page to PDF.",
  steps: [
    { t: "Start or import", d: "Begin with a blank resume, upload a PDF or DOCX, or paste your LinkedIn profile text." },
    { t: "Fill each section", d: "Contact, summary, experience, education, skills, certifications and achievements — with a live preview." },
    { t: "Rewrite with AI", d: "Turn duty-style bullets into results. You review every suggestion before it's applied." },
    { t: "Pick a template and export", d: "Choose Classic, Modern, Minimal or Executive and download a PDF, or a Word file when a posting asks for .docx." },
  ],
  gets: [
    { t: "Live preview", d: "The preview is the same layout as the PDF, so what you see is what recruiters get." },
    { t: "4 templates", d: "All one column with standard headings — the layout ATS parsers read reliably." },
    { t: "AI bullet rewrites", d: "Lead with the outcome, keep the facts. Accept, edit or ignore each one." },
    { t: "Import", d: "Bring in an existing resume file or your LinkedIn profile text instead of retyping it." },
    { t: "Versions", d: "Save snapshots and restore an earlier version at any time." },
    { t: "Consistency check", d: "Flags mismatched dates, formats and claims across your resume." },
  ],
  banner: {
    title: "Written for people, readable by software.",
    text: "Clean PDFs with real text — names, dates and skills a parser can pick up, in any language your name is written in.",
    note: `The editor, all four templates and PDF and Word downloads are free. AI rewrites come with paid plans from ${entryPriceLabel()}.`,
  },
  faqs: [
    {
      q: "Are LaunchCV templates ATS-friendly?",
      a: "Yes. All four templates are one column with plain-text headings and no tables, icons or text boxes, which are the things that most often break parsing.",
    },
    {
      q: "Can I import my existing resume?",
      a: "Yes. Upload a PDF or DOCX, or paste your LinkedIn profile text, and the sections are filled in for you to review.",
    },
    {
      q: "Which file formats can I export?",
      a: "PDF. It's text-based, so applicant tracking systems can read it, and it embeds fonts for non-Latin names.",
    },
    {
      q: "Does the AI make things up?",
      a: "It's instructed not to invent numbers or facts. When no metric can be inferred, it improves the wording instead. You approve every change.",
    },
    {
      q: "Is the resume builder free?",
      a: "You can create an account and run the free ATS check without paying. The AI rewrites and other AI tools are included in every paid plan.",
    },
  ],
  related: [
    { kind: "Tool", label: "Match your resume to a job", href: "/features/jd-alignment" },
    { kind: "Guide", label: "How to write an ATS-friendly resume", href: "/blog/how-to-write-an-ats-friendly-resume" },
    { kind: "Examples", label: "Resume examples by job", href: "/resume-examples" },
  ],
};

export default function ResumeBuilderPage() {
  return <FeaturePage f={f} />;
}
