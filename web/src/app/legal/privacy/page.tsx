import type { Metadata } from "next";
import { LegalPage, type LegalSection } from "@/components/marketing/legal-page";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { CookieChoiceButton } from "@/components/cookie-choice-button";

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
        <p className="mt-3">
          We also count page visits ourselves, on our own servers, without cookies. For each visit we record the page,
          the referring site and campaign tags, your country and region (from the network, not GPS), and your device,
          browser, operating system and language. We never store your IP address: it is combined with your browser&apos;s
          user-agent and a random salt that is replaced every day, then irreversibly hashed, so we can count unique
          visitors for a day but can&apos;t recognise you the next day or identify you. A random session id lives in your
          tab&apos;s session storage and a &ldquo;visited before&rdquo; flag in local storage; neither identifies you. If you are
          signed in, visits are linked to your account ID. If your browser sends Do Not Track or Global Privacy Control,
          we don&apos;t record anything. Visit records are deleted after 13 months.
        </p>
        <p className="mt-3">
          Advertising and session-recording tags load only if you press <span className="font-semibold text-[#121226]">Accept</span>{" "}
          in the cookie notice, and only the ones we have switched on. They can be Google Tag Manager, the Meta (Facebook) Pixel,
          the TikTok Pixel, Microsoft Clarity (heatmaps and recordings of how our pages are scrolled and clicked), the
          LinkedIn Insight Tag and the Reddit Pixel. They set their own cookies and tell those companies that a browser visited
          our pages, so we can measure our ads. They never load inside the app (your resumes, job tracker and settings) or if
          you press Decline. <CookieChoiceButton />.
        </p>
      </>
    ),
  },
  {
    h: "What we store",
    body: (
      <ul className="list-disc space-y-2 pl-5 marker:text-[#5440e8]">
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
      <ul className="list-disc space-y-2 pl-5 marker:text-[#5440e8]">
        <li>
          <span className="font-semibold text-[#121226]">OpenAI and Anthropic</span>{" "}— resume and job-description text you
          send to an AI tool, to generate rewrites, analyses, cover letters and interview questions. Each request goes to one
          of them, depending on the model set for that tool.
        </li>
        <li>
          <span className="font-semibold text-[#121226]">Polar</span>{" "}— checkout and billing. We never see or store card
          details.
        </li>
        <li>
          <span className="font-semibold text-[#121226]">Google Analytics, PostHog, Mixpanel</span>{" "}— usage analytics, as
          described above.
        </li>
        <li>
          <span className="font-semibold text-[#121226]">If enabled, and only after you accept: Google Tag Manager, Meta Pixel, TikTok Pixel, Microsoft Clarity, LinkedIn Insight Tag, Reddit Pixel</span>
          {" "}— ad measurement and, for Clarity, heatmaps and session recordings, as described above.
        </li>
        <li>
          <span className="font-semibold text-[#121226]">Google</span>{" "}— only if you choose &ldquo;Continue with
          Google&rdquo;.
        </li>
      </ul>
    ),
  },
  {
    h: "Emails we send",
    body: (
      <p>
        We email you about your account, such as confirming your address or resetting your password. If you started a
        checkout or used up your free checks, we may send one email with a discount code, with an unsubscribe link in it.
      </p>
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
      <ul className="list-disc space-y-2 pl-5 marker:text-[#5440e8]">
        <li>Download all your data as JSON from Settings → Your data.</li>
        <li>
          Delete your account and everything in it from Settings → Your data. Cancel an active subscription in the
          billing portal first.
        </li>
        <li>
          Ask us to correct, export or erase your data by emailing{" "}
          <a href="mailto:support@launch-cv.com" className="text-[#5440e8] underline decoration-[#5440e8]/40 underline-offset-2 hover:decoration-[#5440e8]">
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
        <span className="font-semibold text-[#121226]">November 8, 2026</span>.
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
