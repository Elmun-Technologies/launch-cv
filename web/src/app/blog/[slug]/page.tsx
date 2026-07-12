import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { KeyFacts } from "@/components/key-facts";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { BLOG_HOWTO, blogKeyFacts, howToLd } from "@/lib/geo";
import { absoluteUrl } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { getPostBySlug, getPublishedPosts, getPublishedSlugs, rowToBlogPost } from "@/lib/cms/blog";
import { verifyPreviewToken } from "@/lib/cms/preview-token";
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight, ArrowRight, RefreshCw } from "lucide-react";
import { BlogFaq } from "@/components/blog-faq";
import { BlogCover } from "@/components/blog-cover";
import { BlogToc } from "@/components/blog-toc";
import { SITE_AUTHOR } from "@/lib/author";
import { extractToc, createSlugger } from "@/lib/toc";
import { StickyCta } from "@/components/sticky-cta";

type Params = { slug: string };
type SearchParams = { preview?: string };

/** Recursively collect the plain text of a hast heading node (for anchor ids). */
type HastNode = { type?: string; value?: string; children?: HastNode[] };
function hastText(node: HastNode | undefined): string {
  if (!node) return "";
  if (node.type === "text") return node.value ?? "";
  if (Array.isArray(node.children)) return node.children.map(hastText).join("");
  return "";
}

type FeatureLink = { href: string; title: string; desc: string };

// Contextual feature links per blog category, so every post points readers to
// at least one relevant product feature with descriptive, keyword-rich anchors.
const RELATED_FEATURES: Record<string, FeatureLink[]> = {
  "Job Search": [
    { href: "/features/ats-score", title: "ATS Score Checker", desc: "Test your resume against 15 ATS engines and fix what's filtering you out." },
    { href: "/features/jd-alignment", title: "JD Alignment", desc: "Match your resume to any job description and close every keyword gap." },
  ],
  "Resume Tips": [
    { href: "/features/resume-builder", title: "AI Resume Builder", desc: "Turn plain-language notes into quantified, ATS-ready resume bullets." },
    { href: "/features/ats-score", title: "ATS Score Checker", desc: "Get a 0–100 ATS score with a prioritized list of formatting fixes." },
  ],
  "Cover Letters": [
    { href: "/features/cover-letter", title: "AI Cover Letter Generator", desc: "Write a personalized, company-specific cover letter in 60 seconds." },
    { href: "/features/jd-alignment", title: "JD Alignment", desc: "Pull the job description's exact language into your application." },
  ],
  "Interview Prep": [
    { href: "/features/interview-prep", title: "AI Interview Prep", desc: "Drill role-specific questions with scored feedback and model answers." },
    { href: "/features/jd-alignment", title: "JD Alignment", desc: "Understand the role deeply before you walk into the interview." },
  ],
};

const DEFAULT_RELATED_FEATURES: FeatureLink[] = [
  { href: "/features/resume-builder", title: "AI Resume Builder", desc: "Build an ATS-ready resume with AI-written bullets in minutes." },
  { href: "/features/ats-score", title: "ATS Score Checker", desc: "Check your resume's ATS score before you apply." },
];

// ISR with revalidatePath() invalidation from admin mutations.
export const revalidate = 300;

export async function generateStaticParams(): Promise<Params[]> {
  try {
    const slugs = await getPublishedSlugs();
    return slugs.map((slug) => ({ slug }));
  } catch {
    // DB unavailable during build — let pages render on-demand instead.
    return [];
  }
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  const base = buildMarketingMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.description,
    pathname: `/blog/${post.slug}`,
    keywords: post.tags,
    canonicalUrl: post.canonicalUrl || undefined,
    image: post.ogImageUrl || post.coverUrl || DEFAULT_OG_IMAGE,
    type: "article",
    article: {
      publishedTime: post.date,
      modifiedTime: post.dateModified,
      authors: [SITE_AUTHOR.name],
      section: post.category,
      tags: post.tags,
    },
  });
  const publishedIso = new Date(post.date).toISOString();
  // Type this route as an Article for richer social/search previews. The
  // per-post opengraph-image.tsx in this segment is attached automatically.
  return {
    ...base,
    openGraph: {
      type: "article",
      url: absoluteUrl(`/blog/${post.slug}`),
      title: `${post.seoTitle || post.title} | LaunchCV`,
      description: post.seoDescription || post.description,
      siteName: "LaunchCV",
      locale: "en_US",
      publishedTime: publishedIso,
      modifiedTime: publishedIso,
      authors: [absoluteUrl("/about")],
      section: post.category,
      tags: post.tags,
    },
  };
}

export default async function BlogPostPage({
  params,
  searchParams,
}: {
  params: Promise<Params>;
  searchParams: Promise<SearchParams>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const previewAllowed = verifyPreviewToken(slug, sp.preview);

  const post = await getPostBySlug(slug, { previewAllowed });
  if (!post) notFound();

  // Related posts: same category first, excluding current. Limit 3.
  const relatedRows = await prisma.blogPost.findMany({
    where: {
      status: "published",
      category: post.category,
      slug: { not: slug },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
  let related = relatedRows.map(rowToBlogPost);

  // Guarantee at least 2 related posts even for thin or singleton categories
  // (e.g. Cover Letters, Interview Prep) by topping up with the most recent
  // posts from other categories.
  if (related.length < 2) {
    const excludeSlugs = [slug, ...related.map((r) => r.slug)];
    const fillRows = await prisma.blogPost.findMany({
      where: { status: "published", slug: { notIn: excludeSlugs } },
      orderBy: { publishedAt: "desc" },
      take: 3 - related.length,
    });
    related = [...related, ...fillRows.map(rowToBlogPost)];
  }

  // Every post links to at least one relevant feature, keyed by category.
  const relatedFeatures = RELATED_FEATURES[post.category] ?? DEFAULT_RELATED_FEATURES;

  // Prev/next navigation across all posts (newest-first) for deeper crawlability.
  const allPosts = await getPublishedPosts();
  const currentIndex = allPosts.findIndex((p) => p.slug === slug);
  const newerPost = currentIndex > 0 ? allPosts[currentIndex - 1] : null;
  const olderPost =
    currentIndex >= 0 && currentIndex < allPosts.length - 1 ? allPosts[currentIndex + 1] : null;

  const wordCount = post.bodyMd.split(/\s+/).filter(Boolean).length;

  const canonicalUrl = post.canonicalUrl?.trim() || absoluteUrl(`/blog/${post.slug}`);

  // Table of contents (H2/H3). Only shown on longer posts; `slug` mirrors the
  // slugger used when rendering the Markdown headings so anchors line up.
  const toc = extractToc(post.bodyMd);
  const showToc = toc.length >= 3;
  const headingSlug = createSlugger();

  const publishedLabel = new Date(post.date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const updatedLabel = new Date(post.dateModified).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const showUpdated = post.dateModified > post.date;

  const articleLd = {
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.dateModified,
    url: absoluteUrl(`/blog/${post.slug}`),
    image: post.ogImageUrl || absoluteUrl("/opengraph-image"),
    author: {
      "@type": "Person",
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.url,
      image: SITE_AUTHOR.avatar,
      jobTitle: SITE_AUTHOR.role,
      description: SITE_AUTHOR.bio,
    },
    publisher: {
      "@type": "Organization",
      name: "LaunchCV",
      url: absoluteUrl("/"),
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png") },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    keywords: post.tags.join(", "),
    articleSection: post.category,
    wordCount,
  };

  const breadcrumbLd = {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
      { "@type": "ListItem", position: 2, name: "Blog", item: absoluteUrl("/blog") },
      { "@type": "ListItem", position: 3, name: post.title, item: absoluteUrl(`/blog/${post.slug}`) },
    ],
  };

  const faqLd =
    post.faqs && post.faqs.length > 0
      ? {
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

  const speakableLd = {
    "@type": "SpeakableSpecification",
    cssSelector: ["h1", ".speakable-description", ".lc-key-facts-lead"],
  };

  // HowTo structured data for step-based guides. Steps mirror the visible
  // step sections in the post body, so the schema always matches on-page copy.
  const howtoDef = BLOG_HOWTO[post.slug];
  const howtoLdNode = howtoDef
    ? howToLd({ ...howtoDef, url: absoluteUrl(`/blog/${post.slug}`) })
    : null;

  // Key-facts / TL;DR answer box derived from the post's own description and FAQs.
  const keyFacts = blogKeyFacts(post);

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            articleLd,
            breadcrumbLd,
            speakableLd,
            ...(howtoLdNode ? [howtoLdNode] : []),
            ...(faqLd ? [faqLd] : []),
          ],
        }}
      />
      <LandingNav />

      <main className="pt-[80px]">
        {/* Preview banner */}
        {previewAllowed ? (
          <div className="border-b border-amber-200 bg-amber-50 px-6 py-2">
            <div className="mx-auto flex max-w-[800px] items-center gap-2 text-[12px] font-semibold text-amber-800">
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] uppercase tracking-wider">Preview</span>
              Viewing draft / scheduled post. Not visible to the public.
            </div>
          </div>
        ) : null}

        {/* Breadcrumb */}
        <div className="border-b border-[#E2E8F0] bg-[#FAFBFC]">
          <div className="mx-auto flex max-w-[800px] items-center gap-2 px-6 py-3 text-[13px] text-[#94A3B8]">
            <Link href="/" className="transition hover:text-[#2563EB]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/blog" className="transition hover:text-[#2563EB]">Blog</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate text-[#334155]">{post.category}</span>
          </div>
        </div>

        <div className="mx-auto max-w-[800px] px-6 py-14">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748B] transition hover:text-[#2563EB]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <header>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[12px] font-semibold text-[#2563EB]">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-[#94A3B8]">
                <Calendar className="h-3.5 w-3.5" />
                Published{" "}
                <time dateTime={post.date}>{publishedLabel}</time>
              </span>
              {showUpdated ? (
                <span className="flex items-center gap-1 text-[12px] text-[#94A3B8]">
                  <RefreshCw className="h-3.5 w-3.5" />
                  Updated{" "}
                  <time dateTime={post.dateModified}>{updatedLabel}</time>
                </span>
              ) : null}
              <span className="flex items-center gap-1 text-[12px] text-[#94A3B8]">
                <Clock className="h-3.5 w-3.5" /> {post.readingTime} min read
              </span>
            </div>

            <h1 className="mt-5 text-[32px] font-semibold leading-[1.15] tracking-tight text-[#0F172A] sm:text-[40px]">
              {post.title}
            </h1>

            <p className="speakable-description mt-5 text-[18px] leading-[1.75] text-[#475569]">
              {post.description}
            </p>

            {/* Cover */}
            <div className="mt-8">
              <BlogCover post={post} size="hero" />
            </div>

            <div className="mt-6 flex items-start gap-4 border-t border-[#E2E8F0] pt-5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={SITE_AUTHOR.avatar}
                alt={SITE_AUTHOR.name}
                width={44}
                height={44}
                className="h-11 w-11 flex-shrink-0 rounded-full"
              />
              <div>
                <p className="text-[13px] font-semibold text-[#0F172A]">
                  <Link href="/about" className="transition hover:text-[#2563EB]" rel="author">
                    {SITE_AUTHOR.name}
                  </Link>
                </p>
                <p className="text-[12px] text-[#94A3B8]">{SITE_AUTHOR.role}</p>
                <p className="mt-1.5 max-w-[560px] text-[12px] leading-[1.6] text-[#64748B]">
                  {SITE_AUTHOR.bio}{" "}
                  <Link
                    href="/about"
                    className="font-semibold text-[#2563EB] underline-offset-2 hover:underline"
                  >
                    More about the author
                  </Link>
                </p>
              </div>
            </div>

            {showToc ? <BlogToc entries={toc} /> : null}
          </header>

          {/* Key facts / TL;DR — concise, liftable answer box near the top */}
          <KeyFacts className="mt-10" title="Key facts" lead={keyFacts.lead} facts={keyFacts.facts} />

          {/* Article body */}
          <article className="prose-article mt-10 max-w-none text-[16px] leading-[1.85] text-[#334155]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => (
                  <h2 className="mt-10 scroll-mt-[96px] text-[24px] font-semibold leading-snug tracking-tight text-[#0F172A]" {...props} />
                ),
                h2: ({ node, ...props }) => (
                  <h2
                    id={headingSlug(hastText(node as HastNode | undefined))}
                    className="mt-10 scroll-mt-[96px] text-[22px] font-semibold leading-snug tracking-tight text-[#0F172A]"
                    {...props}
                  />
                ),
                h3: ({ node, ...props }) => (
                  <h3
                    id={headingSlug(hastText(node as HastNode | undefined))}
                    className="mt-8 scroll-mt-[96px] text-[18px] font-semibold leading-snug tracking-tight text-[#0F172A]"
                    {...props}
                  />
                ),
                p: ({ ...props }) => <p className="mt-4" {...props} />,
                ul: ({ ...props }) => <ul className="mt-4 list-disc space-y-1.5 pl-6" {...props} />,
                ol: ({ ...props }) => <ol className="mt-4 list-decimal space-y-1.5 pl-6" {...props} />,
                a: ({ href, ...props }) => {
                  const external = typeof href === "string" && /^https?:\/\//.test(href);
                  return (
                    <a
                      href={href}
                      className="font-semibold text-[#2563EB] underline-offset-2 hover:underline"
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      {...props}
                    />
                  );
                },
                code: ({ ...props }) => (
                  <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[14px] text-[#0F172A]" {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="mt-6 border-l-4 border-[#E2E8F0] pl-4 italic text-[#475569]"
                    {...props}
                  />
                ),
                img: ({ src, alt }) =>
                  typeof src === "string" && src.length > 0 ? (
                    <Image
                      src={src}
                      alt={alt ?? ""}
                      width={1600}
                      height={900}
                      sizes="(max-width: 800px) 100vw, 800px"
                      className="mt-6 h-auto w-full rounded-xl border border-[#E2E8F0]"
                    />
                  ) : null,
              }}
            >
              {post.bodyMd}
            </ReactMarkdown>
          </article>

          {post.faqs && post.faqs.length > 0 ? (
            <section id="faq" className="mt-14">
              <h2 className="text-[22px] font-semibold tracking-tight text-[#0F172A]">Frequently Asked Questions</h2>
              <BlogFaq items={post.faqs} />
            </section>
          ) : null}

          <div className="mt-12 flex flex-wrap gap-2 border-t border-[#E2E8F0] pt-8">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="flex items-center gap-1.5 rounded-full border border-[#E2E8F0] bg-[#FAFBFC] px-3 py-1.5 text-[12px] text-[#475569]"
              >
                <Tag className="h-3 w-3 text-[#94A3B8]" /> {tag}
              </span>
            ))}
          </div>

          <div className="mt-12 rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] p-7 text-center">
            <p className="text-[20px] font-semibold tracking-tight text-[#0F172A]">Apply these tips now</p>
            <p className="mx-auto mt-2 max-w-[440px] text-[14px] leading-[1.65] text-[#475569]">
              Build your ATS-optimized resume with AI in under five minutes.
            </p>
            <CtaLink cta="get_started" location="blog_post"
              href="/register"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
            >
              Build my resume
              <ArrowRight className="h-4 w-4" />
            </CtaLink>
          </div>

          {newerPost || olderPost ? (
            <nav className="mt-12 grid gap-4 border-t border-[#E2E8F0] pt-8 sm:grid-cols-2">
              {newerPost ? (
                <Link
                  href={`/blog/${newerPost.slug}`}
                  className={`group flex flex-col rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1] ${
                    olderPost ? "" : "sm:col-span-2"
                  }`}
                >
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                    <ArrowLeft className="h-3 w-3" /> Newer article
                  </span>
                  <p className="mt-1.5 text-[14px] font-semibold leading-snug text-[#0F172A] transition group-hover:text-[#2563EB]">
                    {newerPost.title}
                  </p>
                </Link>
              ) : null}
              {olderPost ? (
                <Link
                  href={`/blog/${olderPost.slug}`}
                  className={`group flex flex-col items-end rounded-xl border border-[#E2E8F0] bg-white p-5 text-right transition hover:border-[#CBD5E1] ${
                    newerPost ? "sm:col-start-2" : "sm:col-span-2"
                  }`}
                >
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                    Older article <ArrowRight className="h-3 w-3" />
                  </span>
                  <p className="mt-1.5 text-[14px] font-semibold leading-snug text-[#0F172A] transition group-hover:text-[#2563EB]">
                    {olderPost.title}
                  </p>
                </Link>
              ) : null}
            </nav>
          ) : null}

          {/* Related features — every post points to at least one relevant tool */}
          <section className="mt-12 border-t border-[#E2E8F0] pt-8">
            <p className="text-[12px] font-semibold uppercase tracking-wider text-[#94A3B8]">
              Related features
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {relatedFeatures.map((f) => (
                <Link
                  key={f.href}
                  href={f.href}
                  className="group rounded-xl border border-[#E2E8F0] bg-white p-5 transition hover:border-[#CBD5E1]"
                >
                  <p className="text-[14px] font-semibold text-[#0F172A] transition group-hover:text-[#2563EB]">
                    {f.title}
                  </p>
                  <p className="mt-1 text-[13px] text-[#64748B]">{f.desc}</p>
                </Link>
              ))}
            </div>
          </section>
        </div>

        {related.length > 0 ? (
          <section className="border-t border-[#E2E8F0] bg-[#FAFBFC] py-16">
            <div className="mx-auto max-w-[1280px] px-6">
              <h2 className="text-[20px] font-semibold tracking-tight text-[#0F172A]">Related articles</h2>
              <div className="mt-8 grid gap-5 sm:grid-cols-3">
                {related.map((rp) => (
                  <Link
                    key={rp.slug}
                    href={`/blog/${rp.slug}`}
                    className="group flex flex-col overflow-hidden rounded-xl border border-[#E2E8F0] bg-white p-4 transition hover:border-[#CBD5E1] hover:shadow-[0_10px_30px_-15px_rgba(15,23,42,0.15)]"
                  >
                    <BlogCover post={rp} size="sm" />
                    <div className="mt-4 px-1 pb-1">
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#2563EB]">
                        {rp.category}
                      </span>
                      <h3 className="mt-2 text-[15px] font-semibold leading-snug text-[#0F172A] transition-colors group-hover:text-[#2563EB]">
                        {rp.title}
                      </h3>
                      <p className="mt-1.5 text-[12px] text-[#94A3B8]">{rp.readingTime} min read</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <StickyCta
        primaryHref="/register"
        primaryLabel="Build my resume"
        location="blog_post"
        revealAfter={900}
      />

      <LandingFooter />
    </div>
  );
}
