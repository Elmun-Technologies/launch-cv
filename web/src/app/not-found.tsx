import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";

const LINKS = [
  { href: "/free-ats-check", t: "Free ATS check", d: "Score your resume in about 10 seconds" },
  { href: "/resume-examples", t: "Resume examples", d: "Full samples for 8 common roles" },
  { href: "/pricing", t: "Pricing", d: "From $9/month, or $79 once" },
  { href: "/blog", t: "Guides", d: "ATS, tailoring, cover letters, interviews" },
];

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <LandingNav />
      <main className="mx-auto w-full max-w-[880px] flex-1 px-4 pb-24 pt-[128px] sm:px-6">
        <p className="text-[14px] text-[#6B6B6B]">Error 404</p>
        <h1 className="mt-3 text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] sm:text-[56px]">
          This page doesn&apos;t exist. <span className="text-[#8A8A86]">Your next interview might.</span>
        </h1>
        <p className="mt-4 max-w-[560px] text-[17px] leading-relaxed text-[#3F3F3F]">
          The link may be old or mistyped. If you came here to work on your resume, start with a free check.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link href="/free-ats-check" className="soha-btn-primary">
            Check my resume — free
          </Link>
          <Link href="/" className="soha-btn-secondary">
            Go to the homepage
          </Link>
        </div>
        <ul className="mt-14 grid gap-3 sm:grid-cols-2">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="group block rounded-[14px] border border-[#E5E5E2] p-5 hover:border-[#111111]">
                <span className="block text-[16px] font-semibold group-hover:text-[#1D4ED8]">{l.t}</span>
                <span className="mt-1 block text-[14px] text-[#6B6B6B]">{l.d}</span>
              </Link>
            </li>
          ))}
        </ul>
      </main>
      <LandingFooter />
    </div>
  );
}
