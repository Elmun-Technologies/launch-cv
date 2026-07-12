/**
 * Generative Engine Optimization (GEO) helpers.
 *
 * Small, dependency-free builders for the JSON-LD that AI answer engines and
 * search crawlers lift from our pages: Speakable, HowTo, and Product review /
 * aggregate-rating schema. Keeping these in one place ensures every marketing
 * page emits consistent, valid structured data that matches its visible copy.
 */

import type { BlogPost } from "@/lib/cms/blog";

/**
 * Site-wide aggregate rating. This is the single source of truth for the
 * "4.9/5 from 2,400+ reviews" claim shown across the marketing site — the
 * visible copy and every AggregateRating node should read from here.
 */
export const AGGREGATE_RATING = {
  ratingValue: "4.9",
  reviewCount: "2400",
  bestRating: "5",
  worstRating: "1",
} as const;

export type SiteReview = {
  author: string;
  role: string;
  rating: number;
  /** ISO date (yyyy-mm-dd). */
  datePublished: string;
  body: string;
};

/**
 * Named customer reviews. These are also rendered as visible testimonials on
 * the home and pricing pages, so the `review` schema always has matching
 * on-page content (a Google requirement for review rich results).
 */
export const SITE_REVIEWS: SiteReview[] = [
  {
    author: "Sarah K.",
    role: "Software Engineer at Stripe",
    rating: 5,
    datePublished: "2026-05-14",
    body: "Zero callbacks for three months. Four interviews in one week after LaunchCV rewrote my bullets to match the JDs.",
  },
  {
    author: "Marcus T.",
    role: "Product Manager at Notion",
    rating: 5,
    datePublished: "2026-04-28",
    body: "My ATS score went from 38 to 93. Three offers in two weeks. The fixes were obvious in hindsight.",
  },
  {
    author: "Priya N.",
    role: "Marketing Lead at HubSpot",
    rating: 5,
    datePublished: "2026-04-09",
    body: "The cover letter generator writes better letters than I do. Saves me two hours per application — easily.",
  },
];

/** AggregateRating node for a Product / SoftwareApplication. */
export function aggregateRatingLd() {
  return { "@type": "AggregateRating", ...AGGREGATE_RATING };
}

/** Review nodes matching the visible testimonials in SITE_REVIEWS. */
export function reviewLdList() {
  return SITE_REVIEWS.map((r) => ({
    "@type": "Review",
    reviewRating: {
      "@type": "Rating",
      ratingValue: String(r.rating),
      bestRating: "5",
      worstRating: "1",
    },
    author: { "@type": "Person", name: r.author },
    datePublished: r.datePublished,
    reviewBody: r.body,
  }));
}

/**
 * SpeakableSpecification node. Marks the CSS selectors whose text is best
 * suited to be read aloud by voice assistants and lifted by answer engines.
 */
export function speakableLd(cssSelector: string[]) {
  return { "@type": "SpeakableSpecification", cssSelector };
}

export type HowToStep = { name: string; text: string; url?: string };

/** HowTo node for step-based guides and features. */
export function howToLd(input: {
  name: string;
  description: string;
  steps: HowToStep[];
  totalTime?: string;
  url?: string;
}) {
  return {
    "@type": "HowTo",
    name: input.name,
    description: input.description,
    ...(input.totalTime ? { totalTime: input.totalTime } : {}),
    ...(input.url ? { url: input.url } : {}),
    step: input.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url ? { url: s.url } : {}),
    })),
  };
}

/**
 * HowTo definitions for step-based blog posts, keyed by slug. Each step name /
 * text mirrors a visible step section in the post body, so the structured data
 * always matches on-page content. Posts that are pure explainers or listicles
 * are intentionally omitted.
 */
export const BLOG_HOWTO: Record<string, { name: string; description: string; totalTime?: string; steps: HowToStep[] }> = {
  "what-is-an-ats-score": {
    name: "How to improve your ATS score",
    description: "Raise your resume's ATS score so it reaches a human recruiter, in order of impact.",
    steps: [
      { name: "Switch to a single-column layout", text: "Remove tables, sidebars, and text boxes, and keep every important detail in the main body of the document." },
      { name: "Mirror the job description's language", text: "Pull the exact skills and tools from the posting and weave them naturally into your summary, experience bullets, and skills section." },
      { name: "Use standard section headings", text: "Use Work Experience, Education, and Skills — not clever alternatives the parser may not recognize." },
      { name: "Fix your file format", text: "Export a text-based PDF (not a scanned image), unless the application explicitly asks for a Word document." },
      { name: "Lead bullets with action verbs and numbers", text: "Write 'Increased signups 32%' rather than 'Responsible for growth' so bullets parse and read better." },
      { name: "Remove graphics and icon skill bars", text: "Images and rating graphics tell the ATS nothing, so replace them with plain text." },
      { name: "Re-check and iterate", text: "Score, fix the top flags, and re-score until you are comfortably above 80." },
    ],
  },
  "how-to-check-ats-score-of-resume": {
    name: "How to check the ATS score of your resume",
    description: "Check your resume's ATS score against a specific job in four steps.",
    steps: [
      { name: "Have your resume and a target job ready", text: "ATS scoring is only meaningful against a specific role, so pick the exact posting and have your resume as a PDF or DOCX." },
      { name: "Upload both to an ATS checker", text: "Paste the job description and upload your resume into a resume ATS score checker that parses it the way real ATS platforms do." },
      { name: "Read your score and the breakdown", text: "Review the 0–100 score split into formatting, keywords, structure, and readability, with the highest-impact issues first." },
      { name: "Fix the top flags and re-check", text: "Apply the fixes, re-run the check, and repeat until you are comfortably above 80." },
    ],
  },
  "voice-to-resume": {
    name: "How to build a resume with your voice",
    description: "Turn spoken experience into an ATS-ready resume in four steps.",
    steps: [
      { name: "Warm up by talking through one role", text: "Pick your most recent job and say out loud what your main responsibility was, what you built or improved, and what changed because of you." },
      { name: "Speak in specifics", text: "For each accomplishment, say a number and a result, e.g. 'I resolved about 40 tickets a day and cut average response time to under two hours.'" },
      { name: "Let the tool structure it", text: "The voice-to-text resume tool converts your speech into draft bullets and slots them into the right sections." },
      { name: "Edit for accuracy and keywords", text: "Fix any transcription errors and make sure the wording matches the jobs you are targeting." },
    ],
  },
  "resume-keywords-for-software-engineers": {
    name: "How to choose the right resume keywords for each job",
    description: "Pick the technical keywords that match each posting without keyword-stuffing.",
    steps: [
      { name: "Extract the posting's exact tech terms", text: "List every language, framework, tool, and practice the job description names." },
      { name: "Match against your real experience", text: "Keep the terms you have genuinely used and drop the rest." },
      { name: "Prioritize the required section", text: "Those terms are the most likely to be filter-matched, so make sure they appear." },
      { name: "Use the exact wording", text: "If the posting says 'TypeScript', write 'TypeScript' rather than only 'TS'." },
    ],
  },
  "how-to-write-an-ats-friendly-resume": {
    name: "How to write an ATS-friendly resume",
    description: "Format and optimize a resume so applicant tracking systems can read and rank it.",
    steps: [
      { name: "Use a single-column layout", text: "Drop tables and columns so the parser reads content in order, and keep all text in the document body." },
      { name: "Add standard sections in order", text: "Contact info, professional summary, work experience, education, then a dedicated skills section with explicit keyword matches." },
      { name: "Find and use the right keywords", text: "Analyze the job description and include the top 10–15 required skills and tools naturally throughout your resume." },
      { name: "Save the right file format", text: "Export a text-based PDF unless the posting asks for DOCX, and avoid images, logos, and icon skill bars." },
      { name: "Score and fix before applying", text: "Run the resume through an ATS score checker and address the flagged issues until you are above 80." },
    ],
  },
  "how-to-tailor-your-resume-for-every-job": {
    name: "How to tailor your resume for a job application",
    description: "Adapt your resume to a specific job description in under ten minutes.",
    steps: [
      { name: "Deconstruct the job description", text: "Identify required skills, preferred skills, and the language the company repeats and cares about most." },
      { name: "Rewrite your professional summary", text: "Rework 2–3 sentences to include the target job title, the company's core need, and your most relevant qualification." },
      { name: "Rewrite 2–3 bullet points per role", text: "Update the most recent roles to add missing keywords naturally, reframe experience toward the role, and include metrics." },
      { name: "Check your match score with AI", text: "Run a JD alignment check to calculate your match percentage, surface missing keywords, and reach an 85%+ match." },
    ],
  },
  "how-to-prepare-for-a-job-interview-with-ai": {
    name: "How to prepare for a job interview using AI",
    description: "A three-day plan to walk into an interview fully prepared with AI coaching.",
    steps: [
      { name: "Day 1 — Research the company", text: "Read the company website, LinkedIn, Glassdoor reviews, and recent news, and note three things you genuinely find interesting." },
      { name: "Day 2 — Practice with AI questions", text: "Run through 10–15 role-specific AI-generated questions, record yourself, and improve weak STAR answers by quantifying outcomes." },
      { name: "Day 3 — Simulate a full interview", text: "Answer 5–7 questions without pausing, review the feedback, fix your weakest areas, and prepare five questions to ask." },
    ],
  },
  "ai-resume-builder-complete-guide": {
    name: "How to build a resume with an AI resume builder",
    description: "Build and tailor an ATS-ready resume with an AI resume builder in six steps.",
    steps: [
      { name: "Choose an industry template", text: "Pick an ATS-safe template suited to your field — clean and information-dense for tech and finance." },
      { name: "Enter your basic information", text: "Add your name, contact details, and career objective." },
      { name: "Describe each role in plain language", text: "Describe what you did for each work experience entry, then review, edit, and accept the AI-transformed bullets." },
      { name: "Align to the job description", text: "Paste the target job description, check your keyword match score, and accept recommended improvements." },
      { name: "Export and run an ATS check", text: "Export as PDF, run the ATS score checker, and aim for 80 or above." },
      { name: "Generate a matching cover letter", text: "Create the cover letter from the same interface so it stays consistent with your resume." },
    ],
  },
};

/**
 * Derives a Key-facts / TL;DR box for a blog post from data already on the
 * page — the post description (lead answer) and its FAQ answers (liftable
 * facts). This keeps the box in sync with visible content for any post,
 * including future CMS-authored ones, with no extra authoring step.
 */
export function blogKeyFacts(post: BlogPost): { lead: string; facts: string[] } {
  const facts = (post.faqs ?? []).slice(0, 3).map((f) => f.a);
  return { lead: post.description, facts };
}
