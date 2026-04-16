import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { ArrowRight, Check, Star } from "lucide-react";
import { PUBLIC_PRICING, freePlanMarketingBullets, proPlanMarketingBullets } from "@/lib/monetization";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl, getSiteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "AI Resume Builder & Job Search Copilot",
  description:
    "Paste a job description — Launch CV rewrites your resume, scores ATS fit, and generates your cover letter. Free to start, no credit card.",
  pathname: "/",
  keywords: ["Launch CV", "resume builder", "ATS resume", "JD alignment", "cover letter AI", "interview prep"],
});

const homeStructuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Launch CV — AI Resume Builder & Job Search Copilot",
      description:
        "Tailored resumes, ATS scoring, JD alignment, cover letters, and interview prep for modern job seekers.",
      url: absoluteUrl("/"),
      isPartOf: { "@type": "WebSite", name: "Launch CV", url: getSiteUrl() },
    },
  ],
};

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd data={homeStructuredData} />
      <LandingNav />

      <main className="flex-1">
        {/* ── Hero ── */}
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,#f8fafc_0%,#ffffff_100%)]" />
          <div className="absolute left-1/2 top-0 h-[800px] w-[800px] -translate-x-1/2 bg-[radial-gradient(circle,rgba(4,156,255,0.04),transparent_70%)]" />

          <div className="relative mx-auto max-w-[980px] px-6 pb-24 pt-24 sm:pb-32 sm:pt-40">
            <p className="lc-motion-fade lc-s1 text-[14px] font-medium tracking-wide text-[#7C5CFC] sm:text-[15px]">
              The resume platform for modern job seekers
            </p>

            <h1 className="lc-motion-fade lc-s2 mt-4 text-[40px] font-[750] leading-[1.08] tracking-[-0.035em] text-[#0a0a0a] sm:mt-5 sm:text-[56px] sm:leading-[1.05] lg:text-[72px]">
              Tailored resumes.<br />
              More interviews.
            </h1>

            <p className="lc-motion-fade lc-s3 mt-6 max-w-[540px] text-[17px] leading-[1.65] text-[#666] sm:mt-8 sm:text-[19px] sm:leading-[1.7]">
              Paste a job description. Launch CV rewrites your resume to match,
              scores it against ATS filters, and generates your cover letter.
              In under two minutes.
            </p>

            <div className="lc-motion-fade lc-s4 mt-10 flex flex-col gap-4 sm:mt-12 sm:flex-row sm:items-center sm:gap-5">
              <Link
                href="/register"
                className="group inline-flex w-fit items-center justify-center gap-3 rounded-full bg-[#0a0a0a] px-7 py-3.5 text-[15px] font-semibold text-white transition hover:bg-[#333] motion-safe:hover:shadow-lg"
              >
                Start building — free
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>

              <span className="text-[14px] text-[#999]">No credit card required</span>
            </div>
            <p className="lc-motion-fade lc-s5 mt-8 text-[12px] leading-relaxed text-[#aaa]">
              <Link href="/legal/privacy" className="underline decoration-[#ccc] underline-offset-2 transition hover:text-[#666]">
                Privacy
              </Link>
              <span className="mx-2 text-[#ddd]">·</span>
              <Link href="/legal/terms" className="underline decoration-[#ccc] underline-offset-2 transition hover:text-[#666]">
                Terms
              </Link>
            </p>
          </div>
        </section>

        {/* ── Metrics ── */}
        <section className="border-t border-[#f0f0f0]">
          <RevealOnView>
          <div className="mx-auto grid max-w-[980px] grid-cols-2 gap-px bg-[#f0f0f0] sm:grid-cols-4">
            {[
              { value: "85%", sub: "avg ATS match score" },
              { value: "2 min", sub: "to tailor a resume" },
              { value: "3.2×", sub: "more interview callbacks" },
              { value: "12", sub: "industry rubrics" },
            ].map((m) => (
              <div key={m.sub} className="bg-white px-6 py-8 text-center sm:px-8 sm:py-10">
                <p className="text-[28px] font-[750] tracking-[-0.02em] text-[#0a0a0a] sm:text-[36px]">{m.value}</p>
                <p className="mt-2 text-[12px] text-[#999] sm:text-[13px]">{m.sub}</p>
              </div>
            ))}
          </div>
          <p className="mx-auto max-w-[980px] px-6 pb-6 text-center text-[11px] leading-relaxed text-[#bbb]">
            Illustrative benchmarks from internal tooling and beta feedback; your results depend on role, market, and how you apply.
          </p>
          </RevealOnView>
        </section>

        {/* ── How it works ── */}
        <section className="mx-auto max-w-[980px] px-6 py-32">
          <RevealOnView>
          <p className="text-[15px] font-medium tracking-wide text-[#7C5CFC]">How it works</p>
            <h2 className="mt-4 text-[32px] font-[750] leading-[1.1] tracking-[-0.03em] text-[#0a0a0a] sm:text-[44px]">
              Three steps. Two minutes.
            </h2>

          <div className="mt-16 grid gap-12 sm:grid-cols-3">
            {[
              { n: "01", title: "Paste the job description", body: "Copy any job posting. Our AI maps every requirement, keyword, and skill automatically." },
              { n: "02", title: "Review your tailored resume", body: "See your ATS match score, rewritten bullets, gap analysis, and skill coverage — all at once." },
              { n: "03", title: "Download and apply", body: "Export your resume as PDF, grab your cover letter, and prep with 10 interview questions." },
            ].map((s) => (
              <div key={s.n}>
                <p className="text-[13px] font-semibold text-[#ccc]">{s.n}</p>
                <h3 className="mt-3 text-[20px] font-bold leading-snug text-[#0a0a0a]">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-[1.7] text-[#666]">{s.body}</p>
              </div>
            ))}
          </div>
          </RevealOnView>
        </section>

        {/* ── Features ── */}
        <section className="border-t border-[#f0f0f0] bg-[#fafafa]">
          <RevealOnView>
          <div className="mx-auto max-w-[980px] px-6 py-32">
            <p className="text-[15px] font-medium tracking-wide text-[#7C5CFC]">Features</p>
            <h2 className="mt-4 max-w-[600px] text-[32px] font-[750] leading-[1.1] tracking-[-0.03em] text-[#0a0a0a] sm:text-[44px]">
              Six tools that replace hours of manual work.
            </h2>

            <div className="mt-16 grid gap-px overflow-hidden rounded-2xl border border-[#e5e5e5] bg-[#e5e5e5] sm:grid-cols-2 lg:grid-cols-3">
              {[
                { title: "JD Alignment", body: "Maps every requirement to your experience. Shows gaps, suggests rewrites, highlights what to add.", href: "/features/jd-alignment" },
                { title: "ATS Score", body: "A 0–100 score showing how ATS filters read your resume. Fix keyword gaps before they filter you out.", href: "/features/ats-score" },
                { title: "Resume Builder", body: "12+ industry templates. Import from LinkedIn or PDF. Real-time preview. Voice input.", href: "/features/resume-builder" },
                { title: "Cover Letter", body: "Personalized cover letter from the same JD. Matches the tone and keywords of your tailored resume.", href: "/features/cover-letter" },
                { title: "Interview Prep", body: "10 role-specific questions with answer frameworks. Plus an elevator pitch you can memorize.", href: "/features/interview-prep" },
                { title: "Voice Input", body: "Speak your work experience. AI converts your speech into polished, impact-driven resume bullets.", href: "/features/voice-input" },
              ].map((f) => (
                <Link key={f.title} href={f.href} className="group bg-white p-8 transition hover:bg-[#fafafa]">
                  <h3 className="text-[16px] font-bold text-[#0a0a0a]">{f.title}</h3>
                  <p className="mt-3 text-[14px] leading-[1.7] text-[#666]">{f.body}</p>
                  <span className="mt-5 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#7C5CFC] opacity-0 transition group-hover:opacity-100">
                    Learn more <ArrowRight className="h-3 w-3" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
          </RevealOnView>
        </section>

        {/* ── Testimonials ── */}
        <section className="border-t border-[#f0f0f0]">
          <RevealOnView>
          <div className="mx-auto max-w-[980px] px-6 py-32">
            <p className="text-[15px] font-medium tracking-wide text-[#7C5CFC]">Testimonials</p>
            <h2 className="mt-4 text-[32px] font-[750] leading-[1.1] tracking-[-0.03em] text-[#0a0a0a] sm:text-[44px]">
              Stories from active job seekers.
            </h2>
            <p className="mt-3 max-w-[640px] text-[14px] leading-relaxed text-[#999]">
              Composite quotes based on common outcomes we see in beta — not endorsements by any employer.
            </p>

            <div className="mt-12 grid gap-6 sm:mt-16 sm:grid-cols-3">
              {[
                { name: "Sarah C.", title: "Software Engineer", co: "Tech · US", text: "I was sending 50+ applications with zero callbacks. After Launch CV, I got 3 interviews in the first week.", metric: "3 interviews / 7 days" },
                { name: "Marcus J.", title: "Product Manager", co: "B2B SaaS", text: "My resume scored 38/100 before. After tailoring — 91. I got the interview on my second application.", metric: "38 → 91 ATS score" },
                { name: "Emily R.", title: "UX Designer", co: "Agency → in-house", text: "The AI doesn\u2019t fabricate achievements. It took what I actually did and made it compelling. Hired in 3 weeks.", metric: "Hired in 3 weeks" },
              ].map((t) => (
                <div key={t.name} className="rounded-xl border border-[#e5e5e5] p-6">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-[#0a0a0a] text-[#0a0a0a]" />
                    ))}
                  </div>
                  <p className="mt-5 text-[14px] leading-[1.7] text-[#666]">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-5 rounded-md bg-[#fafafa] px-3 py-2 text-center text-[13px] font-semibold text-[#0a0a0a]">{t.metric}</div>
                  <div className="mt-5">
                    <p className="text-[14px] font-semibold text-[#0a0a0a]">{t.name}</p>
                    <p className="text-[13px] text-[#999]">{t.title} · {t.co}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          </RevealOnView>
        </section>

        {/* ── Pricing ── */}
        <section className="border-t border-[#f0f0f0] bg-[#fafafa]">
          <RevealOnView>
          <div className="mx-auto max-w-[980px] px-6 py-32">
            <p className="text-[15px] font-medium tracking-wide text-[#7C5CFC]">Pricing</p>
            <h2 className="mt-4 text-[32px] font-[750] leading-[1.1] tracking-[-0.03em] text-[#0a0a0a] sm:text-[44px]">
              Start free. Scale when ready.
            </h2>

            <div className="mt-16 grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-[#e5e5e5] bg-white p-8">
                <p className="text-[14px] font-semibold text-[#999]">Free</p>
                <p className="mt-3 text-[48px] font-[750] leading-none tracking-[-0.03em] text-[#0a0a0a]">$0</p>
                <p className="mt-3 text-[14px] text-[#999]">For getting started</p>
                <ul className="mt-8 space-y-3">
                  {freePlanMarketingBullets().map((t) => (
                    <li key={t} className="flex items-center gap-3 text-[14px] text-[#666]">
                      <Check className="h-4 w-4 shrink-0 text-[#0a0a0a]" />{t}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className="mt-10 block rounded-full border border-[#e5e5e5] py-3 text-center text-[14px] font-semibold text-[#0a0a0a] transition hover:border-[#ccc] hover:bg-[#fafafa]">
                  Get started
                </Link>
              </div>

              <div className="rounded-xl border border-[#0a0a0a] bg-white p-8">
                <div className="flex items-center justify-between">
                  <p className="text-[14px] font-semibold text-[#999]">Pro</p>
                  <span className="rounded-full bg-[#0a0a0a] px-3 py-1 text-[11px] font-bold text-white">POPULAR</span>
                </div>
                <p className="mt-3 text-[48px] font-[750] leading-none tracking-[-0.03em] text-[#0a0a0a]">
                  {PUBLIC_PRICING.priceDisplay}
                  <span className="text-[18px] font-normal text-[#999]">/year</span>
                </p>
                <p className="mt-2 text-[13px] leading-snug text-[#888]">{PUBLIC_PRICING.billingExplainer}</p>
                <p className="mt-3 text-[14px] text-[#999]">For active job seekers</p>
                <ul className="mt-8 space-y-3">
                  {proPlanMarketingBullets().map((t) => (
                    <li key={t} className="flex items-center gap-3 text-[14px] text-[#666]">
                      <Check className="h-4 w-4 shrink-0 text-[#0a0a0a]" />{t}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/login?next=/dashboard/settings/subscription"
                  className="mt-10 block rounded-full bg-[#0a0a0a] py-3 text-center text-[14px] font-semibold text-white transition hover:bg-[#333]"
                >
                  Get Pro — {PUBLIC_PRICING.priceDisplay}/year
                </Link>
              </div>
            </div>
          </div>
          </RevealOnView>
        </section>

        {/* ── Final CTA ── */}
        <section className="border-t border-[#f0f0f0]">
          <RevealOnView>
          <div className="mx-auto max-w-[980px] px-6 py-32 text-center">
            <h2 className="text-[36px] font-[750] leading-[1.1] tracking-[-0.03em] text-[#0a0a0a] sm:text-[48px] lg:text-[56px]">
              Your next interview is<br />one resume away.
            </h2>
            <p className="mx-auto mt-6 max-w-[480px] text-[17px] leading-[1.7] text-[#666]">
              The average job posting receives 250 applications.
              Make sure yours stands out.
            </p>
            <div className="mt-10">
              <Link
                href="/register"
                className="group inline-flex items-center gap-3 rounded-full bg-[#0a0a0a] px-8 py-4 text-[16px] font-semibold text-white transition hover:bg-[#333]"
              >
                Build your resume — free
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>
          </RevealOnView>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
