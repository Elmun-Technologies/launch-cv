import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { ContactsClient, type ContactRow } from "./contacts-client";

export default async function ContactsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [rows, resumes] = await Promise.all([
    prisma.contact.findMany({
      where: { userId: session.sub },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.resume.findMany({
      where: { userId: session.sub },
      orderBy: { updatedAt: "desc" },
      select: { id: true, title: true },
    }),
  ]);

  const initial: ContactRow[] = rows.map((c) => ({
    id: c.id, name: c.name, email: c.email, phone: c.phone, company: c.company,
    role: c.role, relationship: c.relationship, goal: c.goal, status: c.status,
    linkedinUrl: c.linkedinUrl, createdAt: c.createdAt.toISOString(),
    lastContactAt: c.lastContactAt ? c.lastContactAt.toISOString() : null,
    followUpAt: c.followUpAt ? c.followUpAt.toISOString() : null,
  }));

  return (
    <DashboardShell pageTitle="Contacts" email={session.email}>
      <ContactsClient initial={initial} resumes={resumes} />
    </DashboardShell>
  );
}
