import { BarChart3 } from "lucide-react";
import { FeaturePageLayout } from "@/components/feature-page-template";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "ATS Resume Score Checker — See Your ATS Score Instantly",
  description:
    "Find out exactly how your resume scores in Applicant Tracking Systems. Get your ATS score, actionable improvement tips, and formatting fixes to pass ATS every time.",
  pathname: "/features/ats-score",
  keywords: ["ATS score checker", "resume ATS test", "applicant tracking system resume", "ATS resume checker free", "resume pass ATS"],
});

export default function AtsScorePage() {
  return (
    <FeaturePageLayout
      canonicalPath="/features/ats-score"
      accent="orange"
      icon={BarChart3}
      eyebrow="75% of resumes never reach a human recruiter."
      title="ATS Score Checker"
      tagline="Find Out If Your Resume Passes ATS — Before You Apply."
      h1="Find Out If Your Resume Passes ATS — Before You Apply."
      description="Upload your resume and get an instant ATS compatibility score, a detailed issue report, and a step-by-step fix checklist. Know exactly what's blocking you before you submit."
      steps={[
        { title: "Upload Your Resume", description: "Drag and drop your PDF or DOCX. Or paste plain text. Processing starts immediately." },
        { title: "AI Parses Every Element", description: "We check formatting, fonts, tables, text boxes, headers, footers, and embedded graphics for ATS incompatibilities." },
        { title: "Keyword Density Analysis", description: "AI compares your keyword richness against industry benchmarks for your target role." },
        { title: "Receive Your Score", description: "See your overall ATS score (0–100) with sector breakdown: Formatting, Keywords, Structure, Readability." },
        { title: "Review the Issue List", description: "12+ possible issues flagged with High / Medium / Low priority tags and specific fix instructions." },
        { title: "Fix & Re-check", description: "Apply fixes and re-run the checker. Most users gain 20–40 points after addressing High priority issues." },
      ]}
      benefits={[
        "Formatting checks: detects tables, text boxes, columns, graphics, and header/footer issues that break ATS parsing",
        "Keyword density: measures keyword richness vs. industry benchmarks for your target role",
        "File compatibility: checks file type, file size, encoding, and font embedding",
        "Section structure: verifies presence of Work Experience, Education, Skills, and Contact Info",
        "Date formatting: ATS systems need consistent date formats — we flag all inconsistencies",
        "Contact info parsing: ensures name, email, phone, and LinkedIn are in standard parseable positions",
      ]}
      testimonials={[
        {
          text: "My ATS score went from 38% to 93%. I had no idea how broken my resume was — tables, headers, wrong fonts. Fixed it all in 20 minutes. 2 weeks later I had 3 offers.",
          name: "Marcus T.",
          role: "Product Manager → Notion",
        },
        {
          text: "I was sending 50 applications with no responses. Launch CV's ATS checker showed me my resume was being rejected before any human saw it. Fixed and hired in 3 weeks.",
          name: "Chloe W.",
          role: "Operations Analyst",
        },
      ]}
      relatedFeatures={[
        { title: "JD Alignment", href: "/features/jd-alignment" },
        { title: "Resume Builder", href: "/features/resume-builder" },
        { title: "Cover Letter Generator", href: "/features/cover-letter" },
      ]}
      ctaHeadline="A 90+ ATS Score Changes Everything."
      ctaSubtitle="The average Launch CV user improves their ATS score by 43 points. More score means more human eyes on your resume."
      ctaButton="Check My ATS Score"
    />
  );
}
