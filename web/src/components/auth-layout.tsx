import Link from "next/link";
import { Check, Star } from "lucide-react";

const SOCIAL_PROOF = [
  { name: "Sarah K.", role: "Software Engineer → Stripe", text: "From 0 interviews in 3 months to 4 in one week.", rating: 5 },
  { name: "Marcus T.", role: "Product Manager → Notion", text: "ATS score went from 38% to 93%. 3 offers in 2 weeks.", rating: 5 },
  { name: "Priya N.", role: "Marketing Lead → HubSpot", text: "Cover letter generator saved me 2–3 hours per application.", rating: 5 },
];

const FEATURES = [
  "AI-powered JD alignment & keyword matching",
  "ATS score checker across 15+ platforms",
  "Cover letter generator in 60 seconds",
  "Interview prep with role-specific questions",
];

type AuthLayoutProps = {
  children: React.ReactNode;
  mode: "register" | "login";
};

export function AuthLayout({ children, mode }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* ── Left panel — social proof ── */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-[#0F172A] p-10 lg:flex lg:w-[52%]">
        {/* Blobs */}
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          <div className="absolute left-[-80px] top-[-80px] h-[420px] w-[420px] rounded-full bg-[#1A56DB] opacity-[0.18] blur-[100px]" />
          <div className="absolute bottom-[-60px] right-[-40px] h-[360px] w-[360px] rounded-full bg-[#7C3AED] opacity-[0.15] blur-[100px]" />
        </div>

        {/* Logo */}
        <Link href="/" className="relative flex items-center gap-2.5">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1A56DB] text-[14px] font-bold text-white shadow-lg shadow-blue-500/30">
            L
          </span>
          <span className="font-display text-[17px] font-bold text-white">Launch CV</span>
        </Link>

        {/* Main content */}
        <div className="relative">
          <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/8 px-4 py-1.5">
            <span className="font-body text-[12px] font-semibold text-white/80">✨ AI-powered job search platform</span>
          </div>

          <h2 className="font-display text-[36px] font-bold leading-[1.15] tracking-[-0.02em] text-white lg:text-[42px]">
            {mode === "register"
              ? "Land interviews 3× faster with AI"
              : "Welcome back to Launch CV"}
          </h2>
          <p className="mt-4 font-body text-[15px] leading-[1.7] text-[#94A3B8]">
            {mode === "register"
              ? "AI-tailored resumes, ATS scoring, cover letters, and interview prep — everything you need for a serious job search."
              : "Your resumes, applications, and AI tools are waiting. Pick up where you left off."}
          </p>

          {/* Feature bullets */}
          {mode === "register" && (
            <ul className="mt-7 space-y-3">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-center gap-3 font-body text-[14px] text-[#CBD5E1]">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#1A56DB]/30">
                    <Check className="h-3 w-3 text-[#60A5FA]" />
                  </span>
                  {f}
                </li>
              ))}
            </ul>
          )}

          {/* Stats row */}
          <div className="mt-10 grid grid-cols-3 gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
            {[
              { value: "50K+", label: "Resumes built" },
              { value: "4.9★", label: "User rating" },
              { value: "95%", label: "ATS pass rate" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="font-display text-[22px] font-bold text-white">{s.value}</p>
                <p className="mt-0.5 font-body text-[11px] text-[#94A3B8]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonial cards */}
        <div className="relative space-y-3">
          <p className="font-body text-[11px] font-bold uppercase tracking-[0.08em] text-[#64748B]">What users say</p>
          {SOCIAL_PROOF.map((t) => (
            <div key={t.name} className="rounded-xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
              <div className="flex gap-0.5">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3 w-3 fill-[#F59E0B] text-[#F59E0B]" />
                ))}
              </div>
              <p className="mt-2 font-body text-[13px] leading-snug text-[#CBD5E1]">&ldquo;{t.text}&rdquo;</p>
              <p className="mt-2 font-body text-[11px] text-[#64748B]">
                <span className="font-semibold text-[#94A3B8]">{t.name}</span> · {t.role}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-[#F8FAFC] px-5 py-14 sm:px-10">
        {/* Mobile logo */}
        <Link href="/" className="mb-8 flex items-center gap-2 lg:hidden">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#1A56DB] text-[13px] font-bold text-white">L</span>
          <span className="font-display text-[16px] font-bold text-[#0F172A]">Launch CV</span>
        </Link>

        <div className="w-full max-w-[400px]">
          {children}
        </div>
      </div>
    </div>
  );
}
