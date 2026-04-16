import { Mic } from "lucide-react";
import { FeaturePageLayout } from "@/components/feature-page-template";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "Voice to Resume",
  description:
    "Speak your work experience naturally and let AI transform your words into polished, professional resume bullet points.",
  pathname: "/features/voice-input",
  keywords: ["voice resume", "dictation resume", "AI bullets", "Launch CV"],
});

export default function VoiceInputPage() {
  return (
    <FeaturePageLayout
      canonicalPath="/features/voice-input"
      accent="slate"
      icon={Mic}
      title="Voice Input"
      tagline="Speak your experience — we turn it into polished bullets"
      description="Not everyone writes fluently under pressure. With Voice Input, simply speak about your work experience in your own words. Our AI listens, understands the context, and transforms your natural speech into concise, impactful resume bullet points with metrics and action verbs."
      steps={[
        {
          title: "Hit Record",
          description: "Click the microphone and talk about your experience naturally — no script needed, just tell your story.",
        },
        {
          title: "AI Polishes Your Words",
          description: "Our AI transcribes and transforms your speech into professional bullet points with action verbs and metrics.",
        },
        {
          title: "Add to Your Resume",
          description: "Review the polished bullets, make any edits, and add them directly to your resume with one click.",
        },
      ]}
      benefits={[
        "Natural speech input — no writing skills required",
        "AI converts casual language into professional resume bullets",
        "Automatic action verb enhancement and metric highlighting",
        "Supports multiple languages and accents",
        "Edit and refine AI suggestions before adding to your resume",
        "Perfect for people who think better out loud",
      ]}
      testimonial={{
        text: "English is my second language and writing resume bullets always stressed me out. Voice Input let me just talk about my work and the AI made it sound incredible. This feature alone is worth it.",
        name: "Ana Petrova",
        role: "Frontend Developer at Shopify",
      }}
      relatedFeatures={[
        { title: "AI Resume Builder", href: "/features/resume-builder" },
        { title: "JD Alignment", href: "/features/jd-alignment" },
        { title: "ATS Score Checker", href: "/features/ats-score" },
      ]}
    />
  );
}
