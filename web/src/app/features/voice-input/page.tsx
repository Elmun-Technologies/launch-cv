import { ResumeSheet } from "@/components/site/resume-sheet";
import { FeaturePage, Stage, ExampleTag, BeforeAfter, type FeaturePageData } from "@/components/marketing/feature-page";
import { buildMarketingMetadata, FEATURES_OG_IMAGE } from "@/lib/build-metadata";
import { entryPriceLabel } from "@/lib/monetization";

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

const SAID =
  "so basically I set up the new onboarding thing for clinics and no-shows went down by like twenty-three percent across forty-one clinics";
const SAID_SHORT = "so basically I set up the new onboarding thing for clinics and no-shows went down…";
const BULLET = "Launched clinic onboarding for self-scheduling, reducing no-shows by 23% across 41 clinics.";
const BARS = [12, 26, 18, 34, 22, 30, 14, 28, 20, 10, 24, 16];

const stage = (
  <Stage bg="#c9c0ff" poster="SPEAK" posterColor="#b8adff">
    <ResumeSheet
      example="customer-service-representative"
      className="absolute bottom-0 right-4 h-[150px] w-[140px] rotate-3 [--peek:0.172] sm:h-[220px] sm:w-[200px] sm:[--peek:0.245] lg:right-8 lg:h-[330px] lg:w-[260px] lg:[--peek:0.319]"
    />
    <div className="lc-float lc-drift absolute left-4 top-[86px] rounded-[18px] bg-white p-3 lg:left-8 lg:top-[150px] lg:rounded-[22px] lg:p-[18px]">
      <div className="flex items-center gap-2.5 lg:gap-3">
        <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#c42b30] lg:h-11 lg:w-11">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" aria-hidden="true" className="h-3.5 w-3.5 lg:h-[18px] lg:w-[18px]">
            <rect x="9" y="3" width="6" height="12" rx="3" />
            <path d="M5 11a7 7 0 0 0 14 0M12 18v3" />
          </svg>
          <span className="sr-only">Recording</span>
        </span>
        <span aria-hidden="true" className="flex h-6 items-center gap-[3px] lg:h-9 lg:gap-1">
          {BARS.map((h, i) => (
            <span key={i} className="w-1 rounded-full bg-[#5440e8] lg:w-1.5" style={{ height: `${Math.round((h / 34) * 100)}%` }} />
          ))}
        </span>
      </div>
    </div>
    <div className="lc-float lc-drift-2 absolute left-4 top-[146px] w-[210px] rounded-[18px] bg-white p-3.5 text-[#121226] sm:w-[280px] lg:left-8 lg:top-[250px] lg:w-[320px] lg:rounded-[22px] lg:p-[18px]">
      <p className="flex justify-between text-[11px] font-bold tracking-[0.06em] text-[#66647c] lg:text-[12px]">
        <span>YOU SAID</span>
        <ExampleTag />
      </p>
      <p className="mt-1 text-[13px] leading-[18px] text-[#4a4862] lg:mt-1.5 lg:text-[14px] lg:leading-5">“{SAID_SHORT}”</p>
    </div>
    <div className="lc-float lc-drift-3 absolute left-4 top-[284px] w-[200px] rounded-[18px] bg-[#111118] p-3.5 text-white sm:w-[260px] lg:left-8 lg:top-[440px] lg:w-[320px] lg:rounded-[22px] lg:p-[18px]">
      <p className="text-[11px] font-bold tracking-[0.06em] text-[#c9c0ff] lg:text-[12px]">BULLET</p>
      <p className="mt-1 text-[13px] font-semibold leading-[18px] lg:mt-1.5 lg:text-[15px] lg:leading-[21px]">{BULLET}</p>
    </div>
  </Stage>
);

const f: FeaturePageData = {
  path: "/features/voice-input",
  name: "Voice Input",
  h1: "Say it the way you'd tell a friend.",
  h1Tail: "Then turn it into a bullet.",
  lead:
    "Press the microphone next to a field and talk about what you did. Your words appear as text in that field; edit them, then use the AI rewrite to shape them into a results-focused bullet.",
  facts: ["No app to install", "Works in your browser", "English (US) recognition"],
  cta: { label: "Try it now", href: "/register" },
  stage,
  example: {
    title: "From what you said to what you send.",
    caption: "Example. Speech is transcribed by your browser; the rewrite keeps your facts and doesn't invent numbers.",
    body: <BeforeAfter beforeLabel="TRANSCRIPT" afterLabel="BULLET" strike={false} before={`“${SAID}”`} after={BULLET} />,
  },
  stepsTail: "Talk first, polish after.",
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
    title: "The hardest part is the blank page.",
    text: "Talking gets the raw material out. The editor and AI rewrite turn it into a resume.",
    note: `Voice input is free in the editor. The AI rewrite comes with paid plans from ${entryPriceLabel()}.`,
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
