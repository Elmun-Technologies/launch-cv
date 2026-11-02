import Link from "next/link";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { redirect } from "next/navigation";
import { ShieldOff, ArrowLeft } from "lucide-react";
import { getSession } from "@/lib/session";
import { adminState } from "@/lib/admin-guard";
import { siteFontVars } from "@/lib/site-fonts";

const btn =
  "lc-btn-lift inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full px-[26px] text-[16px] font-semibold focus-visible:rounded-full!";

function DeniedShell({ children }: { children: React.ReactNode }) {
  return (
    <div
      className={`lc-site ${siteFontVars} relative flex min-h-[100dvh] items-center justify-center overflow-hidden bg-[#111118] px-4 py-16 text-white`}
    >
      <p
        aria-hidden="true"
        className="lc-poster pointer-events-none absolute left-4 top-6 m-0 select-none text-[140px] leading-none text-[#1d1c2e] sm:left-10 sm:text-[260px]"
      >
        403
      </p>
      <main className="relative w-full max-w-[540px] text-center">{children}</main>
    </div>
  );
}

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
      <DeniedShell>
        <span className="inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#5440e8]">
          <ShieldOff className="h-7 w-7" aria-hidden />
        </span>
        <h1 className="mt-5 text-[34px] font-extrabold leading-[1.1] tracking-[-0.04em] sm:text-[44px]">Your role can&apos;t open that page</h1>
        <p className="mt-3.5 text-[17px] leading-[27px] text-[#c9c7d8]">
          You&apos;re signed in as <span className="break-all font-semibold text-white">{state.staff.email}</span> with the{" "}
          <span className="font-semibold capitalize text-white">{state.staff.role}</span> role. Ask an owner if you need more access.
        </p>
        <div className="mt-7 flex justify-center">
          <Link href="/admin-panel" className={`${btn} bg-[#5440e8] text-white hover:bg-[#4430d6]`}>
            <ArrowLeft className="h-4 w-4" aria-hidden /> Back to the admin panel
          </Link>
        </div>
      </DeniedShell>
    );
  }

  return (
    <DeniedShell>
      <span className="inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#5440e8]">
        <ShieldOff className="h-7 w-7" aria-hidden />
      </span>
      <h1 className="mt-5 text-[34px] font-extrabold leading-[1.1] tracking-[-0.04em] sm:text-[44px]">This area is for the LaunchCV team.</h1>
      <p className="mt-3.5 text-[17px] leading-[27px] text-[#c9c7d8]">
        You&apos;re signed in as <span className="break-all font-semibold text-white">{session.email}</span>, but this account
        doesn&apos;t have admin access.
      </p>

      <p className="mx-auto mt-5 max-w-[460px] rounded-2xl bg-[#1d1c2e] px-5 py-4 text-left text-[14px] leading-[1.6] text-[#c9c7d8]">
        To get access, ask an owner to add you in <span className="font-semibold text-white">Admin → Security → Team</span>.
        You&apos;ll be asked to set up an authenticator app the first time you sign in.
      </p>

      <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
        <Link href="/dashboard" className={`${btn} bg-[#5440e8] text-white hover:bg-[#4430d6]`}>
          Back to my dashboard
        </Link>
        <SignOutButton className={`${btn} bg-white text-[#121226]`} />
      </div>
    </DeniedShell>
  );
}
