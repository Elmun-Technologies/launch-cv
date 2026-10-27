"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Loader2, Eye, EyeOff, ArrowRight, Gift, BarChart3 } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
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
      <div className="mb-5">
        <h1 className="text-[30px] font-semibold leading-[1.12] tracking-[-0.03em] text-[#111111]">
          {fromReport ? (
            <>
              Save your report. <span className="text-[#6E6E6A]">It&apos;s free.</span>
            </>
          ) : (
            <>
              Create your account. <span className="text-[#6E6E6A]">It&apos;s free.</span>
            </>
          )}
        </h1>
        <p className="mt-2.5 text-[15px] leading-[1.6] text-[#3F3F3F]">
          {fromReport
            ? "See every issue we found and keep it with your resume. No credit card."
            : "Check and fix your resume, then pick a plan when you need the AI tools."}{" "}
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
            Sign in
          </Link>
        </p>
        {referralCode ? (
          <div className="mt-4 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
            <Gift className="h-3.5 w-3.5 shrink-0 text-blue-600" />
            <p className="text-[12px] font-semibold text-blue-700">
              Referral applied: <span className="font-bold">{referralCode}</span>
            </p>
          </div>
        ) : null}
        {atsScore !== null ? (
          <div className="mt-4 flex items-center gap-2.5 rounded-[12px] bg-[#F5F5F3] px-3.5 py-3">
            <BarChart3 className="h-4 w-4 shrink-0 text-[#111111]" />
            <p className="text-[13px] leading-snug text-[#3F3F3F]">
              Your ATS score: <span className="font-bold">{atsScore}/100</span>. Create your
              account to see every fix.
            </p>
          </div>
        ) : null}
      </div>

      {/* Social sign-up */}
      {googleEnabled ? (
        <div className="mb-5 space-y-4">
          <GoogleSignInButton mode="register" next={next} referralCode={referralCode || null} />
          <AuthDivider label="or sign up with email" />
        </div>
      ) : null}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-3.5">
        <div>
          <label htmlFor="reg-name" className="mb-1.5 block text-[13px] font-medium text-[#111111]">
            Full name <span className="font-normal text-[#6B6B6B]">(optional)</span>
          </label>
          <input
              id="reg-name"
            className="h-[46px] w-full rounded-[10px] border border-[#D9D9D5] bg-white px-3.5 text-[15px] text-[#111111] outline-none transition focus:border-[#111111] focus:ring-4 focus:ring-black/5"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Alex Johnson"
            autoComplete="name"
          />
        </div>

        <div>
          <label htmlFor="reg-email" className="mb-1.5 block text-[13px] font-medium text-[#111111]">Email</label>
          <input
              id="reg-email"
            type="email"
            required
            className="h-[46px] w-full rounded-[10px] border border-[#D9D9D5] bg-white px-3.5 text-[15px] text-[#111111] outline-none transition focus:border-[#111111] focus:ring-4 focus:ring-black/5"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@email.com"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="reg-password" className="mb-1.5 block text-[13px] font-medium text-[#111111]">
            Password <span className="font-normal text-[#6B6B6B]">(min 8)</span>
          </label>
          <div className="relative">
            <input
              id="reg-password"
              type={showPw ? "text" : "password"}
              required
              minLength={8}
              className="h-[46px] w-full rounded-[10px] border border-[#D9D9D5] bg-white px-3.5 text-[15px] text-[#111111] outline-none transition focus:border-[#111111] focus:ring-4 focus:ring-black/5 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            <button
              type="button"
              tabIndex={-1}
              aria-label={showPw ? "Hide password" : "Show password"}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6E6E6A] transition hover:text-[#475569]"
              onClick={() => setShowPw((s) => !s)}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {error ? (
          <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2">
            <p className="text-[13px] text-red-700">{error}</p>
          </div>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="mt-2 flex w-full items-center justify-center gap-2 h-[50px] rounded-full bg-[#2563EB] text-[15px] font-medium text-white transition hover:bg-[#1D4ED8] disabled:opacity-60"
        >
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowRight className="h-4 w-4" />}
          {loading ? "Creating account…" : "Create my account"}
        </button>
      </form>

      <p className="mt-5 text-[11px] leading-[1.55] text-[#6E6E6A]">
        By creating an account you agree to our{" "}
        <Link href="/legal/terms" className="font-semibold text-[#475569] underline underline-offset-2 hover:text-[#0F172A]">Terms</Link>{" "}
        and{" "}
        <Link href="/legal/privacy" className="font-semibold text-[#475569] underline underline-offset-2 hover:text-[#0F172A]">Privacy Policy</Link>.
      </p>
    </AuthLayout>
  );
}
