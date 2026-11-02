import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CtaLink } from "@/components/cta-link";
import { JsonLd } from "@/components/json-ld";
import { StickyCta } from "@/components/sticky-cta";
import { SiteShell } from "@/components/site/site-shell";
import { labelCls } from "@/components/site/ui";
import { BlogPoster } from "@/components/site/content/blog-poster";
import { BlogCard, initials } from "@/components/site/content/blog-cards";
import { ContentToc, ContentTocMobile } from "@/components/site/content/content-toc";
import { FaqList, KeyFactsCard } from "@/components/site/content/key-facts";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { BLOG_HOWTO, blogKeyFacts, howToLd } from "@/lib/geo";
import { absoluteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { getPostBySlug, getPublishedPosts, getPublishedSlugs, rowToBlogPost } from "@/lib/cms/blog";
import { verifyPreviewToken } from "@/lib/cms/preview-token";
import { SITE_AUTHOR, SITE_AUTHOR_ID } from "@/lib/author";
import { extractToc, createSlugger } from "@/lib/toc";

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
    { href: "/resignation-letter", title: "Resignation Letter Templates", desc: "Got the offer? Give notice with a short, professional letter." },
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
    // Social cards can't use SVG; fall back to this post's generated card.
    image: [post.ogImageUrl, post.coverUrl].find((u) => u && !/\.svg(\?|$)/i.test(u)) || absoluteUrl(`/blog/${post.slug}/opengraph-image`),
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

/** Article body typography (v5). Long URLs and code wrap or scroll inside the column. */
const articleCls = [
  "text-[17px] leading-[28px] text-[#24223a] sm:text-[18px] sm:leading-[30px] [overflow-wrap:anywhere]",
  "[&>h2:first-child]:mt-0 [&>p:first-child]:mt-0",
  "[&_em]:italic [&_li>p]:mt-0",
  "[&_pre]:mt-5 [&_pre]:overflow-x-auto [&_pre]:rounded-2xl [&_pre]:bg-[#111118] [&_pre]:p-5 [&_pre]:text-[14px] [&_pre]:leading-6 [&_pre]:text-[#e9e7f3] [&_pre]:[overflow-wrap:normal]",
  "[&_pre_code]:bg-transparent [&_pre_code]:p-0 [&_pre_code]:text-inherit",
].join(" ");

const h2Cls = "mt-10 scroll-mt-6 text-[26px] font-extrabold leading-[31px] tracking-[-0.02em] text-[#121226] sm:mt-[52px] sm:text-[32px] sm:leading-[38px] sm:tracking-[-0.025em]";
const h3Cls = "mt-7 scroll-mt-6 text-[20px] font-extrabold leading-snug tracking-[-0.01em] text-[#121226] sm:text-[21px]";

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
  const postUrl = absoluteUrl(`/blog/${post.slug}`);

  // Table of contents (H2/H3). Only shown on longer posts; `slug` mirrors the
  // slugger used when rendering the Markdown headings so anchors line up.
  const toc = extractToc(post.bodyMd);
  const showToc = toc.length >= 3;
  // Phones get a short, numbered list of the main sections only.
  const tocTop = toc.filter((e) => e.depth !== 3);
  // Score posts get the score-band card in the sidebar.
  const isAtsScorePost = /\bats[- ]score/i.test(`${post.slug} ${post.title} ${post.tags.join(" ")}`);
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
    image: post.ogImageUrl && !/\.svg(\?|$)/i.test(post.ogImageUrl) ? post.ogImageUrl : absoluteUrl(`/blog/${post.slug}/opengraph-image`),
    author: {
      "@type": "Person",
      "@id": SITE_AUTHOR_ID,
      name: SITE_AUTHOR.name,
      url: SITE_AUTHOR.url,
      image: SITE_AUTHOR.avatar,
      jobTitle: SITE_AUTHOR.role,
      description: SITE_AUTHOR.bio,
    },
    publisher: orgRef,
    isPartOf: { "@id": WEBSITE_ID },
    inLanguage: "en-US",
    mainEntityOfPage: { "@type": "WebPage", "@id": canonicalUrl },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable-description", ".lc-key-facts-lead"],
    },
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

  // HowTo structured data for step-based guides. Steps mirror the visible
  // step sections in the post body, so the schema always matches on-page copy.
  const howtoDef = BLOG_HOWTO[post.slug];
  const howtoLdNode = howtoDef
    ? howToLd({ ...howtoDef, url: absoluteUrl(`/blog/${post.slug}`) })
    : null;

  // Key-facts / TL;DR answer box derived from the post's own description and FAQs.
  const keyFacts = blogKeyFacts(post);

  const share = [
    { label: "LinkedIn", href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(postUrl)}` },
    { label: "X", href: `https://x.com/intent/post?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(post.title)}` },
    { label: "Email", href: `mailto:?subject=${encodeURIComponent(post.title)}&body=${encodeURIComponent(postUrl)}` },
  ];

  // Three columns (TOC · article · sidebar) on wide screens; the sidebar drops
  // below the article on narrower ones. Without a TOC the sidebar sits beside
  // the article from lg up.
  const gridCls = showToc
    ? "lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-x-12 xl:grid-cols-[240px_minmax(0,1fr)_260px] xl:gap-x-14"
    : "lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-x-14";
  const asideCls = showToc
    ? "lg:col-start-2 xl:col-start-3 xl:row-start-1 xl:sticky xl:top-6 xl:self-start"
    : "lg:col-start-2 lg:row-start-1 lg:sticky lg:top-6 lg:self-start";

  return (
    <SiteShell>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            articleLd,
            breadcrumbLd,
            ...(howtoLdNode ? [howtoLdNode] : []),
            ...(faqLd ? [faqLd] : []),
          ],
        }}
      />

      {previewAllowed ? (
        <div className="mx-auto max-w-[1360px] px-4 sm:px-6 lg:px-10">
          <p className="flex items-center gap-2 rounded-2xl bg-[#fdf0d5] px-4 py-2.5 text-[13px] font-semibold text-[#7a4600]">
            <span className="rounded-full bg-white px-2 py-0.5 text-[11px] uppercase tracking-wider">Preview</span>
            Viewing draft / scheduled post. Not visible to the public.
          </p>
        </div>
      ) : null}

      {/* ARTICLE HEAD */}
      <header className="mx-auto max-w-[1360px] px-4 pt-4 sm:px-6 lg:px-10 lg:pt-8">
        <nav aria-label="Breadcrumb" className="text-[12px] text-[#66647c] sm:text-[14px]">
          <ol className="flex flex-wrap items-center gap-1.5">
            <li className="flex items-center gap-1.5">
              <Link href="/" className="lc-link hover:text-[#5440e8]">
                Home
              </Link>
              <span aria-hidden="true">/</span>
            </li>
            <li className="flex items-center gap-1.5">
              <Link href="/blog" className="lc-link hover:text-[#5440e8]">
                Blog
              </Link>
              <span aria-hidden="true">/</span>
            </li>
            <li className="font-semibold text-[#121226]">{post.category}</li>
          </ol>
        </nav>
        <h1 className="mt-3.5 max-w-[1040px] text-[32px] font-extrabold leading-[36px] tracking-[-0.04em] sm:mt-[22px] sm:text-[48px] sm:leading-[52px] lg:text-[60px] lg:leading-[64px] lg:tracking-[-0.045em]">
          {post.title}
        </h1>
        <p className="speakable-description mt-4 max-w-[780px] text-[17px] leading-[27px] text-[#4a4862] sm:mt-5 sm:text-[20px] sm:leading-[31px]">
          {post.description}
        </p>
        <div className="mt-4 flex items-center gap-2.5 text-[13px] sm:mt-[26px] sm:gap-3.5 sm:text-[15px]">
          <span aria-hidden="true" className="inline-flex h-9 w-9 flex-none items-center justify-center rounded-full bg-[#e4dfff] font-extrabold text-[#3a2bb8] sm:h-11 sm:w-11">
            {initials(SITE_AUTHOR.name)}
          </span>
          <span>
            <Link href={SITE_AUTHOR.path} rel="author" className="lc-link block w-fit font-bold text-[#121226] hover:text-[#5440e8]">
              {SITE_AUTHOR.name}
            </Link>
            <span className="block text-[#66647c]">
              <span className="hidden sm:inline">{SITE_AUTHOR.role} · </span>
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
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-[1360px] px-4 pt-5 sm:px-6 sm:pt-8 lg:px-10 lg:pt-10">
        <BlogPoster post={post} size="hero" priority />
      </div>

      {/* BODY */}
      <div className={`mx-auto grid max-w-[1360px] items-start gap-y-8 px-4 pt-5 sm:px-6 sm:pt-10 lg:px-10 lg:pt-16 ${gridCls}`}>
        {showToc ? (
          <div className="hidden lg:sticky lg:top-6 lg:row-span-2 lg:block lg:self-start">
            <ContentToc entries={toc} />
          </div>
        ) : null}

        <div className="min-w-0 max-w-[720px]">
          {showToc ? (
            <div className="mb-7 lg:hidden">
              <ContentTocMobile entries={tocTop} numbered />
            </div>
          ) : null}

          <KeyFactsCard title="Key facts" lead={keyFacts.lead} facts={keyFacts.facts} />

          <article className={`mt-10 ${articleCls}`}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => <h2 className={h2Cls} {...props} />,
                h2: ({ node, ...props }) => <h2 id={headingSlug(hastText(node as HastNode | undefined))} className={h2Cls} {...props} />,
                h3: ({ node, ...props }) => <h3 id={headingSlug(hastText(node as HastNode | undefined))} className={h3Cls} {...props} />,
                p: ({ ...props }) => <p className="mt-4" {...props} />,
                ul: ({ ...props }) => <ul className="mt-4 flex list-disc flex-col gap-2 pl-[22px] marker:text-[#5440e8]" {...props} />,
                ol: ({ ...props }) => <ol className="mt-4 flex list-decimal flex-col gap-2 pl-[22px] marker:font-bold marker:text-[#5440e8]" {...props} />,
                strong: ({ ...props }) => <strong className="font-bold text-[#121226]" {...props} />,
                a: ({ href, ...props }) => {
                  const external = typeof href === "string" && /^https?:\/\//.test(href);
                  return (
                    <a
                      href={href}
                      className="font-semibold text-[#5440e8] underline decoration-[#5440e8]/40 underline-offset-[3px] transition-colors hover:text-[#4430d6] hover:decoration-[#4430d6]"
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                      {...props}
                    />
                  );
                },
                code: ({ ...props }) => <code className="lc-mono rounded-md bg-[#f1eff8] px-1.5 py-0.5 text-[0.85em] text-[#121226]" {...props} />,
                blockquote: ({ ...props }) => (
                  <blockquote className="mt-6 rounded-r-2xl border-l-4 border-[#5440e8] bg-white px-5 py-4 text-[#4a4862] [&>p:first-child]:mt-0" {...props} />
                ),
                hr: () => <hr className="my-10 border-[#e2e0ea]" />,
                table: ({ ...props }) => (
                  <div className="relative mt-6 overflow-x-auto rounded-2xl bg-white p-1 [overflow-wrap:normal]">
                    <table className="w-full border-collapse text-[15px] leading-6" {...props} />
                  </div>
                ),
                th: ({ ...props }) => <th className="border-b border-[#e2e0ea] px-4 py-3 text-left font-bold text-[#121226]" {...props} />,
                td: ({ ...props }) => <td className="border-b border-[#efedf7] px-4 py-3 align-top" {...props} />,
                img: ({ src, alt }) =>
                  typeof src === "string" && src.length > 0 ? (
                    <Image
                      src={src}
                      alt={alt ?? ""}
                      width={1600}
                      height={900}
                      sizes="(min-width: 768px) 720px, 100vw"
                      className="mt-6 h-auto w-full rounded-[20px]"
                    />
                  ) : null,
              }}
            >
              {post.bodyMd}
            </ReactMarkdown>
          </article>

          {post.faqs && post.faqs.length > 0 ? (
            <section id="faq" aria-labelledby="faq-title" className="mt-14 scroll-mt-6">
              <h2 id="faq-title" className="text-[26px] font-extrabold leading-[31px] tracking-[-0.02em] sm:text-[32px] sm:leading-[38px]">
                Frequently asked questions
              </h2>
              <div className="mt-5">
                <FaqList items={post.faqs} />
              </div>
            </section>
          ) : null}

          {post.tags.length > 0 ? (
            <ul aria-label="Topics" className="mt-12 flex flex-wrap gap-2 border-t border-[#d9d4f2] pt-8">
              {post.tags.map((tag) => (
                <li key={tag} className="rounded-full bg-white px-3 py-1.5 text-[13px] font-semibold text-[#4a4862]">
                  {tag}
                </li>
              ))}
            </ul>
          ) : null}

          {/* Author + share */}
          <div className="mt-8 flex flex-col gap-5 rounded-[24px] bg-white p-5 sm:flex-row sm:items-start sm:p-6">
            <span aria-hidden="true" className="inline-flex h-14 w-14 flex-none items-center justify-center rounded-full bg-[#5440e8] text-[18px] font-extrabold text-white">
              {initials(SITE_AUTHOR.name)}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-bold tracking-[0.08em] text-[#66647c]">WRITTEN BY</p>
              <Link href={SITE_AUTHOR.path} rel="author" className="lc-link mt-1 inline-block text-[18px] font-extrabold text-[#121226] hover:text-[#5440e8]">
                {SITE_AUTHOR.name}
              </Link>
              <p className="text-[14px] text-[#66647c]">{SITE_AUTHOR.role}</p>
              <p className="mt-2.5 text-[15px] leading-6 text-[#4a4862]">{SITE_AUTHOR.bio}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="mr-1 text-[13px] font-semibold text-[#66647c]">Share</span>
                {share.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    {...(s.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="lc-btn-lift inline-flex min-h-[44px] items-center rounded-full bg-[#f1eff8] px-4 text-[14px] font-semibold text-[#121226] hover:bg-[#e4dfff]"
                  >
                    {s.label}
                    {s.href.startsWith("http") ? <span className="sr-only"> (opens in a new tab)</span> : null}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* SIDEBAR — CTA and tools for this step */}
        <aside aria-label="Check your resume" className={`flex min-w-0 max-w-[720px] flex-col gap-3 ${asideCls}`}>
          <div className="rounded-[24px] bg-[#5440e8] p-[22px] text-white sm:rounded-[28px] sm:p-6">
            <p className="text-[22px] font-extrabold leading-[27px] tracking-[-0.02em]">What&apos;s your ATS score?</p>
            <p className="mt-2 text-[14px] leading-[21px] text-[#e4dfff]">Free, no sign-up, about 10 seconds.</p>
            <CtaLink
              cta="free_ats_check"
              location="blog_post"
              href="/free-ats-check"
              className="lc-btn-lift mt-4 inline-flex w-full items-center justify-center rounded-full bg-white p-3.5 text-[15px] font-semibold text-[#121226] sm:w-auto xl:w-full"
            >
              Check my resume
            </CtaLink>
          </div>
          <div className="lc-card rounded-[24px] p-5">
            <p className="text-[12px] font-bold tracking-[0.08em] text-[#66647c]">TOOLS FOR THIS STEP</p>
            <ul className="mt-3 flex flex-col gap-2">
              {relatedFeatures.map((f) => (
                <li key={f.href}>
                  <Link href={f.href} className="group block rounded-2xl bg-[#f7f6fb] px-4 py-3 transition-colors hover:bg-[#e4dfff]">
                    <span className="block text-[15px] font-bold text-[#121226] group-hover:text-[#3a2bb8]">{f.title} →</span>
                    <span className="mt-0.5 block text-[13px] leading-5 text-[#4a4862]">{f.desc}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {isAtsScorePost ? (
            // The same bands the free ATS check uses to color its score (80 / 65).
            <div className="lc-card rounded-[24px] p-5">
              <p className="text-[12px] font-bold tracking-[0.08em] text-[#66647c]">GOOD SCORE</p>
              <ul className="mt-3 flex flex-col gap-1.5 text-[14px] font-semibold">
                <li className="rounded-xl bg-[#dcf5ea] px-3 py-2 text-[#0b4f35]">80–100 · strong</li>
                <li className="rounded-xl bg-[#fdf0d5] px-3 py-2 text-[#7a4600]">65–79 · decent</li>
                <li className="rounded-xl bg-[#fbe2e3] px-3 py-2 text-[#8f1d22]">Below 65 · at risk</li>
              </ul>
              <p className="mt-2.5 text-[12px] leading-[18px] text-[#66647c]">The bands LaunchCV&apos;s free ATS check uses.</p>
            </div>
          ) : null}
        </aside>
      </div>

      {/* NEWER / OLDER */}
      {newerPost || olderPost ? (
        <nav aria-label="More guides" className="mx-auto grid max-w-[1360px] gap-3 px-4 pt-12 sm:grid-cols-2 sm:px-6 lg:px-10 lg:pt-16">
          {newerPost ? (
            <Link href={`/blog/${newerPost.slug}`} className={`lc-card lc-rise group flex flex-col rounded-[24px] p-5 sm:p-6 ${olderPost ? "" : "sm:col-span-2"}`}>
              <span className="text-[13px] font-semibold text-[#66647c]">← Newer</span>
              <span className="mt-1.5 text-[17px] font-extrabold leading-snug group-hover:text-[#5440e8]">{newerPost.title}</span>
            </Link>
          ) : null}
          {olderPost ? (
            <Link
              href={`/blog/${olderPost.slug}`}
              className={`lc-card lc-rise group flex flex-col rounded-[24px] p-5 sm:items-end sm:p-6 sm:text-right ${newerPost ? "sm:col-start-2" : "sm:col-span-2"}`}
            >
              <span className="text-[13px] font-semibold text-[#66647c]">Older →</span>
              <span className="mt-1.5 text-[17px] font-extrabold leading-snug group-hover:text-[#5440e8]">{olderPost.title}</span>
            </Link>
          ) : null}
        </nav>
      ) : null}

      {/* RELATED */}
      {related.length > 0 ? (
        <section aria-labelledby="read-next" className="mx-auto max-w-[1360px] px-4 pt-16 sm:px-6 lg:px-10 lg:pt-[110px]">
          <div className="flex items-end justify-between gap-4">
            <h2 id="read-next" className={labelCls}>
              / Read next
            </h2>
            <Link href="/blog" className="inline-flex min-h-[44px] items-center text-[15px] font-semibold text-[#5440e8] hover:text-[#4430d6]">
              <span className="lc-link">All guides →</span>
            </Link>
          </div>
          <ul className="mt-5 grid gap-2.5 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
            {related.map((rp) => (
              <li key={rp.slug} className="lc-reveal">
                <BlogCard post={rp} variant="related" />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <div className="xl:hidden">
        <StickyCta
          primaryHref="/free-ats-check"
          primaryLabel="Check my resume — free"
          primaryClassName="bg-[#5440e8] hover:bg-[#4430d6]"
          location="blog_post"
          revealAfter={900}
        />
      </div>
    </SiteShell>
  );
}
