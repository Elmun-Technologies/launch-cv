import { Check, Star } from "lucide-react";
import { Logo } from "@/components/logo";

const FEATURES = [
  "JD alignment with keyword gap map",
  "ATS scoring across 15 engines",
  "Cover letters in 60 seconds",
  "AI interview drills with feedback",
  "Voice input in 12 languages",
];

const TESTIMONIAL = {
  name: "Marcus T.",
  role: "Product Manager at Notion",
  text: "ATS score went from 38 to 93. Three offers in two weeks. The fixes were obvious in hindsight.",
  rating: 5,
};

type AuthLayoutProps = {
  children: React.ReactNode;
  mode: "register" | "login";
};

export function AuthLayout({ children, mode }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-[#FAFBFC]">
      {/* LEFT PANEL */}
      <div className="relative hidden flex-col bg-white lg:flex lg:w-[48%] lg:border-r lg:border-[#E2E8F0]">
        <div className="flex flex-1 flex-col p-12">
          <div className="shrink-0">
            <Logo variant="light" size="md" />
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <p className="lc-overline text-[#1A56DB]">{mode === "register" ? "Create your account" : "Sign in"}</p>

            <h2 className="mt-4 text-[36px] font-semibold leading-[1.1] tracking-tight text-[#0F172A] sm:text-[44px]">
              {mode === "register"
                ? "Start the job search that actually works"
                : "Welcome back to Launch CV"}
            </h2>

            <p className="mt-5 max-w-[440px] text-[15px] leading-[1.65] text-[#475569]">
              {mode === "register"
                ? "Six AI tools, one paid plan. Match the resume, score the ATS, write the letter, drill the interview — all under one subscription."
                : "Your resumes, drafts, applications, and AI tools are all where you left them."}
            </p>

            {mode === "register" && (
              <ul className="mt-8 space-y-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-[14px] text-[#334155]">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF]">
                      <Check className="h-3 w-3 text-[#1A56DB]" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            )}

            <figure className="mt-10 rounded-xl border border-[#E2E8F0] bg-[#FAFBFC] p-5">
              <div className="flex gap-0.5">
                {Array.from({ length: TESTIMONIAL.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <blockquote className="mt-3 text-[15px] leading-[1.55] text-[#0F172A]">
                &ldquo;{TESTIMONIAL.text}&rdquo;
              </blockquote>
              <figcaption className="mt-3 text-[12px] text-[#64748B]">
                <span className="font-semibold text-[#0F172A]">{TESTIMONIAL.name}</span> · {TESTIMONIAL.role}
              </figcaption>
            </figure>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-[#E2E8F0] pt-5">
            <p className="text-[11px] font-medium uppercase tracking-wider text-[#94A3B8]">Trusted by people at</p>
            <div className="flex flex-wrap gap-3">
              {["Stripe", "Notion", "Linear", "HubSpot"].map((n) => (
                <span key={n} className="text-[13px] font-semibold text-[#64748B]">
                  {n}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — FORM */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#FAFBFC] px-5 py-12 sm:px-10">
        <div className="mb-8 lg:hidden">
          <Logo variant="light" size="md" />
        </div>
        <div className="w-full max-w-[420px]">
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-8 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.18)] sm:p-10">
            {children}
          </div>
          <p className="mt-6 text-center text-[12px] text-[#94A3B8]">
            Need help?{" "}
            <a href="mailto:hello@launch-cv.com" className="font-semibold text-[#1A56DB] underline-offset-2 hover:underline">
              Email us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
