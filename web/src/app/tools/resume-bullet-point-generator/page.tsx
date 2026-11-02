import { SiteShell } from "@/components/site/site-shell";
import { JsonLd } from "@/components/json-ld";
import { BulletGenerator } from "@/components/site/tools/bullet-generator";
import { MoreTools, NumberedCards, ToolFaq, ToolHero, ToolNextSteps, ToolStage } from "@/components/site/tools/tool-page";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { freeToolsPageState } from "@/lib/seo/free-ai-tools";
import { toolPageLd } from "@/lib/seo/free-tools";
import type { FaqItem } from "@/lib/faq-ld";

/** The daily limit and the admin switch are read from settings; refresh them every minute. */
export const revalidate = 60;

const PATH = "/tools/resume-bullet-point-generator";
const DESCRIPTION =
  "Turn a rough duty into three results-focused resume bullet points. Free, no account, and it uses only the facts you type — no invented numbers.";

export const metadata = buildMarketingMetadata({
  title: "Resume Bullet Point Generator — Free, No Sign-Up",
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  keywords: [
    "resume bullet point generator",
    "resume bullet generator",
    "AI resume bullet points",
    "accomplishment statements resume",
    "rewrite resume bullets free",
  ],
});

function buildFaqs(limit: number): FaqItem[] {
  return [
    {
      q: "Is the bullet point generator free?",
      a: `Yes. You get ${limit} free generations a day, shared with the summary generator, and you don't need an account. Inside the resume editor, AI bullet rewrites come with a paid plan.`,
    },
    {
      q: "Will it make up numbers?",
      a: "No. It is told to use only what you type, and any option containing a number you didn't give is dropped before you see it. If you have a real figure — volume, time saved, money — add it in the optional field.",
    },
    {
      q: "What makes a good resume bullet?",
      a: "A strong past-tense verb, what you did with its scale, and what changed because of it. Keep it to one or two lines, and lead with the part the employer cares about most.",
    },
    {
      q: "How many bullets should each job have?",
      a: "Three to five for recent, relevant jobs is common. Older or less related jobs can get one or two. Choose the bullets that match the job you're applying for.",
    },
    {
      q: "Is what I type saved?",
      a: "No. Your text is sent to our AI provider to write the bullets and isn't stored by LaunchCV. We only count that a generation happened, so the daily limit works.",
    },
  ];
}

const parts = [
  { t: "A strong verb", d: "Led, cut, launched, resolved — not “responsible for” or “helped with”." },
  { t: "What you did", d: "The task in plain words, with the scale if you know it: 60 a day, 41 clinics." },
  { t: "What changed", d: "The result, if there was one: fewer repeat calls, faster response, more sign-ups." },
];

export default async function BulletGeneratorPage() {
  const { limit, paused } = await freeToolsPageState();
  const faqs = buildFaqs(limit);
  return (
    <SiteShell>
      <JsonLd data={toolPageLd({ name: "Resume Bullet Point Generator", crumb: "Resume bullet point generator", path: PATH, description: DESCRIPTION, faqs })} />
      <ToolHero
        crumb="Resume bullet point generator"
        title="Resume bullet point generator."
        muted="Duty in, result out."
        lead="Type what you did the way you’d say it. Get three results-first bullets that keep your facts — no invented numbers."
      />
      <ToolStage>
        <BulletGenerator limit={limit} paused={paused} />
      </ToolStage>
      <NumberedCards label="How it works" title="A good bullet has three parts." items={parts} />
      <MoreTools current="bullets" />
      <ToolFaq title="Bullet generator," muted="answered." faqs={faqs} />
      <ToolNextSteps
        location="bullet_generator_next"
        title="Put your bullets in a real resume."
        lead="The editor, templates and PDF export are free with an account. Check the finished resume with the free ATS check."
      />
    </SiteShell>
  );
}
