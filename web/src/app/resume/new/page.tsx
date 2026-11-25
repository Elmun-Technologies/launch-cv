import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { RESUME_EXAMPLES } from "@/lib/resume-examples";
import { verticalForRole } from "@/lib/target-role";
import { NewResumeClient } from "./new-resume-client";

/** Roles offered as one-tap starting points, in this order (only ones that exist are shown). */
const QUICK_ROLES = [
  "software-engineer",
  "product-manager",
  "registered-nurse",
  "data-analyst",
  "teacher",
  "marketing-manager",
  "accountant",
  "sales-representative",
  "project-manager",
  "ux-designer",
];

export default async function NewResumePage() {
  const session = await getSession();
  if (!session) redirect("/login?next=/resume/new");

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { targetRole: true },
  });

  // No forced "which role?" step before the first resume: replays showed new users leaving on it.
  // This page already offers role examples; /onboarding stays reachable for anyone who opens it.

  // Only slugs, role names, verticals and sample labels reach the client, not the full example texts.
  const examples = RESUME_EXAMPLES.map((e) => ({
    slug: e.slug,
    role: e.role,
    vertical: verticalForRole(e.slug, e.group),
    ...(e.variants?.length ? { variants: e.variants.map((v) => ({ id: v.id, label: v.label })) } : {}),
  }));
  const target = examples.find((e) => e.slug === user?.targetRole) ?? null;

  // The user's role first, then roles the example lists as related, then the defaults.
  const related = target ? (RESUME_EXAMPLES.find((e) => e.slug === target.slug)?.related ?? []) : [];
  const order = [...(target ? [target.slug] : []), ...related, ...QUICK_ROLES];
  const quick = [...new Set(order)]
    .map((s) => examples.find((e) => e.slug === s))
    .filter((e): e is (typeof examples)[number] => !!e)
    .slice(0, QUICK_ROLES.length);

  return <NewResumeClient examples={examples} quick={quick} target={target} defaultVertical={target?.vertical ?? "software"} />;
}
