import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { safeNextPath } from "@/lib/safe-next";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { RegisterForm } from "@/components/register-form";
import { isGoogleOAuthConfigured } from "@/lib/google-oauth";

/** Signed-in visitors (e.g. from a "Use this template" link) go straight on to where they were headed. */
export default async function RegisterPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
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
      <RegisterForm googleEnabled={googleEnabled} />
    </Suspense>
  );
}
