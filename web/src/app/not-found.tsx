import Image from "next/image";
import Link from "next/link";
import { CtaLink } from "@/components/cta-link";
import { SiteShell } from "@/components/site/site-shell";
import { btnPrimary, btnWhite, labelCls } from "@/components/site/ui";

// Next.js adds <meta name="robots" content="noindex"> to every 404 response.

const LINKS = [
  { href: "/free-ats-check", t: "Free ATS check" },
  { href: "/resume-templates", t: "Resume templates" },
  { href: "/resume-examples", t: "Resume examples" },
  { href: "/pricing", t: "Pricing" },
  { href: "/blog", t: "Guides" },
];

export default function NotFound() {
  return (
    <SiteShell>
      <section className="mx-auto max-w-[1280px] px-4 pt-4 sm:px-6 lg:px-10 lg:pt-8">
        <div className="relative flex min-h-[580px] flex-col justify-end overflow-hidden rounded-[28px] bg-[#111118] text-white sm:min-h-[660px] lg:h-[620px] lg:min-h-0 lg:rounded-[36px]">
          <p aria-hidden="true" className="lc-poster absolute left-4 top-2 m-0 text-[120px] leading-[120px] text-[#2a2840] sm:left-8 sm:top-4 sm:text-[180px] sm:leading-[180px] lg:left-10 lg:top-6 lg:text-[220px] lg:leading-[220px]">
            404
          </p>
          <div aria-hidden="true" className="absolute -right-[70px] top-[60px] h-[260px] w-[260px] rounded-full bg-[#5440e8] sm:-right-16 sm:top-10 sm:h-[340px] sm:w-[340px] lg:-bottom-[170px] lg:-right-10 lg:top-auto lg:h-[480px] lg:w-[480px]" />
          <Image
            src="/images/people/woman-hoodie.webp"
            alt=""
            width={856}
            height={1080}
            priority
            sizes="(min-width: 1280px) 373px, (min-width: 1024px) 341px, (min-width: 640px) 222px, 178px"
            className="absolute -right-2.5 top-[50px] h-[225px] w-auto max-w-none sm:right-4 sm:top-10 sm:h-[280px] lg:bottom-0 lg:right-[30px] lg:top-auto lg:h-[430px] xl:h-[470px]"
          />
          <div className="relative z-10 px-5 pb-[22px] sm:max-w-[600px] sm:px-10 sm:pb-10 lg:max-w-[540px] lg:px-16 lg:pb-16">
            <p className="text-[14px] text-[#9a97b3]">Error 404</p>
            <h1 className="mt-2.5 text-[30px] font-extrabold leading-[34px] tracking-[-0.035em] sm:text-[44px] sm:leading-[48px] lg:text-[52px] lg:leading-[56px] lg:tracking-[-0.04em]">
              This page doesn&apos;t exist. <span className="text-[#c9c0ff]">Your next interview might.</span>
            </h1>
            <p className="mt-4 hidden text-[17px] leading-[27px] text-[#c9c7d8] sm:block">
              The link may be old or mistyped. If you came here to work on your resume, start with a free check.
            </p>
            <div className="mt-4 flex flex-col gap-2 sm:mt-[26px] sm:flex-row sm:gap-2.5">
              <CtaLink cta="check_resume" location="not_found" href="/free-ats-check" className={btnPrimary}>
                Check my resume — free
              </CtaLink>
              <Link href="/" className={btnWhite}>
                Go to the homepage
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-4 pt-10 sm:px-6 lg:px-10 lg:pt-14">
        <h2 className={labelCls}>/ Popular pages</h2>
        <ul className="mt-[18px] grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-5">
          {LINKS.map((l) => (
            <li key={l.href}>
              <Link href={l.href} className="lc-card lc-rise group flex items-center justify-between gap-3 rounded-[24px] px-6 py-[22px] text-[17px] font-extrabold text-[#121226]">
                {l.t}
                <span aria-hidden="true" className="text-[#5440e8] transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none">
                  →
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </SiteShell>
  );
}
