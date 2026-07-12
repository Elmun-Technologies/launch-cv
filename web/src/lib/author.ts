import { absoluteUrl } from "@/lib/site";

/**
 * Canonical byline author for the LaunchCV blog.
 *
 * E-E-A-T: search engines and readers both weight content more heavily when it
 * is attributed to a named, real person with a bio and an author page, rather
 * than to a faceless organization. Every post uses this Person as its author in
 * both the visible byline and the Article JSON-LD.
 */
export type SiteAuthor = {
  name: string;
  role: string;
  bio: string;
  /** Author page — the linked source of authority. */
  url: string;
  /** Absolute avatar URL, used in the byline and Person JSON-LD `image`. */
  avatar: string;
};

export const SITE_AUTHOR: SiteAuthor = {
  name: "Nazir Elmurodov",
  role: "Founder, LaunchCV",
  bio: "Nazir founded LaunchCV after watching qualified candidates get filtered out by applicant tracking systems. He writes about resume optimization, ATS parsing, and running a modern job search.",
  url: absoluteUrl("/about"),
  avatar: absoluteUrl("/authors/nazir-elmurodov.svg"),
};
