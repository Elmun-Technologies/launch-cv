import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const postSchema = z.object({
  name: z.string().min(1).max(500),
  email: z
    .string()
    .max(320)
    .optional()
    .nullable()
    .refine((v) => v == null || v === "" || z.string().email().safeParse(v).success, {
      message: "Invalid email",
    }),
  phone: z.string().max(64).optional().nullable(),
  company: z.string().max(500).optional().nullable(),
  role: z.string().max(300).optional().nullable(),
  relationship: z.string().max(200).optional().nullable(),
  goal: z.string().max(2000).optional().nullable(),
  status: z.string().min(1).max(64).optional(),
  linkedinUrl: z
    .string()
    .max(2000)
    .optional()
    .nullable()
    .refine((v) => v == null || v === "" || z.string().url().safeParse(v).success, {
      message: "Invalid linkedinUrl",
    }),
  lastContactAt: z.coerce.date().nullable().optional(),
  followUpAt: z.coerce.date().nullable().optional(),
});

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const contacts = await prisma.contact.findMany({
      where: { userId: session.sub },
      orderBy: { updatedAt: "desc" },
    });
    return NextResponse.json({ contacts });
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
    const contact = await prisma.contact.create({
      data: {
        userId: session.sub,
        name: parsed.data.name,
        email: parsed.data.email && parsed.data.email !== "" ? parsed.data.email : null,
        phone: parsed.data.phone ?? null,
        company: parsed.data.company ?? null,
        role: parsed.data.role ?? null,
        relationship: parsed.data.relationship ?? null,
        goal: parsed.data.goal ?? null,
        status: parsed.data.status ?? "active",
        linkedinUrl:
          parsed.data.linkedinUrl && parsed.data.linkedinUrl !== "" ? parsed.data.linkedinUrl : null,
        lastContactAt: parsed.data.lastContactAt ?? null,
        followUpAt: parsed.data.followUpAt ?? null,
      },
    });
    return NextResponse.json({ contact });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
