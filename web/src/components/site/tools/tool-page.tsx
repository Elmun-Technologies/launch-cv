import Link from "next/link";
import type { ReactNode } from "react";
import { Breadcrumbs, container, labelCls } from "@/components/site/ui";
import { FaqList } from "@/components/marketing/feature-page";
import { CtaLink } from "@/components/cta-link";
import { freeTools, TOOLS_INDEX_PATH, type FreeToolKey } from "@/lib/seo/free-tools";
import type { FaqItem } from "@/lib/faq-ld";

/** Server-rendered building blocks shared by the free tool pages (v5 look). */

export const toolSectionPad = "pt-[72px] lg:pt-[130px]";
const ctaBtn = "lc-btn-lift motion-reduce:hover:transform-none inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-[26px] py-[15px] text-[16px] font-semibold";

/** Centered hero: breadcrumb, the page's one H1, and a lead line. */
export function ToolHero({
  crumb,
  title,
  muted,
  lead,
  mobileLead,
  mobileLeft = false,
}: {
  crumb: string;
  title: string;
  muted: string;
  lead: ReactNode;
  /** Shorter lead below `sm`, so the tool starts higher on a phone. */
  mobileLead?: ReactNode;
  /** Left-align the hero below `sm` (the mobile tool canvases). */
  mobileLeft?: boolean;
}) {
  const align = mobileLeft ? "text-left sm:text-center" : "text-center";
  return (
    <section className={`${container} pt-4 lg:pt-8`}>
      <div className={`mx-auto max-w-[1040px] ${align}`}>
        <div className={`flex ${mobileLeft ? "justify-start sm:justify-center sm:[&_ol]:justify-center" : "justify-center [&_ol]:justify-center"}`}>
          <Breadcrumbs items={[{ href: TOOLS_INDEX_PATH, label: "Free tools" }, { label: crumb }]} />
        </div>
        <h1 className="mt-4 text-[36px] font-extrabold leading-[1.06] tracking-[-0.045em] sm:text-[52px] lg:mt-[22px] lg:text-[64px] lg:leading-[66px]">
          {title} <span className="text-[#7c7a94]">{muted}</span>
        </h1>
        <p className="mx-auto mt-3.5 max-w-[640px] text-[16px] leading-[25px] text-[#4a4862] lg:mt-[18px] lg:text-[18px] lg:leading-7">
          {mobileLead ? (
            <>
              <span className="sm:hidden">{mobileLead}</span>
              <span className="hidden sm:inline">{lead}</span>
            </>
          ) : (
            lead
          )}
        </p>
      </div>
    </section>
  );
}

/** The interactive widget slot, right under the hero. */
export function ToolStage({ children }: { children: ReactNode }) {
  return <section className={`${container} pt-7 lg:pt-10`}>{children}</section>;
}

/** "/ How it works" — numbered cards. */
export function NumberedCards({ label, title, muted, items }: { label: string; title: string; muted?: string; items: { t: string; d: string }[] }) {
  return (
    <section className={`${container} ${toolSectionPad}`}>
      <div className="lc-reveal max-w-[980px]">
        <p className={labelCls}>/ {label}</p>
        <h2 className="lc-h2 mt-5">
          {title} {muted ? <span>{muted}</span> : null}
        </h2>
      </div>
      <ol className={`mt-6 grid gap-2.5 lg:mt-9 lg:gap-3 ${items.length === 4 ? "sm:grid-cols-2 lg:grid-cols-4" : "md:grid-cols-3"}`}>
        {items.map((it, i) => (
          <li key={it.t} className="lc-card lc-reveal rounded-3xl p-[22px] lg:p-[26px]">
            <p aria-hidden="true" className="text-[38px] font-extrabold leading-none tracking-[-0.04em] text-[#5440e8] lg:text-[46px]">
              {i + 1}
            </p>
            <h3 className="mt-3.5 text-[19px] font-extrabold lg:text-[21px]">{it.t}</h3>
            <p className="mt-2 text-[15px] leading-[23px] text-[#4a4862]">{it.d}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

/** "/ More free tools" — every other free tool. */
export function MoreTools({ current }: { current: FreeToolKey }) {
  const tools = freeTools().filter((t) => t.key !== current);
  return (
    <section className={`${container} ${toolSectionPad}`} aria-labelledby="more-tools">
      <h2 id="more-tools" className={labelCls}>
        / More free tools
      </h2>
      <ul className="mt-[18px] grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-3">
        {tools.map((t) => (
          <li key={t.key}>
            <Link href={t.href} className="lc-card lc-rise motion-reduce:hover:transform-none group block h-full rounded-3xl p-[22px] lg:p-6">
              <span className="block text-[18px] font-extrabold transition-colors group-hover:text-[#5440e8] lg:text-[19px]">{t.name}</span>
              <span className="mt-1.5 block text-[14px] text-[#4a4862]">{t.blurb}</span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

/** FAQ block; pass the same items to the page's FAQPage JSON-LD. */
export function ToolFaq({ title, muted, faqs }: { title: string; muted?: string; faqs: FaqItem[] }) {
  return (
    <section className={`${container} ${toolSectionPad} grid items-start gap-5 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16`}>
      <div className="lc-reveal">
        <p className={labelCls}>/ Questions</p>
        <h2 className="lc-h2 mt-5">
          {title} {muted ? <span>{muted}</span> : null}
        </h2>
        <p className="mt-5 text-[16px] leading-[25px] text-[#4a4862]">
          Something else?{" "}
          <a href="mailto:support@launch-cv.com" className="lc-link font-semibold text-[#5440e8]">
            support@launch-cv.com
          </a>
        </p>
      </div>
      <FaqList items={faqs} />
    </section>
  );
}

const NEXT_STEPS = [
  { href: "/free-ats-check", t: "Check your resume against ATS", d: "Free score and fixes, no account." },
  { href: "/resume-examples", t: "Resume examples", d: "See full resumes for your role." },
  { href: "/resume-templates", t: "Resume templates", d: "ATS-friendly layouts, ready to fill in." },
  { href: "/pricing", t: "Plans and pricing", d: "AI rewrites inside your resume, job matching and more." },
];

/** Dark closing block: sign-up CTA plus the key internal links. */
export function ToolNextSteps({ location, title, lead }: { location: string; title: string; lead: string }) {
  return (
    <section className={`${container} ${toolSectionPad}`}>
      <div className="lc-reveal rounded-[28px] bg-[#111118] px-5 pb-5 pt-8 text-white sm:px-10 lg:rounded-[36px] lg:px-16 lg:py-[64px]">
        <div className="grid gap-7 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <h2 className="text-[30px] font-extrabold leading-[34px] tracking-[-0.035em] lg:text-[46px] lg:leading-[50px]">{title}</h2>
            <p className="mt-3 text-[15px] leading-[23px] text-[#c9c7d8] lg:text-[18px] lg:leading-7">{lead}</p>
            <CtaLink cta="create_resume" location={location} href="/register" className={`${ctaBtn} mt-6 w-full bg-[#5440e8] text-white hover:bg-[#4430d6] sm:w-auto lg:mt-8`}>
              Create my resume — free
            </CtaLink>
          </div>
          <ul className="grid sm:grid-cols-2 sm:gap-x-8">
            {NEXT_STEPS.map((s) => (
              <li key={s.href} className="border-t border-[#2f2d48]">
                <Link href={s.href} className="group block py-[14px] lg:py-[18px]">
                  <span className="block text-[16px] font-bold transition-colors group-hover:text-[#c9c0ff] lg:text-[17px]">{s.t} →</span>
                  <span className="mt-0.5 block text-[13px] text-[#b3b0c8] lg:text-[14px]">{s.d}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
