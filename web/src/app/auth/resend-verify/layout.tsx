import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Resend verification email",
  robots: { index: false, follow: true },
};

export default function ResendVerifyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
