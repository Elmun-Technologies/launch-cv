import { ImageResponse } from "next/og";
import { OgImage, OG_SIZE, OG_CONTENT_TYPE } from "@/components/og-image";
import { getPostBySlug } from "@/lib/cms/blog";

// Node runtime (not edge): the shared blog lookup uses Prisma.
export const runtime = "nodejs";
export const alt = "LaunchCV blog article";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

type Params = { slug: string };

/**
 * Per-post Open Graph card. Renders the article's own title and category so
 * every social/search share for a blog post is branded and specific, instead
 * of falling back to the generic site card.
 */
export default async function Image({ params }: { params: Promise<Params> }) {
  const { slug } = await params;

  let title = "Career & resume advice from LaunchCV";
  let category = "LaunchCV Blog";
  try {
    const post = await getPostBySlug(slug);
    if (post) {
      title = post.title;
      category = post.category;
    }
  } catch {
    // DB unavailable — fall back to the generic copy above.
  }

  return new ImageResponse(
    <OgImage title={title} subtitle={category} pills={["Resume Tips", "ATS Score", "Job Search", "Career Advice"]} />,
    { ...size },
  );
}
