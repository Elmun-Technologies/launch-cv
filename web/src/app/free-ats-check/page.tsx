import Image from "next/image";
import Link from "next/link";
import { SiteShell } from "@/components/site/site-shell";
import { JsonLd } from "@/components/json-ld";
import { isGoogleOAuthConfigured } from "@/lib/google-oauth";
import { CtaLink } from "@/components/cta-link";
import { FreeAtsCheck } from "@/components/site/ats/free-ats-check";
import { container, FaqIcon, labelCls } from "@/components/site/ui";
import { buildMarketingMetadata, FREE_ATS_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { getFaqsFor } from "@/lib/cms/faqs";
import { isGoogleOAuthConfigured } from "@/lib/google-oauth";

export const metadata = buildMarketingMetadata({
  title: "Free ATS Resume Checker — Score in 10 Seconds",
  description:
    "Run a free ATS resume test against applicant tracking systems. This resume scanner gives a 0–100 ATS score, shows what the parser can't read and a fix for every issue. No sign-up.",
  pathname: "/free-ats-check",
  image: FREE_ATS_OG_IMAGE,
  keywords: [
    "ATS resume checker",
    "ATS resume test",
    "ATS resume scanner",
    "ATS score checker",
    "free ATS score checker",
    "ATS resume test free",
    "check ATS score",
    "resume scanner free",
    "ATS checker no sign up",
  ],
});

const FAQS = [
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

export const revalidate = 300;

function buildLd(faqs: { q: string; a: string }[]) {
  return {
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
}

const dimensions = [
  { t: "Formatting", d: "Columns, tables, text boxes, headers and icons that the parser can scramble or drop.", m: "Columns, tables, headers, icons." },
  { t: "Keywords", d: "Skills and titles that job posts for your role mention — and whether yours say them.", m: "Skills and titles for your role." },
  { t: "Structure", d: "Standard section headings, contact details as plain text, one date format.", m: "Headings, contact details, dates." },
  { t: "Readability", d: "Bullets that show results, a sensible length, nothing a recruiter has to decode.", m: "Results, length, clarity." },
];

const checks = [
  { t: "Tables, columns, text boxes", d: "Layouts that scramble or drop content." },
  { t: "Contact details", d: "Name, email and phone as plain text." },
  { t: "Section headings", d: "Names the software expects, like Experience." },
  { t: "Dates", d: "One consistent format for every job." },
  { t: "Keywords for your role", d: "Skills and titles job posts mention." },
  { t: "Measurable results", d: "Outcomes, not just duties." },
  { t: "Length", d: "One page for most roles, two for senior." },
  { t: "File type", d: "A text-based PDF or DOCX." },
  { t: "Images and icons", d: "Graphics the parser can't read as text." },
];

const steps = [
  { t: "Upload your resume", d: "As a PDF or Word file, or paste the text." },
  { t: "Read your report", d: "Your score, the issues behind it and a fix for each one." },
  { t: "Fix high-priority issues first", d: "They cost you the most points." },
  { t: "Tailor it to each job", d: "So the keywords match the post you're applying to." },
];

const related = [
  { kind: "Guide", t: "What is an ATS score, and how is it calculated?", href: "/blog/what-is-an-ats-score" },
  { kind: "Guide", t: "How to write an ATS-friendly resume", href: "/blog/how-to-write-an-ats-friendly-resume" },
  { kind: "Guide", t: "How to tailor your resume for every job", href: "/blog/how-to-tailor-your-resume-for-every-job" },
];

const exampleDims = [
  { t: "Formatting", v: 92, c: "#22b07d" },
  { t: "Keywords", v: 68, c: "#f2a91f" },
  { t: "Structure", v: 88, c: "#22b07d" },
  { t: "Readability", v: 77, c: "#f2a91f" },
];

const btn = "lc-btn-lift inline-flex min-h-[48px] items-center justify-center gap-2 rounded-full px-[26px] py-[15px] text-[16px] font-semibold";
const sectionPad = "pt-[72px] lg:pt-[140px]";

/** Server-rendered hero copy; the client tool shows it in the input state. */
function Intro() {
  return (
    <>
      <p className="inline-flex items-center gap-2 rounded-full bg-[#e4dfff] py-1.5 pl-1.5 pr-3 text-[13px] font-semibold text-[#3a2bb8] lg:pr-3.5 lg:text-[14px]">
        <span className="rounded-full bg-[#5440e8] px-2 py-0.5 text-[11px] text-white lg:text-[12px]">Free</span>
        No sign-up · about 10 seconds
      </p>
      <h1 className="mt-4 text-[40px] font-extrabold leading-[1.05] tracking-[-0.045em] sm:text-[52px] lg:mt-[22px] lg:text-[64px] lg:leading-[66px]">
        Free ATS resume checker. <span className="text-[#7c7a94]">Score and fixes, in seconds.</span>
      </h1>
      <p className="mt-3.5 max-w-[520px] text-[16px] leading-[25px] text-[#4a4862] lg:mt-5 lg:text-[18px] lg:leading-7">
        <span className="hidden sm:inline">Upload your resume and see </span>
        <span className="sm:hidden">See </span>
        what applicant tracking software reads, what it misses, and how to fix each issue.
      </p>
    </>
  );
}

/** Hero poster stage — illustrative, every number is marked as an example. */
function Stage() {
  return (
    <div className="relative h-[470px] overflow-hidden rounded-[28px] bg-[#5440e8] lg:h-auto lg:min-h-[760px] lg:rounded-[36px]">
      <p aria-hidden="true" className="lc-poster absolute bottom-4 left-[18px] m-0 text-[62px] leading-[56px] text-[#7a6af0] lg:bottom-7 lg:left-8 lg:text-[112px] lg:leading-[100px]">
        ATS
        <br />
        CHECK
      </p>
      <div className="absolute left-[18px] top-[22px] h-[220px] w-[220px] overflow-hidden rounded-full bg-[#c9c0ff] lg:left-8 lg:top-10 lg:h-[380px] lg:w-[380px]">
        <Image
          src="/images/people/man-white-tee.webp"
          alt="Smiling man in a white t-shirt"
          width={739}
          height={1080}
          priority
          sizes="(min-width: 1024px) 370px, 212px"
          className="absolute left-1/2 top-3.5 h-[310px] w-auto max-w-none -translate-x-1/2 lg:top-6 lg:h-[540px]"
        />
      </div>
      <div className="lc-float lc-drift absolute right-3.5 top-[196px] z-[2] w-[220px] rounded-[20px] bg-white p-4 lg:right-8 lg:top-[362px] lg:w-[290px] lg:rounded-3xl lg:p-[22px]">
        <div className="flex items-center gap-3.5">
          <svg viewBox="0 0 64 64" aria-hidden="true" className="hidden h-16 w-16 lg:block">
            <circle cx="32" cy="32" r="27" fill="none" stroke="#efedf7" strokeWidth="7" />
            <circle cx="32" cy="32" r="27" fill="none" stroke="#22b07d" strokeWidth="7" strokeLinecap="round" strokeDasharray="137 170" transform="rotate(-90 32 32)" />
          </svg>
          <div>
            <p className="text-[12px] text-[#66647c] lg:text-[13px]">ATS score · example</p>
            <p className="text-[28px] font-bold leading-8 tracking-[-0.03em] lg:text-[32px] lg:leading-9">
              81<span className="text-[12px] font-medium tracking-normal text-[#66647c] lg:text-[14px]">/100</span>
            </p>
          </div>
        </div>
        <div className="mt-2.5 flex flex-col gap-2 text-[12px] font-semibold lg:mt-[18px] lg:gap-3 lg:text-[14px]">
          {exampleDims.map((d) => (
            <div key={d.t}>
              <div className="flex justify-between">
                <span>{d.t}</span>
                <span>{d.v}</span>
              </div>
              <div className="mt-1 h-2 overflow-hidden rounded-full bg-[#efedf7] lg:mt-1.5">
                <div className="h-full rounded-full" style={{ width: `${d.v}%`, background: d.c }} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="lc-float lc-drift-2 absolute right-8 top-[674px] z-[2] hidden items-center gap-3 rounded-full bg-[#111118] py-2.5 pl-2.5 pr-5 text-white lg:flex">
        <span aria-hidden="true" className="inline-flex h-[38px] w-[38px] items-center justify-center rounded-full bg-[#fbe2e3] font-extrabold text-[#c42b30]">
          !
        </span>
        <span>
          <span className="block text-[14px] font-semibold">Top fix: add 3 missing skills</span>
          <span className="block text-[12px] text-[#c9c7d8]">Example · keywords, high priority</span>
        </span>
      </div>
      <span aria-hidden="true" className="lc-poster absolute right-[196px] top-[182px] z-[3] -rotate-[8deg] rounded-full bg-[#ff7a33] px-2.5 py-1.5 text-[11px] text-[#111118] lg:right-[296px] lg:top-[342px] lg:px-3.5 lg:py-2 lg:text-[13px]">
        0–100
      </span>
    </div>
  );
}

export default async function FreeAtsCheckPage() {
  // Admin → Content → FAQs, placement "features/ats-score" (the old feature page now lives here).
  const cmsFaqs = await getFaqsFor("features/ats-score");
  const faqs = cmsFaqs.length ? cmsFaqs.map((f) => ({ q: f.question, a: f.answer })) : FAQS;
  const googleEnabled = await isGoogleOAuthConfigured();
  return (
    <SiteShell>
      <JsonLd data={buildLd(faqs)} />

      {/* The marketing sections are children so the checker can hide them while a check runs (State-Checking). */}
      <FreeAtsCheck intro={<Intro />} stage={<Stage />} googleEnabled={googleEnabled}>

        {/* SCORE EXPLAINED */}
        <section className={`${container} ${sectionPad}`}>
          <div className="lc-reveal flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
            <div className="max-w-[760px]">
              <p className={labelCls}>/ Your score</p>
              <h2 className="lc-h2 mt-5">
                One number, four checks. <span>Aim for 80 or higher.</span>
              </h2>
            </div>
            <p className="hidden max-w-[380px] text-[18px] leading-7 text-[#4a4862] sm:block">
              The score is a 0–100 estimate of how well tracking software can read your resume and match it to jobs like yours.
            </p>
          </div>
          <ol className="mt-[22px] grid grid-cols-2 gap-2 lg:mt-12 lg:grid-cols-4 lg:gap-4">
            {dimensions.map((d, i) => (
              <li key={d.t} className="lc-card lc-rise lc-reveal rounded-3xl p-4 lg:p-[26px]">
                <p className="lc-mono text-[12px] text-[#5440e8] lg:text-[13px]">0{i + 1}</p>
                <p className="mt-[18px] text-[18px] font-bold lg:mt-10 lg:text-[24px] lg:tracking-[-0.02em]">{d.t}</p>
                <p className="mt-1 text-[13px] leading-[19px] text-[#4a4862] lg:mt-2 lg:text-[15px] lg:leading-6">
                  <span className="lg:hidden">{d.m}</span>
                  <span className="hidden lg:inline">{d.d}</span>
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-2 grid overflow-hidden rounded-[18px] text-[13px] font-semibold lg:mt-4 lg:grid-cols-[65fr_15fr_20fr] lg:rounded-3xl lg:text-[15px]">
            <p className="bg-[#fbe2e3] px-4 py-3 text-[#8f1d22] lg:px-6 lg:py-5">Below 65 · parts of your resume may be dropped or misread</p>
            <p className="bg-[#fdf0d5] px-4 py-3 text-[#7a4600] lg:px-6 lg:py-5">65–80 · readable</p>
            <p className="bg-[#dcf5ea] px-4 py-3 text-[#0b4f35] lg:px-6 lg:py-5">80+ · ready to send</p>
          </div>
        </section>

        {/* WHAT IT CHECKS (dark) */}
        <section className={`${container} ${sectionPad}`}>
          <div className="lc-reveal rounded-[28px] bg-[#111118] px-5 pb-5 pt-8 text-white sm:px-10 lg:rounded-[36px] lg:px-16 lg:py-[72px]">
            <div className="grid gap-[22px] lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
              <div>
                <p className={`${labelCls} !text-[#c9c0ff]`}>/ What it checks</p>
                <h2 className="lc-h2 mt-5 text-white">
                  Nine things that trip up the software. <span className="!text-[#9a97b3]">Your report names the ones it finds.</span>
                </h2>
                <CtaLink cta="check_resume" location="ats_checks" href="#ats-check" className={`${btn} mt-9 hidden bg-[#5440e8] text-white hover:bg-[#4430d6] lg:inline-flex`}>
                  Check my resume — free
                </CtaLink>
              </div>
              <ol className="grid sm:grid-cols-2 sm:gap-x-8">
                {checks.map((c) => (
                  <li key={c.t} className="border-t border-[#2f2d48] py-[13px] lg:py-[18px]">
                    <p className="text-[16px] font-bold lg:text-[17px]">{c.t}</p>
                    <p className="mt-0.5 text-[13px] text-[#b3b0c8] lg:mt-1 lg:text-[14px] lg:leading-[21px]">{c.d}</p>
                  </li>
                ))}
              </ol>
            </div>
            <CtaLink cta="check_resume" location="ats_checks" href="#ats-check" className={`${btn} mt-3.5 w-full bg-[#5440e8] text-white hover:bg-[#4430d6] sm:w-auto lg:hidden`}>
              Check my resume — free
            </CtaLink>
          </div>
        </section>

        {/* HOW TO */}
        <section className={`${container} ${sectionPad} grid items-stretch gap-5 lg:grid-cols-2 lg:gap-6`}>
          <div className="lc-reveal flex flex-col justify-center lg:pr-10">
            <p className={labelCls}>/ How to</p>
            <h2 className="lc-h2 mt-5">
              How to raise your ATS score. <span>In this order.</span>
            </h2>
            <ol className="mt-5 flex flex-col border-b-2 border-[#121226] lg:mt-9">
              {steps.map((s, i) => (
                <li key={s.t} className="flex gap-3.5 border-t-2 border-[#121226] py-3.5 lg:gap-[18px] lg:py-[18px]">
                  <span className="lc-mono pt-[3px] text-[12px] text-[#5440e8] lg:pt-1 lg:text-[13px]">0{i + 1}</span>
                  <span>
                    <span className="block text-[17px] font-bold lg:text-[19px]">{s.t}</span>
                    <span className="mt-0.5 block text-[14px] text-[#4a4862] lg:text-[15px]">{s.d}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div className="lc-reveal relative h-[360px] overflow-hidden rounded-[28px] bg-[#e4dfff] lg:h-auto lg:min-h-[640px] lg:rounded-[36px]">
            <div aria-hidden="true" className="absolute -bottom-[110px] -right-[70px] h-[320px] w-[320px] rounded-full bg-[#c9c0ff] lg:-bottom-[150px] lg:-right-20 lg:h-[480px] lg:w-[480px]" />
            <Image
              src="/images/people/woman-blazer-laptop.webp"
              alt="Smiling woman in a grey blazer"
              width={620}
              height={1080}
              sizes="(min-width: 1024px) 299px, 184px"
              className="absolute bottom-0 right-0 h-[320px] w-auto max-w-none lg:h-[520px]"
            />
            <div className="lc-float lc-drift absolute left-8 top-10 hidden w-[300px] rounded-3xl bg-white p-5 lg:block">
              <p className="text-[13px] text-[#66647c]">Fix list · example</p>
              <ul className="mt-3 flex flex-col gap-2 text-[14px] font-semibold">
                {[
                  ["Move contact details out of the header", true],
                  ["Rename “My Journey” to “Experience”", true],
                  ["Use one date format", false],
                  ["Add results to 3 bullets", false],
                ].map(([t, done], i) => (
                  <li key={t as string} className="flex items-center gap-2.5">
                    {done ? (
                      <span aria-hidden="true" className="inline-flex h-[22px] w-[22px] flex-none items-center justify-center rounded-full bg-[#111118] text-[12px] text-white">
                        ✓
                      </span>
                    ) : (
                      <span aria-hidden="true" className={`inline-block h-[22px] w-[22px] flex-none rounded-full border-2 ${i === 2 ? "border-[#5440e8]" : "border-[#c9c7d8]"}`} />
                    )}
                    <span className={done ? "text-[#66647c] line-through" : ""}>
                      {t}
                      {done ? <span className="sr-only"> (done)</span> : null}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lc-float lc-drift-2 absolute left-3.5 top-[18px] flex items-center gap-2 rounded-2xl bg-[#111118] px-3.5 py-2.5 text-white lg:left-8 lg:top-[270px] lg:gap-3 lg:rounded-[20px] lg:px-5 lg:py-3.5">
              <span className="text-[12px] text-[#c9c7d8] lg:text-[14px]">Example score</span>
              <span className="text-[22px] font-bold tracking-[-0.03em] lg:text-[26px]">54</span>
              <span aria-hidden="true" className="text-[#9a97b3]">
                →
              </span>
              <span className="sr-only">to</span>
              <span className="text-[22px] font-bold tracking-[-0.03em] text-[#5fe0a8] lg:text-[26px]">78</span>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className={`${container} ${sectionPad} grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
          <div className="lc-reveal">
            <p className={labelCls}>/ Questions</p>
            <h2 className="lc-h2 mt-5">ATS checker FAQ.</h2>
            <p className="mt-5 hidden text-[16px] leading-[25px] text-[#4a4862] lg:block">
              Something else?{" "}
              <a href="mailto:support@launch-cv.com" className="lc-link font-semibold text-[#5440e8]">
                support@launch-cv.com
              </a>
            </p>
          </div>
          <div className="flex flex-col gap-1.5 lg:gap-2">
            {faqs.map((f, i) => (
              <details
                key={f.q}
                className="lc-faq group rounded-[22px] bg-white p-[18px] transition-shadow hover:shadow-[0_10px_30px_-18px_rgba(18,18,38,.3)] open:shadow-[0_1px_2px_rgba(18,18,38,.04),0_10px_30px_-18px_rgba(18,18,38,.22)] lg:rounded-3xl lg:px-6 lg:py-[22px]"
                open={i === 0}
              >
                <summary className="flex min-h-[44px] items-center justify-between gap-4">
                  <span className="text-[16px] font-bold lg:text-[18px]">{f.q}</span>
                  <FaqIcon />
                </summary>
                <p className="mt-2.5 text-[15px] leading-6 text-[#4a4862] lg:mt-3 lg:text-[16px] lg:leading-[26px]">{f.a}</p>
              </details>
            ))}
            <p className="mt-3 text-[15px] text-[#4a4862] lg:hidden">
              Something else?{" "}
              <a href="mailto:support@launch-cv.com" className="lc-link font-semibold text-[#5440e8]">
                support@launch-cv.com
              </a>
            </p>
          </div>
        </section>

        {/* READ NEXT */}
        <section className={`${container} pt-[72px] lg:pt-[120px]`}>
          <div className="flex items-end justify-between gap-4">
            <h2 className={labelCls}>/ Read next</h2>
            <Link href="/blog" className="lc-link py-2 text-[15px] font-semibold text-[#5440e8]">
              All guides →
            </Link>
          </div>
          <div className="mt-3 grid gap-2.5 md:mt-5 md:grid-cols-3 md:gap-4">
            {related.map((r) => (
              <Link key={r.href} href={r.href} className="lc-card lc-rise group block rounded-3xl p-[22px] lg:p-[26px]">
                <span className="inline-block rounded-full bg-[#e4dfff] px-2.5 py-[5px] text-[12px] font-bold text-[#3a2bb8]">{r.kind}</span>
                <span className="mt-6 block text-[19px] font-bold leading-[25px] tracking-[-0.02em] transition-colors group-hover:text-[#5440e8] lg:mt-10 lg:text-[22px] lg:leading-7">
                  {r.t}
                </span>
                <span className="mt-[18px] block text-[14px] font-semibold text-[#5440e8]">Read →</span>
              </Link>
            ))}
          </div>
        </section>

        {/* FINAL CTA */}
        <section className={`${container} pt-[72px] lg:pt-[120px]`}>
          <div className="lc-reveal flex flex-col gap-[18px] rounded-[28px] bg-[#5440e8] px-[22px] pb-[22px] pt-[30px] text-white lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:rounded-[36px] lg:p-16">
            <div className="max-w-[620px]">
              <h2 className="text-[30px] font-extrabold leading-[34px] tracking-[-0.035em] lg:text-[46px] lg:leading-[50px]">Fix it before you hit Apply.</h2>
              <p className="mt-2.5 text-[15px] leading-[23px] text-[#e4dfff] lg:mt-3.5 lg:text-[18px] lg:leading-7">
                Every issue comes with a plain-English fix. Most take a minute.
              </p>
            </div>
            <CtaLink cta="check_resume" location="ats_final" href="#ats-check" className={`${btn} flex-none bg-white text-[#121226]`}>
              Check my resume — free
            </CtaLink>
          </div>
        </section>
      </FreeAtsCheck>
    </SiteShell>
  );
}
