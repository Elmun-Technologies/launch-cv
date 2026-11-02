import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { JsonLd } from "@/components/json-ld";
import { container, labelCls } from "@/components/site/ui";
import { ResignationGenerator } from "@/components/site/tools/resignation-generator";
import { MoreTools, NumberedCards, ToolFaq, ToolHero, ToolNextSteps, ToolStage, toolSectionPad } from "@/components/site/tools/tool-page";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { freeToolsPageState } from "@/lib/seo/free-ai-tools";
import { toolPageLd } from "@/lib/seo/free-tools";
import { RESIGNATION_GENERATOR_PATH, RESIGNATION_HUB_PATH } from "@/lib/seo/resignation-letter";
import { RESIGNATION_TEMPLATES } from "@/lib/seo/resignation-templates";
import type { FaqItem } from "@/lib/faq-ld";

/** The daily limit and the admin switch are read from settings; refresh them every minute. */
export const revalidate = 60;

const PATH = RESIGNATION_GENERATOR_PATH;
const DESCRIPTION =
  "Write a resignation letter from your name, manager, company, job title and last day. Two free versions in your tone, copy or download as Word. No account.";

export const metadata = buildMarketingMetadata({
  title: fitTitle("Resignation Letter Generator — Free, No Sign-Up", "Free Resignation Letter Generator"),
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  keywords: ["resignation letter generator", "free resignation letter generator", "AI resignation letter", "resignation letter maker", "write a resignation letter"],
});

function buildFaqs(limit: number): FaqItem[] {
  return [
    {
      q: "Is the resignation letter generator free?",
      a: `Yes. You get ${limit} free generations a day, shared with the other free writing tools, and you don't need an account. The Word download is free too.`,
    },
    {
      q: "Will it add things I didn't say?",
      a: "No. It writes only from the details you enter. It won't mention a notice period, how long you've worked there or any project you didn't name, and any version with a date or number you didn't type is dropped before you see it.",
    },
    {
      q: "Do I have to give a reason?",
      a: "No. \"Prefer not to say\" is the default, and the letter then gives no reason at all. If you pick one, it's mentioned in general terms only.",
    },
    {
      q: "Is what I type saved?",
      a: "No. Your details are sent to our AI provider to write the letter and aren't stored by LaunchCV. The Word file is built from the text on your screen and isn't kept either. We only count that a generation happened, so the daily limit works.",
    },
    {
      q: "Is this legal advice?",
      a: "No. The generator writes a standard letter. Notice rules can come from your contract, company policy or state law, so check those if you're unsure.",
    },
  ];
}

const parts = [
  { t: "Your details", d: "Names, company, job title and your last day — the facts the letter must get right." },
  { t: "Your tone", d: "Formal, friendly or brief, and a reason only if you want to give one." },
  { t: "Two versions", d: "A standard letter and a short one. Copy either, or download it as Word." },
];

export default async function ResignationGeneratorPage() {
  const { limit, paused } = await freeToolsPageState();
  const faqs = buildFaqs(limit);
  const templates = RESIGNATION_TEMPLATES.slice(0, 8);
  return (
    <SiteShell>
      <JsonLd data={toolPageLd({ name: "Resignation Letter Generator", crumb: "Resignation letter generator", path: PATH, description: DESCRIPTION, faqs })} />
      <ToolHero
        crumb="Resignation letter generator"
        title="Resignation letter generator."
        muted="Your details, two versions."
        lead="Enter your name, your manager, the company, your job title and your last day. Get a standard and a short resignation letter, written only from what you typed."
        mobileLead="Enter your details and last day. Get two resignation letters, written only from what you typed."
      />
      <ToolStage>
        <ResignationGenerator limit={limit} paused={paused} />
      </ToolStage>
      <NumberedCards label="How it works" title="A good resignation letter is short." muted="And gets the date right." items={parts} />

      <section className={`${container} ${toolSectionPad}`} aria-labelledby="by-situation">
        <h2 id="by-situation" className={labelCls}>
          / Templates by situation
        </h2>
        <p className="mt-3 max-w-[640px] text-[16px] leading-[25px] text-[#4a4862]">
          Prefer to fill in a template yourself? Each one has versions to copy or download as Word.{" "}
          <Link href={RESIGNATION_HUB_PATH} className="lc-link font-semibold text-[#5440e8]">
            How to write a resignation letter →
          </Link>
        </p>
        <ul className="mt-[18px] grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
          {templates.map((t) => (
            <li key={t.slug}>
              <Link href={`${RESIGNATION_HUB_PATH}/${t.slug}`} className="lc-card lc-rise motion-reduce:hover:transform-none group block h-full rounded-3xl p-[22px] lg:p-6">
                <span className="block text-[18px] font-extrabold transition-colors group-hover:text-[#5440e8] lg:text-[19px]">{t.card.t}</span>
                <span className="mt-1.5 block text-[14px] text-[#4a4862]">{t.card.d}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <MoreTools current="resignation" />
      <ToolFaq title="Resignation letter generator," muted="answered." faqs={faqs} />
      <ToolNextSteps
        location="resignation_generator_next"
        title="Next job? Start with your resume."
        lead="The editor, templates and PDF export are free with an account. Check the finished resume with the free ATS check."
      />
    </SiteShell>
  );
}
