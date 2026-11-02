import { DocPage, type DocSection } from "@/components/marketing/doc-page";
import { absoluteUrl } from "@/lib/site";

export type LegalSection = DocSection;

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
  return (
    <DocPage
      label="/ Legal"
      title={title}
      intro={intro}
      updated={updated}
      nav={{ label: "Legal documents", links: DOCS, current: pathname }}
      sections={sections}
      ld={{ "@context": "https://schema.org", "@type": "WebPage", name: `${title} | LaunchCV`, url: absoluteUrl(pathname) }}
    />
  );
}
