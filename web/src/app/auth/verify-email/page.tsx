import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { AuthLayout, AuthNotice, authDarkBtnCls, authH1SmCls, authInlineLinkCls, authLeadCls } from "@/components/auth-layout";
import { CheckInbox } from "./check-inbox";
import { VerifyToken } from "./verify-token";
import { inboxLinkFor, maskEmail } from "./mask-email";

export const metadata: Metadata = {
  title: "Verify your email",
  robots: { index: false, follow: true },
};

function MailBadge() {
  return (
    <span className="inline-flex h-16 w-16 items-center justify-center rounded-[20px] bg-[#e4dfff]">
      <Mail className="h-7 w-7 text-[#5440e8]" strokeWidth={1.8} aria-hidden="true" />
    </span>
  );
}

/** Signed-in user's address and verification state, or null when nobody is signed in (or the DB is unreachable). */
async function signedInUser() {
  const session = await getSession();
  if (!session) return null;
  try {
    return await prisma.user.findUnique({ where: { id: session.sub }, select: { email: true, emailVerifiedAt: true } });
  } catch {
    return null;
  }
}

/**
 * `/auth/verify-email?token=…` verifies the link from the email. Opened
 * without a token by a signed-in user whose address isn't verified yet, it is
 * the "Check your inbox" screen (sign-up itself goes straight to the dashboard).
 */
export default async function VerifyEmailPage({ searchParams }: { searchParams: Promise<{ token?: string | string[] }> }) {
  const raw = (await searchParams).token;
  const token = typeof raw === "string" ? raw : "";
  const user = token ? null : await signedInUser();

  if (user && !user.emailVerifiedAt) {
    const inbox = inboxLinkFor(user.email);
    return (
      <AuthLayout mode="verify">
        <MailBadge />
        <h1 className={`mt-[22px] ${authH1SmCls}`}>Check your inbox.</h1>
        <p className="mt-2.5 text-[16px] leading-[25px] text-[#4a4862]">
          We sent a confirmation link to <b className="font-bold text-[#121226]">{maskEmail(user.email)}</b>. Open it to verify your
          email address.
        </p>
        <CheckInbox inbox={inbox} />
      </AuthLayout>
    );
  }

  if (user?.emailVerifiedAt) {
    return (
      <AuthLayout mode="verify">
        <MailBadge />
        <h1 className={`mt-[22px] ${authH1SmCls}`}>You&apos;re verified.</h1>
        <p className={authLeadCls}>Your email address is already confirmed. Nothing else to do here.</p>
        <Link href="/dashboard" className={`${authDarkBtnCls} group mt-6`}>
          Go to my dashboard
          <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
        </Link>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      mode="verify"
      stageNote={<p className="text-[15px] font-semibold leading-[23px]">Once you&apos;re verified, sign in and pick up where you left off.</p>}
    >
      <MailBadge />
      <h1 className={`mt-[22px] ${authH1SmCls}`}>Verify your email.</h1>
      <p className={authLeadCls}>One-time check — usually finishes in a second or two.</p>
      {token ? (
        <VerifyToken token={token} />
      ) : (
        <AuthNotice tone="error" title="Verification failed" className="mt-6">
          <p className="mt-0.5">The verification token is missing from the link.</p>
        </AuthNotice>
      )}
      {token ? null : <ResendHint />}
    </AuthLayout>
  );
}

function ResendHint() {
  return (
    <p className="mt-[18px] text-[14px] text-[#4a4862]">
      Need a new link?{" "}
      <Link href="/auth/resend-verify" className={authInlineLinkCls}>
        Resend verification email →
      </Link>
    </p>
  );
}
