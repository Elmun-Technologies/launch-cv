import Image from "next/image";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

const EMAIL = "support@launch-cv.com";

export const metadata = buildMarketingMetadata({
  title: "Contact LaunchCV — Support, Billing and Partnerships",
  description: "Questions about your account, billing, refunds, partnerships or security? Email the LaunchCV team.",
  pathname: "/contact",
  image: DEFAULT_OG_IMAGE,
  keywords: ["LaunchCV contact", "LaunchCV support", "LaunchCV billing", "LaunchCV refund"],
});

const ld = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact LaunchCV",
  url: absoluteUrl("/contact"),
  mainEntity: {
    "@type": "Organization",
    name: "LaunchCV",
    legalName: "Elmun Technologies LLC",
    email: EMAIL,
    address: { "@type": "PostalAddress", addressLocality: "Tashkent", addressCountry: "UZ" },
  },
};

const topics = [
  { t: "Account and product", d: "Sign-in, the editor, PDF export, AI tools.", subject: "Support" },
  { t: "Billing and refunds", d: "Plan changes, invoices, the 7-day refund on monthly plans.", subject: "Billing" },
  { t: "Partnerships and press", d: "Career services, universities, journalists.", subject: "Partnership" },
  { t: "Security", d: "Report a vulnerability. Please don't include real user data.", subject: "Security" },
];

export default function ContactPage() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={ld} />
      <LandingNav />

      <main className="flex-1">
        <section className="mx-auto flex max-w-[1200px] flex-col gap-10 px-5 pt-[120px] sm:px-8 lg:flex-row lg:items-center lg:gap-14">
          <div className="flex-1">
            <h1 className="text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[56px]">
              Get in touch. <span className="text-[#6E6E6A]">A person reads every email.</span>
            </h1>
            <p className="mt-5 max-w-[520px] text-[17px] leading-[1.6] text-[#3F3F3F]">
              Write to{" "}
              <a href={`mailto:${EMAIL}`} className="text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
                {EMAIL}
              </a>{" "}
              and put the topic in the subject so it reaches the right person.
            </p>
            <a
              href={`mailto:${EMAIL}`}
              className="mt-6 inline-flex h-12 items-center rounded-full bg-[#111111] px-6 text-[15px] font-medium text-white hover:bg-black"
            >
              Email us
            </a>
          </div>
          <div className="relative h-[280px] overflow-hidden rounded-[20px] sm:h-[380px] lg:w-[44%] lg:shrink-0">
            <Image
              src="/images/photos/role-customer-service.webp"
              alt="Support team members wearing headsets"
              fill
              priority
              sizes="(min-width: 1024px) 520px, 100vw"
              className="object-cover"
            />
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-8">
          <div className="grid gap-x-10 sm:grid-cols-2">
            {topics.map((x) => (
              <a
                key={x.t}
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(x.subject)}`}
                className="group border-t border-[#EEEEEB] py-5"
              >
                <p className="text-[17px] font-semibold group-hover:text-[#1D4ED8]">{x.t}</p>
                <p className="mt-1 text-[15px] leading-[1.55] text-[#3F3F3F]">{x.d}</p>
                <p className="mt-1.5 text-[13px] text-[#6B6B6B]">Subject: {x.subject}</p>
              </a>
            ))}
          </div>
        </section>

        <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8">
          <div className="flex flex-col gap-6 rounded-[20px] bg-[#F5F5F3] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
            <div>
              <p className="text-[17px] font-semibold">Elmun Technologies LLC</p>
              <p className="mt-1 text-[15px] text-[#3F3F3F]">Tashkent, Uzbekistan</p>
            </div>
            <p className="text-[15px] text-[#3F3F3F]">
              Billing questions? See{" "}
              <Link href="/pricing" className="text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
                plans and refunds
              </Link>{" "}
              or the{" "}
              <Link href="/legal/terms" className="text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
                terms
              </Link>
              .
            </p>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
