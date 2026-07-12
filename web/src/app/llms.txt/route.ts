import { getPublishedPosts } from "@/lib/cms/blog";
import { PUBLIC_PLANS, planBillingDuration, planBillingSummary } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER } from "@/lib/plan-config";
import { getSiteUrl } from "@/lib/site";

/**
 * Dynamic llms.txt for Generative Engine Optimization.
 *
 * Replaces the former static public/llms.txt so the file always lists every
 * live feature page, use-case page, and published blog post — each with a
 * one-line, answer-style summary AI engines can cite directly. Blog entries are
 * pulled from the CMS so new posts appear automatically. Pricing is generated
 * from the shared source of truth (src/lib/monetization.ts) so it stays
 * identical to the homepage, /pricing, OG images, and JSON-LD. Regenerated hourly.
 */
export const revalidate = 3600;

const FEATURE_PAGES: { title: string; path: string; summary: string }[] = [
  {
    title: "Features overview",
    path: "/features",
    summary: "Six AI tools in one subscription — AI resume builder, JD alignment, ATS score checker, cover letter generator, interview prep, and voice input — where each output feeds the next.",
  },
  {
    title: "AI Resume Builder",
    path: "/features/resume-builder",
    summary: "Build an ATS-friendly resume in under five minutes with 12 industry templates, AI-written bullet points, a live preview, and PDF or DOCX export.",
  },
  {
    title: "JD Alignment Match",
    path: "/features/jd-alignment",
    summary: "Paste any job description and LaunchCV maps every requirement to your resume, fills keyword gaps, and rewrites bullets to raise your match score from ~40% to 90%+ in about 60 seconds.",
  },
  {
    title: "ATS Score Checker",
    path: "/features/ats-score",
    summary: "Upload a resume to get a 0–100 ATS score in about 8 seconds, tested against 15 real ATS engines with a prioritized fix list; the average user gains +43 points.",
  },
  {
    title: "Cover Letter Generator",
    path: "/features/cover-letter",
    summary: "Generate a tailored, ATS-safe cover letter from your resume and a job description in under a minute, with 4 tone modes and 14 languages.",
  },
  {
    title: "Interview Preparation",
    path: "/features/interview-prep",
    summary: "Generate role-specific practice questions from your resume and target job, then get AI-scored STAR feedback and benchmark answers before the interview.",
  },
  {
    title: "Voice Input",
    path: "/features/voice-input",
    summary: "Speak your experience instead of typing it; the voice-to-text resume builder transcribes your words and turns them into quantified, ATS-ready bullets in 12 languages.",
  },
];

const USE_CASE_PAGES: { title: string; path: string; summary: string }[] = [
  {
    title: "Use cases overview",
    path: "/use-cases",
    summary: "See how LaunchCV tailors resumes to specific fields with role-specific AI bullets for software engineers, product managers, and designers.",
  },
  {
    title: "For Software Engineers",
    path: "/use-cases/software-engineers",
    summary: "AI rewrites engineering bullets to quantify latency, throughput, scope, and ownership and surfaces the exact technical keywords recruiters and ATS filters search for.",
  },
  {
    title: "For Product Managers",
    path: "/use-cases/product-managers",
    summary: "Turns roadmaps, OKRs, and A/B tests into quantified, baselined, ATS-clean resume bullets in the language PM recruiters scan for.",
  },
  {
    title: "For Designers",
    path: "/use-cases/designers",
    summary: "Writes ATS-clean design resume bullets that quantify impact and shipping speed so your resume lands the interview your portfolio deserves.",
  },
];

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

function renderLinkList(
  items: { title: string; path: string; summary: string }[],
  baseUrl: string,
): string {
  return items
    .map((it) => `- ${it.title}: ${baseUrl}${it.path}\n  ${it.summary}`)
    .join("\n");
}

export async function GET(): Promise<Response> {
  const baseUrl = getSiteUrl();
  const posts = await getPublishedPosts();

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

  const featuresBlock = renderLinkList(FEATURE_PAGES, baseUrl);
  const useCasesBlock = renderLinkList(USE_CASE_PAGES, baseUrl);

  const blogBlock = posts.length
    ? posts
        .map((p) => {
          const summary = (p.seoDescription || p.description).replace(/\s+/g, " ").trim();
          return `- ${p.title}: ${baseUrl}/blog/${p.slug}\n  ${summary}`;
        })
        .join("\n")
    : `- Blog index: ${baseUrl}/blog`;

  const body = `# LaunchCV — AI Resume Builder & Job Search Copilot
# ${baseUrl}

## What is LaunchCV?

LaunchCV is a professional AI-powered resume and job search platform for modern job seekers.
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

LaunchCV is a paid professional product. There is no free tier for AI features.

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

- Product: LaunchCV
- Website: ${baseUrl}
- Support: support@launch-cv.com
- Founded: 2025

## Core Pages

- Home: ${baseUrl}/
- Pricing: ${baseUrl}/pricing
- Free ATS Check (no account): ${baseUrl}/free-ats-check
- Blog: ${baseUrl}/blog
- About: ${baseUrl}/about
- Contact: ${baseUrl}/contact

## Features (one per AI tool)

${featuresBlock}

## Use Cases (by role)

${useCasesBlock}

## Guides & Blog

Evidence-based career guides written by the LaunchCV editorial team. Every published
article, with a one-line answer-style summary:

${blogBlock}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
