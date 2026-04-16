"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Logo } from "@/components/logo";
import {
  Target, FileText, Mail, Mic, BarChart3, MessageSquare,
  ChevronDown, Menu, X, ArrowRight,
} from "lucide-react";

const featureItems = [
  { href: "/features/jd-alignment", icon: Target, label: "JD Alignment", desc: "Match resume to any job description" },
  { href: "/features/resume-builder", icon: FileText, label: "Resume Builder", desc: "AI-powered with 12+ templates" },
  { href: "/features/cover-letter", icon: Mail, label: "Cover Letter", desc: "Personalized letters in 60 seconds" },
  { href: "/features/interview-prep", icon: MessageSquare, label: "Interview Prep", desc: "Role-specific AI practice" },
  { href: "/features/ats-score", icon: BarChart3, label: "ATS Score", desc: "See how ATS reads your resume" },
  { href: "/features/voice-input", icon: Mic, label: "Voice Input", desc: "Speak — AI writes it for you" },
];

const navLinks = [
  { label: "Pricing", href: "/pricing" },
  { label: "About", href: "/about" },
];

export function LandingNav() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const megaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 8); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") { setMegaOpen(false); setMobileOpen(false); } }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (megaRef.current && !megaRef.current.contains(e.target as Node)) setMegaOpen(false);
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // Close mobile menu on route change
  useEffect(() => { setMobileOpen(false); setMegaOpen(false); }, [pathname]);

  const isDark = !scrolled && !mobileOpen && (pathname === "/" || pathname === "");

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled || mobileOpen
            ? "bg-white/95 backdrop-blur-[12px] border-b border-[#E2E8F0] shadow-[0_1px_8px_rgba(0,0,0,0.04)]"
            : isDark
            ? "bg-transparent"
            : "bg-white/95 backdrop-blur-[12px] border-b border-[#E2E8F0]"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between px-6">
          {/* Logo */}
          <Logo variant={isDark ? "dark" : "light"} size="md" />

          {/* Desktop center nav */}
          <nav className="hidden items-center gap-1 lg:flex">
            {/* Features mega-menu trigger */}
            <div ref={megaRef} className="relative">
              <button
                type="button"
                onClick={() => setMegaOpen((v) => !v)}
                aria-expanded={megaOpen}
                className={`flex items-center gap-1 rounded-lg px-3 py-2 text-[14px] font-semibold transition-colors font-body ${
                  isDark
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-[#334155] hover:text-[#1A56DB] hover:bg-[#EFF6FF]"
                }`}
              >
                Features
                <ChevronDown
                  className={`h-4 w-4 transition-transform duration-200 ${megaOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Mega-menu */}
              {megaOpen && (
                <div className="absolute top-full left-1/2 mt-2 w-[480px] -translate-x-1/2 rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-[0_8px_40px_rgba(0,0,0,0.12)]">
                  <div className="grid grid-cols-2 gap-1">
                    {featureItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="group flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-[#F8FAFC]"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1A56DB] group-hover:bg-[#1A56DB] group-hover:text-white transition-colors">
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-[#0F172A]">{item.label}</p>
                          <p className="text-[12px] leading-snug text-[#64748B]">{item.desc}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                  <div className="mt-3 border-t border-[#E2E8F0] pt-3">
                    <Link
                      href="/features"
                      className="flex items-center gap-1.5 text-[13px] font-semibold text-[#1A56DB] hover:underline"
                    >
                      View all features <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={`rounded-lg px-3 py-2 text-[14px] font-semibold transition-colors font-body ${
                  pathname === l.href
                    ? "text-[#1A56DB]"
                    : isDark
                    ? "text-white/80 hover:text-white hover:bg-white/10"
                    : "text-[#334155] hover:text-[#1A56DB] hover:bg-[#EFF6FF]"
                }`}
              >
                {l.label}
              </Link>
            ))}
          </nav>

          {/* Desktop right CTAs */}
          <div className="hidden items-center gap-2 lg:flex">
            <Link
              href="/login"
              className={`rounded-lg px-4 py-2 text-[14px] font-semibold transition-colors font-body ${
                isDark ? "text-white/80 hover:text-white hover:bg-white/10" : "text-[#334155] hover:text-[#1A56DB] hover:bg-[#F8FAFC]"
              }`}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 rounded-[10px] bg-[#1A56DB] px-4 py-2 text-[14px] font-bold text-white transition hover:bg-[#1D4ED8] hover:shadow-lg hover:shadow-blue-500/20 font-body"
            >
              Get started
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            type="button"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors lg:hidden ${
              isDark ? "text-white hover:bg-white/10" : "text-[#334155] hover:bg-[#F8FAFC]"
            }`}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile fullscreen menu */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-white pt-[72px] lg:hidden">
          <div className="flex-1 overflow-y-auto px-5 py-6">
            {/* Features group */}
            <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.08em] text-[#94A3B8] font-body">Features</p>
            <div className="space-y-1">
              {featureItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-[#F8FAFC]"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1A56DB]">
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-[14px] font-semibold text-[#0F172A] font-body">{item.label}</p>
                    <p className="text-[12px] text-[#64748B] font-body">{item.desc}</p>
                  </div>
                </Link>
              ))}
            </div>

            <div className="my-5 border-t border-[#E2E8F0]" />

            {/* Other links */}
            {navLinks.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center rounded-xl px-3 py-3 text-[15px] font-semibold text-[#334155] transition-colors hover:bg-[#F8FAFC] hover:text-[#1A56DB] font-body"
              >
                {l.label}
              </Link>
            ))}

            <div className="my-5 border-t border-[#E2E8F0]" />

            {/* Auth CTAs */}
            <div className="space-y-3">
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-[10px] border-2 border-[#E2E8F0] py-3 text-[15px] font-bold text-[#334155] transition hover:border-[#1A56DB] hover:text-[#1A56DB] font-body"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#1A56DB] py-3 text-[15px] font-bold text-white transition hover:bg-[#1D4ED8] font-body"
              >
                Get started <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
