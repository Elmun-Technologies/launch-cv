import { Mic } from "lucide-react";
import { FeaturePageLayout } from "@/components/feature-page-template";
import { buildMarketingMetadata } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "Voice-to-Resume — Speak Your Experience, AI Writes It",
  description:
    "Speak your work experience naturally and our AI instantly transforms your words into polished, professional resume bullet points. No typing required. Try voice input free.",
  pathname: "/features/voice-input",
  keywords: ["voice resume builder", "speak to resume AI", "voice input resume", "AI transcription resume", "hands free resume builder"],
});

export default function VoiceInputPage() {
  return (
    <FeaturePageLayout
      canonicalPath="/features/voice-input"
      accent="pink"
      icon={Mic}
      eyebrow="Voice-to-Resume"
      title="Voice Input"
      tagline="Just Talk. We'll Handle the Rest."
      h1="Just Talk. We'll Handle the Rest."
      description="Don't know how to write about your experience? Just say it out loud. Our AI listens, transcribes, and transforms your natural speech into polished, ATS-ready resume bullet points."
      steps={[
        { title: "Click the Microphone Button", description: "Tap the mic icon on any resume section — Work Experience, Skills, Projects, or Summary." },
        { title: "Speak Naturally", description: "Say: 'I worked at Acme for 3 years managing a team of 5 doing customer support and training new employees.' No script needed." },
        { title: "Watch Real-Time Transcription", description: "Words appear as you speak — confirm accuracy before transforming. Edit any mistranscription inline." },
        { title: "Click Transform", description: "AI rewrites into: 'Managed a 5-person customer support team, reducing average resolution time by 30% and onboarding 12 new hires over 3 years.'" },
        { title: "Accept, Edit, or Regenerate", description: "Accept the bullet directly, tweak the wording, or regenerate with a different framing. All options in one click." },
        { title: "Add to Your Resume", description: "The transformed bullet goes directly into your resume section. Preview updates immediately." },
      ]}
      benefits={[
        "Natural speech → polished bullets: speak plainly, AI handles professional framing and quantification",
        "Real-time transcription: words appear as you speak — confirm before transforming",
        "Works on any section: Experience, Skills, Projects, Summary, Certifications — voice input everywhere",
        "No app download: runs in Chrome, Edge, and Safari natively — no plugins or downloads",
        "Privacy-first: audio is never stored after transcription — GDPR and CCPA compliant",
        "Supports English, Spanish, French, German, and Portuguese — more languages coming",
      ]}
      testimonials={[
        {
          text: "Voice input is brilliant. I just talked about my job history and it came out polished and professional. I would never have been able to write those bullets myself.",
          name: "David L.",
          role: "Operations Manager",
        },
        {
          text: "I have dyslexia and writing has always been a nightmare for me. The voice feature changed everything — I just speak and the AI makes it sound great. Finally landed a job I'm proud of.",
          name: "Callum R.",
          role: "Project Manager",
        },
      ]}
      relatedFeatures={[
        { title: "Resume Builder", href: "/features/resume-builder" },
        { title: "JD Alignment", href: "/features/jd-alignment" },
        { title: "Interview Prep", href: "/features/interview-prep" },
      ]}
      ctaHeadline="Your Best Resume Stories Are Already in Your Head."
      ctaSubtitle="You just need to say them out loud. AI takes it from there."
      ctaButton="Start Speaking"
    />
  );
}
