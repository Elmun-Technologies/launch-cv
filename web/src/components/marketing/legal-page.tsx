import Link from "next/link";
import { JsonLd } from "@/components/json-ld";
import { SiteShell } from "@/components/site/site-shell";
import { labelCls } from "@/components/site/ui";
import { ContentToc, ContentTocMobile } from "@/components/site/content/content-toc";
import { absoluteUrl } from "@/lib/site";

export type LegalSection = { h: string; body: React.ReactNode };

const DOCS = [
  { href: "/legal/privacy", label: "Privacy" },
  { href: "/legal/terms", label: "Terms" },
];

/** Shared layout for the privacy policy and terms: numbered sections with an in-page index. */
export function LegalPage({
  title,
  intro,
  updated,
  pathname,
  sections,
}: {
  title: string;
  intro: React.ReactNode;
  updated: string;
  pathname: string;
  sections: LegalSection[];
}) {
  const id = (h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  const toc = sections.map((s) => ({ id: id(s.h), text: s.h }));
  return (
    <SiteShell>
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: `${title} | LaunchCV`, url: absoluteUrl(pathname) }} />

      <header className="mx-auto max-w-[1280px] px-4 pt-4 sm:px-6 lg:px-10 lg:pt-10">
        <p className={labelCls}>/ Legal</p>
        <h1 className="mt-3.5 text-[40px] font-extrabold leading-[42px] tracking-[-0.045em] sm:mt-5 sm:text-[56px] sm:leading-[60px] lg:text-[64px] lg:leading-[66px]">
          {title}
        </h1>
        <p className="mt-2.5 text-[13px] text-[#66647c] sm:hidden">Last updated: {updated}</p>
        <div className="mt-[22px] hidden flex-wrap gap-2.5 sm:flex">
          <span className="rounded-full bg-white px-3.5 py-2 text-[13px] font-bold text-[#121226]">Last updated: {updated}</span>
        </div>
        <div className="mt-4 max-w-[680px] text-[17px] leading-7 text-[#4a4862] sm:mt-5 sm:text-[18px]">{intro}</div>
        <nav aria-label="Legal documents" className="mt-5 flex gap-1.5 sm:mt-[22px]">
          {DOCS.map((d) => {
            const on = d.href === pathname;
            return (
              <Link
                key={d.href}
                href={d.href}
                aria-current={on ? "page" : undefined}
                className={`lc-btn-lift inline-flex min-h-[44px] items-center rounded-full px-[18px] text-[14px] font-semibold ${
                  on ? "bg-[#111118] text-white" : "bg-white text-[#121226] hover:bg-[#e4dfff]"
                }`}
              >
                {d.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <div className="mx-auto grid max-w-[1280px] items-start gap-[18px] px-4 pt-[18px] sm:px-6 sm:pt-10 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-16 lg:px-10 lg:pt-12">
        <div className="hidden lg:sticky lg:top-6 lg:block">
          <ContentToc entries={toc} numbered />
        </div>
        <div className="lg:hidden">
          <ContentTocMobile entries={toc} numbered />
        </div>

        <article className="max-w-[820px] text-[16px] leading-[26px] text-[#24223a] [overflow-wrap:anywhere] sm:rounded-[24px] sm:bg-white sm:p-10 sm:text-[17px] sm:leading-[29px] sm:shadow-[0_1px_2px_rgba(18,18,38,0.04),0_10px_30px_-18px_rgba(18,18,38,0.22)] lg:px-14 lg:py-12 [&_a]:font-semibold [&_a]:text-[#5440e8] [&_a:hover]:text-[#4430d6]">
          {sections.map((s, i) => (
            <section key={s.h} id={id(s.h)} aria-labelledby={`${id(s.h)}-h`} className="mt-7 scroll-mt-6 first:mt-0 sm:mt-11">
              <h2 id={`${id(s.h)}-h`} className="text-[22px] font-extrabold leading-[28px] tracking-[-0.02em] text-[#121226] sm:text-[28px] sm:leading-[34px]">
                <span className="tabular-nums">{i + 1}.</span> {s.h}
              </h2>
              <div className="mt-2.5 sm:mt-3.5">{s.body}</div>
            </section>
          ))}
          <p className="mt-11 border-t border-[#e2e0ea] pt-6 text-[15px] text-[#4a4862]">
            Questions about this page? Email{" "}
            <a href="mailto:support@launch-cv.com" className="lc-link">
              support@launch-cv.com
            </a>
            .
          </p>
        </article>
      </div>
    </SiteShell>
  );
}
