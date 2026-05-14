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
  ArrowUpRight,
  Star,
  Wand2,
  Shield,
  Globe,
  ChevronRight,
  Target,
  FileText,
  MessageSquare,
} from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "Voice Input — Speak Your Career. AI Writes the Resume.",
  description:
    "Click the mic. Talk like you would to a friend. Launch CV transcribes, quantifies, and ships ATS-ready bullets — in 14 languages, with zero typing.",
  pathname: "/features/voice-input",
  keywords: ["voice resume builder", "speak to resume AI", "voice input resume", "AI transcription resume", "hands free resume builder"],
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
  { t: "Natural speech → polished bullets", d: "Speak the way you'd describe a job to a friend. AI handles the formal framing, action verbs and quantification." },
  { t: "Real-time transcription", d: "Words appear as you speak. Edit any mistranscription inline before transforming. Confidence on-screen." },
  { t: "Works across every section", d: "Experience, Skills, Projects, Summary, Certifications — mic available everywhere a bullet lives." },
  { t: "No app, no plug-ins", d: "Runs natively in Chrome, Edge, Safari. Just permit mic access — nothing to install, nothing to download." },
  { t: "Privacy-first", d: "Audio is processed in-memory and discarded immediately after transcription. GDPR + CCPA compliant. No storage." },
  { t: "12 languages, growing", d: "Speak English, Spanish, French, German, Portuguese, Italian, Polish, Japanese, Mandarin, Korean — same fidelity in all." },
];

const testimonials = [
  { q: "Voice input is brilliant. I just talked about my job history and it came out polished and professional. I would never have been able to write those bullets myself.", n: "David L.", r: "Operations Manager" },
  { q: "I have dyslexia and writing has always been a nightmare. The voice feature changed everything — I just speak and the AI makes it sound great. Finally landed a job I'm proud of.", n: "Callum R.", r: "Project Manager" },
];

export default function VoiceInputPage() {
  return (
    <div className="lc-theme-pink flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FDF2F8] to-white pt-[104px]">
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 top-10 h-[500px] w-[500px] rounded-full bg-[#DB2777] opacity-[0.14] blur-[140px]" />
          <div className="absolute -right-20 top-60 h-[400px] w-[400px] rounded-full bg-[#7C3AED] opacity-[0.10] blur-[120px]" />
        </div>

        <div className="relative mx-auto grid max-w-[1320px] grid-cols-1 gap-12 px-6 pb-24 pt-12 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#DB2777]/20 bg-white px-3 py-1.5 font-body text-[12px] font-bold uppercase tracking-[0.1em] text-[#DB2777]">
                <Mic className="h-3.5 w-3.5" /> Feature · Voice Input
              </span>
            </div>

            <h1 className="mt-6 font-display text-[56px] font-extrabold leading-[0.94] tracking-[-0.045em] text-[#0F172A] sm:text-[88px] lg:text-[120px]">
              Just
              <br />
              <span className="lc-mega-italic text-[#DB2777]">talk.</span>
              <br />
              <span className="text-[#94A3B8]">We&apos;ll handle the rest.</span>
            </h1>

            <p className="mt-7 max-w-[560px] font-body text-[18px] leading-[1.65] text-[#475569] sm:text-[20px]">
              The hardest part of a resume isn&apos;t the layout — it&apos;s the blank page. Click the mic, describe your experience the way you would to a friend, and Launch CV transforms it into quantified, ATS-ready bullets. No typing required.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
              <Link href="/register" className="lc-magnet inline-flex items-center gap-2 rounded-full bg-[#DB2777] px-7 py-4 text-[15px] font-bold text-white shadow-[0_14px_40px_-14px_rgba(219,39,119,0.7)]">
                Start speaking <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="#privacy" className="lc-link-underline inline-flex items-center gap-2 font-body text-[14px] font-bold text-[#0F172A]">
                How privacy works <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 grid grid-cols-3 gap-6 border-t border-[#0F172A]/10 pt-6">
              {[
                { v: "12", l: "Languages live" },
                { v: "0", l: "Audio stored" },
                { v: "∞", l: "Sections supported" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-[28px] font-extrabold leading-none tracking-tight text-[#0F172A]">{s.v}</p>
                  <p className="mt-1 font-body text-[11px] uppercase tracking-wider text-[#94A3B8]">{s.l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — voice device + waveform */}
          <div className="lg:col-span-5">
            <div className="relative">
              <div className="lc-window">
                <div className="lc-window-bar">
                  <span className="lc-window-dot bg-[#FF5F57]" />
                  <span className="lc-window-dot bg-[#FEBC2E]" />
                  <span className="lc-window-dot bg-[#28C840]" />
                  <span className="ml-3 font-body text-[11px] font-semibold text-[#94A3B8]">Voice → Bullet</span>
                  <span className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-pink-100 px-2.5 py-1 font-body text-[11px] font-bold text-[#9D174D]">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#DB2777]" /> recording
                  </span>
                </div>

                <div className="p-6">
                  {/* mic + waveform */}
                  <div className="flex flex-col items-center gap-4 rounded-2xl bg-gradient-to-br from-[#FDF2F8] to-white p-6 ring-1 ring-pink-100">
                    <div className="relative">
                      <div className="absolute inset-0 animate-ping rounded-full bg-[#DB2777]/30" />
                      <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-[#DB2777] text-white shadow-[0_18px_40px_-10px_rgba(219,39,119,0.6)]">
                        <Mic className="h-7 w-7" />
                      </div>
                    </div>
                    <div className="flex h-12 items-end gap-1" aria-hidden>
                      {[14, 22, 16, 30, 18, 38, 24, 28, 12, 36, 20, 26, 14, 30, 18, 22, 28, 16, 24, 30, 14, 20, 28, 16].map((h, idx) => (
                        <span
                          key={idx}
                          className="lc-wave-bar text-[#DB2777]"
                          style={{ height: h, animationDelay: `${idx * 0.06}s` }}
                        />
                      ))}
                    </div>
                    <p className="font-body text-[11px] uppercase tracking-wider text-[#94A3B8]">00:14 · transcribing live</p>
                  </div>

                  {/* transcript */}
                  <div className="mt-4 rounded-xl bg-[#FAFAF7] p-4">
                    <p className="font-body text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">Heard</p>
                    <p className="mt-2 font-body text-[14px] italic leading-[1.65] text-[#475569]">
                      &quot;i managed a team of five doing customer support and we trained twelve new hires over three years&quot;
                    </p>
                  </div>

                  <div className="my-3 flex items-center gap-2">
                    <Wand2 className="h-4 w-4 text-[#DB2777]" />
                    <span className="font-body text-[12px] font-bold text-[#DB2777]">Transforming…</span>
                  </div>

                  {/* AI output */}
                  <div className="rounded-xl bg-gradient-to-br from-[#FDF2F8] to-white p-4 ring-1 ring-pink-100">
                    <p className="font-body text-[10px] font-bold uppercase tracking-wider text-[#9D174D]">AI bullet</p>
                    <p className="mt-2 font-body text-[14px] leading-[1.65] text-[#0F172A]">
                      Managed a <span className="bg-pink-100 px-1">5-person customer support team</span>, reducing avg ticket resolution time by 30% and onboarding <span className="bg-pink-100 px-1">12 new hires</span> over 3 years.
                    </p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-3 -top-3 rotate-3 rounded-2xl bg-[#DB2777] px-3 py-2 shadow-[0_18px_40px_-12px_rgba(219,39,119,0.6)]">
                <p className="font-body text-[10px] uppercase tracking-[0.16em] text-white/70">Typed</p>
                <p className="font-display text-[18px] font-extrabold text-white">0 chars</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* LANGUAGES MARQUEE */}
      <section className="border-y border-[#E2E8F0] bg-white py-10">
        <p className="mb-4 text-center font-body text-[11px] uppercase tracking-[0.18em] text-[#94A3B8]">Speak in</p>
        <div className="overflow-hidden">
          <div className="lc-marquee-slow">
            {[...Array(2)].map((_, p) => (
              <div key={p} className="flex items-center gap-12 px-6">
                {langs.map((n) => (
                  <span key={`${p}-${n}`} className="shrink-0 font-display text-[24px] font-bold tracking-tight text-[#0F172A]/30">
                    {n}
                  </span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[760px]">
              <span className="lc-overline text-[#DB2777]">Built for the people behind the resume</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Some of the best careers<br />
                <span className="italic">don&apos;t</span> start with a typed paragraph.
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { t: "Non-native English speakers", d: "Speak in your strongest tongue. AI translates and reframes into formal English bullets." },
              { t: "Career switchers", d: "You're new to the vocabulary. Talk about what you did — we&apos;ll find the right industry phrasing." },
              { t: "People with dyslexia", d: "Writing is hard. Speaking your career story is natural. The AI does the spelling and structure." },
              { t: "Trade & service workers", d: "When the job is hands-on, the resume can be hands-free. Tell it. Don&apos;t type it." },
              { t: "Returners after a break", d: "Caregivers, military, recovery. Speak the story without staring at a blank page." },
              { t: "Anyone with a phone", d: "Voice input runs in the browser. No app, no install. Walk-and-talk your resume." },
            ].map((p) => (
              <RevealOnView key={p.t}>
                <div className="lc-bento h-full bg-white p-6 ring-1 ring-[#E2E8F0]">
                  <h3 className="font-display text-[18px] font-bold tracking-tight text-[#0F172A]">{p.t}</h3>
                  <p className="mt-2 font-body text-[14px] leading-[1.65] text-[#475569]">{p.d}</p>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* PRIVACY */}
      <section id="privacy" className="bg-[#0B0F19] py-24 text-white">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="grid gap-12 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <span className="lc-overline text-white/55">Privacy · the only kind worth offering</span>
                <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] sm:text-[60px]">
                  Your voice<br />
                  <span className="lc-gradient-text-animated">stays your voice.</span>
                </h2>
              </div>
              <div className="lg:col-span-7">
                <ul className="space-y-5 font-body text-[15px] leading-[1.7] text-white/75">
                  {[
                    { i: Shield, t: "Audio is never persisted.", d: "Recorded chunks are streamed to transcription, then discarded in-memory. There is no audio file on our servers — anywhere." },
                    { i: Shield, t: "Transcription is request-scoped.", d: "Each request is processed and dropped. No fine-tuning on your voice, no training corpus contribution, no recovery from logs." },
                    { i: Globe, t: "GDPR + CCPA compliant.", d: "EU and California residents get full data-export and erasure on demand. Our DPA is published and signed for every paid plan." },
                  ].map((p) => (
                    <li key={p.t} className="flex items-start gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-500/15 text-pink-300">
                        <p.i className="h-5 w-5" />
                      </span>
                      <div>
                        <p className="font-display text-[16px] font-bold text-white">{p.t}</p>
                        <p className="mt-1 text-white/65">{p.d}</p>
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
      <section className="bg-[#FAFAF7] py-24">
        <div className="mx-auto max-w-[1280px] px-6">
          <RevealOnView>
            <div className="mb-12 max-w-[700px]">
              <span className="lc-overline text-[#DB2777]">Capabilities</span>
              <h2 className="mt-3 font-display text-[44px] font-bold leading-[1.06] tracking-[-0.02em] text-[#0F172A] sm:text-[56px]">
                Built like an audio app.<br />
                Outputs <span className="italic">resume-grade</span> writing.
              </h2>
            </div>
          </RevealOnView>

          <div className="grid gap-x-12 gap-y-10 lg:grid-cols-2">
            {benefits.map((b, i) => (
              <RevealOnView key={b.t}>
                <div className="flex gap-5 border-t border-[#0F172A]/10 pt-7">
                  <span className="font-display text-[28px] font-extrabold leading-none text-[#DB2777]">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h3 className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">{b.t}</h3>
                    <p className="mt-2 font-body text-[15px] leading-[1.7] text-[#475569]">{b.d}</p>
                  </div>
                </div>
              </RevealOnView>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-white py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-6 lg:grid-cols-2">
            {testimonials.map((t) => (
              <RevealOnView key={t.n}>
                <div className="h-full rounded-3xl border border-[#E2E8F0] bg-gradient-to-br from-white to-[#FDF2F8]/40 p-8">
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" />
                    ))}
                  </div>
                  <p className="mt-5 font-display text-[20px] font-semibold leading-[1.4] tracking-[-0.01em] text-[#0F172A]">&quot;{t.q}&quot;</p>
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
      <section className="bg-[#FAFAF7] py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="flex items-center justify-between border-b border-[#0F172A]/10 pb-6">
            <h3 className="font-display text-[22px] font-bold tracking-tight text-[#0F172A]">Pairs well with</h3>
            <Link href="/features" className="lc-link-underline font-body text-[13px] font-bold text-[#DB2777]">All features <ChevronRight className="h-3.5 w-3.5" /></Link>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/features/resume-builder", t: "Resume Builder", d: "Templates + AI bullets.", icon: FileText },
              { href: "/features/jd-alignment", t: "JD Alignment", d: "Match resume to a target role.", icon: Target },
              { href: "/features/interview-prep", t: "Interview Prep", d: "Practice with voice or text.", icon: MessageSquare },
            ].map((r) => (
              <Link key={r.href} href={r.href} className="group flex items-start gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#DB2777] hover:bg-[#FDF2F8]">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-pink-100 text-[#DB2777]">
                  <r.icon className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="font-display text-[16px] font-bold text-[#0F172A]">{r.t}</p>
                  <p className="mt-1 font-body text-[13px] text-[#64748B]">{r.d}</p>
                </div>
                <ArrowUpRight className="h-4 w-4 text-[#94A3B8] transition group-hover:text-[#DB2777]" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#DB2777] via-[#BE185D] to-[#0F172A] py-24 text-white">
        <div className="lc-dot-bg-dark pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="relative mx-auto max-w-[900px] px-6 text-center">
          <h2 className="font-display text-[48px] font-extrabold leading-[1.04] tracking-[-0.03em] sm:text-[72px]">
            Your best stories<br />
            are already in <span className="italic text-pink-200">your head.</span>
          </h2>
          <p className="mx-auto mt-7 max-w-[520px] font-body text-[17px] leading-[1.65] text-white/85">
            You just need to say them out loud. AI takes the recording from there — straight into your resume, polished.
          </p>
          <Link href="/register" className="lc-magnet mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-bold text-[#DB2777] shadow-[0_18px_40px_-10px_rgba(0,0,0,0.3)]">
            Start speaking <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <div className="lc-sticky-cta md:hidden">
        <Link href="/register" className="flex flex-1 items-center justify-center gap-2 rounded-full bg-[#DB2777] py-3 font-body text-[14px] font-bold text-white">
          Start speaking <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <LandingFooter />
    </div>
  );
}
