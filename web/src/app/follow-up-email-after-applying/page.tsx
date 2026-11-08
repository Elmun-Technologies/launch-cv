import type { ReactNode } from "react";
import { GuidePage, guideLd, guideWordCount } from "@/components/site/seo/guide-page";
import { GuideTable } from "@/components/site/seo/guide-table";
import { LetterSheet, letterPlainText } from "@/components/site/seo/letter-sheet";
import { WordDownload } from "@/components/site/tools/word-download";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { SITE_AUTHOR } from "@/lib/author";
import {
  FOLLOWUP_DONTS,
  FOLLOWUP_DOS,
  FOLLOWUP_FAQS,
  FOLLOWUP_PUBLISHED,
  FOLLOWUP_QUICK,
  FOLLOWUP_READING,
  FOLLOWUP_SECTIONS,
  FOLLOWUP_TEMPLATES,
  FOLLOWUP_TIMING,
  FOLLOWUP_UPDATED,
} from "@/lib/seo/follow-up-email";

const PATH = "/follow-up-email-after-applying";
const CRUMB = "Follow-up email";
const TITLE = fitTitle("Follow-Up Email After Applying: 3 Free Templates (2026)", "Follow-Up Email Templates (2026)");
const HEADLINE = "Follow-up email after applying or interviewing: timing, etiquette, and 3 templates";
const DESCRIPTION =
  "Follow-up email templates for after you've applied or interviewed and heard nothing back: when to send one, etiquette, 3 copyable templates, and subject line tips.";

export const metadata = buildMarketingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  type: "article",
  article: { publishedTime: FOLLOWUP_PUBLISHED, modifiedTime: FOLLOWUP_UPDATED, authors: [SITE_AUTHOR.name], section: "Career" },
  keywords: [
    "follow up email after applying",
    "follow up email after job application",
    "follow up email after interview no response",
    "job application follow up email",
    "how to follow up on a job application",
    "checking in email after interview",
  ],
});

const RELATED: { href: string; t: string; d: string }[] = [
  { href: "/blog/thank-you-email-after-interview", t: "Thank-you email after an interview", d: "Send this within 24 hours — before you ever need to follow up." },
  { href: "/cover-letter/letter-of-interest", t: "Letter of interest", d: "For a company with no open role posted yet." },
  { href: "/resume-summary-examples", t: "Resume summary examples", d: "The same strongest-result pitch, for your resume." },
  { href: "/free-ats-check", t: "Free ATS check", d: "While you wait, make sure your resume reads cleanly." },
];

function DosDonts() {
  return (
    <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-3.5">
      <div className="rounded-[24px] bg-white p-5 sm:p-6">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#0b7a4f]">Do</p>
        <ul className="mt-3 space-y-2.5">
          {FOLLOWUP_DOS.map((d) => (
            <li key={d} className="flex gap-2.5 text-[14px] leading-[21px] text-[#24223a]">
              <span aria-hidden="true" className="mt-[3px] inline-flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-[#dcf5ea] text-[#0b7a4f]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </span>
              {d}
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-[24px] bg-white p-5 sm:p-6">
        <p className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#c2410c]">Don&apos;t</p>
        <ul className="mt-3 space-y-2.5">
          {FOLLOWUP_DONTS.map((d) => (
            <li key={d} className="flex gap-2.5 text-[14px] leading-[21px] text-[#24223a]">
              <span aria-hidden="true" className="mt-[3px] inline-flex h-[18px] w-[18px] flex-none items-center justify-center rounded-full bg-[#fde2d5] text-[#c2410c]">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18M6 6l12 12" />
                </svg>
              </span>
              {d}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default function FollowUpEmailPage() {
  const words = guideWordCount(FOLLOWUP_SECTIONS, FOLLOWUP_FAQS, [
    ...FOLLOWUP_QUICK,
    ...FOLLOWUP_DOS,
    ...FOLLOWUP_DONTS,
    ...FOLLOWUP_TIMING.flat(),
    ...FOLLOWUP_TEMPLATES.flatMap((t) => [t.note, ...t.letter.paragraphs]),
  ]);
  const ld = guideLd({
    path: PATH,
    headline: HEADLINE,
    description: DESCRIPTION,
    crumb: CRUMB,
    published: FOLLOWUP_PUBLISHED,
    updated: FOLLOWUP_UPDATED,
    words,
    section: "Career",
    faqs: FOLLOWUP_FAQS,
  });

  const figures: Record<string, ReactNode> = {
    timing: <GuideTable label="When to send a follow-up email" caption="When to send each follow-up email and what to keep in mind" columns={["Stage", "Wait", "Note"]} rows={FOLLOWUP_TIMING} />,
    etiquette: <DosDonts />,
  };
  FOLLOWUP_TEMPLATES.forEach((t) => {
    figures[t.id] = (
      <LetterSheet
        heading={t.title}
        headingId={`${t.id}-letter`}
        letter={t.letter}
        copyLabel="Copy text"
        placeholders
        numbered={false}
        actions={<WordDownload text={letterPlainText(t.letter)} filename={`follow-up-${t.id}`} srLabel={`Download ${t.title.toLowerCase()} as Word`} />}
        footnote="Replace every [bracketed] placeholder, and cut anything that doesn't apply."
      />
    );
  });

  return (
    <GuidePage
      ld={ld}
      path={PATH}
      crumb={CRUMB}
      title="Follow-up email after applying:"
      muted="timing, etiquette, and 3 templates."
      lead="Checking in after silence is normal, and doing it well can keep you on a recruiter's radar instead of their nerves. Here's when to send one, what to avoid, and three templates to copy."
      updated={FOLLOWUP_UPDATED}
      words={words}
      sections={FOLLOWUP_SECTIONS}
      figures={figures}
      keyFacts={{ afterSection: "when", title: "Quick rules", lead: "Patient, short, and once per stage.", facts: FOLLOWUP_QUICK }}
      faqs={FOLLOWUP_FAQS}
      aside={{
        label: "While you wait",
        title: "Keep applying in the meantime",
        sub: "A follow-up keeps the door open, but don't pause your search while you wait. Match your resume to the next job post in seconds.",
        cta: { cta: "job_match", location: "follow_up_email", href: "/features/jd-alignment", label: "Match my resume to a job" },
        card: { title: "Need a cover letter too?", sub: "Fill-in templates for every situation.", href: "/cover-letter-examples#situations", link: "Cover letter templates" },
      }}
      related={RELATED}
      reading={FOLLOWUP_READING}
      finalCta={{
        title: "While you wait, make sure your resume is ready.",
        sub: "The free ATS check flags missing keywords, columns, tables and contact details.",
        cta: "free_ats_check",
        location: "follow_up_email_footer",
        href: "/free-ats-check",
        label: "Check my resume — free",
      }}
    />
  );
}
