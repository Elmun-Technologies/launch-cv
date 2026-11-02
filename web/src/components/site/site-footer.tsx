import Link from "next/link";
import { SiteLogo } from "./brand";
import { getPageCopy } from "@/lib/cms/page-copy";

const COLUMNS = [
  {
    title: "Tools",
    links: [
      { href: "/free-ats-check", label: "Free ATS check" },
      { href: "/features/resume-builder", label: "Resume builder" },
      { href: "/features/jd-alignment", label: "Job description match" },
      { href: "/features/cover-letter", label: "Cover letter writer" },
      { href: "/features/interview-prep", label: "Interview prep" },
      { href: "/tools", label: "Free writing tools" },
      { href: "/tools/resignation-letter-generator", label: "Resignation letter generator" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resume-templates", label: "Resume templates" },
      { href: "/resume-examples", label: "Resume examples" },
      { href: "/cover-letter-examples", label: "Cover letter examples" },
      { href: "/cover-letter-template", label: "Cover letter template" },
      { href: "/how-to-write-a-resume", label: "How to write a resume" },
      { href: "/resume-format", label: "Resume format guide" },
      { href: "/resume-action-verbs", label: "Resume action verbs" },
      { href: "/resume-keywords", label: "Resume keywords by role" },
      { href: "/ats", label: "ATS guides (Workday, Greenhouse…)" },
      { href: "/compare/ats-resume-checkers", label: "ATS checkers compared" },
      { href: "/alternatives/jobscan", label: "Jobscan alternative" },
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

/** Phones get a short footer: the most-used links in two columns and one legal line. */
const COMPACT = [
  {
    title: "Tools",
    links: [
      { href: "/free-ats-check", label: "Free ATS check" },
      { href: "/features/resume-builder", label: "Resume builder" },
      { href: "/features/jd-alignment", label: "Job match" },
      { href: "/pricing", label: "Pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { href: "/resume-templates", label: "Templates" },
      { href: "/resume-examples", label: "Examples" },
      { href: "/blog", label: "Blog" },
      { href: "/about", label: "About" },
    ],
  },
];

const YEAR = new Date().getFullYear();
const linkCls = "lc-link text-[#4a4862] transition-colors hover:text-[#5440e8]";

export async function SiteFooter() {
  const { tagline } = await getPageCopy("footer.tagline");
  return (
    <footer className="mx-auto w-full max-w-[1360px] px-4 pb-9 pt-12 sm:px-6 md:pb-14 md:pt-16 lg:px-10 lg:pt-20">
      {/* Phones */}
      <div className="md:hidden">
        <SiteLogo size={28} />
        <nav aria-label="Footer" className="mt-6 grid grid-cols-2 gap-6 text-[14px]">
          {COMPACT.map((c) => (
            <div key={c.title} className="flex flex-col gap-1">
              <p className="pb-1 font-bold text-[#121226]">{c.title}</p>
              {c.links.map((l) => (
                <Link key={l.href} href={l.href} className={`${linkCls} py-[3px]`}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <p className="mt-7 text-[12px] text-[#66647c]">
          © {YEAR} Elmun Technologies LLC ·{" "}
          <Link href="/legal/privacy" className={`${linkCls} !text-[#66647c] inline-block py-1`}>
            Privacy
          </Link>{" "}
          ·{" "}
          <Link href="/legal/terms" className={`${linkCls} !text-[#66647c] inline-block py-1`}>
            Terms
          </Link>
        </p>
      </div>

      {/* Tablet and desktop: every column (good internal links for search engines). */}
      <div className="hidden justify-between gap-10 md:flex">
        <div className="max-w-[300px]">
          <SiteLogo size={32} />
          <p className="mt-3.5 text-[15px] leading-6 text-[#4a4862]">{tagline}</p>
          <p className="mt-5 text-[13px] text-[#66647c]">© {YEAR} Elmun Technologies LLC</p>
        </div>
        <nav aria-label="Footer" className="grid grid-cols-3 gap-x-10 gap-y-8 text-[15px] lg:gap-x-16">
          {COLUMNS.map((c) => (
            <div key={c.title} className="flex flex-col gap-2.5">
              <p className="font-bold text-[#121226]">{c.title}</p>
              {c.links.map((l) => (
                <Link key={l.href} href={l.href} className={linkCls}>
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>
    </footer>
  );
}
