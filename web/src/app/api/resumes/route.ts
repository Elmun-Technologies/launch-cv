import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { emptyResumeContent } from "@/types/resume";
import { trackEvent } from "@/lib/analytics";
import { getResumeExample } from "@/lib/resume-examples";
import { exampleToContent } from "@/lib/example-to-content";

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
  /** Start from a published resume example (its slug); contact details become the account's. */
  example: z.string().max(80).optional(),
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
  const example = parsed.data.example ? getResumeExample(parsed.data.example) : undefined;
  let content = emptyResumeContent();
  if (example) {
    const user = await prisma.user.findUnique({ where: { id: session.sub }, select: { name: true, email: true } });
    content = exampleToContent(example, { name: user?.name ?? "", email: user?.email ?? session.email });
  }
  const resume = await prisma.resume.create({
    data: {
      userId: session.sub,
      title: example ? `${example.role} resume` : parsed.data.title,
      vertical: parsed.data.vertical,
      regionMode: parsed.data.regionMode ?? "us",
      content: content as object,
    },
  });
  await trackEvent("resume_created", {
    userId: session.sub,
    meta: { resumeId: resume.id, ...(example ? { example: example.slug } : {}) },
  });
  return NextResponse.json({ id: resume.id });
}
