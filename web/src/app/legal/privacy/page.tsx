import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Privacy Policy",
  description:
    "How LaunchCV collects, stores and protects your data: cookies and analytics, AI processing, payments, and your export and deletion rights.",
  pathname: "/legal/privacy",
  image: DEFAULT_OG_IMAGE,
  keywords: ["LaunchCV privacy policy", "GDPR", "CCPA", "data protection"],
});

const sections: LegalSection[] = [
  {
    h: "Cookies and analytics",
    body: (
      <>
        <p>
          We use one HTTP-only session cookie to keep you signed in. It is never used for advertising.
        </p>
        <p className="mt-3">
          To understand how the site is used, we run analytics tools — Google Analytics, PostHog and Mixpanel —
          which set their own cookies or local storage. After you sign in, events are linked to your account ID,
          not your name or email. Inside the app (your resumes, job tracker and settings) we record page views
          and named events such as &ldquo;resume created&rdquo;, never what you type. You can block these tools with your
          browser&apos;s privacy settings or a content blocker; the product keeps working.
        </p>
      </>
    ),
  },
  {
    h: "What we store",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Your email and, if you add it, your name.</li>
        <li>A password hash (bcrypt), never the password itself. Google sign-in stores your Google account ID.</li>
        <li>Your resumes, job applications, contacts, companies and email templates.</li>
        <li>Job-description analyses, saved resume versions and monthly AI usage counts.</li>
        <li>Your plan status from our payment provider.</li>
      </ul>
    ),
  },
  {
    h: "Who processes your data",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>
          <span className="font-medium text-[#111111]">OpenAI</span> — resume and job-description text you send to an
          AI tool, to generate rewrites, analyses, cover letters and interview questions.
        </li>
        <li>
          <span className="font-medium text-[#111111]">Polar</span> — checkout and billing. We never see or store card
          details.
        </li>
        <li>
          <span className="font-medium text-[#111111]">Google Analytics, PostHog, Mixpanel</span> — usage analytics, as
          described above.
        </li>
        <li>
          <span className="font-medium text-[#111111]">Google</span> — only if you choose &ldquo;Continue with
          Google&rdquo;.
        </li>
      </ul>
    ),
  },
  {
    h: "Voice input",
    body: (
      <p>
        Voice input uses your browser&apos;s built-in speech recognition. LaunchCV receives the text, not the audio,
        and stores no recordings. Your browser vendor may process the audio under its own policy.
      </p>
    ),
  },
  {
    h: "Your rights",
    body: (
      <ul className="list-disc space-y-2 pl-5">
        <li>Download all your data as JSON from Settings → Your data.</li>
        <li>
          Delete your account and everything in it from Settings → Your data. Cancel an active subscription in the
          billing portal first.
        </li>
        <li>
          Ask us to correct, export or erase your data by emailing{" "}
          <a href="mailto:support@launch-cv.com" className="text-[#1D4ED8] underline-offset-2 underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
            support@launch-cv.com
          </a>
          .
        </li>
      </ul>
    ),
  },
  {
    h: "Updates",
    body: (
      <p>
        If we change this policy in a material way, we&apos;ll tell signed-in users by email. Last updated:{" "}
        <span className="font-medium text-[#111111]">October 27, 2026</span>.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy Policy"
      updated="October 27, 2026"
      pathname="/legal/privacy"
      intro="What LaunchCV stores, who processes it, and how to download or delete it. Plain language, no surprises."
      sections={sections}
    />
  );
}
