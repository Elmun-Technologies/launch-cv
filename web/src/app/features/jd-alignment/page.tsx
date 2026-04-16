import { Target } from "lucide-react";
import { FeaturePageLayout } from "@/components/feature-page-template";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "JD Alignment Match — Resume & Job Description Matching",
  description:
    "Instantly match your resume to any job description with AI. Get keyword gap analysis, ATS optimization tips, and AI-rewritten bullet points tailored to the role. Try free.",
  pathname: "/features/jd-alignment",
  keywords: ["JD alignment", "resume job description match", "keyword gap analysis", "resume ATS optimization", "job description resume checker"],
});

export default function JDAlignmentPage() {
  return (
    <FeaturePageLayout
      canonicalPath="/features/jd-alignment"
      accent="blue"
      icon={Target}
      eyebrow="AI-Powered Job Matching"
      title="JD Alignment"
      tagline="Match Your Resume to Any Job — Instantly."
      h1="Match Your Resume to Any Job — Instantly."
      description="Paste a job description and our AI highlights every gap, missing keyword, and optimization opportunity — then rewrites your bullets to score up to 95% match against any role."
      steps={[
        { title: "Upload or Paste Your Resume", description: "Upload PDF, DOCX, or paste plain text. Your existing content is imported in seconds." },
        { title: "Paste the Job Description", description: "Copy any job posting from LinkedIn, Indeed, or any source. URL or raw text both work." },
        { title: "Click Analyze — 10 Seconds", description: "Our AI processes both documents, extracts all requirements, and builds your gap map in under 10 seconds." },
        { title: "Review Your Match Score", description: "See your match percentage, missing keywords ranked by importance, and AI-flagged gaps." },
        { title: "Accept AI Bullet Rewrites", description: "One-click to accept AI suggestions — your resume updates live and your score climbs in real time." },
        { title: "Download & Apply", description: "Export your optimized resume as PDF or send directly to the cover letter generator." },
      ]}
      benefits={[
        "Keyword extraction: AI scans the JD for all hard skills, soft skills, and role-specific terms",
        "Gap analysis: side-by-side comparison shows exactly what your resume has vs. what's missing",
        "AI bullet rewrites: missing keywords inserted naturally — never sounds robotic",
        "Real-time score: match percentage updates live as you edit, watch it climb from 40% to 90%+",
        "Multi-job tracking: save and compare match scores across multiple applications",
        "ATS simulation: tested against Workday, Greenhouse, Lever, iCIMS, and 11 other platforms",
      ]}
      beforeAfter={{
        beforeText: "Helped team complete projects on time.",
        beforeScore: "34%",
        afterText: "Led cross-functional delivery of 3 enterprise SaaS migrations, reducing time-to-deploy by 40% using Agile/Scrum methodologies.",
        afterScore: "91%",
      }}
      testimonials={[
        {
          text: "I was applying to the same type of role for months with no callbacks. Launch CV showed me I was missing 14 critical keywords. After fixing it, I had 5 interviews in 10 days.",
          name: "Rachel M.",
          role: "Product Manager",
        },
        {
          text: "The JD alignment tool is worth the subscription alone. It's like having a recruiter tell you exactly what to change.",
          name: "Tom H.",
          role: "Software Engineer",
        },
      ]}
      relatedFeatures={[
        { title: "AI Resume Builder", href: "/features/resume-builder" },
        { title: "ATS Score Checker", href: "/features/ats-score" },
        { title: "Cover Letter Generator", href: "/features/cover-letter" },
      ]}
      ctaHeadline="Stop Guessing What Recruiters Want."
      ctaSubtitle="Let AI show you exactly how to match the job — and rewrite your resume to prove it."
      ctaButton="Analyze My Resume Free"
    />
  );
}
