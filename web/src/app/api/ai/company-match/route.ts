import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { chatJson } from "@/lib/openai-client";
import { getCompanyById, type CompanyRequirement } from "@/lib/company-requirements";
import { allowAiJd } from "@/lib/rate-limit-presets";

const schema = z.object({
  resumeId: z.string().min(1),
  companyId: z.string().min(1).optional(),
  customCompany: z.object({
    name: z.string().min(1),
    industry: z.string().optional(),
    jobDescription: z.string().optional(),
  }).optional(),
});

type CompanyMatchResult = {
  matchScore: number;
  keywordGaps: { keyword: string; status: "found" | "missing" | "partial"; suggestion: string }[];
  cultureFit: { aspect: string; score: number; tip: string }[];
  formatRecommendations: string[];
  bulletRewrites: { original: string; improved: string; reason: string }[];
  overallAdvice: string[];
};

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!allowAiJd(session.sub)) return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });

  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "JSON expected" }, { status: 400 }); }

  const parsed = schema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });

  const resume = await prisma.resume.findFirst({ where: { id: parsed.data.resumeId, userId: session.sub } });
  if (!resume) return NextResponse.json({ error: "Resume not found" }, { status: 404 });

  const content = parseResumeContent(resume.content);

  let companyContext: string;
  if (parsed.data.companyId) {
    const company = getCompanyById(parsed.data.companyId);
    if (!company) return NextResponse.json({ error: "Company not found" }, { status: 404 });
    companyContext = buildCompanyContext(company);
  } else if (parsed.data.customCompany) {
    companyContext = `Company: ${parsed.data.customCompany.name}\nIndustry: ${parsed.data.customCompany.industry ?? "Unknown"}\n${parsed.data.customCompany.jobDescription ? `Job Description:\n${parsed.data.customCompany.jobDescription}` : ""}`;
  } else {
    return NextResponse.json({ error: "Company or custom company required" }, { status: 400 });
  }

  const system = `You are an expert career coach who specializes in helping candidates tailor their resumes for specific companies. Return JSON only.

JSON keys:
- matchScore: 0-100 (how well the resume matches this company's requirements)
- keywordGaps: array of {keyword, status: "found"|"missing"|"partial", suggestion}
- cultureFit: array of {aspect, score: 0-10, tip}
- formatRecommendations: array of strings
- bulletRewrites: array of {original, improved, reason} (top 3-5 bullets that need improvement)
- overallAdvice: array of 3-5 strategic recommendations

Rules:
- Be specific to this company's culture and requirements
- Do not fabricate metrics — only suggest improvements based on existing content
- Prioritize actionable, specific advice`;

  const userPrompt = `COMPANY CONTEXT:\n${companyContext}\n\nRESUME:\n${JSON.stringify(content)}\n\nAnalyze this resume for this specific company. Provide match score, keyword gaps, culture fit assessment, format recommendations, bullet rewrites, and overall strategic advice.`;

  try {
    const result = await chatJson<CompanyMatchResult>({ system, user: userPrompt });
    if (!result || typeof result.matchScore !== "number") {
      return NextResponse.json({ error: "AI response invalid" }, { status: 502 });
    }
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 502 });
  }
}

function buildCompanyContext(c: CompanyRequirement): string {
  return `Company: ${c.name}
Industry: ${c.industry}
Tier: ${c.tier}
Required Keywords: ${c.keywords.join(", ")}
Culture Values: ${c.culture.join(", ")}
Format Requirements: ${c.formatTips.join("; ")}
Must Have: ${c.mustHave.join("; ")}
Avoid: ${c.avoid.join("; ")}
Example Ideal Bullet: ${c.exampleBullet}`;
}
