import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const patchSchema = z.object({
  status: z.string().min(1).max(64).optional(),
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
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });

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
  } = {};
  if (parsed.data.status != null) data.status = parsed.data.status;
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
