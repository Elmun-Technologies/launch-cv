import { MessageSquare } from "lucide-react";
import { FeaturePageLayout } from "@/components/feature-page-template";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "AI Interview Preparation — Practice with Role-Specific Questions",
  description:
    "Practice job interviews with AI-generated questions based on your exact role, resume, and job description. Get scored feedback and model answers. Land your next interview.",
  pathname: "/features/interview-prep",
  keywords: ["AI interview preparation", "interview practice AI", "job interview questions", "mock interview online", "interview coaching AI"],
});

export default function InterviewPrepPage() {
  return (
    <FeaturePageLayout
      canonicalPath="/features/interview-prep"
      accent="emerald"
      icon={MessageSquare}
      eyebrow="Interview Preparation"
      title="Interview Prep"
      tagline="Walk Into Every Interview Fully Prepared."
      h1="Walk Into Every Interview Fully Prepared."
      description="Our AI generates interview questions tailored to your specific role, company, and resume — then evaluates your answers and gives you expert feedback. No more guessing what they'll ask."
      steps={[
        { title: "Connect Your Resume & JD", description: "AI reads your resume and the target job description to build role-specific questions — not generic ones." },
        { title: "Choose Question Category", description: "Select from Behavioral, Technical, Company & Culture, Situational, or Curveball question sets." },
        { title: "Answer in Your Own Words", description: "Type your answer naturally. Think of it as a real interview — no scripts, just your honest response." },
        { title: "Receive Scored Feedback", description: "Each answer scored 1–10 with breakdown: Clarity, Relevance, Impact, and STAR structure." },
        { title: "Review Model Answer", description: "AI provides a benchmark answer for comparison — not to memorize, but to understand the standard." },
        { title: "Track Your Progress", description: "Session history shows questions practiced, average score, and improvement over time." },
      ]}
      benefits={[
        "Behavioral questions: 'Tell me about a time…' — STAR-method questions generated from your resume experience",
        "Technical / role-specific: pulled directly from the job description skills and requirements",
        "Company & culture: based on company values, mission, and recent news",
        "Situational questions: 'What would you do if…' — scenarios relevant to the exact role",
        "AI scoring: each answer rated 1–10 with Clarity, Relevance, Impact, and STAR breakdown",
        "Progress tracking: session history with average score and improvement trend over time",
      ]}
      testimonials={[
        {
          text: "The interview prep feature is underrated. Practicing with AI questions specific to the job made me so much more confident. I knew the answers before they asked.",
          name: "James O.",
          role: "Data Analyst",
        },
        {
          text: "I failed 4 interviews before using Launch CV. The AI feedback showed me I wasn't using STAR structure properly. Fixed that — and got hired on the next one.",
          name: "Nina P.",
          role: "Business Analyst",
        },
      ]}
      relatedFeatures={[
        { title: "JD Alignment", href: "/features/jd-alignment" },
        { title: "Cover Letter Generator", href: "/features/cover-letter" },
        { title: "Resume Builder", href: "/features/resume-builder" },
      ]}
      ctaHeadline="The Interview Won't Surprise You. We Make Sure of It."
      ctaSubtitle="200+ role-specific questions · AI scoring · Instant feedback on every answer."
      ctaButton="Practice My First Interview"
    />
  );
}
