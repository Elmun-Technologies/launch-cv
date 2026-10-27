import { FeaturePage, Chip, BeforeAfter, type FeaturePageData } from "@/components/marketing/feature-page";
import { buildMarketingMetadata, FEATURES_OG_IMAGE } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "Match Your Resume to a Job Description — JD Alignment",
  description:
    "Paste a job post and see your match score, which keywords you have, which are missing, and rewrites for your weak bullets — based only on your real experience.",
  pathname: "/features/jd-alignment",
  image: FEATURES_OG_IMAGE,
  keywords: [
    "match resume to job description",
    "resume job description match",
    "tailor resume to job description",
    "resume keyword gap analysis",
    "JD alignment",
    "AI resume tailoring",
  ],
});

const f: FeaturePageData = {
  path: "/features/jd-alignment",
  name: "JD Alignment",
  h1: "Match your resume to the job.",
  h1Tail: "See exactly what the posting wants that you haven't said.",
  lead:
    "Paste a job description next to your resume. You get a 0–100 match score, the keywords you already cover, the skills that are missing or weak, and rewrites for the bullets that should carry them.",
  facts: ["Score from 0 to 100", "Missing skills named", "No invented experience"],
  photo: { src: "/images/photos/job-seeker-laptop.webp", alt: "Job seeker comparing a resume with a job posting on a laptop" },
  example: {
    title: "What a match report shows you",
    caption: "Example report for a product manager resume against a senior PM posting. Your report uses your resume and the job you paste.",
    body: (
      <div className="flex flex-col gap-6">
        <div className="flex items-baseline gap-3">
          <span className="text-[44px] font-semibold leading-none tracking-[-0.04em] text-[#E8890C]">64</span>
          <span className="text-[15px] text-[#6B6B6B]">match score · 6 of 11 key skills covered</span>
        </div>
        <div>
          <p className="text-[14px] font-medium">Keywords you already have</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {["Product roadmap", "A/B testing", "User research", "Jira", "B2B SaaS", "Agile"].map((k) => (
              <Chip key={k} tone="have">{k}</Chip>
            ))}
          </div>
        </div>
        <div>
          <p className="text-[14px] font-medium">Missing or weak</p>
          <div className="mt-2 flex flex-wrap gap-2">
            <Chip tone="miss">SQL</Chip>
            <Chip tone="miss">OKRs</Chip>
            <Chip tone="part">Stakeholder management</Chip>
            <Chip tone="part">Pricing</Chip>
            <Chip tone="miss">Go-to-market</Chip>
          </div>
        </div>
        <div>
          <p className="mb-2 text-[14px] font-medium">Suggested rewrite</p>
          <BeforeAfter
            before="Worked with sales and legal on the messaging feature."
            after="Aligned sales, legal and clinical stakeholders to ship HIPAA-compliant messaging used by 41 clinics."
          />
        </div>
      </div>
    ),
  },
  steps: [
    { t: "Open a resume and paste the job post", d: "Use the full description — requirements, responsibilities and the nice-to-haves." },
    { t: "Read the match report", d: "Score, covered keywords, and each key skill marked strong, partial or missing, with a recommendation." },
    { t: "Accept the rewrites you agree with", d: "Suggestions only reword bullets you already have. Nothing is applied until you choose it." },
    { t: "Save a version for this job", d: "Keep a snapshot per application so you always know which resume you sent." },
  ],
  gets: [
    { t: "Match score", d: "A 0–100 estimate of how well your resume covers the posting's keywords and requirements." },
    { t: "Keyword coverage", d: "The posting's important terms that already appear in your resume." },
    { t: "Skill gaps", d: "Each key skill marked strong, partial or missing, with what to add if you really have it." },
    { t: "Bullet rewrites", d: "New wording for existing bullets so they speak the posting's language." },
    { t: "What to cut", d: "Bullets that take space without helping for this role." },
    { t: "Versions per job", d: "Snapshots let you tailor for one job without losing your main resume." },
  ],
  banner: {
    photo: { src: "/images/photos/recruiter-desk.webp", alt: "Recruiter reviewing applications at a desk" },
    title: "Tailoring takes minutes, not an evening.",
    text: "Run the match for every job you apply to, and send a resume that answers what that recruiter is screening for.",
  },
  faqs: [
    {
      q: "How do I match my resume to a job description?",
      a: "Open your resume in LaunchCV, paste the job description and run the match. You'll see your score, the keywords you cover, the skills that are missing or weak, and rewrites for your existing bullets.",
    },
    {
      q: "What does the match score mean?",
      a: "It's a 0–100 estimate of how well your resume covers the keywords and requirements in that posting, from an applicant tracking system's point of view. It's a guide for tailoring, not a prediction of whether you'll be hired.",
    },
    {
      q: "Will it add experience I don't have?",
      a: "No. The model is instructed to work only from your resume and not to invent metrics or facts. If a skill is missing, it tells you so — add it only if it's true.",
    },
    {
      q: "Does tailoring each application help?",
      a: "Recruiters and applicant tracking systems filter by the terms in the posting. Using the posting's wording for experience you really have makes it easier for both to see the fit.",
    },
    {
      q: "Is JD Alignment free?",
      a: "The ATS check is free with no account. JD Alignment is included in every paid plan; plans differ only in how many analyses you can run each month.",
    },
  ],
  related: [
    { kind: "Tool", label: "Free ATS resume checker", href: "/free-ats-check" },
    { kind: "Guide", label: "How to tailor your resume for every job", href: "/blog/how-to-tailor-your-resume-for-every-job" },
    { kind: "Example", label: "Product manager resume and keywords", href: "/resume-examples/product-manager" },
  ],
};

export default function JdAlignmentPage() {
  return <FeaturePage f={f} />;
}
