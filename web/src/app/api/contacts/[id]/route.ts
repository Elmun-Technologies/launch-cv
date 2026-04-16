import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const patchSchema = z.object({
  name: z.string().min(1).max(500).optional(),
  email: z
    .string()
    .max(320)
    .nullable()
    .optional()
    .refine((v) => v == null || v === "" || z.string().email().safeParse(v).success, {
      message: "Invalid email",
    }),
  phone: z.string().max(64).nullable().optional(),
  company: z.string().max(500).nullable().optional(),
  role: z.string().max(300).nullable().optional(),
  relationship: z.string().max(200).nullable().optional(),
  goal: z.string().max(2000).nullable().optional(),
  status: z.string().min(1).max(64).optional(),
  linkedinUrl: z
    .string()
    .max(2000)
    .nullable()
    .optional()
    .refine((v) => v == null || v === "" || z.string().url().safeParse(v).success, {
      message: "Invalid linkedinUrl",
    }),
  lastContactAt: z.coerce.date().nullable().optional(),
  followUpAt: z.coerce.date().nullable().optional(),
});

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  try {
    const contact = await prisma.contact.findFirst({
      where: { id, userId: session.sub },
    });
    if (!contact) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ contact });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "JSON" }, { status: 400 });
  }

  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().formErrors[0] ?? parsed.error.issues[0]?.message ?? "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const existing = await prisma.contact.findFirst({
    where: { id, userId: session.sub },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const d = parsed.data;
  const data: Record<string, unknown> = {};
  if (d.name !== undefined) data.name = d.name;
  if (d.email !== undefined) {
    data.email = d.email && d.email !== "" ? d.email : null;
  }
  if (d.phone !== undefined) data.phone = d.phone;
  if (d.company !== undefined) data.company = d.company;
  if (d.role !== undefined) data.role = d.role;
  if (d.relationship !== undefined) data.relationship = d.relationship;
  if (d.goal !== undefined) data.goal = d.goal;
  if (d.status !== undefined) data.status = d.status;
  if (d.linkedinUrl !== undefined) {
    data.linkedinUrl = d.linkedinUrl && d.linkedinUrl !== "" ? d.linkedinUrl : null;
  }
  if (d.lastContactAt !== undefined) data.lastContactAt = d.lastContactAt;
  if (d.followUpAt !== undefined) data.followUpAt = d.followUpAt;

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const contact = await prisma.contact.update({
      where: { id },
      data: data as Parameters<typeof prisma.contact.update>[0]["data"],
    });
    return NextResponse.json({ contact });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  try {
    const result = await prisma.contact.deleteMany({
      where: { id, userId: session.sub },
    });
    if (result.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
