import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <LandingNav />

      <main className="flex flex-1 items-center justify-center px-6 pt-[96px]">
        <div className="mx-auto max-w-[640px] py-20 text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-white px-3 py-1.5 text-[12px] font-semibold text-[#475569]">
            <Search className="h-3.5 w-3.5 text-[#1A56DB]" />
            Error 404
          </span>

          <h1 className="mt-6 text-[64px] font-bold leading-none tracking-tight text-[#0F172A] sm:text-[88px]">
            404
          </h1>
          <p className="mt-4 text-[24px] font-semibold tracking-tight text-[#0F172A]">
            We couldn&apos;t find that page
          </p>
          <p className="mx-auto mt-3 max-w-[440px] text-[15px] leading-[1.65] text-[#475569]">
            The link may be broken, the page may have been moved, or it never existed. Try one of the links below.
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
            >
              Back to home
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/features"
              className="inline-flex items-center gap-2 rounded-lg border border-[#E2E8F0] bg-white px-6 py-3 text-[14px] font-semibold text-[#0F172A] transition hover:bg-[#F8FAFC]"
            >
              Browse features
            </Link>
          </div>

          <div className="mt-10 grid gap-3 text-left sm:grid-cols-3">
            {[
              { href: "/pricing", t: "Pricing" },
              { href: "/blog", t: "Blog" },
              { href: "/contact", t: "Contact" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-[13px] font-semibold text-[#475569] transition hover:border-[#CBD5E1] hover:text-[#0F172A]"
              >
                → {l.t}
              </Link>
            ))}
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
