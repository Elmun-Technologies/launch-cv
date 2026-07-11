import { getPublishedPosts } from "@/lib/cms/blog";
import { absoluteUrl } from "@/lib/site";

// Regenerate at most hourly; content is served from cache in between.
export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

/**
 * RSS 2.0 feed for the career blog. Discoverable via <link rel="alternate">
 * on /blog and consumable by feed readers, newsletters, and syndication.
 */
export async function GET(): Promise<Response> {
  const posts = await getPublishedPosts();
  const feedUrl = absoluteUrl("/blog/feed.xml");
  const blogUrl = absoluteUrl("/blog");
  const lastBuild = posts[0] ? new Date(posts[0].date).toUTCString() : new Date(0).toUTCString();

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      return `    <item>
      <title>${escapeXml(post.seoTitle || post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.seoDescription || post.description)}</description>
      <category>${escapeXml(post.category)}</category>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
    </item>`;
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Launch CV Career Blog</title>
    <link>${blogUrl}</link>
    <description>Evidence-based guides on resume writing, ATS optimization, cover letters, and job search strategy.</description>
    <language>en-us</language>
    <atom:link href="${feedUrl}" rel="self" type="application/rss+xml" />
    <lastBuildDate>${lastBuild}</lastBuildDate>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
