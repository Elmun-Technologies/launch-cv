import type { Metadata } from "next";
import type { ReactNode } from "react";

// Authenticated area — never index or follow. robots.txt disallows crawling,
// but a noindex header/tag is what actually keeps these URLs out of search
// results if they are ever discovered via an external link.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return children;
}
