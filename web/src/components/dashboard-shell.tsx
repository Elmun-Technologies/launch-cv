import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShellClient } from "@/components/app/shell/dashboard-shell-client";

/**
 * The signed-in app frame (design v5): white sidebar with the main nav, plan
 * usage and account menu on desktop; a top bar, slide-in menu and bottom tab
 * bar on phones. Sets the v5 type and colors (`lc-site`) for every page inside.
 * `pageTitle` names the main landmark; pages render their own H1.
 *
 * Server component: looks up the account name for the account menu (pages may
 * pass `name` when they already have it), then renders the client frame.
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
  if (name === undefined && email) {
    const session = await getSession();
    if (session) {
      const user = await prisma.user.findUnique({ where: { id: session.sub }, select: { name: true } }).catch(() => null);
      displayName = user?.name?.trim() || null;
    }
  }
  return (
    <DashboardShellClient email={email} name={displayName} pageTitle={pageTitle}>
      {children}
    </DashboardShellClient>
  );
}
