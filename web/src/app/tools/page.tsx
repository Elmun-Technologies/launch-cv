import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { JsonLd } from "@/components/json-ld";
import { Breadcrumbs, Chip, container } from "@/components/site/ui";
import { ToolFaq, ToolNextSteps } from "@/components/site/tools/tool-page";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { freeToolsPageState } from "@/lib/seo/free-ai-tools";
import { freeTools, toolBreadcrumbLd, TOOLS_INDEX_PATH, type FreeToolKey } from "@/lib/seo/free-tools";
import { faqPageLd, type FaqItem } from "@/lib/faq-ld";
import { absoluteUrl } from "@/lib/site";

/** The daily limit shown on the AI tools comes from settings; refresh it every minute. */
export const revalidate = 60;

const DESCRIPTION =
  "Free resume tools from LaunchCV: an ATS checker, bullet point and summary generators, a resume word counter and action verbs. No account needed to start.";

export const metadata = buildMarketingMetadata({
  title: "Free Resume Tools — ATS Check, Bullets & Summaries",
  description: DESCRIPTION,
  pathname: TOOLS_INDEX_PATH,
  image: DEFAULT_OG_IMAGE,
  keywords: ["free resume tools", "resume bullet point generator", "resume summary generator", "resume word counter", "free ATS checker"],
});

function buildFaqs(limit: number): FaqItem[] {
  return [
    {
      q: "Are these resume tools really free?",
      a: `Yes. The ATS check runs once a month per network. The bullet point and summary generators share ${limit} free generations a day. The word counter and the action verbs list have no limit.`,
    },
    {
      q: "Do I need an account?",
      a: "No. Every tool here works without one. A free account lets you save your ATS report and build your resume in the editor.",
    },
    {
      q: "Do the AI tools make things up?",
      a: "They're told to use only what you type, and any result with a number you didn't give is dropped. Still, read every line before you use it — it's your resume.",
    },
    {
      q: "Is my text stored?",
      a: "The word counter runs in your browser and sends nothing. The bullet and summary generators send your text to our AI provider and don't store it. The ATS check keeps your score and fixes, not your file.",
    },
  ];
}

function note(key: FreeToolKey, limit: number) {
  if (key === "ats") return "Free · once a month · no account";
  if (key === "bullets" || key === "summary") return `Free · ${limit} a day · no account`;
  if (key === "words") return "Free · runs in your browser";
  return "Free · copy any verb";
}

export default async function ToolsIndexPage() {
  const { limit } = await freeToolsPageState();
  const tools = freeTools();
  const faqs = buildFaqs(limit);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "Free resume tools",
        url: absoluteUrl(TOOLS_INDEX_PATH),
        description: DESCRIPTION,
        inLanguage: "en-US",
        mainEntity: {
          "@type": "ItemList",
          itemListElement: tools.map((t, i) => ({ "@type": "ListItem", position: i + 1, name: t.name, url: absoluteUrl(t.href) })),
        },
      },
      toolBreadcrumbLd(),
      faqPageLd(faqs),
    ],
  };

  return (
    <SiteShell>
      <JsonLd data={ld} />
      <section className={`${container} pt-4 lg:pt-8`}>
        <div className="mx-auto max-w-[1040px] text-center">
          <div className="flex justify-center [&_ol]:justify-center">
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Free tools" }]} />
          </div>
          <h1 className="mt-4 text-[36px] font-extrabold leading-[1.06] tracking-[-0.045em] sm:text-[52px] lg:mt-[22px] lg:text-[64px] lg:leading-[66px]">
            Free resume tools. <span className="text-[#7c7a94]">No account to start.</span>
          </h1>
          <p className="mx-auto mt-3.5 max-w-[640px] text-[16px] leading-[25px] text-[#4a4862] lg:mt-[18px] lg:text-[18px] lg:leading-7">
            Check your resume against ATS, write stronger bullets and a summary, and get the length right — using only your own facts.
          </p>
        </div>
      </section>

      <section className={`${container} pt-8 lg:pt-12`}>
        <ul className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-4">
          {tools.map((t, i) => (
            <li key={t.key} className={i === 0 ? "sm:col-span-2 lg:col-span-1 lg:row-span-2" : ""}>
              <Link
                href={t.href}
                className={`lc-rise motion-reduce:hover:transform-none group flex h-full flex-col rounded-[28px] p-6 lg:p-8 ${i === 0 ? "bg-[#5440e8] text-white lc-float" : "lc-card"}`}
              >
                <span>
                  {i === 0 ? (
                    <span className="inline-block rounded-full bg-white px-2.5 py-[5px] text-[12px] font-bold text-[#3a2bb8]">Start here</span>
                  ) : (
                    <Chip tone={t.kind === "AI" ? "lilac" : "soft"}>{t.kind === "AI" ? "AI" : t.kind === "Instant" ? "Instant" : "Guide"}</Chip>
                  )}
                </span>
                <span
                  className={`mt-6 block font-extrabold tracking-[-0.025em] transition-colors lg:mt-10 ${
                    i === 0 ? "text-[30px] leading-[34px] lg:text-[40px] lg:leading-[44px]" : "text-[22px] leading-7 group-hover:text-[#5440e8] lg:text-[26px] lg:leading-8"
                  }`}
                >
                  {t.name}
                </span>
                <span className={`mt-2 block text-[15px] leading-[23px] ${i === 0 ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>{t.blurb}</span>
                <span className={`mt-auto block pt-6 text-[13px] ${i === 0 ? "text-[#e4dfff]" : "text-[#66647c]"}`}>{note(t.key, limit)}</span>
                <span className={`mt-2 block text-[15px] font-semibold ${i === 0 ? "text-white" : "text-[#5440e8]"}`}>
                  Open →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <ToolFaq title="Free tools," muted="answered." faqs={faqs} />
      <ToolNextSteps
        location="tools_index_next"
        title="Ready to build the whole resume?"
        lead="The editor, templates and PDF export are free with an account. AI rewrites inside your resume and job matching come with a paid plan."
      />
    </SiteShell>
  );
}
