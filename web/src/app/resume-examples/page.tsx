import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { container, btnPrimary, labelCls } from "@/components/site/ui";
import { GroupFilter } from "@/components/site/library/group-filter";
import { LetterMini } from "@/components/site/library/letter-mini";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { ResumePreview } from "@/components/resume-preview";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl, WEBSITE_ID } from "@/lib/site";
import { RESUME_EXAMPLES, RESUME_GROUPS, getResumeExample, type ResumeExample } from "@/lib/resume-examples";
import type { ResumeContent } from "@/types/resume";
import { COVER_LETTER_EXAMPLES, getCoverLetterExample } from "@/lib/cover-letter-examples";
import { exampleToContent } from "@/lib/example-to-content";

export const metadata = buildMarketingMetadata({
  title: "Resume Examples by Job — With Keywords & Bullet Points",
  description:
    `Resume examples for ${RESUME_EXAMPLES.length} jobs — nurses, electricians, teachers, drivers, accountants and more — with bullet examples, keywords and ATS tips.`,
  pathname: "/resume-examples",
  image: DEFAULT_OG_IMAGE,
  keywords: ["resume examples", "resume samples", "resume examples by job", "ATS resume examples"],
});

const GROUPS = RESUME_GROUPS;
const ordered = GROUPS.flatMap((g) => RESUME_EXAMPLES.filter((e) => e.group === g));
const TILE = ["bg-[#e4dfff]", "bg-[#c9c0ff]", "bg-[#e4dfff]", "bg-[#dcd5ff]"];
const letterCount = COVER_LETTER_EXAMPLES.filter((c) => getResumeExample(c.slug)).length;
const sampleLetter = getCoverLetterExample("registered-nurse");
const sampleLetterAuthor = getResumeExample("registered-nurse");

const ld = {
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "@id": `${absoluteUrl("/resume-examples")}#webpage`,
  name: "Resume examples",
  url: absoluteUrl("/resume-examples"),
  isPartOf: { "@id": WEBSITE_ID },
  inLanguage: "en-US",
  hasPart: RESUME_EXAMPLES.map((e) => ({
    "@type": "Article",
    headline: `${e.role} resume example`,
    url: absoluteUrl(`/resume-examples/${e.slug}`),
  })),
};

/** Stage labels link to the role pages they name. */
function RoleTag({ slug, className }: { slug: string; className: string }) {
  const e = getResumeExample(slug);
  if (!e) return null;
  return (
    <Link
      href={`/resume-examples/${e.slug}`}
      className={`lc-float lc-btn-lift absolute z-10 inline-flex min-h-11 items-center whitespace-nowrap rounded-full bg-white px-4 text-[13px] font-bold text-[#121226] hover:bg-[#e4dfff] sm:text-[15px] ${className}`}
    >
      {e.role}
    </Link>
  );
}

/**
 * The card thumbnail shows only the top of the page, so render just that part:
 * the full resume ×88 roles made the HTML (and the client payload) several times larger.
 */
function thumbContent(e: ResumeExample): ResumeContent {
  const c = exampleToContent(e);
  return {
    ...c,
    experience: c.experience.slice(0, 2).map((x) => ({ ...x, bullets: x.bullets.slice(0, 3) })),
    education: [],
    certifications: [],
    achievements: [],
    skills: [],
  };
}

export default function ResumeExamplesPage() {
  const total = RESUME_EXAMPLES.length;
  const items = ordered.map((e, i) => ({
    key: e.slug,
    group: e.group,
    node: (
      <Link
        href={`/resume-examples/${e.slug}`}
        className="lc-card lc-rise group block w-full rounded-[20px] p-1.5 text-[#121226] sm:rounded-[26px] sm:p-2"
      >
        <div className={`relative h-[120px] overflow-hidden rounded-[15px] sm:h-[200px] sm:rounded-[20px] lg:h-[230px] ${TILE[i % TILE.length]}`}>
          <div aria-hidden="true" className="absolute left-1/2 top-3.5 w-[120px] -translate-x-1/2 shadow-[0_18px_36px_-18px_rgba(10,6,60,.45)] transition-transform duration-300 group-hover:-translate-y-1 sm:top-[26px] sm:w-[180px] lg:w-[210px]">
            <ResumePreview content={thumbContent(e)} template="classic" />
          </div>
          <span className="absolute left-2.5 top-2.5 hidden rounded-full bg-white px-2.5 py-[5px] text-[11px] font-bold text-[#4a4862] sm:inline-block">{e.group}</span>
        </div>
        <div className="px-2 pb-1.5 pt-2.5 sm:px-2.5 sm:pb-2 sm:pt-3.5">
          <p className="text-[15px] font-extrabold leading-[18px] tracking-[-0.01em] group-hover:text-[#5440e8] sm:text-[19px] sm:leading-6">
            {e.role}
            <span className="sr-only"> resume example</span>
          </p>
          <p className="mt-[3px] text-[11px] text-[#66647c] sm:text-[13px]">{e.level}</p>
          <p className="mt-3 hidden text-[14px] font-semibold text-[#5440e8] sm:block" aria-hidden="true">
            View example →
          </p>
        </div>
      </Link>
    ),
  }));

  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO — static HTML */}
      <section className={`${container} flex flex-col justify-between gap-4 pt-4 lg:flex-row lg:items-end lg:gap-12 lg:pt-10`}>
        <div className="max-w-[860px]">
          <p className={labelCls}>/ Resume examples</p>
          <h1 className="mt-3.5 text-[40px] font-extrabold leading-[1.05] tracking-[-0.045em] sm:mt-5 sm:text-[56px] lg:text-[64px] lg:leading-[66px]">
            Resume examples. <span className="text-[#7c7a94]">Written for the job, readable by the software.</span>
          </h1>
        </div>
        <p className="max-w-[380px] text-[16px] leading-[1.6] text-[#4a4862] sm:text-[17px] sm:leading-[27px] lg:mb-2">
          Each example comes with summary lines and bullet points you can adapt, the keywords recruiters search for in that
          role, and tips for getting through applicant tracking systems.
        </p>
      </section>

      {/* STAGE */}
      <section className={`${container} pt-6 lg:pt-11`}>
        <div className="relative h-[330px] overflow-hidden rounded-[28px] bg-[#111118] sm:h-[440px] lg:h-[500px] lg:rounded-[36px]">
          <p aria-hidden="true" className="lc-poster absolute inset-x-0 top-[18px] m-0 text-center text-[length:clamp(44px,14vw,56px)] leading-[56px] text-[#36335a] sm:top-6 sm:text-[96px] sm:leading-[96px] lg:top-[30px] lg:text-[150px] lg:leading-[140px]">
            {total} ROLES
          </p>
          <div aria-hidden="true" className="absolute bottom-[-150px] left-[16%] hidden h-[360px] w-[360px] rounded-full bg-[#5440e8] lg:block" />
          <div aria-hidden="true" className="absolute bottom-[-110px] left-1/2 h-[280px] w-[280px] -translate-x-1/2 rounded-full bg-[#c9c0ff] lg:bottom-[-170px] lg:h-[400px] lg:w-[400px]" />
          <div aria-hidden="true" className="absolute bottom-[-150px] right-[16%] hidden h-[360px] w-[360px] rounded-full bg-[#ff7a33] lg:block" />
          <Image
            src="/images/people/woman-hoodie.webp"
            alt="Young woman in a denim jacket and hoodie, smiling"
            width={856}
            height={1080}
            priority
            sizes="(min-width: 1024px) 309px, (min-width: 640px) 238px, 182px"
            className="absolute -left-2.5 bottom-0 h-[230px] w-auto max-w-none sm:left-[6%] sm:h-[300px] lg:left-[19%] lg:h-[390px]"
          />
          <Image
            src="/images/people/woman-red-top.webp"
            alt="Laughing woman in a red top"
            width={747}
            height={1080}
            priority
            sizes="(min-width: 1024px) 270px, (min-width: 640px) 208px, 159px"
            className="absolute -right-3.5 bottom-0 h-[230px] w-auto max-w-none sm:right-[6%] sm:h-[300px] lg:right-[19%] lg:h-[390px]"
          />
          <Image
            src="/images/people/nurse-arms-crossed.webp"
            alt="Smiling nurse in blue scrubs with a stethoscope, arms crossed"
            width={759}
            height={1080}
            priority
            sizes="(min-width: 1024px) 302px, (min-width: 640px) 239px, 183px"
            className="absolute bottom-0 left-1/2 h-[260px] w-auto max-w-none -translate-x-1/2 sm:h-[340px] lg:h-[430px]"
          />
          <RoleTag slug="ux-designer" className="left-[12%] top-[230px] hidden lg:inline-flex" />
          <RoleTag slug="registered-nurse" className="left-1/2 top-[84px] -translate-x-1/2 sm:top-[120px] lg:top-[168px]" />
          <RoleTag slug="marketing-manager" className="right-[11%] top-[230px] hidden lg:inline-flex" />
          <span aria-hidden="true" className="lc-poster absolute bottom-9 left-10 hidden -rotate-[5deg] rounded-full bg-[#ff7a33] px-[15px] py-[9px] text-[13px] text-[#111118] lg:block">
            + KEYWORDS + TIPS
          </span>
        </div>
      </section>

      {/* GRID */}
      <section className={`${container} pt-6 lg:pt-[72px]`}>
        <h2 className="sr-only">Resume examples by field</h2>
        <GroupFilter
          allLabel={`All ${total}`}
          groups={GROUPS.map((g) => ({ key: g, label: g, count: RESUME_EXAMPLES.filter((e) => e.group === g).length })).filter((g) => g.count > 0)}
          items={items}
          gridClassName="mt-3.5 grid grid-cols-2 gap-2 sm:gap-4 lg:mt-7 lg:grid-cols-4"
        />
        <p className="mt-3 text-[12px] text-[#66647c] sm:mt-5 sm:text-[13px]">Names, companies and numbers in the examples are illustrative.</p>
      </section>

      {/* COVER LETTERS + ATS CHECK */}
      <section className={`${container} grid gap-2.5 pt-12 lg:grid-cols-2 lg:gap-4 lg:pt-[100px]`}>
        <Link
          href="/cover-letter-examples"
          className="lc-reveal lc-rise group relative block overflow-hidden rounded-[26px] bg-[#c9c0ff] px-5 py-6 text-[#111118] sm:p-10 lg:h-[300px] lg:rounded-[36px]"
        >
          <p className={`${labelCls} !text-[#3a2bb8]`}>/ Cover letters</p>
          <p className="mt-2.5 max-w-[360px] text-[24px] font-extrabold leading-7 tracking-[-0.02em] sm:mt-4 sm:text-[34px] sm:leading-[38px] sm:tracking-[-0.03em]">
            {letterCount === total ? `Annotated cover letters for the same ${total} roles.` : `Annotated cover letters for ${letterCount} of these roles.`}
          </p>
          <p className="mt-3.5 text-[14px] font-bold sm:mt-[22px] sm:text-[15px]">
            <span className="lc-link">See cover letter examples</span> →
          </p>
          {sampleLetter && sampleLetterAuthor ? (
            <LetterMini
              letter={sampleLetter}
              name={sampleLetterAuthor.resume.name}
              paragraphs={1}
              className="absolute -bottom-10 -right-[30px] hidden h-[300px] w-[230px] -rotate-[8deg] p-5 text-[8px] leading-[13px] shadow-[0_24px_48px_-20px_rgba(36,24,120,.45)] transition-transform duration-300 group-hover:-rotate-[5deg] sm:block"
            />
          ) : null}
        </Link>
        <div className="lc-reveal relative overflow-hidden rounded-[26px] bg-[#111118] px-5 py-6 text-white sm:p-10 lg:h-[300px] lg:rounded-[36px]">
          <p className={`${labelCls} hidden !text-[#c9c0ff] sm:block`}>/ Your own resume</p>
          <h2 className="max-w-[470px] text-[24px] font-extrabold leading-7 tracking-[-0.02em] sm:mt-4 sm:text-[34px] sm:leading-[38px] sm:tracking-[-0.03em]">
            Already have a resume? See how the software reads it.
          </h2>
          <p className="mt-2 text-[15px] text-[#c9c7d8]">Free ATS check, no sign-up, about 10 seconds.</p>
          <CtaLink cta="free_ats_check" location="resume_examples_index" href="/free-ats-check" className={`${btnPrimary} mt-4 sm:mt-6`}>
            Check my resume — free
          </CtaLink>
        </div>
      </section>
    </SiteShell>
  );
}
