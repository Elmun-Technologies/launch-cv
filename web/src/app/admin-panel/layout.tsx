import type { Metadata } from "next";
import type { ReactNode } from "react";

// Admin area — never index or follow. robots.txt disallows crawling, but a
// noindex tag is what actually keeps these URLs out of search results if they
// are ever discovered via an external link.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function AdminPanelLayout({ children }: { children: ReactNode }) {
  return children;
}
