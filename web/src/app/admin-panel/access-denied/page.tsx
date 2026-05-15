import Link from "next/link";
import { redirect } from "next/navigation";
import { ShieldOff, ArrowLeft, ArrowRight } from "lucide-react";
import { getSession } from "@/lib/session";
import { requireAdmin } from "@/lib/admin-guard";

/**
 * Rendered when a logged-in user without admin privileges hits any
 * /admin-panel/* route. Middleware has already verified they're logged in.
 * This page exists outside the admin shell so the user clearly sees they
 * don't have access (instead of being silently bounced to /dashboard).
 */
export default async function AccessDeniedPage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/admin-panel");

  // If the user actually IS an admin (e.g. they revisited this page after
  // their role was upgraded) send them back into the panel.
  const admin = await requireAdmin();
  if (admin) redirect("/admin-panel");

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FAFBFC] px-6">
      <div className="w-full max-w-[460px] rounded-2xl border border-[#E2E8F0] bg-white p-8 text-center shadow-[0_24px_60px_-30px_rgba(15,23,42,0.18)]">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-red-700">
          <ShieldOff className="h-6 w-6" />
        </div>
        <h1 className="mt-5 text-[22px] font-semibold tracking-tight text-[#0F172A]">
          Admin access required
        </h1>
        <p className="mt-2 text-[14px] leading-[1.65] text-[#475569]">
          You&apos;re signed in as{" "}
          <span className="font-semibold text-[#0F172A]">{session.email}</span>, but this
          account doesn&apos;t have admin permission.
        </p>

        <div className="mt-6 rounded-lg border border-[#E2E8F0] bg-[#FAFBFC] p-4 text-left text-[13px] leading-[1.65] text-[#475569]">
          To gain access, ask an existing admin to add your email to{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[12px] text-[#0F172A] ring-1 ring-[#E2E8F0]">
            ADMIN_EMAILS
          </code>{" "}
          (Vercel env), or promote your user from{" "}
          <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[12px] text-[#0F172A] ring-1 ring-[#E2E8F0]">
            /admin-panel/settings
          </code>
          .
        </div>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg bg-[#1A56DB] px-4 py-2 text-[13px] font-semibold text-white transition hover:bg-[#1D4ED8]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Go to my dashboard
          </Link>
          <Link
            href="/api/auth/logout"
            className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-[#E2E8F0] bg-white px-4 py-2 text-[13px] font-semibold text-[#0F172A] transition hover:bg-[#FAFBFC]"
          >
            Sign out
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
