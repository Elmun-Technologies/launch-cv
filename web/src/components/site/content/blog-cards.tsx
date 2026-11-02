import Link from "next/link";
import type { BlogPost } from "@/lib/cms/blog";
import { BlogPoster } from "./blog-poster";

export const fmtShortDate = (d: string) => new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" });

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w[0]?.toUpperCase())
    .slice(0, 2)
    .join("");
}

/** Grid card: poster + date/reading time + title. */
export function BlogCard({ post, variant = "card", headingLevel = "h3" }: { post: BlogPost; variant?: "card" | "related"; headingLevel?: "h2" | "h3" }) {
  const H = headingLevel;
  // Publish date: the index is sorted by it, so the dates read in order.
  const shown = post.date;
  return (
    <Link href={`/blog/${post.slug}`} className="lc-card lc-rise group block h-full rounded-[24px] p-1.5 text-[#121226] sm:rounded-[28px] sm:p-2">
      <BlogPoster post={post} size={variant} />
      <div className="px-2.5 pb-2 pt-3 sm:px-3 sm:pb-2.5 sm:pt-4">
        <p className="text-[12px] text-[#66647c] sm:text-[13px]">
          {variant === "related" ? (
            <>{post.readingTime} min read</>
          ) : (
            <>
              <time dateTime={shown}>{fmtShortDate(shown)}</time> · {post.readingTime} min read
            </>
          )}
        </p>
        <H className={`mt-1.5 font-extrabold tracking-[-0.015em] transition-colors group-hover:text-[#5440e8] sm:mt-2 ${variant === "related" ? "text-[17px] leading-[22px] sm:text-[18px] sm:leading-6" : "text-[17px] leading-[22px] sm:text-[20px] sm:leading-[26px]"}`}>
          {post.title}
        </H>
      </div>
    </Link>
  );
}

/** Large "Latest" card at the top of the blog index. */
export function FeaturedPost({ post }: { post: BlogPost }) {
  // Publish date: the index is sorted by it, so the dates read in order.
  const shown = post.date;
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="lc-card lc-rise group grid rounded-[24px] p-1.5 text-[#121226] sm:gap-3 sm:rounded-[36px] sm:p-3 lg:grid-cols-[1.2fr_0.8fr]"
    >
      <BlogPoster post={post} size="featured" priority />
      <div className="flex flex-col justify-between gap-6 px-2.5 pb-2 pt-3 sm:px-4 sm:pb-4 lg:py-6 lg:pl-4 lg:pr-6 lg:pb-5">
        <div>
          <span className="hidden rounded-full bg-[#ff7a33] px-2.5 py-[5px] text-[12px] font-bold text-[#111118] sm:inline-block">Latest</span>
          <p className="text-[12px] text-[#66647c] sm:mt-[18px] sm:text-[14px]">
            <time dateTime={shown}>{fmtShortDate(shown)}</time> · {post.readingTime} min read
          </p>
          <h2 className="mt-1.5 text-[17px] font-extrabold leading-[22px] tracking-[-0.015em] transition-colors group-hover:text-[#5440e8] sm:mt-2.5 sm:text-[28px] sm:leading-[33px] sm:tracking-[-0.03em] lg:text-[36px] lg:leading-[41px]">
            {post.title}
          </h2>
          <p className="mt-3.5 hidden text-[16px] leading-[25px] text-[#4a4862] sm:block">{post.description}</p>
        </div>
        <div className="hidden items-center justify-between sm:flex">
          <span className="flex items-center gap-2.5 text-[14px] font-semibold">
            <span aria-hidden="true" className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e4dfff] text-[13px] font-extrabold text-[#3a2bb8]">
              {initials(post.author.name)}
            </span>
            {post.author.name}
          </span>
          <span aria-hidden="true" className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-[#111118] text-white transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
            →
          </span>
        </div>
      </div>
    </Link>
  );
}
