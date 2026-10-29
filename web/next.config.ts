import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@react-pdf/renderer"],
  // Fonts read from disk by the PDF renderer (see src/lib/pdf/resume-pdf.tsx).
  outputFileTracingIncludes: {
    "/api/resumes/*/pdf": ["./src/lib/pdf/fonts/**"],
  },
  async redirects() {
    // Billing-period tokens (e.g. "$9/month") that crawlers occasionally
    // mis-extract as relative URLs should land on the pricing page, not a 404.
    // Explicit 301 (statusCode) — Next's `permanent: true` emits a 308.
    return [
      { source: "/month", destination: "/pricing", statusCode: 301 },
      { source: "/monthly", destination: "/pricing", statusCode: 301 },
      { source: "/year", destination: "/pricing", statusCode: 301 },
      { source: "/yearly", destination: "/pricing", statusCode: 301 },
      { source: "/annual", destination: "/pricing", statusCode: 301 },
      // The feature page and the free tool targeted the same queries; one page ranks better than two.
      { source: "/features/ats-score", destination: "/free-ats-check", statusCode: 301 },
      // Role pages now live under /resume-examples (one page per intent).
      { source: "/use-cases", destination: "/resume-examples", statusCode: 301 },
      { source: "/use-cases/software-engineers", destination: "/resume-examples/software-engineer", statusCode: 301 },
      { source: "/use-cases/product-managers", destination: "/resume-examples/product-manager", statusCode: 301 },
      { source: "/use-cases/designers", destination: "/resume-examples/ux-designer", statusCode: 301 },
      { source: "/dashboard/settings/notifications", destination: "/dashboard/settings", statusCode: 301 },
      { source: "/dashboard/settings/overview", destination: "/dashboard", statusCode: 301 },
      { source: "/dashboard/applications", destination: "/dashboard/job-tracker", statusCode: 301 },
    ];
  },
};

export default nextConfig;
