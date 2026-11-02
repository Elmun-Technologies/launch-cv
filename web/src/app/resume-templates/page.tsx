import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { container, btnPrimary, btnWhite, btnDark, labelCls, SectionHead } from "@/components/site/ui";
import { TemplateStage } from "@/components/site/library/template-stage";
import { FaqList } from "@/components/site/library/faq-list";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { ResumePreview } from "@/components/resume-preview";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl, WEBSITE_ID } from "@/lib/site";
import { getResumeExample } from "@/lib/resume-examples";
import { exampleToContent } from "@/lib/example-to-content";
import { TEMPLATE_SPECS, TEMPLATE_STYLES, type TemplateStyle } from "@/lib/resume-templates";
import { PUBLIC_PLANS } from "@/lib/monetization";
import type { ResumeContent } from "@/types/resume";

export const metadata = buildMarketingMetadata({
  title: "Free Resume Templates — ATS-Friendly, Download as PDF",
  description:
    "Four ATS-friendly resume templates: Classic, Modern, Minimal and Executive. Single column, standard headings. Download as PDF or Word, free.",
  pathname: "/resume-templates",
  image: DEFAULT_OG_IMAGE,
  keywords: ["resume templates", "free resume templates", "ATS resume template", "ATS friendly resume template", "simple resume template"],
});

const ABOUT: Record<TemplateStyle, { bestFor: string; note: string; stage: string; cta: string }> = {
  classic: {
    bestFor: "Any role, any industry",
    note: "Uppercase section headings with a solid rule. The safe default when you don't know who reads it first.",
    stage: "bg-[#e4dfff]",
    cta: btnDark,
  },
  modern: {
    bestFor: "Tech, product and marketing",
    note: "Blue section headings and a light rule. A touch of color that still prints well in black and white.",
    stage: "bg-[#5440e8]",
    cta: btnPrimary,
  },
  minimal: {
    bestFor: "Dense, experienced resumes",
    note: "No rules, more white space. Lets a long work history breathe on one or two pages.",
    stage: "bg-[#e4dfff]",
    cta: btnDark,
  },
  executive: {
    bestFor: "Senior, finance and legal roles",
    note: "Serif type with a centered header. Formal without decoration.",
    stage: "bg-[#111118]",
    cta: btnDark,
  },
};

const SAFE = [
  { t: "One column", d: "Parsers read left to right, top to bottom. Two-column layouts often get merged into one jumbled line." },
  { t: "Standard section names", d: "Experience, Education, Skills — the words applicant tracking systems look for to split your resume into fields." },
  { t: "Real text, not images", d: "Every word is selectable text in the PDF, so it can be searched and matched to the job post." },
  { t: "No tables or text boxes", d: "Contact details inside a table or header box are a common reason a parser misses your email or phone." },
  { t: "Common fonts", d: "Sans and serif faces that render the same on every computer, with support for accented and non-Latin names." },
];

const faqs = [
  {
    q: "Are these resume templates free?",
    a: "Yes. Create an account, build your resume in any of the four templates and download it as a PDF at no cost. AI help — rewriting bullets, matching your resume to a job post, cover letters — is on paid plans.",
  },
  {
    q: "Which template is best for ATS?",
    a: "All four are built the same way underneath: one column, standard headings and real text. Pick the one that suits your field; the content you put in it matters far more than the template.",
  },
  {
    q: "Can I switch templates later?",
    a: "Yes. Your content is stored separately from the layout, so you can switch between templates in the editor at any time and the preview updates instantly.",
  },
  {
    q: "Do the templates work for non-English names?",
    a: "Yes. The PDF embeds fonts that cover accented Latin, Cyrillic and other common characters, so names and places export correctly.",
  },
  {
    q: "Can I download in Word format?",
    a: "Yes. The editor downloads your resume as a PDF or as a Word (.docx) file. The Word file keeps a plain one-column layout with standard headings, so it's safe to upload when a posting asks for .docx; send the PDF otherwise.",
  },
];

/** A fuller page than the example alone, so each template shows how it handles every section. */
function withExtras(c: ResumeContent): ResumeContent {
  return {
    ...c,
    contact: { ...c.contact, phone: "(512) 555-0142" },
    experience: [
      ...c.experience,
      {
        id: "x-extra",
        company: "Lumen Logistics",
        role: "Product Intern",
        start: "May 2018",
        end: "Aug 2018",
        bullets: [
          { id: "xe1", text: "Mapped the order-to-invoice process for 4 warehouses and found the 3 main causes of billing errors", evidenceIds: [] },
          { id: "xe2", text: "Wrote requirements for a carrier portal pilot with 12 partners", evidenceIds: [] },
        ],
      },
    ],
    certifications: [{ id: "c1", name: "Certified Scrum Product Owner (CSPO)", issuer: "Scrum Alliance", date: "2021" }],
    achievements: [{ id: "a1", title: "Product of the Year finalist", description: "Self-scheduling launch, internal awards 2023" }],
  };
}

const sample = getResumeExample("product-manager");
const content = sample ? withExtras(exampleToContent(sample)) : null;

const inlineLink = "font-semibold text-[#5440e8] underline decoration-[#5440e8]/30 underline-offset-[3px] transition-colors hover:decoration-[#5440e8]";

const startHref = (t: TemplateStyle) => `/register?next=${encodeURIComponent(`/resume/new?template=${t}`)}`;
/** /resume/new offers both: import a PDF or Word file, or start blank or from an example. */
const BUILD_HREF = `/register?next=${encodeURIComponent("/resume/new")}`;

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": `${absoluteUrl("/resume-templates")}#webpage`,
      name: "Resume templates",
      url: absoluteUrl("/resume-templates"),
      isPartOf: { "@id": WEBSITE_ID },
      inLanguage: "en-US",
      hasPart: TEMPLATE_STYLES.map((t) => ({ "@type": "CreativeWork", name: `${TEMPLATE_SPECS[t].label} resume template` })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export default function ResumeTemplatesPage() {
  const stageItems = content
    ? TEMPLATE_STYLES.map((t) => ({ key: t, label: TEMPLATE_SPECS[t].label, node: <ResumePreview content={content} template={t} /> }))
    : [];

  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO — static HTML; the switcher only swaps the preview. */}
      <section className={`${container} grid items-stretch gap-6 pt-4 lg:grid-cols-[0.9fr_1.1fr] lg:pt-10`}>
        <div className="flex flex-col justify-center lg:pr-8">
          <p className={labelCls}>/ Resume templates</p>
          <h1 className="mt-3.5 text-[40px] font-extrabold leading-[1.05] tracking-[-0.045em] sm:mt-5 sm:text-[52px] lg:text-[58px] lg:leading-[60px]">
            Resume templates. <span className="text-[#7c7a94]">Four layouts, all readable by the software.</span>
          </h1>
          <p className="mt-4 text-[17px] leading-[1.6] text-[#4a4862] sm:mt-[22px] sm:text-[18px] sm:leading-7">
            One column, standard headings and real text, so applicant tracking systems can read it. Build yours with a live
            preview and download a PDF or Word file free — the preview is exactly what you get.
          </p>
          <div className="mt-5 flex flex-col gap-2.5 sm:mt-[30px] sm:flex-row">
            <CtaLink cta="build_resume" location="resume_templates_hero" href={BUILD_HREF} className={btnPrimary}>
              Build my resume — free
            </CtaLink>
            <CtaLink cta="import_resume" location="resume_templates_hero" href={BUILD_HREF} className={`${btnWhite} hidden sm:inline-flex`}>
              Import my resume
            </CtaLink>
          </div>
        </div>

        <div className="relative h-[440px] overflow-hidden rounded-[28px] bg-[#5440e8] sm:h-[600px] lg:h-[700px] lg:rounded-[36px]">
          <p aria-hidden="true" className="lc-poster absolute left-[18px] top-4 m-0 text-[44px] leading-[44px] text-[#6a58ee] sm:left-8 sm:top-[30px] sm:text-[72px] sm:leading-[72px] lg:text-[92px] lg:leading-[92px]">
            FREE PDF
          </p>
          {stageItems.length ? (
            <TemplateStage items={stageItems} initial="modern">
              <Image
                src="/images/people/woman-red-top.webp"
                alt="Laughing woman in a red top"
                width={747}
                height={1080}
                priority
                sizes="(min-width: 1024px) 277px, 173px"
                className="absolute -right-10 bottom-0 h-[250px] w-auto max-w-none sm:-right-5 sm:h-[360px] lg:h-[400px]"
              />
              <span className="lc-float absolute bottom-[22px] left-[22px] z-10 inline-flex items-center gap-2 rounded-full bg-[#111118] px-3.5 py-[9px] text-[13px] font-bold text-white sm:bottom-[120px] sm:left-[260px] sm:px-4 sm:py-2.5 sm:text-[14px] lg:left-[300px]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#c9c0ff" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M12 3v12" />
                  <path d="m7 10 5 5 5-5" />
                  <path d="M5 21h14" />
                </svg>
                Download PDF
              </span>
              <span aria-hidden="true" className="lc-poster absolute bottom-9 left-9 hidden -rotate-[5deg] rounded-full bg-[#ff7a33] px-[15px] py-[9px] text-[13px] text-[#111118] sm:block">
                ATS-READABLE
              </span>
            </TemplateStage>
          ) : null}
        </div>
      </section>

      {/* GRID */}
      <section className={`${container} pt-16 lg:pt-[130px]`}>
        <div className="lc-reveal flex flex-col justify-between gap-4 lg:flex-row lg:items-end lg:gap-12">
          <SectionHead label="Pick one" title="Same content, four looks." muted="Switch any time." className="max-w-[760px]" />
          <p className="max-w-[360px] text-[14px] leading-[22px] text-[#66647c] sm:text-[16px] sm:leading-[25px]">
            Sample content from our{" "}
            <Link href="/resume-examples/product-manager" className={inlineLink}>
              product manager resume example
            </Link>
            . Names and companies are illustrative.
          </p>
        </div>
        <ul className="mt-5 grid gap-3 lg:mt-12 lg:grid-cols-2 lg:gap-5">
          {TEMPLATE_STYLES.map((t) => (
            <li key={t} id={t} className="lc-card lc-rise flex scroll-mt-6 flex-col rounded-[26px] p-2 lg:rounded-[30px] lg:p-3">
              <div className={`relative h-[250px] overflow-hidden rounded-[20px] sm:h-[400px] lg:h-[470px] lg:rounded-[22px] ${ABOUT[t].stage}`}>
                <div className="absolute left-1/2 top-6 w-[270px] -translate-x-1/2 shadow-[0_24px_48px_-20px_rgba(10,6,60,.45)] sm:w-[340px] lg:top-10 lg:w-[420px]">
                  {content ? <ResumePreview content={content} template={t} /> : null}
                </div>
              </div>
              <div className="flex flex-1 flex-col px-2.5 pb-2 pt-3.5 lg:px-4 lg:pb-2.5 lg:pt-5">
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <h3 className="text-[20px] font-extrabold tracking-[-0.02em] lg:text-[26px]">{TEMPLATE_SPECS[t].label}</h3>
                  <p className="text-[13px] text-[#66647c] lg:text-[14px]">Best for: {ABOUT[t].bestFor}</p>
                </div>
                <p className="mt-1.5 flex-1 text-[14px] leading-[22px] text-[#4a4862] lg:mt-2 lg:text-[15px] lg:leading-6">{ABOUT[t].note}</p>
                <CtaLink
                  cta="use_template"
                  location={`resume_templates:${t}`}
                  href={startHref(t)}
                  className={`${ABOUT[t].cta} mt-4 self-start !px-[22px] !py-[13px] !text-[15px]`}
                >
                  Use {TEMPLATE_SPECS[t].label}
                </CtaLink>
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ATS-FRIENDLY (dark) */}
      <section className={`${container} pt-16 lg:pt-[130px]`}>
        <div className="lc-reveal rounded-[28px] bg-[#111118] px-5 pb-[18px] pt-[30px] text-white sm:px-10 sm:pb-10 sm:pt-12 lg:rounded-[36px] lg:p-16 lg:pt-[72px]">
          <div className="max-w-[1040px]">
            <p className={`${labelCls} !text-[#c9c0ff]`}>/ ATS-friendly</p>
            <h2 className="lc-h2 mt-5 text-white">
              What makes a template ATS-friendly. <span className="!text-[#9a97b3]">It&apos;s mostly what it leaves out.</span>
            </h2>
          </div>
          <ol className="mt-[18px] grid sm:mt-12 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5">
            {SAFE.map((x, i) => (
              <li key={x.t} className="border-t border-[#2f2d48] py-[13px] sm:rounded-[22px] sm:border sm:bg-[#1d1c2e] sm:p-[22px]">
                <p className="lc-mono hidden text-[12px] text-[#c9c0ff] sm:block">0{i + 1}</p>
                <p className="text-[16px] font-bold sm:mt-7 sm:text-[18px]">{x.t}</p>
                <p className="mt-0.5 text-[13px] leading-5 text-[#b3b0c8] sm:mt-2 sm:text-[14px] sm:leading-[21px]">{x.d}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* IMPORT BAND */}
      <section className={`${container} pt-3 lg:pt-6`}>
        <div className="lc-reveal flex flex-col items-start justify-between gap-4 rounded-[28px] bg-[#c9c0ff] px-5 py-6 sm:flex-row sm:items-center sm:gap-10 sm:px-10 sm:py-10 lg:rounded-[36px] lg:px-14 lg:py-11">
          <div className="max-w-[640px]">
            <h2 className="text-[22px] font-extrabold tracking-[-0.02em] sm:text-[30px] sm:leading-9 sm:tracking-[-0.03em]">Already have a resume?</h2>
            <p className="mt-1.5 text-[15px] leading-[23px] text-[#2b2752] sm:mt-2 sm:text-[17px] sm:leading-[26px]">
              Check how an ATS reads it first — it&apos;s free and takes about 10 seconds. Then import it into any template and
              keep editing.
            </p>
          </div>
          <CtaLink cta="free_ats_check" location="resume_templates" href="/free-ats-check" className={`${btnDark} flex-none`}>
            Check my resume — free
          </CtaLink>
        </div>
      </section>

      {/* FAQ */}
      <section className={`${container} grid items-start gap-5 pt-16 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:pt-[130px]`}>
        <div className="lc-reveal">
          <SectionHead label="Questions" title="Templates," muted="answered." />
          <p className="mt-4 text-[15px] leading-6 text-[#4a4862] sm:mt-5 sm:text-[16px] sm:leading-[25px]">
            Plans with AI help start at {PUBLIC_PLANS.starter.priceDisplay}/month.{" "}
            <Link href="/pricing" className={inlineLink}>
              See pricing
            </Link>
          </p>
        </div>
        <FaqList faqs={faqs} />
      </section>
    </SiteShell>
  );
}
