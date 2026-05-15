import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://launch-cv.com";
  return {
    rules: [
      {
        // Standard crawlers — full access to public pages
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin-panel/"],
      },
      {
        // OpenAI / ChatGPT — allow GEO indexing
        userAgent: "GPTBot",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin-panel/"],
      },
      {
        // Perplexity AI
        userAgent: "PerplexityBot",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin-panel/"],
      },
      {
        // Anthropic Claude
        userAgent: "anthropic-ai",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin-panel/"],
      },
      {
        // Claude web crawler
        userAgent: "ClaudeBot",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin-panel/"],
      },
      {
        // Google Gemini / Bard / Google-Extended
        userAgent: "Google-Extended",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin-panel/"],
      },
      {
        // Microsoft Copilot / Bing
        userAgent: "Bingbot",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin-panel/"],
      },
      {
        // You.com
        userAgent: "YouBot",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin-panel/"],
      },
      {
        // Cohere AI
        userAgent: "cohere-ai",
        allow: ["/", "/features/", "/blog/", "/pricing", "/about", "/llms.txt"],
        disallow: ["/api/", "/dashboard/", "/resume/", "/admin-panel/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
