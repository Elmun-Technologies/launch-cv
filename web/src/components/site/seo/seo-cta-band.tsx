import { CtaLink } from "@/components/cta-link";
import { container, btnWhite } from "@/components/site/ui";

/** Closing purple band with the free ATS check CTA (v5, same shape as the blog index). */
export function SeoCtaBand({ title, sub, location }: { title: string; sub: string; location: string }) {
  return (
    <section className={`${container} pt-14 lg:pt-[110px]`}>
      <div className="lc-reveal flex flex-col items-start justify-between gap-4 rounded-[26px] bg-[#5440e8] px-5 pb-5 pt-[26px] text-white sm:gap-8 sm:rounded-[36px] sm:p-12 lg:flex-row lg:items-center lg:px-16 lg:py-14">
        <div>
          <h2 className="text-[26px] font-extrabold leading-[30px] tracking-[-0.03em] sm:text-[42px] sm:leading-[46px] sm:tracking-[-0.035em]">{title}</h2>
          <p className="mt-2 text-[15px] text-[#e4dfff] sm:mt-3 sm:text-[18px]">{sub}</p>
        </div>
        <CtaLink cta="free_ats_check" location={location} href="/free-ats-check" className={`${btnWhite} shrink-0`}>
          Check my resume — free
        </CtaLink>
      </div>
    </section>
  );
}
