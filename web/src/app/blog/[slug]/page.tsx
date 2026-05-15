import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { buildMarketingMetadata } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { prisma } from "@/lib/prisma";
import { getPostBySlug, getPublishedSlugs, rowToBlogPost } from "@/lib/cms/blog";
import { verifyPreviewToken } from "@/lib/cms/preview-token";
import { ArrowLeft, Clock, Calendar, Tag, ChevronRight, ArrowRight } from "lucide-react";
import { BlogFaq } from "@/components/blog-faq";
import { BlogCover } from "@/components/blog-cover";

type Params = { slug: string };
type SearchParams = { preview?: string };

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
  return buildMarketingMetadata({
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.description,
    pathname: `/blog/${post.slug}`,
    keywords: post.tags,
  });
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

  // Related posts: same category, excluding current. Limit 3.
  const relatedRows = await prisma.blogPost.findMany({
    where: {
      status: "published",
      category: post.category,
      slug: { not: slug },
    },
    orderBy: { publishedAt: "desc" },
    take: 3,
  });
  const related = relatedRows.map(rowToBlogPost);

  const wordCount = post.bodyMd.split(/\s+/).filter(Boolean).length;

  const articleLd = {
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    url: absoluteUrl(`/blog/${post.slug}`),
    image: post.ogImageUrl || absoluteUrl("/opengraph-image"),
    author: { "@type": "Organization", name: post.author.name, url: absoluteUrl("/about") },
    publisher: {
      "@type": "Organization",
      name: "Launch CV",
      url: absoluteUrl("/"),
      logo: { "@type": "ImageObject", url: absoluteUrl("/icon.png") },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(`/blog/${post.slug}`) },
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
    cssSelector: ["h1", ".speakable-description"],
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [articleLd, breadcrumbLd, speakableLd, ...(faqLd ? [faqLd] : [])],
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
            <Link href="/" className="transition hover:text-[#1A56DB]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/blog" className="transition hover:text-[#1A56DB]">Blog</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="truncate text-[#334155]">{post.category}</span>
          </div>
        </div>

        <div className="mx-auto max-w-[800px] px-6 py-14">
          <Link
            href="/blog"
            className="mb-8 inline-flex items-center gap-2 text-[13px] font-semibold text-[#64748B] transition hover:text-[#1A56DB]"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </Link>

          <header>
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full bg-[#EFF6FF] px-3 py-1 text-[12px] font-semibold text-[#1A56DB]">
                {post.category}
              </span>
              <span className="flex items-center gap-1 text-[12px] text-[#94A3B8]">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
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

            <div className="mt-6 flex items-center gap-3 border-t border-[#E2E8F0] pt-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF6FF] text-[15px] font-bold text-[#1A56DB]">
                L
              </div>
              <div>
                <p className="text-[13px] font-semibold text-[#0F172A]">{post.author.name}</p>
                <p className="text-[12px] text-[#94A3B8]">{post.author.role}</p>
              </div>
            </div>
          </header>

          {/* Article body */}
          <article className="prose-article mt-10 max-w-none text-[16px] leading-[1.85] text-[#334155]">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                h1: ({ ...props }) => (
                  <h2 className="mt-10 text-[24px] font-semibold leading-snug tracking-tight text-[#0F172A]" {...props} />
                ),
                h2: ({ ...props }) => (
                  <h2 className="mt-10 text-[22px] font-semibold leading-snug tracking-tight text-[#0F172A]" {...props} />
                ),
                h3: ({ ...props }) => (
                  <h3 className="mt-8 text-[18px] font-semibold leading-snug tracking-tight text-[#0F172A]" {...props} />
                ),
                p: ({ ...props }) => <p className="mt-4" {...props} />,
                ul: ({ ...props }) => <ul className="mt-4 list-disc space-y-1.5 pl-6" {...props} />,
                ol: ({ ...props }) => <ol className="mt-4 list-decimal space-y-1.5 pl-6" {...props} />,
                a: ({ ...props }) => (
                  <a
                    className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline"
                    {...props}
                  />
                ),
                code: ({ ...props }) => (
                  <code className="rounded bg-[#F1F5F9] px-1.5 py-0.5 font-mono text-[14px] text-[#0F172A]" {...props} />
                ),
                blockquote: ({ ...props }) => (
                  <blockquote
                    className="mt-6 border-l-4 border-[#E2E8F0] pl-4 italic text-[#475569]"
                    {...props}
                  />
                ),
                img: ({ ...props }) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    {...props}
                    alt={props.alt ?? ""}
                    className="mt-6 rounded-xl border border-[#E2E8F0]"
                  />
                ),
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
            <Link
              href="/register"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#1A56DB] px-6 py-3 text-[14px] font-semibold text-white shadow-[0_1px_2px_rgba(15,23,42,0.06),0_8px_24px_-12px_rgba(26,86,219,0.4)] transition hover:bg-[#1D4ED8]"
            >
              Build my resume
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
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
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#1A56DB]">
                        {rp.category}
                      </span>
                      <h3 className="mt-2 text-[15px] font-semibold leading-snug text-[#0F172A] transition-colors group-hover:text-[#1A56DB]">
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

      <LandingFooter />
    </div>
  );
}
