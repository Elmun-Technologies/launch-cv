import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { FreeAtsClient } from "@/components/free-ats-client";
import { buildMarketingMetadata, FREE_ATS_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "Free ATS Resume Checker — Score in 10 Seconds",
  description:
    "Check your resume against applicant tracking systems for free. Get a 0–100 ATS score, see what the parser can't read and get a fix for every issue. No sign-up.",
  pathname: "/free-ats-check",
  image: FREE_ATS_OG_IMAGE,
  keywords: [
    "ATS resume checker",
    "ATS score checker",
    "free ATS score checker",
    "ATS resume test free",
    "check ATS score",
    "resume scanner free",
    "ATS checker no sign up",
  ],
});

const faqs = [
  {
    q: "Is this ATS checker really free?",
    a: "Yes. You get your score, the four category scores and your top fixes without an account. Create a free account to save the report and see every fix. The free check runs once a month per network.",
  },
  {
    q: "What is an ATS score?",
    a: "It's a 0–100 estimate of how well applicant tracking software can read your resume and match it to jobs like yours. It combines four checks: formatting, keywords, structure and readability.",
  },
  {
    q: "What's a good ATS score?",
    a: "Aim for 80 or higher. Between 65 and 80 your resume is readable but loses ground on keywords or structure. Below 65 there is a real risk that parts of it are dropped or misread.",
  },
  {
    q: "Which applicant tracking systems does it model?",
    a: "The check follows the parsing rules that widely used systems such as Workday, Greenhouse, Lever and iCIMS have in common. It can't reproduce each employer's private settings, so treat the score as a guide, not a guarantee.",
  },
  {
    q: "Why is my resume failing ATS?",
    a: "The usual causes are two-column layouts, text inside tables or text boxes, contact details in the page header, icons instead of words, and mixed date formats. Your report names the ones it finds in your resume.",
  },
  {
    q: "Is my resume stored?",
    a: "Your file isn't kept. We read the text, score it and store only the report — score and fixes — so you can open it again after you sign up.",
  },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Free ATS Resume Checker",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      url: absoluteUrl("/free-ats-check"),
      description: "Get a free ATS score and a prioritized list of fixes for your resume — no sign-up.",
    },
    {
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

const checks = [
  { t: "Tables, columns, text boxes", d: "Layouts that scramble or drop content when parsed." },
  { t: "Contact details", d: "Name, email and phone readable as plain text." },
  { t: "Section headings", d: "Standard names the software expects, like Experience." },
  { t: "Dates", d: "One consistent format for every job." },
  { t: "Keywords for your role", d: "Skills and titles that job posts for your role mention." },
  { t: "Measurable results", d: "Bullets that show outcomes, not just duties." },
  { t: "Length", d: "One page for most roles, two for senior ones." },
  { t: "File type", d: "A text-based PDF or DOCX that every system accepts." },
  { t: "Images and icons", d: "Graphics the parser can't read as text." },
];

const steps = [
  { t: "Upload your resume", d: "as a PDF or Word file, or paste the text." },
  { t: "Read your report", d: "— your score, the issues behind it and a plain-English fix for each one." },
  { t: "Fix the high-priority issues first", d: "— they cost you the most points." },
  { t: "Tailor it to each job", d: "so the keywords match the posting you're applying to." },
];

const related = [
  { kind: "Guide", t: "What is an ATS score, and how is it calculated?", href: "/blog/what-is-an-ats-score" },
  { kind: "Guide", t: "How to write an ATS-friendly resume", href: "/blog/how-to-write-an-ats-friendly-resume" },
  { kind: "Guide", t: "How to tailor your resume for every job", href: "/blog/how-to-tailor-your-resume-for-every-job" },
];

const h2 = "text-[32px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[40px]";

export default function FreeAtsCheckPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={ld} />
      <LandingNav />

      <main className="flex-1">
        <section className="mx-auto w-full max-w-[1200px] px-5 pt-[112px] text-center sm:px-8 sm:pt-[136px]">
          <h1 className="mx-auto max-w-[820px] text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[56px]">
            Free ATS resume checker. <span className="text-[#6E6E6A]">Your score in about 10 seconds.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.6] text-[#3F3F3F]">
            See how applicant tracking software reads your resume — what it can&apos;t parse, which keywords are
            missing and what to fix first.
          </p>
          <p className="mt-4 flex justify-center gap-x-5 text-[14px] text-[#6B6B6B]">
            <span>No sign-up</span>
            <span>File not stored</span>
            <span>Fixes, not just a score</span>
          </p>
        </section>

        <section id="ats-check" className="mx-auto w-full max-w-[1200px] scroll-mt-24 px-5 pt-10 sm:px-8">
          <FreeAtsClient />
        </section>

        {/* WHAT THE SOFTWARE SEES */}
        <section className="mx-auto w-full max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-28">
          <h2 className={`${h2} max-w-[760px]`}>
            What you see vs. <span className="text-[#6E6E6A]">what the software sees.</span>
          </h2>
          <p className="mt-3.5 max-w-[640px] text-[17px] leading-[1.6] text-[#3F3F3F]">
            A two-column template looks tidy to you. Many parsers read it line by line, left to right — and mix your
            jobs, dates and skills together.
          </p>
          <div className="mt-9 grid gap-5 md:grid-cols-2">
            <figure className="rounded-2xl bg-[#F5F5F3] p-6 sm:p-7">
              <figcaption className="mb-3.5 text-[14px] text-[#6B6B6B]">Your resume</figcaption>
              <div className="flex gap-4 rounded bg-white p-5 text-[11.5px] leading-[1.6] shadow-[0_10px_30px_-16px_rgba(0,0,0,0.3)]">
                <div className="w-[34%] border-r border-[#EEEEEB] pr-3">
                  <p className="text-[15px] font-bold">Maria Lopez</p>
                  <p className="text-[#6B6B6B]">Product Manager</p>
                  <p className="mt-3 font-bold">SKILLS</p>
                  <p>
                    SQL
                    <br />
                    Amplitude
                    <br />
                    A/B testing
                    <br />
                    Roadmapping
                  </p>
                  <p className="mt-3 font-bold">CONTACT</p>
                  <p className="break-all">
                    Austin, TX
                    <br />
                    maria.lopez@email.com
                  </p>
                </div>
                <div className="flex-1">
                  <p className="font-bold">EXPERIENCE</p>
                  <p className="mt-1 font-semibold">Product Manager, Brightpath · 2022–Now</p>
                  <p>• Launched self-scheduling, −23% no-shows</p>
                  <p>• Led 9 engineers and 2 designers</p>
                  <p className="mt-2 font-semibold">Associate PM, Fieldnote · 2019–2022</p>
                  <p>• Activation 38% → 57%</p>
                </div>
              </div>
            </figure>
            <figure className="rounded-2xl bg-[#111111] p-6 text-[#E5E5E2] sm:p-7">
              <figcaption className="mb-3.5 text-[14px] text-[#A3A3A0]">What a parser can extract</figcaption>
              <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[13px] leading-[1.75]">
                {"name:       Maria Lopez Product Manager EXPERIENCE\ntitle:      "}
                <span className="text-[#FF8A73]">— not found —</span>
                {"\nemail:      "}
                <span className="text-[#FF8A73]">— not found —</span>
                {"\nexperience:\n  - SKILLS SQL Product Manager, Brightpath · 2022\n    Amplitude Launched self-scheduling A/B testing\n  - "}
                <span className="text-[#FF8A73]">dates unreadable</span>
                {"\nskills:     "}
                <span className="text-[#FF8A73]">— empty —</span>
              </pre>
              <p className="mt-5 border-t border-[#2A2A2A] pt-4 text-[14px] text-[#B5B5B0]">
                The checker flags this as <span className="text-white">High priority: two-column layout</span> and
                tells you how to fix it.
              </p>
            </figure>
          </div>
        </section>

        {/* RECRUITER */}
        <section className="mx-auto w-full max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-28">
          <div className="flex flex-col overflow-hidden rounded-[20px] bg-[#F5F5F3] lg:flex-row lg:items-center">
            <Image
              src="/images/photos/recruiter-desk.webp"
              alt="Recruiter reviewing applications at a desk"
              width={1200}
              height={900}
              sizes="(min-width: 1024px) 540px, 100vw"
              className="h-[260px] w-full object-cover lg:h-[380px] lg:w-[46%]"
            />
            <div className="flex flex-col gap-3.5 p-8 lg:p-12">
              <h2 className="text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[36px]">
                A recruiter will spend seconds on your resume.{" "}
                <span className="text-[#6E6E6A]">If the software lets it through.</span>
              </h2>
              <p className="text-[16px] leading-[1.6] text-[#3F3F3F]">
                Most applications are parsed and ranked before a person opens them. This check shows you what that
                first pass sees, so the human pass actually happens.
              </p>
            </div>
          </div>
        </section>

        {/* CHECKS */}
        <section className="mx-auto w-full max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-28">
          <h2 className={h2}>What the checker looks at</h2>
          <div className="mt-7 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {checks.map((c) => (
              <div key={c.t} className="border-t border-[#EEEEEB] py-5">
                <p className="text-[17px] font-semibold">{c.t}</p>
                <p className="mt-1 text-[15px] leading-[1.55] text-[#3F3F3F]">{c.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* PHOTO BANNER */}
        <section className="mx-auto w-full max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-28">
          <div className="relative h-[380px] overflow-hidden rounded-[20px] sm:h-[420px]">
            <Image
              src="/images/photos/resume-review-desk.webp"
              alt="Hands reviewing a printed resume next to a laptop"
              fill
              sizes="(min-width: 1200px) 1136px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/85 via-[#111111]/55 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-[560px] flex-col justify-center gap-3.5 p-8 text-white sm:p-14">
              <h2 className="text-[32px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[40px]">
                Fix it before you hit Apply.
              </h2>
              <p className="text-[17px] leading-[1.6] text-[#E5E5E2]">
                Every issue in your report comes with a plain-English fix. Most take a minute.
              </p>
              <a
                href="#ats-check"
                className="mt-2 inline-flex h-12 w-fit items-center rounded-full bg-white px-6 text-[15px] font-medium text-[#111111] hover:bg-[#F5F5F3]"
              >
                Check my resume
              </a>
            </div>
          </div>
        </section>

        {/* HOW TO */}
        <section className="mx-auto w-full max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-28">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            <h2 className={`${h2} lg:w-[40%]`}>How to check your resume&apos;s ATS score</h2>
            <ol className="flex flex-1 list-decimal flex-col gap-4 pl-6 text-[17px] leading-[1.65] text-[#3F3F3F] marker:text-[#6E6E6A]">
              {steps.map((s) => (
                <li key={s.t}>
                  <strong className="font-semibold text-[#111111]">{s.t}</strong> {s.d}
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto w-full max-w-[860px] px-5 pt-24 sm:px-8 sm:pt-28">
          <h2 className={`${h2} text-center`}>ATS checker FAQ</h2>
          <div className="mt-6 border-b border-[#E5E5E2]">
            {faqs.map((f, i) => (
              <details key={f.q} open={i === 0} className="group border-t border-[#E5E5E2] py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <ChevronDown
                    className="h-4 w-4 shrink-0 text-[#6E6E6A] transition-transform group-open:rotate-180"
                    aria-hidden
                  />
                </summary>
                <p className="mt-2.5 text-[16px] leading-[1.65] text-[#3F3F3F]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* RELATED */}
        <section className="mx-auto w-full max-w-[1200px] px-5 py-24 sm:px-8 sm:py-[104px]">
          <div className="grid gap-5 md:grid-cols-3">
            {related.map((r) => (
              <Link key={r.href} href={r.href} className="group border-t border-[#E5E5E2] pt-4">
                <span className="text-[13px] text-[#6B6B6B]">{r.kind}</span>
                <span className="mt-1.5 block text-[17px] font-semibold group-hover:text-[#1D4ED8]">{r.t}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
