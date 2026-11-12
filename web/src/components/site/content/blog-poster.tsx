import Image from "next/image";
import type { ReactNode } from "react";

/** Minimal post shape the cover needs (works for the DB BlogPost type). */
type PosterPost = {
  slug: string;
  category: string;
  coverUrl?: string | null;
  coverAlt?: string | null;
};

type Tone = "purple" | "dark" | "lilac" | "orange";
type Art = { tone: Tone; word: string; widget: Widget };
type Widget = "keywords" | "voice" | "upload" | "score" | "doc" | "tailor" | "letter" | "chat" | "parse" | "rewrite";

/**
 * v5 blog covers: a poster word plus a small product-style widget on a brand
 * color, keyed by post slug (falls back by category). Purely decorative — the
 * widget values are illustrations, not claims, so the art is aria-hidden.
 */
const ART_BY_SLUG: Record<string, Art> = {
  "resume-keywords-for-software-engineers": { tone: "purple", word: "KEYWORDS", widget: "keywords" },
  "voice-to-resume": { tone: "purple", word: "SPEAK IT", widget: "voice" },
  "how-to-write-an-ats-friendly-resume": { tone: "purple", word: "1 COLUMN", widget: "doc" },
  "how-to-tailor-your-resume-for-every-job": { tone: "purple", word: "TAILOR", widget: "tailor" },
  "cover-letter-tips-that-actually-work": { tone: "lilac", word: "7 TIPS", widget: "letter" },
  "how-to-prepare-for-a-job-interview-with-ai": { tone: "orange", word: "PREP", widget: "chat" },
  "what-is-ats-and-how-does-it-work": { tone: "dark", word: "ATS 101", widget: "parse" },
  "ai-resume-builder-complete-guide": { tone: "purple", word: "AI + YOU", widget: "rewrite" },
};

const ART_BY_CATEGORY: Record<string, Art> = {
  "Resume Tips": { tone: "purple", word: "RESUME", widget: "doc" },
  "Cover Letters": { tone: "lilac", word: "LETTER", widget: "letter" },
  "Interview Prep": { tone: "orange", word: "PREP", widget: "chat" },
  "Job Search": { tone: "dark", word: "ATS", widget: "parse" },
};

const TONES: Record<Tone, { bg: string; word: string }> = {
  purple: { bg: "bg-[#5440e8]", word: "text-[#6a58ee]" },
  dark: { bg: "bg-[#111118]", word: "text-[#2a2840]" },
  lilac: { bg: "bg-[#c9c0ff]", word: "text-[#b8adff]" },
  orange: { bg: "bg-[#ff7a33]", word: "text-[#ff9254]" },
};

export type PosterSize = "card" | "related" | "featured" | "hero";

/** Frame height, poster word size and widget scale per size and breakpoint. */
const SIZES: Record<PosterSize, { frame: string; word: string; widget: string; chip: string }> = {
  card: {
    frame: "h-[150px] rounded-[18px] sm:h-[220px] sm:rounded-[20px]",
    word: "left-[15px] top-3 text-[44px] leading-[44px] sm:left-5 sm:top-4 sm:text-[64px] sm:leading-[64px]",
    widget: "right-4 bottom-4 scale-[0.72] sm:right-[22px] sm:bottom-[22px] sm:scale-100",
    chip: "left-3 bottom-3 text-[11px] sm:left-4 sm:bottom-4 sm:text-[12px]",
  },
  related: {
    frame: "h-[150px] rounded-[18px] sm:h-[180px] sm:rounded-[20px]",
    word: "left-[15px] top-3 text-[44px] leading-[44px] sm:left-5 sm:top-4 sm:text-[56px] sm:leading-[56px]",
    widget: "right-4 bottom-4 scale-[0.72] sm:right-[22px] sm:bottom-[22px] sm:scale-100",
    chip: "left-3 bottom-3 text-[11px] sm:left-4 sm:bottom-4 sm:text-[12px]",
  },
  featured: {
    frame: "h-[150px] rounded-[18px] sm:h-[300px] sm:rounded-[24px] lg:h-[420px] lg:rounded-[28px]",
    word: "left-[15px] top-3 text-[44px] leading-[44px] sm:left-6 sm:top-5 sm:text-[100px] sm:leading-[100px] lg:left-[30px] lg:top-6 lg:text-[150px] lg:leading-[150px]",
    widget: "right-4 bottom-4 scale-[0.72] sm:right-7 sm:bottom-7 sm:scale-[1.2] lg:right-[33px] lg:bottom-[33px] lg:scale-150",
    chip: "left-3 bottom-3 text-[11px] sm:left-6 sm:bottom-6 sm:px-3.5 sm:py-1.5 sm:text-[16px] lg:text-[18px]",
  },
  hero: {
    frame: "h-[220px] rounded-[24px] sm:h-[340px] sm:rounded-[30px] lg:h-[440px] lg:rounded-[36px]",
    word: "left-[18px] top-3.5 text-[80px] leading-[80px] sm:left-7 sm:top-6 sm:text-[140px] sm:leading-[140px] lg:left-[34px] lg:top-[27px] lg:text-[190px] lg:leading-[190px]",
    widget: "right-5 bottom-5 scale-90 sm:right-8 sm:bottom-8 sm:scale-[1.35] lg:right-[37px] lg:bottom-[37px] lg:scale-[1.7]",
    chip: "left-3.5 bottom-3.5 text-[11px] sm:left-6 sm:bottom-6 sm:px-3.5 sm:py-1.5 sm:text-[16px] lg:left-[27px] lg:bottom-[27px] lg:px-[17px] lg:py-2 lg:text-[20px]",
  },
};

function artFor(post: PosterPost): Art {
  return ART_BY_SLUG[post.slug] ?? ART_BY_CATEGORY[post.category] ?? { tone: "purple", word: "GUIDE", widget: "doc" };
}

/** True when an editor set a real cover image (the CMS's old product SVGs don't count). */
function hasCustomCover(post: PosterPost): boolean {
  return !!post.coverUrl && !post.coverUrl.startsWith("/images/product/");
}

export function BlogPoster({
  post,
  size = "card",
  priority,
  className = "",
}: {
  post: PosterPost;
  size?: PosterSize;
  priority?: boolean;
  className?: string;
}) {
  const s = SIZES[size];
  const chip = (
    <span className={`absolute z-10 rounded-full bg-white px-2.5 py-[5px] font-bold text-[#121226] ${s.chip}`}>{post.category}</span>
  );

  if (hasCustomCover(post)) {
    const photo = { src: post.coverUrl as string, alt: post.coverAlt?.trim() || post.category };
    const wide = size === "hero" || size === "featured";
    return (
      <div className={`relative overflow-hidden bg-[#e4dfff] ${s.frame} ${className}`}>
        <Image
          src={photo.src}
          alt={photo.alt}
          fill
          priority={priority}
          sizes={wide ? "(min-width: 1280px) 1200px, 100vw" : "(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"}
          className="object-cover"
        />
        {chip}
      </div>
    );
  }

  const art = artFor(post);
  const tone = TONES[art.tone];
  return (
    <div className={`relative overflow-hidden ${tone.bg} ${s.frame} ${className}`}>
      <p aria-hidden="true" className={`lc-poster absolute m-0 ${tone.word} ${s.word}`}>
        {art.word}
      </p>
      <div aria-hidden="true" className={`absolute origin-bottom-right ${s.widget}`}>
        <PosterWidget kind={art.widget} />
      </div>
      {chip}
    </div>
  );
}

const shadow = "shadow-[0_18px_36px_-16px_rgba(10,6,60,0.5)]";

function Box({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`rounded-[18px] bg-white p-3.5 text-[13px] font-semibold text-[#121226] ${shadow} ${className}`}>{children}</div>;
}

/** Widgets drawn at the desktop card size; the frame scales them per breakpoint. */
function PosterWidget({ kind }: { kind: Widget }) {
  switch (kind) {
    case "keywords":
      return (
        <Box className="flex w-[190px] flex-wrap gap-1.5">
          {["Go", "Kubernetes", "PostgreSQL", "AWS", "CI/CD"].map((k) => (
            <span key={k} className="rounded-full bg-[#e4dfff] px-2.5 py-[5px] text-[11px] text-[#3a2bb8]">
              {k}
            </span>
          ))}
        </Box>
      );
    case "voice":
      return (
        <Box className="flex h-[58px] items-center gap-1">
          {[10, 22, 14, 30, 18, 26, 12, 24, 16, 8].map((h, i) => (
            <span key={i} className="w-[5px] rounded-full bg-[#5440e8]" style={{ height: h }} />
          ))}
        </Box>
      );
    case "upload":
      return (
        <Box className="flex items-center gap-2.5">
          <span className="inline-flex h-[34px] w-[34px] items-center justify-center rounded-full bg-[#5440e8] text-white">↑</span>
          resume.pdf
        </Box>
      );
    case "score":
      return (
        <Box className="flex items-center gap-2.5">
          <svg width="44" height="44" viewBox="0 0 64 64">
            <circle cx="32" cy="32" r="27" fill="none" stroke="#efedf7" strokeWidth="8" />
            <circle cx="32" cy="32" r="27" fill="none" stroke="#22b07d" strokeWidth="8" strokeLinecap="round" strokeDasharray="154 170" transform="rotate(-90 32 32)" />
          </svg>
          <span className="text-[26px] font-bold">91</span>
        </Box>
      );
    case "doc":
      return (
        <Box className="flex h-[80px] w-[110px] flex-col gap-1.5">
          {["60%", "100%", "90%", "100%", "70%", "85%"].map((w, i) => (
            <span key={i} className={`h-[5px] rounded-full ${i === 0 ? "bg-[#121226]" : "bg-[#d9d4f2]"}`} style={{ width: w }} />
          ))}
        </Box>
      );
    case "tailor":
      return (
        <Box className="text-[24px] font-bold">
          72 <span className="text-[14px] text-[#7c7a94]">→</span> <span className="text-[#0b7a4f]">86</span>
        </Box>
      );
    case "letter":
      return <Box className="w-[170px] text-[11px] font-medium leading-4">Dear Hiring Manager, I led the rollout your team is planning…</Box>;
    case "chat":
      return (
        <div className={`w-[170px] rounded-[18px_18px_5px_18px] bg-[#111118] p-3.5 text-[13px] font-medium text-white ${shadow}`}>
          “Tell me about a time you failed.”
        </div>
      );
    case "parse":
      return (
        <div className={`lc-mono rounded-[18px] bg-[#111118] p-3.5 text-[11px] font-medium text-[#e9e7f3] ${shadow}`}>
          email: <span className="rounded bg-[#ff7a33] px-[5px] py-px text-[#111118]">not found</span>
        </div>
      );
    case "rewrite":
      return (
        <Box className="w-[180px] text-[12px] leading-[17px]">
          <span className="font-medium text-[#66647c] line-through">Responsible for onboarding</span>
          <br />
          Activation 38% → 57%
        </Box>
      );
  }
}
