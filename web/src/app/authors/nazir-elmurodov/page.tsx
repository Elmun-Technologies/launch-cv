import Link from "next/link";
import { COMPANY_DOCS, DocPage, docListCls, type DocSection } from "@/components/marketing/doc-page";
import { initials } from "@/components/site/content/blog-cards";
import { buildMarketingMetadata, DEFAULT_OG_IMAGE } from "@/lib/build-metadata";
import { contentUpdated, contentUpdatedLabel } from "@/lib/content-dates";
import { absoluteUrl, orgRef, WEBSITE_ID } from "@/lib/site";
import { SITE_AUTHOR, SITE_AUTHOR_ID } from "@/lib/author";
import { getPublishedPosts } from "@/lib/cms/blog";
import { RESUME_EXAMPLES } from "@/lib/resume-examples";
import { COVER_LETTER_EXAMPLES } from "@/lib/cover-letter-examples";
import { ATS_VENDORS } from "@/lib/seo/ats-vendors";

const PATH = SITE_AUTHOR.path;
const DESCRIPTION = `${SITE_AUTHOR.name}, ${SITE_AUTHOR.role}. The LaunchCV guides, resume examples and blog posts he is credited on.`;

export const metadata = buildMarketingMetadata({
  title: `${SITE_AUTHOR.name} — Author at LaunchCV`,
  description: DESCRIPTION,
  pathname: PATH,
  image: DEFAULT_OG_IMAGE,
  keywords: [SITE_AUTHOR.name, "LaunchCV founder", "LaunchCV author"],
});

/** New blog posts come from the CMS; refresh like the blog index. */
export const revalidate = 300;

/** Pages whose byline or Article JSON-LD credits SITE_AUTHOR. */
const GUIDES = [
  { href: "/how-to-write-a-resume", label: "How to write a resume" },
  { href: "/resume-format", label: "Resume format guide" },
  { href: "/resume-length", label: "Resume length guide" },
  { href: "/cover-letter-template", label: "Cover letter template" },
  { href: "/compare/ats-resume-checkers", label: "ATS resume checkers compared" },
  { href: "/alternatives/jobscan", label: "Jobscan alternative" },
  ...ATS_VENDORS.map((v) => ({ href: `/ats/${v.slug}`, label: `${v.name} resume guide` })),
];

export default async function AuthorPage() {
  const posts = await getPublishedPosts();

  const sections: DocSection[] = [
    {
      h: "Role",
      body: (
        <p>
          {SITE_AUTHOR.name} is the founder of LaunchCV, which is made by Elmun Technologies LLC. Why he started it is on
          our <Link href="/about">About page</Link>.
        </p>
      ),
    },
    {
      h: "Guides",
      body: (
        <ul className={docListCls}>
          {GUIDES.map((g) => (
            <li key={g.href}>
              <Link href={g.href}>{g.label}</Link>
            </li>
          ))}
        </ul>
      ),
    },
    {
      h: "Examples by role",
      body: (
        <ul className={docListCls}>
          <li>
            <Link href="/resume-examples">Resume examples</Link> — {RESUME_EXAMPLES.length} roles, each with a full sample
            resume, tips and an FAQ.
          </li>
          <li>
            <Link href="/cover-letter-examples">Cover letter examples</Link> — {COVER_LETTER_EXAMPLES.length} letters, each
            written by the same fictional person as the matching resume.
          </li>
          <li>
            <Link href="/resume-keywords">Resume keywords by role</Link> — a keyword list for each of the{" "}
            {RESUME_EXAMPLES.length} roles.
          </li>
        </ul>
      ),
    },
    {
      h: "Blog posts",
      body:
        posts.length > 0 ? (
          <ul className={docListCls}>
            {posts.map((p) => (
              <li key={p.slug}>
                <Link href={`/blog/${p.slug}`}>{p.title}</Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>
            Every post on the <Link href="/blog">LaunchCV blog</Link> is written by {SITE_AUTHOR.name}.
          </p>
        ),
    },
    {
      h: "How these pages are checked",
      body: (
        <p>
          Example people and employers are fictional, credentials are written the way the issuing body writes them, and we
          don&apos;t publish salary figures or statistics we can&apos;t source. The full rules are on our{" "}
          <Link href="/editorial-process">editorial process</Link> page. To report a mistake, email{" "}
          <a href="mailto:support@launch-cv.com">support@launch-cv.com</a>.
        </p>
      ),
    },
  ];

  const ld = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfilePage",
        "@id": `${SITE_AUTHOR.url}#page`,
        url: SITE_AUTHOR.url,
        name: `${SITE_AUTHOR.name} | LaunchCV`,
        description: DESCRIPTION,
        inLanguage: "en-US",
        dateModified: contentUpdated(PATH).toISOString().slice(0, 10),
        isPartOf: { "@id": WEBSITE_ID },
        mainEntity: { "@id": SITE_AUTHOR_ID },
      },
      {
        "@type": "Person",
        "@id": SITE_AUTHOR_ID,
        name: SITE_AUTHOR.name,
        url: SITE_AUTHOR.url,
        image: SITE_AUTHOR.avatar,
        jobTitle: SITE_AUTHOR.role,
        description: SITE_AUTHOR.bio,
        worksFor: orgRef,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "About", item: absoluteUrl("/about") },
          { "@type": "ListItem", position: 3, name: SITE_AUTHOR.name, item: SITE_AUTHOR.url },
        ],
      },
    ],
  };

  return (
    <DocPage
      label="/ Author"
      title={SITE_AUTHOR.name}
      updatedPrefix="Updated"
      updated={contentUpdatedLabel(PATH)}
      intro={SITE_AUTHOR.bio}
      hero={
        <div className="mt-5 flex w-fit items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 text-[#121226]">
          <span aria-hidden="true" className="inline-flex h-11 w-11 flex-none items-center justify-center rounded-full bg-[#5440e8] text-[16px] font-extrabold text-white">
            {initials(SITE_AUTHOR.name)}
          </span>
          <span>
            <span className="block text-[15px] font-bold">{SITE_AUTHOR.name}</span>
            <span className="block text-[13px] text-[#66647c]">{SITE_AUTHOR.role}</span>
          </span>
        </div>
      }
      nav={{ label: "Company pages", links: COMPANY_DOCS, current: PATH }}
      sections={sections}
      numbered={false}
      ld={ld}
    />
  );
}
