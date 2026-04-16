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
  { q: "How do I create a new resume?", a: "Go to Resume Builder and click 'Start fresh' to create a new resume from scratch, or upload an existing one." },
  { q: "How does the JD alignment work?", a: "Paste a job description and our AI will analyze how well your resume matches the requirements, then suggest improvements." },
  { q: "Can I export my resume as PDF?", a: "Yes! Open any resume in the editor and click the PDF button in the top toolbar to download it instantly." },
  { q: "How do I track my job applications?", a: "Use the Job Tracker to organize your applications through stages: Bookmarked, Applying, Interviewing, Negotiating, and Accepted." },
  { q: "Is my data secure?", a: "Yes. All data is encrypted in transit and at rest. We never share your personal information with third parties." },
  { q: "What are referral credits?", a: "Invite friends using your referral link. For every 5 people who sign up, you earn $9 in credits toward premium features." },
];

const ARTICLES = [
  { title: "Getting Started with Launch CV", desc: "A quick-start guide for new users", icon: BookOpen },
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
      <div className="rounded-2xl border border-gray-100 bg-white px-8 py-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50">
            <HelpCircle className="h-7 w-7 text-[#7C5CFC]" />
          </div>
          <div>
            <h1 className="text-[28px] font-semibold tracking-[-0.02em] text-gray-900">
              Support Center
            </h1>
            <p className="mt-1 text-[13px] leading-relaxed text-gray-500">
              Find answers, get help, and reach out to our team.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mt-6">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search for help..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="soha-input h-12 w-full rounded-xl border-gray-200 bg-gray-50 pl-11 pr-4 text-[13px] text-gray-700 placeholder:text-gray-400 focus:border-[#7C5CFC] focus:ring-[#7C5CFC]/20"
          />
        </div>
      </div>

      {/* Support Cards */}
      <div className="grid gap-5 sm:grid-cols-3">
        <a
          href="mailto:support@launch-cv.com"
          className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:border-[#7C5CFC]/30 hover:shadow-[0_8px_24px_rgba(124,92,252,0.1)]"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 transition group-hover:bg-[#7C5CFC] group-hover:shadow-lg">
            <Mail className="h-5 w-5 text-[#7C5CFC] transition group-hover:text-white" />
          </div>
          <h3 className="mt-4 text-[15px] font-bold text-gray-900">Email Support</h3>
          <p className="mt-1.5 text-[13px] text-gray-500">support@launch-cv.com</p>
        </a>

        <a
          href="#faq"
          className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:border-amber-200 hover:shadow-[0_8px_24px_rgba(245,158,11,0.1)]"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 transition group-hover:bg-amber-500 group-hover:shadow-lg">
            <MessageSquare className="h-5 w-5 text-amber-600 transition group-hover:text-white" />
          </div>
          <h3 className="mt-4 text-[15px] font-bold text-gray-900">FAQ</h3>
          <p className="mt-1.5 text-[13px] text-gray-500">Common questions answered</p>
        </a>

        <a
          href="https://docs.launch-cv.com"
          target="_blank"
          rel="noreferrer"
          className="group rounded-2xl border border-gray-100 bg-white p-6 text-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:border-emerald-200 hover:shadow-[0_8px_24px_rgba(16,185,129,0.1)]"
        >
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 transition group-hover:bg-emerald-500 group-hover:shadow-lg">
            <FileText className="h-5 w-5 text-emerald-600 transition group-hover:text-white" />
          </div>
          <h3 className="mt-4 text-[15px] font-bold text-gray-900">Documentation</h3>
          <p className="mt-1.5 text-[13px] text-gray-500">
            Guides and tutorials
            <ExternalLink className="ml-1 inline h-3 w-3" />
          </p>
        </a>
      </div>

      {/* Popular Articles */}
      <div className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h2 className="text-[15px] font-bold text-gray-900">Popular Articles</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {ARTICLES.map((article) => (
            <button
              key={article.title}
              type="button"
              className="flex items-start gap-3 rounded-xl border border-gray-100 p-4 text-left transition hover:border-[#7C5CFC]/20 hover:bg-violet-50/30"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-50">
                <article.icon className="h-4 w-4 text-[#7C5CFC]" />
              </div>
              <div>
                <p className="text-[13px] font-semibold text-gray-900">{article.title}</p>
                <p className="mt-0.5 text-[13px] text-gray-500">{article.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* FAQ Accordion */}
      <div id="faq" className="rounded-2xl border border-gray-100 bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <h2 className="text-[15px] font-bold text-gray-900">Frequently Asked Questions</h2>
        <div className="mt-4 divide-y divide-gray-100">
          {filteredFaq.length === 0 ? (
            <p className="py-6 text-center text-[13px] text-gray-400">
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
                    className="flex w-full items-center justify-between gap-4 py-4 text-left transition hover:text-[#7C5CFC]"
                  >
                    <h3 className="text-[13px] font-semibold text-gray-900">{item.q}</h3>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${
                        isOpen ? "rotate-180 text-[#7C5CFC]" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`grid transition-all duration-200 ${
                      isOpen ? "grid-rows-[1fr] pb-4" : "grid-rows-[0fr]"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="text-[13px] leading-relaxed text-gray-500">{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Still Need Help */}
      <div className="rounded-2xl border border-gray-100 bg-gradient-to-br from-violet-50/60 to-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
        <div className="text-center">
          <h2 className="text-[15px] font-bold text-gray-900">Still need help?</h2>
          <p className="mt-1.5 text-[13px] text-gray-500">
            Our team is here to assist you. Choose how you&apos;d like to reach us.
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            <a
              href="mailto:support@launch-cv.com"
              className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#7C5CFC] px-6 text-[13px] font-semibold text-white transition hover:bg-[#6B4CE0]"
            >
              <Mail className="h-4 w-4" />
              Email Us
            </a>
            <button
              type="button"
              className="inline-flex h-10 items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 text-[13px] font-semibold text-gray-700 transition hover:border-[#7C5CFC] hover:text-[#7C5CFC]"
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
