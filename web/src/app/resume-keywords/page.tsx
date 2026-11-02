import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { container, btnPrimary, btnWhite, labelCls, Breadcrumbs, SectionHead } from "@/components/site/ui";
import { FaqList } from "@/components/site/library/faq-list";
import { HonestRules } from "@/components/site/seo/honest-rules";
import { SeoCtaBand } from "@/components/site/seo/seo-cta-band";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { faqPageLd } from "@/lib/faq-ld";
import type { ResumeExample } from "@/lib/resume-examples";
import { KEYWORD_ROLES, KEYWORDS_UPDATED, keywordStats } from "@/lib/seo/resume-keywords";

const TOTAL_ROLES = KEYWORD_ROLES.length;
const TOTAL_KEYWORDS = KEYWORD_ROLES.reduce((n, e) => n + e.keywords.length, 0);

export const metadata = buildMarketingMetadata({
  title: "Resume Keywords by Job (2026): Skills & Tools Lists",
  description: `Resume keywords for ${TOTAL_ROLES} jobs, from software engineer to registered nurse, sorted into skills, tools and certifications, with tips on using them honestly.`,
  pathname: "/resume-keywords",
  image: DEFAULT_OG_IMAGE,
  keywords: ["resume keywords", "resume keywords by job", "ATS keywords", "skills for resume", "resume skills list"],
});

const GROUPS: ResumeExample["group"][] = ["Tech & product", "Business", "Creative", "People & service"];

const FAQS = [
  {
    q: "What are resume keywords?",
    a: "The skills, tools, certifications and job titles that recruiters search for and that job posts ask for. Applicant tracking systems store your resume as text, so recruiters can find you when your resume uses the same words as the job.",
  },
  {
    q: "Where do these keyword lists come from?",
    a: "Each list comes from the matching resume example on LaunchCV, written around what job posts for that role commonly ask for. Treat it as a starting point and always check the specific post you're applying to.",
  },
  {
    q: "Should I add every keyword on the list?",
    a: "No. Use the ones that are true for you and that the job post mentions. Every keyword on your resume is something an interviewer can ask about.",
  },
  {
    q: "How do I find the right keywords for one job?",
    a: "Read the post for skills, tools and qualifications it names more than once or lists as required. Use the post's exact wording for the ones you have, and show each in a bullet with a result.",
  },
];

const url = absoluteUrl("/resume-keywords");
const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${url}#webpage`,
      name: "Resume keywords by job",
      description: `Resume keywords for ${TOTAL_ROLES} jobs, sorted into skills, tools and certifications.`,
      url,
      dateModified: KEYWORDS_UPDATED,
      isPartOf: { "@id": WEBSITE_ID },
      publisher: orgRef,
      inLanguage: "en-US",
      hasPart: KEYWORD_ROLES.map((e) => ({
        "@type": "Article",
        headline: `${e.role} resume keywords`,
        url: absoluteUrl(`/resume-keywords/${e.slug}`),
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Resume keywords", item: url },
      ],
    },
    faqPageLd(FAQS),
  ],
};

function RoleCard({ e }: { e: ResumeExample }) {
  const { groups } = keywordStats(e);
  return (
    <Link href={`/resume-keywords/${e.slug}`} className="lc-card lc-rise group flex h-full flex-col rounded-[22px] p-1.5 text-[#121226] sm:rounded-[26px] sm:p-2">
      <div className="relative h-[110px] overflow-hidden rounded-[17px] bg-[#e4dfff] sm:h-[140px] sm:rounded-[20px]">
        <Image
          src={e.photo.src}
          alt=""
          fill
          sizes="(min-width: 1024px) 300px, (min-width: 640px) 45vw, 100vw"
          className="object-cover object-[center_30%] transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </div>
      <div className="flex flex-1 flex-col px-2.5 pb-2.5 pt-3 sm:px-3 sm:pb-3 sm:pt-4">
        <h4 className="text-[17px] font-extrabold leading-[22px] tracking-[-0.01em] group-hover:text-[#5440e8] sm:text-[19px] sm:leading-6">
          {e.role} <span className="sr-only">resume keywords</span>
        </h4>
        <p className="mt-1 text-[13px] text-[#66647c]">
          {e.keywords.length} keywords · {groups.length} types
        </p>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={`Top ${e.role} keywords`}>
          {e.keywords.slice(0, 4).map((k) => (
            <li key={k} className="rounded-full bg-[#f1eff8] px-2.5 py-[5px] text-[12px] font-semibold">
              {k}
            </li>
          ))}
        </ul>
      </div>
    </Link>
  );
}

export default function ResumeKeywordsIndexPage() {
  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO */}
      <section className={`${container} grid items-stretch gap-[22px] pt-4 lg:grid-cols-[1.1fr_0.9fr] lg:gap-6 lg:pt-8`}>
        <div className="flex flex-col justify-center lg:pr-6">
          <Breadcrumbs items={[{ href: "/", label: "Home" }, { label: "Resume keywords" }]} />
          <h1 className="mt-3.5 text-[36px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:mt-6 sm:text-[52px] sm:leading-[1.05] lg:text-[60px] lg:leading-[63px]">
            Resume keywords by job. <span className="text-[#7c7a94]">Sorted, and honest.</span>
          </h1>
          <p className="mt-4 text-[17px] leading-[1.6] text-[#4a4862] sm:mt-5 sm:text-[18px] sm:leading-7">
            {TOTAL_KEYWORDS} keywords across {TOTAL_ROLES} jobs, sorted into skills, tools and certifications, with examples of how to use each list in real
            bullets.
          </p>
          <div className="mt-[18px] flex flex-col gap-2.5 sm:mt-7 sm:flex-row">
            <a href="#roles" className={btnPrimary}>
              Find my job
            </a>
            <CtaLink cta="free_ats_check" location="resume_keywords_index" href="/free-ats-check" className={`${btnWhite} hidden sm:inline-flex`}>
              Check my resume — free
            </CtaLink>
          </div>
        </div>
        <div aria-hidden="true" className="relative hidden h-[420px] overflow-hidden rounded-[36px] bg-[#5440e8] sm:block lg:h-[480px]">
          <p aria-hidden="true" className="lc-poster absolute left-[30px] top-6 m-0 text-[88px] leading-[86px] text-[#6a58ee] lg:text-[100px] lg:leading-[96px]">
            KEY
            <br />
            WORDS
          </p>
          <ul className="absolute inset-x-8 bottom-9 flex flex-wrap gap-x-3 gap-y-4 lg:bottom-12">
            {["Python", "Patient assessment", "GAAP", "Lesson planning", "Salesforce", "User research", "PMP"].map((k, i) => (
              <li
                key={k}
                className={`lc-float rounded-full px-4 py-2.5 text-[15px] font-bold ${["bg-white text-[#121226]", "bg-[#111118] text-white", "bg-white text-[#121226]", "bg-[#ff7a33] text-[#111118]", "bg-[#c9c0ff] text-[#111118]"][i % 5]} ${i % 2 ? "rotate-1" : "-rotate-1"}`}
              >
                {k}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ROLES BY GROUP */}
      <section id="roles" className={`${container} scroll-mt-6 pt-16 lg:pt-[130px]`}>
        <SectionHead className="max-w-[980px]" label="By job" title={`${TOTAL_ROLES} keyword lists.`} muted="Pick your role." />
        <div className="mt-[18px] flex flex-col gap-9 lg:mt-10 lg:gap-12">
          {GROUPS.map((g) => {
            const roles = KEYWORD_ROLES.filter((e) => e.group === g);
            if (roles.length === 0) return null;
            return (
              <div key={g}>
                <h3 className="text-[13px] font-extrabold uppercase tracking-[0.08em] text-[#66647c]">{g}</h3>
                <ul className="mt-3 grid grid-cols-1 gap-2 min-[420px]:grid-cols-2 sm:gap-3 lg:grid-cols-4 lg:gap-4">
                  {roles.map((e) => (
                    <li key={e.slug}>
                      <RoleCard e={e} />
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </section>

      {/* HONEST USE */}
      <section className={`${container} pt-16 lg:pt-[130px]`}>
        <HonestRules
          title={
            <>
              Keywords get you found. <span className="!text-[#b3b0c8]">Proof gets you hired.</span>
            </>
          }
          lead="Applicant tracking systems store your resume as text that recruiters can search. Matching the job post's words helps them find you; the bullets around those words are what convince them."
        />
      </section>

      {/* FAQ */}
      <section id="faq" className={`${container} grid scroll-mt-6 items-start gap-[18px] pt-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:pt-[130px]`}>
        <div className="lc-reveal">
          <SectionHead label="Questions" title="Resume keywords," muted="answered." />
          <p className="mt-4 text-[15px] leading-6 text-[#4a4862] sm:mt-5 sm:text-[16px] sm:leading-[25px]">
            Applying through a specific system?{" "}
            <Link href="/ats" className="font-semibold text-[#5440e8] underline decoration-[#5440e8]/30 underline-offset-[3px] hover:decoration-[#5440e8]">
              See our ATS guides
            </Link>
          </p>
        </div>
        <FaqList faqs={FAQS} />
      </section>

      <section aria-label="More resources" className={`${container} pt-14 lg:pt-[110px]`}>
        <p className={labelCls}>
          <span aria-hidden="true">/ </span>Full examples
        </p>
        <p className="mt-3 max-w-[640px] text-[16px] leading-[25px] text-[#4a4862]">
          Every list comes with a complete sample resume and cover letter.{" "}
          <Link href="/resume-examples" className="font-semibold text-[#5440e8] underline decoration-[#5440e8]/30 underline-offset-[3px] hover:decoration-[#5440e8]">
            Browse resume examples
          </Link>{" "}
          or{" "}
          <Link href="/cover-letter-examples" className="font-semibold text-[#5440e8] underline decoration-[#5440e8]/30 underline-offset-[3px] hover:decoration-[#5440e8]">
            cover letter examples
          </Link>
          .
        </p>
      </section>

      <SeoCtaBand title="See which keywords your resume already has." sub="Free ATS check — no sign-up, about 10 seconds." location="resume_keywords_index_bottom" />
    </SiteShell>
  );
}
