import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { RevealOnView } from "@/components/reveal-on-view";
import { Code2, Compass, Palette, ArrowRight, Sparkles } from "lucide-react";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { ProductScreenshot } from "@/components/product-screenshot";

export const metadata = buildMarketingMetadata({
  title: "Resume Builder by Role — Tailored for Your Job",
  description:
    "See how Launch CV tailors your resume to your field. Role-specific AI bullets for engineers, product managers, and designers — ATS-clean, fast.",
  pathname: "/use-cases",
  image: DEFAULT_OG_IMAGE,
  keywords: [
    "resume builder by role",
    "resume examples by job",
    "software engineer resume",
    "product manager resume",
    "designer resume",
    "role-specific resume AI",
  ],
});

const roles = [
  {
    icon: Code2,
    title: "For Software Engineers",
    description:
      "AI quantifies latency, throughput, scope, and ownership — the signals hiring managers scan for in engineering resumes.",
    href: "/use-cases/software-engineers",
    iconBg: "bg-blue-50 text-blue-700",
    stats: [{ k: "ATS-clean", v: "Every template" }, { k: "5 min", v: "Blank to PDF" }],
  },
  {
    icon: Compass,
    title: "For Product Managers",
    description:
      "Turn roadmaps, OKRs, and A/B tests into the quantified, recruiter-ready language that PM hiring actually rewards.",
    href: "/use-cases/product-managers",
    iconBg: "bg-violet-50 text-violet-700",
    stats: [{ k: "Metrics-first", v: "Every bullet" }, { k: "12", v: "Templates" }],
  },
  {
    icon: Palette,
    title: "For Designers",
    description:
      "Your portfolio shows the work; your resume should land the interview. AI writes bullets that quantify impact and shipping speed.",
    href: "/use-cases/designers",
    iconBg: "bg-rose-50 text-rose-700",
    stats: [{ k: "Impact-led", v: "Every role" }, { k: "ATS-safe", v: "Formatting" }],
  },
];

const ld = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      name: "Resume Builder by Role | Launch CV",
      description: "Role-specific resume guidance for software engineers, product managers, and designers.",
      url: absoluteUrl("/use-cases"),
    },
    {
      "@type": "ItemList",
      itemListElement: roles.map((r, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: r.title.replace(/^For /, "") + " Resume",
        url: absoluteUrl(r.href),
      })),
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
        { "@type": "ListItem", position: 2, name: "Use Cases", item: absoluteUrl("/use-cases") },
      ],
    },
  ],
};

export default function UseCasesPage() {
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
              "radial-gradient(circle at 20% 0%, rgba(59,130,246,0.06), transparent 45%), radial-gradient(circle at 90% 10%, rgba(124,58,237,0.05), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-20 pt-12">
          <div className="max-w-[760px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
              <Sparkles className="h-3.5 w-3.5 text-[#1A56DB]" /> Built for your field
            </span>
            <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
              A resume tailored to how your role gets hired
            </h1>
            <p className="mt-6 max-w-[600px] text-[17px] leading-[1.65] text-[#475569]">
              Recruiters scan for different signals in every field. Launch CV rewrites your experience into the quantified, ATS-clean language your specific role rewards — pick your track below.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
              >
                Get started
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/features"
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
              >
                Explore features
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCT SCREENSHOT */}
      <section className="py-20 sm:py-24">
        <div className="mx-auto max-w-[1100px] px-6">
          <RevealOnView>
            <div className="mx-auto max-w-[680px] text-center">
              <p className="lc-overline text-[#1A56DB]">Inside the product</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">Tailored to the role you&apos;re targeting</h2>
            </div>
          </RevealOnView>
          <ProductScreenshot
            className="mt-12"
            src="/images/product/jd-alignment.svg"
            alt="The Launch CV JD alignment view matching a resume to a specific job description, showing a 91% match score and the role's matched keywords."
            caption="Launch CV aligns every resume to the exact role — from the match score to the keywords."
          />
        </div>
      </section>

      {/* GRID */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20 sm:py-24">
        <div className="mx-auto max-w-[1200px] px-6">
          <RevealOnView>
            <div className="grid gap-5 lg:grid-cols-3">
              {roles.map((r) => (
                <Link
                  key={r.href}
                  href={r.href}
                  className="group flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-7 transition hover:border-[#CBD5E1] hover:shadow-[0_10px_30px_-15px_rgba(15,23,42,0.15)]"
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${r.iconBg}`}>
                    <r.icon className="h-5 w-5" />
                  </span>
                  <h2 className="mt-5 text-[20px] font-semibold tracking-tight text-[#0F172A]">{r.title}</h2>
                  <p className="mt-2 flex-1 text-[14px] leading-[1.65] text-[#475569]">{r.description}</p>

                  <div className="mt-5 flex items-end justify-between border-t border-[#E2E8F0] pt-4">
                    <div className="flex gap-5">
                      {r.stats.map((s) => (
                        <div key={s.v}>
                          <p className="text-[16px] font-bold leading-none tracking-tight text-[#0F172A]">{s.k}</p>
                          <p className="mt-1 text-[11px] uppercase tracking-wider text-[#94A3B8]">{s.v}</p>
                        </div>
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#1A56DB] opacity-0 transition group-hover:opacity-100">
                      See guide
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </RevealOnView>

          <RevealOnView>
            <p className="mt-10 text-center text-[14px] text-[#94A3B8]">
              Don&apos;t see your role? Launch CV ships 12 industry templates — every one is ATS-tested and quantified out of the box.
            </p>
          </RevealOnView>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">
            Pick your track, land the interview
          </h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            Same AI toolkit, tuned to your field. Start with the guide for your role, then build a resume that speaks a recruiter&apos;s language.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
            >
              View pricing
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/register" className="text-[14px] font-semibold text-[#475569] hover:text-[#0F172A]">
              Or create an account
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
