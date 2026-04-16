import { FileText } from "lucide-react";
import { FeaturePageLayout } from "@/components/feature-page-template";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "Free AI Resume Builder",
  description:
    "Create professional, ATS-optimized resumes in minutes with 12+ industry-specific templates, real-time preview, and AI-powered content suggestions.",
  pathname: "/features/resume-builder",
  keywords: ["AI resume builder", "resume templates", "PDF resume", "ATS resume", "Launch CV"],
});

export default function ResumeBuilderPage() {
  return (
    <FeaturePageLayout
      canonicalPath="/features/resume-builder"
      accent="emerald"
      icon={FileText}
      title="AI Resume Builder"
      tagline="Create professional resumes in minutes, not hours"
      description="Choose from 12+ industry-specific templates designed by hiring experts. Our AI helps you write compelling bullet points, optimize formatting, and export pixel-perfect PDFs — with real-time preview so you always know how your resume looks."
      steps={[
        {
          title: "Choose Your Template",
          description: "Pick from 12+ verticals including software engineering, product management, design, marketing, finance, and more.",
        },
        {
          title: "Fill in Your Details",
          description: "Enter your experience, skills, and education. AI suggests improvements and helps write impactful bullet points.",
        },
        {
          title: "Download Your PDF",
          description: "Preview your resume in real-time and export a polished, ATS-friendly PDF ready to submit.",
        },
      ]}
      benefits={[
        "12+ industry-specific templates designed by hiring experts",
        "AI-powered bullet point suggestions based on your role",
        "Real-time preview as you edit — no surprises",
        "ATS-optimized formatting that passes automated screens",
        "US and EU resume formats supported",
        "One-click PDF export with professional typography",
      ]}
      testimonial={{
        text: "I built my resume in under 15 minutes and it looked better than anything I'd spent hours on before. The AI suggestions were spot-on for my industry.",
        name: "Marcus Johnson",
        role: "Product Manager at Meta",
      }}
      relatedFeatures={[
        { title: "JD Alignment", href: "/features/jd-alignment" },
        { title: "Cover Letter Generator", href: "/features/cover-letter" },
        { title: "Voice Input", href: "/features/voice-input" },
      ]}
    />
  );
}
