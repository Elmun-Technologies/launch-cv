import type { Metadata } from "next";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { getPublishedPosts } from "@/lib/cms/blog";
import { BlogCover } from "@/components/blog-cover";
import { ArrowRight, Clock } from "lucide-react";

// CMS-driven: re-render on every request (Postgres-backed)
export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMarketingMetadata({
  title: "Career & Resume Blog",
  description:
    "Evidence-based guides on resume writing, ATS optimization, cover letters, interview preparation, and AI-assisted job search.",
  pathname: "/blog",
  keywords: [
    "resume tips",
    "career advice",
    "ATS resume",
    "cover letter tips",
    "interview preparation",
    "AI job search",
  ],
});

const blogLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Launch CV Career Blog",
  description: "Evidence-based guides on resume writing, ATS optimization, cover letters, and job search strategy.",
  url: absoluteUrl("/blog"),
  publisher: {
    "@type": "Organization",
    name: "Launch CV",
    url: absoluteUrl("/"),
    logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png") },
  },
};

const categoryClass: Record<string, string> = {
  "Resume Tips": "bg-blue-50 text-blue-700",
  "Cover Letters": "bg-teal-50 text-teal-700",
  "Interview Prep": "bg-emerald-50 text-emerald-700",
  "Job Search": "bg-violet-50 text-violet-700",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const featured = posts[0];
  const rest = posts.slice(1);

  if (!featured) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
        <JsonLd data={blogLd} />
        <LandingNav />
        <main className="mx-auto max-w-[1100px] flex-1 px-6 py-32 text-center">
          <h1 className="lc-hero-headline text-[#0F172A]">Career blog</h1>
          <p className="mt-6 text-[16px] text-[#475569]">New articles coming soon. Check back shortly.</p>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#0F172A]">
      <JsonLd data={blogLd} />
      <LandingNav />

      {/* HERO */}
      <section className="relative overflow-hidden bg-white pt-[96px]">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            backgroundImage: "radial-gradient(circle at 12% 0%, rgba(26,86,219,0.06), transparent 50%)",
          }}
        />
        <div className="relative mx-auto max-w-[1200px] px-6 pb-12 pt-12">
          <div className="max-w-[760px]">
            <p className="lc-overline text-[#1A56DB]">Career blog</p>
            <h1 className="mt-3 lc-hero-headline text-[#0F172A]">
              Resume tips and career advice for modern job seekers
            </h1>
            <p className="mt-6 max-w-[600px] text-[17px] leading-[1.65] text-[#475569]">
              Evidence-based guides on ATS optimization, resume writing, cover letters, interview preparation, and AI-assisted job search — written by the team building Launch CV.
            </p>

            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full bg-[#0F172A] px-3.5 py-1.5 text-[12px] font-semibold text-white">All posts</span>
              {categories.map((cat) => (
                <span
                  key={cat}
                  className={`rounded-full px-3.5 py-1.5 text-[12px] font-semibold ${categoryClass[cat] ?? "bg-[#F1F5F9] text-[#475569]"}`}
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED + GRID */}
      <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-16 sm:py-20">
        <div className="mx-auto max-w-[1200px] px-6">
          {/* Featured */}
          <Link
            href={`/blog/${featured.slug}`}
            className="group grid gap-8 rounded-2xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1] hover:shadow-[0_10px_30px_-15px_rgba(15,23,42,0.15)] lg:grid-cols-2 lg:items-center lg:gap-10 lg:p-6"
          >
            <BlogCover post={featured} size="lg" />
            <div className="px-2 lg:px-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-[#EFF6FF] px-2.5 py-0.5 text-[11px] font-semibold text-[#1A56DB]">
                  Featured
                </span>
                <span
                  className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                    categoryClass[featured.category] ?? "bg-[#F1F5F9] text-[#475569]"
                  }`}
                >
                  {featured.category}
                </span>
                <span className="inline-flex items-center gap-1 text-[12px] text-[#94A3B8]">
                  <Clock className="h-3 w-3" /> {featured.readingTime} min read
                </span>
              </div>
              <h2 className="mt-4 text-[24px] font-semibold leading-tight tracking-tight text-[#0F172A] transition group-hover:text-[#1A56DB] sm:text-[28px]">
                {featured.title}
              </h2>
              <p className="mt-3 text-[15px] leading-[1.7] text-[#475569]">{featured.description}</p>
              <span className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-[#1A56DB]">
                Read article
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>

          {/* Grid */}
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col rounded-xl border border-[#E2E8F0] bg-white p-4 transition hover:border-[#CBD5E1] hover:shadow-[0_10px_30px_-15px_rgba(15,23,42,0.15)]"
              >
                <BlogCover post={post} size="md" />
                <div className="flex flex-1 flex-col px-2 pb-2 pt-5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-md px-2 py-0.5 text-[10px] font-semibold ${
                        categoryClass[post.category] ?? "bg-[#F1F5F9] text-[#475569]"
                      }`}
                    >
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[11px] text-[#94A3B8]">
                      <Clock className="h-3 w-3" /> {post.readingTime} min
                    </span>
                  </div>
                  <h2 className="mt-3 text-[16px] font-semibold leading-snug tracking-tight text-[#0F172A] transition group-hover:text-[#1A56DB]">
                    {post.title}
                  </h2>
                  <p className="mt-2 line-clamp-2 flex-1 text-[13px] leading-[1.65] text-[#475569]">
                    {post.description}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-[#E2E8F0] pt-3">
                    <span className="text-[11px] text-[#94A3B8]">
                      {new Date(post.date).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1A56DB]">
                      Read
                      <ArrowRight className="h-3 w-3 transition group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-white py-20">
        <div className="mx-auto max-w-[900px] px-6 text-center">
          <h2 className="lc-section-headline text-[#0F172A]">Put these tips to work</h2>
          <p className="mx-auto mt-4 max-w-[520px] text-[16px] leading-[1.65] text-[#475569]">
            Build your ATS-optimized resume with AI. Choose a plan and get started.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
