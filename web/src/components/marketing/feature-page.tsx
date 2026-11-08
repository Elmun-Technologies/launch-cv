import Link from "next/link";
import type { ReactNode } from "react";
import { SiteShell } from "@/components/site/site-shell";
import { Breadcrumbs, btn, btnPrimary, btnWhite, container, FaqIcon, labelCls } from "@/components/site/ui";
import { JsonLd } from "@/components/json-ld";
import { CtaLink } from "@/components/cta-link";
import { absoluteUrl } from "@/lib/site";
import { PUBLIC_PLANS, entryPlan, entryPriceLabel } from "@/lib/monetization";
import { getFaqsFor } from "@/lib/cms/faqs";
import { getTestimonialsFor } from "@/lib/cms/testimonials";
import { Testimonials } from "@/components/site/testimonials";

export type FeaturePageData = {
  /** URL path, e.g. "/features/jd-alignment". */
  path: string;
  /** Product name used in JSON-LD and analytics, e.g. "JD Alignment". */
  name: string;
  /** Visible name (breadcrumb, FAQ heading). Defaults to `name`. */
  label?: string;
  h1: string;
  h1Tail: string;
  lead: string;
  /** Three short facts under the hero CTAs. */
  facts: string[];
  /** Primary hero CTA. */
  cta: { label: string; href: string };
  /** Hero poster stage (use <Stage>). Rendered as plain HTML, above the fold. */
  stage: ReactNode;
  /** The "what it produces" panel: real output format, labeled as an example. */
  example: { title: string; caption: string; body: ReactNode };
  /** Grey second half of the "N steps." heading. */
  stepsTail?: string;
  steps: { t: string; d: string }[];
  gets: { t: string; d: string }[];
  /** Plan band. `note` overrides the default "included in every paid plan" line. */
  banner: { title: string; text: string; note?: string };
  faqs: { q: string; a: string }[];
  related: { href: string; label: string; kind: string }[];
};

const sectionPad = "pt-16 sm:pt-24 lg:pt-[130px]";
const cardShadow = "shadow-[0_1px_2px_rgba(18,18,38,.04),0_10px_30px_-18px_rgba(18,18,38,.22)]";

/** Shared layout for /features/* pages (v5 design). */
export async function FeaturePage({ f: base }: { f: FeaturePageData }) {
  // FAQs and testimonials can be managed in Admin → Content (placement = the path without the slash).
  const placement = base.path.replace(/^\//, "");
  const [cmsFaqs, testimonials] = await Promise.all([getFaqsFor(placement), getTestimonialsFor(placement, 3)]);
  const f: FeaturePageData = cmsFaqs.length ? { ...base, faqs: cmsFaqs.map((x) => ({ q: x.question, a: x.answer })) } : base;
  const url = absoluteUrl(f.path);
  const label = f.label ?? f.name;
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
          price: String(PUBLIC_PLANS[entryPlan()].priceAmount),
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
  const note = f.banner.note ?? `Included in every paid plan, from ${entryPriceLabel()}.`;
  // Rendered once per layout so the reading order matches what's on screen.
  const band = (
    <div className="lc-reveal flex flex-col gap-4 rounded-[26px] bg-[#5440e8] px-5 pb-5 pt-[26px] text-white sm:p-10 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:rounded-[36px] lg:bg-[#c9c0ff] lg:px-14 lg:py-12 lg:text-[#121226]">
      <div>
        <h2 className="text-[26px] font-extrabold leading-[30px] tracking-[-0.03em] lg:text-[34px] lg:leading-10">{f.banner.title}</h2>
        <p className="mt-2 text-[15px] leading-[23px] text-[#e4dfff] lg:text-[17px] lg:leading-[26px] lg:text-[#2b2752]">{f.banner.text}</p>
        <p className="mt-2 text-[14px] text-[#e4dfff] lg:text-[#2b2752]">
          {note}{" "}
          <CtaLink cta="free_ats_check" location={`feature_${f.name}_banner`} href="/free-ats-check" className="lc-link font-semibold underline decoration-1 underline-offset-2 lg:no-underline">
            Free ATS check first
          </CtaLink>
        </p>
      </div>
      <CtaLink
        cta="get_started"
        location={`feature_${f.name}_banner`}
        href={f.cta.href}
        className={`${btn} flex-none bg-white text-[#121226] hover:bg-[#f1eff8] lg:bg-[#111118] lg:text-white lg:hover:bg-[#2a2940]`}
      >
        Get started
      </CtaLink>
    </div>
  );

  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO — static HTML; the headline and CTAs never wait for JavaScript. */}
      <section className={`${container} pt-4 lg:pt-8`}>
        <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
          <div className="flex flex-col justify-center lg:pr-6">
            <Breadcrumbs items={[{ href: "/", label: "Home" }, { href: "/features", label: "Tools" }, { label }]} />
            <h1 className="mt-3.5 text-[36px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-[48px] lg:mt-[22px] lg:text-[58px] lg:leading-[61px]">
              {f.h1} <span className="text-[#7c7a94]">{f.h1Tail}</span>
            </h1>
            <p className="mt-3.5 text-[16px] leading-[25px] text-[#4a4862] sm:text-[18px] sm:leading-7 lg:mt-5">{f.lead}</p>
            <div className="mt-[18px] flex flex-col gap-2.5 sm:flex-row lg:mt-7">
              <CtaLink cta="get_started" location={`feature_${f.name}`} href={f.cta.href} className={btnPrimary}>
                {f.cta.label}
              </CtaLink>
              <CtaLink cta="choose_plan" location={`feature_${f.name}_hero`} href="/pricing" className={`${btnWhite} max-sm:hidden`}>
                See pricing
              </CtaLink>
            </div>
            <ul className="mt-3.5 flex flex-wrap gap-1.5 lg:mt-[22px] lg:gap-2">
              {f.facts.map((x) => (
                <li key={x} className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-[7px] text-[13px] font-semibold lg:px-3.5 lg:py-[9px] lg:text-[14px]">
                  <span className="text-[#0b7a4f]" aria-hidden="true">
                    ✓
                  </span>
                  {x}
                </li>
              ))}
            </ul>
          </div>
          {f.stage}
        </div>
      </section>

      {/* EXAMPLE OUTPUT (dark) */}
      <section className={`${container} ${sectionPad}`}>
        <figure className="lc-reveal m-0 rounded-[28px] bg-[#111118] px-[18px] pb-[18px] pt-[26px] text-white sm:p-10 lg:rounded-[36px] lg:p-16">
          <div className="flex items-end justify-between gap-10">
            <div className="max-w-[760px]">
              <p className={`${labelCls} !text-[#c9c0ff]`}>/ Example</p>
              <h2 className="lc-h2 mt-3.5 text-white lg:mt-5">{f.example.title}</h2>
            </div>
            <span className="hidden shrink-0 rounded-full bg-[#2a2840] px-2.5 py-[5px] text-[12px] font-bold text-[#c9c0ff] sm:inline-block">Example</span>
          </div>
          <div className="mt-[18px] lg:mt-10">{f.example.body}</div>
          <figcaption className="mt-3.5 text-[13px] leading-[19px] text-[#9a97b3] lg:mt-5 lg:text-[14px] lg:leading-[21px]">{f.example.caption}</figcaption>
        </figure>
      </section>

      {/* HOW IT WORKS */}
      <section className={`${container} ${sectionPad}`}>
        <div className="lc-reveal max-w-[980px]">
          <p className={labelCls}>/ How it works</p>
          <h2 className="lc-h2 mt-3.5 lg:mt-5">
            {f.steps.length} steps. {f.stepsTail ? <span>{f.stepsTail}</span> : null}
          </h2>
        </div>
        <ol className="mt-[18px] grid sm:mt-10 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {f.steps.map((s, i) => (
            <li
              key={s.t}
              className="lc-reveal flex gap-3.5 border-t-2 border-[#121226] py-3.5 lc-rise sm:block sm:rounded-3xl sm:border-0 sm:bg-white sm:p-6"
            >
              <span className="lc-mono pt-[3px] text-[12px] text-[#5440e8] sm:block sm:pt-0 sm:text-[13px]">{String(i + 1).padStart(2, "0")}</span>
              <span className="block">
                <span className="block text-[17px] font-bold sm:mt-9 sm:text-[21px] sm:font-extrabold sm:leading-[27px] sm:tracking-[-0.015em]">{s.t}</span>
                <span className="mt-0.5 block text-[14px] leading-[21px] text-[#4a4862] sm:mt-2 sm:text-[15px] sm:leading-[23px]">{s.d}</span>
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* WHAT'S INCLUDED */}
      <section className={`${container} ${sectionPad}`}>
        <div className="grid gap-4 lg:grid-cols-[0.7fr_1.3fr] lg:gap-16">
          <div className="lc-reveal">
            <p className={labelCls}>/ What&apos;s included</p>
            <h2 className="lc-h2 mt-3.5 hidden sm:block lg:mt-5">Everything in one place.</h2>
          </div>
          <div className="grid grid-cols-2 gap-2 lg:gap-x-8 lg:gap-y-0">
            {f.gets.map((g) => (
              <div
                key={g.t}
                className={`lc-reveal rounded-[20px] bg-white p-4 ${cardShadow} lg:rounded-none lg:border-t-2 lg:border-[#121226] lg:bg-transparent lg:px-0 lg:py-6 lg:shadow-none`}
              >
                <h3 className="text-[15px] font-extrabold sm:text-[17px] lg:text-[19px]">{g.t}</h3>
                <p className="mt-1 text-[13px] leading-[19px] text-[#4a4862] sm:text-[15px] sm:leading-[23px] lg:mt-1.5">{g.d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PLAN BAND (tablet and desktop: before the FAQ) */}
      <section className={`${container} pt-14 max-sm:hidden sm:pt-20 lg:pt-[110px]`}>{band}</section>

      {/* FAQ */}
      <section className={`${container} ${sectionPad}`}>
        <div className="grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lc-reveal">
            <p className={labelCls}>/ Questions</p>
            <h2 className="lc-h2 mt-3.5 lg:mt-5">
              {label}, <span>answered.</span>
            </h2>
            <p className="mt-5 hidden text-[16px] leading-[25px] text-[#4a4862] lg:block">
              Something else?{" "}
              <a href="mailto:support@launch-cv.com" className="font-semibold text-[#5440e8] hover:underline">
                support@launch-cv.com
              </a>
            </p>
          </div>
          <FaqList items={f.faqs} />
        </div>
      </section>

      {/* PLAN BAND (phones: after the FAQ, like the design) */}
      <section className={`${container} pt-14 sm:hidden`}>{band}</section>

      {testimonials.length ? <Testimonials items={testimonials} /> : null}

      {/* RELATED */}
      <section className={`${container} pb-4 pt-14 sm:pt-20 lg:pt-[110px]`}>
        <p className={`${labelCls} lc-reveal`}>/ Related</p>
        <div className="mt-5 grid gap-3 md:grid-cols-3 md:gap-4">
          {f.related.map((r) => (
            <Link key={r.href} href={r.href} className="lc-card lc-rise lc-reveal group flex items-center justify-between gap-4 rounded-3xl px-[26px] py-6 text-[#121226]">
              <span>
                <span className="inline-block rounded-full bg-[#e4dfff] px-2.5 py-[5px] text-[12px] font-bold text-[#3a2bb8]">{r.kind}</span>
                <span className="mt-3 block text-[18px] font-extrabold leading-[25px] group-hover:text-[#5440e8] sm:text-[19px]">{r.label}</span>
              </span>
              <span aria-hidden="true" className="inline-flex h-10 w-10 flex-none items-center justify-center rounded-full bg-[#111118] text-white transition-colors group-hover:bg-[#5440e8]">
                →
              </span>
            </Link>
          ))}
        </div>
      </section>
    </SiteShell>
  );
}

/** Accordion list in the v5 style (first item open). Answers stay in the HTML for the FAQPage markup. */
export function FaqList({ items }: { items: { q: string; a: string }[] }) {
  return (
    <div className="flex flex-col gap-2">
      {items.map((x, i) => (
        <details
          key={x.q}
          open={i === 0}
          className="lc-faq group rounded-[22px] bg-white px-[18px] py-[18px] transition-shadow hover:shadow-[0_10px_30px_-18px_rgba(18,18,38,.3)] sm:rounded-3xl sm:px-6 sm:py-[22px]"
        >
          <summary className="flex min-h-[34px] items-center justify-between gap-4">
            <span className="text-[16px] font-bold sm:text-[18px]">{x.q}</span>
            <FaqIcon />
          </summary>
          <p className="mt-3 text-[15px] leading-[25px] text-[#4a4862] sm:text-[16px] sm:leading-[26px]">{x.a}</p>
        </details>
      ))}
    </div>
  );
}

/* ── Hero stage ─────────────────────────────────────────────────────────── */

/**
 * Colored poster panel for the hero. Children are absolutely positioned:
 * mobile-first coordinates, `lg:` ones for the 640px desktop stage.
 */
export function Stage({ bg, poster, posterColor, children }: { bg: string; poster: string; posterColor: string; children: ReactNode }) {
  return (
    <div className="relative h-[420px] overflow-hidden rounded-[28px] sm:h-[480px] lg:h-[640px] lg:rounded-[36px]" style={{ background: bg }}>
      <p
        aria-hidden="true"
        className="lc-poster absolute left-[18px] top-3.5 m-0 text-[64px] leading-[64px] sm:text-[96px] sm:leading-[96px] lg:left-8 lg:top-6 lg:text-[120px] lg:leading-[120px]"
        style={{ color: posterColor }}
      >
        {poster}
      </p>
      {children}
    </div>
  );
}

/** Small "Example" tag for illustrative widgets. */
export function ExampleTag({ dark = false }: { dark?: boolean }) {
  return <span className={`text-[11px] font-semibold ${dark ? "text-[#c9c0ff]" : "text-[#66647c]"}`}>Example</span>;
}

/* ── Example-panel building blocks (dark section) ──────────────────────── */

/** Dark tile inside the example panel. */
export function DarkTile({ label, children, className = "" }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[20px] bg-[#1d1c2e] p-5 sm:p-6 ${className}`}>
      {label ? <p className="text-[12px] font-bold tracking-[0.08em] text-[#9a97b3]">{label}</p> : null}
      {children}
    </div>
  );
}

/** Lilac "result" tile inside the example panel. */
export function LilacTile({ label, children, className = "" }: { label?: string; children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-[20px] bg-[#c9c0ff] p-5 text-[#111118] sm:p-6 ${className}`}>
      {label ? <p className="text-[12px] font-bold tracking-[0.08em]">{label}</p> : null}
      {children}
    </div>
  );
}

/** Before → after pair: struck-through original on dark, rewrite on lilac. */
export function BeforeAfter({ before, after, beforeLabel = "BEFORE", afterLabel = "AFTER", strike = true }: { before: string; after: string; beforeLabel?: string; afterLabel?: string; strike?: boolean }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      <DarkTile label={beforeLabel}>
        <p className={`mt-3 text-[16px] leading-[25px] text-[#b3b0c8] sm:text-[19px] sm:leading-7 ${strike ? "line-through decoration-[#ff7a33]" : "!text-[#e9e7f3]"}`}>{before}</p>
      </DarkTile>
      <LilacTile label={afterLabel}>
        <p className="mt-3 text-[16px] font-semibold leading-[25px] sm:text-[19px] sm:leading-7">{after}</p>
      </LilacTile>
    </div>
  );
}
