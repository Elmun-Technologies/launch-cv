import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { chatJson } from "@/lib/openai-client";
import { extractResumeText } from "@/lib/resume-parse";
import { hashClientIp } from "@/lib/request-ip";
import { allowFreeAtsBurst } from "@/lib/rate-limit-presets";
import { trackEvent } from "@/lib/analytics";
import type { FreeAtsResult } from "@/types/ai-results";

/** One free trial per IP inside this window. */
const TRIAL_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

const DIMENSIONS = ["Formatting", "Keywords", "Structure", "Readability"] as const;

type RawFix = { priority?: unknown };
type RawScore = { overall?: unknown; dimensions?: unknown; fixes?: unknown };

function clampScore(n: unknown): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

/** Shape the model output into the gated public result. The fix *text* never
 *  leaves this function — only per-priority counts do. */
function toPublicResult(raw: RawScore): FreeAtsResult {
  const dimSource = Array.isArray(raw.dimensions) ? (raw.dimensions as Record<string, unknown>[]) : [];
  const dimensions = DIMENSIONS.map((name) => {
    const match = dimSource.find(
      (d) => String(d?.name ?? "").toLowerCase() === name.toLowerCase(),
    );
    return { name, score: clampScore(match?.score) };
  });

  const fixes = Array.isArray(raw.fixes) ? (raw.fixes as RawFix[]) : [];
  const issueCounts = { high: 0, medium: 0, low: 0 };
  for (const f of fixes) {
    const p = String(f?.priority ?? "").toLowerCase();
    if (p === "high") issueCounts.high += 1;
    else if (p === "medium") issueCounts.medium += 1;
    else if (p === "low") issueCounts.low += 1;
  }

  return {
    overall: clampScore(raw.overall),
    dimensions,
    issueCounts,
    totalFixes: issueCounts.high + issueCounts.medium + issueCounts.low,
  };
}

export async function POST(req: Request) {
  // 1. Cheap in-memory burst guard.
  if (!allowFreeAtsBurst(req)) {
    return NextResponse.json(
      { error: "Too many attempts. Please try again later." },
      { status: 429 },
    );
  }

  // 2. Durable per-IP quota (survives serverless cold starts).
  const ipHash = await hashClientIp(req);
  const since = new Date(Date.now() - TRIAL_WINDOW_MS);
  const priorTrial = await prisma.freeAtsTrial
    .findFirst({ where: { ipHash, createdAt: { gte: since } } })
    .catch(() => null);
  if (priorTrial) {
    return NextResponse.json(
      {
        error: "You've used your free ATS check. Create an account for unlimited scans and the full fix list.",
        alreadyUsed: true,
      },
      { status: 429 },
    );
  }

  // 3. Read the resume — uploaded file or pasted text.
  const formData = await req.formData().catch(() => null);
  if (!formData) return NextResponse.json({ error: "Form data expected" }, { status: 400 });

  let resumeText: string;
  const file = formData.get("file");
  const pasted = formData.get("text");

  if (file instanceof File && file.size > 0) {
    const parsed = await extractResumeText(file);
    if (!parsed.ok) return NextResponse.json({ error: parsed.error }, { status: parsed.status });
    resumeText = parsed.text;
  } else if (typeof pasted === "string" && pasted.trim().length >= 30) {
    resumeText = pasted;
  } else {
    return NextResponse.json(
      { error: "Upload a PDF/DOCX or paste at least a few lines of your resume." },
      { status: 400 },
    );
  }

  const fingerprint =
    typeof formData.get("fingerprint") === "string"
      ? String(formData.get("fingerprint")).slice(0, 128)
      : null;

  // 4. Score it.
  const system = `You are an ATS (Applicant Tracking System) resume evaluator. Return JSON only.
Analyze the resume text for how well it parses and ranks in automated systems.
JSON shape:
{
  "overall": number (0-100, overall ATS readiness),
  "dimensions": [
    { "name": "Formatting", "score": 0-100 },
    { "name": "Keywords", "score": 0-100 },
    { "name": "Structure", "score": 0-100 },
    { "name": "Readability", "score": 0-100 }
  ],
  "fixes": [ { "priority": "High" | "Medium" | "Low", "title": string } ]
}
Rules:
- Provide 4-10 concrete fixes ranked by priority. Base every fix on the actual text.
- Do not fabricate metrics. Be honest and specific.`;

  const user = `Evaluate this resume for ATS readiness:\n\n${resumeText.slice(0, 12000)}`;

  let result: FreeAtsResult;
  try {
    const raw = await chatJson<RawScore>({ system, user });
    result = toPublicResult(raw);
  } catch (e) {
    console.error("[free/ats-check] scoring error:", e);
    return NextResponse.json(
      { error: "Could not score the resume right now. Please try again." },
      { status: 502 },
    );
  }

  // 5. Record the trial (best-effort) and track the funnel event.
  await prisma.freeAtsTrial
    .create({ data: { ipHash, fingerprint, score: result.overall } })
    .catch(() => null);
  await trackEvent("free_ats_check", { meta: { score: result.overall, totalFixes: result.totalFixes } });

  return NextResponse.json({ result });
}
