import Link from "next/link";
import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Terms of Service",
  description:
    "LaunchCV terms of service: service availability, AI-content responsibility, account security, prohibited use, and changes to the service.",
  pathname: "/legal/terms",
  image: DEFAULT_OG_IMAGE,
  keywords: ["LaunchCV terms", "terms of service", "user agreement"],
});

const sections: LegalSection[] = [
  {
    h: "The service",
    body: (
      <p>
        LaunchCV is operated by Elmun Technologies and provided &ldquo;as is&rdquo;. We work to keep it available
        around the clock but can&apos;t guarantee uninterrupted uptime.
      </p>
    ),
  },
  {
    h: "AI-generated content",
    body: (
      <p>
        AI suggestions can be inaccurate or incomplete. You are responsible for the final text, numbers and claims in
        your resume, cover letters and interview answers — review them before you send anything.
      </p>
    ),
  },
  {
    h: "Your account",
    body: (
      <p>
        Keep your sign-in details secure and use a password you don&apos;t use elsewhere. You can download or delete
        your data at any time from Settings.
      </p>
    ),
  },
  {
    h: "Acceptable use",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>No spam, harassment or illegal content.</li>
        <li>No content that infringes someone else&apos;s intellectual property or privacy.</li>
        <li>No automated scraping or attempts to get around plan limits.</li>
        <li>No using LaunchCV to misrepresent your identity or credentials.</li>
      </ul>
    ),
  },
  {
    h: "Plans, refunds and cancellation",
    body: (
      <>
        <p>
          Payments are processed by Polar. Starter and Professional renew monthly until you cancel; you can cancel at
          any time from the billing portal and keep access until the end of the period you paid for. Lifetime is a
          single payment that never renews. Prices are in US dollars, plus any sales tax or VAT your country requires.
        </p>
        <p className="mt-3">
          Monthly plans come with a 7-day money-back guarantee, and Lifetime can be refunded within 14 days of purchase.
          Email{" "}
          <a href="mailto:support@launch-cv.com" className="text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
            support@launch-cv.com
          </a>{" "}
          from your account email to request one.
        </p>
      </>
    ),
  },
  {
    h: "Fair use",
    body: (
      <p>
        Each plan includes monthly limits on AI tools, shown on the pricing page and in your dashboard. Limits reset at
        the start of each calendar month.
      </p>
    ),
  },
  {
    h: "Privacy",
    body: (
      <p>
        How we handle your data, including analytics and the providers we use, is described in the{" "}
        <Link href="/legal/privacy" className="text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
          Privacy Policy
        </Link>
        .
      </p>
    ),
  },
  {
    h: "Changes",
    body: (
      <p>
        We may add, change or remove features and update these terms. For material changes we&apos;ll email
        signed-in users, with 30 days&apos; notice where reasonably possible.
      </p>
    ),
  },
  {
    h: "Liability",
    body: (
      <p>
        To the extent the law allows, LaunchCV and Elmun Technologies are not liable for indirect, incidental or
        consequential damages, including missed job opportunities or hiring outcomes.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of Service"
      updated="October 27, 2026"
      pathname="/legal/terms"
      intro="The rules for using LaunchCV, including how plans, refunds and cancellations work."
      sections={sections}
    />
  );
}
