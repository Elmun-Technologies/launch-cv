import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";

const schema = z.object({
  experienceId: z.string().min(1),
  bulletId: z.string().min(1),
  text: z.string().min(1).max(4000),
});

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: resumeId } = await ctx.params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });

  const resume = await prisma.resume.findFirst({
    where: { id: resumeId, userId: session.sub },
  });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const content = parseResumeContent(resume.content);
  const exp = content.experience.find((e) => e.id === parsed.data.experienceId);
  if (!exp) return NextResponse.json({ error: "Experience block not found" }, { status: 400 });
  const bullet = exp.bullets.find((b) => b.id === parsed.data.bulletId);
  if (!bullet) return NextResponse.json({ error: "Bullet not found" }, { status: 400 });

  bullet.text = parsed.data.text;

  await prisma.resume.update({
    where: { id: resume.id },
    data: { content: content as object },
  });

  return NextResponse.json({ ok: true });
}
