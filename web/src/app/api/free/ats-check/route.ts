import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { chatJson } from "@/lib/openai-client";
import { extractResumeText } from "@/lib/resume-parse";
import { analyzeAtsSignals } from "@/lib/ats-signals";
import { hashClientIp } from "@/lib/request-ip";
import { allowFreeAtsBurst } from "@/lib/rate-limit-presets";
import { trackEvent } from "@/lib/analytics";
import type { FreeAtsFix, FreeAtsReport, FreeAtsResult } from "@/types/ai-results";

/** One free trial per IP inside this window. */
const TRIAL_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

const DIMENSIONS = ["Formatting", "Keywords", "Structure", "Readability"] as const;

type RawFix = { priority?: unknown; title?: unknown; fix?: unknown };

/** How many fixes are shown in full before sign-up. */
const PREVIEW_FIXES = 3;
const PRIORITY_ORDER = { High: 0, Medium: 1, Low: 2 } as const;
type RawScore = { overall?: unknown; dimensions?: unknown; fixes?: unknown };

function clampScore(n: unknown): number {
  const v = typeof n === "number" && Number.isFinite(n) ? n : 0;
  return Math.max(0, Math.min(100, Math.round(v)));
}

function toFix(f: RawFix): FreeAtsFix | null {
  const p = String(f?.priority ?? "").toLowerCase();
  const priority = p === "high" ? "High" : p === "medium" ? "Medium" : p === "low" ? "Low" : null;
  const title = typeof f?.title === "string" ? f.title.trim().slice(0, 200) : "";
  if (!priority || !title) return null;
  const fix = typeof f?.fix === "string" ? f.fix.trim().slice(0, 600) : "";
  return { priority, title, fix };
}

/** Shape the model output into the full report we store for the visitor. */
function toReport(raw: RawScore): FreeAtsReport {
  const dimSource = Array.isArray(raw.dimensions) ? (raw.dimensions as Record<string, unknown>[]) : [];
  const dimensions = DIMENSIONS.map((name) => {
    const match = dimSource.find(
      (d) => String(d?.name ?? "").toLowerCase() === name.toLowerCase(),
    );
    return { name, score: clampScore(match?.score) };
  });

  const fixes = (Array.isArray(raw.fixes) ? (raw.fixes as RawFix[]) : [])
    .map(toFix)
    .filter((f): f is FreeAtsFix => f !== null)
    .sort((a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]);
  const issueCounts = {
    high: fixes.filter((f) => f.priority === "High").length,
    medium: fixes.filter((f) => f.priority === "Medium").length,
    low: fixes.filter((f) => f.priority === "Low").length,
  };

  return {
    overall: clampScore(raw.overall),
    dimensions,
    issueCounts,
    totalFixes: fixes.length,
    fixes,
  };
}

/** The public result: everything except the fixes beyond the preview. */
function toPublicResult({ fixes, ...rest }: FreeAtsReport): FreeAtsResult {
  return { ...rest, preview: fixes.slice(0, PREVIEW_FIXES) };
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
        error: "You've already used this month's free ATS check from this network.",
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

  // 4. Reserve the quota slot BEFORE the paid OpenAI call so two near-simultaneous
  //    requests from one IP can't both score. The globally-oldest reservation for
  //    this IP/window wins; any later one cancels itself.
  const reservation = await prisma.freeAtsTrial
    .create({ data: { ipHash, fingerprint } })
    .catch(() => null);

  if (reservation) {
    const oldest = await prisma.freeAtsTrial
      .findFirst({
        where: { ipHash, createdAt: { gte: since } },
        orderBy: [{ createdAt: "asc" }, { id: "asc" }],
        select: { id: true },
      })
      .catch(() => null);
    if (oldest && oldest.id !== reservation.id) {
      await prisma.freeAtsTrial.delete({ where: { id: reservation.id } }).catch(() => null);
      return NextResponse.json(
        {
          error: "You've already used this month's free ATS check from this network.",
          alreadyUsed: true,
        },
        { status: 429 },
      );
    }
  }

  /** Release the reserved slot when we couldn't produce a real result, so the
   *  visitor keeps their one free scan. */
  const releaseReservation = async () => {
    if (reservation) {
      await prisma.freeAtsTrial.delete({ where: { id: reservation.id } }).catch(() => null);
    }
  };

  // 5. Score it — grounded on deterministic signals so results are consistent.
  const signals = analyzeAtsSignals(resumeText);

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
  "fixes": [ { "priority": "High" | "Medium" | "Low", "title": string, "fix": string } ]
}
Scoring guidance:
- Formatting: penalize columnOrTableHint and allCapsHeavy. Structure: reward the four
  standard sections being present; penalize missing ones. Readability: reward a healthy
  bullet count and quantifiedBulletRatio; penalize mixedDateFormats. Keywords: judge role
  keyword richness from the text.
- The SIGNALS below are deterministically detected and are ground truth. Do NOT contradict
  them (e.g. never claim contact info is missing when hasEmail/hasPhone is true).
Rules:
- Provide 4-10 concrete fixes ranked by priority. Base every fix on the actual text and signals.
- "title" names the problem in plain English (under 12 words). "fix" says exactly what to change, in 1-2 sentences.
- Do not fabricate metrics. Be honest and specific.`;

  const user = `SIGNALS (deterministic, treat as ground truth):
${JSON.stringify(signals)}

RESUME TEXT:
${resumeText.slice(0, 12000)}`;

  let report: FreeAtsReport;
  try {
    const raw = await chatJson<RawScore>({ system, user });
    report = toReport(raw);
  } catch (e) {
    console.error("[free/ats-check] scoring error:", e);
    await releaseReservation();
    return NextResponse.json(
      { error: "Could not score the resume right now. Please try again." },
      { status: 502 },
    );
  }

  // Guard against a garbage/empty model response — don't spend the user's
  // one free trial on a result we couldn't actually produce.
  const emptyResult =
    report.overall === 0 &&
    report.totalFixes === 0 &&
    report.dimensions.every((d) => d.score === 0);
  if (emptyResult) {
    await releaseReservation();
    return NextResponse.json(
      { error: "We couldn't read enough from that resume. Try a clearer PDF/DOCX or paste the text." },
      { status: 502 },
    );
  }

  // 6. Finalize the reserved trial with the full report so the visitor can
  //    claim it after sign-up, and track the funnel event.
  const result = toPublicResult(report);
  let claimToken: string | null = null;
  if (reservation) {
    const token = randomBytes(24).toString("base64url");
    const saved = await prisma.freeAtsTrial
      .update({
        where: { id: reservation.id },
        data: { score: report.overall, report: report as object, claimToken: token },
      })
      .catch(() => null);
    if (saved) claimToken = token;
  }
  await trackEvent("free_ats_check", {
    meta: {
      score: result.overall,
      totalFixes: result.totalFixes,
      columnOrTableHint: signals.columnOrTableHint,
      wordCount: signals.wordCount,
    },
  });

  return NextResponse.json({ result, claimToken });
}
