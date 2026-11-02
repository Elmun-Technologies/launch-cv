import { prisma } from "@/lib/prisma";

/**
 * Editable marketing copy (Admin → Content → Page copy).
 *
 * Each key lists the text fields an editor may change and their defaults (the
 * copy the page shows when nothing is saved). Only these fields are read; a
 * saved value is used when it has the same shape as the default and fits the
 * length limit, so a bad save can never break a page. Links stay in code so
 * analytics and "one page per query" routing can't be broken from the panel.
 */

type Field = string | string[];
type Shape = Record<string, Field>;

export type PageCopyDef<T extends Shape = Shape> = {
  label: string;
  description: string;
  /** Pages to refresh when this copy changes ("layout:/" = every page). */
  paths: string[];
  /** Max characters per string (per item for lists). */
  max: Partial<Record<keyof T, number>>;
  defaults: T;
};

export const PAGE_COPY = {
  "home.hero": {
    label: "Home · hero",
    description: "Badge, headline, lead and button labels at the top of the home page.",
    paths: ["/"],
    max: { badge: 60, title: 90, titleAccent: 40, lead: 260, primaryCta: 40, secondaryCta: 40, note: 80 },
    defaults: {
      badge: "ATS resume check · no sign-up",
      title: "See your resume the way hiring software",
      titleAccent: "reads it.",
      lead: "Upload your resume. In about ten seconds you'll see what an applicant tracking system pulls out of it — and a plain-English fix for every issue.",
      primaryCta: "Check my resume — free",
      secondaryCta: "Build a resume",
      note: "PDF or Word · your file isn't stored",
    },
  },
  "home.cta": {
    label: "Home · final CTA",
    description: "The dark banner at the bottom of the home page.",
    paths: ["/"],
    max: { title: 90, lead: 160, primaryCta: 40, secondaryCta: 40 },
    defaults: {
      title: "Ten seconds to see what the software sees.",
      lead: "Free, no account, and your file isn't kept.",
      primaryCta: "Check my resume — free",
      secondaryCta: "Build a resume",
    },
  },
  "pricing.hero": {
    label: "Pricing · hero",
    description: "Headline and lead above the plan cards.",
    paths: ["/pricing"],
    max: { title: 60, titleMuted: 80, lead: 220 },
    defaults: {
      title: "Pay monthly or once.",
      titleMuted: "Checking your resume is always free.",
      lead: "Every AI tool is on every paid plan. Plans only differ in how much you can use them each month.",
    },
  },
  "about.mission": {
    label: "About · story",
    description: "Headline and the story paragraphs on the About page.",
    paths: ["/about"],
    max: { title: 120, titleAccent: 40, paragraphs: 400 },
    defaults: {
      title: "We build tools for the part of job hunting nobody sees.",
      titleAccent: "The software.",
      paragraphs: [
        "LaunchCV started in 2024 after watching qualified friends apply to dozens of jobs and hear nothing back. Their experience was fine. Their resumes just weren't being read — tables the software skipped, headings it didn't recognize, keywords it couldn't find.",
        "So we built a checker that shows you exactly what that software sees, and tools that help you fix it without inventing anything. Every suggestion uses facts from your own resume, and you approve every change.",
        "We're a small team at Elmun Technologies, and we read every support email.",
      ],
    },
  },
  "footer.tagline": {
    label: "Footer · tagline",
    description: "The sentence under the logo in the site footer.",
    paths: ["layout:/"],
    max: { tagline: 160 },
    defaults: {
      tagline: "Resume tools that get you past the software and in front of the people who hire.",
    },
  },
} satisfies Record<string, PageCopyDef>;

export type PageCopyKey = keyof typeof PAGE_COPY;
export type PageCopyOf<K extends PageCopyKey> = (typeof PAGE_COPY)[K]["defaults"];

export function isPageCopyKey(key: string): key is PageCopyKey {
  return Object.prototype.hasOwnProperty.call(PAGE_COPY, key);
}

/** Keep only fields that match the default's shape and limits. */
export function cleanPageCopy<K extends PageCopyKey>(key: K, data: unknown): Partial<PageCopyOf<K>> {
  const def = PAGE_COPY[key] as PageCopyDef;
  const out: Record<string, Field> = {};
  if (!data || typeof data !== "object" || Array.isArray(data)) return out as Partial<PageCopyOf<K>>;
  for (const [field, fallback] of Object.entries(def.defaults)) {
    const v = (data as Record<string, unknown>)[field];
    const max = (def.max as Record<string, number | undefined>)[field] ?? 300;
    if (typeof fallback === "string" && typeof v === "string") {
      const t = v.trim();
      if (t.length <= max && (t || fallback === "")) out[field] = t;
    } else if (Array.isArray(fallback) && Array.isArray(v)) {
      const items = v.filter((x): x is string => typeof x === "string").map((x) => x.trim()).filter(Boolean);
      if (items.length && items.length <= 8 && items.every((x) => x.length <= max)) out[field] = items;
    }
  }
  return out as Partial<PageCopyOf<K>>;
}

/** Copy for a key: saved fields over the defaults. Never throws. */
export async function getPageCopy<K extends PageCopyKey>(key: K): Promise<PageCopyOf<K>> {
  const defaults = PAGE_COPY[key].defaults as PageCopyOf<K>;
  try {
    const row = await prisma.pageCopy.findUnique({ where: { key }, select: { data: true } });
    return { ...defaults, ...cleanPageCopy(key, row?.data) };
  } catch {
    return defaults;
  }
}
