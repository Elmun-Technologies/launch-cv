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
import { ArrowLeft, ChevronRight, ArrowRight } from "lucide-react";
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
    { href: "/free-ats-check", title: "ATS Score Checker", desc: "See how your resume reads to ATS software and fix what's filtering you out." },
    { href: "/features/jd-alignment", title: "JD Alignment", desc: "Match your resume to any job description and close every keyword gap." },
  ],
  "Resume Tips": [
    { href: "/features/resume-builder", title: "AI Resume Builder", desc: "Turn plain-language notes into quantified, ATS-ready resume bullets." },
    { href: "/free-ats-check", title: "ATS Score Checker", desc: "Get a 0–100 ATS score with a prioritized list of formatting fixes." },
  ],
  "Cover Letters": [
    { href: "/features/cover-letter", title: "AI Cover Letter Generator", desc: "Write a personalized, company-specific cover letter in about a minute." },
    { href: "/features/jd-alignment", title: "JD Alignment", desc: "Pull the job description's exact language into your application." },
  ],
  "Interview Prep": [
    { href: "/features/interview-prep", title: "AI Interview Prep", desc: "Drill role-specific questions with scored feedback and model answers." },
    { href: "/features/jd-alignment", title: "JD Alignment", desc: "Understand the role deeply before you walk into the interview." },
  ],
};

const DEFAULT_RELATED_FEATURES: FeatureLink[] = [
  { href: "/features/resume-builder", title: "AI Resume Builder", desc: "Build an ATS-ready resume with AI-written bullets in minutes." },
  { href: "/free-ats-check", title: "ATS Score Checker", desc: "Check your resume's ATS score before you apply." },
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

      <main className="flex-1 pt-[96px] text-[#111111]">
        {previewAllowed ? (
          <div className="border-b border-amber-200 bg-amber-50 px-5 py-2">
            <div className="mx-auto flex max-w-[880px] items-center gap-2 text-[12px] font-semibold text-amber-800">
              <span className="rounded-md bg-amber-100 px-2 py-0.5 text-[10px] uppercase tracking-wider">Preview</span>
              Viewing draft / scheduled post. Not visible to the public.
            </div>
          </div>
        ) : null}

        <header className="mx-auto max-w-[880px] px-5 pt-10 sm:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-[13px] text-[#6B6B6B]">
            <Link href="/" className="hover:text-[#111111]">
              Home
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <Link href="/blog" className="hover:text-[#111111]">
              Guides
            </Link>
            <ChevronRight className="h-3.5 w-3.5" aria-hidden />
            <span className="truncate text-[#3F3F3F]">{post.category}</span>
          </nav>
          <h1 className="mt-5 text-[34px] font-semibold leading-[1.08] tracking-[-0.035em] sm:text-[52px]">
            {post.title}
          </h1>
          <p className="speakable-description mt-5 text-[18px] leading-[1.6] text-[#3F3F3F] sm:text-[20px]">
            {post.description}
          </p>
          <div className="mt-6 flex items-center gap-3.5 border-b border-[#EEEEEB] pb-7 text-[14px] text-[#6B6B6B]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={SITE_AUTHOR.avatar} alt="" width={40} height={40} className="h-10 w-10 shrink-0 rounded-full" />
            <span>
              <Link href="/about" rel="author" className="block font-medium text-[#111111] hover:text-[#1D4ED8]">
                {SITE_AUTHOR.name}
              </Link>
              {showUpdated ? (
                <>
                  Updated <time dateTime={post.dateModified}>{updatedLabel}</time>
                </>
              ) : (
                <>
                  Published <time dateTime={post.date}>{publishedLabel}</time>
                </>
              )}{" "}
              · {post.readingTime} min read
            </span>
          </div>
        </header>

        <div className="mx-auto max-w-[1040px] px-5 pt-8 sm:px-8">
          <BlogCover post={post} size="hero" priority />
        </div>

        <div className="mx-auto flex max-w-[1040px] justify-center gap-16 px-5 pb-20 pt-10 sm:px-8">
          <div className="min-w-0 max-w-[680px] flex-1">
            {showToc ? (
              <div className="mb-8 lg:hidden">
                <BlogToc entries={toc} />
              </div>
            ) : null}

            <KeyFacts title="Key facts" lead={keyFacts.lead} facts={keyFacts.facts} />

            <article className="prose-article mt-10 max-w-none text-[17px] leading-[1.75] text-[#3F3F3F]">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ ...props }) => (
                    <h2 className="mt-12 scroll-mt-[96px] text-[26px] font-semibold leading-snug tracking-[-0.02em] text-[#111111]" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2
                      id={headingSlug(hastText(node as HastNode | undefined))}
                      className="mt-12 scroll-mt-[96px] text-[26px] font-semibold leading-snug tracking-[-0.02em] text-[#111111]"
                      {...props}
                    />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3
                      id={headingSlug(hastText(node as HastNode | undefined))}
                      className="mt-8 scroll-mt-[96px] text-[20px] font-semibold leading-snug tracking-[-0.01em] text-[#111111]"
                      {...props}
                    />
                  ),
                  p: ({ ...props }) => <p className="mt-5" {...props} />,
                  ul: ({ ...props }) => <ul className="mt-5 list-disc space-y-2 pl-6 marker:text-[#8A8A86]" {...props} />,
                  ol: ({ ...props }) => <ol className="mt-5 list-decimal space-y-2 pl-6 marker:text-[#8A8A86]" {...props} />,
                  strong: ({ ...props }) => <strong className="font-semibold text-[#111111]" {...props} />,
                  a: ({ href, ...props }) => {
                    const external = typeof href === "string" && /^https?:\/\//.test(href);
                    return (
                      <a
                        href={href}
                        className="text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-[3px] hover:decoration-[#1D4ED8]"
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        {...props}
                      />
                    );
                  },
                  code: ({ ...props }) => (
                    <code className="rounded bg-[#F5F5F3] px-1.5 py-0.5 font-mono text-[15px] text-[#111111]" {...props} />
                  ),
                  blockquote: ({ ...props }) => (
                    <blockquote className="mt-6 border-l-2 border-[#111111] pl-5 text-[#3F3F3F]" {...props} />
                  ),
                  table: ({ ...props }) => (
                    <div className="mt-6 overflow-x-auto">
                      <table className="w-full border-collapse text-[15px]" {...props} />
                    </div>
                  ),
                  th: ({ ...props }) => (
                    <th className="border-b border-[#E5E5E2] py-2.5 pr-4 text-left font-medium text-[#6B6B6B]" {...props} />
                  ),
                  td: ({ ...props }) => <td className="border-b border-[#EEEEEB] py-2.5 pr-4" {...props} />,
                  img: ({ src, alt }) =>
                    typeof src === "string" && src.length > 0 ? (
                      <Image
                        src={src}
                        alt={alt ?? ""}
                        width={1600}
                        height={900}
                        sizes="(max-width: 680px) 100vw, 680px"
                        className="mt-6 h-auto w-full rounded-2xl"
                      />
                    ) : null,
                }}
              >
                {post.bodyMd}
              </ReactMarkdown>
            </article>

            <div className="mt-12 flex flex-col items-start justify-between gap-5 rounded-2xl border border-[#E5E5E2] p-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-[18px] font-semibold">Check your resume now</p>
                <p className="mt-1 text-[15px] text-[#6B6B6B]">Free, no sign-up, about 10 seconds.</p>
              </div>
              <CtaLink
                cta="free_ats_check"
                location="blog_post"
                href="/free-ats-check"
                className="inline-flex h-[46px] shrink-0 items-center rounded-full bg-[#111111] px-5 text-[15px] font-medium text-white hover:bg-black"
              >
                Check my resume
              </CtaLink>
            </div>

            {post.faqs && post.faqs.length > 0 ? (
              <section id="faq" className="mt-14">
                <h2 className="text-[26px] font-semibold tracking-[-0.02em]">Frequently asked questions</h2>
                <BlogFaq items={post.faqs} />
              </section>
            ) : null}

            {post.tags.length > 0 ? (
              <p className="mt-12 flex flex-wrap gap-2 border-t border-[#EEEEEB] pt-8">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#E5E5E2] px-3 py-1.5 text-[13px] text-[#3F3F3F]">
                    {tag}
                  </span>
                ))}
              </p>
            ) : null}

            <section className="mt-12 border-t border-[#EEEEEB] pt-8">
              <p className="text-[14px] text-[#6B6B6B]">Tools for this step</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                {relatedFeatures.map((f) => (
                  <Link key={f.href} href={f.href} className="group rounded-2xl border border-[#E5E5E2] p-5 hover:border-[#111111]">
                    <p className="text-[16px] font-semibold group-hover:text-[#1D4ED8]">{f.title}</p>
                    <p className="mt-1 text-[14px] leading-[1.5] text-[#6B6B6B]">{f.desc}</p>
                  </Link>
                ))}
              </div>
            </section>

            {newerPost || olderPost ? (
              <nav aria-label="More guides" className="mt-12 grid gap-4 border-t border-[#EEEEEB] pt-8 sm:grid-cols-2">
                {newerPost ? (
                  <Link
                    href={`/blog/${newerPost.slug}`}
                    className={`group flex flex-col ${olderPost ? "" : "sm:col-span-2"}`}
                  >
                    <span className="inline-flex items-center gap-1 text-[13px] text-[#6B6B6B]">
                      <ArrowLeft className="h-3.5 w-3.5" aria-hidden /> Newer
                    </span>
                    <span className="mt-1 text-[16px] font-semibold leading-snug group-hover:text-[#1D4ED8]">
                      {newerPost.title}
                    </span>
                  </Link>
                ) : null}
                {olderPost ? (
                  <Link
                    href={`/blog/${olderPost.slug}`}
                    className={`group flex flex-col sm:items-end sm:text-right ${newerPost ? "sm:col-start-2" : "sm:col-span-2"}`}
                  >
                    <span className="inline-flex items-center gap-1 text-[13px] text-[#6B6B6B]">
                      Older <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                    </span>
                    <span className="mt-1 text-[16px] font-semibold leading-snug group-hover:text-[#1D4ED8]">
                      {olderPost.title}
                    </span>
                  </Link>
                ) : null}
              </nav>
            ) : null}
          </div>

          {showToc ? (
            <aside className="sticky top-[96px] hidden w-[200px] shrink-0 self-start lg:block">
              <BlogToc entries={toc} />
            </aside>
          ) : null}
        </div>

        {related.length > 0 ? (
          <section className="bg-[#F5F5F3] py-16 sm:py-[72px]">
            <div className="mx-auto max-w-[1200px] px-5 sm:px-8">
              <h2 className="text-[28px] font-semibold tracking-[-0.025em]">Keep reading</h2>
              <div className="mt-6 grid gap-8 sm:grid-cols-3">
                {related.map((rp) => (
                  <Link key={rp.slug} href={`/blog/${rp.slug}`} className="group flex flex-col">
                    <BlogCover post={rp} size="sm" />
                    <span className="mt-4 text-[13px] text-[#6B6B6B]">{rp.category}</span>
                    <span className="mt-1 text-[17px] font-semibold leading-snug group-hover:text-[#1D4ED8]">
                      {rp.title}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </main>

      <StickyCta
        primaryHref="/free-ats-check"
        primaryLabel="Check my resume — free"
        location="blog_post"
        revealAfter={900}
      />

      <LandingFooter />
    </div>
  );
}
