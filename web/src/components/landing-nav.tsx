"use client";

import Link from "next/link";
import { useState } from "react";
import { Target, FileText, Mail, MessageSquare, BarChart3, Mic, ChevronDown, ArrowRight } from "lucide-react";

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

  return (
    <header className="sticky top-0 z-50 border-b border-[#f0f0f0] bg-white/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1120px] items-center justify-between px-6 py-3">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2.5">
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

        <div className="flex items-center gap-3">
          <Link href="/login" className="rounded-md px-3 py-1.5 text-[14px] font-medium text-[#666] transition hover:text-[#0a0a0a]">Sign in</Link>
          <Link href="/register" className="rounded-full bg-[#0a0a0a] px-4 py-1.5 text-[13px] font-semibold text-white transition hover:bg-[#333]">Get started</Link>
        </div>
      </div>
    </header>
  );
}
