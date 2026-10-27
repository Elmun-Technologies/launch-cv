import Image from "next/image";
import { Logo } from "@/components/logo";

type AuthLayoutProps = {
  children: React.ReactNode;
  mode: "register" | "login";
};

export function AuthLayout({ children, mode }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      {/* FORM */}
      <div className="flex flex-1 flex-col px-5 py-8 sm:px-12 lg:px-16">
        <header className="shrink-0">
          <Logo variant="light" size="md" />
        </header>
        <main className="mx-auto flex w-full max-w-[400px] flex-1 flex-col justify-center py-10">
          {children}
          <p className="mt-8 text-center text-[13px] text-[#6B6B6B]">
            Need help?{" "}
            <a href="mailto:support@launch-cv.com" className="font-medium text-[#1D4ED8] underline decoration-[#1D4ED8]/30 underline-offset-2 hover:decoration-[#1D4ED8]">
              Email us
            </a>
          </p>
        </main>
      </div>

      {/* PHOTO */}
      <div className="relative hidden w-[46%] max-w-[680px] overflow-hidden lg:block" aria-hidden>
        <Image
          src="/images/photos/job-seeker-laptop.webp"
          alt=""
          fill
          priority
          sizes="46vw"
          className="object-cover object-[60%_center]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/50" />
        <div className="absolute inset-x-10 bottom-10 flex items-center gap-5 rounded-2xl bg-white p-5 shadow-[0_20px_40px_-20px_rgba(0,0,0,0.5)]">
          {mode === "register" ? (
            <>
              <div className="shrink-0 whitespace-nowrap">
                <p className="text-[13px] text-[#6B6B6B]">Free ATS check</p>
                <p className="text-[24px] font-semibold tracking-[-0.02em] text-[#111111]">
                  54 <span className="text-[#6E6E6A]">→</span> 89
                </p>
              </div>
              <div className="h-12 w-px shrink-0 bg-[#EEEEEB]" />
              <p className="text-[14px] leading-[1.5] text-[#3F3F3F]">
                See every issue, fix it with AI and tailor your resume to each job.
              </p>
            </>
          ) : (
            <p className="text-[15px] leading-[1.5] text-[#3F3F3F]">
              Your resumes, reports and applications are where you left them.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
