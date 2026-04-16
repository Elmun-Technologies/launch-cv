import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { trackEvent } from "@/lib/analytics";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    include: {
      resumes: { include: { jdRuns: true, snapshots: true } },
    },
  });
  if (!user) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const payload = {
    exportedAt: new Date().toISOString(),
    user: {
      email: user.email,
      name: user.name,
      createdAt: user.createdAt,
    },
    resumes: user.resumes.map((r) => ({
      id: r.id,
      title: r.title,
      vertical: r.vertical,
      regionMode: r.regionMode,
      content: parseResumeContent(r.content),
      updatedAt: r.updatedAt,
      jdRuns: r.jdRuns.map((j) => ({
        id: j.id,
        createdAt: j.createdAt,
        jdText: j.jdText,
        result: j.result,
      })),
      snapshots: r.snapshots.map((s) => ({
        id: s.id,
        label: s.label,
        createdAt: s.createdAt,
        content: parseResumeContent(s.content),
      })),
    })),
  };

  await trackEvent("account_export", { userId: session.sub });

  return NextResponse.json(payload, {
    headers: {
      "Content-Disposition": `attachment; filename="launchcv-export-${user.id.slice(0, 8)}.json"`,
    },
  });
}
