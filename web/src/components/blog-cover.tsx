import Image from "next/image";

/** Minimal shape required by the cover — accepts either the static or DB BlogPost type. */
type BlogPost = {
  slug: string;
  category: string;
  readingTime: number;
  coverUrl?: string | null;
  coverAlt?: string | null;
};

type Photo = { src: string; alt: string };

const P = (name: string, alt: string): Photo => ({ src: `/images/photos/${name}.webp`, alt });

const photoBySlug: Record<string, Photo> = {
  "what-is-an-ats-score": P("resume-clipboard", "Clipboard with a resume next to a laptop"),
  "what-is-ats-and-how-does-it-work": P("recruiter-desk", "Recruiter reviewing applications at a desk"),
  "how-to-check-ats-score-of-resume": P("resume-review-desk", "Hands reviewing a printed resume next to a laptop"),
  "how-to-write-an-ats-friendly-resume": P("role-hr", "HR specialist reviewing applications"),
  "how-to-tailor-your-resume-for-every-job": P("role-product-manager", "Professional reworking a document at a desk"),
  "resume-keywords-for-software-engineers": P("role-software-engineer", "Software engineer working at a laptop"),
  "cover-letter-tips-that-actually-work": P("handshake-desk", "Two people shaking hands across a desk"),
  "how-to-prepare-for-a-job-interview-with-ai": P("interview-panel", "Candidate in an interview with a hiring panel"),
  "voice-to-resume": P("job-seeker-laptop", "Person talking through their experience at a laptop"),
  "ai-resume-builder-complete-guide": P("role-designer", "Person working on a resume layout on screen"),
};

const photoByCategory: Record<string, Photo> = {
  "Resume Tips": P("resume-clipboard", "Resume on a clipboard ready for review"),
  "Cover Letters": P("handshake-desk", "Two people shaking hands across a desk"),
  "Interview Prep": P("interview-handshake", "Candidate shaking hands after an interview"),
  "Job Search": P("job-seeker-laptop", "Job seeker working on applications at a laptop"),
};

/**
 * The CMS still carries the old flat product illustrations (/images/product/*.svg)
 * as covers; those are swapped for a stock photo that fits the post. Any other
 * cover an editor sets is used as is.
 */
export function blogCoverPhoto(post: BlogPost): Photo {
  if (post.coverUrl && !post.coverUrl.startsWith("/images/product/")) {
    return { src: post.coverUrl, alt: post.coverAlt?.trim() || post.category };
  }
  return photoBySlug[post.slug] ?? photoByCategory[post.category] ?? photoByCategory["Resume Tips"];
}

export function BlogCover({
  post,
  size = "md",
  priority,
}: {
  post: BlogPost;
  size?: "sm" | "md" | "lg" | "hero";
  priority?: boolean;
}) {
  const photo = blogCoverPhoto(post);
  const sizeClass =
    size === "hero"
      ? "h-[260px] sm:h-[420px]"
      : size === "lg"
        ? "aspect-[16/10] lg:aspect-auto lg:h-full lg:min-h-[340px]"
        : "aspect-[16/10]";
  const wide = size === "hero" || size === "lg";
  return (
    <div className={`relative overflow-hidden rounded-[16px] bg-[#F5F5F3] ${sizeClass}`}>
      <Image
        src={photo.src}
        alt={photo.alt}
        fill
        priority={priority}
        sizes={wide ? "(max-width: 1040px) 100vw, 1040px" : "(max-width: 640px) 100vw, 380px"}
        className="object-cover"
      />
    </div>
  );
}
