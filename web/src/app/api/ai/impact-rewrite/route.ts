import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { aiErrorResponse, chatJson } from "@/lib/openai-client";
import { rubricForVertical } from "@/lib/rubrics";
import { allowAiJd } from "@/lib/rate-limit-presets";
import { trackEvent } from "@/lib/analytics";
import { assertAiUsageAllowed, incrementAiUsage } from "@/lib/usage-limits";
import { jsonUsageBlocked } from "@/lib/usage-response";

const schema = z.object({
  resumeId: z.string().min(1),
});

export type ImpactRewriteResult = {
  rewrites: {
    experienceId: string;
    bulletId: string;
    original: string;
    improved: string;
    change_summary: string;
  }[];
  overall_tips: string[];
};

const NUM_RE = /\$?\d[\d,.]*(?:%|[kKmM]\b|\+)?/g;
const normNum = (s: string) => s.replace(/[$,+]/g, "").replace(/\.$/, "").toLowerCase();

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!(await allowAiJd(session.sub))) {
    return NextResponse.json({ error: "AI limit: exceeded hourly allowance." }, { status: 429 });
  }
  const usage = await assertAiUsageAllowed(session.sub, "jd");
  if (!usage.ok) return jsonUsageBlocked(usage);

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });

  const resume = await prisma.resume.findFirst({
    where: { id: parsed.data.resumeId, userId: session.sub },
  });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const content = parseResumeContent(resume.content);
  const rubric = rubricForVertical(resume.vertical);

  const system = `You are a senior resume writer specializing in impact-driven achievement bullets. Return JSON only.
Rules:
- Rewrite EVERY bullet to lead with the outcome or impact.
- Use ONLY facts and numbers that appear somewhere in the resume. Never invent, estimate or extrapolate a number, percentage, team size or timeframe.
- Where a number would make the bullet stronger but the resume doesn't give one, write the placeholder "[number]" so the candidate fills in the real figure.
- If no result is stated, use strong verbs and outcome-focused language instead.
- Keep the same meaning and truthfulness as the original.
- Format: "Achieved [result] by [action], resulting in [impact]" or similar impact patterns.
JSON keys: rewrites, overall_tips.
rewrites: array of {experienceId, bulletId, original, improved, change_summary}.
overall_tips: 3-5 general tips for making the resume more impact-driven.`;

  const userPrompt = `VERTICAL: ${resume.vertical}
RUBRIC: ${rubric}

RESUME JSON:
${JSON.stringify(content)}

Rewrite ALL experience bullets to be impact-driven. For each bullet, provide the original text, the improved version, and a brief summary of what changed.`;

  try {
    const raw = await chatJson<ImpactRewriteResult>({ system, user: userPrompt, tool: "impact_rewrite", userId: session.sub, paid: usage.paid });
    if (!raw || !Array.isArray(raw.rewrites)) {
      return NextResponse.json({ error: "AI response format is invalid" }, { status: 502 });
    }
    // Guard against invented figures: any number the model used that isn't in the
    // resume becomes a "[number]" placeholder for the candidate to fill in.
    const known = new Set((JSON.stringify(content).match(NUM_RE) ?? []).map(normNum));
    raw.rewrites = raw.rewrites.map((r) =>
      typeof r?.improved === "string"
        ? { ...r, improved: r.improved.replace(NUM_RE, (m) => (known.has(normNum(m)) ? m : "[number]")) }
        : r,
    );
    await incrementAiUsage(session.sub, "jd");
    await trackEvent("impact_rewrite", { userId: session.sub, meta: { resumeId: resume.id } });
    return NextResponse.json({ result: raw });
  } catch (e) {
    return aiErrorResponse(e);
  }
}
