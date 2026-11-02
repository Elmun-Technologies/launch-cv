import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const jobUrl = z
  .string()
  .trim()
  .max(2000)
  .url()
  .refine((u) => /^https?:\/\//i.test(u), { message: "Use a web link (https://…)" });

const patchSchema = z.object({
  status: z.string().min(1).max(64).optional(),
  jobUrl: jobUrl.nullable().optional(),
  /** ISO date-time of the next interview, or null to clear it. */
  interviewAt: z.string().datetime({ offset: true }).nullable().optional(),
  interviewLabel: z.string().trim().max(60).nullable().optional(),
  title: z.string().max(200).nullable().optional(),
  company: z.string().max(200).nullable().optional(),
  checklist: z.unknown().optional(),
  fitSnapshot: z.unknown().optional(),
  packetSnapshot: z.unknown().optional(),
});

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    const field = issue?.path[0];
    const msg =
      field === "jobUrl" ? "That job post link doesn't look right." : field === "interviewAt" ? "Pick a valid interview date and time." : "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const existing = await prisma.jobApplication.findFirst({
    where: { id, userId: session.sub },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const data: {
    status?: string;
    title?: string | null;
    company?: string | null;
    checklist?: object;
    fitSnapshot?: object;
    packetSnapshot?: object;
    stageChangedAt?: Date;
    jobUrl?: string | null;
    interviewAt?: Date | null;
    interviewLabel?: string | null;
  } = {};
  if (parsed.data.status != null) {
    data.status = parsed.data.status;
    // The card shows when a job reached its stage ("Applied Oct 29").
    if (parsed.data.status !== existing.status) data.stageChangedAt = new Date();
  }
  if (parsed.data.jobUrl !== undefined) data.jobUrl = parsed.data.jobUrl || null;
  if (parsed.data.interviewAt !== undefined) data.interviewAt = parsed.data.interviewAt ? new Date(parsed.data.interviewAt) : null;
  if (parsed.data.interviewLabel !== undefined) data.interviewLabel = parsed.data.interviewLabel || null;
  if (parsed.data.title !== undefined) data.title = parsed.data.title;
  if (parsed.data.company !== undefined) data.company = parsed.data.company;
  if (parsed.data.checklist !== undefined) data.checklist = parsed.data.checklist as object;
  if (parsed.data.fitSnapshot !== undefined) data.fitSnapshot = parsed.data.fitSnapshot as object;
  if (parsed.data.packetSnapshot !== undefined) data.packetSnapshot = parsed.data.packetSnapshot as object;

  const app = await prisma.jobApplication.update({
    where: { id },
    data,
    include: { resume: { select: { id: true, title: true } } },
  });

  return NextResponse.json({ application: app });
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;
  const { count } = await prisma.jobApplication.deleteMany({ where: { id, userId: session.sub } });
  if (count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
