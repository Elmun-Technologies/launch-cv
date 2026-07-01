import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginForm } from "@/components/login-form";

// Utility page — no search value; keep it out of the index (still crawlable/followable).
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: true },
};

export default function LoginPage() {
  return (
    <Suspense
      fallback={<div className="mx-auto max-w-md px-4 py-24 text-sm text-zinc-400">Loading...</div>}
    >
      <LoginForm />
    </Suspense>
  );
}
