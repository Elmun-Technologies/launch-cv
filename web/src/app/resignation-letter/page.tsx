import Link from "next/link";
import { GuidePage, guideLd, guideWordCount } from "@/components/site/seo/guide-page";
import { NumberedCards } from "@/components/site/seo/numbered-cards";
import { LetterSheet, letterPlainText } from "@/components/site/seo/letter-sheet";
import { LegalNote } from "@/components/site/seo/legal-note";
import { WordDownload } from "@/components/site/tools/word-download";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { SITE_AUTHOR } from "@/lib/author";
import {
  NOT_LEGAL_ADVICE,
  RESIGNATION_FAQS,
  RESIGNATION_HUB_PATH,
  RESIGNATION_PARTS,
  RESIGNATION_PUBLISHED,
  RESIGNATION_QUICK,
  RESIGNATION_READING,
  RESIGNATION_SAMPLE,
  RESIGNATION_SECTIONS,
  RESIGNATION_SOURCES,
  RESIGNATION_TEMPLATE,
  RESIGNATION_UPDATED,
} from "@/lib/seo/resignation-letter";
import { RESIGNATION_TEMPLATES } from "@/lib/seo/resignation-templates";

const PATH = RESIGNATION_HUB_PATH;
const CRUMB = "Resignation letter";
const TITLE = fitTitle("Resignation Letter: Free Templates & Samples (2026)", "Resignation Letter: Free Templates & Samples");
const HEADLINE = "Resignation letter: free templates and samples";
const DESCRIPTION =
  "How to write a resignation letter, with a free copyable template, a sample, US notice norms, what not to say and templates for two weeks notice, email and more.";

export const metadata = buildMarketingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  type: "article",
  article: { publishedTime: RESIGNATION_PUBLISHED, modifiedTime: RESIGNATION_UPDATED, authors: [SITE_AUTHOR.name], section: "Career" },
  keywords: [
    "resignation letter",
    "resignation letter sample",
    "resignation letter template",
    "how to write a resignation letter",
    "letter of resignation",
    "resignation letter example",
  ],
});

const RELATED: { href: string; t: string; d: string }[] = [
  { href: "/tools/resignation-letter-generator", t: "Resignation letter generator", d: "Two free versions from your own details, no account." },
  { href: "/resignation-letter/two-weeks-notice", t: "Two weeks notice letter", d: "The standard US notice letter in three versions." },
  { href: "/cover-letter-template", t: "Cover letter template", d: "For the next job: a copyable template, explained." },
  { href: "/free-ats-check", t: "Free ATS check", d: "Make sure your resume is ready before you apply." },
];

function TemplateFigure() {
  return (
    <LetterSheet
      heading="Resignation letter template"
      headingId="template-letter"
      letter={RESIGNATION_TEMPLATE}
      copyLabel="Copy template"
      placeholders
      actions={<WordDownload text={letterPlainText(RESIGNATION_TEMPLATE)} filename="resignation-letter-template" />}
      footnote="Replace every [bracketed] placeholder. The numbers mark the four paragraphs described at the top of the page."
    />
  );
}

function SampleFigure() {
  return (
    <LetterSheet
      heading="Resignation letter sample"
      headingId="sample-letter"
      letter={RESIGNATION_SAMPLE}
      copyLabel="Copy sample"
      footnote="Sample letter: the people, company and dates are fictional."
    />
  );
}

function TemplateGrid() {
  return (
    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2 sm:gap-3">
      {RESIGNATION_TEMPLATES.map((t) => (
        <li key={t.slug}>
          <Link
            href={`${PATH}/${t.slug}`}
            className="lc-card group flex h-full flex-col rounded-[20px] p-[18px] transition-shadow hover:shadow-[0_30px_60px_-30px_rgba(36,24,120,0.45)] sm:p-5"
          >
            <span className="text-[16px] font-extrabold leading-snug text-[#121226] group-hover:text-[#5440e8] sm:text-[17px]">{t.card.t} →</span>
            <span className="mt-1 text-[14px] leading-[21px] text-[#4a4862]">{t.card.d}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function ResignationLetterPage() {
  const words = guideWordCount(RESIGNATION_SECTIONS, RESIGNATION_FAQS, [...RESIGNATION_QUICK, ...RESIGNATION_TEMPLATE.paragraphs, NOT_LEGAL_ADVICE]);
  const ld = guideLd({
    path: PATH,
    headline: HEADLINE,
    description: DESCRIPTION,
    crumb: CRUMB,
    published: RESIGNATION_PUBLISHED,
    updated: RESIGNATION_UPDATED,
    words,
    section: "Career",
    faqs: RESIGNATION_FAQS,
    sources: RESIGNATION_SOURCES,
  });

  // The legal note closes the notice section, where the rules are discussed.
  const sections = RESIGNATION_SECTIONS.map((s) => (s.id === "notice" ? { ...s, figure: "legal" } : s));

  return (
    <GuidePage
      ld={ld}
      path={PATH}
      crumb={CRUMB}
      title="Resignation letter:"
      muted="free templates and samples."
      lead="A copyable resignation letter template, a filled-in sample, how much notice to give in the US, what to leave out, and templates for two weeks notice, email and more."
      updated={RESIGNATION_UPDATED}
      words={words}
      intro={{ heading: "The four parts of a resignation letter", node: <NumberedCards items={RESIGNATION_PARTS} reveal={false} compact /> }}
      sections={sections}
      figures={{
        template: <TemplateFigure />,
        sample: <SampleFigure />,
        grid: <TemplateGrid />,
        legal: <LegalNote />,
      }}
      keyFacts={{ afterSection: "what-to-include", title: "Quick rules", lead: "Clear, short and on the record.", facts: RESIGNATION_QUICK }}
      sources={RESIGNATION_SOURCES}
      faqs={RESIGNATION_FAQS}
      aside={{
        label: "Write your resignation letter",
        title: "Write yours in a minute",
        sub: "Enter your details and get two versions to copy or download as Word. Free, no account.",
        cta: { cta: "resignation_generator", location: "resignation_hub", href: "/tools/resignation-letter-generator", label: "Open the generator" },
        card: { title: "Two weeks notice?", sub: "Three versions of the standard US notice letter.", href: "/resignation-letter/two-weeks-notice", link: "Two weeks notice letter" },
      }}
      related={RELATED}
      reading={RESIGNATION_READING}
      finalCta={{
        title: "Moving on? Get your resume ready.",
        sub: "The free ATS check flags columns, tables, missing contact details and inconsistent dates.",
        cta: "free_ats_check",
        location: "resignation_hub_footer",
        href: "/free-ats-check",
        label: "Check my resume — free",
      }}
    />
  );
}
