import { LandingNav } from "@/components/landing-nav";
import { LandingFooter } from "@/components/landing-footer";
import { JsonLd } from "@/components/json-ld";
import { absoluteUrl } from "@/lib/site";

export type LegalSection = { h: string; body: React.ReactNode };

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
  return (
    <div className="flex min-h-screen flex-col bg-white text-[#111111]">
      <JsonLd data={{ "@context": "https://schema.org", "@type": "WebPage", name: `${title} | LaunchCV`, url: absoluteUrl(pathname) }} />
      <LandingNav />
      <main className="mx-auto w-full max-w-[1080px] px-4 pb-24 pt-[112px] sm:px-6">
        <p className="text-[13px] text-[#6B6B6B]">Legal · Updated {updated}</p>
        <h1 className="mt-3 text-[36px] font-semibold leading-[1.1] tracking-[-0.02em] sm:text-[44px]">{title}</h1>
        <div className="mt-4 max-w-[640px] text-[17px] leading-relaxed text-[#3F3F3F]">{intro}</div>

        <div className="mt-12 grid gap-10 border-t border-[#EEEEEB] pt-10 lg:grid-cols-[220px_1fr]">
          <nav aria-label="On this page" className="hidden lg:block">
            <ol className="sticky top-[96px] space-y-2 text-[14px]">
              {sections.map((s, i) => (
                <li key={s.h}>
                  <a href={`#${id(s.h)}`} className="text-[#6B6B6B] hover:text-[#111111]">
                    <span className="mr-2 tabular-nums text-[#8A8A86]">{i + 1}.</span>
                    {s.h}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
          <div className="max-w-[680px] space-y-10">
            {sections.map((s, i) => (
              <section key={s.h} id={id(s.h)} className="scroll-mt-[96px]">
                <h2 className="text-[20px] font-semibold tracking-[-0.01em]">
                  <span className="mr-2 tabular-nums text-[#8A8A86]">{i + 1}.</span>
                  {s.h}
                </h2>
                <div className="mt-3 text-[16px] leading-[1.7] text-[#3F3F3F]">{s.body}</div>
              </section>
            ))}
            <p className="rounded-[14px] border border-[#E5E5E2] bg-[#FAFAF9] p-5 text-[15px] text-[#3F3F3F]">
              Questions about this page? Email{" "}
              <a href="mailto:support@launch-cv.com" className="font-medium text-[#1D4ED8] hover:underline">
                support@launch-cv.com
              </a>
              .
            </p>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
