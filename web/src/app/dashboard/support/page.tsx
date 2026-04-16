import { redirect } from "next/navigation";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { SupportClient } from "./support-client";

export default async function SupportPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <DashboardShell email={session.email} pageTitle="Support Center">
      <SupportClient />
    </DashboardShell>
  );
}
