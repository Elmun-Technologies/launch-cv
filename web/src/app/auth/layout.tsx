import type { Metadata } from "next";

// Auth utility pages (password reset, email verification) carry no search
// value and would otherwise be indexed with the root's default title. Keep
// them out of the index while still crawlable/followable.
export const metadata: Metadata = {
  title: "Account",
  robots: { index: false, follow: true },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
