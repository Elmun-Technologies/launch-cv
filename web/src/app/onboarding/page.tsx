import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { safeNextPath } from "@/lib/safe-next";
import { RESUME_EXAMPLES } from "@/lib/resume-examples";
import { isExperienceLevel } from "@/lib/target-role";
import { OnboardingClient } from "./onboarding-client";

export const metadata: Metadata = {
  title: "Your target role",
  robots: { index: false, follow: false },
};

/** Roles offered as chips under the search, in this order (canvas State-Onboarding). */
const CHIP_ROLES = ["product-manager", "software-engineer", "registered-nurse", "data-analyst", "teacher", "marketing-manager", "accountant"];

type Props = { searchParams: Promise<{ next?: string }> };

/** Step 2 of 3 after sign-up: the role and level the user is aiming for. */
export default async function OnboardingPage({ searchParams }: Props) {
  const { next: rawNext } = await searchParams;
  const next = safeNextPath(rawNext) ?? "/resume/new";

  const session = await getSession();
  if (!session) redirect(`/login?next=${encodeURIComponent(`/onboarding?next=${next}`)}`);

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { targetRole: true, experienceLevel: true },
  });
  if (!user) redirect("/login");

  // Only slugs, names and groups reach the client, not the example texts.
  const roles = RESUME_EXAMPLES.map((e) => ({ slug: e.slug, role: e.role }));
  const chips = CHIP_ROLES.filter((s) => roles.some((r) => r.slug === s));

  return (
    <OnboardingClient
      roles={roles}
      chips={chips}
      next={next}
      initialRole={roles.some((r) => r.slug === user.targetRole) ? user.targetRole : null}
      initialLevel={isExperienceLevel(user.experienceLevel) ? user.experienceLevel : null}
    />
  );
}
