import type { Metadata } from "next";
import { CtaLink } from "@/components/cta-link";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { labelCls, btnWhite } from "@/components/site/ui";
import { BlogCard, FeaturedPost } from "@/components/site/content/blog-cards";
import { BlogFilter } from "@/components/site/content/blog-filter";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { absoluteUrl } from "@/lib/site";
import { getPublishedPosts } from "@/lib/cms/blog";

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
  publisher: { "@id": absoluteUrl("/#organization") },
};

function Hero() {
  return (
    <section className="mx-auto max-w-[1360px] px-4 pt-5 sm:px-6 lg:px-10 lg:pt-10">
      <p className={labelCls}>/ Blog</p>
      <h1 className="mt-3.5 max-w-[980px] text-[40px] font-extrabold leading-[1.05] tracking-[-0.045em] sm:mt-5 sm:text-[56px] lg:text-[64px] lg:leading-[66px]">
        Resume and job search guides. <span className="text-[#7c7a94]">Plain English, no fluff.</span>
      </h1>
      <p className="mt-4 max-w-[640px] text-[17px] leading-7 text-[#4a4862] sm:mt-5 sm:text-[18px]">
        How applicant tracking systems read resumes, how to tailor yours to each job, and how to prepare for the
        interview that follows.
      </p>
    </section>
  );
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();
  const featured = posts[0];

  if (!featured) {
    return (
      <SiteShell>
        <JsonLd data={blogLd} />
        <Hero />
        <p className="mx-auto max-w-[1360px] px-4 pb-24 pt-8 text-[17px] text-[#4a4862] sm:px-6 lg:px-10">New guides are on the way.</p>
      </SiteShell>
    );
  }

  const categories = Array.from(new Set(posts.map((p) => p.category))).map((name) => ({
    name,
    count: posts.filter((p) => p.category === name).length,
  }));

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

  return (
    <SiteShell>
      <JsonLd data={blogLdWithPosts} />
      <Hero />

      <BlogFilter
        categories={categories}
        featured={<FeaturedPost post={featured} />}
        featuredSlug={featured.slug}
        cards={posts.map((p) => ({ slug: p.slug, category: p.category, node: <BlogCard post={p} /> }))}
      />

      {/* CTA */}
      <section className="mx-auto max-w-[1360px] px-4 pt-12 sm:px-6 lg:px-10 lg:pt-[110px]">
        <div className="lc-reveal flex flex-col items-start justify-between gap-4 rounded-[26px] bg-[#5440e8] px-5 pb-5 pt-[26px] text-white sm:gap-8 sm:rounded-[36px] sm:p-12 lg:flex-row lg:items-center lg:px-16 lg:py-14">
          <div>
            <h2 className="text-[26px] font-extrabold leading-[30px] tracking-[-0.03em] sm:text-[42px] sm:leading-[46px] sm:tracking-[-0.035em]">
              Reading is good. Checking is faster.
            </h2>
            <p className="mt-3 hidden text-[18px] text-[#e4dfff] sm:block">
              See what the software reads in your resume — free, no sign-up, about 10 seconds.
            </p>
          </div>
          <CtaLink cta="free_ats_check" location="blog_index" href="/free-ats-check" className={`${btnWhite} w-full shrink-0 sm:w-auto`}>
            Check my resume — free
          </CtaLink>
        </div>
      </section>
    </SiteShell>
  );
}
