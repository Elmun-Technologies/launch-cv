import Image from "next/image";
import { FileText, Mail, MessageSquare, Search, Sparkles } from "lucide-react";

/** Minimal shape required by the cover — accepts either the static or DB BlogPost type. */
type BlogPost = {
  slug: string;
  category: string;
  readingTime: number;
  /** Optional hero image. When set, a real screenshot renders instead of the gradient. */
  coverUrl?: string | null;
  coverAlt?: string | null;
};

type CoverConfig = {
  gradient: string;
  icon: typeof FileText;
  iconColor: string;
};

const coverByCategory: Record<string, CoverConfig> = {
  "Resume Tips": {
    gradient: "from-[#EFF6FF] via-[#DBEAFE] to-[#BFDBFE]",
    icon: FileText,
    iconColor: "text-[#2563EB]",
  },
  "Cover Letters": {
    gradient: "from-[#F0FDFA] via-[#CCFBF1] to-[#99F6E4]",
    icon: Mail,
    iconColor: "text-[#0D9488]",
  },
  "Interview Prep": {
    gradient: "from-[#F0FDF4] via-[#D1FAE5] to-[#A7F3D0]",
    icon: MessageSquare,
    iconColor: "text-[#059669]",
  },
  "Job Search": {
    gradient: "from-[#FAF5FF] via-[#DBEAFE] to-[#BFDBFE]",
    icon: Search,
    iconColor: "text-[#2563EB]",
  },
};

function hashSlug(slug: string): number {
  let h = 0;
  for (let i = 0; i < slug.length; i++) h = (h * 31 + slug.charCodeAt(i)) | 0;
  return Math.abs(h);
}

export function BlogCover({ post, size = "md" }: { post: BlogPost; size?: "sm" | "md" | "lg" | "hero" }) {
  const cfg = coverByCategory[post.category] ?? coverByCategory["Resume Tips"];
  const Icon = cfg.icon;
  const h = hashSlug(post.slug);
  const blobX = 25 + (h % 50);
  const blobY = 15 + ((h >> 3) % 60);
  const sizeClass =
    size === "hero"
      ? "h-[280px] sm:h-[340px]"
      : size === "lg"
      ? "h-[260px]"
      : size === "sm"
      ? "aspect-[16/9]"
      : "aspect-[16/10]";
  const iconSize = size === "hero" ? "h-14 w-14" : size === "lg" ? "h-12 w-12" : "h-10 w-10";

  // When the post has a real cover image, render it with next/image. Fixed
  // intrinsic dimensions (all covers are authored 1600×900) reserve the aspect
  // ratio; local `.svg` sources are served unoptimized and lazy-loaded by
  // default. A descriptive `coverAlt` keeps the hero accessible.
  if (post.coverUrl) {
    return (
      <div className={`relative overflow-hidden rounded-xl bg-[#F1F5F9] ${sizeClass}`}>
        <Image
          src={post.coverUrl}
          alt={post.coverAlt?.trim() || `${post.category} — LaunchCV product illustration`}
          width={1600}
          height={900}
          sizes={size === "hero" || size === "lg" ? "(max-width: 800px) 100vw, 800px" : "(max-width: 640px) 100vw, 400px"}
          className="h-full w-full object-cover"
        />
        <div className="absolute left-3 top-3">
          <span className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0F172A] shadow-sm backdrop-blur">
            <Sparkles className="h-2.5 w-2.5 text-[#2563EB]" />
            LaunchCV · {post.readingTime} min
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-gradient-to-br ${cfg.gradient} ${sizeClass}`}
      aria-hidden
    >
      <div
        className="pointer-events-none absolute h-[180px] w-[180px] rounded-full bg-white/40 blur-[60px]"
        style={{ left: `${blobX}%`, top: `${blobY}%`, transform: "translate(-50%, -50%)" }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-50"
        style={{
          backgroundImage: "radial-gradient(rgba(15,23,42,0.08) 1px, transparent 1px)",
          backgroundSize: "16px 16px",
        }}
      />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Icon className={`${iconSize} ${cfg.iconColor} opacity-70`} strokeWidth={1.5} />
        <p className="mt-3 max-w-[80%] text-center text-[13px] font-semibold uppercase tracking-wider text-[#0F172A]/70">
          {post.category}
        </p>
      </div>
      <div className="absolute left-3 top-3">
        <span className="inline-flex items-center gap-1 rounded-md bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#0F172A] shadow-sm">
          <Sparkles className="h-2.5 w-2.5 text-[#2563EB]" />
          LaunchCV · {post.readingTime} min
        </span>
      </div>
    </div>
  );
}
