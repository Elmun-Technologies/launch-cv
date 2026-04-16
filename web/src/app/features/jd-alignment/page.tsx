import { Target } from "lucide-react";
import { FeaturePageLayout } from "@/components/feature-page-template";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "JD Alignment Tool",
  description:
    "Match your resume to any job description instantly with AI-powered gap analysis, keyword optimization, and tailored bullet rewrites.",
  pathname: "/features/jd-alignment",
  keywords: ["JD alignment", "resume keywords", "ATS", "job description", "tailored resume", "Launch CV"],
});

export default function JDAlignmentPage() {
  return (
    <FeaturePageLayout
      canonicalPath="/features/jd-alignment"
      accent="violet"
      icon={Target}
      title="JD Alignment"
      tagline="Match your resume to any job description instantly"
      description="Paste any job description and let our AI analyze the gaps between your resume and the role requirements. Get a detailed gap map, keyword matching report, and AI-powered bullet rewrites — all tailored to help you pass ATS filters and impress hiring managers."
      steps={[
        {
          title: "Paste the Job Description",
          description: "Copy and paste any job posting. Our AI parses requirements, skills, and keywords in seconds.",
        },
        {
          title: "AI Analyzes the Gaps",
          description: "Get a comprehensive gap map showing what's missing, what matches, and where to improve your resume.",
        },
        {
          title: "Get Your Tailored Resume",
          description: "Receive AI-rewritten bullet points, keyword suggestions, and a resume optimized for the specific role.",
        },
      ]}
      benefits={[
        "Instant gap analysis between your resume and any job description",
        "AI-powered keyword matching to beat ATS filters",
        "Smart bullet point rewrites that preserve your real experience",
        "Visual gap map highlighting missing skills and qualifications",
        "Priority ranking of improvements for maximum impact",
        "Side-by-side comparison of original vs. optimized resume",
      ]}
      testimonial={{
        text: "The JD alignment feature is a game-changer. I went from a 40% match rate to over 85% on most applications. Within two weeks, I had three interview callbacks from companies I'd been rejected by before.",
        name: "Sarah C.",
        role: "Software engineer · tech",
      }}
      relatedFeatures={[
        { title: "AI Resume Builder", href: "/features/resume-builder" },
        { title: "ATS Score Checker", href: "/features/ats-score" },
        { title: "Cover Letter Generator", href: "/features/cover-letter" },
      ]}
    />
  );
}
