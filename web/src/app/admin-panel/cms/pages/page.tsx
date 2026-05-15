import { redirect } from "next/navigation";
import Link from "next/link";
import { Layers, ArrowRight } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-guard";
import { AdminShell } from "@/components/admin-shell";
import { ResourceListPage } from "@/components/admin/resource-list-page";
import { SectionCard } from "@/components/admin/section-card";

/** The set of editable page-copy "keys" registered with the CMS. */
const PAGE_KEYS = [
  { key: "home.hero", label: "Home · hero", description: "Headline, subhead, CTAs on launch-cv.com" },
  { key: "home.cta", label: "Home · final CTA", description: "Bottom CTA banner on home" },
  { key: "pricing.hero", label: "Pricing · hero", description: "Headline and subhead above plan cards" },
  { key: "about.mission", label: "About · mission", description: "The long-form mission statement" },
  { key: "footer.tagline", label: "Footer · tagline", description: "Brand description in the footer" },
];

export default async function AdminPagesIndex() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin-panel/access-denied");

  const rows = await prisma.pageCopy.findMany({
    select: { key: true, updatedAt: true },
  });
  const byKey = new Map(rows.map((r) => [r.key, r]));

  const dateFmt = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <AdminShell email={admin.email} pageTitle="Page copy">
      <ResourceListPage
        title="Page copy"
        description="Edit marketing-page text without touching code. Each key maps to a section on the public site."
      >
        <SectionCard flush>
          <ul className="divide-y divide-[#E2E8F0]">
            {PAGE_KEYS.map((p) => {
              const row = byKey.get(p.key);
              return (
                <li key={p.key}>
                  <Link
                    href={`/admin-panel/cms/pages/${encodeURIComponent(p.key)}`}
                    className="group flex items-center justify-between gap-4 px-5 py-4 transition hover:bg-[#FAFBFC]"
                  >
                    <div className="flex items-start gap-3">
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#EFF6FF] text-[#1A56DB]">
                        <Layers className="h-4 w-4" />
                      </span>
                      <div>
                        <p className="text-[14px] font-semibold text-[#0F172A]">{p.label}</p>
                        <p className="font-mono text-[11px] text-[#94A3B8]">{p.key}</p>
                        <p className="mt-1 text-[12px] text-[#64748B]">{p.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 text-[12px] text-[#94A3B8]">
                      {row ? (
                        <span>Updated {dateFmt.format(row.updatedAt)}</span>
                      ) : (
                        <span className="rounded bg-[#FEF3C7] px-2 py-0.5 text-[11px] font-semibold text-amber-700">
                          Using code defaults
                        </span>
                      )}
                      <ArrowRight className="h-4 w-4 text-[#CBD5E1] transition group-hover:text-[#1A56DB]" />
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        </SectionCard>
      </ResourceListPage>
    </AdminShell>
  );
}
