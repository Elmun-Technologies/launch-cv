import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { chatJson } from "@/lib/openai-client";
import { rubricForVertical } from "@/lib/rubrics";
import { allowAiRoleFit } from "@/lib/rate-limit-presets";
import { trackEvent } from "@/lib/analytics";
import { assertAiUsageAllowed, incrementAiUsage } from "@/lib/usage-limits";
import { jsonUsageBlocked } from "@/lib/usage-response";
import { parseRoleFitResult, type RoleFitResult } from "@/types/ai-results";

const schema = z.object({
  resumeId: z.string().min(1),
  jdText: z.string().min(20).max(24000).optional(),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!allowAiRoleFit(session.sub)) {
    return NextResponse.json({ error: "AI limit: exceeded hourly allowance." }, { status: 429 });
  }
  const usage = await assertAiUsageAllowed(session.sub, "role_fit");
  if (!usage.ok) return jsonUsageBlocked(usage);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });

  const resume = await prisma.resume.findFirst({
    where: { id: parsed.data.resumeId, userId: session.sub },
  });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const content = parseResumeContent(resume.content);
  const rubric = rubricForVertical(resume.vertical);

  const system = `You are a vertical-specific evaluator in the role of a hiring manager. Return JSON only.
score in range 0-max. Provide 6-10 scores. Do not add fake metrics.
JSON: scores[], overall (0-100), prioritized_fixes[]`;

  const userPrompt = `VERTICAL: ${resume.vertical}
RUBRIC: ${rubric}
RESUME:
${JSON.stringify(content)}
${parsed.data.jdText ? `\nJD (optional alignment):\n${parsed.data.jdText}` : ""}`;

  try {
    const raw = await chatJson<RoleFitResult>({ system, user: userPrompt });
    const result = parseRoleFitResult(raw);
    if (!result) {
      return NextResponse.json({ error: "AI response format is invalid" }, { status: 502 });
    }
    await incrementAiUsage(session.sub, "role_fit");
    await trackEvent("role_fit", { userId: session.sub, meta: { resumeId: parsed.data.resumeId } });
    return NextResponse.json({ result });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
