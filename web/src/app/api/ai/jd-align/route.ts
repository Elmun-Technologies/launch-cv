import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { chatJson } from "@/lib/openai-client";
import { rubricForVertical } from "@/lib/rubrics";
import { allowAiJd } from "@/lib/rate-limit-presets";
import { trackEvent } from "@/lib/analytics";
import { assertAiUsageAllowed, incrementAiUsage } from "@/lib/usage-limits";
import { jsonUsageBlocked } from "@/lib/usage-response";
import { parseJdResult, type JdAlignResult } from "@/types/ai-results";

const schema = z.object({
  resumeId: z.string().min(1),
  jdText: z.string().min(40).max(24000),
});

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!allowAiJd(session.sub)) {
    return NextResponse.json({ error: "AI limit: exceeded hourly allowance." }, { status: 429 });
  }
  const usage = await assertAiUsageAllowed(session.sub, "jd");
  if (!usage.ok) return jsonUsageBlocked(usage);
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }
  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "JD text is too short or invalid" }, { status: 400 });

  const resume = await prisma.resume.findFirst({
    where: { id: parsed.data.resumeId, userId: session.sub },
  });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const content = parseResumeContent(resume.content);
  const rubric = rubricForVertical(resume.vertical);

  const system = `You are a senior career coach, ATS expert, and recruiting analyst. Return JSON only.
Rules:
- Do not fabricate metrics or unverified facts: write based only on the provided resume.
- Use a professional English tone.
- rewritten_bullets must only reference existing bullet IDs; do not add new IDs.
- match_score must be 0-100 representing how well the resume matches the JD (ATS keyword coverage perspective).
- keyword_coverage: list the top JD keywords/phrases that ARE present in the resume.
- skill_gaps: for each key skill required by the JD, indicate "strong", "partial", or "missing" with a recommendation.
JSON keys: match_score, keyword_coverage, skill_gaps, gap_map, rewritten_bullets, remove_suggestions, explanations.`;

  const userPrompt = `VERTICAL: ${resume.vertical}
RUBRIC CONTEXT: ${rubric}
REGION MODE: ${resume.regionMode}

RESUME JSON:
${JSON.stringify(content)}

JOB DESCRIPTION:
${parsed.data.jdText}

Task:
1) match_score: ATS match score 0-100 (keyword/semantic coverage of JD requirements).
2) keyword_coverage: array of JD keywords already present in resume.
3) skill_gaps: array of {skill, status: "strong"|"partial"|"missing", recommendation} for each key JD skill.
4) gap_map: coverage status for JD requirements (met/partial/missing + evidence).
5) rewritten_bullets: bullet variants tailored to the JD (bulletId required).
6) remove_suggestions: weak or confusing bullets.
7) explanations: 3-6 brief overall explanations.`;

  try {
    const raw = await chatJson<JdAlignResult>({ system, user: userPrompt });
    const result = parseJdResult(raw);
    if (!result) {
      return NextResponse.json({ error: "AI response format is invalid" }, { status: 502 });
    }
    const run = await prisma.jdRun.create({
      data: {
        resumeId: resume.id,
        jdText: parsed.data.jdText,
        result: result as object,
      },
    });
    await incrementAiUsage(session.sub, "jd");
    await trackEvent("jd_run", { userId: session.sub, meta: { resumeId: resume.id } });
    return NextResponse.json({ result, jdRunId: run.id });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Error";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
