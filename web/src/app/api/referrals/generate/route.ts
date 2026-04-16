import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const postSchema = z
  .object({
    forceNew: z.boolean().optional(),
  })
  .strict();

function makeCode() {
  return randomUUID().slice(0, 8);
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: unknown = {};
  try {
    const text = await req.text();
    if (text.trim()) body = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().formErrors[0] ?? parsed.error.issues[0]?.message ?? "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const forceNew = Boolean(parsed.data.forceNew);

  if (!forceNew) {
    const existing = await prisma.referral.findFirst({
      where: {
        userId: session.sub,
        referredEmail: null,
        status: "pending",
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      return NextResponse.json({ referral: existing, reused: true });
    }
  }

  for (let attempt = 0; attempt < 12; attempt += 1) {
    const code = makeCode();
    try {
      const referral = await prisma.referral.create({
        data: {
          userId: session.sub,
          code,
        },
      });
      return NextResponse.json({ referral });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
        continue;
      }
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
  }

  return NextResponse.json({ error: "Could not generate unique code" }, { status: 503 });
}
