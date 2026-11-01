import Link from "next/link";
import { SiteLogo } from "./brand";

const COLUMNS = [
  {
    title: "Tools",
    links: [
      { href: "/free-ats-check", label: "Free ATS check" },
      { href: "/features/resume-builder", label: "Resume builder" },
      { href: "/features/jd-alignment", label: "Job description match" },
      { href: "/features/cover-letter", label: "Cover letter writer" },
      { href: "/features/interview-prep", label: "Interview prep" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resume-templates", label: "Resume templates" },
      { href: "/resume-examples", label: "Resume examples" },
      { href: "/cover-letter-examples", label: "Cover letter examples" },
      { href: "/compare/ats-resume-checkers", label: "ATS checkers compared" },
      { href: "/blog", label: "Blog" },
    ],
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/pricing", label: "Pricing" },
      { href: "/contact", label: "Contact" },
      { href: "/legal/privacy", label: "Privacy" },
      { href: "/legal/terms", label: "Terms" },
    ],
  },
];

const YEAR = new Date().getFullYear();

export function SiteFooter() {
  return (
    <footer className="mx-auto flex max-w-[1280px] flex-col justify-between gap-10 px-4 pb-14 pt-16 sm:px-6 md:flex-row lg:px-10 lg:pt-20">
      <div className="max-w-[300px]">
        <SiteLogo size={32} />
        <p className="mt-3.5 text-[15px] leading-6 text-[#4a4862]">
          Resume tools that get you past the software and in front of the people who hire.
        </p>
        <p className="mt-5 text-[13px] text-[#66647c]">© {YEAR} Elmun Technologies LLC</p>
      </div>
      <div className="grid grid-cols-2 gap-x-10 gap-y-8 text-[15px] sm:grid-cols-3 lg:gap-x-16">
        {COLUMNS.map((c) => (
          <div key={c.title} className="flex flex-col gap-2.5">
            <p className="font-bold text-[#121226]">{c.title}</p>
            {c.links.map((l) => (
              <Link key={l.href} href={l.href} className="lc-link text-[#4a4862] transition-colors hover:text-[#5440e8]">
                {l.label}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </footer>
  );
}
