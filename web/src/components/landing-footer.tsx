import Link from "next/link";
import { Logo } from "@/components/logo";

const productLinks = [
  { label: "JD Alignment", href: "/features/jd-alignment" },
  { label: "Resume Builder", href: "/features/resume-builder" },
  { label: "Cover Letter", href: "/features/cover-letter" },
  { label: "Interview Prep", href: "/features/interview-prep" },
  { label: "ATS Score", href: "/features/ats-score" },
  { label: "Voice Input", href: "/features/voice-input" },
  { label: "Pricing", href: "/pricing" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Investors", href: "/investors" },
  { label: "Contact", href: "/contact" },
];

const resourceLinks = [
  { label: "For Designers", href: "/use-cases/designers" },
  { label: "For Engineers", href: "/use-cases/software-engineers" },
  { label: "For PMs", href: "/use-cases/product-managers" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-[#E2E8F0] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo variant="light" size="md" />
            <p className="mt-4 max-w-[280px] text-[14px] leading-[1.6] text-[#64748B]">
              AI-powered resume and job search platform. Built to help you get interviews — not just build a resume.
            </p>
            <div className="mt-5 flex items-center gap-2">
              {[
                {
                  label: "Twitter / X",
                  href: "https://twitter.com",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
                    </svg>
                  ),
                },
                {
                  label: "LinkedIn",
                  href: "https://linkedin.com",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  ),
                },
                {
                  label: "GitHub",
                  href: "https://github.com",
                  svg: (
                    <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
                    </svg>
                  ),
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  className="flex h-8 w-8 items-center justify-center rounded-md text-[#94A3B8] transition hover:bg-[#F1F5F9] hover:text-[#0F172A]"
                >
                  {s.svg}
                </a>
              ))}
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Product</h3>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-[#475569] transition hover:text-[#0F172A]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Company</h3>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-[#475569] transition hover:text-[#0F172A]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">Resources</h3>
            <ul className="mt-4 space-y-2.5">
              {resourceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-[#475569] transition hover:text-[#0F172A]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#E2E8F0] pt-6 sm:flex-row">
          <p className="text-[13px] text-[#94A3B8]">
            © {new Date().getFullYear()} Launch CV. All rights reserved.
          </p>
          <div className="flex items-center gap-5">
            <Link href="/legal/privacy" className="text-[13px] text-[#94A3B8] transition hover:text-[#0F172A]">
              Privacy
            </Link>
            <Link href="/legal/terms" className="text-[13px] text-[#94A3B8] transition hover:text-[#0F172A]">
              Terms
            </Link>
            <Link href="/contact" className="text-[13px] text-[#94A3B8] transition hover:text-[#0F172A]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
