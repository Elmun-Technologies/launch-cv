import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const postSchema = z.object({
  name: z.string().min(1).max(200),
  subject: z.string().min(1).max(500),
  body: z.string().min(1).max(100000),
  category: z.string().min(1).max(100).optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const templates = await prisma.emailTemplate.findMany({
      where: { userId: session.sub },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ templates });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().formErrors[0] ?? parsed.error.issues[0]?.message ?? "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  try {
    const template = await prisma.emailTemplate.create({
      data: {
        userId: session.sub,
        name: parsed.data.name,
        subject: parsed.data.subject,
        body: parsed.data.body,
        category: parsed.data.category ?? "general",
      },
    });
    return NextResponse.json({ template });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
