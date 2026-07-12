import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import { RegisterForm } from "@/components/register-form";
import { isGoogleOAuthConfigured } from "@/lib/google-oauth";

export default function RegisterPage() {
  const googleEnabled = isGoogleOAuthConfigured();
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[#0F172A]">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      }
    >
      <RegisterForm googleEnabled={googleEnabled} />
    </Suspense>
  );
}
