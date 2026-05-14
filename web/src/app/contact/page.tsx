import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { ArrowRight, Mail, MessageSquare, FileText, ShieldCheck, Building2 } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata = buildMarketingMetadata({
  title: "Contact",
  description:
    "Get in touch with Launch CV. Support, billing, partnerships, press, and security — every inbox replies within one business day.",
  pathname: "/contact",
  keywords: ["Launch CV contact", "support", "press", "partnerships", "billing"],
});

const ld = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact Launch CV",
  url: absoluteUrl("/contact"),
};

const channels = [
  {
    icon: MessageSquare,
    name: "General support",
    description: "Account, AI features, exports, anything product-related.",
    email: "support@launch-cv.com",
  },
  {
    icon: FileText,
    name: "Billing & refunds",
    description: "Plan changes, invoices, refunds. We coordinate with Lemon Squeezy on your behalf.",
    email: "billing@launch-cv.com",
  },
  {
    icon: Building2,
    name: "Partnerships & press",
    description: "Career-services partners, university outreach, journalists, podcasts.",
    email: "hello@launch-cv.com",
  },
  {
    icon: ShieldCheck,
    name: "Security",
    description: "Coordinated disclosure for vulnerabilities. PGP available on request.",
    email: "security@launch-cv.com",
  },
];

export default function ContactPage() {
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
            backgroundImage: "radial-gradient(circle at 12% 0%, rgba(26,86,219,0.06), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-16 pt-12">
          <div className="max-w-[760px]">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
              <Mail className="h-3.5 w-3.5 text-[#1A56DB]" />
              Contact
            </span>
            <h1 className="mt-6 lc-hero-headline text-[#0F172A]">
              Talk to a real human at Launch CV
            </h1>
            <p className="mt-6 max-w-[600px] text-[17px] leading-[1.65] text-[#475569]">
              Pick the inbox that matches your need. Every queue is read every business day, with replies within one business day. No bots, no ticket triage layer — the team responds directly.
            </p>
          </div>
        </div>
      </section>

      {/* CHANNELS */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          <div className="grid gap-5 sm:grid-cols-2">
            {channels.map((c) => (
              <a
                key={c.email}
                href={`mailto:${c.email}`}
                className="group flex flex-col rounded-xl border border-[#E2E8F0] bg-white p-7 transition hover:border-[#CBD5E1] hover:shadow-[0_10px_30px_-15px_rgba(15,23,42,0.15)]"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1A56DB]">
                  <c.icon className="h-5 w-5" />
                </span>
                <h2 className="mt-5 text-[18px] font-semibold tracking-tight text-[#0F172A]">{c.name}</h2>
                <p className="mt-2 flex-1 text-[14px] leading-[1.65] text-[#475569]">{c.description}</p>
                <p className="mt-5 inline-flex items-center gap-1.5 text-[14px] font-semibold text-[#1A56DB]">
                  {c.email}
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SLA / EXPECTATIONS */}
      <section className="py-20">
        <div className="mx-auto max-w-[1100px] px-6">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="lc-overline text-[#1A56DB]">What to expect</p>
              <h2 className="mt-3 lc-section-headline text-[#0F172A]">
                One business day. Real human. No ticket loop.
              </h2>
              <p className="mt-4 text-[15px] leading-[1.7] text-[#475569]">
                We&apos;re a small team and reply directly. If your message lands on a weekend or public holiday, expect a reply on the next business day.
              </p>
            </div>
            <div className="lg:col-span-7">
              <dl className="divide-y divide-[#E2E8F0] rounded-xl border border-[#E2E8F0] bg-white">
                {[
                  { k: "Response time", v: "Under 1 business day · Mon–Fri" },
                  { k: "Languages", v: "English (primary), Spanish, German, Russian" },
                  { k: "Office hours", v: "9:00 — 18:00 GMT+5 (Tashkent)" },
                  { k: "Bug bounty", v: "Coordinated disclosure — email security@launch-cv.com" },
                  { k: "Mailing address", v: "Elmun Technologies LLC · Tashkent, Uzbekistan" },
                ].map((row) => (
                  <div key={row.k} className="flex items-start justify-between gap-6 px-6 py-4">
                    <dt className="text-[13px] font-semibold text-[#475569]">{row.k}</dt>
                    <dd className="text-right text-[14px] text-[#0F172A]">{row.v}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* SUPPORT-FIRST POINTERS */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-16">
        <div className="mx-auto max-w-[1100px] px-6">
          <p className="lc-overline text-[#1A56DB]">Self-serve first</p>
          <h2 className="mt-3 lc-section-headline text-[#0F172A]">
            Many answers are on these pages
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              { href: "/pricing", t: "Pricing & billing", d: "Plan limits, refunds, Lemon Squeezy details." },
              { href: "/features", t: "Feature overview", d: "What each AI tool does and when to use it." },
              { href: "/legal/privacy", t: "Privacy & data", d: "What we store, how long, and your rights." },
            ].map((r) => (
              <Link
                key={r.href}
                href={r.href}
                className="group rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1]"
              >
                <p className="text-[15px] font-semibold text-[#0F172A]">{r.t}</p>
                <p className="mt-1 text-[13px] text-[#64748B]">{r.d}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#1A56DB]">
                  Open
                  <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
