import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { chatJson } from "@/lib/openai-client";
import { allowAiEvidence } from "@/lib/rate-limit-presets";
import { assertAiUsageAllowed } from "@/lib/usage-limits";
import { jsonUsageBlocked } from "@/lib/usage-response";
import { trackEvent } from "@/lib/analytics";

const schema = z.object({
  resumeId: z.string().min(1),
});

type EvidenceResult = {
  issues: {
    severity: "low" | "med" | "high";
    bulletId?: string;
    message: string;
    suggestion: string;
  }[];
  metrics_found: { text: string; bulletId?: string }[];
};

function extractNumbers(text: string) {
  const re = /(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d+)?%?|\b\d+x\b)/gi;
  return text.match(re) ?? [];
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!allowAiEvidence(session.sub)) {
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
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });

  const resume = await prisma.resume.findFirst({
    where: { id: parsed.data.resumeId, userId: session.sub },
  });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const content = parseResumeContent(resume.content);
  const metricTexts: { text: string; bulletId?: string }[] = [];
  const heuristicIssues: EvidenceResult["issues"] = [];

  for (const ex of content.experience) {
    for (const b of ex.bullets) {
      const nums = extractNumbers(b.text);
      for (const n of nums) metricTexts.push({ text: n, bulletId: b.id });
    }
  }

  const system = `You are an editor and consistency checker. Return JSON only: issues[], metrics_found[].
issues must reference existing bulletIds. Do not add fake metrics — only flag contradictions/suspicions from the text.`;

  const userPrompt = `RESUME JSON:
${JSON.stringify(content)}

Already found metric fragments:
${JSON.stringify(metricTexts)}`;

  try {
    const ai = await chatJson<EvidenceResult>({ system, user: userPrompt });
    const merged: EvidenceResult = {
      metrics_found: [...metricTexts, ...(ai.metrics_found ?? [])].slice(0, 40),
      issues: [...heuristicIssues, ...(ai.issues ?? [])],
    };
    await trackEvent("evidence_check", { userId: session.sub, meta: { resumeId: parsed.data.resumeId } });
    return NextResponse.json({ result: merged });
  } catch {
    const fallback: EvidenceResult = {
      metrics_found: metricTexts,
      issues: [
        ...heuristicIssues,
        {
          severity: "low" as const,
          message: "The full check couldn't run right now, so only the basic checks are shown.",
          suggestion: "Try again in a few minutes.",
        },
      ],
    };
    await trackEvent("evidence_check", {
      userId: session.sub,
      meta: { resumeId: parsed.data.resumeId, fallback: true },
    });
    return NextResponse.json({ result: fallback });
  }
}
