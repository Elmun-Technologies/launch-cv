import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { PageCopyEditor } from "@/components/admin/page-copy-editor";

const PAGE_KEYS: Record<string, { label: string; description: string; defaults: object }> = {
  "home.hero": {
    label: "Home · hero",
    description: "Headline, subhead, and CTAs at the top of launch-cv.com.",
    defaults: {
      eyebrow: "AI job-search platform · all six tools in one plan",
      headline: "The AI job search platform that lands more interviews.",
      subhead:
        "Paste a job description and Launch CV rewrites your resume to match it, scores your ATS readiness, drafts the cover letter, and drills you on likely interview questions — all from one workspace.",
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
        "Launch CV exists to close that gap. We combine AI resume building, JD alignment, ATS scoring, cover letter generation, and interview prep into one professional platform.",
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
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const { key } = await params;
  const decodedKey = decodeURIComponent(key);
  const config = PAGE_KEYS[decodedKey];
  if (!config) notFound();

  const row = await prisma.pageCopy.findUnique({ where: { key: decodedKey } });
  const dataToEdit = row?.data ?? config.defaults;
  const initialJson = JSON.stringify(dataToEdit, null, 2);

  return (
    <AdminShell email={admin.email} pageTitle="Edit page copy">
      <PageCopyEditor
        pageKey={decodedKey}
        label={config.label}
        description={config.description}
        initialJson={initialJson}
      />
    </AdminShell>
  );
}
