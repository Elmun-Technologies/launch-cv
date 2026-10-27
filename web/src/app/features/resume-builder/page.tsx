import { FeaturePage, BeforeAfter, type FeaturePageData } from "@/components/marketing/feature-page";
import { buildMarketingMetadata, FEATURES_OG_IMAGE } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "AI Resume Builder — ATS-Friendly Resume, PDF Export",
  description:
    "Build or import your resume, rewrite weak bullets with AI, pick one of 4 ATS-friendly templates and download a clean PDF. Check your ATS score free first.",
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

const f: FeaturePageData = {
  path: "/features/resume-builder",
  name: "Resume Builder",
  h1: "A resume builder that reads like the software.",
  h1Tail: "One column, plain headings, results in every bullet.",
  lead:
    "Start from scratch, import a file or paste your LinkedIn profile. Fill in each section with a live preview, turn duty-style bullets into results with AI, and export a PDF that applicant tracking systems can parse.",
  facts: ["4 ATS-friendly templates", "Import PDF, DOCX or LinkedIn", "Preview matches the PDF"],
  photo: { src: "/images/photos/resume-review-desk.webp", alt: "Hands reviewing a printed resume next to a laptop" },
  example: {
    title: "What the bullet rewrite does",
    caption: "Example rewrite. Suggestions keep your facts; if no number can be inferred, the wording changes instead of a figure being invented.",
    body: (
      <div className="flex flex-col gap-4">
        <BeforeAfter
          before="Responsible for onboarding new customers."
          after="Owned onboarding for new B2B customers, cutting time to first value from 14 days to 6."
        />
        <BeforeAfter
          before="Helped the team with reporting."
          after="Built the weekly revenue report the sales team used to prioritise renewals."
        />
      </div>
    ),
  },
  steps: [
    { t: "Start or import", d: "Begin with a blank resume, upload a PDF or DOCX, or paste your LinkedIn profile text." },
    { t: "Fill each section", d: "Contact, summary, experience, education, skills, certifications and achievements — with a live preview." },
    { t: "Rewrite with AI", d: "Turn duty-style bullets into results. You review every suggestion before it's applied." },
    { t: "Pick a template and export", d: "Choose Classic, Modern, Minimal or Executive and download the PDF." },
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
    photo: { src: "/images/photos/resume-clipboard.webp", alt: "Resume on a clipboard ready for review" },
    title: "Written for people, readable by software.",
    text: "Clean PDFs with real text — names, dates and skills a parser can pick up, in any language your name is written in.",
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
