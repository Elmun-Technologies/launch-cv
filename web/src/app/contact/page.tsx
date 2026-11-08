import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { btnDark, labelCls } from "@/components/site/ui";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";

const EMAIL = "support@launch-cv.com";

export const metadata = buildMarketingMetadata({
  title: "Contact LaunchCV — Support, Billing, Partnerships",
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
    "@id": absoluteUrl("/#organization"),
    name: "LaunchCV",
    legalName: "Elmun Technologies LLC",
    email: EMAIL,
  },
};

const topics = [
  { t: "Account and product", d: "Sign-in, the editor, PDF export, AI tools.", subject: "Support" },
  { t: "Billing and refunds", d: "Plan changes, invoices, the 7-day refund on monthly plans.", subject: "Billing" },
  { t: "Partnerships and press", d: "Career services, universities, journalists.", subject: "Partnership" },
  { t: "Security", d: "Report a vulnerability. Please don't include real user data.", subject: "Security" },
];

const companyLinks = [
  { href: "/pricing", label: "Plans and refunds" },
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
];

export default function ContactPage() {
  return (
    <SiteShell>
      <JsonLd data={ld} />

      {/* HERO */}
      <section className="mx-auto grid max-w-[1360px] items-stretch gap-6 px-4 pt-4 sm:px-6 lg:grid-cols-2 lg:px-10 lg:pt-8">
        <div className="flex flex-col justify-center lg:pr-6">
          <p className={labelCls}>/ Contact</p>
          <h1 className="mt-3.5 text-[38px] font-extrabold leading-[1.08] tracking-[-0.045em] sm:mt-5 sm:text-[56px] sm:leading-[1.04] lg:text-[64px] lg:leading-[66px]">
            Get in touch. <span className="text-[#7c7a94]">A person reads every email.</span>
          </h1>
          <p className="mt-4 max-w-[560px] text-[17px] leading-7 text-[#4a4862] sm:mt-5 sm:text-[18px]">
            Write to{" "}
            <a href={`mailto:${EMAIL}`} className="lc-link font-bold text-[#5440e8] [overflow-wrap:anywhere]">
              {EMAIL}
            </a>{" "}
            and put the topic in the subject so it reaches the right person.
          </p>
          <a href={`mailto:${EMAIL}`} className={`${btnDark} mt-[18px] w-full sm:mt-7 sm:w-auto sm:self-start`}>
            Email us
          </a>
        </div>

        <div className="relative hidden h-[440px] overflow-hidden rounded-[28px] bg-[#c9c0ff] sm:block lg:h-[520px] lg:rounded-[36px]">
          <p aria-hidden="true" className="lc-poster absolute left-8 top-6 m-0 text-[96px] leading-[96px] text-[#b8adff] lg:text-[120px] lg:leading-[110px]">
            HELLO
          </p>
          <div aria-hidden="true" className="absolute bottom-[-180px] left-1/2 h-[460px] w-[460px] -translate-x-1/2 rounded-full bg-[#5440e8]" />
          {/* An email to support, drafted: what the "put the topic in the subject" advice looks like. */}
          <div aria-hidden="true" className="absolute bottom-0 left-1/2 w-[340px] -translate-x-1/2 rounded-t-3xl bg-white px-5 pb-8 pt-5 text-[14px] text-[#121226] shadow-[0_24px_48px_-20px_rgba(10,6,60,.45)] lg:w-[400px] lg:px-6">
            <p className="text-[12px] font-bold tracking-[0.06em] text-[#66647c]">NEW EMAIL</p>
            <p className="mt-3 border-b border-[#e2e0ea] pb-2">
              <span className="text-[#66647c]">To</span> <span className="font-semibold">{EMAIL}</span>
            </p>
            <p className="mt-2 border-b border-[#e2e0ea] pb-2">
              <span className="text-[#66647c]">Subject</span> <span className="font-semibold">Refund · monthly plan</span>
            </p>
            <div className="mt-3 flex flex-col gap-2">
              <span className="h-2 w-[92%] rounded-full bg-[#efedf7]" />
              <span className="h-2 w-[78%] rounded-full bg-[#efedf7]" />
              <span className="h-2 w-[55%] rounded-full bg-[#efedf7]" />
            </div>
          </div>
          <div aria-hidden="true">
            <span className="lc-float lc-drift absolute left-8 top-[140px] z-10 max-w-[220px] rounded-[22px_22px_22px_6px] bg-white px-4 py-3 text-[15px] font-medium lg:top-[150px]">
              Can I get a refund on a monthly plan?
            </span>
            <span className="lc-float lc-drift-2 absolute right-8 top-[200px] z-10 max-w-[220px] rounded-[22px_22px_6px_22px] bg-[#111118] px-4 py-3 text-[15px] font-medium text-white lg:top-[220px]">
              Yes — within 7 days. Here&apos;s how.
            </span>
          </div>
        </div>
      </section>

      {/* TOPICS */}
      <section className="mx-auto max-w-[1360px] px-4 pt-7 sm:px-6 sm:pt-20 lg:px-10 lg:pt-[110px]">
        <div className="hidden max-w-[980px] sm:block">
          <p className={labelCls}>/ Topics</p>
          <h2 className="lc-h2 mt-5">
            Pick a subject. <span>It gets you to the right person faster.</span>
          </h2>
        </div>
        <h2 className="sr-only sm:hidden">Topics</h2>
        <ul className="grid gap-2 sm:mt-10 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {topics.map((x) => (
            <li key={x.t}>
              <a
                href={`mailto:${EMAIL}?subject=${encodeURIComponent(x.subject)}`}
                className="lc-card lc-rise group flex h-full flex-col rounded-[24px] p-[18px] text-[#121226] sm:p-7"
              >
                <span className="text-[17px] font-extrabold transition-colors group-hover:text-[#5440e8] sm:text-[22px]">{x.t}</span>
                <span className="mt-1 text-[14px] leading-[21px] text-[#4a4862] sm:mb-[22px] sm:mt-2 sm:text-[15px] sm:leading-[23px]">{x.d}</span>
                <span className="lc-mono mt-2.5 self-start rounded-full text-[11px] text-[#3a2bb8] sm:mt-auto sm:bg-[#f1eff8] sm:px-3 sm:py-[7px] sm:text-[12px]">
                  Subject: {x.subject}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </section>

      {/* COMPANY */}
      <section className="mx-auto max-w-[1360px] px-4 pt-2 sm:px-6 sm:pt-6 lg:px-10">
        <div className="flex flex-col gap-5 rounded-[24px] bg-white p-6 sm:rounded-[28px] sm:px-11 sm:py-9 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-[13px] font-bold tracking-[0.08em] text-[#66647c]">COMPANY</p>
            <p className="mt-2 text-[20px] font-extrabold sm:text-[22px]">Elmun Technologies LLC</p>
            <p className="mt-0.5 text-[15px] text-[#4a4862]">{EMAIL}</p>
          </div>
          <ul className="flex flex-wrap gap-x-6 text-[15px] font-semibold">
            {companyLinks.map((l) => (
              <li key={l.href}>
                <Link href={l.href} className="inline-flex min-h-[44px] items-center text-[#5440e8] hover:text-[#4430d6]">
                  <span className="lc-link">{l.label} →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </SiteShell>
  );
}
