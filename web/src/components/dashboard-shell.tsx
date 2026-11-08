import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShellClient } from "@/components/app/shell/dashboard-shell-client";
import { OfferBanner } from "@/components/offer-banner";
import { offerForBanner } from "@/lib/winback";

/**
 * The signed-in app frame (design v5): white sidebar with the main nav, plan
 * usage and account menu on desktop; a top bar, slide-in menu and bottom tab
 * bar on phones. Sets the v5 type and colors (`lc-site`) for every page inside.
 * `pageTitle` names the main landmark; pages render their own H1.
 *
 * Server component: looks up the account name for the account menu (pages may
 * pass `name` when they already have it) and any running personal discount
 * code (countdown banner), then renders the client frame.
 */
export async function DashboardShell({
  children,
  email,
  name,
  pageTitle,
}: {
  children: React.ReactNode;
  email?: string | null;
  name?: string | null;
  pageTitle?: string;
}) {
  let displayName = name ?? null;
  const session = await getSession();
  if (name === undefined && email && session) {
    const user = await prisma.user.findUnique({ where: { id: session.sub }, select: { name: true } }).catch(() => null);
    displayName = user?.name?.trim() || null;
  }
  // A personal code that's still running (welcome or win-back) shows as a countdown strip.
  const offer = session ? await offerForBanner(session.sub).catch(() => null) : null;
  return (
    <DashboardShellClient email={email} name={displayName} pageTitle={pageTitle}>
      {offer ? (
        <OfferBanner
          where="dashboard"
          offer={{ code: offer.code, percent: offer.percent, endsAt: offer.endsAt.toISOString(), plan: offer.plan ?? "week", kind: offer.kind }}
        />
      ) : null}
      {children}
    </DashboardShellClient>
  );
}
