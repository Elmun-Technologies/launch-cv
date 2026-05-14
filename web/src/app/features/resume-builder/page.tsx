import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import {
  FileText,
  ArrowRight,
  ArrowUpRight,
  Sparkles,
  Star,
  Wand2,
  Layers,
  Eye,
  Download,
  ChevronRight,
  Target,
  Mail,
  Mic,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "AI Resume Builder — From Plain English to ATS-Ready in 5 Minutes",
  description:
    "Type your work history in plain language. Our AI returns quantified, ATS-tested bullets across 12 templates. PDF and DOCX in one click.",
  pathname: "/features/resume-builder",
  keywords: ["AI resume builder", "ATS friendly resume builder", "professional resume templates", "online resume maker", "resume generator AI"],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Resume Builder | Launch CV",
      url: absoluteUrl("/features/resume-builder"),
      description: "AI-powered resume builder with 12 ATS-tested templates and quantified bullets.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
        { "@type": "ListItem", position: 3, name: "Resume Builder", item: absoluteUrl("/features/resume-builder") },
      ],
    },
  ],
};

const templates = [
  { n: "Atlas", c: "Modern minimal · Tech / SaaS", color: "from-slate-100 to-slate-200" },
  { n: "Nova", c: "Two-column · Marketing / PM", color: "from-violet-100 to-violet-200" },
  { n: "Pulse", c: "Editorial · Design / Creative", color: "from-rose-100 to-rose-200" },
  { n: "Vector", c: "Compact · Engineering", color: "from-blue-100 to-blue-200" },
  { n: "Forge", c: "Executive · Leadership", color: "from-amber-100 to-amber-200" },
  { n: "Quill", c: "Classic · Finance / Legal", color: "from-emerald-100 to-emerald-200" },
];

const benefits = [
  { i: Wand2, t: "AI bullet writing", d: "Plain language in. Quantified, action-led bullets out. Every line ends with measurable outcome." },
  { i: Eye, t: "Live preview", d: "WYSIWYG to the pixel. No surprise spacing, no font swaps on export. What you see is what recruiters see." },
  { i: Layers, t: "12 ATS-safe templates", d: "Every template tested against Workday, Greenhouse, Lever, iCIMS and 11 more parsers. Zero hidden traps." },
  { i: FileText, t: "Section flexibility", d: "Drag to reorder. Add Projects, Certifications, Languages, Publications, Awards — or remove what doesn't apply." },
  { i: Download, t: "PDF & DOCX export", d: "One click, two formats. Plus a plain-text view for LinkedIn paste or email body." },
  { i: Sparkles, t: "Version history", d: "Every save versioned. Roll back any change. Maintain different cuts for different roles." },
];

const testimonials = [
  { q: "I built my resume in under 15 minutes and it looked better than anything I'd ever spent hours on. The AI suggestions were dead-on for product management.", n: "Marcus J.", r: "Product Manager → Meta" },
  { q: "As a non-native English speaker, writing formal job bullets was hard. The AI took my rough notes and made them professional. Hired in a month.", n: "Yuna K.", r: "UX Designer → Atlassian" },
];

export default function ResumeBuilderPage() {
  return (
    <div className="lc-theme-violet flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF5FF] to-white pt-[104px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-[#7C3AED] opacity-[0.14] blur-[140px]" />
          <div className="absolute -right-20 top-60 h-[400px] w-[400px] rounded-full bg-[#1A56DB] opacity-[0.10] blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-24 pt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#7C3AED]/20 bg-white px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-[0.1em] text-[#7C3AED]">
                <FileText className="h-3.5 w-3.5" /> Feature · Resume Builder
              </span>
              <span className="lc-tape hidden sm:inline-flex">
                <Sparkles className="h-3 w-3" /> 5 min · blank to PDF
              </span>
            </div>

            <h1 className="mt-6 font-display text-[56px] font-extrabold leading-[0.95] tracking-[-0.04em] text-[#0F172A] sm:text-[80px] lg:text-[100px]">
              <span className="block">The AI</span>
              <span className="block lc-gradient-text-animated">writes.</span>
              <span className="block">You{" "}<span className="italic text-[#7C3AED]">direct.</span></span>
            </h1>

            <p className="mt-7 max-w-[540px] font-body text-[18px] leading-[1.65] text-[#475569] sm:text-[20px]">
              Tell the AI what you did. It writes the bullets — quantified, action-led, ATS-tuned.
              Pick a template, watch the preview update live, hit export. 5 minutes from blank screen to PDF that gets read.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/register" className="lc-magnet inline-flex items-center gap-2 rounded-full bg-[#7C3AED] px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_40px_-14px_rgba(124,58,237,0.7)]">
                Build my resume <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#templates" className="lc-link-underline inline-flex items-center gap-2 font-body text-[14px] font-bold text-[#0F172A]">
                See all 12 templates <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[#0F172A]/10 pt-6">
              {[
                { v: "12", l: "Industry templates" },
                { v: "5 min", l: "Avg build time" },
                { v: "15", l: "ATS engines passed" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-[28px] font-extrabold leading-none tracking-tight text-[#0F172A]">{s.v}</p>
                  <p className="mt-1 font-body text-[11px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative">
              <div className="lc-window">
                <div className="lc-window-bar">
                  <span className="lc-window-dot bg-[#FF5F57]" />
                  <span className="lc-window-dot bg-[#FEBC2E]" />
                  <span className="lc-window-dot bg-[#28C840]" />
                  <span className="ml-3 font-body text-[11px] font-semibold text-[#94A3B8]">Launch CV · Editor</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-[#F3E8FF] px-2.5 py-1 font-body text-[11px] font-bold text-[#7C3AED]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7C3AED]" /> AI writing
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-0 sm:grid-cols-2">
                  <div className="border-b border-[#E2E8F0] bg-[#FAFAF7] p-5 sm:border-b-0 sm:border-r">
                    <p className="font-body text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Your rough input</p>
                    <div className="mt-3 space-y-2 font-body text-[13px] leading-[1.65] text-[#475569]">
                      <p className="rounded-lg bg-white px-3 py-2 ring-1 ring-[#E2E8F0]">i ran the eng team at acme, around 8 people, we shipped a new payments api</p>
                      <p className="rounded-lg bg-white px-3 py-2 ring-1 ring-[#E2E8F0]">helped reduce churn somehow, like 20%</p>
                    </div>
                    <div className="mt-3 flex items-center gap-1.5 font-body text-[11px] text-[#7C3AED]">
                      <Wand2 className="h-3.5 w-3.5" /> Transforming…
                    </div>
                  </div>

                  <div className="p-5">
                    <p className="font-body text-[10px] font-bold uppercase tracking-wider text-[#7C3AED]">AI-written bullets</p>
                    <ul className="mt-3 space-y-2.5 font-body text-[13px] leading-[1.6] text-[#0F172A]">
                      <li className="flex gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#7C3AED]" />
                        <span>Led 8-engineer team to ship Payments API v2, processing <span className="bg-[#F3E8FF] px-1">$12M / month</span> in 6 months post-launch.</span>
                      </li>
                      <li className="flex gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#7C3AED]" />
                        <span>Cut customer churn from <span className="bg-[#F3E8FF] px-1">9.4% → 7.5%</span> via onboarding redesign and SDK error surfacing.</span>
                      </li>
                      <li className="flex gap-1.5">
                        <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-[#7C3AED]" />
                        <span>Owned Q3/Q4 roadmap, partnering with Product + DevRel across 3 timezones.</span>
                      </li>
                    </ul>
                    <div className="mt-4 flex gap-2">
                      <button className="rounded-full bg-[#7C3AED] px-3 py-1.5 font-body text-[11px] font-bold text-white">Accept all</button>
                      <button className="rounded-full bg-[#F8FAFC] px-3 py-1.5 font-body text-[11px] font-bold text-[#475569] ring-1 ring-[#E2E8F0]">Regenerate</button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[#E2E8F0] bg-[#FAFAF7] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Eye className="h-3.5 w-3.5 text-[#7C3AED]" />
                    <span className="font-body text-[11px] font-bold text-[#0F172A]">Live preview · synced</span>
                  </div>
                  <span className="font-body text-[11px] text-[#94A3B8]">Template: Atlas · 2 pages</span>
                </div>
              </div>

              <div className="absolute -right-3 -top-3 rotate-3 rounded-2xl bg-[#7C3AED] px-3 py-2 shadow-[0_18px_40px_-12px_rgba(124,58,237,0.6)]">
                <p className="font-body text-[10px] uppercase tracking-[0.16em] text-white/70">Bullets</p>
                <p className="font-display text-[18px] font-extrabold text-white">3 of 3 ✓</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEMPLATES */}
      <section id="templates" className="border-y border-[#E2E8F0] bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 grid gap-8 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-7">
                <span className="lc-overline text-[#7C3AED]">Templates · 12 verticals</span>
                <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                  Designed by recruiters.<br />
                  <span className="italic">Approved</span> by ATS.
                </h2>
              </div>
              <p className="font-body text-[16px] leading-[1.7] text-[#475569] lg:col-span-5">
                Every template runs through the same parser farm we use for the ATS score checker. No hidden tables, no bad fonts, no zero-width spaces. Just clean structure, beautifully laid out.
              </p>
            </div>
          </RevealOnView>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((t, i) => (
              <RevealOnView key={t.n}>
                <div className="lc-bento bg-white p-5 ring-1 ring-[#E2E8F0]">
                  <div className={`aspect-[3/4] rounded-xl bg-gradient-to-br ${t.color} p-4`}>
                    <div className="space-y-1.5">
                      <div className="h-2 w-1/2 rounded-full bg-[#0F172A]/40" />
                      <div className="h-1.5 w-1/3 rounded-full bg-[#0F172A]/25" />
                    </div>
                    <div className="mt-4 space-y-1">
                      {Array.from({ length: 5 }).map((_, k) => (
                        <div key={k} className="h-1 rounded-full bg-[#0F172A]/15" style={{ width: `${60 + (k * 7) % 35}%` }} />
                      ))}
                    </div>
                    <div className="mt-4 space-y-1">
                      {Array.from({ length: 4 }).map((_, k) => (
                        <div key={k} className="h-1 rounded-full bg-[#0F172A]/15" style={{ width: `${50 + (k * 11) % 40}%` }} />
                      ))}
                    </div>
                    <div className="mt-4 flex gap-1">
                      {Array.from({ length: 4 }).map((_, k) => (
                        <span key={k} className="h-1.5 w-6 rounded-full bg-[#0F172A]/30" />
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <p className="font-display text-[16px] font-bold tracking-tight text-[#0F172A]">{t.n}</p>
                      <p className="font-body text-[12px] text-[#94A3B8]">{t.c}</p>
                    </div>
                    <span className="rounded-full bg-[#F8FAFC] px-2 py-1 font-body text-[10px] font-bold uppercase tracking-wider text-[#475569]">0{i + 1}</span>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link href="/register" className="lc-link-underline font-body text-[14px] font-bold text-[#7C3AED]">+ 6 more templates inside the app <ArrowRight className="h-4 w-4" /></Link>
          </div>
        </div>
      </section>

      {/* BEFORE/AFTER */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#7C3AED]">The Transform</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                What you type. What we ship.
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl bg-[#FAFAF7] p-8 ring-1 ring-[#E2E8F0]">
              <p className="font-body text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">What you wrote</p>
              <p className="mt-4 font-display text-[20px] leading-[1.55] text-[#475569]">
                &ldquo;managed social media, made content, helped grow followers&rdquo;
              </p>
            </div>
            <div className="rounded-3xl bg-gradient-to-br from-[#F3E8FF] to-white p-8 ring-1 ring-[#7C3AED]/20">
              <div className="flex items-center gap-2">
                <span className="lc-badge-ai">AI Rewrite</span>
              </div>
              <p className="mt-4 font-display text-[20px] leading-[1.55] text-[#0F172A]">
                Managed company social presence across 4 channels, lifting <span className="bg-[#F3E8FF] px-1">follower count by 127%</span> and engagement from <span className="bg-[#F3E8FF] px-1">1.8% to 4.6%</span> over 6 months.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="bg-[#0B0F19] py-24 text-white">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[680px]">
              <span className="lc-overline text-white/55">Capabilities</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] sm:text-[60px]">
                Built like a writer.<br />
                <span className="lc-gradient-text-animated">Ships like an engineer.</span>
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <RevealOnView key={b.t}>
                <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-7 backdrop-blur transition hover:border-white/30 hover:bg-white/[0.07]">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-[#7C3AED]/20 text-[#C4B5FD]">
                    <b.i className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 font-display text-[20px] font-bold tracking-tight">{b.t}</h3>
                  <p className="mt-2 font-body text-[14px] leading-[1.7] text-white/65">{b.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {testimonials.map((t) => (
              <RevealOnView key={t.n}>
                <div className="h-full rounded-3xl border border-[#E2E8F0] bg-white p-8">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="mt-5 font-display text-[20px] font-semibold leading-[1.4] tracking-[-0.01em] text-[#0F172A]">&ldquo;{t.q}&rdquo;</p>
                  <div className="mt-6 border-t border-[#E2E8F0] pt-4">
                    <p className="font-body text-[14px] font-bold text-[#0F172A]">{t.n}</p>
                    <p className="font-body text-[13px] text-[#94A3B8]">{t.r}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex items-center justify-between border-b border-[#0F172A]/10 pb-6">
            <h3 className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">Pairs well with</h3>
            <Link href="/features" className="lc-link-underline font-body text-[13px] font-bold text-[#7C3AED]">All features <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match bullets to a target role.", icon: Target },
              { href: "/features/cover-letter", t: "Cover Letter", d: "Personalized letter to match.", icon: Mail },
              { href: "/features/voice-input", t: "Voice Input", d: "Speak experience, AI writes it.", icon: Mic },
            ].map((r) => (
              <Link key={r.href} href={r.href} className="group flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#7C3AED] hover:bg-[#FAF5FF]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F3E8FF] text-[#7C3AED]">
                  <r.icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-display text-[16px] font-bold text-[#0F172A]">{r.t}</p>
                  <p className="mt-1 font-body text-[13px] text-[#64748B]">{r.d}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#94A3B8] transition group-hover:text-[#7C3AED]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#7C3AED] via-[#6D28D9] to-[#0F172A] py-24 text-white">
        <div className="lc-dot-bg-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-6 text-center">
          <h2 className="font-display text-[48px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[72px]">
            Your best resume<br />
            is <span className="italic text-[#C4B5FD]">5 minutes</span> away.
          </h2>
          <p className="mx-auto mt-7 max-w-[520px] font-body text-[17px] leading-[1.65] text-white/85">
            No writing skills required. Tell the AI what you did. We handle the rest.
          </p>
          <Link href="/register" className="lc-magnet mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#7C3AED] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.3)]">
            Build my resume <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="lc-sticky-cta md:hidden">
        <Link href="/register" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#7C3AED] py-3 font-body text-[14px] font-bold text-white">
          Build my resume <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <LandingFooter />
    </div>
  );
}
