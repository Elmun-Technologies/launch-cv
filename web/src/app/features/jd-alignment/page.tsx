import { ResumeSheet } from "@/components/site/resume-sheet";
import { FeaturePage, Stage, ExampleTag, DarkTile, BeforeAfter, type FeaturePageData } from "@/components/marketing/feature-page";
import { Chip } from "@/components/site/ui";
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

const KEYWORDS: { k: string; s: "have" | "part" | "miss" }[] = [
  { k: "Product roadmap", s: "have" },
  { k: "A/B testing", s: "have" },
  { k: "User research", s: "have" },
  { k: "Jira", s: "have" },
  { k: "B2B SaaS", s: "have" },
  { k: "Agile", s: "have" },
  { k: "Stakeholder management", s: "part" },
  { k: "Pricing", s: "part" },
  { k: "SQL", s: "miss" },
  { k: "OKRs", s: "miss" },
  { k: "Go-to-market", s: "miss" },
];
const STATUS = {
  have: { t: "Covered", c: "text-[#5fe0a8]" },
  part: { t: "Weak", c: "text-[#f5c86b]" },
  miss: { t: "Missing", c: "text-[#ff9a66]" },
};

const stage = (
  <Stage bg="#e4dfff" poster="MATCH" posterColor="#d3cbff">
    <div aria-hidden="true" className="absolute bottom-[-120px] left-1/2 h-[288px] w-[288px] -translate-x-1/2 rounded-full bg-[#c9c0ff] lg:bottom-[-200px] lg:h-[480px] lg:w-[480px]" />
    <ResumeSheet
      example="product-manager"
      className="absolute bottom-0 left-1/2 h-[230px] w-[210px] -translate-x-1/2 [--peek:0.257] sm:h-[280px] sm:w-[250px] sm:[--peek:0.306] lg:h-[420px] lg:w-[360px] lg:[--peek:0.441]"
    />
    <div className="lc-float lc-drift absolute right-4 top-[96px] w-[150px] rounded-[18px] bg-white p-3.5 lg:right-7 lg:top-[170px] lg:w-[220px] lg:rounded-[22px] lg:p-[18px]">
      <p className="flex justify-between text-[12px] text-[#4a4862] lg:text-[13px]">
        Match score <ExampleTag />
      </p>
      <p className="text-[24px] font-bold leading-[28px] tracking-[-0.04em] lg:text-[38px] lg:leading-[42px]">
        72 <span className="text-[13px] text-[#7c7a94] lg:text-[16px]">→</span> <span className="text-[#0b7a4f]">86</span>
      </p>
      <div className="mt-2 h-2 overflow-hidden rounded-full bg-[#efedf7] lg:mt-2.5">
        <div className="h-full w-[86%] rounded-full bg-[#22b07d]" />
      </div>
    </div>
    <div className="lc-float lc-drift-2 absolute left-4 top-[210px] w-[164px] rounded-[18px] bg-white p-3.5 lg:left-7 lg:top-[330px] lg:w-[230px] lg:rounded-[22px] lg:p-[18px]">
      <p className="text-[12px] text-[#66647c] lg:text-[13px]">Missing from your resume</p>
      <div className="mt-2 flex flex-wrap gap-1.5 lg:mt-2.5">
        <Chip tone="red">+ Stakeholder mgmt</Chip>
        <Chip tone="red">+ OKRs</Chip>
      </div>
    </div>
  </Stage>
);

const f: FeaturePageData = {
  path: "/features/jd-alignment",
  name: "JD Alignment",
  label: "Job description match",
  h1: "Match your resume to the job.",
  h1Tail: "See exactly what the posting wants that you haven't said.",
  lead:
    "Paste a job description next to your resume. You get a 0–100 match score, the keywords you already cover, the skills that are missing or weak, and rewrites for the bullets that should carry them.",
  facts: ["Score from 0 to 100", "Missing skills named", "No invented experience"],
  cta: { label: "Try it now", href: "/register" },
  stage,
  example: {
    title: "What a match report shows you.",
    caption: "Example report for a product manager resume against a senior PM posting. Your report uses your resume and the job you paste.",
    body: (
      <div className="flex flex-col gap-3 sm:gap-4">
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <DarkTile>
            <p className="text-[14px] text-[#9a97b3]">Match score</p>
            <p className="mt-1 text-[40px] font-bold leading-[44px] tracking-[-0.04em] text-[#f5c86b] lg:text-[56px] lg:leading-[60px]">64</p>
            <p className="mt-3.5 text-[14px] text-[#b3b0c8]">6 of 11 key skills covered</p>
          </DarkTile>
          <DarkTile>
            <ul className="grid gap-x-8 gap-y-2.5 text-[15px] sm:grid-cols-2">
              {KEYWORDS.map(({ k, s }) => (
                <li key={k} className="flex justify-between gap-3">
                  <span>{k}</span>
                  <span className={`font-bold ${STATUS[s].c}`}>{STATUS[s].t}</span>
                </li>
              ))}
            </ul>
          </DarkTile>
        </div>
        <BeforeAfter
          beforeLabel="SUGGESTED REWRITE · BEFORE"
          before="Worked with sales and legal on the messaging feature."
          after="Aligned sales, legal and clinical stakeholders to ship HIPAA-compliant messaging used by 41 clinics."
        />
      </div>
    ),
  },
  stepsTail: "Run it for every job.",
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
