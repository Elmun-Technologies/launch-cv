import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { BLOG_POSTS } from "@/lib/blog-posts";
import { ArrowRight, Clock, Tag } from "lucide-react";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Career & Resume Tips Blog",
  description:
    "Expert guides on resume writing, ATS optimization, cover letter tips, interview preparation, and AI job search tools. Actionable advice for modern job seekers.",
  pathname: "/blog",
  keywords: [
    "resume tips", "career advice", "ATS resume", "cover letter tips", "interview preparation",
    "job search tips", "AI resume builder guide", "resume writing",
  ],
});

const blogLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Launch CV Career Blog",
  description: "Expert guides on resume writing, ATS optimization, cover letters, and job search strategy.",
  url: absoluteUrl("/blog"),
  publisher: {
    "@type": "Organization",
    name: "Launch CV",
    url: absoluteUrl("/"),
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/icon.png"),
    },
  },
};

const categoryColors: Record<string, string> = {
  "Resume Tips": "bg-blue-50 text-blue-700",
  "Cover Letters": "bg-teal-50 text-teal-700",
  "Interview Prep": "bg-emerald-50 text-emerald-700",
  "Job Search": "bg-violet-50 text-violet-700",
};

export default function BlogPage() {
  const categories = Array.from(new Set(BLOG_POSTS.map((p) => p.category)));

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd data={blogLd} />
      <LandingNav />

      {/* Hero */}
      <section className="border-b border-[#E2E8F0] bg-gradient-to-b from-[#F8FAFC] to-white pb-14 pt-28">
        <div className="mx-auto max-w-[1280px] px-6 text-center">
          <p className="lc-eyebrow">Career Blog</p>
          <h1 className="lc-h2 mx-auto mt-4 max-w-[600px] font-display">
            Resume Tips & Career Advice for Modern Job Seekers
          </h1>
          <p className="mx-auto mt-4 max-w-[540px] font-body text-[16px] leading-[1.7] text-[#64748B]">
            Evidence-based guides on ATS optimization, resume writing, cover letters, and AI-assisted job search.
          </p>
          {/* Category filters */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <span className="rounded-full bg-[#0F172A] px-4 py-1.5 font-body text-[13px] font-semibold text-white">
              All posts
            </span>
            {categories.map((cat) => (
              <span
                key={cat}
                className={`rounded-full px-4 py-1.5 font-body text-[13px] font-semibold ${categoryColors[cat] ?? "bg-gray-100 text-gray-700"}`}
              >
                {cat}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Posts grid */}
      <section className="py-16">
        <div className="mx-auto max-w-[1280px] px-6">
          {/* Featured post */}
          <div className="mb-12">
            <Link
              href={`/blog/${BLOG_POSTS[0].slug}`}
              className="group grid items-center gap-8 overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_2px_12px_rgba(0,0,0,0.04)] transition hover:shadow-[0_4px_24px_rgba(0,0,0,0.08)] lg:grid-cols-2"
            >
              {/* Visual placeholder */}
              <div className="flex h-[220px] items-center justify-center rounded-xl bg-gradient-to-br from-[#EFF6FF] to-[#EDE9FE]">
                <div className="text-center">
                  <p className="font-body text-[11px] font-bold uppercase tracking-[0.08em] text-[#1A56DB]">Featured</p>
                  <p className="mt-2 font-display text-[28px] font-bold leading-tight text-[#0F172A]">
                    {BLOG_POSTS[0].category}
                  </p>
                </div>
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <span className={`rounded-full px-3 py-1 font-body text-[11px] font-semibold ${categoryColors[BLOG_POSTS[0].category] ?? "bg-gray-100 text-gray-700"}`}>
                    {BLOG_POSTS[0].category}
                  </span>
                  <span className="flex items-center gap-1 font-body text-[12px] text-[#94A3B8]">
                    <Clock className="h-3.5 w-3.5" /> {BLOG_POSTS[0].readingTime} min read
                  </span>
                </div>
                <h2 className="mt-4 font-display text-[22px] font-bold leading-snug text-[#0F172A] group-hover:text-[#1A56DB] transition-colors sm:text-[26px]">
                  {BLOG_POSTS[0].title}
                </h2>
                <p className="mt-3 font-body text-[15px] leading-[1.7] text-[#64748B]">
                  {BLOG_POSTS[0].description}
                </p>
                <span className="mt-5 inline-flex items-center gap-1.5 font-body text-[14px] font-semibold text-[#1A56DB]">
                  Read article <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          </div>

          {/* Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {BLOG_POSTS.slice(1).map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition hover:shadow-[0_4px_20px_rgba(0,0,0,0.08)] hover:-translate-y-0.5"
              >
                {/* Color band */}
                <div className={`h-2 w-full ${post.category === "Resume Tips" ? "bg-[#1A56DB]" : post.category === "Cover Letters" ? "bg-[#0D9488]" : post.category === "Interview Prep" ? "bg-[#059669]" : "bg-[#7C3AED]"}`} />
                <div className="flex flex-1 flex-col p-6">
                  <div className="flex items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 font-body text-[11px] font-semibold ${categoryColors[post.category] ?? "bg-gray-100 text-gray-700"}`}>
                      {post.category}
                    </span>
                    <span className="flex items-center gap-1 font-body text-[11px] text-[#94A3B8]">
                      <Clock className="h-3 w-3" /> {post.readingTime} min
                    </span>
                  </div>
                  <h2 className="mt-4 font-display text-[17px] font-bold leading-snug text-[#0F172A] group-hover:text-[#1A56DB] transition-colors">
                    {post.title}
                  </h2>
                  <p className="mt-2 flex-1 font-body text-[13px] leading-[1.65] text-[#64748B] line-clamp-3">
                    {post.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-1.5">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="flex items-center gap-1 rounded-full border border-[#E2E8F0] px-2.5 py-0.5 font-body text-[11px] text-[#64748B]">
                        <Tag className="h-2.5 w-2.5" /> {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="font-body text-[12px] text-[#94A3B8]">
                      {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                    </span>
                    <span className="inline-flex items-center gap-1 font-body text-[12px] font-semibold text-[#1A56DB]">
                      Read <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-[#1A56DB] to-[#7C3AED] py-14">
        <div className="mx-auto flex max-w-[640px] flex-col items-center gap-4 px-6 text-center">
          <h2 className="font-display text-[28px] font-bold text-white">Put These Tips to Work</h2>
          <p className="font-body text-[16px] text-white/80">Build your ATS-optimized resume with AI. Choose a plan and get started today.</p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 rounded-[10px] bg-white px-7 py-3.5 font-body text-[15px] font-bold text-[#1A56DB] shadow-lg transition hover:scale-[1.02]"
          >
            Build My Resume <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
