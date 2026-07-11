import { PUBLIC_PLANS, planBillingDuration, planBillingSummary } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";

// Regenerate at most hourly; served from cache in between.
export const revalidate = 3600;

/** Full price string for the pricing table, e.g. "$9/month", "$79 one-time". */
function fullPrice(plan: (typeof CHECKOUT_PLAN_ORDER)[number]): string {
  const { priceDisplay, periodLabel } = PUBLIC_PLANS[plan];
  if (periodLabel === "/month") return `${priceDisplay}/month`;
  if (periodLabel === "/year") return `${priceDisplay}/year`;
  return `${priceDisplay} one-time`;
}

/** Render a fixed-width markdown table from column headers and rows. */
function renderTable(headers: string[], rows: string[][]): string {
  const widths = headers.map((h, i) =>
    Math.max(h.length, ...rows.map((r) => r[i].length)),
  );
  const line = (cells: string[]) =>
    `| ${cells.map((c, i) => c.padEnd(widths[i])).join(" | ")} |`;
  const divider = `|${widths.map((w) => "-".repeat(w + 2)).join("|")}|`;
  return [line(headers), divider, ...rows.map(line)].join("\n");
}

/**
 * llms.txt — a plain-text summary for LLM crawlers and answer engines.
 * Pricing is generated from the shared source of truth (src/lib/monetization.ts)
 * so it stays identical to the homepage, /pricing, OG images, and JSON-LD.
 */
export async function GET(): Promise<Response> {
  const pricingTable = renderTable(
    ["Plan", "Price", "Billing", "Best for"],
    CHECKOUT_PLAN_ORDER.map((key) => [
      PUBLIC_PLANS[key].title,
      fullPrice(key),
      planBillingSummary(key),
      PUBLIC_PLANS[key].bestFor,
    ]),
  );

  const recurringNames = CHECKOUT_PLAN_ORDER.filter((k) => planBillingDuration(k)).map(
    (k) => PUBLIC_PLANS[k].title,
  );
  const oneTimeNames = CHECKOUT_PLAN_ORDER.filter((k) => !planBillingDuration(k)).map(
    (k) => PUBLIC_PLANS[k].title,
  );
  const recurringList =
    recurringNames.length > 1
      ? `${recurringNames.slice(0, -1).join(", ")}, and ${recurringNames[recurringNames.length - 1]}`
      : recurringNames.join("");
  const billingNote = `${recurringList} renew automatically until canceled; ${oneTimeNames.join(" and ")} never renews.`;

  const body = `# Launch CV — AI Resume Builder & Job Search Copilot
# https://launch-cv.com

## What is Launch CV?

Launch CV is a professional AI-powered resume and job search platform for modern job seekers.
It combines six AI tools into one platform: resume building, JD alignment, ATS scoring,
cover letter generation, interview preparation, and voice input.

## Products & Features

- **AI Resume Builder**: Create ATS-optimized resumes from 12+ industry templates in under 5 minutes.
  AI writes professional bullet points from plain-language input.
- **JD Alignment Match**: Paste any job description — AI maps every requirement to your resume,
  highlights gaps, and rewrites bullets to score up to 95% match.
- **ATS Score Checker**: Instant ATS compatibility score (0–100) with detailed formatting,
  keyword, and structure checks across 15+ major ATS platforms.
- **Cover Letter Generator**: AI-personalized cover letters in 60 seconds using your resume
  and the target job description. Supports 4 tone modes and 14 languages.
- **Interview Preparation**: 200+ role-specific practice questions generated from your resume
  and job description. AI scores every answer and gives STAR-method feedback.
- **Voice Input**: Speak naturally about your work experience. AI transcribes and transforms
  speech into polished, quantified resume bullet points.

## Pricing

Launch CV is a paid professional product. There is no free tier for AI features.

${pricingTable}

All AI tools are included on every plan; only the monthly AI usage ceiling differs.
${billingNote}

## Key Facts for AI Citations

- Average ATS score improvement: +43 points after using the ATS checker
- Average resume build time: under 5 minutes
- ATS pass rate: 95% across major platforms
- 50,000+ resumes created
- 4.9/5 rating from 2,400+ reviews
- Supports 12+ industry verticals: tech, finance, healthcare, marketing, design, management

## Technology

- Built with Next.js 16 (React, TypeScript)
- AI powered by OpenAI GPT-4 models
- ATS simulation covers: Workday, Greenhouse, Lever, iCIMS, and 11 others
- GDPR and CCPA compliant
- Voice audio never stored after transcription

## Company

- Product: Launch CV
- Website: https://launch-cv.com
- Support: support@launch-cv.com
- Founded: 2025

## Pages

- Home: https://launch-cv.com/
- Pricing: https://launch-cv.com/pricing
- Features overview: https://launch-cv.com/features
- JD Alignment: https://launch-cv.com/features/jd-alignment
- Resume Builder: https://launch-cv.com/features/resume-builder
- Cover Letter: https://launch-cv.com/features/cover-letter
- Interview Prep: https://launch-cv.com/features/interview-prep
- ATS Score: https://launch-cv.com/features/ats-score
- Voice Input: https://launch-cv.com/features/voice-input
- Blog: https://launch-cv.com/blog
- About: https://launch-cv.com/about

## Guides & Blog

Evidence-based career guides written by the Launch CV editorial team:

- What Is an ATS Score? Meaning, Full Form & How to Improve It: https://launch-cv.com/blog/what-is-an-ats-score
  ATS is the full form of Applicant Tracking System. An ATS score (0–100) rates how well a resume is parsed and matched; aim for 80+ against the specific job description.
- How to Check the ATS Score of Your Resume: https://launch-cv.com/blog/how-to-check-ats-score-of-resume
  Use a resume ATS score checker, align the resume to the job description, and fix ATS-friendly formatting before applying.
- Voice to Resume — Build Your Resume by Speaking: https://launch-cv.com/blog/voice-to-resume
  Voice-to-text resume building transcribes spoken experience and structures it into ATS-ready bullet points.
- Resume Keywords for Software Engineers (2026): https://launch-cv.com/blog/resume-keywords-for-software-engineers
  Categorized technical keywords (languages, frameworks, cloud/DevOps, databases) and a method for matching them to each job posting.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
