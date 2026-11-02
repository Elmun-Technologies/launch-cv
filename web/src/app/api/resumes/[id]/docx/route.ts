import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { resumeDocxBuffer } from "@/lib/docx/resume-docx";
import { allowPdfUser } from "@/lib/rate-limit-presets";
import { trackEvent } from "@/lib/analytics";

type Ctx = { params: Promise<{ id: string }> };

/** Word (.docx) download of a resume. Shares the PDF export rate limit. */
export async function GET(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await allowPdfUser(session.sub))) {
    return NextResponse.json({ error: "Export rate limit reached. Try again in an hour." }, { status: 429 });
  }
  const { id } = await ctx.params;
  const resume = await prisma.resume.findFirst({ where: { id, userId: session.sub } });
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const buffer = await resumeDocxBuffer(parseResumeContent(resume.content), { title: resume.title, regionMode: resume.regionMode });
  await trackEvent("docx_export", { userId: session.sub, meta: { resumeId: id } });
  const filename = `${resume.title.replace(/[^\w\-]+/g, "_") || "resume"}.docx`;
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
