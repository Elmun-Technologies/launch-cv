import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { FeaturePageLayout } from "@/components/feature-page-template";

export const metadata: Metadata = {
  title: "AI Cover Letter Generator | Launch CV",
  description: "Generate tailored, professional cover letters from your resume and job description in seconds with AI-powered personalization.",
};

export default function CoverLetterPage() {
  return (
    <FeaturePageLayout
      icon={Mail}
      title="Cover Letter Generator"
      tagline="Tailored cover letters from your resume and JD"
      description="Stop writing cover letters from scratch. Our AI combines your resume data with the job description to generate a personalized, compelling cover letter that highlights your most relevant experience and speaks directly to the hiring manager."
      steps={[
        {
          title: "Select Your Resume",
          description: "Choose which resume to base your cover letter on. The AI uses your real experience as the foundation.",
        },
        {
          title: "Paste the Job Description",
          description: "Add the job posting and the AI identifies key requirements to address in your cover letter.",
        },
        {
          title: "Review and Send",
          description: "Get a professionally written cover letter you can customize, then export as PDF or copy to clipboard.",
        },
      ]}
      benefits={[
        "Personalized to each job description — never generic",
        "Highlights your most relevant skills and experience",
        "Professional tone that matches industry expectations",
        "Addresses specific requirements from the job posting",
        "Multiple variants to choose from for each application",
        "Export as PDF or copy-paste into any application form",
      ]}
      testimonial={{
        text: "I used to spend 45 minutes on each cover letter. Now I generate a perfect one in under a minute and just add my personal touch. It's honestly the best productivity hack for job hunting.",
        name: "Emily Rodriguez",
        role: "UX Designer at Apple",
      }}
      relatedFeatures={[
        { title: "JD Alignment", href: "/features/jd-alignment" },
        { title: "AI Resume Builder", href: "/features/resume-builder" },
        { title: "Interview Preparation", href: "/features/interview-prep" },
      ]}
    />
  );
}
