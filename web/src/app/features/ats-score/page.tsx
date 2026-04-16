import { BarChart3 } from "lucide-react";
import { FeaturePageLayout } from "@/components/feature-page-template";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "ATS Resume Score Checker",
  description:
    "Check how your resume scores against applicant tracking systems. Get actionable tips to improve your ATS compatibility and pass automated screens.",
  pathname: "/features/ats-score",
  keywords: ["ATS score", "resume checker", "applicant tracking system", "keyword optimization", "Launch CV"],
});

export default function ATSScorePage() {
  return (
    <FeaturePageLayout
      canonicalPath="/features/ats-score"
      accent="sky"
      icon={BarChart3}
      title="ATS Score Checker"
      tagline="See how your resume scores against ATS systems"
      description="Over 75% of resumes are rejected by ATS before a human ever reads them. Our ATS Score Checker analyzes your resume against real applicant tracking system criteria, giving you a detailed score breakdown and actionable fixes to ensure your resume gets through."
      steps={[
        {
          title: "Upload Your Resume",
          description: "Upload your current resume or select one from your Launch CV account for instant analysis.",
        },
        {
          title: "Get Your ATS Score",
          description: "Receive a detailed score breakdown covering formatting, keywords, structure, and readability.",
        },
        {
          title: "Apply the Fixes",
          description: "Follow prioritized recommendations to improve your score. See results update in real-time.",
        },
      ]}
      benefits={[
        "Comprehensive ATS compatibility score with detailed breakdown",
        "Keyword density analysis matched to your target role",
        "Formatting checks for headers, fonts, and structure",
        "Readability scoring for both ATS and human reviewers",
        "Prioritized fix list — tackle the biggest improvements first",
        "Before-and-after score comparison to track your progress",
      ]}
      testimonial={{
        text: "My resume was scoring 45% on ATS systems. After following Launch CV's suggestions, I hit 92%. The difference was night and day — I started getting callbacks within the first week.",
        name: "Rachel Kim",
        role: "Data Scientist at Netflix",
      }}
      relatedFeatures={[
        { title: "JD Alignment", href: "/features/jd-alignment" },
        { title: "AI Resume Builder", href: "/features/resume-builder" },
        { title: "Cover Letter Generator", href: "/features/cover-letter" },
      ]}
    />
  );
}
