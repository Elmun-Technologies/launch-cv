"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, ChevronDown, Mail, Search } from "lucide-react";
import { PUBLIC_PLANS } from "@/lib/monetization";

const FAQ = [
  {
    q: "How do I create a resume?",
    a: "Go to Resumes and choose New resume. Import the PDF or Word file you already have and every section is filled in for you, or start from a blank page or one of the resume examples.",
  },
  {
    q: "How do I download my resume as a PDF?",
    a: "Open the resume and select PDF in the top bar. PDF export is free on every account, in all four templates.",
  },
  {
    q: "What does Match to a job do?",
    a: "Paste a job post and it compares it with your resume: a match score, the keywords you already cover, the ones you're missing and suggested rewrites for your bullets. It only uses what's in your resume and the job post, so review each suggestion before you use it.",
  },
  {
    q: "Which features need a plan?",
    a: `The ATS check, the resume editor, PDF export, templates and the job tracker are free. The AI tools — job matching, role-fit checks, bullet rewrites, cover letters and interview packets — are on paid plans from ${PUBLIC_PLANS.starter.priceDisplay}/month or ${PUBLIC_PLANS.lifetime.priceDisplay} once.`,
  },
  {
    q: "How do I cancel or get a refund?",
    a: "Open Settings → Plan & billing and use the billing portal to cancel; you keep access until the end of the period you paid for. For a refund, email support within 7 days of paying for a monthly plan or 14 days for Lifetime.",
  },
  {
    q: "How do I track my applications?",
    a: "Add each job in the Job tracker with the job post and the resume you sent, then move it from Saved to Applied, Interviewing, Offer, Accepted or Closed. Each job has a checklist and notes.",
  },
  {
    q: "Is my data private?",
    a: "We never sell your data. Resume text is sent to our AI provider only to produce the results you ask for. You can download everything or delete your account in Settings.",
  },
  {
    q: "How do I change my email address?",
    a: "Email support from the address on your account and tell us the new one. We'll move your account over.",
  },
];

const GUIDES = [
  { href: "/free-ats-check", t: "Check your resume against an ATS", d: "What applicant tracking software can and can't read" },
  { href: "/resume-examples", t: "Resume examples by role", d: "16 examples with summaries, bullets and keywords" },
  { href: "/cover-letter-examples", t: "Cover letter examples", d: "Annotated letters you can adapt" },
  { href: "/blog", t: "Resume guides", d: "Keywords, formatting and job search articles" },
];

export function SupportClient() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState<string | null>(null);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return q ? FAQ.filter((f) => `${f.q} ${f.a}`.toLowerCase().includes(q)) : FAQ;
  }, [query]);

  return (
    <div className="mx-auto flex max-w-[1080px] flex-col gap-5">
      <div>
        <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">
          Help <span className="text-[#8A8A86]">— answers, guides and a person to email.</span>
        </h1>
        <p className="mt-1 text-[15px] text-[#6B6B6B]">Search the common questions, or write to us and we&apos;ll reply by email.</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_320px]">
        <section className="rounded-[14px] border border-[#E5E5E2] bg-white p-6">
          <h2 className="text-[17px] font-semibold text-[#111111]">Questions</h2>
          <label className="relative mt-4 block">
            <span className="sr-only">Search questions</span>
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6E6A]" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search, e.g. PDF, refund, cancel"
              className="soha-input pl-9"
            />
          </label>
          {shown.length === 0 ? (
            <p className="mt-5 text-[14px] text-[#6B6B6B]">
              Nothing matches that. Email{" "}
              <a href="mailto:support@launch-cv.com" className="text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
                support@launch-cv.com
              </a>{" "}
              and we&apos;ll help.
            </p>
          ) : (
            <ul className="mt-3 divide-y divide-[#EEEEEB]">
              {shown.map((f) => {
                const isOpen = open === f.q || query.trim().length > 0;
                return (
                  <li key={f.q}>
                    <button
                      type="button"
                      onClick={() => setOpen(open === f.q ? null : f.q)}
                      aria-expanded={isOpen}
                      className="flex w-full items-center justify-between gap-4 py-3.5 text-left text-[15px] font-medium text-[#111111]"
                    >
                      {f.q}
                      <ChevronDown className={`h-4 w-4 shrink-0 text-[#6E6E6A] transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden />
                    </button>
                    {isOpen ? <p className="pb-4 text-[14px] leading-[1.6] text-[#3F3F3F]">{f.a}</p> : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-5">
          <section className="rounded-[14px] border border-[#E5E5E2] bg-white p-6">
            <h2 className="text-[17px] font-semibold text-[#111111]">Email us</h2>
            <p className="mt-1 text-[14px] leading-[1.55] text-[#6B6B6B]">
              Billing, bugs or a question about your resume — write from the address on your account.
            </p>
            <a href="mailto:support@launch-cv.com" className="soha-btn-primary mt-4 inline-flex w-full items-center justify-center gap-2">
              <Mail className="h-4 w-4" aria-hidden /> support@launch-cv.com
            </a>
          </section>

          <section className="rounded-[14px] border border-[#E5E5E2] bg-white p-6">
            <h2 className="text-[17px] font-semibold text-[#111111]">Guides</h2>
            <ul className="mt-2">
              {GUIDES.map((g) => (
                <li key={g.href} className="border-t border-[#EEEEEB] first:border-t-0">
                  <Link href={g.href} className="group flex items-start justify-between gap-3 py-3">
                    <span>
                      <span className="block text-[14px] font-medium text-[#111111] group-hover:underline">{g.t}</span>
                      <span className="block text-[13px] text-[#6B6B6B]">{g.d}</span>
                    </span>
                    <ArrowRight className="mt-0.5 h-4 w-4 shrink-0 text-[#6E6E6A]" aria-hidden />
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
