import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://launch-cv.com";
  return {
    rules: [
      {
        // Standard crawlers — full access to public pages
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin/"],
      },
      {
        // OpenAI / ChatGPT — allow GEO indexing
        userAgent: "GPTBot",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin/"],
      },
      {
        // Perplexity AI
        userAgent: "PerplexityBot",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin/"],
      },
      {
        // Anthropic Claude
        userAgent: "anthropic-ai",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin/"],
      },
      {
        // Claude web crawler
        userAgent: "ClaudeBot",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin/"],
      },
      {
        // Google Gemini / Bard / Google-Extended
        userAgent: "Google-Extended",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin/"],
      },
      {
        // Microsoft Copilot / Bing
        userAgent: "Bingbot",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin/"],
      },
      {
        // You.com
        userAgent: "YouBot",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin/"],
      },
      {
        // Cohere AI
        userAgent: "cohere-ai",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
