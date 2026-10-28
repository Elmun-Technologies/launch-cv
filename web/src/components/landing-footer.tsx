import Link from "next/link";
import { Logo } from "@/components/logo";

const productLinks = [
  { label: "Free ATS check", href: "/free-ats-check" },
  { label: "Resume builder", href: "/features/resume-builder" },
  { label: "Job matching", href: "/features/jd-alignment" },
  { label: "Cover letters", href: "/features/cover-letter" },
  { label: "Interview prep", href: "/features/interview-prep" },
  { label: "Voice input", href: "/features/voice-input" },
  { label: "Pricing", href: "/pricing" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy policy", href: "/legal/privacy" },
  { label: "Terms of service", href: "/legal/terms" },
];

const resourceLinks = [
  { label: "Resume templates", href: "/resume-templates" },
  { label: "Resume examples", href: "/resume-examples" },
  { label: "Cover letter examples", href: "/cover-letter-examples" },
  { label: "Best ATS checkers", href: "/compare/ats-resume-checkers" },
  { label: "Blog", href: "/blog" },
];

export function LandingFooter() {
  return (
    <footer className="border-t border-[#EEEEEB] bg-white">
      <div className="mx-auto max-w-[1200px] px-6 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Logo variant="light" size="md" />
            <p className="mt-4 max-w-[280px] text-[14px] leading-[1.6] text-[#6B6B6B]">
              Resume tools that help you get past the software and in front of the people who hire.
            </p>
          </div>

          {/* Product */}
          <div>
            <h2 className="text-[14px] font-semibold text-[#111111]">Product</h2>
            <ul className="mt-4 space-y-2.5">
              {productLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-[#3F3F3F] transition hover:text-[#111111]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h2 className="text-[14px] font-semibold text-[#111111]">Company</h2>
            <ul className="mt-4 space-y-2.5">
              {companyLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-[#3F3F3F] transition hover:text-[#111111]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h2 className="text-[14px] font-semibold text-[#111111]">Resources</h2>
            <ul className="mt-4 space-y-2.5">
              {resourceLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-[#3F3F3F] transition hover:text-[#111111]">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-[#EEEEEB] pt-6 sm:flex-row">
          <p className="text-[13px] text-[#6B6B6B]">
            © {new Date().getFullYear()} LaunchCV. All rights reserved.
          </p>
          <a href="mailto:support@launch-cv.com" className="text-[13px] text-[#6B6B6B] transition hover:text-[#111111]">
            support@launch-cv.com
          </a>
        </div>
      </div>
    </footer>
  );
}
