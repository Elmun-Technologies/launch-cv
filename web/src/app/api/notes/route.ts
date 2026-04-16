import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const querySchema = z.object({
  contactId: z.string().min(1).max(128).optional(),
  companyId: z.string().min(1).max(128).optional(),
  applicationId: z.string().min(1).max(128).optional(),
});

const postSchema = z.object({
  content: z.string().min(1).max(50000),
  contactId: z.string().min(1).max(128).optional().nullable(),
  companyId: z.string().min(1).max(128).optional().nullable(),
  applicationId: z.string().min(1).max(128).optional().nullable(),
});

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    contactId: url.searchParams.get("contactId") ?? undefined,
    companyId: url.searchParams.get("companyId") ?? undefined,
    applicationId: url.searchParams.get("applicationId") ?? undefined,
  });
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().formErrors[0] ?? parsed.error.issues[0]?.message ?? "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const where: {
    userId: string;
    contactId?: string;
    companyId?: string;
    applicationId?: string;
  } = { userId: session.sub };
  if (parsed.data.contactId) where.contactId = parsed.data.contactId;
  if (parsed.data.companyId) where.companyId = parsed.data.companyId;
  if (parsed.data.applicationId) where.applicationId = parsed.data.applicationId;

  try {
    const notes = await prisma.note.findMany({
      where,
      orderBy: { createdAt: "desc" },
      include: {
        contact: { select: { id: true, name: true } },
        company: { select: { id: true, name: true } },
        application: { select: { id: true, title: true, company: true } },
      },
    });

    const payload = notes.map((n) => ({
      ...n,
      contactName: n.contact?.name ?? null,
      companyName: n.company?.name ?? null,
      applicationName:
        n.application?.title != null && String(n.application.title).trim() !== ""
          ? n.application.title
          : n.application?.company != null && String(n.application.company).trim() !== ""
            ? n.application.company
            : null,
    }));

    return NextResponse.json({ notes: payload });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().formErrors[0] ?? parsed.error.issues[0]?.message ?? "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const { contactId, companyId, applicationId, content } = parsed.data;

  if (contactId) {
    const c = await prisma.contact.findFirst({
      where: { id: contactId, userId: session.sub },
    });
    if (!c) return NextResponse.json({ error: "Contact not found" }, { status: 404 });
  }
  if (companyId) {
    const c = await prisma.company.findFirst({
      where: { id: companyId, userId: session.sub },
    });
    if (!c) return NextResponse.json({ error: "Company not found" }, { status: 404 });
  }
  if (applicationId) {
    const a = await prisma.jobApplication.findFirst({
      where: { id: applicationId, userId: session.sub },
    });
    if (!a) return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  try {
    const note = await prisma.note.create({
      data: {
        userId: session.sub,
        content,
        contactId: contactId ?? null,
        companyId: companyId ?? null,
        applicationId: applicationId ?? null,
      },
      include: {
        contact: { select: { id: true, name: true } },
        company: { select: { id: true, name: true } },
        application: { select: { id: true, title: true, company: true } },
      },
    });

    return NextResponse.json({
      note: {
        ...note,
        contactName: note.contact?.name ?? null,
        companyName: note.company?.name ?? null,
        applicationName:
          note.application?.title != null && String(note.application.title).trim() !== ""
            ? note.application.title
            : note.application?.company != null && String(note.application.company).trim() !== ""
              ? note.application.company
              : null,
      },
    });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
