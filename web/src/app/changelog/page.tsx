import Link from "next/link";
import { COMPANY_DOCS, DocPage, type DocSection } from "@/components/marketing/doc-page";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { contentUpdated, contentUpdatedLabel } from "@/lib/content-dates";
import { absoluteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { CHANGELOG } from "@/lib/changelog";

const PATH = "/changelog";
const DESCRIPTION = "What's new in LaunchCV: the improvements we've shipped to the ATS check, resume builder, examples and free tools, month by month.";

export const metadata = buildMarketingMetadata({
  title: "Changelog — What's New in LaunchCV",
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  keywords: ["LaunchCV changelog", "LaunchCV updates", "what's new LaunchCV"],
});

const sections: DocSection[] = [
  ...CHANGELOG.map((m) => ({
    h: m.month,
    body: (
      <ul className="flex flex-col gap-4 sm:gap-5">
        {m.entries.map((e) => (
          <li key={e.title} className="border-l-2 border-[#c9c0ff] pl-4">
            <h3 className="text-[17px] font-extrabold leading-6 text-[#121226] sm:text-[18px]">{e.title}</h3>
            <p className="mt-1 text-[#4a4862]">
              {e.detail}
              {e.href ? (
                <>
                  {" "}
                  <Link href={e.href} className="lc-link whitespace-nowrap">
                    See it<span className="sr-only">: {e.title}</span>{" "}
                    <span aria-hidden="true">→</span>
                  </Link>
                </>
              ) : null}
            </p>
          </li>
        ))}
      </ul>
    ),
  })),
  {
    h: "Ideas and bug reports",
    body: (
      <p>
        Something not working, or a tool you wish we had? Email{" "}
        <a href="mailto:support@launch-cv.com">support@launch-cv.com</a>. A person reads every email. New changes appear on
        this page as they ship.
      </p>
    ),
  },
];

const ld = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Changelog | LaunchCV",
  url: absoluteUrl(PATH),
  description: DESCRIPTION,
  inLanguage: "en-US",
  dateModified: contentUpdated(PATH).toISOString().slice(0, 10),
  isPartOf: { "@id": WEBSITE_ID },
  publisher: orgRef,
};

export default function ChangelogPage() {
  return (
    <DocPage
      label="/ Company"
      title="Changelog"
      updatedPrefix="Updated"
      updated={contentUpdatedLabel(PATH)}
      intro="The improvements we've shipped, newest first. Small fixes and behind-the-scenes work are left out."
      nav={{ label: "Company pages", links: COMPANY_DOCS, current: PATH }}
      sections={sections}
      numbered={false}
      ld={ld}
    />
  );
}
