"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, Mail, Minus, Plus, Search } from "lucide-react";
import { PUBLIC_PLANS } from "@/lib/monetization";
import { PageHeader, btnSmWhite, cardCls, inlineLinkCls } from "@/components/app/account/ui";

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
  { href: "/resume-examples", t: "Resume examples by role", d: "Healthcare, trades, retail, tech and more, with bullets and keywords" },
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
    <div className="mx-auto w-full max-w-[1160px] pb-12">
      <PageHeader title="Help" lead="Search the common questions, or write to us and we'll reply by email." />

      <div className="mt-5 grid items-start gap-4 sm:mt-6 sm:gap-5 lg:grid-cols-[1.3fr_0.7fr]">
        <section aria-labelledby="help-faq-title" className={`${cardCls} sm:rounded-[28px] sm:p-6`}>
          <h2 id="help-faq-title" className="sr-only">
            Questions
          </h2>
          <label className="relative block max-w-[560px]">
            <span className="sr-only">Search questions</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#66647c]" aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search, e.g. PDF, refund, cancel"
              className="block h-12 w-full rounded-full border-[1.5px] border-[#e2e0ea] bg-[#f7f6fb] pl-11 pr-4 text-[16px] text-[#121226] outline-none transition-[border-color,box-shadow,background-color] placeholder:text-[#706e88] hover:border-[#c9c0ff] focus:border-[#5440e8] focus:bg-white focus:ring-4 focus:ring-[#5440e8]/15 focus-visible:outline-none! focus-visible:rounded-full! sm:text-[15px] motion-reduce:transition-none"
            />
          </label>
          {shown.length === 0 ? (
            <p role="status" className="mt-5 text-[14px] leading-[21px] text-[#4a4862]">
              Nothing matches that. Email{" "}
              <a href="mailto:support@launch-cv.com" className={inlineLinkCls}>
                support@launch-cv.com
              </a>{" "}
              and we&apos;ll help.
            </p>
          ) : (
            <ul className="mt-3.5">
              {shown.map((f, i) => {
                const isOpen = open === f.q || query.trim().length > 0;
                const id = `help-faq-${i}`;
                return (
                  <li key={f.q} className="border-t border-[#e2e0ea]">
                    <h3>
                      <button
                        type="button"
                        onClick={() => setOpen(open === f.q ? null : f.q)}
                        aria-expanded={isOpen}
                        aria-controls={id}
                        className="group flex min-h-11 w-full items-center justify-between gap-4 rounded-xl px-1 py-4 text-left text-[15px] font-bold text-[#121226] transition-colors hover:text-[#5440e8] focus-visible:rounded-xl! motion-reduce:transition-none"
                      >
                        {f.q}
                        <span
                          aria-hidden="true"
                          className={`inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors motion-reduce:transition-none ${
                            isOpen ? "bg-[#111118] text-white" : "bg-[#f1eff8] text-[#121226] group-hover:bg-[#e4dfff]"
                          }`}
                        >
                          {isOpen ? <Minus className="h-3.5 w-3.5" strokeWidth={2.5} /> : <Plus className="h-3.5 w-3.5" strokeWidth={2.5} />}
                        </span>
                      </button>
                    </h3>
                    {isOpen ? (
                      <p id={id} className="-mt-1 px-1 pb-4 pr-10 text-[14px] leading-[22px] text-[#4a4862]">
                        {f.a}
                      </p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <div className="flex flex-col gap-4">
          <section className="rounded-[24px] bg-[#5440e8] p-[22px] text-white sm:rounded-[28px] sm:p-6">
            <h2 className="text-[20px] font-extrabold">Email us</h2>
            <p className="mt-1.5 text-[14px] leading-[21px] text-[#e4dfff]">
              Billing, bugs or a question about your resume — write from the address on your account.
            </p>
            <a href="mailto:support@launch-cv.com" className={`${btnSmWhite} mt-3.5 min-h-[52px] w-full text-[15px] sm:text-[16px]`}>
              <Mail className="h-[18px] w-[18px]" aria-hidden /> support@launch-cv.com
            </a>
          </section>

          <section className={`${cardCls} sm:rounded-[28px] sm:p-[22px]`}>
            <h2 className="text-[18px] font-extrabold text-[#121226]">Guides</h2>
            <ul className="mt-2">
              {GUIDES.map((g) => (
                <li key={g.href} className="border-t border-[#e2e0ea]">
                  <Link href={g.href} className="group flex min-h-11 items-start justify-between gap-3 rounded-xl py-3 focus-visible:rounded-xl!">
                    <span className="min-w-0">
                      <span className="block text-[14px] font-bold text-[#121226] transition-colors group-hover:text-[#5440e8]">{g.t}</span>
                      <span className="block text-[13px] leading-[19px] text-[#66647c]">{g.d}</span>
                    </span>
                    <ArrowRight
                      className="mt-0.5 h-4 w-4 shrink-0 text-[#5440e8] transition-transform motion-safe:group-hover:translate-x-0.5"
                      aria-hidden
                    />
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
