import { createElement } from "react";
import { NextResponse } from "next/server";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { ResumePdfDocument } from "@/lib/pdf/resume-pdf";
import { allowPdfUser } from "@/lib/rate-limit-presets";
import { trackEvent } from "@/lib/analytics";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: Request, ctx: Ctx) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!allowPdfUser(session.sub)) {
    return NextResponse.json({ error: "PDF export rate limit reached." }, { status: 429 });
  }
  const { id } = await ctx.params;
  const resume = await prisma.resume.findFirst({
    where: { id, userId: session.sub },
  });
  if (!resume) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const content = parseResumeContent(resume.content);
  const doc = createElement(ResumePdfDocument, {
    content,
    title: resume.title,
    regionMode: resume.regionMode,
  });
  const buffer = await renderToBuffer(doc);
  await trackEvent("pdf_export", { userId: session.sub, meta: { resumeId: id } });
  const filename = `${resume.title.replace(/[^\w\-]+/g, "_") || "resume"}.pdf`;
  return new NextResponse(new Uint8Array(buffer), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
