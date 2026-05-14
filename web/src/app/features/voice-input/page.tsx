import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import {
  Mic,
  ArrowRight,
  Check,
  Star,
  Wand2,
  Shield,
  Globe,
  Target,
  FileText,
  MessageSquare,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "Voice Input — Speak Your Career, Get a Resume",
  description:
    "Click the mic. Talk like you would to a friend. Launch CV transcribes, quantifies, and turns your speech into ATS-ready resume bullets — in twelve languages.",
  pathname: "/features/voice-input",
  keywords: [
    "voice resume builder",
    "speak to resume AI",
    "voice input resume",
    "AI transcription resume",
    "hands free resume builder",
  ],
});

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: "Voice Input | Launch CV",
      url: absoluteUrl("/features/voice-input"),
      description: "Speak your career. AI turns it into ATS-ready bullets.",
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
        { "@type": "ListItem", position: 3, name: "Voice Input", item: absoluteUrl("/features/voice-input") },
      ],
    },
  ],
};

const langs = ["English", "Español", "Français", "Deutsch", "Português", "Italiano", "Nederlands", "Polski", "日本語", "中文", "한국어", "Türkçe"];

const benefits = [
  { t: "Natural speech to polished bullets", d: "Speak the way you&apos;d describe a job to a friend. AI handles the formal framing." },
  { t: "Real-time transcription", d: "Words appear as you speak. Edit any mistranscription inline before transforming." },
  { t: "Works across every section", d: "Experience, Skills, Projects, Summary, Certifications — mic available everywhere a bullet lives." },
  { t: "No app, no plug-ins", d: "Runs natively in Chrome, Edge, Safari. Permit mic access — nothing to install." },
  { t: "Privacy-first", d: "Audio is processed in-memory and discarded immediately after transcription. GDPR + CCPA compliant." },
  { t: "Twelve languages", d: "English, Spanish, French, German, Portuguese, Italian, Polish, Japanese, Mandarin, Korean, and more." },
];

const testimonials = [
  {
    q: "Voice input is brilliant. I just talked about my job history and it came out polished and professional. I would never have been able to write those bullets myself.",
    n: "David L.",
    r: "Operations Manager",
  },
  {
    q: "I have dyslexia and writing has always been a nightmare. The voice feature changed everything — I just speak and the AI makes it sound great.",
    n: "Callum R.",
    r: "Project Manager",
  },
];

export default function VoiceInputPage() {
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
              "radial-gradient(circle at 12% 0%, rgba(219,39,119,0.06), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12 lg:pb-24">
          <div className="grid items-center gap-12 lg:grid-cols-12 lg:gap-12">
            <div className="lg:col-span-6">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
                <Mic className="h-3.5 w-3.5 text-[#DB2777]" />
                Voice Input
              </span>

              <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
                Speak your experience — AI writes the resume
              </h1>

              <p className="mt-6 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
                The hardest part of a resume isn&apos;t the layout — it&apos;s the blank page. Click the mic, describe your work to a friend, and Launch CV turns your words into quantified, ATS-ready bullets.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#DB2777] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(219,39,119,0.4)] transition hover:bg-[#BE185D]"
                >
                  Start speaking
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="#privacy"
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
                >
                  How privacy works
                </Link>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-6 border-t border-[#E2E8F0] pt-6">
                {[
                  { v: "12", l: "Languages" },
                  { v: "0", l: "Audio stored" },
                  { v: "∞", l: "Sections supported" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="text-[24px] font-bold tracking-tight text-[#0F172A]">{s.v}</p>
                    <p className="mt-1 text-[12px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* VOICE MOCKUP */}
            <div className="lg:col-span-6">
              <div className="rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_30px_60px_-20px_rgba(15,23,42,0.18)]">
                <div className="flex items-center gap-1.5 border-b border-[#E2E8F0] bg-[#FAFBFC] px-4 py-2.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FF5F57]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#FEBC2E]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#28C840]" />
                  <span className="ml-3 text-[11px] font-medium text-[#94A3B8]">Voice to bullet</span>
                  <span className="ml-auto inline-flex items-center gap-1 rounded-full bg-pink-50 px-2 py-0.5 text-[11px] font-semibold text-pink-700 ring-1 ring-pink-200">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-pink-500" />
                    recording
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex flex-col items-center gap-4 rounded-xl bg-pink-50/40 p-6">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-pink-300/40" />
                      <div className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#DB2777] text-white">
                        <Mic className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex h-10 items-end gap-1" aria-hidden>
                      {[14, 22, 16, 30, 18, 36, 24, 28, 14, 32, 20, 26, 14, 28, 18, 22, 28, 16, 24, 30].map((h, idx) => (
                        <span
                          key={idx}
                          className="lc-wave-bar text-[#DB2777]"
                          style={{ height: h, animationDelay: `${idx * 0.06}s` }}
                        />
                      ))}
                    </div>
                    <p className="text-[11px] uppercase tracking-wider text-[#94A3B8]">00:14 · transcribing live</p>
                  </div>

                  <div className="mt-4 rounded-lg bg-[#FAFBFC] p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-[#94A3B8]">Heard</p>
                    <p className="mt-2 text-[13px] italic leading-[1.6] text-[#475569]">
                      &ldquo;i managed a team of five doing customer support and we trained twelve new hires over three years&rdquo;
                    </p>
                  </div>

                  <div className="my-3 flex items-center gap-2 text-pink-700">
                    <Wand2 className="h-4 w-4" />
                    <span className="text-[11px] font-semibold uppercase tracking-wider">Transforming…</span>
                  </div>

                  <div className="rounded-lg bg-pink-50/60 p-4 ring-1 ring-pink-200">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-pink-700">AI bullet</p>
                    <p className="mt-2 text-[13px] leading-[1.6] text-[#0F172A]">
                      Managed a <span className="rounded bg-pink-100 px-1 text-pink-800">5-person customer support team</span>, cutting avg resolution time by 30% and onboarding <span className="rounded bg-pink-100 px-1 text-pink-800">12 new hires</span> over three years.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LANGUAGES */}
      <section className="border-y border-[#E2E8F0] bg-[#FAFBFC] py-10">
        <p className="text-center text-[12px] font-medium uppercase tracking-wider text-[#94A3B8]">Speak in</p>
        <div className="mx-auto mt-5 max-w-[1100px] flex flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6">
          {langs.map((n) => (
            <span key={n} className="text-[15px] font-medium text-[#64748B]">
              {n}
            </span>
          ))}
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#DB2777]">Who it&apos;s for</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Some of the best careers don&apos;t start with a typed paragraph
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Non-native English speakers", d: "Speak in your strongest tongue. AI translates and reframes into formal English bullets." },
              { t: "Career switchers", d: "New to the vocabulary? Talk about what you did — we find the industry phrasing." },
              { t: "People with dyslexia", d: "Writing is hard. Speaking your career story is natural. AI handles structure and spelling." },
              { t: "Trade and service workers", d: "When the job is hands-on, the resume can be hands-free. Tell it, don&apos;t type it." },
              { t: "Returners after a break", d: "Caregivers, military, recovery. Speak the story without staring at a blank page." },
              { t: "Anyone with a phone", d: "Voice input runs in the browser. No app, no install. Walk-and-talk your resume." },
            ].map((p) => (
              <RevealOnView key={p.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <h3 className="text-[17px] font-semibold text-[#0F172A]">{p.t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: p.d }} />
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section id="privacy" className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <p className="lc-overline text-[#DB2777]">Privacy</p>
                <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                  Your voice stays your voice
                </h2>
              </div>
              <div className="lg:col-span-8">
                <ul className="space-y-5 text-[15px] leading-[1.65] text-[#475569]">
                  {[
                    { i: Shield, t: "Audio is never persisted", d: "Recorded chunks are streamed to transcription, then discarded in-memory. No audio file on our servers." },
                    { i: Shield, t: "Transcription is request-scoped", d: "Each request is processed and dropped. No fine-tuning on your voice, no training corpus contribution." },
                    { i: Globe, t: "GDPR + CCPA compliant", d: "EU and California residents get full data-export and erasure on demand. DPA is published and signed for every paid plan." },
                  ].map((p) => (
                    <li key={p.t} className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-700">
                        <p.i className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="text-[15px] font-semibold text-[#0F172A]">{p.t}</p>
                        <p className="mt-1 text-[#475569]">{p.d}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </RevealOnView>
        </div>
      </section>

      {/* BENEFITS */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="max-w-[680px]">
              <p className="lc-overline text-[#DB2777]">Capabilities</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                Audio app on the input. Resume-grade writing on the output.
              </h2>
            </div>
          </RevealOnView>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b) => (
              <RevealOnView key={b.t}>
                <div className="h-full rounded-xl border border-[#E2E8F0] bg-white p-6">
                  <Check className="h-5 w-5 text-[#DB2777]" />
                  <h3 className="mt-4 text-[17px] font-semibold text-[#0F172A]">{b.t}</h3>
                  <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]" dangerouslySetInnerHTML={{ __html: b.d }} />
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-5 lg:grid-cols-2">
            {testimonials.map((t) => (
              <RevealOnView key={t.n}>
                <figure className="h-full rounded-xl border border-[#E2E8F0] bg-white p-7">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <blockquote className="mt-4 text-[15px] leading-[1.7] text-[#0F172A]">&ldquo;{t.q}&rdquo;</blockquote>
                  <figcaption className="mt-5 border-t border-[#E2E8F0] pt-4">
                    <p className="text-[14px] font-semibold text-[#0F172A]">{t.n}</p>
                    <p className="text-[13px] text-[#64748B]">{t.r}</p>
                  </figcaption>
                </figure>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* RELATED */}
      <section className="border-t border-[#E2E8F0] py-16">
        <div className="mx-auto max-w-[1200px] px-6">
          <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Pairs well with</p>
          <div className="mt-5 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/resume-builder", t: "Resume Builder", d: "Templates + AI bullets.", icon: FileText },
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match resume to a target role.", icon: Target },
              { href: "/features/interview-prep", t: "Interview Prep", d: "Practice with voice or text.", icon: MessageSquare },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group flex items-start gap-3 rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1]"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-pink-50 text-pink-700">
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
      <section className="bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Your best stories are already in your head
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            You just need to say them out loud. AI takes the recording from there.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#DB2777] px-6 py-3 text-[14px] font-semibold text-white transition hover:bg-[#BE185D]"
          >
            Start speaking
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
