import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { KeyFacts } from "@/components/key-facts";
import { RevealOnView } from "@/components/reveal-on-view";
import { FeatureRelatedLinks } from "@/components/feature-related-links";
import { StickyCta } from "@/components/sticky-cta";
import { buildMarketingMetadata, FEATURES_OG_IMAGE } from "@/lib/build-metadata";
import { speakableLd } from "@/lib/geo";
import { absoluteUrl } from "@/lib/site";
import { ProductScreenshot } from "@/components/product-screenshot";
import {
  MessageSquare,
  ArrowRight,
  Check,
  Mic,
  Target,
  FileText,
  Mail,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "AI Interview Prep — Practice Real, Role-Specific Questions",
  description:
    "LaunchCV reads your resume and the job description, then generates the questions you're likely to face, each with a model answer outline to prepare with.",
  pathname: "/features/interview-prep",
  image: FEATURES_OG_IMAGE,
  keywords: [
    "AI interview preparation",
    "interview practice AI",
    "job interview questions",
    "mock interview online",
    "interview coaching AI",
  ],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Interview Prep | LaunchCV",
      url: absoluteUrl("/features/interview-prep"),
      description: "Role-specific AI interview questions with model answer outlines.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
        { "@type": "ListItem", position: 3, name: "Interview Prep", item: absoluteUrl("/features/interview-prep") },
      ],
    },
    speakableLd(["h1", ".lc-key-facts-lead"]),
  ],
};

const keyFacts = [
  "Generates interview questions from your resume and the exact job description.",
  "Each question comes with a model answer outline to prepare against.",
  "Bundled with a matching cover letter and elevator pitch from the same JD.",
  "No generic lists — every question is grounded in your actual background.",
];

const categories = [
  { k: "Behavioral", d: "Questions about past experience, grounded in your resume." },
  { k: "Technical", d: "Pulled from the JD&apos;s required skills and tools." },
  { k: "Situational", d: "What-would-you-do scenarios relevant to the exact role." },
];

const benefits = [
  { t: "Role-specific questions", d: "Generated from your resume and the JD. No generic &lsquo;tell me your weakness&rsquo;." },
  { t: "Model answer outlines", d: "Each question comes with a suggested answer outline to prepare against, built from your real background." },
  { t: "One packet, three outputs", d: "The same job description also produces a tailored cover letter and a short elevator pitch." },
  { t: "Nothing invented", d: "Answer outlines draw only on experience already in your resume — never fabricated achievements." },
];

// Why it works — honest, benefit-led copy. No fabricated user quotes or company names.
const whyItWorks = [
  {
    t: "Prepare with your own story, not generic advice",
    d: "Every question and answer outline is built from your resume and the specific job description — not a stock list off the internet.",
  },
  {
    t: "Walk in with a plan for the hard questions",
    d: "See likely questions before the interview, with an outline of how to answer using experience you actually have.",
  },
];

export default function InterviewPrepPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[96px]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 12% 0%, rgba(5,150,105,0.07), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
                <MessageSquare className="h-3.5 w-3.5 text-[#059669]" />
                Interview Prep
              </span>

              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Walk into every interview prepared, not rehearsed
              </h1>

              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                AI reads your resume and the job description, then generates the questions you&apos;re likely to face — each with a model answer outline built from your own background.
              </p>

              <KeyFacts
                className="mt-8 max-w-[560px]"
                lead="Interview Prep reads your resume and the target job description, then generates the role-specific questions you're most likely to face, each with a model answer outline to prepare against — covering behavioral, technical, and situational questions."
                facts={keyFacts}
              />

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <CtaLink cta="get_started" location="feature_interview_prep"
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#059669] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(5,150,105,0.4)] transition hover:bg-[#047857]"
                >
                  Prep my first interview
                  <ArrowRight className="h-4 w-4" />
                </CtaLink>
                <Link
                  href="#categories"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  See question types
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[#E2E8F0] pt-6">
                {[
                  { v: "Tailored", l: "To your resume + JD" },
                  { v: "Outlines", l: "For every question" },
                  { v: "3", l: "Question types" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-[24px] font-bold tracking-tight text-[#0F172A]">{s.v}</p>
                    <p className="mt-1 text-[12px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* PREVIEW MOCKUP */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.18)]">
                <div className="flex items-center gap-1.5 border-b border-[#E2E8F0] bg-[#FAFBFC] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 text-[11px] font-medium text-[#94A3B8]">Senior PM · question 3 of 10</span>
                </div>

                <div className="space-y-3 p-6">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#0F172A] text-[10px] font-semibold text-white">Q3</span>
                    <div className="max-w-[88%] rounded-xl rounded-tl-sm bg-[#FAFBFC] px-4 py-3 ring-1 ring-[#E2E8F0]">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">Behavioral</p>
                      <p className="mt-1 text-[13px] leading-[1.55] text-[#0F172A]">
                        Tell me about a cross-functional project that almost shipped late. What did you do?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2.5">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-semibold text-emerald-700">AI</span>
                    <div className="max-w-[88%] rounded-xl rounded-tl-sm bg-emerald-50 px-4 py-3 ring-1 ring-emerald-200">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-emerald-700">Model answer outline</p>
                      <p className="mt-2 text-[12.5px] leading-[1.6] text-[#0F172A]">
                        Ground it in your onboarding rebuild: name the timeline slip, the call you made to split scope into &lsquo;core path&rsquo; vs. &lsquo;edge cases&rsquo;, and close with the activation-parity number from your resume.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#E2E8F0] bg-[#FAFBFC] px-5 py-3">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#0F172A]">
                    <Mic className="h-3.5 w-3.5 text-[#059669]" /> Built from your resume + this JD
                  </span>
                  <span className="text-[11px] text-[#94A3B8]">10 questions generated</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT SCREENSHOT */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mx-auto max-w-[680px] text-center">
              <p className="lc-overline text-[#059669]">See it in action</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">Questions built from your resume and the JD</h2>
            </div>
          </RevealOnView>
          <ProductScreenshot
            className="mt-12"
            src="/images/product/interview-prep.svg"
            alt="The LaunchCV AI interview prep generating role-specific questions with model answer outlines from a resume and job description."
            caption="Role-specific questions, each with a model answer outline to prepare against."
          />
        </div>
      </section>

      {/* CATEGORIES */}
      <section id="categories" className="border-y border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#059669]">Question types</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Every kind of question you&apos;re likely to face
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                AI mixes question types automatically, drawing on your resume and the target job description.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((c, i) => (
              <RevealOnView key={c.k}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                    Bank {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-[17px] font-semibold text-[#0F172A]">{c.k}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: c.d }} />
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#059669]">Why it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Grounded in your resume, built for the exact role
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <RevealOnView key={b.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <Check className="h-5 w-5 text-emerald-700" />
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{b.t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: b.d }} />
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#059669]">How it works</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Three steps from cold to interview-ready
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                AI interview preparation that reads your resume and the job description, then generates the exact job interview questions you are likely to face.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { n: "01", t: "Add your resume and the JD", d: "AI reads both and builds a question set for the exact role and seniority." },
              { n: "02", t: "Review your questions", d: "Behavioral, technical, and situational questions, each with a model answer outline." },
              { n: "03", t: "Prepare your own version", d: "Use the outline as a starting point, then rehearse it in your own words." },
            ].map((s) => (
              <RevealOnView key={s.n}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-emerald-50 text-[13px] font-bold text-[#059669]">
                    {s.n}
                  </span>
                  <h3 className="mt-5 text-[17px] font-semibold text-[#0F172A]">{s.t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">{s.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#059669]">Why practice here</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Winging it vs. preparing with a plan
              </h2>
              <p className="mt-4 text-[16px] leading-[1.65] text-[#475569]">
                Reading a generic list of questions is not preparation. Interview Prep starts you from questions and answer outlines built for this exact role.
              </p>
            </div>
          </RevealOnView>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-[14px]">
              <thead>
                <tr className="border-b border-[#E2E8F0]">
                  <th className="py-3 pr-4 text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">What matters</th>
                  <th className="py-3 px-4 text-[13px] font-semibold text-[#059669]">LaunchCV</th>
                  <th className="py-3 pl-4 text-[13px] font-semibold text-[#64748B]">Winging it</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { k: "Questions", a: "Role-specific, from your resume and JD", b: "Generic lists off the internet" },
                  { k: "Answers", a: "A model outline built from your real background", b: "Making it up on the spot" },
                  { k: "Structure", a: "A clear starting point for every answer", b: "Rambling with no framework" },
                  { k: "Coverage", a: "Behavioral, technical, and situational questions", b: "Whatever you happen to think of" },
                  { k: "Bundled output", a: "Cover letter + elevator pitch from the same JD", b: "Starting from scratch each time" },
                ].map((r) => (
                  <tr key={r.k} className="border-b border-[#F1F5F9] align-top">
                    <td className="py-4 pr-4 font-medium text-[#0F172A]">{r.k}</td>
                    <td className="py-4 px-4">
                      <span className="flex items-start gap-2">
                        <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#059669]" />
                        <span className="text-[#0F172A]">{r.a}</span>
                      </span>
                    </td>
                    <td className="py-4 pl-4 text-[#64748B]">{r.b}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SCENARIO */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[820px] px-6">
          <RevealOnView>
            <p className="lc-overline text-[#059669]">A real use scenario</p>
            <h2 className="mt-3 lc-section-headline text-[#0F172A]">
              How Leah walked in with a plan instead of nerves
            </h2>
            <div className="mt-6 space-y-4 text-[16px] leading-[1.75] text-[#475569]">
              <p>
                Leah kept reaching final rounds and losing them. She knew her work was strong, but her stories wandered in the room and she never quite landed the result. She could not tell what was going wrong until she saw herself answer cold.
              </p>
              <p>
                She generated questions for her target role from her resume and the job description. The first behavioral question asked about a project that almost shipped late — and the model answer outline pointed straight at her onboarding rebuild, prompting her to lead with the timeline slip and close with the activation-parity number already sitting in her resume.
              </p>
              <p>
                She rehearsed each outline in her own words before the interview instead of freestyling in the room. By the final round, her stories came out structured and specific — the plan, not luck, made the difference.
              </p>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/features/jd-alignment" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
                Match the resume to the role <ArrowRight className="h-3.5 w-3.5" />
              </Link>
              <Link href="/features/voice-input" className="inline-flex items-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]">
                Practice answers by voice <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* WHY IT WORKS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-5 lg:grid-cols-2">
            {whyItWorks.map((w) => (
              <RevealOnView key={w.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <h3 className="text-[17px] font-semibold text-[#0F172A]">{w.t}</h3>
                  <p className="mt-3 text-[15px] leading-[1.7] text-[#475569]">{w.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Pairs well with</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match the resume to the role.", icon: Target },
              { href: "/features/cover-letter", t: "Cover Letter", d: "Personalized letter to match.", icon: Mail },
              { href: "/features/resume-builder", t: "Resume Builder", d: "ATS-tested templates and bullets.", icon: FileText },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                  <r.icon className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-[#0F172A]">{r.t}</p>
                  <p className="mt-0.5 text-[13px] text-[#64748B]">{r.d}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Prepare with a plan, not just nerves
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            Role-specific questions. Model answer outlines built from your resume.
          </p>
          <CtaLink cta="get_started" location="feature_interview_prep"
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#059669] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#047857]"
          >
            Prep my first interview
            <ArrowRight className="h-4 w-4" />
          </CtaLink>
        </div>
      </section>

      <FeatureRelatedLinks
        accent="emerald"
        useCases={[
          {
            href: "/use-cases/software-engineers",
            title: "Resumes for software engineers",
            desc: "Drill system-design and behavioral questions pulled from engineering JDs.",
          },
          {
            href: "/use-cases/product-managers",
            title: "Resumes for product managers",
            desc: "Practice roadmap, prioritization, and stakeholder questions for PM loops.",
          },
        ]}
        reading={[
          {
            href: "/blog/how-to-prepare-for-a-job-interview-with-ai",
            title: "How to prepare for an interview with AI",
            desc: "Generate role-specific questions and model answers before the call.",
          },
          {
            href: "/blog/how-to-tailor-your-resume-for-every-job",
            title: "How to tailor your resume for every job",
            desc: "Know the role inside out so interview answers land against the JD.",
          },
          {
            href: "/blog/what-is-an-ats-score",
            title: "What is an ATS score?",
            desc: "Get past the resume filter first — then the interview prep pays off.",
          },
        ]}
      />

      <StickyCta
        primaryHref="/register"
        primaryLabel="Try free"
        primaryClassName="bg-[#059669] hover:bg-[#047857]"
        location="feature_interview_prep"
      />

      <LandingFooter />
    </div>
  );
}
