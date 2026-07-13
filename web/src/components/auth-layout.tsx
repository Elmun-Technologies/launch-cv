import { Check } from "lucide-react";
import { Logo } from "@/components/logo";

const FEATURES = [
  "JD alignment with keyword gap map",
  "ATS scoring with a prioritized fix list",
  "Cover letters in about a minute",
  "AI interview questions with model answers",
  "Voice input — speak, AI writes it",
];

type AuthLayoutProps = {
  children: React.ReactNode;
  mode: "register" | "login";
};

export function AuthLayout({ children, mode }: AuthLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-[#FAFBFC]">
      {/* LEFT PANEL */}
      <div className="relative hidden flex-col overflow-hidden bg-white lg:flex lg:w-[48%] lg:border-r lg:border-[#E2E8F0]">
        <div className="flex flex-1 flex-col overflow-y-auto p-10 xl:p-12">
          <div className="shrink-0">
            <Logo variant="light" size="md" />
          </div>

          <div className="flex flex-1 flex-col justify-center">
            <p className="lc-overline text-[#2563EB]">{mode === "register" ? "Create your account" : "Sign in"}</p>

            <h2 className="mt-3 text-[30px] font-semibold leading-[1.1] tracking-tight text-[#0F172A] xl:text-[36px]">
              {mode === "register"
                ? "Start the job search that actually works"
                : "Welcome back to LaunchCV"}
            </h2>

            <p className="mt-4 max-w-[440px] text-[14px] leading-[1.6] text-[#475569]">
              {mode === "register"
                ? "Six AI tools, one paid plan. Match the resume, score the ATS, write the letter, drill the interview."
                : "Your resumes, drafts, applications, and AI tools are all where you left them."}
            </p>

            {mode === "register" && (
              <ul className="mt-6 space-y-2.5">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-[13px] text-[#334155]">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#EFF6FF]">
                      <Check className="h-2.5 w-2.5 text-[#2563EB]" />
                    </span>
                    {f}
                  </li>
                ))}
              </ul>
            )}

          </div>

          <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-[#E2E8F0] pt-4">
            <p className="text-[12px] text-[#64748B]">
              Free ATS score check, no account needed — every tool included on every paid plan.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL — FORM */}
      <div className="flex flex-1 flex-col overflow-y-auto bg-[#FAFBFC] px-5 sm:px-10">
        <div className="mx-auto flex w-full max-w-[420px] flex-1 flex-col items-stretch justify-center py-8">
          <div className="mb-6 lg:hidden">
            <Logo variant="light" size="md" />
          </div>
          <div className="rounded-2xl border border-[#E2E8F0] bg-white p-7 shadow-[0_24px_60px_-30px_rgba(15,23,42,0.18)] sm:p-8">
            {children}
          </div>
          <p className="mt-4 text-center text-[12px] text-[#94A3B8]">
            Need help?{" "}
            <a href="mailto:hello@launch-cv.com" className="font-semibold text-[#2563EB] underline-offset-2 hover:underline">
              Email us
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
