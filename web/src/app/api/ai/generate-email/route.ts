import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { parseResumeContent } from "@/lib/resume-json";
import { chatJson } from "@/lib/openai-client";
import { allowAiJd } from "@/lib/rate-limit-presets";

const schema = z.object({
  type: z.enum(["thank-you", "follow-up", "networking", "introduction", "custom"]),
  resumeId: z.string().min(1).optional(),
  recipientName: z.string().max(200).optional(),
  recipientRole: z.string().max(200).optional(),
  company: z.string().max(200).optional(),
  context: z.string().max(2000).optional(),
  tone: z.enum(["formal", "friendly", "concise"]).optional(),
});

type EmailResult = {
  subject: string;
  body: string;
  tips: string[];
};

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (!allowAiJd(session.sub)) {
    return NextResponse.json({ error: "Rate limit exceeded. Try again shortly." }, { status: 429 });
  }

  let rawBody: unknown;
  try { rawBody = await req.json(); } catch { return NextResponse.json({ error: "JSON expected" }, { status: 400 }); }

  const parsed = schema.safeParse(rawBody);
  if (!parsed.success) return NextResponse.json({ error: "Validation error" }, { status: 400 });

  let resumeContext = "";
  if (parsed.data.resumeId) {
    const resume = await prisma.resume.findFirst({ where: { id: parsed.data.resumeId, userId: session.sub } });
    if (resume) {
      const content = parseResumeContent(resume.content);
      resumeContext = `\nSender's background: ${content.contact.fullName}, ${content.headline}. Key skills: ${content.skills.slice(0, 8).join(", ")}.`;
    }
  }

  const { type, recipientName, recipientRole, company, context, tone } = parsed.data;

  const system = `You are a professional email writer for job seekers. Return JSON only.
Write a ${tone ?? "friendly"} ${type} email.
JSON keys: subject (string), body (string, use \\n for line breaks), tips (array of 2-3 brief tips for the sender).
Rules:
- Be genuine and specific, not generic
- Keep it concise (under 200 words for body)
- Include a clear call-to-action where appropriate
- Match the tone: ${tone ?? "friendly"}`;

  const userPrompt = `Email type: ${type}
${recipientName ? `Recipient: ${recipientName}` : ""}
${recipientRole ? `Recipient role: ${recipientRole}` : ""}
${company ? `Company: ${company}` : ""}
${context ? `Additional context: ${context}` : ""}
${resumeContext}

Generate a professional ${type} email.`;

  try {
    const result = await chatJson<EmailResult>({ system, user: userPrompt });
    if (!result || typeof result.subject !== "string") {
      return NextResponse.json({ error: "AI response format is invalid" }, { status: 502 });
    }
    return NextResponse.json({ result });
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : "Error" }, { status: 502 });
  }
}
