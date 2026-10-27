import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { ResumePreview } from "@/components/resume-preview";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { getResumeExample } from "@/lib/resume-examples";
import { exampleToContent } from "@/lib/example-to-content";
import { TEMPLATE_SPECS, TEMPLATE_STYLES, type TemplateStyle } from "@/lib/resume-templates";
import { PUBLIC_PLANS } from "@/lib/monetization";
import type { ResumeContent } from "@/types/resume";

export const metadata = buildMarketingMetadata({
  title: "Free Resume Templates — ATS-Friendly, Download as PDF",
  description:
    "Four ATS-friendly resume templates: Classic, Modern, Minimal and Executive. Single column, real text, standard headings. Build yours and download a PDF free.",
  pathname: "/resume-templates",
  image: DEFAULT_OG_IMAGE,
  keywords: ["resume templates", "free resume templates", "ATS resume template", "ATS friendly resume template", "simple resume template"],
});

const ABOUT: Record<TemplateStyle, { bestFor: string; note: string }> = {
  classic: {
    bestFor: "Any role, any industry",
    note: "Uppercase section headings with a solid rule. The safe default when you don't know who reads it first.",
  },
  modern: {
    bestFor: "Tech, product and marketing",
    note: "Blue section headings and a light rule. A touch of color that still prints well in black and white.",
  },
  minimal: {
    bestFor: "Dense, experienced resumes",
    note: "No rules, more white space. Lets a long work history breathe on one or two pages.",
  },
  executive: {
    bestFor: "Senior, finance and legal roles",
    note: "Serif type with a centered header. Formal without decoration.",
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
    a: "Not at the moment — export is PDF only. PDF is what most employers and applicant tracking systems ask for.",
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

const startHref = (t: TemplateStyle) => `/register?next=${encodeURIComponent(`/resume/new?template=${t}`)}`;

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "Resume templates",
      url: absoluteUrl("/resume-templates"),
      hasPart: TEMPLATE_STYLES.map((t) => ({ "@type": "CreativeWork", name: `${TEMPLATE_SPECS[t].label} resume template` })),
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
};

export default function ResumeTemplatesPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={ld} />
      <LandingNav />

      <main className="flex-1">
        <section className="mx-auto max-w-[1200px] px-5 pt-[120px] sm:px-8">
          <h1 className="max-w-[860px] text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[56px]">
            Resume templates. <span className="text-[#8A8A86]">Four layouts, all readable by the software.</span>
          </h1>
          <p className="mt-5 max-w-[620px] text-[17px] leading-[1.6] text-[#3F3F3F]">
            Each one is a single column with standard headings and real text, so applicant tracking systems can read
            it. Build yours and download a PDF free — the preview is exactly what you get.
          </p>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pt-14 sm:px-8">
          <ul className="grid gap-x-8 gap-y-14 md:grid-cols-2">
            {TEMPLATE_STYLES.map((t) => (
              <li key={t} className="flex flex-col">
                <div className="relative h-[420px] overflow-hidden rounded-2xl bg-[#F5F5F3] px-6 pt-6 sm:h-[560px] sm:px-10 sm:pt-10">
                  {content ? <ResumePreview content={content} template={t} /> : null}
                  <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#F5F5F3] to-transparent" />
                </div>
                <div className="mt-5 flex items-baseline justify-between gap-3">
                  <h2 className="text-[21px] font-semibold">{TEMPLATE_SPECS[t].label}</h2>
                  <p className="text-[14px] text-[#6B6B6B]">Best for: {ABOUT[t].bestFor}</p>
                </div>
                <p className="mt-2 flex-1 text-[15px] leading-[1.55] text-[#3F3F3F]">{ABOUT[t].note}</p>
                <CtaLink
                  cta="use_template"
                  location={`resume_templates:${t}`}
                  href={startHref(t)}
                  className="mt-4 inline-flex h-11 items-center justify-center self-start rounded-full border border-[#D9D9D5] px-5 text-[14px] font-medium hover:border-[#111111]"
                >
                  Use {TEMPLATE_SPECS[t].label}
                </CtaLink>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[13px] text-[#6E6E6A]">
            Sample content from our{" "}
            <Link href="/resume-examples/product-manager" className="underline underline-offset-2 hover:text-[#111111]">
              product manager resume example
            </Link>
            . Names and companies are illustrative.
          </p>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8">
          <h2 className="max-w-[760px] text-[30px] font-semibold leading-[1.1] tracking-[-0.03em] sm:text-[40px]">
            What makes a template ATS-friendly. <span className="text-[#8A8A86]">It&apos;s mostly what it leaves out.</span>
          </h2>
          <ul className="mt-10 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
            {SAFE.map((x) => (
              <li key={x.t} className="border-t border-[#E5E5E2] pt-5">
                <p className="text-[17px] font-semibold">{x.t}</p>
                <p className="mt-1.5 text-[15px] leading-[1.6] text-[#3F3F3F]">{x.d}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8">
          <div className="flex flex-col gap-6 rounded-[20px] bg-[#F5F5F3] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-10">
            <div className="max-w-[620px]">
              <p className="text-[24px] font-semibold leading-tight tracking-[-0.02em]">Already have a resume?</p>
              <p className="mt-2 text-[16px] leading-[1.6] text-[#3F3F3F]">
                Check how an ATS reads it first — it&apos;s free and takes about 10 seconds. Then import it into any
                template and keep editing.
              </p>
            </div>
            <CtaLink cta="free_ats_check" location="resume_templates" href="/free-ats-check" className="soha-btn-primary shrink-0">
              Check my resume — free
            </CtaLink>
          </div>
        </section>

        <section className="mx-auto max-w-[860px] px-5 pb-24 pt-24 sm:px-8">
          <h2 className="text-[30px] font-semibold tracking-[-0.03em]">Questions</h2>
          <dl className="mt-6 divide-y divide-[#E5E5E2] border-y border-[#E5E5E2]">
            {faqs.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="text-[17px] font-semibold">{f.q}</dt>
                <dd className="mt-2 text-[15px] leading-[1.65] text-[#3F3F3F]">{f.a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-[15px] text-[#3F3F3F]">
            Plans with AI help start at {PUBLIC_PLANS.starter.priceDisplay}/month.{" "}
            <Link href="/pricing" className="font-medium text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
              See pricing
            </Link>
          </p>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
