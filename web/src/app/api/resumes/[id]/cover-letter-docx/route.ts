import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { coverLetterDocxBuffer } from "@/lib/docx/resume-docx";
import { allowPdfUser } from "@/lib/rate-limit-presets";
import { trackEvent } from "@/lib/analytics";

type Ctx = { params: Promise<{ id: string }> };

const bodySchema = z.object({ text: z.string().trim().min(1).max(8000) });

/** Word (.docx) download of a generated cover letter, headed with this resume's contact details. */
export async function POST(req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const parsed = bodySchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ error: "Letter text is missing or too long." }, { status: 400 });
  if (!(await allowPdfUser(session.sub))) {
    return NextResponse.json({ error: "Export rate limit reached. Try again in an hour." }, { status: 429 });
  }
  const { id } = await ctx.params;
  const resume = await prisma.resume.findFirst({ where: { id, userId: session.sub } });
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buffer = await coverLetterDocxBuffer(parseResumeContent(resume.content), parsed.data.text, { regionMode: resume.regionMode });
  await trackEvent("cover_letter_docx_export", { userId: session.sub, meta: { resumeId: id } });
  const name = parseResumeContent(resume.content).contact.fullName.replace(/[^\w\-]+/g, "_") || "cover";
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${name}_cover_letter.docx"`,
      "Cache-Control": "private, no-store",
    },
  });
}
