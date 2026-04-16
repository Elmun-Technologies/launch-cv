import Link from "next/link";
import { Check, Star } from "lucide-react";
import { Logo } from "@/components/logo";

const FEATURES = [
  "JD alignment & ATS keyword matching",
  "ATS score across 15+ platforms",
  "Cover letter in 60 seconds",
  "Interview prep with AI feedback",
];

const TESTIMONIAL = {
  name: "Marcus T.",
  role: "Product Manager → Notion",
  text: "ATS score went from 38% to 93%. 3 offers in 2 weeks.",
  rating: 5,
};

type AuthLayoutProps = {
  children: React.ReactNode;
  mode: "register" | "login";
};

export function AuthLayout({ children, mode }: AuthLayoutProps) {
  return (
    <div className="h-screen overflow-hidden flex">
      {/* ── Left panel ── */}
      <div className="relative hidden flex-col bg-[#0F172A] p-10 lg:flex lg:w-[48%]">
        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-[-80px] top-[-80px] h-[420px] w-[420px] rounded-full bg-[#1A56DB] opacity-[0.18] blur-[100px]" />
          <div className="absolute bottom-[-60px] right-[-40px] h-[360px] w-[360px] rounded-full bg-[#7C3AED] opacity-[0.12] blur-[80px]" />
        </div>

        {/* Logo */}
        <div className="relative shrink-0">
          <Logo variant="dark" size="md" />
        </div>

        {/* Middle content — centered vertically */}
        <div className="relative flex flex-1 flex-col justify-center">
          {/* Badge */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-3 py-1.5 w-fit">
            <span className="font-body text-[12px] font-semibold text-white/80">✨ AI-powered job search platform</span>
          </div>

          {/* Headline */}
          <h2 className="font-display text-[32px] font-bold leading-[1.15] tracking-[-0.02em] text-white lg:text-[38px]">
            {mode === "register"
              ? "Land interviews 3× faster with AI"
              : "Welcome back to Launch CV"}
          </h2>
          <p className="mt-3 font-body text-[14px] leading-[1.7] text-[#94A3B8]">
            {mode === "register"
              ? "AI-tailored resumes, ATS scoring, cover letters, and interview prep in one platform."
              : "Your resumes, applications, and AI tools are waiting."}
          </p>

          {/* Feature bullets */}
          {mode === "register" && (
            <ul className="mt-6 space-y-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-2.5 font-body text-[13px] text-[#CBD5E1]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1A56DB]/30">
                    <Check className="h-3 w-3 text-[#60A5FA]" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          )}

          {/* Stats */}
          <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            {[
              { value: "50K+", label: "Resumes built" },
              { value: "4.9★", label: "User rating" },
              { value: "95%", label: "ATS pass rate" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-[20px] font-bold text-white">{s.value}</p>
                <p className="mt-0.5 font-body text-[10px] text-[#94A3B8]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Single testimonial */}
          <div className="mt-5 rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex gap-0.5">
              {Array.from({ length: TESTIMONIAL.rating }).map((_, i) => (
                <Star key={i} className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
              ))}
            </div>
            <p className="mt-2 font-body text-[13px] leading-snug text-[#CBD5E1]">&ldquo;{TESTIMONIAL.text}&rdquo;</p>
            <p className="mt-1.5 font-body text-[11px] text-[#64748B]">
              <span className="font-semibold text-[#94A3B8]">{TESTIMONIAL.name}</span> · {TESTIMONIAL.role}
            </p>
          </div>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto bg-white px-5 py-10 sm:px-10">
        {/* Mobile logo */}
        <div className="mb-6 lg:hidden">
          <Logo variant="light" size="md" />
        </div>
        <div className="w-full max-w-[380px]">
          {children}
        </div>
      </div>
    </div>
  );
}
