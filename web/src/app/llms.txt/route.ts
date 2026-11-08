import { getPublishedPosts } from "@/lib/cms/blog";
import { PUBLIC_PLANS, freeAllowanceSentence, planBillingDuration, planBillingSummary, planPriceLabel } from "@/lib/monetization";
import { CHECKOUT_PLAN_ORDER, PASS_DAYS, isPassPlan } from "@/lib/plan-config";
import { getSettings } from "@/lib/app-settings";
import { getSiteUrl } from "@/lib/site";
import { SITE_AUTHOR } from "@/lib/author";
import { RESUME_EXAMPLES } from "@/lib/resume-examples";

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
    summary: "Every LaunchCV tool in one place: a free ATS checker, a resume builder, job description match, cover letters, interview prep and voice input.",
  },
  {
    title: "AI Resume Builder",
    path: "/features/resume-builder",
    summary: "Build an ATS-friendly resume with 4 templates, AI bullet rewrites, PDF and Word export, and a live preview that matches the PDF.",
  },
  {
    title: "JD Alignment Match",
    path: "/features/jd-alignment",
    summary: "Paste any job description and LaunchCV maps each requirement to your resume, shows covered keywords and missing skills, and rewrites bullets for that job using only facts from your resume.",
  },
  {
    title: "ATS Score Checker",
    path: "/free-ats-check",
    summary: "Upload a resume to get a 0–100 ATS score in seconds, built for how ATS platforms like Workday, Greenhouse, and Lever parse resumes, with a prioritized fix list.",
  },
  {
    title: "Cover Letter Generator",
    path: "/features/cover-letter",
    summary: "Generate a tailored, ATS-safe cover letter from your resume and a job description in about a minute, with a Formal or Neutral tone.",
  },
  {
    title: "Interview Preparation",
    path: "/features/interview-prep",
    summary: "Generate role-specific interview questions from your resume and target job, each with a model answer outline built from your real background.",
  },
  {
    title: "Voice Input",
    path: "/features/voice-input",
    summary: "Dictate your summary and experience bullets in the browser (English), then use the AI rewrite to turn the transcript into results-first bullets.",
  },
];

const USE_CASE_PAGES: { title: string; path: string; summary: string }[] = [
  {
    title: "Cover letter examples",
    path: "/cover-letter-examples",
    summary: "Annotated cover letter examples by job, each written by the same person as the matching resume example, with tips and an FAQ.",
  },
  {
    title: "Resume templates",
    path: "/resume-templates",
    summary: "Four ATS-friendly resume templates (Classic, Modern, Minimal, Executive): single column, standard headings, real text, PDF export.",
  },
  {
    title: "Resume examples",
    path: "/resume-examples",
    summary: "Resume examples by job, each with summary and bullet examples, role keywords, ATS tips and an FAQ.",
  },
  {
    title: "Software engineer resume example",
    path: "/resume-examples/software-engineer",
    summary: "A senior backend engineer resume with quantified bullets and the language and tool keywords engineering recruiters search for.",
  },
  {
    title: "Product manager resume example",
    path: "/resume-examples/product-manager",
    summary: "A product manager resume built around activation, retention and revenue outcomes, plus PM keywords and ATS tips.",
  },
  {
    title: "UX designer resume example",
    path: "/resume-examples/ux-designer",
    summary: "A parseable product designer resume with measurable design outcomes and research and tool keywords.",
  },
];

/** Full price string for the pricing table, e.g. "$29/month", "$9 for 7 days". */
function fullPrice(plan: (typeof CHECKOUT_PLAN_ORDER)[number]): string {
  const { priceDisplay, periodLabel } = PUBLIC_PLANS[plan];
  if (periodLabel === "/month") return `${priceDisplay}/month`;
  if (periodLabel === "/year") return `${priceDisplay}/year`;
  if (isPassPlan(plan)) return planPriceLabel(plan);
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
  const [posts, { planLimits }] = await Promise.all([getPublishedPosts(), getSettings()]);

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
  const oneTimeNames = CHECKOUT_PLAN_ORDER.filter((k) => !planBillingDuration(k)).map((k) =>
    isPassPlan(k) ? `${PUBLIC_PLANS[k].title} (${PASS_DAYS[k]} days of access)` : PUBLIC_PLANS[k].title,
  );
  const recurringList =
    recurringNames.length > 2
      ? `${recurringNames.slice(0, -1).join(", ")}, and ${recurringNames[recurringNames.length - 1]}`
      : recurringNames.length === 2
        ? recurringNames.join(" and ")
      : recurringNames.join("");
  const billingNote = `${recurringList} ${recurringNames.length === 1 ? "renews" : "renew"} monthly until canceled. ${oneTimeNames.join(" and ")} ${
    oneTimeNames.length === 1 ? "is a single payment" : "are single payments"
  } with no auto-renewal.`;

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

  const body = `# LaunchCV — Resume Builder & Free ATS Checker
# ${baseUrl}

## What is LaunchCV?

LaunchCV is a web app for job seekers, made by Elmun Technologies LLC. It shows what
applicant tracking software (ATS) reads in a resume, then helps fix it and tailor it to a
specific job using only facts from the person's own resume. It also writes cover letters
and interview prep from the resume.

Full structured facts for AI assistants (company, features, free tools, plans, privacy,
contact): ${baseUrl}/ai-info

## Products & Features

- **ATS Resume Checker** (free, no account): a 0–100 score, what parsing software reads from
  the resume, and a fix for each issue. Rule-based signals (sections, dates, bullets,
  columns, contact details) are computed without AI and given to the AI as ground truth.
- **Resume Builder**: 4 ATS-friendly templates (Classic, Modern, Minimal, Executive), AI bullet
  rewrites, PDF and Word export; the preview matches the PDF.
- **Job Description Match**: paste a job posting to get a match score, covered keywords,
  missing skills and rewrites for that job.
- **Cover Letter Writer**: a letter for a specific job, written from the resume, in a Formal
  or Neutral tone. Downloads as Word.
- **Interview Prep**: likely questions for the role, each with an answer outline built from
  the candidate's own experience.
- **Voice Input**: dictate experience in the browser (English, US recognition), then turn the
  transcript into bullets with the AI rewrite.

## Free Tools (no account)

- ATS resume checker: ${baseUrl}/free-ats-check (once a month per network)
- Resume bullet point generator: ${baseUrl}/tools/resume-bullet-point-generator (daily limit)
- Resume summary generator: ${baseUrl}/tools/resume-summary-generator (daily limit)
- Resume word counter: ${baseUrl}/tools/resume-word-counter (runs in the browser)
- Job description keyword scanner: ${baseUrl}/tools/job-description-keyword-scanner (runs in the browser; ranks a
  posting's skills and tools and marks which a pasted resume already uses)
- Resume action verbs: ${baseUrl}/resume-action-verbs
- All free tools: ${baseUrl}/tools

## Pricing

The ATS check and the free tools need no account. A free account includes the resume editor,
all templates, PDF and Word export, the job tracker, and saving the free ATS report.
${freeAllowanceSentence(planLimits.free)} Paid plans raise those
monthly limits and include every AI tool (bullet rewrites, job description match, cover
letters, interview prep).

${pricingTable}

All AI tools are included on every paid plan; plans differ in how long access lasts and in
monthly AI usage limits.
${billingNote}
Monthly plans have a 7-day money-back guarantee.
Prices are in US dollars, plus any sales tax or VAT. Current prices: ${baseUrl}/pricing

## Key Facts for AI Citations

- Free ATS check with no account required
- AI rewrites use only facts from the resume; any number not in the resume becomes "[number]"
- ${RESUME_EXAMPLES.length} resume examples by role, each with a matching cover letter, across healthcare,
  trades and logistics, retail and hospitality, education, finance, business and tech
- Built for US job seekers: US Letter PDFs by default (A4 for the EU region setting)
- People and employers in the examples are fictional
- LaunchCV does not publish user counts or ratings

## Privacy

- The free ATS check reads the uploaded file once and does not store it; the report is kept
  so it can be saved to an account
- Voice input uses the browser's speech recognition; LaunchCV receives text, not audio
- Resumes are never sold or used for advertising; users can export or delete their data
- AI text processing by OpenAI or Anthropic (Claude); payments by Polar (LaunchCV never sees card details)
- Details: ${baseUrl}/legal/privacy

## Company

- Product: LaunchCV
- Company: Elmun Technologies LLC
- Founder: ${SITE_AUTHOR.name} (${SITE_AUTHOR.url})
- Website: ${baseUrl}
- Support: support@launch-cv.com
- Editorial process: ${baseUrl}/editorial-process
- Changelog: ${baseUrl}/changelog

## Core Pages

- Home: ${baseUrl}/
- Pricing: ${baseUrl}/pricing
- Free ATS Check (no account): ${baseUrl}/free-ats-check
- Resume examples by job, with keywords and bullet examples: ${baseUrl}/resume-examples
- Blog: ${baseUrl}/blog
- About: ${baseUrl}/about
- Contact: ${baseUrl}/contact
- Facts for AI assistants: ${baseUrl}/ai-info
- Editorial process: ${baseUrl}/editorial-process
- Changelog: ${baseUrl}/changelog

## Features (one per AI tool)

${featuresBlock}

## Use Cases (by role)

${useCasesBlock}

## Guides & Blog

Career guides written by ${SITE_AUTHOR.name}, founder of LaunchCV (how we write and check them:
${baseUrl}/editorial-process). Every published article, with a one-line summary:

${blogBlock}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
