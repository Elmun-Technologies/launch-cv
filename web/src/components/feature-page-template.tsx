"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/site";
import { ArrowRight, Check, ChevronRight } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FeatureAccent = "blue" | "violet" | "teal" | "emerald" | "orange" | "pink" | "sky" | "amber" | "rose" | "slate";

export type BeforeAfter = {
  beforeText: string;
  beforeScore?: string;
  afterText: string;
  afterScore?: string;
};

export type FeaturePageProps = {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  canonicalPath: string;
  accent?: FeatureAccent;
  eyebrow?: string;
  h1?: string;
  steps: { title: string; description: string }[];
  benefits: string[];
  testimonial?: { text: string; name: string; role: string };
  testimonials?: { text: string; name: string; role: string }[];
  relatedFeatures: { title: string; href: string }[];
  beforeAfter?: BeforeAfter;
  ctaHeadline?: string;
  ctaSubtitle?: string;
  ctaButton?: string;
};

/* accent → Tailwind class sets */
const ACCENT: Record<FeatureAccent, { iconBg: string; iconText: string; badge: string; badgeText: string; btnBg: string; btnHover: string; btnShadow: string; gradFrom: string; gradTo: string; stepBg: string; checkText: string }> = {
  blue: { iconBg: "bg-[#EFF6FF]", iconText: "text-[#1A56DB]", badge: "bg-[#EFF6FF]", badgeText: "text-[#1A56DB]", btnBg: "bg-[#1A56DB]", btnHover: "hover:bg-[#1D4ED8]", btnShadow: "shadow-blue-500/25", gradFrom: "from-[#1A56DB]", gradTo: "to-[#7C3AED]", stepBg: "bg-[#1A56DB]", checkText: "text-[#1A56DB]" },
  violet: { iconBg: "bg-[#EDE9FE]", iconText: "text-[#6D28D9]", badge: "bg-[#EDE9FE]", badgeText: "text-[#6D28D9]", btnBg: "bg-[#7C3AED]", btnHover: "hover:bg-[#6D28D9]", btnShadow: "shadow-violet-500/25", gradFrom: "from-[#7C3AED]", gradTo: "to-[#1A56DB]", stepBg: "bg-[#7C3AED]", checkText: "text-[#7C3AED]" },
  teal: { iconBg: "bg-[#F0FDFA]", iconText: "text-[#0D9488]", badge: "bg-[#F0FDFA]", badgeText: "text-[#0D9488]", btnBg: "bg-[#0D9488]", btnHover: "hover:bg-[#0F766E]", btnShadow: "shadow-teal-500/20", gradFrom: "from-[#0D9488]", gradTo: "to-[#1A56DB]", stepBg: "bg-[#0D9488]", checkText: "text-[#0D9488]" },
  emerald: { iconBg: "bg-[#DCFCE7]", iconText: "text-[#15803D]", badge: "bg-[#DCFCE7]", badgeText: "text-[#15803D]", btnBg: "bg-[#059669]", btnHover: "hover:bg-[#047857]", btnShadow: "shadow-emerald-500/20", gradFrom: "from-[#059669]", gradTo: "to-[#0D9488]", stepBg: "bg-[#059669]", checkText: "text-[#059669]" },
  orange: { iconBg: "bg-[#FFF7ED]", iconText: "text-[#C2410C]", badge: "bg-[#FFF7ED]", badgeText: "text-[#C2410C]", btnBg: "bg-[#EA580C]", btnHover: "hover:bg-[#C2410C]", btnShadow: "shadow-orange-500/20", gradFrom: "from-[#EA580C]", gradTo: "to-[#D97706]", stepBg: "bg-[#EA580C]", checkText: "text-[#EA580C]" },
  pink: { iconBg: "bg-[#FDF2F8]", iconText: "text-[#9D174D]", badge: "bg-[#FDF2F8]", badgeText: "text-[#9D174D]", btnBg: "bg-[#DB2777]", btnHover: "hover:bg-[#BE185D]", btnShadow: "shadow-pink-500/20", gradFrom: "from-[#DB2777]", gradTo: "to-[#7C3AED]", stepBg: "bg-[#DB2777]", checkText: "text-[#DB2777]" },
  sky: { iconBg: "bg-sky-50", iconText: "text-sky-600", badge: "bg-sky-50", badgeText: "text-sky-600", btnBg: "bg-sky-600", btnHover: "hover:bg-sky-700", btnShadow: "shadow-sky-500/20", gradFrom: "from-sky-600", gradTo: "to-cyan-600", stepBg: "bg-sky-600", checkText: "text-sky-600" },
  amber: { iconBg: "bg-amber-50", iconText: "text-amber-600", badge: "bg-amber-50", badgeText: "text-amber-600", btnBg: "bg-amber-500", btnHover: "hover:bg-amber-600", btnShadow: "shadow-amber-500/20", gradFrom: "from-amber-500", gradTo: "to-orange-500", stepBg: "bg-amber-500", checkText: "text-amber-600" },
  rose: { iconBg: "bg-rose-50", iconText: "text-rose-600", badge: "bg-rose-50", badgeText: "text-rose-600", btnBg: "bg-rose-600", btnHover: "hover:bg-rose-700", btnShadow: "shadow-rose-500/20", gradFrom: "from-rose-600", gradTo: "to-pink-600", stepBg: "bg-rose-600", checkText: "text-rose-600" },
  slate: { iconBg: "bg-slate-100", iconText: "text-slate-600", badge: "bg-slate-100", badgeText: "text-slate-600", btnBg: "bg-slate-700", btnHover: "hover:bg-slate-800", btnShadow: "shadow-slate-500/20", gradFrom: "from-slate-700", gradTo: "to-slate-900", stepBg: "bg-slate-700", checkText: "text-slate-600" },
};

function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export function FeaturePageLayout(props: FeaturePageProps) {
  const {
    icon: Icon,
    title,
    tagline,
    description,
    canonicalPath,
    accent = "blue",
    eyebrow,
    h1,
    steps,
    benefits,
    testimonial,
    testimonials,
    relatedFeatures,
    beforeAfter,
    ctaHeadline,
    ctaSubtitle,
    ctaButton = "Get started",
  } = props;

  const a = ACCENT[accent];

  const { ref: benefitsRef, visible: benefitsVisible } = useReveal();
  const { ref: stepsRef, visible: stepsVisible } = useReveal();
  const { ref: baRef, visible: baVisible } = useReveal();
  const { ref: testRef, visible: testVisible } = useReveal();

  const allTestimonials = testimonials ?? (testimonial ? [testimonial] : []);

  const webPageLd = {
    "@type": "WebPage",
    name: `${title} | Launch CV`,
    description: description,
    url: absoluteUrl(canonicalPath),
  };

  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
      { "@type": "ListItem", position: 3, name: title, item: absoluteUrl(canonicalPath) },
    ],
  };

  const howToLd = steps.length > 0 ? {
    "@type": "HowTo",
    name: `How to use ${title} — Launch CV`,
    description: description,
    url: absoluteUrl(canonicalPath),
    step: steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  } : null;

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd data={{ "@context": "https://schema.org", "@graph": [webPageLd, breadcrumbLd, ...(howToLd ? [howToLd] : [])] }} />
      <LandingNav />

      {/* ──── HERO ──── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#F8FAFC] to-white pb-20 pt-[96px] sm:pt-[112px]">
        <div className={`pointer-events-none absolute inset-0 ${a.iconBg} opacity-40`} aria-hidden />
        <div className="relative mx-auto max-w-[1280px] px-6">
          <div className="mx-auto max-w-[760px] text-center">
            {/* Icon + eyebrow */}
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm shadow-black/5 transition-transform hover:scale-[1.03] duration-500 motion-reduce:transform-none">
              <div className={`flex h-full w-full items-center justify-center rounded-2xl ${a.iconBg}`}>
                <Icon className={`h-8 w-8 ${a.iconText}`} />
              </div>
            </div>
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-[12px] font-bold uppercase tracking-[0.08em] ${a.badge} ${a.badgeText}`}>
              {eyebrow ?? title}
            </span>
            <h1 className="mt-5 font-display text-[40px] font-bold leading-[1.12] tracking-[-0.025em] text-[#0F172A] sm:text-[52px]">
              {h1 ?? tagline}
            </h1>
            <p className="mx-auto mt-5 max-w-[600px] font-body text-[17px] leading-[1.75] text-[#64748B] sm:text-[18px]">
              {description}
            </p>
            <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
              <Link
                href="/register"
                className={`lc-btn-primary shadow-lg ${a.btnShadow} ${a.btnBg} ${a.btnHover}`}
              >
                {ctaButton} <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="font-body text-[14px] font-semibold text-[#64748B] transition hover:text-[#0F172A]"
              >
                See how it works ↓
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ──── BENEFITS GRID ──── */}
      <section className="py-20">
        <div ref={benefitsRef} className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <span className="lc-eyebrow">{title} — Key Features</span>
            <h2 className={`lc-h2 mx-auto mt-3 max-w-[520px] transition-all duration-700 ${benefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              Everything You Need to Succeed
            </h2>
          </div>
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {benefits.map((b, i) => (
              <div
                key={b}
                className={`lc-card flex items-start gap-4 p-6 transition-all duration-500 ${benefitsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 60}ms` }}
              >
                <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${a.iconBg}`}>
                  <Check className={`h-4 w-4 ${a.checkText}`} />
                </div>
                <p className="font-body text-[14px] leading-[1.65] text-[#334155]">{b}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── HOW IT WORKS ──── */}
      <section id="how-it-works" className="bg-[#F8FAFC] py-20">
        <div ref={stepsRef} className="mx-auto max-w-[1280px] px-6">
          <div className="text-center">
            <span className="lc-eyebrow">Step by Step</span>
            <h2 className={`lc-h2 mx-auto mt-3 max-w-[480px] transition-all duration-700 ${stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
              How {title} Works
            </h2>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((step, i) => (
              <div
                key={step.title}
                className={`flex flex-col gap-4 rounded-2xl border border-[#E2E8F0] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition-all duration-500 ${stepsVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${a.stepBg} shadow-sm`}>
                  <span className="font-display text-[15px] font-bold text-white">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-[16px] font-bold text-[#0F172A]">{step.title}</h3>
                  <p className="mt-1.5 font-body text-[14px] leading-[1.65] text-[#64748B]">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ──── BEFORE / AFTER (optional) ──── */}
      {beforeAfter && (
        <section className="py-20">
          <div ref={baRef} className="mx-auto max-w-[900px] px-6">
            <div className="text-center">
              <span className="lc-eyebrow">Transformation</span>
              <h2 className={`lc-h2 mx-auto mt-3 max-w-[480px] transition-all duration-700 ${baVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
                See the Difference AI Makes
              </h2>
            </div>
            <div className={`mt-10 grid gap-6 sm:grid-cols-2 transition-all duration-700 ${baVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="rounded-2xl border border-red-100 bg-white p-6 shadow-sm">
                <p className="font-body text-[11px] font-bold uppercase tracking-wide text-red-500">Before</p>
                <p className="mt-3 font-body text-[15px] leading-[1.7] text-[#475569]">&ldquo;{beforeAfter.beforeText}&rdquo;</p>
                {beforeAfter.beforeScore && (
                  <div className="mt-4">
                    <div className="lc-progress-bar">
                      <div className="h-full rounded-full bg-red-400" style={{ width: beforeAfter.beforeScore }} />
                    </div>
                    <p className="mt-1 font-body text-[12px] text-red-500">Match: {beforeAfter.beforeScore}</p>
                  </div>
                )}
              </div>
              <div className="rounded-2xl border border-green-100 bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <p className="font-body text-[11px] font-bold uppercase tracking-wide text-green-600">After</p>
                  <span className="lc-badge-ai">AI Enhanced</span>
                </div>
                <p className="mt-3 font-body text-[15px] leading-[1.7] text-[#475569]">&ldquo;{beforeAfter.afterText}&rdquo;</p>
                {beforeAfter.afterScore && (
                  <div className="mt-4">
                    <div className="lc-progress-bar">
                      <div className="lc-progress-fill" style={{ width: beforeAfter.afterScore }} />
                    </div>
                    <p className="mt-1 font-body text-[12px] text-green-600">Match: {beforeAfter.afterScore}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ──── TESTIMONIALS ──── */}
      {allTestimonials.length > 0 && (
        <section className={`py-20 ${beforeAfter ? "bg-[#F8FAFC]" : ""}`}>
          <div ref={testRef} className="mx-auto max-w-[900px] px-6">
            <div className="grid gap-6 sm:grid-cols-2">
              {allTestimonials.map((t, i) => (
                <div
                  key={t.name}
                  className={`lc-card p-7 transition-all duration-500 ${testVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <svg key={j} className="h-4 w-4 fill-[#F59E0B] text-[#F59E0B]" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-4 font-body text-[15px] leading-[1.75] text-[#475569]">&ldquo;{t.text}&rdquo;</p>
                  <div className="mt-5 border-t border-[#E2E8F0] pt-4">
                    <p className="font-body text-[14px] font-semibold text-[#0F172A]">{t.name}</p>
                    <p className="font-body text-[13px] text-[#94A3B8]">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ──── RELATED FEATURES ──── */}
      <section className="border-t border-[#E2E8F0] bg-white py-14">
        <div className="mx-auto max-w-[1280px] px-6">
          <h3 className="text-center font-display text-[18px] font-bold text-[#0F172A]">Related Features</h3>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {relatedFeatures.map((rf) => (
              <Link
                key={rf.href}
                href={rf.href}
                className={`flex items-center gap-1.5 rounded-full border border-[#E2E8F0] px-5 py-2.5 font-body text-[13px] font-semibold text-[#334155] transition hover:border-[#1A56DB] hover:text-[#1A56DB] hover:bg-[#EFF6FF]`}
              >
                {rf.title} <ChevronRight className="h-3.5 w-3.5" />
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ──── BOTTOM CTA ──── */}
      <section className={`bg-gradient-to-r ${a.gradFrom} ${a.gradTo} py-16`}>
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-4 px-6 text-center">
          <h2 className="font-display text-[28px] font-bold text-white sm:text-[34px]">
            {ctaHeadline ?? `Ready to Use ${title}?`}
          </h2>
          {ctaSubtitle && (
            <p className="font-body text-[16px] text-white/80">{ctaSubtitle}</p>
          )}
          <Link
            href="/register"
            className="mt-2 inline-flex items-center gap-2 rounded-[10px] bg-white px-7 py-3.5 font-body text-[15px] font-bold text-[#0F172A] shadow-lg transition hover:shadow-xl hover:scale-[1.02]"
          >
            {ctaButton} <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Mobile sticky CTA */}
      <div className="lc-sticky-cta md:hidden">
        <Link href="/register" className={`flex flex-1 items-center justify-center gap-2 rounded-[10px] py-3 font-body text-[14px] font-bold text-white ${a.btnBg}`}>
          {ctaButton} <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <LandingFooter />
    </div>
  );
}
