import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldOff, ArrowLeft, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/session";
import { adminState } from "@/lib/admin-guard";

/**
 * Rendered when a logged-in user without admin privileges hits any
 * /admin-panel/* route. Middleware has already verified they're logged in.
 * This page exists outside the admin shell so the user clearly sees they
 * don't have access (instead of being silently bounced to /dashboard).
 */
export default async function AccessDeniedPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin-panel");

  // Staff who still owe a 2FA code go to the code screen; staff with access go back in.
  const state = await adminState();
  if (state.state === "setup_2fa" || state.state === "verify_2fa") redirect("/admin-2fa");
  if (state.state === "ok") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAF9] px-6">
        <div className="w-full max-w-[460px] rounded-2xl border border-[#E5E5E2] bg-white p-8 text-center">
          <h1 className="text-[22px] font-semibold tracking-tight text-[#111111]">Your role can&apos;t open that page</h1>
          <p className="mt-2 text-[14px] leading-[1.65] text-[#3F3F3F]">
            You&apos;re signed in as <span className="font-semibold text-[#111111]">{state.staff.email}</span> with the{" "}
            <span className="font-semibold capitalize text-[#111111]">{state.staff.role}</span> role. Ask an owner if you need more access.
          </p>
          <Link href="/admin-panel" className="mt-6 inline-flex items-center gap-1.5 rounded-lg bg-[#111111] px-4 py-2 text-[13px] font-semibold text-white">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to the admin panel
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFAF9] px-6">
      <div className="w-full max-w-[460px] rounded-2xl border border-[#E5E5E2] bg-white p-8 text-center shadow-[0_24px_60px_-30px_rgba(15,23,42,0.18)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
          <ShieldOff className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-[22px] font-semibold tracking-tight text-[#111111]">
          Admin access required
        </h1>
        <p className="mt-2 text-[14px] leading-[1.65] text-[#3F3F3F]">
          You&apos;re signed in as{" "}
          <span className="font-semibold text-[#111111]">{session.email}</span>, but this
          account doesn&apos;t have admin permission.
        </p>

        <div className="mt-6 rounded-lg border border-[#E5E5E2] bg-[#FAFAF9] p-4 text-left text-[13px] leading-[1.65] text-[#3F3F3F]">
          To get access, ask an owner to add you in{" "}
          <span className="font-semibold text-[#111111]">Admin → Security → Team</span>. You&apos;ll be asked to set up an
          authenticator app the first time you sign in.
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Go to my dashboard
          </Link>
          <Link
            href="/api/auth/logout"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E5E5E2] bg-white px-4 py-2 text-[13px] font-semibold text-[#111111] transition hover:bg-[#FAFAF9]"
          >
            Sign out
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
