import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const metaSchema = z.object({
  jobTitle: z.string().max(200).optional().nullable(),
  saveFromPrefix: z.string().max(64).optional().nullable(),
  saveFromValue: z.string().max(300).optional().nullable(),
  wantsEmails: z.boolean().optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  city: z.string().max(200).optional().nullable(),
  profileUrlPrefix: z.string().max(64).optional().nullable(),
  profileUrlValue: z.string().max(300).optional().nullable(),
  stateValue: z.string().max(120).optional().nullable(),
  personalSummary: z.string().max(1000).optional().nullable(),
});

const patchSchema = z.object({
  name: z.string().min(1).max(500).optional(),
  industry: z.string().max(200).nullable().optional(),
  location: z.string().max(300).nullable().optional(),
  size: z.string().max(100).nullable().optional(),
  type: z.string().max(100).nullable().optional(),
  website: z
    .string()
    .max(2000)
    .nullable()
    .optional()
    .refine((v) => v == null || v === "" || z.string().url().safeParse(v).success, {
      message: "Invalid website",
    }),
  foundedYear: z.string().max(32).nullable().optional(),
  description: z.string().max(8000).nullable().optional(),
  meta: metaSchema.optional(),
});

function parseStoredDescription(raw: string | null) {
  if (!raw) return { description: null as string | null, meta: null as z.infer<typeof metaSchema> | null };
  try {
    const parsed = JSON.parse(raw) as { version?: string; description?: string | null; meta?: unknown };
    if (parsed && parsed.version === "company-meta-v1") {
      const metaParsed = metaSchema.safeParse(parsed.meta ?? {});
      return {
        description: typeof parsed.description === "string" ? parsed.description : null,
        meta: metaParsed.success ? metaParsed.data : null,
      };
    }
    return { description: raw, meta: null };
  } catch {
    return { description: raw, meta: null };
  }
}

function buildStoredDescription(args: {
  existing: string | null;
  description?: string | null;
  meta?: z.infer<typeof metaSchema>;
}) {
  const current = parseStoredDescription(args.existing);
  const nextDescription = args.description !== undefined ? args.description : current.description;
  const nextMeta = args.meta !== undefined ? args.meta : current.meta;

  if (!nextMeta) return nextDescription ?? null;

  return JSON.stringify({
    version: "company-meta-v1",
    description: nextDescription ?? null,
    meta: nextMeta,
  });
}

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  try {
    const company = await prisma.company.findFirst({
      where: { id, userId: session.sub },
    });
    if (!company) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ company });
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

  const existing = await prisma.company.findFirst({
    where: { id, userId: session.sub },
  });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const d = parsed.data;
  const data: Record<string, unknown> = {};
  if (d.name !== undefined) data.name = d.name;
  if (d.industry !== undefined) data.industry = d.industry;
  if (d.location !== undefined) data.location = d.location;
  if (d.size !== undefined) data.size = d.size;
  if (d.type !== undefined) data.type = d.type;
  if (d.website !== undefined) {
    data.website = d.website && d.website !== "" ? d.website : null;
  }
  if (d.foundedYear !== undefined) data.foundedYear = d.foundedYear;
  if (d.description !== undefined || d.meta !== undefined) {
    data.description = buildStoredDescription({
      existing: existing.description,
      description: d.description,
      meta: d.meta,
    });
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "No fields to update" }, { status: 400 });
  }

  try {
    const company = await prisma.company.update({
      where: { id },
      data: data as Parameters<typeof prisma.company.update>[0]["data"],
    });
    return NextResponse.json({ company });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await ctx.params;

  try {
    const result = await prisma.company.deleteMany({
      where: { id, userId: session.sub },
    });
    if (result.count === 0) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
