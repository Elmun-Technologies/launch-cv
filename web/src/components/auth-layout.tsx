import { Check, Star, ArrowUpRight } from "lucide-react";
import { Logo } from "@/components/logo";

const FEATURES = [
  "JD alignment · keyword gap map",
  "ATS scoring across 15 engines",
  "Cover letters in 60 seconds",
  "AI interview drills with feedback",
  "Voice input · 12 languages",
];

const TESTIMONIAL = {
  name: "Marcus T.",
  role: "Product Manager → Notion",
  text: "ATS score went from 38 → 93. Three offers in two weeks. The fixes were obvious in hindsight.",
  rating: 5,
};

type AuthLayoutProps = {
  children: React.ReactNode;
  mode: "register" | "login";
};

export function AuthLayout({ children, mode }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#FAFAF7]">
      {/* ── Left panel — editorial ── */}
      <div className="relative hidden flex-col overflow-hidden bg-[#0B0F19] lg:flex lg:w-[52%]">
        <div className="lc-grid-bg pointer-events-none absolute inset-0 opacity-50" aria-hidden />
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute -left-32 -top-32 h-[520px] w-[520px] rounded-full bg-[#1A56DB] opacity-[0.25] blur-[140px]" />
          <div className="absolute -bottom-32 -right-20 h-[420px] w-[420px] rounded-full bg-[#7C3AED] opacity-[0.20] blur-[120px]" />
        </div>

        <div className="relative flex flex-1 flex-col p-12">
          <div className="shrink-0">
            <Logo variant="dark" size="md" />
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <span className="lc-overline text-white/55">{mode === "register" ? "New file · Vol. 26" : "Sign in"}</span>

            <h2 className="mt-5 font-display text-[44px] font-extrabold leading-[0.95] tracking-[-0.035em] text-white sm:text-[56px]">
              {mode === "register" ? (
                <>
                  Start the<br />
                  <span className="lc-mega-italic text-white/90">job search</span><br />
                  <span className="lc-gradient-text-animated">that actually works.</span>
                </>
              ) : (
                <>
                  Welcome<br />
                  <span className="lc-mega-italic text-white/90">back.</span>
                </>
              )}
            </h2>

            <p className="mt-6 max-w-[440px] font-body text-[16px] leading-[1.65] text-white/70">
              {mode === "register"
                ? "Six AI tools, one paid plan. Match the resume, score the ATS, write the letter, drill the interview — all under one subscription."
                : "Your resumes, drafts, applications and AI tools are all where you left them."}
            </p>

            {mode === "register" && (
              <ul className="mt-8 space-y-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 font-body text-[14px] text-white/85">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1A56DB]/25 ring-1 ring-[#1A56DB]/40">
                      <Check className="h-3.5 w-3.5 text-[#60A5FA]" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            )}

            {/* Testimonial card */}
            <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur">
              <div className="flex gap-0.5">
                {Array.from({ length: TESTIMONIAL.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <p className="mt-3 font-display text-[16px] leading-[1.45] text-white">&ldquo;{TESTIMONIAL.text}&rdquo;</p>
              <p className="mt-3 font-body text-[12px] text-white/55">
                <span className="font-bold text-white">{TESTIMONIAL.name}</span> · {TESTIMONIAL.role}
              </p>
            </div>
          </div>

          {/* Footer signal strip */}
          <div className="mt-8 flex items-center gap-4 border-t border-white/10 pt-5">
            <p className="font-body text-[11px] uppercase tracking-[0.16em] text-white/40">Trusted by people at</p>
            <div className="flex gap-3 overflow-hidden">
              {["Stripe", "Notion", "Linear", "HubSpot"].map((n) => (
                <span key={n} className="font-display text-[14px] font-bold text-white/50">{n}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#FAFAF7] px-5 py-12 sm:px-10">
        <div className="mb-8 lg:hidden">
          <Logo variant="light" size="md" />
        </div>
        <div className="w-full max-w-[420px]">
          <div className="rounded-3xl border border-[#E2E8F0] bg-white p-8 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.18)] sm:p-10">
            {children}
          </div>
          <p className="mt-6 text-center font-body text-[12px] text-[#94A3B8]">
            Need help? <a href="mailto:hello@launch-cv.com" className="inline-flex items-center gap-1 font-bold text-[#1A56DB] hover:underline">Email us <ArrowUpRight className="h-3 w-3" /></a>
          </p>
        </div>
      </div>
    </div>
  );
}
