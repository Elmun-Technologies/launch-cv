import { FeaturePage, type FeaturePageData } from "@/components/marketing/feature-page";
import { buildMarketingMetadata, FEATURES_OG_IMAGE } from "@/lib/build-metadata";

export const metadata = buildMarketingMetadata({
  title: "AI Interview Prep — Likely Questions for Your Job, With Answer Outlines",
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

const f: FeaturePageData = {
  path: "/features/interview-prep",
  name: "Interview Prep",
  h1: "Know what they'll ask.",
  h1Tail: "And what from your resume answers it.",
  lead:
    "From your resume and the job description, LaunchCV writes the ten questions you're most likely to face for that role, an outline for answering each one with your own examples, and a short elevator pitch.",
  facts: ["10 role-specific questions", "Answer outlines from your resume", "25–40 second pitch"],
  photo: { src: "/images/photos/interview-panel.webp", alt: "Candidate in an interview with a hiring panel" },
  example: {
    title: "What a question looks like",
    caption: "Example for a product manager interview. Your questions come from your resume and the job you paste.",
    body: (
      <div className="flex flex-col gap-5">
        {[
          {
            q: "Tell us about a time research changed your roadmap.",
            a: "Use the 30+ interviews at Brightpath: what you heard, the two features it led to, and how you measured the result.",
          },
          {
            q: "How do you get legal and sales to agree on a launch?",
            a: "Walk through the HIPAA messaging launch: who needed what, the trade-off you proposed, and the date you shipped.",
          },
        ].map((x, i) => (
          <div key={x.q} className="border-t border-[#EEEEEB] pt-4 first:border-t-0 first:pt-0">
            <p className="text-[16px] font-semibold">
              {i + 1}. {x.q}
            </p>
            <p className="mt-1.5 text-[15px] leading-[1.6] text-[#3F3F3F]">
              <span className="text-[#6E6E6A]">Answer outline — </span>
              {x.a}
            </p>
          </div>
        ))}
      </div>
    ),
  },
  steps: [
    { t: "Choose the resume you sent", d: "Questions and outlines use the experience on that version." },
    { t: "Paste the job description", d: "Questions follow what this role and company are screening for." },
    { t: "Read the questions and outlines", d: "Each outline points to the example from your resume that answers it best." },
    { t: "Practise out loud", d: "Use the elevator pitch for “tell me about yourself” and rehearse the rest." },
  ],
  gets: [
    { t: "10 likely questions", d: "A mix of role, experience and behavioural questions for this job." },
    { t: "Answer outlines", d: "Which of your experiences to use and what points to hit." },
    { t: "Elevator pitch", d: "25–40 seconds, written for this role." },
    { t: "Cover letter", d: "Included in the same packet." },
    { t: "One packet per job", d: "Run it again for each application; questions follow that posting." },
    { t: "No invented stories", d: "Outlines only use what's in your resume." },
  ],
  banner: {
    photo: { src: "/images/photos/interview-handshake.webp", alt: "Candidate shaking hands after an interview" },
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
    { kind: "Tool", label: "Track your applications", href: "/register" },
  ],
};

export default function InterviewPrepPage() {
  return <FeaturePage f={f} />;
}
