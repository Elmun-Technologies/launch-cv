"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  ExternalLink,
  FileText,
  HelpCircle,
  Mail,
  MessageCircle,
  MessageSquare,
  Search,
} from "lucide-react";

const FAQ = [
  { q: "How do I create a new resume?", a: "Open Resumes and click New resume. Start from scratch, or upload a PDF or DOCX to fill in every section for you." },
  { q: "How does the JD alignment work?", a: "Paste a job description and our AI will analyze how well your resume matches the requirements, then suggest improvements." },
  { q: "Can I export my resume as PDF?", a: "Yes! Open any resume in the editor and click the PDF button in the top toolbar to download it instantly." },
  { q: "How do I track my job applications?", a: "Add each job in the Job Tracker with the posting and the resume you sent, then move it through Saved, Applied, Interviewing, Offer, Accepted or Closed." },
  { q: "Is my data secure?", a: "Data is encrypted in transit and at rest, and we never sell it. Resume text is sent to our AI provider only to generate the results you request. You can export or delete your account from Settings." },
  { q: "How do referrals work?", a: "Share your personal link from the Referrals page. You can see who signed up through it." },
];

const ARTICLES = [
  { title: "Getting Started with LaunchCV", desc: "A quick-start guide for new users", icon: BookOpen },
  { title: "Resume Writing Best Practices", desc: "Tips to make your resume stand out", icon: FileText },
  { title: "Using AI to Match Job Descriptions", desc: "How JD alignment improves your chances", icon: MessageSquare },
  { title: "Managing Multiple Applications", desc: "Stay organized with Job Tracker", icon: MessageCircle },
];

export function SupportClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const filteredFaq = searchQuery.trim()
    ? FAQ.filter(
        (item) =>
          item.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.a.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : FAQ;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-[#EEEEEB] bg-white px-8 py-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#EEF3FF]">
            <HelpCircle className="h-7 w-7 text-[#2563EB]" />
          </div>
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-[#111111]">
              Support Center
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-[#6B6B6B]">
              Find answers, get help, and reach out to our team.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6E6E6A]" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="soha-input h-12 w-full rounded-xl border-[#E5E5E2] bg-[#FAFAF9] pl-11 pr-4 text-[13px] text-[#3F3F3F] placeholder:text-[#8A8A86] focus:border-[#2563EB] focus:ring-[#2563EB]/20"
          />
        </div>
      </div>

      {/* Support Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <a
          href="mailto:support@launch-cv.com"
          className="group rounded-2xl border border-[#EEEEEB] bg-white p-6 text-center transition hover:border-[#2563EB]/30 hover:shadow-[0_8px_24px_rgba(37, 99, 235,0.1)]"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF3FF] transition group-hover:bg-[#2563EB] group-hover:shadow-lg">
            <Mail className="h-5 w-5 text-[#2563EB] transition group-hover:text-white" />
          </div>
          <h3 className="mt-4 text-[15px] font-semibold text-[#111111]">Email Support</h3>
          <p className="mt-1.5 text-[13px] text-[#6B6B6B]">support@launch-cv.com</p>
        </a>

        <a
          href="#faq"
          className="group rounded-2xl border border-[#EEEEEB] bg-white p-6 text-center transition hover:border-amber-200 hover:shadow-[0_8px_24px_rgba(245,158,11,0.1)]"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 transition group-hover:bg-amber-500 group-hover:shadow-lg">
            <MessageSquare className="h-5 w-5 text-amber-600 transition group-hover:text-white" />
          </div>
          <h3 className="mt-4 text-[15px] font-semibold text-[#111111]">FAQ</h3>
          <p className="mt-1.5 text-[13px] text-[#6B6B6B]">Common questions answered</p>
        </a>

        <a
          href="https://docs.launch-cv.com"
          target="_blank"
          rel="noreferrer"
          className="group rounded-2xl border border-[#EEEEEB] bg-white p-6 text-center transition hover:border-emerald-200 hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)]"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 transition group-hover:bg-emerald-500 group-hover:shadow-lg">
            <FileText className="h-5 w-5 text-emerald-600 transition group-hover:text-white" />
          </div>
          <h3 className="mt-4 text-[15px] font-semibold text-[#111111]">Documentation</h3>
          <p className="mt-1.5 text-[13px] text-[#6B6B6B]">
            Guides and tutorials
            <ExternalLink className="ml-1 inline h-3 w-3" />
          </p>
        </a>
      </div>

      {/* Popular Articles */}
      <div className="rounded-2xl border border-[#EEEEEB] bg-white p-6">
        <h2 className="text-[15px] font-semibold text-[#111111]">Popular Articles</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ARTICLES.map((article) => (
            <button
              key={article.title}
              type="button"
              className="flex items-start gap-3 rounded-xl border border-[#EEEEEB] p-4 text-left transition hover:border-[#2563EB]/20 hover:bg-[#EEF3FF]/30"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EEF3FF]">
                <article.icon className="h-4 w-4 text-[#2563EB]" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#111111]">{article.title}</p>
                <p className="mt-0.5 text-[13px] text-[#6B6B6B]">{article.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div id="faq" className="rounded-2xl border border-[#EEEEEB] bg-white p-6">
        <h2 className="text-[15px] font-semibold text-[#111111]">Frequently Asked Questions</h2>
        <div className="mt-4 divide-y divide-[#EEEEEB]">
          {filteredFaq.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-[#6E6E6A]">
              No matching questions found. Try a different search term.
            </p>
          ) : (
            filteredFaq.map((item, i) => {
              const isOpen = openFaq === i;
              return (
                <div key={i}>
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left transition hover:text-[#2563EB]"
                  >
                    <h3 className="text-[13px] font-semibold text-[#111111]">{item.q}</h3>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-[#6E6E6A] transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#2563EB]" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-200 ${
                      isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[13px] leading-relaxed text-[#6B6B6B]">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Still Need Help */}
      <div className="rounded-2xl border border-[#EEEEEB] bg-[#FAFAF9] p-8">
        <div className="text-center">
          <h2 className="text-[15px] font-semibold text-[#111111]">Still need help?</h2>
          <p className="mt-1.5 text-[13px] text-[#6B6B6B]">
            Our team is here to assist you. Choose how you&apos;d like to reach us.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a
              href="mailto:support@launch-cv.com"
              className="inline-flex h-10 items-center gap-2 rounded-full bg-[#2563EB] px-6 text-[13px] font-semibold text-white transition hover:bg-[#1D4ED8]"
            >
              <Mail className="h-4 w-4" />
              Email Us
            </a>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E5E5E2] bg-white px-6 text-[13px] font-semibold text-[#3F3F3F] transition hover:border-[#2563EB] hover:text-[#2563EB]"
            >
              <MessageCircle className="h-4 w-4" />
              Live Chat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
