import type { Metadata } from "next";

// The register page is a client component and cannot export metadata itself.
// This segment layout supplies a title and keeps the signup form out of the
// index (matching /login), while remaining crawlable/followable.
export const metadata: Metadata = {
  title: "Create your account",
  robots: { index: false, follow: true },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}
