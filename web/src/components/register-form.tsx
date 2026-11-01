"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, ArrowRight, Gift, BarChart3 } from "lucide-react";
import {
  AuthLayout,
  AuthNotice,
  authEyeBtnCls,
  authH1Cls,
  authHintCls,
  authInlineLinkCls,
  authInputCls,
  authLabelCls,
  authLeadCls,
  authSubmitCls,
} from "@/components/auth-layout";
import { GoogleSignInButton, AuthDivider } from "@/components/google-sign-in-button";
import { trackSignUpStart, trackSignUpComplete, identifyUser } from "@/lib/analytics-client";

/** Mirror of middleware's safeNextPath — blocks off-site bounces via `?next=`. */
function safeNextPath(value: string | null): string | null {
  if (!value) return null;
  if (value.length > 512) return null;
  if (!value.startsWith("/")) return null;
  if (value.startsWith("//") || value.startsWith("/\\")) return null;
  if (value.includes("://")) return null;
  return value;
}

/** Maps `?error=` codes from the Google OAuth callback to friendly copy. */
const GOOGLE_ERRORS: Record<string, string> = {
  google_unavailable: "Google sign-up isn't available right now. Use your email instead.",
  google_denied: "Google sign-up was cancelled.",
  google_state: "Your Google session expired. Please try again.",
  google_profile: "We couldn't read your Google profile. Please try again.",
  google_unverified_email: "Your Google email isn't verified. Verify it with Google, then retry.",
  google_server: "Something went wrong finishing Google sign-up. Please try again.",
};

export function RegisterForm({ googleEnabled = false }: { googleEnabled?: boolean }) {
  const sp = useSearchParams();
  const referralCode = sp.get("ref")?.trim() || "";
  const next = safeNextPath(sp.get("next")) || "/dashboard";
  const fromReport = next.startsWith("/dashboard/ats-report/");
  const atsRaw = Number(sp.get("ats"));
  const atsScore = Number.isFinite(atsRaw) && atsRaw > 0 && atsRaw <= 100 ? Math.round(atsRaw) : null;
  const googleError = GOOGLE_ERRORS[sp.get("error") ?? ""] ?? null;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(googleError);
  const [loading, setLoading] = useState(false);

  // Top of the sign-up funnel: the register page was opened.
  useEffect(() => {
    trackSignUpStart({ has_referral: !!referralCode });
  }, [referralCode]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        email,
        password,
        ...(referralCode ? { referralCode } : {}),
      }),
    });
    setLoading(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({}));
      setError(j.error ?? "Something went wrong. Please try again.");
      return;
    }
    // Account created — identify the browser session against our internal user
    // id (no PII) so the purchase funnel later stitches to the server-side
    // `purchase` event, then fire the conversion before the full-page redirect.
    const created = (await res.json().catch(() => ({}))) as { userId?: string };
    if (created.userId) identifyUser(created.userId);
    trackSignUpComplete({ has_referral: !!referralCode });
    window.location.href = next;
  }

  return (
    <AuthLayout mode="register">
      {/* Header */}
      <div>
        <h1 className={authH1Cls}>
          {fromReport ? "Save your report." : "Create your account."} <span className="text-[#7c7a94]">It&apos;s free.</span>
        </h1>
        <p className={authLeadCls}>
          {fromReport
            ? "See every issue we found and keep it with your resume. No credit card."
            : "Check and fix your resume, then pick a plan when you need the AI tools."}{" "}
          Already have an account?{" "}
          <Link href="/login" className={authInlineLinkCls}>
            Sign in
          </Link>
        </p>
        {referralCode ? (
          <div className="mt-4 flex items-center gap-2.5 rounded-2xl bg-[#e4dfff] px-4 py-3">
            <Gift className="h-4 w-4 shrink-0 text-[#3a2bb8]" aria-hidden="true" />
            <p className="text-[14px] font-semibold text-[#3a2bb8]">
              Referral applied: <span className="font-extrabold">{referralCode}</span>
            </p>
          </div>
        ) : null}
        {atsScore !== null ? (
          <div className="lc-card mt-4 flex items-center gap-3 rounded-2xl px-4 py-3.5">
            <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#e4dfff]">
              <BarChart3 className="h-[18px] w-[18px] text-[#5440e8]" aria-hidden="true" />
            </span>
            <p className="text-[14px] leading-snug text-[#4a4862]">
              Your ATS score: <span className="font-bold text-[#121226]">{atsScore}/100</span>. Create your account to see every fix.
            </p>
          </div>
        ) : null}
      </div>

      {/* Social sign-up */}
      {googleEnabled ? (
        <div className="mt-7 space-y-5">
          <GoogleSignInButton mode="register" next={next} referralCode={referralCode || null} />
          <AuthDivider label="or with email" />
        </div>
      ) : null}

      {/* Form */}
      <form onSubmit={onSubmit} className={googleEnabled ? "mt-5" : "mt-7"}>
        <div>
          <label htmlFor="reg-name" className={authLabelCls}>
            Full name <span className={authHintCls}>(optional)</span>
          </label>
          <input
            id="reg-name"
            className={authInputCls}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Johnson"
            autoComplete="name"
          />
        </div>

        <div className="mt-4">
          <label htmlFor="reg-email" className={authLabelCls}>
            Email
          </label>
          <input
            id="reg-email"
            type="email"
            required
            className={authInputCls}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
            aria-describedby={error ? "reg-error" : undefined}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="reg-password" className={authLabelCls}>
            Password <span className={authHintCls}>(min 8)</span>
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPw ? "text" : "password"}
              required
              minLength={8}
              className={`${authInputCls} pr-14`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              placeholder="••••••••"
              aria-describedby={error ? "reg-error" : undefined}
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPw ? "Hide password" : "Show password"}
              className={`${authEyeBtnCls} mt-[3px]`}
              onClick={() => setShowPw((s) => !s)}
            >
              {showPw ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        {error ? (
          <div id="reg-error" className="mt-4">
            <AuthNotice tone="error">
              <p>{error}</p>
            </AuthNotice>
          </div>
        ) : null}

        <button type="submit" disabled={loading} className={`${authSubmitCls} group mt-6`}>
          {loading ? "Creating account…" : "Create my account"}
          {loading ? (
            <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden="true" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
          )}
        </button>
      </form>

      <p className="mt-4 text-[12px] leading-[18px] text-[#66647c]">
        By creating an account you agree to our{" "}
        <Link href="/legal/terms" className="font-semibold text-[#4a4862] underline underline-offset-2 transition-colors hover:text-[#5440e8]">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="font-semibold text-[#4a4862] underline underline-offset-2 transition-colors hover:text-[#5440e8]">
          Privacy Policy
        </Link>
        .
      </p>
    </AuthLayout>
  );
}
