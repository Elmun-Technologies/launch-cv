import { Mail } from "lucide-react";
import { FeaturePageLayout } from "@/components/feature-page-template";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "AI Cover Letter Generator — Personalized Letters in 60 Seconds",
  description:
    "Generate tailored, professional cover letters from your resume and job description in 60 seconds. AI-written, personalized, and ready to send. No writing required.",
  pathname: "/features/cover-letter",
  keywords: ["AI cover letter generator", "cover letter writer", "personalized cover letter", "job application cover letter", "cover letter maker"],
});

export default function CoverLetterPage() {
  return (
    <FeaturePageLayout
      canonicalPath="/features/cover-letter"
      accent="teal"
      icon={Mail}
      eyebrow="Cover Letter Generator"
      title="Cover Letter"
      tagline="A Cover Letter That Actually Gets Read."
      h1="A Cover Letter That Actually Gets Read."
      description="Most cover letters are ignored — or they're generic. Ours are AI-personalized to the exact company, role, and hiring manager's expectations. Generated in 60 seconds."
      steps={[
        { title: "Connect Your Resume", description: "Use your Launch CV resume or paste your existing resume. Your experience is the foundation." },
        { title: "Paste the Job Description", description: "AI extracts the company name, role requirements, tech stack, and hiring context automatically." },
        { title: "Add Optional Details", description: "Include hiring manager name, company mission notes, or tone preference to personalize further." },
        { title: "Choose Your Tone", description: "Select from Professional, Enthusiastic, Concise, or Creative — preview before generating." },
        { title: "Generate in 10 Seconds", description: "AI writes a fully personalized, ATS-safe cover letter referencing specific job requirements." },
        { title: "Edit, Copy, or Download", description: "Edit inline if needed, then copy to clipboard, paste into an email, or download as PDF." },
      ]}
      benefits={[
        "Deep personalization: AI pulls company mission, tech stack, and required skills from the JD — weaves them naturally into the letter",
        "Tone control: choose from Professional, Enthusiastic, Concise, or Creative — preview before generating",
        "Opening hook variants: generates 3 different opening hooks so you can pick your favorite",
        "ATS-safe format: plain text structure works in email body, ATS uploads, and PDF attachments",
        "Word count control: Short (250w) · Standard (400w) · Detailed (600w) — your choice",
        "Multi-language support: generate in English, German, French, Spanish, and 10 other languages",
      ]}
      testimonials={[
        {
          text: "The cover letter generator wrote better letters than I ever could. It pulled specific details from the job description I didn't even notice. Saved me 2–3 hours per application.",
          name: "Priya N.",
          role: "Marketing Lead → HubSpot",
        },
        {
          text: "I was embarrassed by my cover letters before. The AI made them sound genuinely enthusiastic and specific. I got a callback from every company where I used it.",
          name: "Alex T.",
          role: "Sales Manager",
        },
      ]}
      relatedFeatures={[
        { title: "JD Alignment", href: "/features/jd-alignment" },
        { title: "Resume Builder", href: "/features/resume-builder" },
        { title: "Interview Prep", href: "/features/interview-prep" },
      ]}
      ctaHeadline="Write a Cover Letter You're Actually Proud Of."
      ctaSubtitle="Personalized, professional, and ready in 60 seconds. No blank page anxiety."
      ctaButton="Generate Free"
    />
  );
}
