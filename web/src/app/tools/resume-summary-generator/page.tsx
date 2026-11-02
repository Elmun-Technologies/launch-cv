import { SiteShell } from "@/components/site/site-shell";
import { JsonLd } from "@/components/json-ld";
import { SummaryGenerator } from "@/components/site/tools/summary-generator";
import { MoreTools, NumberedCards, ToolFaq, ToolHero, ToolNextSteps, ToolStage } from "@/components/site/tools/tool-page";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { freeToolsPageState } from "@/lib/seo/free-ai-tools";
import { toolPageLd } from "@/lib/seo/free-tools";
import type { FaqItem } from "@/lib/faq-ld";

/** The daily limit and the admin switch are read from settings; refresh them every minute. */
export const revalidate = 60;

const PATH = "/tools/resume-summary-generator";
const DESCRIPTION =
  "Write a resume summary from your job title, years of experience and best results. Get two free versions, no account, built only from the facts you type.";

export const metadata = buildMarketingMetadata({
  title: "Resume Summary Generator — Free, No Sign-Up",
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  keywords: [
    "resume summary generator",
    "professional summary generator",
    "AI resume summary",
    "resume profile examples",
    "summary for resume free",
  ],
});

function buildFaqs(limit: number): FaqItem[] {
  return [
    {
      q: "Is the summary generator free?",
      a: `Yes. You get ${limit} free generations a day, shared with the bullet point generator, and you don't need an account.`,
    },
    {
      q: "Will it add things I didn't say?",
      a: "No. It writes only from your job title, years, specialty and the strengths you list. Any version containing a number you didn't type is dropped before you see it. Read both versions once more before you use one.",
    },
    {
      q: "How long should a resume summary be?",
      a: "Two to three sentences, or about 40 to 75 words. It sits at the top of the page, so lead with what makes you a fit for the job.",
    },
    {
      q: "Do I need a summary if I'm early in my career?",
      a: "It helps when your experience doesn't speak for itself yet — for a career change, a first job or a gap. Enter 0 years and list what you have done: school projects, internships, volunteer work.",
    },
    {
      q: "Is what I type saved?",
      a: "No. Your text is sent to our AI provider to write the summaries and isn't stored by LaunchCV. We only count that a generation happened, so the daily limit works.",
    },
  ];
}

const parts = [
  { t: "Who you are", d: "Your job title and years — the first thing the reader scans for." },
  { t: "Where you shine", d: "The setting or specialty that matches the job you want." },
  { t: "Proof", d: "One or two real results. A number helps only if you can back it up." },
];

export default async function SummaryGeneratorPage() {
  const { limit, paused } = await freeToolsPageState();
  const faqs = buildFaqs(limit);
  return (
    <SiteShell>
      <JsonLd data={toolPageLd({ name: "Resume Summary Generator", crumb: "Resume summary generator", path: PATH, description: DESCRIPTION, faqs })} />
      <ToolHero
        crumb="Resume summary generator"
        title="Resume summary generator."
        muted="Two versions, your facts."
        lead="Tell us your role, years and two to four strengths or results. Get two summaries written only from what you typed."
      />
      <ToolStage>
        <SummaryGenerator limit={limit} paused={paused} />
      </ToolStage>
      <NumberedCards label="How it works" title="A strong summary does three jobs." muted="In under 75 words." items={parts} />
      <MoreTools current="summary" />
      <ToolFaq title="Summary generator," muted="answered." faqs={faqs} />
      <ToolNextSteps
        location="summary_generator_next"
        title="Put your summary in a real resume."
        lead="The editor, templates and PDF export are free with an account. Check the finished resume with the free ATS check."
      />
    </SiteShell>
  );
}
