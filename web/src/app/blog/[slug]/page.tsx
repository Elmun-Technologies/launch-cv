import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { getPostBySlug, getAllSlugs, BLOG_POSTS } from "@/lib/blog-posts";
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight, ArrowRight, ChevronDown } from "lucide-react";
import { BlogFaq } from "@/components/blog-faq";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return buildMarketingMetadata({
    title: post.title,
    description: post.description,
    pathname: `/blog/${post.slug}`,
    keywords: post.tags,
  });
}

export default async function BlogPostPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);

  const articleLd = {
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: absoluteUrl(`/blog/${post.slug}`),
    image: absoluteUrl("/opengraph-image"),
    author: {
      "@type": "Organization",
      name: post.author.name,
      url: absoluteUrl("/about"),
    },
    publisher: {
      "@type": "Organization",
      name: "Launch CV",
      url: absoluteUrl("/"),
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png") },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    wordCount: post.sections.reduce((acc, s) => acc + s.body.split(" ").length, 0),
  };

  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
    ],
  };

  const faqLd = post.faqs && post.faqs.length > 0 ? {
    "@type": "FAQPage",
    mainEntity: post.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  } : null;

  const speakableLd = {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".speakable-description"],
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            articleLd,
            breadcrumbLd,
            speakableLd,
            ...(faqLd ? [faqLd] : []),
          ],
        }}
      />
      <LandingNav />

      <main className="pt-[80px]">
        {/* Breadcrumb */}
        <div className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
          <div className="mx-auto flex max-w-[800px] items-center gap-2 px-6 py-3 font-body text-[13px] text-[#94A3B8]">
            <Link href="/" className="transition hover:text-[#1A56DB]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/blog" className="transition hover:text-[#1A56DB]">Blog</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate text-[#334155]">{post.category}</span>
          </div>
        </div>

        <div className="mx-auto max-w-[800px] px-6 py-14">
          {/* Back link */}
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 font-body text-[13px] font-semibold text-[#64748B] transition hover:text-[#1A56DB]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          {/* Header */}
          <header>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#EFF6FF] px-3 py-1 font-body text-[12px] font-semibold text-[#1A56DB]">
                {post.category}
              </span>
              <span className="flex items-center gap-1 font-body text-[12px] text-[#94A3B8]">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
              <span className="flex items-center gap-1 font-body text-[12px] text-[#94A3B8]">
                <Clock className="h-3.5 w-3.5" /> {post.readingTime} min read
              </span>
            </div>

            <h1 className="mt-5 font-display text-[32px] font-bold leading-[1.18] tracking-[-0.02em] text-[#0F172A] sm:text-[38px]">
              {post.title}
            </h1>

            <p className="speakable-description mt-5 font-body text-[18px] leading-[1.75] text-[#475569]">
              {post.description}
            </p>

            {/* Author */}
            <div className="mt-6 flex items-center gap-3 border-t border-[#E2E8F0] pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] font-display text-[15px] font-bold text-[#1A56DB]">
                L
              </div>
              <div>
                <p className="font-body text-[13px] font-semibold text-[#0F172A]">{post.author.name}</p>
                <p className="font-body text-[12px] text-[#94A3B8]">{post.author.role}</p>
              </div>
            </div>
          </header>

          {/* TOC */}
          {post.sections.length >= 3 && (
            <nav className="my-10 rounded-2xl border border-[#E2E8F0] bg-[#F8FAFC] p-5" aria-label="Table of contents">
              <p className="font-body text-[12px] font-bold uppercase tracking-[0.08em] text-[#64748B]">Contents</p>
              <ol className="mt-3 space-y-1.5">
                {post.sections.map((s, i) => (
                  <li key={s.heading}>
                    <a
                      href={`#section-${i}`}
                      className="flex items-center gap-2 font-body text-[14px] text-[#475569] transition hover:text-[#1A56DB]"
                    >
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded font-body text-[11px] font-bold text-[#94A3B8]">{i + 1}</span>
                      {s.heading}
                    </a>
                  </li>
                ))}
                {post.faqs && post.faqs.length > 0 && (
                  <li>
                    <a href="#faq" className="flex items-center gap-2 font-body text-[14px] text-[#475569] transition hover:text-[#1A56DB]">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded font-body text-[11px] font-bold text-[#94A3B8]">{post.sections.length + 1}</span>
                      Frequently Asked Questions
                    </a>
                  </li>
                )}
              </ol>
            </nav>
          )}

          {/* Article body */}
          <article className="prose-article space-y-10">
            {post.sections.map((s, i) => (
              <section key={s.heading} id={`section-${i}`}>
                <h2 className="font-display text-[22px] font-bold leading-snug text-[#0F172A]">
                  {s.heading}
                </h2>
                <div className="mt-4 space-y-4">
                  {s.body.split("\n").filter(Boolean).map((para, j) => (
                    <p key={j} className="font-body text-[16px] leading-[1.8] text-[#334155]">
                      {para}
                    </p>
                  ))}
                </div>
              </section>
            ))}
          </article>

          {/* FAQ */}
          {post.faqs && post.faqs.length > 0 && (
            <section id="faq" className="mt-14">
              <h2 className="font-display text-[22px] font-bold text-[#0F172A]">Frequently Asked Questions</h2>
              <BlogFaq items={post.faqs} />
            </section>
          )}

          {/* Tags */}
          <div className="mt-12 flex flex-wrap gap-2 border-t border-[#E2E8F0] pt-8">
            {post.tags.map((tag) => (
              <span key={tag} className="flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#F8FAFC] px-3 py-1.5 font-body text-[12px] text-[#475569]">
                <Tag className="h-3 w-3 text-[#94A3B8]" /> {tag}
              </span>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-12 rounded-2xl bg-gradient-to-r from-[#1A56DB] to-[#7C3AED] p-7 text-center">
            <p className="font-display text-[20px] font-bold text-white">Apply these tips now</p>
            <p className="mt-2 font-body text-[14px] text-white/80">Build your ATS-optimized resume with AI in under 5 minutes.</p>
            <Link
              href="/register"
              className="mt-4 inline-flex items-center gap-2 rounded-[10px] bg-white px-6 py-3 font-body text-[14px] font-bold text-[#1A56DB] shadow-lg transition hover:scale-[1.02]"
            >
              Build my resume <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>

        {/* Related posts */}
        {related.length > 0 && (
          <section className="border-t border-[#E2E8F0] bg-[#F8FAFC] py-16">
            <div className="mx-auto max-w-[1280px] px-6">
              <h2 className="font-display text-[20px] font-bold text-[#0F172A]">Related Articles</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {related.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span className="font-body text-[11px] font-semibold uppercase tracking-wide text-[#1A56DB]">{rp.category}</span>
                    <h3 className="mt-2 font-display text-[15px] font-bold leading-snug text-[#0F172A] group-hover:text-[#1A56DB] transition-colors">
                      {rp.title}
                    </h3>
                    <p className="mt-1.5 font-body text-[12px] text-[#94A3B8]">{rp.readingTime} min read</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>

      <LandingFooter />
    </div>
  );
}
