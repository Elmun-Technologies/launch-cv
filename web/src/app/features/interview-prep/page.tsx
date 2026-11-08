import { ResumeSheet } from "@/components/site/resume-sheet";
import { FeaturePage, Stage, ExampleTag, DarkTile, LilacTile, type FeaturePageData } from "@/components/marketing/feature-page";
import { buildMarketingMetadata, FEATURES_OG_IMAGE } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "AI Interview Prep — Likely Questions for Your Job",
  description:
    "Get the ten questions you're most likely to be asked for a specific job, each with an answer outline built from your resume, plus an elevator pitch.",
  pathname: "/features/interview-prep",
  image: FEATURES_OG_IMAGE,
  keywords: [
    "AI interview preparation",
    "likely interview questions for job",
    "interview questions from job description",
    "interview answer outline",
    "tell me about yourself answer",
  ],
});

const QUESTIONS = [
  {
    q: "Tell us about a time research changed your roadmap.",
    a: "Use the 30+ interviews at Brightpath: what you heard, the two features it led to, and how you measured the result.",
  },
  {
    q: "How do you get legal and sales to agree on a launch?",
    a: "Walk through the HIPAA messaging launch: who needed what, the trade-off you proposed, and the date you shipped.",
  },
];

const stage = (
  <Stage bg="#e4dfff" poster="PREP" posterColor="#d3cbff">
    <ResumeSheet
      example="product-manager"
      template="classic"
      className="absolute bottom-0 right-4 h-[160px] w-[150px] rotate-3 [--peek:0.184] sm:h-[220px] sm:w-[200px] sm:[--peek:0.245] lg:right-8 lg:h-[330px] lg:w-[260px] lg:[--peek:0.319]"
    />
    <div className="lc-float lc-drift absolute left-4 top-[88px] w-[200px] rounded-[18px] bg-[#111118] p-3.5 text-white sm:w-[260px] lg:left-8 lg:top-[150px] lg:w-[300px] lg:rounded-[22px] lg:p-[18px]">
      <p className="lc-mono flex justify-between text-[11px] text-[#c9c0ff]">
        Q1 <ExampleTag dark />
      </p>
      <p className="mt-1.5 text-[14px] font-bold leading-[19px] lg:text-[16px] lg:leading-[22px]">“{QUESTIONS[0].q}”</p>
    </div>
    <div className="lc-float lc-drift-2 absolute left-12 top-[196px] w-[190px] rounded-[18px] bg-white p-3.5 text-[#121226] sm:w-[250px] lg:left-20 lg:top-[300px] lg:w-[280px] lg:rounded-[22px] lg:p-[18px]">
      <p className="lc-mono text-[11px] text-[#5440e8]">Q2</p>
      <p className="mt-1.5 text-[14px] font-bold leading-[19px] lg:text-[16px] lg:leading-[22px]">“{QUESTIONS[1].q}”</p>
    </div>
    <div className="lc-float lc-drift-3 absolute left-4 top-[316px] w-[170px] rounded-[18px] bg-white p-3.5 text-[#121226] sm:w-[250px] lg:left-8 lg:top-[450px] lg:w-[280px] lg:rounded-[22px] lg:p-[18px]">
      <p className="text-[11px] font-bold tracking-[0.06em] text-[#66647c] lg:text-[12px]">FROM YOUR RESUME</p>
      <p className="mt-1 text-[13px] leading-[18px] lg:text-[14px] lg:leading-5">Self-scheduling launch · no-shows −23%</p>
    </div>
  </Stage>
);

const f: FeaturePageData = {
  path: "/features/interview-prep",
  name: "Interview Prep",
  h1: "Know what they'll ask.",
  h1Tail: "And what from your resume answers it.",
  lead:
    "From your resume and the job description, LaunchCV writes the ten questions you're most likely to face for that role, an outline for answering each one with your own examples, and a short elevator pitch.",
  facts: ["10 role-specific questions", "Answer outlines from your resume", "25–40 second pitch"],
  cta: { label: "Try it now", href: "/register" },
  stage,
  example: {
    title: "What a question looks like.",
    caption: "Example for a product manager interview. Your questions come from your resume and the job you paste.",
    body: (
      <div className="flex flex-col gap-3 sm:gap-4">
        {QUESTIONS.map((x, i) => (
          <div key={x.q} className="grid gap-3 sm:grid-cols-2 sm:gap-4">
            <DarkTile>
              <p className="lc-mono text-[12px] text-[#c9c0ff]">QUESTION {i + 1} OF 10</p>
              <p className="mt-3 text-[18px] font-bold leading-[26px] sm:text-[21px] sm:leading-[29px]">{x.q}</p>
            </DarkTile>
            <LilacTile label="ANSWER OUTLINE FROM YOUR RESUME">
              <p className="mt-3 text-[15px] leading-6 sm:text-[16px] sm:leading-[25px]">{x.a}</p>
            </LilacTile>
          </div>
        ))}
      </div>
    ),
  },
  stepsTail: "Ready the night before.",
  steps: [
    { t: "Choose the resume you sent", d: "Questions and outlines use the experience on that version." },
    { t: "Paste the job description", d: "Questions follow what this role and company are screening for." },
    { t: "Read the questions and outlines", d: "Each outline points to the example from your resume that answers it best." },
    { t: "Practice out loud", d: "Use the elevator pitch for “tell me about yourself” and rehearse the rest." },
  ],
  gets: [
    { t: "10 likely questions", d: "A mix of role, experience and behavioral questions for this job." },
    { t: "Answer outlines", d: "Which of your experiences to use and what points to hit." },
    { t: "Elevator pitch", d: "25–40 seconds, written for this role." },
    { t: "Cover letter", d: "Included in the same packet." },
    { t: "One packet per job", d: "Run it again for each application; questions follow that posting." },
    { t: "No invented stories", d: "Outlines only use what's in your resume." },
  ],
  banner: {
    title: "Walk in with your examples ready.",
    text: "Most interview nerves come from not knowing which story to tell. Pick them the night before.",
  },
  faqs: [
    {
      q: "How does LaunchCV choose the questions?",
      a: "It reads the resume you select and the job description you paste, and writes the questions an interviewer for that role is most likely to ask.",
    },
    {
      q: "What do I get for each question?",
      a: "An answer outline: which experience from your resume to use and the points to make. You still answer in your own words.",
    },
    {
      q: "Does it score my answers?",
      a: "No. It prepares questions and outlines; it doesn't record or grade your answers.",
    },
    {
      q: "Can I use it for any role?",
      a: "Yes. Questions are based on the job description you paste, so they follow the role and level of that posting.",
    },
    {
      q: "Is interview prep included in my plan?",
      a: "Yes. It's part of the application packet, included in every paid plan.",
    },
  ],
  related: [
    { kind: "Tool", label: "Cover letter generator", href: "/features/cover-letter" },
    { kind: "Guide", label: "How to prepare for a job interview with AI", href: "/blog/how-to-prepare-for-a-job-interview-with-ai" },
    { kind: "Guide", label: "The STAR method, explained", href: "/blog/star-method" },
    { kind: "Tool", label: "Track your applications", href: "/register" },
  ],
};

export default function InterviewPrepPage() {
  return <FeaturePage f={f} />;
}
