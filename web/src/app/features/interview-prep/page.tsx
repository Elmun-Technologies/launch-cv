import { MessageSquare } from "lucide-react";
import { FeaturePageLayout } from "@/components/feature-page-template";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "AI Interview Prep",
  description:
    "Practice with AI-generated interview questions tailored to the role, your resume, and the job description. Walk into every interview confident and prepared.",
  pathname: "/features/interview-prep",
  keywords: ["interview prep", "interview questions", "behavioral interview", "Launch CV"],
});

export default function InterviewPrepPage() {
  return (
    <FeaturePageLayout
      canonicalPath="/features/interview-prep"
      accent="amber"
      icon={MessageSquare}
      title="Interview Preparation"
      tagline="Practice with AI-generated questions based on the role"
      description="Our AI analyzes the job description and your resume to generate role-specific interview questions — from behavioral to technical. Practice your answers, get feedback, and walk into every interview feeling confident and prepared."
      steps={[
        {
          title: "Provide the Context",
          description: "Select your resume and paste the job description. The AI understands both to create relevant questions.",
        },
        {
          title: "Practice Your Answers",
          description: "Get behavioral, technical, and situational questions tailored to the specific role and your background.",
        },
        {
          title: "Review and Improve",
          description: "See suggested answer frameworks, key points to hit, and areas where your experience shines.",
        },
      ]}
      benefits={[
        "Questions tailored to the specific job description and role",
        "Behavioral, technical, and situational question types",
        "Answer frameworks based on your actual experience",
        "STAR method guidance for behavioral questions",
        "Industry-specific question sets for 12+ verticals",
        "Elevator pitch generator for networking and introductions",
      ]}
      testimonial={{
        text: "The interview questions were eerily similar to what I was actually asked. Being prepared with my own stories already mapped to potential questions gave me a huge confidence boost.",
        name: "David Park",
        role: "Engineering Manager at Stripe",
      }}
      relatedFeatures={[
        { title: "JD Alignment", href: "/features/jd-alignment" },
        { title: "Cover Letter Generator", href: "/features/cover-letter" },
        { title: "AI Resume Builder", href: "/features/resume-builder" },
      ]}
    />
  );
}
