import Link from "next/link";
import { GuidePage, guideLd, guideWordCount } from "@/components/site/seo/guide-page";
import { GuideTable } from "@/components/site/seo/guide-table";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE, fitTitle } from "@/lib/build-metadata";
import { SITE_AUTHOR } from "@/lib/author";
import { RESUME_EXAMPLES } from "@/lib/resume-examples";
import {
  RESUME_SKILLS_FAQS,
  RESUME_SKILLS_PUBLISHED,
  RESUME_SKILLS_READING,
  RESUME_SKILLS_SECTIONS,
  RESUME_SKILLS_UPDATED,
  SKILL_TYPES,
  SKILLS_QUICK,
  SKILLS_SECTION_EXAMPLE,
  SOFT_SKILL_PROOF,
  TRANSFERABLE_SKILLS,
  skillsByField,
} from "@/lib/seo/resume-skills";

const PATH = "/skills-for-resume";
const CRUMB = "Skills for resume";
const TITLE = fitTitle("Skills to Put on a Resume: Lists by Field + Examples (2026)", "Skills to Put on a Resume (2026)");
const HEADLINE = "Skills to put on a resume: how to choose, where to list them, and examples by field";
const DESCRIPTION =
  "What skills to put on a resume in 2026: hard vs. soft skills, how to pick them from the job post, where to list them, soft skills shown in bullets, and skill lists by field.";

export const metadata = buildMarketingMetadata({
  title: TITLE,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  type: "article",
  article: { publishedTime: RESUME_SKILLS_PUBLISHED, modifiedTime: RESUME_SKILLS_UPDATED, authors: [SITE_AUTHOR.name], section: "Resume Tips" },
  keywords: [
    "skills to put on a resume",
    "skills for resume",
    "resume skills",
    "hard skills vs soft skills",
    "soft skills for resume",
    "transferable skills",
    "resume skills section",
  ],
});

const RELATED: { href: string; t: string; d: string }[] = [
  { href: "/resume-keywords", t: "Resume keywords by job", d: `Skills, tools and certifications for ${RESUME_EXAMPLES.length} jobs.` },
  { href: "/tools/job-description-keyword-scanner", t: "Job description keyword scanner", d: "See which skills a posting wants and which you already have." },
  { href: "/resume-summary-examples", t: "Resume summary examples", d: "Summaries for every job and situation." },
  { href: "/resume-action-verbs", t: "Resume action verbs", d: "Strong verbs to start the bullets that prove your skills." },
];

function TypeCards() {
  return (
    <ul className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-3.5">
      {SKILL_TYPES.map((t) => (
        <li key={t.name} className={`rounded-[24px] p-5 sm:p-6 ${t.featured ? "bg-[#5440e8] text-white" : "bg-white"}`}>
          <p className="text-[20px] font-extrabold">{t.name}</p>
          <p className={`mt-1.5 text-[15px] leading-[23px] ${t.featured ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>{t.what}</p>
          <p className={`mt-2 text-[13px] font-bold ${t.featured ? "text-white" : "text-[#3a2bb8]"}`}>e.g. {t.examples}</p>
        </li>
      ))}
    </ul>
  );
}

function SectionExample() {
  return (
    <figure className="mt-6 rounded-[24px] bg-[#e9e5ff] p-3 sm:p-5">
      <div className="rounded-[14px] bg-white px-5 py-5 font-[family-name:var(--font-body)] shadow-[0_18px_36px_-24px_rgba(10,6,60,.4)] sm:px-7">
        <p className="border-b border-[#121226] pb-1 text-[12px] font-extrabold uppercase tracking-[0.12em] text-[#121226]">Skills</p>
        <dl className="mt-3 space-y-1.5 text-[14px] leading-[21px] text-[#24223a]">
          {SKILLS_SECTION_EXAMPLE.map((r) => (
            <div key={r.label} className="flex flex-col sm:flex-row sm:gap-2">
              <dt className="shrink-0 font-bold sm:w-[118px]">{r.label}:</dt>
              <dd>{r.items}</dd>
            </div>
          ))}
        </dl>
      </div>
      <figcaption className="mt-3 px-1 text-[13px] text-[#4a4862]">A skills section for a data analyst: grouped, plain text, no ratings.</figcaption>
    </figure>
  );
}

function TransferableList() {
  return (
    <ul className="mt-6 grid gap-2.5 sm:grid-cols-2">
      {TRANSFERABLE_SKILLS.map((t) => (
        <li key={t.skill} className="rounded-[20px] bg-white p-4 sm:p-5">
          <p className="text-[16px] font-extrabold text-[#121226]">{t.skill}</p>
          <p className="mt-1 text-[14px] leading-[21px] text-[#4a4862]">
            <b className="text-[#121226]">From:</b> {t.from}
          </p>
          <p className="text-[14px] leading-[21px] text-[#4a4862]">
            <b className="text-[#121226]">Into:</b> {t.to}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Chips({ items, tone }: { items: string[]; tone: "violet" | "plain" }) {
  return (
    <ul className="mt-2 flex flex-wrap gap-1.5">
      {items.map((s) => (
        <li key={s} className={`rounded-full px-2.5 py-1 text-[13px] font-semibold ${tone === "violet" ? "bg-[#eeebff] text-[#3a2bb8]" : "border border-[#e2e0ea] text-[#24223a]"}`}>
          {s}
        </li>
      ))}
    </ul>
  );
}

function FieldCards() {
  return (
    <div className="mt-6 space-y-3">
      {skillsByField().map((f) => (
        <section key={f.group} aria-labelledby={`field-${f.group}`} className="rounded-[24px] bg-white p-5 sm:p-6">
          <h3 id={`field-${f.group}`} className="text-[19px] font-extrabold text-[#121226]">
            {f.group} skills
          </h3>
          {f.hard.length ? (
            <>
              <p className="mt-3 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#66647c]">Hard skills</p>
              <Chips items={f.hard} tone="violet" />
            </>
          ) : null}
          {f.tools.length ? (
            <>
              <p className="mt-3 text-[12px] font-extrabold uppercase tracking-[0.08em] text-[#66647c]">Tools & software</p>
              <Chips items={f.tools} tone="plain" />
            </>
          ) : null}
          <p className="mt-4 text-[14px] leading-[22px] text-[#4a4862]">
            <b className="text-[#121226]">By role:</b>{" "}
            {f.roles.map((e, i) => (
              <span key={e.slug}>
                {i > 0 ? " · " : null}
                <Link href={`/resume-keywords/${e.slug}`} className="font-semibold text-[#5440e8] underline decoration-[#5440e8]/30 underline-offset-[3px] hover:decoration-[#5440e8]">
                  {e.role}
                </Link>
              </span>
            ))}
          </p>
        </section>
      ))}
    </div>
  );
}

export default function SkillsForResumePage() {
  const fields = skillsByField();
  const words = guideWordCount(RESUME_SKILLS_SECTIONS, RESUME_SKILLS_FAQS, [
    ...SKILLS_QUICK,
    ...SKILL_TYPES.flatMap((t) => [t.name, t.what, t.examples]),
    ...SOFT_SKILL_PROOF.flat(),
    ...TRANSFERABLE_SKILLS.flatMap((t) => [t.skill, t.from, t.to]),
    ...fields.flatMap((f) => [...f.hard, ...f.tools]),
  ]);
  const ld = guideLd({
    path: PATH,
    headline: HEADLINE,
    description: DESCRIPTION,
    crumb: CRUMB,
    published: RESUME_SKILLS_PUBLISHED,
    updated: RESUME_SKILLS_UPDATED,
    words,
    section: "Resume Tips",
    faqs: RESUME_SKILLS_FAQS,
  });

  return (
    <GuidePage
      ld={ld}
      path={PATH}
      crumb={CRUMB}
      title="Skills to put on a resume:"
      muted="what to pick, where to list them, examples by field."
      lead="Start from the job post, lead with hard skills and tools, and prove soft skills in your bullets. Here's how, with skill lists for every field."
      updated={RESUME_SKILLS_UPDATED}
      words={words}
      sections={RESUME_SKILLS_SECTIONS}
      figures={{
        types: <TypeCards />,
        "section-example": <SectionExample />,
        soft: (
          <GuideTable label="Soft skills shown in bullets" caption="Common soft skills, with a weak and a strong way to show each on a resume" columns={["Soft skill", "Weak", "Strong"]} rows={SOFT_SKILL_PROOF} />
        ),
        transferable: <TransferableList />,
        fields: <FieldCards />,
      }}
      keyFacts={{ afterSection: "what-skills", title: "Quick rules", lead: "Specific, honest and matched to the job post.", facts: SKILLS_QUICK }}
      faqs={RESUME_SKILLS_FAQS}
      aside={{
        label: "Find the right skills",
        title: "Which skills does the job want?",
        sub: "Paste a job post to rank its skills and see which ones your resume already has. Free, runs in your browser.",
        cta: { cta: "keyword_scanner", location: "skills_for_resume", href: "/tools/job-description-keyword-scanner", label: "Open the keyword scanner" },
        card: { title: "Then check the whole resume", sub: "See what an applicant tracking system reads, free.", href: "/free-ats-check", link: "Free ATS check" },
      }}
      related={RELATED}
      reading={RESUME_SKILLS_READING}
      finalCta={{
        title: "Skills in place? See what the software reads.",
        sub: "The free ATS check flags missing keywords, columns, tables and contact details.",
        cta: "free_ats_check",
        location: "skills_for_resume_footer",
        href: "/free-ats-check",
        label: "Check my resume — free",
      }}
    />
  );
}
