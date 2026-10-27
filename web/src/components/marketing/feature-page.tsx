import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { absoluteUrl } from "@/lib/site";
import { PUBLIC_PLANS } from "@/lib/monetization";

export type FeaturePageData = {
  /** URL path, e.g. "/features/jd-alignment". */
  path: string;
  /** Short name for breadcrumb and related links. */
  name: string;
  h1: string;
  h1Tail: string;
  lead: string;
  /** Three short facts under the hero CTAs. */
  facts: string[];
  photo: { src: string; alt: string };
  /** The "what it produces" panel: real output format, labelled as an example. */
  example: { title: string; caption: string; body: ReactNode };
  steps: { t: string; d: string }[];
  gets: { t: string; d: string }[];
  banner: { photo: { src: string; alt: string }; title: string; text: string };
  faqs: { q: string; a: string }[];
  related: { href: string; label: string; kind: string }[];
};

const h2 = "text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[40px]";

/** Shared layout for /features/* pages (V4 "feature" design). */
export function FeaturePage({ f }: { f: FeaturePageData }) {
  const url = absoluteUrl(f.path);
  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "SoftwareApplication",
        name: `LaunchCV ${f.name}`,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url,
        description: f.lead,
        offers: {
          "@type": "Offer",
          price: String(PUBLIC_PLANS.starter.priceAmount),
          priceCurrency: "USD",
          url: absoluteUrl("/pricing"),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Tools", item: absoluteUrl("/features") },
          { "@type": "ListItem", position: 3, name: f.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: f.faqs.map((x) => ({
          "@type": "Question",
          name: x.q,
          acceptedAnswer: { "@type": "Answer", text: x.a },
        })),
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={ld} />
      <LandingNav />

      <main className="flex-1">
        {/* HERO */}
        <section className="mx-auto flex max-w-[1200px] flex-col gap-10 px-5 pt-[112px] sm:px-8 lg:flex-row lg:items-center lg:gap-14 lg:pt-[128px]">
          <div className="flex flex-1 flex-col gap-5">
            <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-[#6B6B6B]">
              <Link href="/" className="hover:text-[#111111]">
                Home
              </Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              <Link href="/features" className="hover:text-[#111111]">
                Tools
              </Link>
              <ChevronRight className="h-3.5 w-3.5" aria-hidden />
              <span className="text-[#111111]">{f.name}</span>
            </nav>
            <h1 className="text-[38px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[54px]">
              {f.h1} <span className="text-[#8A8A86]">{f.h1Tail}</span>
            </h1>
            <p className="max-w-[560px] text-[17px] leading-[1.6] text-[#3F3F3F]">{f.lead}</p>
            <div className="flex flex-wrap gap-2.5">
              <CtaLink
                cta="get_started"
                location={`feature_${f.name}`}
                href="/register"
                className="inline-flex h-12 items-center rounded-full bg-[#2563EB] px-6 text-[15px] font-medium text-white hover:bg-[#1D4ED8]"
              >
                Try {f.name}
              </CtaLink>
              <CtaLink
                cta="free_ats_check"
                location={`feature_${f.name}`}
                href="/free-ats-check"
                className="inline-flex h-12 items-center rounded-full border border-[#D9D9D5] px-6 text-[15px] font-medium hover:border-[#111111]"
              >
                Free ATS check first
              </CtaLink>
            </div>
            <p className="flex flex-wrap gap-x-5 gap-y-1 text-[14px] text-[#6B6B6B]">
              {f.facts.map((x) => (
                <span key={x}>{x}</span>
              ))}
            </p>
          </div>
          <div className="relative h-[300px] overflow-hidden rounded-[20px] sm:h-[420px] lg:w-[46%] lg:shrink-0">
            <Image src={f.photo.src} alt={f.photo.alt} fill priority sizes="(min-width: 1024px) 540px, 100vw" className="object-cover" />
          </div>
        </section>

        {/* EXAMPLE OUTPUT */}
        <section className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-28">
          <h2 className={`${h2} max-w-[760px]`}>{f.example.title}</h2>
          <figure className="mt-8 rounded-[20px] bg-[#F5F5F3] p-4 sm:p-8">
            <div className="rounded-2xl bg-white p-5 shadow-[0_16px_40px_-24px_rgba(0,0,0,0.3)] sm:p-8">{f.example.body}</div>
            <figcaption className="mt-3 text-[13px] text-[#6B6B6B]">{f.example.caption}</figcaption>
          </figure>
        </section>

        {/* STEPS */}
        <section className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-28">
          <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
            <h2 className={`${h2} lg:w-[38%]`}>How it works</h2>
            <ol className="flex flex-1 flex-col">
              {f.steps.map((s, i) => (
                <li key={s.t} className="flex gap-5 border-t border-[#EEEEEB] py-5 last:border-b">
                  <span className="w-6 shrink-0 text-[15px] text-[#6E6E6A] [font-feature-settings:'tnum']">{i + 1}</span>
                  <div>
                    <p className="text-[17px] font-semibold">{s.t}</p>
                    <p className="mt-1 text-[16px] leading-[1.6] text-[#3F3F3F]">{s.d}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* WHAT YOU GET */}
        <section className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-28">
          <h2 className={h2}>What you get</h2>
          <div className="mt-7 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-3">
            {f.gets.map((g) => (
              <div key={g.t} className="border-t border-[#EEEEEB] py-5">
                <p className="text-[17px] font-semibold">{g.t}</p>
                <p className="mt-1 text-[15px] leading-[1.55] text-[#3F3F3F]">{g.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* BANNER */}
        <section className="mx-auto max-w-[1200px] px-5 pt-24 sm:px-8 sm:pt-28">
          <div className="relative h-[400px] overflow-hidden rounded-[20px]">
            <Image src={f.banner.photo.src} alt={f.banner.photo.alt} fill sizes="(min-width: 1200px) 1136px, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#111111]/85 via-[#111111]/55 to-transparent" />
            <div className="absolute inset-y-0 left-0 flex max-w-[560px] flex-col justify-center gap-3.5 p-8 text-white sm:p-14">
              <h2 className="text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[40px]">{f.banner.title}</h2>
              <p className="text-[17px] leading-[1.6] text-[#E5E5E2]">{f.banner.text}</p>
              <div className="mt-2 flex flex-wrap gap-2.5">
                <CtaLink
                  cta="choose_plan"
                  location={`feature_${f.name}_banner`}
                  href="/pricing"
                  className="inline-flex h-12 items-center rounded-full bg-white px-6 text-[15px] font-medium text-[#111111] hover:bg-[#F5F5F3]"
                >
                  See plans
                </CtaLink>
              </div>
              <p className="text-[14px] text-[#B5B5B0]">
                Included in every plan, from {PUBLIC_PLANS.starter.priceDisplay}/month.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="mx-auto max-w-[860px] px-5 pt-24 sm:px-8 sm:pt-28">
          <h2 className={`${h2} text-center`}>{f.name} FAQ</h2>
          <div className="mt-6 border-b border-[#E5E5E2]">
            {f.faqs.map((x, i) => (
              <details key={x.q} open={i === 0} className="group border-t border-[#E5E5E2] py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-[17px] font-medium [&::-webkit-details-marker]:hidden">
                  {x.q}
                  <ChevronDown className="h-4 w-4 shrink-0 text-[#6E6E6A] transition-transform group-open:rotate-180" aria-hidden />
                </summary>
                <p className="mt-2.5 text-[16px] leading-[1.65] text-[#3F3F3F]">{x.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* RELATED */}
        <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-[104px]">
          <div className="grid gap-5 md:grid-cols-3">
            {f.related.map((r) => (
              <Link key={r.href} href={r.href} className="group border-t border-[#E5E5E2] pt-4">
                <span className="text-[13px] text-[#6B6B6B]">{r.kind}</span>
                <span className="mt-1.5 block text-[17px] font-semibold group-hover:text-[#1D4ED8]">{r.label}</span>
              </Link>
            ))}
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}

/* Small building blocks for the example panels. */

export function Chip({ tone, children }: { tone: "have" | "miss" | "part"; children: string }) {
  const cls =
    tone === "have"
      ? "border-[#BFE5D0] bg-[#EEF8F2] text-[#0E7A48]"
      : tone === "part"
        ? "border-[#F4D9B0] bg-[#FDF6EC] text-[#9A5B06]"
        : "border-[#F6D3CD] bg-[#FDF2F0] text-[#B42318]";
  return <span className={`inline-flex rounded-full border px-3 py-1 text-[13px] ${cls}`}>{children}</span>;
}

export function BeforeAfter({ before, after }: { before: string; after: string }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-[#EEEEEB] p-4">
        <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#6E6E6A]">Before</p>
        <p className="mt-2 text-[15px] leading-[1.55] text-[#6B6B6B]">{before}</p>
      </div>
      <div className="rounded-xl border border-[#111111] p-4">
        <p className="text-[12px] font-medium uppercase tracking-[0.06em] text-[#111111]">After</p>
        <p className="mt-2 text-[15px] leading-[1.55]">{after}</p>
      </div>
    </div>
  );
}
