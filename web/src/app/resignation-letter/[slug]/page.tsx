import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { GuidePage, guideLd, guideWordCount, type GuideSection } from "@/components/site/seo/guide-page";
import { LetterSheet, letterPlainText } from "@/components/site/seo/letter-sheet";
import { LegalNote } from "@/components/site/seo/legal-note";
import { WordDownload } from "@/components/site/tools/word-download";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { SITE_AUTHOR } from "@/lib/author";
import { NOT_LEGAL_ADVICE, RESIGNATION_GENERATOR_PATH, RESIGNATION_HUB_PATH, RESIGNATION_PUBLISHED, RESIGNATION_UPDATED } from "@/lib/seo/resignation-letter";
import { getResignationTemplate, RESIGNATION_TEMPLATES, type ResignationTemplate } from "@/lib/seo/resignation-templates";

type Params = { slug: string };

// Unknown slugs 404 via notFound(), as on /cover-letter-examples/[slug].
export function generateStaticParams(): Params[] {
  return RESIGNATION_TEMPLATES.map((t) => ({ slug: t.slug }));
}

const PARENT = { href: RESIGNATION_HUB_PATH, label: "Resignation letter" };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const t = getResignationTemplate(slug);
  if (!t) return {};
  return buildMarketingMetadata({
    title: fitTitle(...t.titles),
    description: t.description,
    pathname: `${RESIGNATION_HUB_PATH}/${t.slug}`,
    image: DEFAULT_OG_IMAGE,
    type: "article",
    article: { publishedTime: RESIGNATION_PUBLISHED, modifiedTime: RESIGNATION_UPDATED, authors: [SITE_AUTHOR.name], section: "Career" },
    keywords: t.keywords,
  });
}

function sectionsFor(t: ResignationTemplate): GuideSection[] {
  const bullets = (items: string[]) => items.map((x) => `- ${x}`).join("\n");
  return [
    {
      id: "when-to-use",
      title: "When to use this letter",
      body: [bullets(t.whenToUse), ...(t.caution ? [`**Before you send it:** ${t.caution}`] : [])],
    },
    ...t.versions.map((v) => ({ id: v.id, title: v.title, body: [v.note], figure: v.id })),
    ...(t.roleNotes ? [{ id: "role-notes", title: t.roleNotes.title, body: t.roleNotes.body }] : []),
    { id: "tips", title: "Tips", body: [bullets(t.tips)] },
    {
      id: "notice",
      title: "Notice and the law",
      body: [
        "In most US jobs two weeks' notice is a custom rather than a legal requirement, but a contract, union agreement, company policy or state law can set different rules — for notice, for final pay and for unused vacation. The [resignation letter guide](/resignation-letter#notice) explains US notice norms, with sources.",
      ],
      figure: "legal",
    },
  ];
}

export default async function ResignationTemplatePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const t = getResignationTemplate(slug);
  if (!t) notFound();

  const path = `${RESIGNATION_HUB_PATH}/${t.slug}`;
  const sections = sectionsFor(t);
  const words = guideWordCount(sections, t.faqs, [...t.versions.flatMap((v) => v.letter.paragraphs), NOT_LEGAL_ADVICE]);
  const ld = guideLd({
    path,
    headline: `${t.h1.replace(/:$/, "")}: ${t.muted.replace(/\.$/, "")}`,
    description: t.description,
    crumb: t.crumb,
    parent: PARENT,
    published: RESIGNATION_PUBLISHED,
    updated: RESIGNATION_UPDATED,
    words,
    section: "Career",
    faqs: t.faqs,
  });

  const figures: Record<string, ReactNode> = { legal: <LegalNote /> };
  t.versions.forEach((v, i) => {
    // The section H2 already names the version; the figure heading says which one it is.
    figures[v.id] = (
      <LetterSheet
        heading={t.versions.length > 1 ? `Version ${i + 1} of ${t.versions.length}` : "The letter"}
        headingId={`${v.id}-letter`}
        letter={v.letter}
        copyLabel="Copy text"
        placeholders
        numbered={false}
        actions={
          <WordDownload text={letterPlainText(v.letter)} filename={`${t.slug}-${v.id}`} srLabel={`Download ${v.title.toLowerCase()} as Word`} />
        }
        footnote="Replace every [bracketed] placeholder, and delete anything that doesn't apply."
      />
    );
  });

  const related = t.related.flatMap((s) => {
    const r = getResignationTemplate(s);
    return r ? [{ href: `${RESIGNATION_HUB_PATH}/${r.slug}`, t: r.card.t, d: r.card.d }] : [];
  });

  return (
    <GuidePage
      ld={ld}
      path={path}
      crumb={t.crumb}
      parent={PARENT}
      title={t.h1}
      muted={t.muted}
      lead={t.lead}
      updated={RESIGNATION_UPDATED}
      words={words}
      sections={sections}
      figures={figures}
      faqs={t.faqs}
      aside={{
        label: "Write your resignation letter",
        title: "Fill it in for you",
        sub: "Enter your details and get two versions in your tone, ready to copy or download as Word. Free, no account.",
        cta: { cta: "resignation_generator", location: `resignation_${t.slug}`, href: RESIGNATION_GENERATOR_PATH, label: "Open the generator" },
        card: { title: "Every situation", sub: "Templates for notice, email, retirement and more, plus how to write one.", href: RESIGNATION_HUB_PATH, link: "All resignation letters" },
      }}
      related={[...related, { href: RESIGNATION_GENERATOR_PATH, t: "Resignation letter generator", d: "Two free versions from your own details." }]}
      finalCta={{
        title: "Moving on? Get your resume ready.",
        sub: "The free ATS check flags columns, tables, missing contact details and inconsistent dates.",
        cta: "free_ats_check",
        location: `resignation_${t.slug}_footer`,
        href: "/free-ats-check",
        label: "Check my resume — free",
      }}
    />
  );
}
