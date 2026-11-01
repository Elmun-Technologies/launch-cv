import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { safeNextPath } from "@/lib/safe-next";
import type { Metadata } from "next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { LoginForm } from "@/components/login-form";
import { isGoogleOAuthConfigured } from "@/lib/google-oauth";

// Utility page — no search value; keep it out of the index (still crawlable/followable).
export const metadata: Metadata = {
  title: "Sign in",
  robots: { index: false, follow: true },
};

/** Signed-in visitors (e.g. from a "Use this template" link) go straight on to where they were headed. */
export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const session = await getSession();
  if (session) redirect(safeNextPath((await searchParams).next) ?? "/dashboard");
  const googleEnabled = await isGoogleOAuthConfigured();
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#eeecf4]">
          <Loader2 className="h-8 w-8 text-[#5440e8] motion-safe:animate-spin" aria-label="Loading" />
        </div>
      }
    >
      <LoginForm googleEnabled={googleEnabled} />
    </Suspense>
  );
}
