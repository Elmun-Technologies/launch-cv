import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { DashboardShell } from "@/components/dashboard-shell";
import { ExtensionsClient, type TemplateRow } from "./extensions-client";

export default async function ExtensionsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  const [templates, resumes] = await Promise.all([
    prisma.emailTemplate.findMany({ where: { userId: session.sub }, orderBy: { updatedAt: "desc" } }),
    prisma.resume.findMany({ where: { userId: session.sub }, orderBy: { updatedAt: "desc" }, select: { id: true, title: true } }),
  ]);

  const initial: TemplateRow[] = templates.map((t) => ({
    id: t.id, name: t.name, subject: t.subject, body: t.body, category: t.category,
    createdAt: t.createdAt.toISOString(), updatedAt: t.updatedAt.toISOString(),
  }));

  return (
    <DashboardShell pageTitle="Extensions" email={session.email}>
      <ExtensionsClient initial={initial} resumes={resumes} />
    </DashboardShell>
  );
}
