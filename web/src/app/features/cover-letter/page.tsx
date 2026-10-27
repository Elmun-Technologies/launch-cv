import { FeaturePage, type FeaturePageData } from "@/components/marketing/feature-page";
import { buildMarketingMetadata, FEATURES_OG_IMAGE } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "AI Cover Letter Generator — From Your Resume and the Job Post",
  description:
    "Generate a cover letter written from your resume and the job description, in a formal or neutral tone. No invented experience. Edit and copy in one click.",
  pathname: "/features/cover-letter",
  image: FEATURES_OG_IMAGE,
  keywords: [
    "AI cover letter generator",
    "cover letter from resume",
    "cover letter for job description",
    "cover letter writer",
    "personalized cover letter",
  ],
});

const f: FeaturePageData = {
  path: "/features/cover-letter",
  name: "Cover Letter",
  h1: "A cover letter for this job,",
  h1Tail: "written from what you've actually done.",
  lead:
    "Pick a resume, paste the job description and choose a formal or neutral tone. You get a letter that connects your real experience to what the posting asks for — plus an elevator pitch and likely interview questions in the same packet.",
  facts: ["Formal or neutral tone", "Uses only your resume", "Copy in one click"],
  photo: { src: "/images/photos/handshake-desk.webp", alt: "Two people shaking hands across a desk" },
  example: {
    title: "What you get back",
    caption: "Example opening for a product manager role. Your letter is written from your resume and the posting you paste.",
    body: (
      <div className="max-w-[680px] text-[15px] leading-[1.7] text-[#3F3F3F]">
        <p>Dear Hiring Team,</p>
        <p className="mt-3">
          Your Senior Product Manager posting asks for someone who can turn customer research into shipped features
          that move retention. At Brightpath Health I ran more than 30 customer interviews that shaped our 2024 roadmap,
          and led the self-scheduling launch that cut no-shows by 23% across 41 clinics.
        </p>
        <p className="mt-3 text-[#8A8A86]">…</p>
      </div>
    ),
  },
  steps: [
    { t: "Choose a resume", d: "Use the version you're sending for this job." },
    { t: "Paste the job description", d: "The letter references what this posting asks for, not a generic template." },
    { t: "Pick a tone", d: "Formal for traditional employers, neutral for most others." },
    { t: "Edit and copy", d: "Adjust anything you want, then copy the letter into the application." },
  ],
  gets: [
    { t: "Tailored cover letter", d: "Connects your experience to the posting's requirements." },
    { t: "Elevator pitch", d: "A 25–40 second answer to “tell me about yourself” for this role." },
    { t: "10 likely interview questions", d: "Each with an answer outline drawn from your resume." },
    { t: "No invented claims", d: "The model is told not to add experience or metrics you don't have." },
    { t: "Two tones", d: "Formal or neutral, depending on the company." },
    { t: "One-click copy", d: "Paste straight into an application form or email." },
  ],
  banner: {
    photo: { src: "/images/photos/colleagues-celebrate.webp", alt: "Colleagues celebrating good news at work" },
    title: "Spend your time on the interview, not the letter.",
    text: "Generate a first draft in about a minute, then make it yours.",
  },
  faqs: [
    {
      q: "How does the cover letter generator work?",
      a: "It reads the resume you choose and the job description you paste, then writes a letter that links your real experience to the posting's requirements, in the tone you pick.",
    },
    {
      q: "Will it invent achievements?",
      a: "No. It's instructed not to add work experience or metrics that aren't in your resume. Read the draft before sending and adjust anything that doesn't sound like you.",
    },
    {
      q: "Can I choose the tone?",
      a: "Yes — formal or neutral.",
    },
    {
      q: "What else is in the packet?",
      a: "An elevator pitch and ten likely interview questions with answer outlines, all based on the same resume and job description.",
    },
    {
      q: "Is it included in my plan?",
      a: "Yes. Every paid plan includes application packets; plans differ in how many you can generate per month.",
    },
  ],
  related: [
    { kind: "Tool", label: "Interview prep for this job", href: "/features/interview-prep" },
    { kind: "Guide", label: "Cover letter tips that actually work", href: "/blog/cover-letter-tips-that-actually-work" },
    { kind: "Tool", label: "Match your resume to a job", href: "/features/jd-alignment" },
  ],
};

export default function CoverLetterPage() {
  return <FeaturePage f={f} />;
}
