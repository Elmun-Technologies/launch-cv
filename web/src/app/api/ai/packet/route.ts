import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { chatJson } from "@/lib/openai-client";
import { rubricForVertical } from "@/lib/rubrics";
import { allowAiPacket } from "@/lib/rate-limit-presets";
import { trackEvent } from "@/lib/analytics";
import { assertAiUsageAllowed, incrementAiUsage } from "@/lib/usage-limits";
import { jsonUsageBlocked } from "@/lib/usage-response";
import { parsePacketResult, type PacketResult } from "@/types/ai-results";

const schema = z.object({
  resumeId: z.string().min(1),
  jdText: z.string().min(40).max(24000),
  tone: z.enum(["formal", "neutral"]).optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!allowAiPacket(session.sub)) {
    return NextResponse.json({ error: "AI limit: exceeded hourly allowance." }, { status: 429 });
  }
  const usage = await assertAiUsageAllowed(session.sub, "packet");
  if (!usage.ok) return jsonUsageBlocked(usage);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "JD text is too short" }, { status: 400 });

  const resume = await prisma.resume.findFirst({
    where: { id: parsed.data.resumeId, userId: session.sub },
  });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const content = parseResumeContent(resume.content);
  const rubric = rubricForVertical(resume.vertical);
  const tone = parsed.data.tone ?? "neutral";

  const system = `You are a career coach. Return JSON only: cover_letter, interview_questions (10), elevator_pitch (25-40 seconds).
Do not add fake work experience or metrics. Align with the JD.
Tone: ${tone}.`;

  const userPrompt = `VERTICAL: ${resume.vertical}
RUBRIC: ${rubric}
RESUME:
${JSON.stringify(content)}

JD:
${parsed.data.jdText}`;

  try {
    const raw = await chatJson<PacketResult>({ system, user: userPrompt });
    const result = parsePacketResult(raw);
    if (!result) {
      return NextResponse.json({ error: "AI response format is invalid" }, { status: 502 });
    }
    await incrementAiUsage(session.sub, "packet");
    await trackEvent("packet", { userId: session.sub, meta: { resumeId: parsed.data.resumeId } });
    return NextResponse.json({ result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
