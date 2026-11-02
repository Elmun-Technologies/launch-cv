import { NextResponse } from "next/server";
import { z } from "zod";
import { adminApi } from "@/lib/admin-api";
import { USER_FILTERS, loadUserPage } from "@/lib/admin-user-list";

const querySchema = z.object({
  q: z.string().trim().max(200).optional(),
  filter: z.enum(USER_FILTERS).default("all"),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export async function GET(req: Request) {
  const { error } = await adminApi("users");
  if (error) return error;

  const url = new URL(req.url);
  const parsed = querySchema.safeParse({
    q: url.searchParams.get("q") || undefined,
    filter: url.searchParams.get("filter") || undefined,
    page: url.searchParams.get("page") ?? undefined,
    pageSize: url.searchParams.get("pageSize") ?? undefined,
  });
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { q, filter, page, pageSize } = parsed.data;
  const { total, rows } = await loadUserPage({ q, filter, page, pageSize });
  return NextResponse.json({ total, page, pageSize, rows });
}
