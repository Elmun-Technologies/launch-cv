import Image from "next/image";
import { FeaturePage, Stage, ExampleTag, type FeaturePageData } from "@/components/marketing/feature-page";
import { buildMarketingMetadata, FEATURES_OG_IMAGE } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "AI Cover Letter Generator From Your Resume",
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

const P1 = "Your Senior Product Manager posting asks for someone who can turn customer research into shipped features that move retention.";
const P2 =
  "At Brightpath Health I ran more than 30 customer interviews that shaped our 2024 roadmap, and led the self-scheduling launch that cut no-shows by 23% across 41 clinics.";

const stage = (
  <Stage bg="#111118" poster="LETTER" posterColor="#2a2840">
    <div aria-hidden="true" className="absolute bottom-[-102px] right-[-48px] h-[288px] w-[288px] rounded-full bg-[#5440e8] lg:bottom-[-170px] lg:right-[-80px] lg:h-[480px] lg:w-[480px]" />
    <Image
      src="/images/people/woman-blazer-laptop.webp"
      alt="Smiling woman in a grey blazer"
      width={620}
      height={1080}
      priority
      sizes="(min-width: 1024px) 270px, 185px"
      className="absolute bottom-0 right-0 h-[290px] w-auto max-w-none sm:h-[320px] lg:h-[470px]"
    />
    {/* Same example text as the panel below, so it's hidden from screen readers here. */}
    <div
      aria-hidden="true"
      className="lc-float absolute left-4 top-[96px] w-[210px] -rotate-3 rounded-lg bg-white p-4 text-[12px] leading-[18px] text-[#24223a] sm:w-[280px] lg:left-8 lg:top-[150px] lg:h-[420px] lg:w-[330px] lg:p-[26px] lg:text-[13px] lg:leading-[21px]"
    >
      <p className="lc-mono text-[11px] text-[#66647c]">Example draft</p>
      <p className="mt-2 font-bold">Dear Hiring Team,</p>
      <p className="mt-2 lg:mt-2.5">{P1}</p>
      <p className="mt-2 hidden sm:block lg:mt-2.5">{P2}</p>
      <p className="mt-2 text-[#7c7a94]">…</p>
    </div>
    <div className="lc-float lc-drift absolute left-[150px] top-[70px] rounded-[18px] bg-white p-2.5 text-[#121226] sm:left-[230px] lg:left-[250px] lg:top-[110px] lg:rounded-[22px] lg:p-[14px]">
      <p className="sr-only">Tone:</p>
      <div className="flex items-center gap-1.5">
        <span className="rounded-full bg-[#111118] px-3 py-[7px] text-[12px] font-semibold text-white lg:text-[13px]">Formal</span>
        <span className="rounded-full bg-[#f1eff8] px-3 py-[7px] text-[12px] font-semibold lg:text-[13px]">Neutral</span>
        <span className="hidden pl-1 pr-1 lg:inline">
          <ExampleTag />
        </span>
      </div>
    </div>
  </Stage>
);

const f: FeaturePageData = {
  path: "/features/cover-letter",
  name: "Cover Letter",
  h1: "A cover letter for this job,",
  h1Tail: "written from what you've actually done.",
  lead:
    "Pick a resume, paste the job description and choose a formal or neutral tone. You get a letter that connects your real experience to what the posting asks for — plus an elevator pitch and likely interview questions in the same packet.",
  facts: ["Formal or neutral tone", "Uses only your resume", "Copy in one click"],
  cta: { label: "Try it now", href: "/register" },
  stage,
  example: {
    title: "What you get back.",
    caption: "Example opening for a product manager role. Your letter is written from your resume and the posting you paste.",
    body: (
      <div className="max-w-[760px] rounded-xl bg-white px-5 py-6 text-[15px] leading-[25px] text-[#24223a] sm:px-9 sm:py-8 sm:text-[17px] sm:leading-7">
        <p>Dear Hiring Team,</p>
        <p className="mt-3.5">
          {P1} {P2}
        </p>
        <p className="mt-3.5 text-[#7c7a94]">…</p>
      </div>
    ),
  },
  stepsTail: "About a minute each time.",
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
