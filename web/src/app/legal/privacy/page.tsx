import Link from "next/link";
import type { Metadata } from "next";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { ArrowLeft, Mail, Shield } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Privacy Policy",
  description:
    "How Launch CV collects, stores, and protects your data. Session cookies, AI processing, export and deletion rights.",
  pathname: "/legal/privacy",
  keywords: ["Launch CV privacy policy", "GDPR", "CCPA", "data protection"],
});

const ld = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Privacy Policy | Launch CV",
  url: absoluteUrl("/legal/privacy"),
};

const sections = [
  {
    h: "Session cookies",
    body: (
      <p>
        We use a single HTTP-only session cookie to keep you signed in. It is not used for tracking, advertising,
        or third-party analytics. The cookie expires when your session ends.
      </p>
    ),
  },
  {
    h: "What we store",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Email and (optional) display name.</li>
        <li>Password hash (bcrypt, never the plain password).</li>
        <li>Resume content as structured JSON.</li>
        <li>Job description analysis history and snapshots.</li>
        <li>Internal product analytics: event names and timestamps. No PII inside event payloads.</li>
      </ul>
    ),
  },
  {
    h: "Third-party processing",
    body: (
      <p>
        Resume and job description fragments are sent to the OpenAI API to generate bullet rewrites, ATS
        analyses, cover letters, and interview drills. Audio captured for Voice Input is streamed for
        transcription and discarded immediately after — no audio file is persisted.
      </p>
    ),
  },
  {
    h: "Payments",
    body: (
      <p>
        Subscriptions and one-time purchases are processed by Lemon Squeezy. We do not store credit-card
        details. Lemon Squeezy holds the payment record; you can manage billing in their customer portal.
      </p>
    ),
  },
  {
    h: "Your rights",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Export your account data as JSON from the dashboard.</li>
        <li>Delete your account (and all associated data) with password confirmation.</li>
        <li>Request a manual erasure or export by emailing support — we respond within one business day.</li>
      </ul>
    ),
  },
  {
    h: "Compliance",
    body: (
      <p>
        Launch CV is built to align with GDPR (EU) and CCPA (California). This page is a plain-language
        overview; a full DPA is available on request for paid plans.
      </p>
    ),
  },
  {
    h: "Updates",
    body: (
      <p>
        Material changes to this policy will be announced via email and a banner inside the app. Last updated:{" "}
        <span className="font-semibold text-[#0F172A]">May 14, 2026</span>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      <section className="bg-[#FAFBFC] pt-[112px]">
        <div className="mx-auto max-w-[860px] px-6 pb-12">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#1A56DB] hover:underline">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </Link>
          <span className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
            <Shield className="h-3.5 w-3.5 text-[#1A56DB]" /> Legal
          </span>
          <h1 className="mt-4 lc-hero-headline text-[#0F172A]">Privacy Policy</h1>
          <p className="mt-4 max-w-[640px] text-[15px] leading-[1.7] text-[#475569]">
            How Launch CV collects, stores, and protects your data. This is a plain-language summary of our
            practices — for the full Data Processing Addendum, email{" "}
            <a href="mailto:security@launch-cv.com" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
              security@launch-cv.com
            </a>
            .
          </p>
        </div>
      </section>

      <section className="border-t border-[#E2E8F0] py-16">
        <div className="mx-auto max-w-[860px] px-6">
          <div className="space-y-10">
            {sections.map((s, i) => (
              <article key={s.h} className="border-l-2 border-[#E2E8F0] pl-6">
                <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                  Section {String(i + 1).padStart(2, "0")}
                </p>
                <h2 className="mt-2 text-[22px] font-semibold tracking-tight text-[#0F172A]">{s.h}</h2>
                <div className="mt-3 text-[15px] leading-[1.75] text-[#475569]">{s.body}</div>
              </article>
            ))}
          </div>

          <div className="mt-16 rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] p-6">
            <p className="text-[13px] font-semibold uppercase tracking-wider text-[#94A3B8]">Questions?</p>
            <p className="mt-2 text-[15px] text-[#0F172A]">
              Email{" "}
              <a href="mailto:security@launch-cv.com" className="inline-flex items-center gap-1 font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
                security@launch-cv.com
                <Mail className="h-3.5 w-3.5" />
              </a>{" "}
              and we&apos;ll respond within one business day.
            </p>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
