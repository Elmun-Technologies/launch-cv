import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { emptyResumeContent } from "@/types/resume";
import { trackEvent } from "@/lib/analytics";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const resumes = await prisma.resume.findMany({
    where: { userId: session.sub },
    orderBy: { updatedAt: "desc" },
    select: {
      id: true,
      title: true,
      vertical: true,
      regionMode: true,
      updatedAt: true,
    },
  });
  return NextResponse.json({ resumes });
}

const createSchema = z.object({
  title: z.string().min(1).max(200),
  vertical: z.string().min(1).max(64),
  regionMode: z.enum(["us", "eu"]).optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });
  const resume = await prisma.resume.create({
    data: {
      userId: session.sub,
      title: parsed.data.title,
      vertical: parsed.data.vertical,
      regionMode: parsed.data.regionMode ?? "us",
      content: emptyResumeContent() as object,
    },
  });
  await trackEvent("resume_created", { userId: session.sub, meta: { resumeId: resume.id } });
  return NextResponse.json({ id: resume.id });
}
