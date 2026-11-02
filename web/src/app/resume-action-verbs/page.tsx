import { SiteShell } from "@/components/site/site-shell";
import { JsonLd } from "@/components/json-ld";
import { container, labelCls } from "@/components/site/ui";
import { VerbExplorer } from "@/components/site/tools/verb-explorer";
import { MoreTools, NumberedCards, ToolFaq, ToolHero, ToolNextSteps, toolSectionPad } from "@/components/site/tools/tool-page";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { countVerbs, VERB_GROUPS, WEAK_OPENERS } from "@/lib/seo/action-verbs";
import { toolBreadcrumbLd } from "@/lib/seo/free-tools";
import { faqPageLd, type FaqItem } from "@/lib/faq-ld";
import { absoluteUrl } from "@/lib/site";

const PATH = "/resume-action-verbs";
const VERB_COUNT = countVerbs();
const GROUP_COUNT = VERB_GROUPS.length;
const DESCRIPTION = `${VERB_COUNT} resume action verbs grouped into ${GROUP_COUNT} skill areas, each with an example bullet. Replace “responsible for” with a verb that shows what you did.`;

export const metadata = buildMarketingMetadata({
  title: `${VERB_COUNT} Resume Action Verbs, With Example Bullets`,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  keywords: ["resume action verbs", "action words for resume", "power words for resume", "resume verbs list", "strong verbs for resume"],
});

const faqs: FaqItem[] = [
  {
    q: "What are action verbs on a resume?",
    a: "Past-tense verbs such as led, built or reduced that open a bullet and say what you did. They replace weak openers like “responsible for” and make each line about an action and its result.",
  },
  {
    q: "Should every bullet start with a different verb?",
    a: "Try not to repeat the same verb within one job. Across the whole resume a few repeats are fine, as long as each verb fits what you actually did.",
  },
  {
    q: "Past or present tense?",
    a: "Past tense for previous jobs and finished work. Present tense for ongoing duties in your current job — for example “Manage a team of 6” — and past tense for things you've completed there.",
  },
  {
    q: "Are the example bullets real?",
    a: "They're illustrative — written to show the shape of a strong bullet, not taken from anyone's resume. Use your own numbers and results, and only ones you can back up in an interview.",
  },
];

const steps = [
  { t: "Pick the verb that fits", d: "Choose the one that says what you really did — led is not the same as supported." },
  { t: "Add what and how much", d: "The task, its scope, and a number only if it's true." },
  { t: "End with what changed", d: "The result, if there was one. If not, the scope is enough." },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: `${VERB_COUNT} Resume Action Verbs`,
      url: absoluteUrl(PATH),
      description: DESCRIPTION,
      inLanguage: "en-US",
      isAccessibleForFree: true,
    },
    toolBreadcrumbLd({ name: "Action verbs", path: PATH }),
    faqPageLd(faqs),
  ],
};

export default function ActionVerbsPage() {
  return (
    <SiteShell>
      <JsonLd data={ld} />
      <ToolHero
        crumb="Action verbs"
        title={`${VERB_COUNT} resume action verbs.`}
        muted="Grouped by what you did."
        lead={`Replace “responsible for” with a verb that says what changed. ${GROUP_COUNT} skill areas, an example bullet for every verb — click a verb to copy it.`}
      />

      <section className={`${container} pt-7 lg:pt-10`}>
        <VerbExplorer groups={VERB_GROUPS} />
        <p className="mt-4 text-[13px] text-[#66647c]">Example bullets are illustrative. Use your own facts and numbers.</p>
      </section>

      <section className={`${container} ${toolSectionPad}`}>
        <div className="lc-reveal grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <p className={labelCls}>/ Swap these</p>
            <h2 className="lc-h2 mt-5">
              Weak openers, <span>and what to say instead.</span>
            </h2>
          </div>
          <div className="lc-card overflow-hidden rounded-3xl">
          <table className="w-full text-left text-[15px] lg:text-[16px]">
            <caption className="sr-only">Weak resume openers and stronger replacements</caption>
            <thead className="bg-[#111118] text-white">
              <tr>
                <th scope="col" className="px-4 py-3 font-bold lg:px-6">
                  Instead of
                </th>
                <th scope="col" className="px-4 py-3 font-bold lg:px-6">
                  Try
                </th>
              </tr>
            </thead>
            <tbody>
              {WEAK_OPENERS.map((w) => (
                <tr key={w.weak} className="border-t border-[#efedf7]">
                  <td className="px-4 py-3 text-[#8f1d22] lg:px-6">“{w.weak}”</td>
                  <td className="px-4 py-3 font-semibold lg:px-6">{w.strong}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </section>

      <NumberedCards label="How to use them" title="Verb first, then the facts." muted="Three steps per bullet." items={steps} />
      <MoreTools current="verbs" />
      <ToolFaq title="Action verbs," muted="answered." faqs={faqs} />
      <ToolNextSteps
        location="action_verbs_next"
        title="Turn the verbs into bullets."
        lead="The free bullet point generator writes three options from what you did. The editor, templates and PDF export are free with an account."
      />
    </SiteShell>
  );
}
