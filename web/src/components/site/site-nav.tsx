"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { SiteLogo } from "./brand";
import { trackCtaClick } from "@/lib/analytics-client";

const LINKS = [
  { href: "/free-ats-check", label: "ATS check" },
  { href: "/resume-templates", label: "Templates" },
  { href: "/resume-examples", label: "Examples" },
  { href: "/pricing", label: "Pricing" },
  { href: "/blog", label: "Blog" },
];

const GUIDE_ROUTES = ["/resume-format", "/how-to-write-a-resume", "/resume-length", "/cover-letter-template", "/resume-action-verbs", "/resume-summary-examples", "/skills-for-resume", "/resume-references", "/follow-up-email-after-applying", "/resume-keywords", "/ats", "/resignation-letter", "/what-is-a-good-ats-score"];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openedAt, setOpenedAt] = useState(pathname);
  // Close the mobile menu after navigation.
  if (open && openedAt !== pathname) setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  const under = (href: string) => pathname === href || pathname.startsWith(href + "/");
  // Guides live outside /blog but belong to it in the nav.
  const active = (href: string) => under(href) || (href === "/blog" && GUIDE_ROUTES.some(under));

  return (
    <header className="relative z-40 mx-auto flex w-full max-w-[1360px] items-center justify-between gap-6 px-4 py-4 sm:px-6 lg:px-10 lg:py-6">
      <SiteLogo />
      <nav aria-label="Main" className="lc-card hidden gap-0.5 rounded-full p-1.5 lg:flex">
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={active(l.href) ? "page" : undefined}
            className={`rounded-full px-[18px] py-2.5 text-[15px] font-semibold transition-colors duration-200 ${
              active(l.href) ? "bg-[#121226] text-white" : "text-[#121226] hover:bg-[#f1eff8]"
            }`}
          >
            {l.label}
          </Link>
        ))}
      </nav>
      <div className="hidden items-center gap-1.5 lg:flex">
        <Link href="/login" className="rounded-full px-4 py-3 text-[15px] font-semibold text-[#121226] transition-colors hover:bg-white/70">
          Log in
        </Link>
        <Link href="/register" onClick={() => trackCtaClick({ cta: "create_resume", location: "nav" })} className="lc-btn-lift rounded-full bg-[#111118] px-[22px] py-[13px] text-[15px] font-semibold text-white">
          Create my resume
        </Link>
      </div>
      <div className="flex items-center gap-1 lg:hidden">
        <Link href="/login" className="inline-flex min-h-11 items-center rounded-full px-3 text-[15px] font-semibold text-[#121226] hover:bg-white/70">
          Log in
        </Link>
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#111118] text-white"
          aria-expanded={open}
          aria-controls="site-menu"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => {
            setOpenedAt(pathname);
            setOpen((v) => !v);
          }}
        >
          {open ? <X className="h-5 w-5" aria-hidden /> : <Menu className="h-5 w-5" aria-hidden />}
        </button>
      </div>
      {open ? (
        <div id="site-menu" className="fixed inset-x-0 bottom-0 top-[76px] z-40 overflow-y-auto bg-[#eeecf4] px-4 pb-8 lg:hidden">
          <nav aria-label="Main" className="flex flex-col gap-1 pt-2">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active(l.href) ? "page" : undefined}
                className="rounded-2xl bg-white px-5 py-4 text-[18px] font-semibold text-[#121226]"
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="mt-6 flex flex-col gap-2">
            <Link href="/register" onClick={() => trackCtaClick({ cta: "create_resume", location: "nav_mobile" })} className="rounded-full bg-[#5440e8] px-6 py-4 text-center text-[16px] font-semibold text-white">
              Create my resume
            </Link>
            <Link href="/login" className="rounded-full bg-white px-6 py-4 text-center text-[16px] font-semibold text-[#121226]">
              Log in
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
