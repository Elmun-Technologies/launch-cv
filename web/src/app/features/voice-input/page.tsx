import { FeaturePage, BeforeAfter, type FeaturePageData } from "@/components/marketing/feature-page";
import { buildMarketingMetadata, FEATURES_OG_IMAGE } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "Voice Input Resume Builder — Speak Your Experience",
  description:
    "Talk through your experience instead of typing it. Your browser turns speech into text in the field you're editing; then AI rewrites it into results-focused bullets.",
  pathname: "/features/voice-input",
  image: FEATURES_OG_IMAGE,
  keywords: [
    "voice to resume",
    "voice resume builder",
    "speech to text resume",
    "speak to resume",
    "hands free resume builder",
  ],
});

const f: FeaturePageData = {
  path: "/features/voice-input",
  name: "Voice Input",
  h1: "Say it the way you'd tell a friend.",
  h1Tail: "Then turn it into a bullet.",
  lead:
    "Press the microphone next to a field and talk about what you did. Your words appear as text in that field; edit them, then use the AI rewrite to shape them into a results-focused bullet.",
  facts: ["No app to install", "Works in your browser", "English (US) recognition"],
  photo: { src: "/images/photos/role-customer-service.webp", alt: "Professionals wearing headsets at work" },
  example: {
    title: "From what you said to what you send",
    caption: "Example. Speech is transcribed by your browser; the rewrite keeps your facts and doesn't invent numbers.",
    body: (
      <BeforeAfter
        before="so basically I set up the new onboarding thing for clinics and no-shows went down by like twenty-three percent across forty-one clinics"
        after="Launched clinic onboarding for self-scheduling, reducing no-shows by 23% across 41 clinics."
      />
    ),
  },
  steps: [
    { t: "Open a section", d: "Experience bullets and your summary both have a microphone button." },
    { t: "Speak", d: "Talk naturally. Your browser shows the text as you go." },
    { t: "Confirm and edit", d: "Fix names or numbers the recognition got wrong." },
    { t: "Rewrite with AI", d: "Turn the spoken version into a concise bullet that leads with the result." },
  ],
  gets: [
    { t: "Faster first drafts", d: "Most people say more about their work than they'd ever type." },
    { t: "Browser speech recognition", d: "Uses the Web Speech API in Chrome, Edge and Safari." },
    { t: "Edit before saving", d: "Nothing is added to your resume until you confirm it." },
    { t: "AI rewrite", d: "Shape the transcript into a results-first bullet." },
    { t: "No recordings kept by LaunchCV", d: "We receive the text, not your audio." },
    { t: "Accessible", d: "Helpful if typing is slow or tiring for you." },
  ],
  banner: {
    photo: { src: "/images/photos/job-seeker-laptop.webp", alt: "Person talking through their experience at a laptop" },
    title: "The hardest part is the blank page.",
    text: "Talking gets the raw material out. The editor and AI rewrite turn it into a resume.",
  },
  faqs: [
    {
      q: "Can I build a resume by voice?",
      a: "You can dictate your summary and experience bullets, then edit and rewrite them. Contact details and dates are quicker to type.",
    },
    {
      q: "Which languages are supported?",
      a: "Recognition is set to English (US). Other accents of English usually work; other languages aren't supported yet.",
    },
    {
      q: "Does LaunchCV store my voice?",
      a: "No. Speech is converted to text by your browser's speech service, and LaunchCV only receives the resulting text. Your browser provider's own privacy terms apply to the recognition.",
    },
    {
      q: "Which browsers work?",
      a: "Browsers with the Web Speech API — current Chrome, Edge and Safari. Firefox doesn't support it yet.",
    },
    {
      q: "Is voice input included in my plan?",
      a: "Yes, voice input is available in the editor; the AI rewrite is included in every paid plan.",
    },
  ],
  related: [
    { kind: "Tool", label: "AI resume builder", href: "/features/resume-builder" },
    { kind: "Guide", label: "Voice to resume: how it works", href: "/blog/voice-to-resume" },
    { kind: "Tool", label: "Free ATS resume checker", href: "/free-ats-check" },
  ],
};

export default function VoiceInputPage() {
  return <FeaturePage f={f} />;
}
