import Link from "next/link";

/** The official multi-colour Google "G" mark. */
function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09Z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.24 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23Z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.11a6.6 6.6 0 0 1 0-4.22V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.84Z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1A11 11 0 0 0 2.18 7.05l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38Z"
      />
    </svg>
  );
}

type GoogleSignInButtonProps = {
  /** Where to return the user after auth (validated same-origin path). */
  next?: string | null;
  /** Optional referral code to carry through sign-up. */
  referralCode?: string | null;
  /** Button copy — "signin" or "signup" contexts. */
  mode?: "login" | "register";
};

/**
 * "Continue with Google" button. It's a plain link to the server-side OAuth
 * start route (a full navigation, not fetch), so the browser follows Google's
 * redirects normally.
 */
export function GoogleSignInButton({ next, referralCode, mode = "login" }: GoogleSignInButtonProps) {
  const params = new URLSearchParams();
  if (next) params.set("next", next);
  if (referralCode) params.set("ref", referralCode);
  const href = `/api/auth/google/start${params.toString() ? `?${params.toString()}` : ""}`;
  const label = mode === "register" ? "Sign up with Google" : "Continue with Google";

  return (
    <Link
      href={href}
      prefetch={false}
      className="flex w-full items-center justify-center gap-3 rounded-full border border-[#E2E8F0] bg-white py-3 text-[14px] font-semibold text-[#1E293B] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition hover:border-[#CBD5E1] hover:bg-[#F8FAFC] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1A56DB]/30"
    >
      <GoogleGlyph className="h-[18px] w-[18px]" />
      {label}
    </Link>
  );
}

/** A labelled "or" divider used between the Google button and the email form. */
export function AuthDivider({ label = "or" }: { label?: string }) {
  return (
    <div className="flex items-center gap-3" role="separator" aria-label={label}>
      <span className="h-px flex-1 bg-[#E2E8F0]" />
      <span className="text-[11px] font-medium uppercase tracking-wider text-[#94A3B8]">{label}</span>
      <span className="h-px flex-1 bg-[#E2E8F0]" />
    </div>
  );
}
