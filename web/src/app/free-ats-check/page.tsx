import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { FreeAtsClient } from "@/components/free-ats-client";
import { buildMarketingMetadata, FREE_ATS_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import Image from "next/image";

export const metadata = buildMarketingMetadata({
  title: "Free ATS Resume Checker — Score in 10 Seconds",
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

const checks = [
  { t: "Formatting", d: "Tables, columns, text boxes and headers that hide information from the parser." },
  { t: "Keywords", d: "Skills and job titles that job posts for your kind of role ask for." },
  { t: "Structure", d: "Standard section names, consistent dates and a sensible length." },
  { t: "Readability", d: "Bullets that show results instead of a list of duties." },
];

export default function FreeAtsCheckPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={ld} />
      <LandingNav />

      <section className="mx-auto w-full max-w-[1200px] px-6 pt-[112px] text-center sm:pt-[136px]">
        <h1 className="mx-auto max-w-[820px] text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[56px]">
          Free ATS resume checker. <span className="text-[#8A8A86]">Your score in about 10 seconds.</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[560px] text-[17px] leading-[1.6] text-[#3F3F3F]">
          Upload your resume to see how applicant tracking systems read it, what lowers your score and how to fix
          each issue. No account needed.
        </p>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-6 pt-10">
        <FreeAtsClient />
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-6 pt-24">
        <div className="flex flex-col overflow-hidden rounded-[20px] bg-[#F5F5F3] lg:flex-row lg:items-center">
          <Image
            src="/images/photos/recruiter-desk.webp"
            alt="Recruiter reviewing applications at a desk"
            width={1200}
            height={900}
            sizes="(min-width: 1024px) 540px, 100vw"
            className="h-[260px] w-full object-cover lg:h-[380px] lg:w-[46%]"
          />
          <div className="flex flex-col gap-3.5 p-8 lg:p-12">
            <h2 className="text-[28px] font-semibold leading-[1.12] tracking-[-0.03em] sm:text-[36px]">
              A recruiter will spend seconds on your resume.{" "}
              <span className="text-[#8A8A86]">If the software lets it through.</span>
            </h2>
            <p className="text-[16px] leading-[1.6] text-[#3F3F3F]">
              Most applications are parsed and ranked before a person opens them. This check shows you what that first
              pass sees, so the human pass actually happens.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1200px] px-6 pb-24 pt-20">
        <h2 className="text-[24px] font-semibold tracking-[-0.02em]">What the check looks at</h2>
        <div className="mt-6 grid gap-8 border-t border-[#EEEEEB] pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {checks.map((c) => (
            <div key={c.t}>
              <p className="text-[17px] font-semibold">{c.t}</p>
              <p className="mt-1.5 text-[15px] leading-[1.6] text-[#3F3F3F]">{c.d}</p>
            </div>
          ))}
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
