import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactCompiler: true,
  serverExternalPackages: ["@react-pdf/renderer"],
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
    ];
  },
};

export default nextConfig;
