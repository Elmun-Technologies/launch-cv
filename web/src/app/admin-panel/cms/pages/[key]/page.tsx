import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { PageCopyEditor } from "@/components/admin/page-copy-editor";
import { CmsPageHeader } from "@/components/admin/cms-ui";
import { PageCopySectionNav } from "@/components/admin/page-copy-sections";

const PAGE_KEYS: Record<string, { label: string; description: string; defaults: object }> = {
  "home.hero": {
    label: "Home · hero",
    description: "Headline, subhead, and CTAs at the top of launch-cv.com.",
    defaults: {
      eyebrow: "AI job-search platform · all six tools in one plan",
      headline: "The AI job search platform that lands more interviews.",
      subhead:
        "Paste a job description and LaunchCV rewrites your resume to match it, scores your ATS readiness, drafts the cover letter, and drills you on likely interview questions — all from one workspace.",
      primaryCta: { label: "Get started", href: "/register" },
      secondaryCta: { label: "View pricing", href: "/pricing" },
    },
  },
  "home.cta": {
    label: "Home · final CTA",
    description: "The bottom-of-page banner with the get-started call.",
    defaults: {
      headline: "Start your next job search the right way",
      subhead:
        "Create an account, choose a plan, and paste your first job description. The first interview reply often lands within days.",
      primaryCta: { label: "Get started", href: "/register" },
    },
  },
  "pricing.hero": {
    label: "Pricing · hero",
    description: "Above-the-cards copy on the pricing page.",
    defaults: {
      eyebrow: "Pricing",
      headline: "Pay monthly, yearly, or once — for life",
      subhead:
        "Three subscription tiers plus a Lifetime option for people who'd rather not think about renewals. No freemium games. No data harvesting. No surprise upgrades.",
    },
  },
  "about.mission": {
    label: "About · mission",
    description: "Long-form mission statement on the About page.",
    defaults: {
      headline: "Level the field between candidates and machines",
      paragraphs: [
        "The hiring process has a problem nobody talks about: qualified people get filtered out by software before any human ever reads their work.",
        "LaunchCV exists to close that gap. We combine AI resume building, JD alignment, ATS scoring, cover letter generation, and interview prep into one professional platform.",
        "Our goal is simple: give every job seeker the same advantage that candidates with $200/hour recruiters have — delivered by AI, in minutes.",
      ],
    },
  },
  "footer.tagline": {
    label: "Footer · tagline",
    description: "Brand description shown in the site footer.",
    defaults: {
      tagline:
        "AI-powered resume and job search platform. Built to help you get interviews — not just build a resume.",
    },
  },
};

export default async function EditPageCopy({ params }: { params: Promise<{ key: string }> }) {
  const admin = await requireAdmin("content");
  if (!admin) redirect("/admin-panel/access-denied");

  const { key } = await params;
  const decodedKey = decodeURIComponent(key);
  const config = PAGE_KEYS[decodedKey];
  if (!config) notFound();

  const [row, allRows] = await Promise.all([
    prisma.pageCopy.findUnique({ where: { key: decodedKey } }),
    prisma.pageCopy.findMany({ select: { key: true, updatedAt: true } }),
  ]);
  const dataToEdit = row?.data ?? config.defaults;
  const initialJson = JSON.stringify(dataToEdit, null, 2);
  const updated = new Map(allRows.map((r) => [r.key, r.updatedAt]));

  return (
    <AdminShell email={admin.email} pageTitle="Edit page copy">
      {/* Desktop: master list + editor side by side. Phones: the editor alone, with a back link. */}
      <CmsPageHeader
        title="Page copy"
        description="Edit marketing-page text without touching code. Each key maps to a section on the public site."
      />
      <div className="mt-[18px] grid grid-cols-1 items-start gap-[18px] lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="hidden lg:block">
          <PageCopySectionNav activeKey={decodedKey} updated={updated} />
        </div>
        <PageCopyEditor
          pageKey={decodedKey}
          label={config.label}
          description={config.description}
          initialJson={initialJson}
        />
      </div>
    </AdminShell>
  );
}
