import type { Metadata } from "next";
import type { ReactNode } from "react";
import { notFound } from "next/navigation";
import { GuidePage, guideLd, guideWordCount, type GuideSection } from "@/components/site/seo/guide-page";
import { LetterSheet, letterPlainText } from "@/components/site/seo/letter-sheet";
import { WordDownload } from "@/components/site/tools/word-download";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { SITE_AUTHOR } from "@/lib/author";
import {
  COVER_SITUATIONS,
  COVER_SITUATION_BASE,
  COVER_SITUATION_PUBLISHED,
  COVER_SITUATION_UPDATED,
  getCoverSituation,
  type CoverSituation,
} from "@/lib/seo/cover-letter-situations";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return COVER_SITUATIONS.map((s) => ({ slug: s.slug }));
}

const PARENT = { href: "/cover-letter-examples", label: "Cover letter examples" };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const s = getCoverSituation(slug);
  if (!s) return {};
  return buildMarketingMetadata({
    title: fitTitle(...s.titles),
    description: s.description,
    pathname: `${COVER_SITUATION_BASE}/${s.slug}`,
    image: DEFAULT_OG_IMAGE,
    type: "article",
    article: { publishedTime: COVER_SITUATION_PUBLISHED, modifiedTime: COVER_SITUATION_UPDATED, authors: [SITE_AUTHOR.name], section: "Cover Letters" },
    keywords: s.keywords,
  });
}

function sectionsFor(s: CoverSituation): GuideSection[] {
  const bullets = (items: string[]) => items.map((x) => `- ${x}`).join("\n");
  const [first, ...rest] = s.versions;
  return [
    { id: "when-to-use", title: "When to use this letter", body: [bullets(s.whenToUse)] },
    { id: first.id, title: first.title, body: [first.note], figure: first.id },
    {
      id: "structure",
      title: "What each paragraph does",
      body: [s.structure.map((x, i) => `${i + 1}. ${x}`).join("\n")],
    },
    ...rest.map((v) => ({ id: v.id, title: v.title, body: [v.note], figure: v.id })),
    { id: "tips", title: "Tips", body: [bullets(s.tips)] },
    {
      id: "more",
      title: "More cover letter help",
      body: [
        "For the full four-paragraph structure, formatting and sending rules, see the [cover letter template guide](/cover-letter-template). For a finished letter in your field, browse [cover letter examples by job](/cover-letter-examples). Your resume does the heavy lifting, so check it with the [free ATS check](/free-ats-check) before you send both.",
      ],
    },
  ];
}

export default async function CoverSituationPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const s = getCoverSituation(slug);
  if (!s) notFound();

  const path = `${COVER_SITUATION_BASE}/${s.slug}`;
  const sections = sectionsFor(s);
  const words = guideWordCount(sections, s.faqs, s.versions.flatMap((v) => v.letter.paragraphs));
  const ld = guideLd({
    path,
    headline: `${s.h1.replace(/:$/, "")}: ${s.muted.replace(/\.$/, "")}`,
    description: s.description,
    crumb: s.crumb,
    parent: PARENT,
    published: COVER_SITUATION_PUBLISHED,
    updated: COVER_SITUATION_UPDATED,
    words,
    section: "Cover Letters",
    faqs: s.faqs,
  });

  const figures: Record<string, ReactNode> = {};
  s.versions.forEach((v) => {
    figures[v.id] = (
      <LetterSheet
        heading={v.letter.subject ? "The email" : "The letter"}
        headingId={`${v.id}-letter`}
        letter={v.letter}
        copyLabel="Copy text"
        placeholders
        numbered={false}
        actions={<WordDownload text={letterPlainText(v.letter)} filename={`cover-letter-${s.slug}-${v.id}`} srLabel={`Download ${v.title.toLowerCase()} as Word`} />}
        footnote="Replace every [bracketed] placeholder with your own details, and cut anything that doesn't apply."
      />
    );
  });

  const related = s.related.flatMap((r) => {
    const x = getCoverSituation(r);
    return x ? [{ href: `${COVER_SITUATION_BASE}/${x.slug}`, t: `${x.card.t} cover letter`, d: x.card.d }] : [];
  });

  return (
    <GuidePage
      ld={ld}
      path={path}
      crumb={s.crumb}
      parent={PARENT}
      title={s.h1}
      muted={s.muted}
      lead={s.lead}
      updated={COVER_SITUATION_UPDATED}
      words={words}
      sections={sections}
      figures={figures}
      faqs={s.faqs}
      aside={{
        label: "Write it from your resume",
        title: "Your letter, drafted for you",
        sub: "LaunchCV writes a tailored cover letter from your resume and the job post. Edit it, then export with your resume.",
        cta: { cta: "cover_letter_feature", location: `cover_${s.slug}`, href: "/features/cover-letter", label: "See the cover letter generator" },
        card: { title: "Every situation", sub: "No experience, career change, internal, referral and more.", href: "/cover-letter-examples#situations", link: "All situations" },
      }}
      related={[...related, { href: "/cover-letter-template", t: "Cover letter template", d: "The four-paragraph structure, with a filled-in example." }]}
      finalCta={{
        title: "Letter ready? Check the resume it goes with.",
        sub: "The free ATS check flags missing keywords, columns, tables and contact details.",
        cta: "free_ats_check",
        location: `cover_${s.slug}_footer`,
        href: "/free-ats-check",
        label: "Check my resume — free",
      }}
    />
  );
}
