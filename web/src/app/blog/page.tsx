import type { Metadata } from "next";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { getPublishedPosts } from "@/lib/cms/blog";
import { BlogCover } from "@/components/blog-cover";

// CMS-driven via Postgres. ISR keeps the page snappy — published content is
// served from cache for up to 5 minutes; the admin API calls revalidatePath()
// after publish/update/delete so changes appear immediately.
export const revalidate = 300;

const baseMetadata: Metadata = buildMarketingMetadata({
  title: "Resume & Career Blog — ATS Tips, Templates & Guides",
  description:
    "Practical guides on ATS resumes, keywords, tailoring your resume to each job, cover letters and interview prep — with examples you can copy.",
  pathname: "/blog",
  image: DEFAULT_OG_IMAGE,
  keywords: [
    "resume tips",
    "career advice",
    "ATS resume",
    "cover letter tips",
    "interview preparation",
    "AI job search",
  ],
});

export const metadata: Metadata = {
  ...baseMetadata,
  alternates: {
    ...baseMetadata.alternates,
    types: {
      "application/rss+xml": [{ url: absoluteUrl("/blog/feed.xml"), title: "LaunchCV Career Blog" }],
    },
  },
};

const blogLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "LaunchCV Career Blog",
  description: "Evidence-based guides on resume writing, ATS optimization, cover letters, and job search strategy.",
  url: absoluteUrl("/blog"),
  publisher: {
    "@type": "Organization",
    name: "LaunchCV",
    url: absoluteUrl("/"),
    logo: { "@type": "ImageObject", url: absoluteUrl("/logo.png") },
  },
};

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const categories = Array.from(new Set(posts.map((p) => p.category)));
  const featured = posts[0];
  const rest = posts.slice(1);

  // Enrich the Blog schema with the actual post listing so search engines can
  // surface individual articles from the index page.
  const blogLdWithPosts = {
    ...blogLd,
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      url: absoluteUrl(`/blog/${post.slug}`),
      datePublished: post.date,
      image: post.ogImageUrl || undefined,
      author: { "@type": "Organization", name: post.author.name },
    })),
  };

  if (!featured) {
    return (
      <div className="flex min-h-screen flex-col bg-white text-[#111111]">
        <JsonLd data={blogLd} />
        <LandingNav />
        <main className="mx-auto max-w-[1200px] flex-1 px-5 py-32 sm:px-8">
          <h1 className="text-[44px] font-semibold tracking-[-0.04em]">Resume guides</h1>
          <p className="mt-4 text-[17px] text-[#3F3F3F]">New guides are on the way.</p>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={blogLdWithPosts} />
      <LandingNav />

      <main className="flex-1">
        <section className="mx-auto max-w-[1200px] px-5 pt-[120px] sm:px-8">
          <h1 className="max-w-[820px] text-[40px] font-semibold leading-[1.04] tracking-[-0.04em] sm:text-[56px]">
            Resume guides. <span className="text-[#8A8A86]">Practical, specific, no fluff.</span>
          </h1>
          <p className="mt-5 max-w-[600px] text-[17px] leading-[1.6] text-[#3F3F3F]">
            How applicant tracking systems read resumes, how to tailor yours to each job, and how to prepare for the
            interview that follows.
          </p>
          <p className="mt-6 flex flex-wrap gap-x-2 gap-y-2 text-[14px]">
            {categories.map((cat) => (
              <span key={cat} className="rounded-full border border-[#E5E5E2] px-3.5 py-1.5 text-[#3F3F3F]">
                {cat} · {posts.filter((p) => p.category === cat).length}
              </span>
            ))}
          </p>
        </section>

        {/* FEATURED */}
        <section className="mx-auto max-w-[1200px] px-5 pt-12 sm:px-8">
          <Link href={`/blog/${featured.slug}`} className="group grid gap-6 lg:grid-cols-[1.25fr_1fr] lg:items-center lg:gap-12">
            <BlogCover post={featured} size="lg" priority />
            <div>
              <p className="text-[14px] text-[#6B6B6B]">
                {featured.category} · {featured.readingTime} min read
              </p>
              <h2 className="mt-3 text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] group-hover:text-[#1D4ED8] sm:text-[34px]">
                {featured.title}
              </h2>
              <p className="mt-3 text-[16px] leading-[1.6] text-[#3F3F3F]">{featured.description}</p>
              <p className="mt-4 text-[14px] text-[#6B6B6B]">
                {featured.author.name} · {fmtDate(featured.dateModified || featured.date)}
              </p>
            </div>
          </Link>
        </section>

        {/* ALL POSTS */}
        <section className="mx-auto max-w-[1200px] px-5 pt-20 sm:px-8">
          <h2 className="text-[24px] font-semibold tracking-[-0.02em]">All guides</h2>
          <div className="mt-6 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {rest.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="group flex flex-col">
                <BlogCover post={post} size="md" />
                <p className="mt-4 text-[13px] text-[#6B6B6B]">
                  {post.category} · {post.readingTime} min read
                </p>
                <h3 className="mt-1.5 text-[18px] font-semibold leading-snug tracking-[-0.01em] group-hover:text-[#1D4ED8]">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-[15px] leading-[1.55] text-[#3F3F3F]">{post.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="mx-auto max-w-[1200px] px-5 py-24 sm:px-8 sm:py-[104px]">
          <div className="flex flex-col items-start justify-between gap-6 rounded-[20px] bg-[#F5F5F3] p-8 sm:flex-row sm:items-center sm:p-12">
            <div>
              <h2 className="text-[28px] font-semibold leading-[1.15] tracking-[-0.03em] sm:text-[32px]">
                Put it to the test. <span className="text-[#8A8A86]">Check your resume for free.</span>
              </h2>
              <p className="mt-2 text-[16px] text-[#3F3F3F]">No sign-up, about 10 seconds.</p>
            </div>
            <CtaLink
              cta="free_ats_check"
              location="blog_index"
              href="/free-ats-check"
              className="inline-flex h-12 shrink-0 items-center rounded-full bg-[#2563EB] px-6 text-[15px] font-medium text-white hover:bg-[#1D4ED8]"
            >
              Check my resume — free
            </CtaLink>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
