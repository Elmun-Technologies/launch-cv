import { FileText } from "lucide-react";
import { FeaturePageLayout } from "@/components/feature-page-template";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "AI Resume Builder — ATS-Friendly Resumes in 5 Minutes",
  description:
    "Create a professional, ATS-optimized resume in under 5 minutes. 12+ industry-specific templates, AI-written bullet points, and real-time preview. Start today.",
  pathname: "/features/resume-builder",
  keywords: ["AI resume builder", "ATS friendly resume builder", "professional resume templates", "online resume maker", "resume generator AI"],
});

export default function ResumeBuilderPage() {
  return (
    <FeaturePageLayout
      canonicalPath="/features/resume-builder"
      accent="violet"
      icon={FileText}
      eyebrow="AI Resume Builder"
      title="Resume Builder"
      tagline="The AI Resume Builder That Writes for You."
      h1="The AI Resume Builder That Writes for You."
      description="Just enter your experience — our AI crafts professional, ATS-optimized bullet points, picks the right keywords, and formats everything perfectly. 12+ templates. Ready in 5 minutes."
      steps={[
        { title: "Choose Your Template", description: "Pick from 12+ verticals: software engineering, product, design, marketing, finance, healthcare, and more — each ATS-tested." },
        { title: "Enter Your Experience", description: "Type or paste your work history in plain language. AI transforms it into polished, impact-driven bullet points automatically." },
        { title: "AI Suggests Improvements", description: "Review AI-generated bullet suggestions, action verbs, and keyword additions. Accept with one click." },
        { title: "Preview in Real Time", description: "What you see is what you get — live preview updates as you type. No formatting surprises." },
        { title: "Add All Sections", description: "Customize sections: Skills, Projects, Certifications, Languages, Publications, Awards. Drag to reorder." },
        { title: "Export & Apply", description: "One-click PDF or DOCX export. ATS-safe formatting. LinkedIn-ready plain text also available." },
      ]}
      benefits={[
        "AI bullet writing: describe what you did in plain language — AI makes it quantified and compelling",
        "Real-time preview: see your resume update as you type — no surprises on export",
        "ATS-safe formatting: all templates tested against 15+ ATS platforms — no hidden parsing traps",
        "Multi-language support: build your resume in English, Spanish, French, German, and 12 other languages",
        "PDF & DOCX export: one-click download in recruiter-preferred formats",
        "Version history: restore any previous version — create multiple variants for different roles",
      ]}
      beforeAfter={{
        beforeText: "managed social media, made content, helped grow followers",
        afterText: "Managed and grew company social media presence across 4 platforms, increasing follower count by 127% and improving engagement rate from 1.8% to 4.6% over 6 months.",
      }}
      testimonials={[
        {
          text: "I built my resume in under 15 minutes and it looked better than anything I'd spent hours on before. The AI suggestions were spot-on for my industry.",
          name: "Marcus J.",
          role: "Product Manager at Meta",
        },
        {
          text: "As a non-native English speaker, writing formal job bullets was hard. The AI took my rough notes and made them professional. I got hired within a month.",
          name: "Yuna K.",
          role: "UX Designer",
        },
      ]}
      relatedFeatures={[
        { title: "JD Alignment", href: "/features/jd-alignment" },
        { title: "Cover Letter Generator", href: "/features/cover-letter" },
        { title: "Voice Input", href: "/features/voice-input" },
      ]}
      ctaHeadline="Your Best Resume is 5 Minutes Away."
      ctaSubtitle="No writing skills needed. Just tell the AI what you did — it handles the rest."
      ctaButton="Build My Resume"
    />
  );
}
