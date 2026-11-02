/**
 * Public changelog: user-visible changes, written from the git history in plain
 * words. Internal work (refactors, admin tools, analytics, CI) is left out.
 * Newest month first. Counts are historical — don't derive them from live data.
 */
export type ChangelogEntry = { title: string; detail: string; href?: string };
export type ChangelogMonth = { month: string; iso: string; entries: ChangelogEntry[] };

export const CHANGELOG: ChangelogMonth[] = [
  {
    month: "November 2026",
    iso: "2026-11",
    entries: [
      {
        title: "A new look across the site and the app",
        detail: "Every public page, the dashboard, the resume editor, the import review and onboarding moved to one new design.",
      },
      {
        title: "Try the real ATS check on the home page",
        detail: "The home page now runs the actual free check in its first section, with interactive demos of the other tools.",
        href: "/",
      },
      {
        title: "Download your resume as a Word file",
        detail: "Export a .docx with one column, real headings and bullet lists, next to the PDF. Cover letters download as Word too, with your resume's contact header.",
        href: "/features/resume-builder",
      },
      {
        title: "US Letter PDFs",
        detail: "The resume preview and PDF use US Letter size. A4 is still used when your resume is set to the EU region.",
      },
      {
        title: "AI rewrites can't add numbers you didn't give",
        detail: "Bullet rewrites and job description match rewrites only use figures from your resume. Anything else becomes [number] for you to fill in.",
        href: "/editorial-process",
      },
      {
        title: "Clearer consistency check",
        detail: "Each issue is labeled by type — dates, format, claim, number or wording — so you can see what to fix first.",
      },
      {
        title: "Preview a saved version before restoring it",
        detail: "Look at an older version of your resume before you bring it back.",
      },
      {
        title: "Free resume writing tools",
        detail: "A bullet point generator, a summary generator, a resume word counter and a list of action verbs, all usable without an account.",
        href: "/tools",
      },
      {
        title: "New guides",
        detail: "How to write a resume, resume format, resume length, a cover letter template, and a comparison with Jobscan.",
        href: "/how-to-write-a-resume",
      },
      {
        title: "Resume keywords by role and ATS guides",
        detail: "Keyword lists for each role, and guides to how Workday, Greenhouse, iCIMS, Taleo, Lever and SuccessFactors read resumes.",
        href: "/ats",
      },
      {
        title: "88 resume examples, each with a cover letter",
        detail: "Resume examples grew from 16 to 88 roles across healthcare, trades and logistics, retail and hospitality, education, finance, business and tech. Every example now has a matching cover letter, and role pages link to each other.",
        href: "/resume-examples",
      },
      {
        title: "PDF reading fixed",
        detail: "Some PDFs weren't read correctly by the ATS check and resume import. They are now, and a PDF we can't read gets a clear message instead of a bad result.",
        href: "/free-ats-check",
      },
      {
        title: "Easier sign-up and password reset",
        detail: "A check-your-inbox screen after sign-up with a resend button, and a password reset that signs you in when it's done.",
      },
      {
        title: "Faster pages",
        detail: "Pages no longer download a font they don't use, and the example grids load lighter thumbnails.",
      },
    ],
  },
  {
    month: "October 2026",
    iso: "2026-10",
    entries: [
      {
        title: "Free ATS check shows real fixes",
        detail: "The report lists the actual problems found in your resume, and you can keep it by creating an account.",
        href: "/free-ats-check",
      },
      {
        title: "Resume examples and templates",
        detail: "Resume examples for 16 roles, a resume templates page, and a button to start your own resume from any example.",
        href: "/resume-templates",
      },
      {
        title: "Cover letter examples",
        detail: "16 annotated cover letters, each explaining what every paragraph does.",
        href: "/cover-letter-examples",
      },
      {
        title: "Preview matches the PDF",
        detail: "The editor preview now looks the same as the downloaded PDF, and PDFs support non-Latin text.",
      },
      {
        title: "Resume tools that work end to end",
        detail: "Saved versions work, and the consistency check runs when you ask for it.",
      },
      {
        title: "Job tracker, contacts and companies rebuilt",
        detail: "The tracker shows your real applications, contacts and companies were rebuilt, and the company matcher was fixed. Placeholder values and buttons that did nothing were removed.",
      },
      {
        title: "Smoother checkout",
        detail: "The plan you pick carries through sign-up, checkout errors are shown, and double billing is blocked.",
        href: "/pricing",
      },
      {
        title: "Better resume editor on phones",
        detail: "On phones the editor has a back link, a row of tools (preview, job match, cover letter, versions) and a one-line plan banner.",
      },
      {
        title: "Accessibility fixes",
        detail: "Better color contrast, form labels and page landmarks across the site.",
      },
      {
        title: "Clearer emails and error pages",
        detail: "Branded account emails, a clearer message when a verification link has expired, and new 404 and error pages.",
      },
      {
        title: "Your data, in plain terms",
        detail: "Settings lets you export your data as JSON or delete your account. The privacy policy names the analytics tools and processors we actually use, and the terms state refunds and renewals plainly.",
        href: "/legal/privacy",
      },
    ],
  },
];
