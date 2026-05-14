import Link from "next/link";
import type { Metadata } from "next";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { ArrowLeft, Scale, Mail } from "lucide-react";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Terms of Service",
  description:
    "Launch CV terms of service: service availability, AI-content responsibility, account security, prohibited use, and changes to the service.",
  pathname: "/legal/terms",
  keywords: ["Launch CV terms", "terms of service", "user agreement"],
});

const ld = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Terms of Service | Launch CV",
  url: absoluteUrl("/legal/terms"),
};

const sections = [
  {
    h: "The service",
    body: (
      <p>
        Launch CV is provided &ldquo;as is.&rdquo; We make our best effort to keep it available 24/7 but do not
        guarantee uninterrupted uptime. Scheduled maintenance and incidents are posted in-app when relevant.
      </p>
    ),
  },
  {
    h: "AI-generated content",
    body: (
      <p>
        AI suggestions may be inaccurate, incomplete, or out of date. You are responsible for the final text,
        metrics, and claims in your resume, cover letter, or interview answers. Review and edit before sending.
      </p>
    ),
  },
  {
    h: "Account security",
    body: (
      <p>
        Keeping your account credentials secure is your responsibility. Use a strong, unique password and enable
        any future security features (MFA, hardware key) as soon as they ship.
      </p>
    ),
  },
  {
    h: "Acceptable use",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>No spam, harassment, or illegal content.</li>
        <li>No content that violates third-party intellectual property or privacy.</li>
        <li>No automated scraping or attempts to bypass plan limits.</li>
        <li>No use of Launch CV to misrepresent your identity or credentials.</li>
      </ul>
    ),
  },
  {
    h: "Subscriptions, refunds, cancellations",
    body: (
      <p>
        Subscriptions are processed by Lemon Squeezy. You can cancel anytime — access continues until the end of
        the paid period. We honor a 7-day money-back guarantee on subscription plans where Lemon Squeezy policy
        allows. Lifetime is a one-time purchase and is non-refundable after 14 days.
      </p>
    ),
  },
  {
    h: "Logs and analytics",
    body: (
      <p>
        We collect technical logs and product analytics (event names, timestamps) to improve the service. No
        personally identifiable data is included in event payloads. See the{" "}
        <Link href="/legal/privacy" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
          Privacy Policy
        </Link>{" "}
        for details.
      </p>
    ),
  },
  {
    h: "Changes to the service or terms",
    body: (
      <p>
        We may add, modify, or remove features and update these terms. Material changes are announced via email
        and an in-app banner with a 30-day notice where reasonably possible.
      </p>
    ),
  },
  {
    h: "Liability",
    body: (
      <p>
        To the extent permitted by law, Launch CV and Elmun Technologies are not liable for indirect, incidental,
        or consequential damages — including missed job opportunities or hiring outcomes.
      </p>
    ),
  },
];

export default function TermsPage() {
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
            <Scale className="h-3.5 w-3.5 text-[#1A56DB]" /> Legal
          </span>
          <h1 className="mt-4 lc-hero-headline text-[#0F172A]">Terms of Service</h1>
          <p className="mt-4 max-w-[640px] text-[15px] leading-[1.7] text-[#475569]">
            By using Launch CV you agree to the terms below. Last updated:{" "}
            <span className="font-semibold text-[#0F172A]">May 14, 2026</span>.
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
              <a href="mailto:hello@launch-cv.com" className="inline-flex items-center gap-1 font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
                hello@launch-cv.com
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
