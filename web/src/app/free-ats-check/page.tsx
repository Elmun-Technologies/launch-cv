import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { FreeAtsClient } from "@/components/free-ats-client";
import { buildMarketingMetadata, FREE_ATS_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { BarChart3 } from "lucide-react";

export const metadata = buildMarketingMetadata({
  title: "Free ATS Score Checker — No Sign-Up",
  description:
    "Upload your resume and get a free 0–100 ATS score with a full parser breakdown in seconds. No account required. See exactly why your resume gets filtered.",
  pathname: "/free-ats-check",
  image: FREE_ATS_OG_IMAGE,
  keywords: [
    "free ATS score checker",
    "ATS resume test free",
    "check ATS score",
    "resume scanner free",
    "ATS checker no sign up",
  ],
});

const ld = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Free ATS Score Checker",
  applicationCategory: "BusinessApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
  url: absoluteUrl("/free-ats-check"),
  description: "Get a free ATS score and parser breakdown for your resume — no sign-up.",
};

export default function FreeAtsCheckPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={ld} />
      <LandingNav />

      <section className="relative overflow-hidden bg-white pt-[96px]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage:
              "radial-gradient(circle at 50% 0%, rgba(234,88,12,0.07), transparent 55%)",
          }}
        />
        <div className="relative mx-auto max-w-[900px] px-6 pb-20 pt-12 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
            <BarChart3 className="h-3.5 w-3.5 text-[#EA580C]" />
            Free · no sign-up
          </span>

          <h1 className="mx-auto mt-6 max-w-[700px] lc-hero-headline text-[#0F172A]">
            Check your ATS score free
          </h1>

          <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.65] text-[#475569]">
            Upload your resume and get a 0–100 ATS score with a full parser
            breakdown in seconds. See exactly where you&apos;re losing points —
            before a recruiter ever does.
          </p>

          <div className="mt-10">
            <FreeAtsClient />
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
