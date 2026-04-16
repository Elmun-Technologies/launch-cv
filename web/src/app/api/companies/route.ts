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

const postSchema = z.object({
  name: z.string().min(1).max(500),
  industry: z.string().max(200).optional().nullable(),
  location: z.string().max(300).optional().nullable(),
  size: z.string().max(100).optional().nullable(),
  type: z.string().max(100).optional().nullable(),
  website: z
    .string()
    .max(2000)
    .optional()
    .nullable()
    .refine((v) => v == null || v === "" || z.string().url().safeParse(v).success, {
      message: "Invalid website",
    }),
  foundedYear: z.string().max(32).optional().nullable(),
  description: z.string().max(8000).optional().nullable(),
  meta: metaSchema.optional(),
});

const querySchema = z.object({
  q: z.string().max(200).optional(),
  page: z.coerce.number().int().min(1).optional(),
  pageSize: z.coerce.number().int().min(1).max(100).optional(),
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

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    q: url.searchParams.get("q") ?? undefined,
    page: url.searchParams.get("page") ?? undefined,
    pageSize: url.searchParams.get("pageSize") ?? undefined,
  });
  if (!parsed.success) {
    const msg =
      parsed.error.flatten().formErrors[0] ?? parsed.error.issues[0]?.message ?? "Validation error";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const page = parsed.data.page ?? 1;
  const pageSize = parsed.data.pageSize ?? 50;
  const q = parsed.data.q?.trim() ?? "";

  const where = q
    ? {
        userId: session.sub,
        OR: [
          { name: { contains: q } },
          { industry: { contains: q } },
          { location: { contains: q } },
          { type: { contains: q } },
        ],
      }
    : { userId: session.sub };

  try {
    const [total, companies] = await Promise.all([
      prisma.company.count({ where }),
      prisma.company.findMany({
        where,
        orderBy: { updatedAt: "desc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);
    return NextResponse.json({
      companies,
      pagination: {
        page,
        pageSize,
        total,
        totalPages: Math.max(1, Math.ceil(total / pageSize)),
      },
    });
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
    const company = await prisma.company.create({
      data: {
        userId: session.sub,
        name: parsed.data.name,
        industry: parsed.data.industry ?? null,
        location: parsed.data.location ?? null,
        size: parsed.data.size ?? null,
        type: parsed.data.type ?? null,
        website: parsed.data.website && parsed.data.website !== "" ? parsed.data.website : null,
        foundedYear: parsed.data.foundedYear ?? null,
        description: buildStoredDescription({
          existing: null,
          description: parsed.data.description ?? null,
          meta: parsed.data.meta,
        }),
      },
    });
    return NextResponse.json({ company });
  } catch {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
