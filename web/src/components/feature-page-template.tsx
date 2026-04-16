import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { RevealOnView } from "@/components/reveal-on-view";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl, getSiteUrl } from "@/lib/site";
import { ArrowRight, Check } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type FeatureAccent = "violet" | "sky" | "emerald" | "amber" | "rose" | "slate";

export type FeaturePageProps = {
  icon: LucideIcon;
  title: string;
  tagline: string;
  description: string;
  /** Path for canonical JSON-LD, e.g. `/features/jd-alignment` */
  canonicalPath: string;
  accent?: FeatureAccent;
  steps: { title: string; description: string }[];
  benefits: string[];
  testimonial?: { text: string; name: string; role: string };
  relatedFeatures: { title: string; href: string }[];
};

const ACCENTS: Record<
  FeatureAccent,
  {
    hero: string;
    orb: string;
    iconWrap: string;
    tagline: string;
    cta: string;
    ctaShadow: string;
    stepCircle: string;
    check: string;
    relatedHover: string;
    footer: string;
    footerCtaText: string;
  }
> = {
  violet: {
    hero: "from-[#F0F7FF]",
    orb: "bg-[radial-gradient(circle_at_30%_20%,rgba(124,92,252,0.12),transparent_55%)]",
    iconWrap: "bg-[#F5F3FF] text-[#7C5CFC]",
    tagline: "text-[#7C5CFC]",
    cta: "bg-[#7C5CFC] shadow-lg shadow-violet-500/25 hover:bg-[#6B4CE0]",
    ctaShadow: "",
    stepCircle: "bg-[#7C5CFC]",
    check: "text-[#7C5CFC]",
    relatedHover: "hover:border-[#7C5CFC] hover:text-[#7C5CFC]",
    footer: "from-[#7C5CFC] to-[#7C3AED]",
    footerCtaText: "text-[#7C5CFC]",
  },
  sky: {
    hero: "from-sky-50",
    orb: "bg-[radial-gradient(circle_at_25%_15%,rgba(14,165,233,0.14),transparent_55%)]",
    iconWrap: "bg-sky-100 text-sky-600",
    tagline: "text-sky-600",
    cta: "bg-sky-600 shadow-lg shadow-sky-500/20 hover:bg-sky-700",
    ctaShadow: "",
    stepCircle: "bg-sky-600",
    check: "text-sky-600",
    relatedHover: "hover:border-sky-500 hover:text-sky-600",
    footer: "from-sky-600 to-cyan-600",
    footerCtaText: "text-sky-600",
  },
  emerald: {
    hero: "from-emerald-50",
    orb: "bg-[radial-gradient(circle_at_70%_10%,rgba(16,185,129,0.14),transparent_50%)]",
    iconWrap: "bg-emerald-100 text-emerald-700",
    tagline: "text-emerald-700",
    cta: "bg-emerald-600 shadow-lg shadow-emerald-500/20 hover:bg-emerald-700",
    ctaShadow: "",
    stepCircle: "bg-emerald-600",
    check: "text-emerald-600",
    relatedHover: "hover:border-emerald-500 hover:text-emerald-700",
    footer: "from-emerald-600 to-teal-600",
    footerCtaText: "text-emerald-600",
  },
  amber: {
    hero: "from-amber-50",
    orb: "bg-[radial-gradient(circle_at_40%_25%,rgba(245,158,11,0.15),transparent_52%)]",
    iconWrap: "bg-amber-100 text-amber-700",
    tagline: "text-amber-700",
    cta: "bg-amber-600 shadow-lg shadow-amber-500/20 hover:bg-amber-700",
    ctaShadow: "",
    stepCircle: "bg-amber-600",
    check: "text-amber-600",
    relatedHover: "hover:border-amber-500 hover:text-amber-700",
    footer: "from-amber-600 to-orange-600",
    footerCtaText: "text-amber-700",
  },
  rose: {
    hero: "from-rose-50",
    orb: "bg-[radial-gradient(circle_at_60%_18%,rgba(244,63,94,0.12),transparent_52%)]",
    iconWrap: "bg-rose-100 text-rose-600",
    tagline: "text-rose-600",
    cta: "bg-rose-600 shadow-lg shadow-rose-500/20 hover:bg-rose-700",
    ctaShadow: "",
    stepCircle: "bg-rose-600",
    check: "text-rose-600",
    relatedHover: "hover:border-rose-500 hover:text-rose-600",
    footer: "from-rose-600 to-fuchsia-600",
    footerCtaText: "text-rose-600",
  },
  slate: {
    hero: "from-slate-100",
    orb: "bg-[radial-gradient(circle_at_50%_20%,rgba(71,85,105,0.12),transparent_55%)]",
    iconWrap: "bg-slate-200 text-slate-700",
    tagline: "text-slate-700",
    cta: "bg-slate-800 shadow-lg shadow-slate-500/15 hover:bg-slate-900",
    ctaShadow: "",
    stepCircle: "bg-slate-800",
    check: "text-slate-600",
    relatedHover: "hover:border-slate-500 hover:text-slate-800",
    footer: "from-slate-700 to-slate-900",
    footerCtaText: "text-slate-800",
  },
};

export function FeaturePageLayout({
  icon: Icon,
  title,
  tagline,
  description,
  canonicalPath,
  accent = "violet",
  steps,
  benefits,
  testimonial,
  relatedFeatures,
}: FeaturePageProps) {
  const a = ACCENTS[accent];
  const pageUrl = absoluteUrl(canonicalPath);
  const siteUrl = getSiteUrl();

  const webPageLd = {
    "@type": "WebPage",
    name: `${title} | Launch CV`,
    description,
    url: pageUrl,
    isPartOf: {
      "@type": "WebSite",
      name: "Launch CV",
      url: siteUrl,
    },
  };

  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
      { "@type": "ListItem", position: 2, name: "Features", item: absoluteUrl("/features") },
      { "@type": "ListItem", position: 3, name: title, item: pageUrl },
    ],
  };

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [webPageLd, breadcrumbLd],
  };

  return (
    <div className="flex min-h-screen flex-col">
      <JsonLd data={structuredData} />
      <LandingNav />
      <main className="flex-1">
        <section className={`relative overflow-hidden bg-gradient-to-b ${a.hero} to-white py-20`}>
          <div className={`pointer-events-none absolute inset-0 ${a.orb}`} aria-hidden />
          <RevealOnView className="relative mx-auto max-w-4xl px-4 text-center">
            <div className={`mx-auto flex h-16 w-16 items-center justify-center rounded-2xl transition-transform duration-500 motion-reduce:transform-none ${a.iconWrap} motion-safe:hover:scale-[1.03]`}>
              <Icon className="h-8 w-8" />
            </div>
            <h1 className="mt-6 text-[36px] font-bold leading-tight tracking-tight text-gray-900 sm:text-[44px]">{title}</h1>
            <p className={`mt-3 text-lg font-medium ${a.tagline}`}>{tagline}</p>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-gray-500">{description}</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Link
                href="/pricing"
                className={`inline-flex items-center justify-center gap-2 rounded-full px-7 py-3 text-sm font-semibold text-white transition ${a.cta}`}
              >
                See pricing <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-gray-200 bg-white px-7 py-3 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
              >
                All features
              </Link>
            </div>
          </RevealOnView>
        </section>

        <section className="py-16">
          <RevealOnView>
            <div className="mx-auto max-w-5xl px-4">
              <h2 className="text-center text-2xl font-bold text-gray-900">How it works</h2>
              <div className="mt-10 grid gap-8 sm:grid-cols-3">
                {steps.map((step, i) => (
                  <div key={i} className="text-center">
                    <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold text-white transition motion-safe:hover:scale-105 ${a.stepCircle}`}>
                      {i + 1}
                    </div>
                    <h3 className="mt-4 text-base font-bold text-gray-900">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">{step.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnView>
        </section>

        <section className="bg-[#FAFBFD] py-16">
          <RevealOnView>
            <div className="mx-auto max-w-3xl px-4">
              <h2 className="text-center text-2xl font-bold text-gray-900">Benefits</h2>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {benefits.map((b) => (
                  <div
                    key={b}
                    className="flex items-start gap-3 rounded-xl border border-transparent bg-white p-4 shadow-sm transition motion-safe:hover:-translate-y-0.5 motion-safe:hover:border-gray-100 motion-safe:hover:shadow-md"
                  >
                    <Check className={`mt-0.5 h-5 w-5 shrink-0 ${a.check}`} />
                    <p className="text-sm text-gray-700">{b}</p>
                  </div>
                ))}
              </div>
            </div>
          </RevealOnView>
        </section>

        {testimonial ? (
          <section className="py-16">
            <RevealOnView>
              <div className="mx-auto max-w-2xl px-4 text-center">
                <p className="text-lg italic leading-relaxed text-gray-600">&ldquo;{testimonial.text}&rdquo;</p>
                <p className="mt-4 text-sm font-semibold text-gray-900">{testimonial.name}</p>
                <p className="text-xs text-gray-500">{testimonial.role}</p>
              </div>
            </RevealOnView>
          </section>
        ) : null}

        <section className="border-t border-gray-100 bg-white py-12">
          <RevealOnView>
            <div className="mx-auto max-w-4xl px-4">
              <h3 className="text-center text-lg font-bold text-gray-900">Related features</h3>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                {relatedFeatures.map((rf) => (
                  <Link
                    key={rf.href}
                    href={rf.href}
                    className={`rounded-full border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 transition ${a.relatedHover}`}
                  >
                    {rf.title}
                  </Link>
                ))}
              </div>
            </div>
          </RevealOnView>
        </section>

        <section className={`bg-gradient-to-r py-16 ${a.footer}`}>
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-4 px-4 text-center">
            <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
            <Link
              href="/pricing"
              className={`inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-semibold shadow-lg transition motion-safe:hover:scale-[1.02] ${a.footerCtaText}`}
            >
              View plans <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>
      <LandingFooter />
    </div>
  );
}
