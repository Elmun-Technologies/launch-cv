"use client";

import Link from "next/link";
import { useState } from "react";
import { Target, FileText, Mail, MessageSquare, BarChart3, Mic, ChevronDown, ArrowRight, Menu, X } from "lucide-react";

const featureItems = [
  { href: "/features/jd-alignment", icon: Target, title: "JD Alignment", desc: "Match resume to any job description" },
  { href: "/features/resume-builder", icon: FileText, title: "Resume Builder", desc: "Create professional resumes with AI" },
  { href: "/features/cover-letter", icon: Mail, title: "Cover Letter", desc: "Tailored cover letters in seconds" },
  { href: "/features/interview-prep", icon: MessageSquare, title: "Interview Prep", desc: "AI-generated practice questions" },
  { href: "/features/ats-score", icon: BarChart3, title: "ATS Score", desc: "Optimize for tracking systems" },
  { href: "/features/voice-input", icon: Mic, title: "Voice Input", desc: "Speak your experience, we type it" },
];

export function LandingNav() {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#f0f0f0] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-3">
        <div className="flex min-w-0 flex-1 items-center gap-4 md:gap-8">
          <Link href="/" className="flex shrink-0 items-center gap-2.5" onClick={() => setMobileOpen(false)}>
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[#0a0a0a] text-[12px] font-bold text-white">L</span>
            <span className="text-[15px] font-bold text-[#0a0a0a]">Launch CV</span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            <div
              className="relative"
              onMouseEnter={() => setOpen(true)}
              onMouseLeave={() => setOpen(false)}
            >
              <button
                type="button"
                className="flex items-center gap-1 rounded-md px-3 py-1.5 text-[14px] font-medium text-[#666] transition hover:text-[#0a0a0a]"
              >
                Features
                <ChevronDown className={`h-3 w-3 transition ${open ? "rotate-180" : ""}`} />
              </button>

              {open ? (
                <div className="absolute left-0 top-full z-50 w-[480px] pt-2">
                  <div className="animate-fadeIn rounded-xl border border-[#e5e5e5] bg-white p-3 shadow-xl shadow-black/5">
                    <div className="grid grid-cols-2 gap-0.5">
                      {featureItems.map((f) => (
                        <Link
                          key={f.href}
                          href={f.href}
                          className="flex items-start gap-3 rounded-lg px-3 py-2.5 transition hover:bg-[#fafafa]"
                        >
                          <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-[#999]" />
                          <div>
                            <p className="text-[13px] font-semibold text-[#0a0a0a]">{f.title}</p>
                            <p className="mt-0.5 text-[12px] text-[#999]">{f.desc}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                    <div className="mt-2 border-t border-[#f0f0f0] pt-2">
                      <Link href="/features" className="flex items-center gap-1.5 px-3 py-1.5 text-[13px] font-medium text-[#666] transition hover:text-[#0a0a0a]">
                        All features <ArrowRight className="h-3 w-3" />
                      </Link>
                    </div>
                  </div>
                </div>
              ) : null}
            </div>

            <Link href="/pricing" className="rounded-md px-3 py-1.5 text-[14px] font-medium text-[#666] transition hover:text-[#0a0a0a]">Pricing</Link>
            <Link href="/about" className="rounded-md px-3 py-1.5 text-[14px] font-medium text-[#666] transition hover:text-[#0a0a0a]">About</Link>
          </nav>
        </div>

        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <Link href="/login" className="hidden rounded-md px-3 py-1.5 text-[14px] font-medium text-[#666] transition hover:text-[#0a0a0a] md:inline-block">
            Sign in
          </Link>
          <Link href="/register" className="hidden rounded-full bg-[#0a0a0a] px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#333] md:inline-block">
            Get started
          </Link>
          <button
            type="button"
            aria-expanded={mobileOpen}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-[#0a0a0a] transition hover:bg-[#f5f5f5] md:hidden"
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="border-t border-[#f0f0f0] bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-[#999]">Features</p>
            {featureItems.map((f) => (
              <Link
                key={f.href}
                href={f.href}
                className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-[#0a0a0a] transition hover:bg-[#fafafa]"
                onClick={() => setMobileOpen(false)}
              >
                {f.title}
              </Link>
            ))}
            <Link href="/features" className="rounded-lg px-3 py-2 text-[13px] font-medium text-[#7C5CFC]" onClick={() => setMobileOpen(false)}>
              All features →
            </Link>
            <div className="my-2 border-t border-[#f0f0f0]" />
            <Link href="/pricing" className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-[#0a0a0a] transition hover:bg-[#fafafa]" onClick={() => setMobileOpen(false)}>
              Pricing
            </Link>
            <Link href="/about" className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-[#0a0a0a] transition hover:bg-[#fafafa]" onClick={() => setMobileOpen(false)}>
              About
            </Link>
            <div className="my-2 border-t border-[#f0f0f0]" />
            <Link href="/login" className="rounded-lg px-3 py-2.5 text-[14px] font-medium text-[#666]" onClick={() => setMobileOpen(false)}>
              Sign in
            </Link>
            <Link
              href="/register"
              className="mt-1 rounded-full bg-[#0a0a0a] py-3 text-center text-[14px] font-semibold text-white"
              onClick={() => setMobileOpen(false)}
            >
              Get started
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
