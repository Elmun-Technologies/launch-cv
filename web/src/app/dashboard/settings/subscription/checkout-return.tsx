import Image from "next/image";
import Link from "next/link";
import { ArrowRight, FileText, Loader2, Mail, Target } from "lucide-react";
import { Badge } from "@/components/app/account/ui";

const NEXT_STEPS = [
  {
    href: "/dashboard/resumes",
    icon: FileText,
    t: "Go to my resumes",
    d: "Open a resume to match it to a job, write a cover letter or prep for an interview",
  },
  {
    href: "/dashboard/company-matcher",
    icon: Target,
    t: "Tailor your resume to one employer",
    d: "See which of a company's keywords and values you already cover",
  },
  {
    href: "/dashboard/settings/email-templates",
    icon: Mail,
    t: "Draft an email with AI",
    d: "Follow-ups, thank-you notes and intros from your resume",
  },
] as const;

/**
 * Shown on the billing page after Polar sends the buyer back (?checkout=success):
 * "waiting" while the webhook catches up, "confirmed" once the plan is active,
 * "slow" if it still hasn't landed after polling.
 */
export function CheckoutReturn({
  state,
  planTitle,
  renewLine,
}: {
  state: "waiting" | "confirmed" | "slow";
  planTitle: string | null;
  renewLine: string | null;
}) {
  if (state !== "confirmed") {
    const slow = state === "slow";
    return (
      <div className={`flex items-start gap-3.5 rounded-[24px] px-5 py-4 sm:px-6 sm:py-5 ${slow ? "bg-[#fdf0d5]" : "bg-[#e4dfff]"}`}>
        {slow ? null : <Loader2 className="mt-0.5 h-5 w-5 shrink-0 animate-spin text-[#3a2bb8]" aria-hidden />}
        <div className="min-w-0">
          <p className="text-[16px] font-extrabold text-[#121226]">
            {slow ? "Payment received. Your plan is still activating." : "Payment received. Activating your plan…"}
          </p>
          <p className={`mt-1 text-[14px] leading-[21px] ${slow ? "text-[#5c3500]" : "text-[#24223a]"}`}>
            {slow
              ? "Refresh this page in a minute. If it still shows no plan, contact support and we'll sort it out."
              : "This usually takes a few seconds."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="lc-card grid gap-6 overflow-hidden rounded-[28px] p-5 sm:p-7 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch lg:p-8">
      <div className="flex flex-col justify-center">
        <Badge tone="green" className="self-start px-3 py-[7px] text-[13px]">
          Payment received — you&apos;re all set
        </Badge>
        <h2 className="mt-4 text-[32px] font-extrabold leading-[36px] tracking-[-0.04em] text-[#121226] sm:text-[44px] sm:leading-[48px]">
          {planTitle ? <>You&apos;re on {planTitle}.</> : <>Your plan is active.</>}{" "}
          <span className="text-[#7c7a94]">Let&apos;s use it.</span>
        </h2>
        <p className="mt-3 text-[16px] leading-[25px] text-[#4a4862]">
          Every AI tool is unlocked.{renewLine ? ` ${renewLine}` : ""}
        </p>
        <ul className="mt-5 flex flex-col gap-2">
          {NEXT_STEPS.map((s, i) => {
            const Icon = s.icon;
            const first = i === 0;
            return (
              <li key={s.href}>
                <Link
                  href={s.href}
                  className={`group flex min-h-11 items-center gap-3.5 rounded-[20px] px-4 py-3.5 transition-colors focus-visible:rounded-[20px]! motion-reduce:transition-none sm:px-[18px] sm:py-4 ${
                    first ? "bg-[#5440e8] text-white hover:bg-[#4430d6]" : "bg-[#f7f6fb] text-[#121226] hover:bg-[#efedf7]"
                  }`}
                >
                  <span
                    className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${first ? "bg-white text-[#3a2bb8]" : "bg-[#e4dfff] text-[#3a2bb8]"}`}
                  >
                    <Icon className="h-[18px] w-[18px]" aria-hidden />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-bold">{s.t}</span>
                    <span className={`block text-[13px] leading-[19px] ${first ? "text-[#e4dfff]" : "text-[#4a4862]"}`}>{s.d}</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 transition-transform motion-safe:group-hover:translate-x-0.5" aria-hidden />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      <div aria-hidden="true" className="relative hidden min-h-[420px] overflow-hidden rounded-[28px] bg-[#111118] lg:block">
        <p className="lc-poster absolute left-7 top-6 m-0 text-[88px] leading-[84px] text-[#2a2840] xl:text-[104px] xl:leading-[100px]">
          LET&apos;S
          <br />
          GO
        </p>
        <div className="absolute bottom-[-170px] left-1/2 h-[440px] w-[440px] -translate-x-1/2 rounded-full bg-[#5440e8]" />
        <Image
          src="/images/people/woman-red-top.webp"
          alt=""
          width={747}
          height={1080}
          sizes="270px"
          className="absolute bottom-0 left-1/2 h-[390px] w-auto max-w-none -translate-x-1/2"
        />
        {planTitle ? (
          <span className="lc-poster absolute right-7 top-[230px] -rotate-6 rounded-full bg-[#ff7a33] px-[15px] py-[9px] text-[13px] text-[#111118]">
            {planTitle.toUpperCase()}
          </span>
        ) : null}
      </div>
    </div>
  );
}
