import Link from "next/link";
import { SignOutButton } from "@/components/admin/sign-out-button";
import { redirect } from "next/navigation";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { adminState, DENIED_PATH, logAdminDenied, requestContext } from "@/lib/admin-guard";
import { maskIp } from "@/lib/ip-allowlist";
import { nowMs } from "@/lib/relative-time";
import { siteFontVars } from "@/lib/site-fonts";

export const dynamic = "force-dynamic";

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

function Icon() {
  return (
    <span className="inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#5440e8]">
      <ShieldCheck className="h-7 w-7" aria-hidden />
    </span>
  );
}

const h1 = "mt-5 text-[34px] font-extrabold leading-[1.1] tracking-[-0.04em] sm:text-[44px]";
const lead = "mt-3.5 text-[17px] leading-[27px] text-[#c9c7d8]";
const logged = <p className="mt-5 text-[13px] text-[#a9a6c2]">This attempt was logged.</p>;

/**
 * Rendered when a logged-in user without admin privileges hits any
 * /admin-panel/* route (the guard has already written `admin.denied` to the
 * audit log with the path and a masked IP), or when staff come from a network
 * outside the admin IP allow-list. Outside the admin shell on purpose.
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
        <Icon />
        <h1 className={h1}>Your role can&apos;t open that page</h1>
        <p className={lead}>
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

  if (state.state === "ip_blocked") {
    return (
      <DeniedShell>
        <Icon />
        <h1 className={h1}>Not from this network</h1>
        <p className={lead}>
          The admin panel only opens from approved networks, and this one ({maskIp(state.ip)}) isn&apos;t on the list. Connect to
          your office network or VPN, or ask an owner to add it in Admin → Security.
        </p>
        <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
          <Link href="/dashboard" className={`${btn} bg-[#5440e8] text-white hover:bg-[#4430d6]`}>
            Back to my dashboard
          </Link>
          <SignOutButton className={`${btn} bg-white text-[#121226]`} label="Sign in as someone else" />
        </div>
        {logged}
      </DeniedShell>
    );
  }

  // Opened directly (no redirect from a guarded page in the last two minutes): log this visit too,
  // so "This attempt was logged" is always true.
  const recent = await prisma.auditLog
    .findFirst({ where: { action: "admin.denied", actorId: session.sub, createdAt: { gte: new Date(nowMs() - 120_000) } }, select: { id: true } })
    .catch(() => null);
  if (!recent) {
    const ctx = await requestContext();
    await logAdminDenied(session.sub, DENIED_PATH, ctx.ip);
  }

  return (
    <DeniedShell>
      <Icon />
      <h1 className={h1}>This area is for the LaunchCV team.</h1>
      <p className={lead}>Your account doesn&apos;t have admin access. If you think it should, ask the owner to invite you.</p>
      <div className="mt-7 flex flex-col justify-center gap-2.5 sm:flex-row">
        <Link href="/dashboard" className={`${btn} bg-[#5440e8] text-white hover:bg-[#4430d6]`}>
          Back to my dashboard
        </Link>
        <SignOutButton className={`${btn} bg-white text-[#121226]`} label="Sign in as someone else" />
      </div>
      {logged}
    </DeniedShell>
  );
}
