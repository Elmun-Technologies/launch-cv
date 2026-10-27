import Link from "next/link";
import { Logo } from "@/components/logo";

const productLinks = [
  { label: "Free ATS Check", href: "/free-ats-check" },
  { label: "JD Alignment", href: "/features/jd-alignment" },
  { label: "Resume Builder", href: "/features/resume-builder" },
  { label: "Cover Letter", href: "/features/cover-letter" },
  { label: "Interview Prep", href: "/features/interview-prep" },
  { label: "Voice Input", href: "/features/voice-input" },
  { label: "Pricing", href: "/pricing" },
];

const companyLinks = [
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const resourceLinks = [
  { label: "Resume Templates", href: "/resume-templates" },
  { label: "Resume Examples", href: "/resume-examples" },
  { label: "Cover Letter Examples", href: "/cover-letter-examples" },
  { label: "Software engineer resume", href: "/resume-examples/software-engineer" },
  { label: "Product manager resume", href: "/resume-examples/product-manager" },
  { label: "UX designer resume", href: "/resume-examples/ux-designer" },
  { label: "Best ATS Checkers", href: "/compare/ats-resume-checkers" },
  { label: "Blog", href: "/blog" },
  { label: "Privacy Policy", href: "/legal/privacy" },
  { label: "Terms of Service", href: "/legal/terms" },
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
          <div className="flex items-center gap-5">
            <Link href="/legal/privacy" className="text-[13px] text-[#6B6B6B] transition hover:text-[#0F172A]">
              Privacy
            </Link>
            <Link href="/legal/terms" className="text-[13px] text-[#6B6B6B] transition hover:text-[#0F172A]">
              Terms
            </Link>
            <Link href="/contact" className="text-[13px] text-[#6B6B6B] transition hover:text-[#0F172A]">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
