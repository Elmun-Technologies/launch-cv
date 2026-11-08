/**
 * One-time changes to admin settings that live in the database (AppSetting rows).
 * Each fix runs once, is recorded under the "migrations" row, and only replaces a
 * value that still equals the old default, so an admin's own choice is never overwritten.
 * Runs during `npm run build`; never fails a deploy.
 */
import { PrismaClient, type Prisma } from "@prisma/client";

const MARKER_KEY = "migrations";
const OLD_DEFAULT_MODEL = "gpt-4o-mini";
const CLAUDE_MODEL = "claude-haiku-5-5";
/** Keys of Settings["models"] that name a per-tool model (see src/lib/app-settings.ts). */
const TOOLS = [
  "free_ats", "jd_align", "impact_rewrite", "role_fit", "packet", "company_match", "evidence",
  "email", "import", "free_bullets", "free_summary", "free_resignation",
] as const;

type Json = Record<string, unknown>;

async function main() {
  if (!process.env.DATABASE_URL) return;
  const prisma = new PrismaClient();
  try {
    const marker = await prisma.appSetting.findUnique({ where: { key: MARKER_KEY } });
    const prev = (marker?.value as Json | undefined)?.done;
    const done = new Set<string>(Array.isArray(prev) ? prev.filter((x): x is string => typeof x === "string") : []);
    const applied: string[] = [];
    const write = (key: string, value: Json) =>
      prisma.appSetting.upsert({ where: { key }, create: { key, value: value as Prisma.InputJsonValue }, update: { value: value as Prisma.InputJsonValue } });

    // 1. Free accounts get a small AI allowance. A saved 0/0/0 was the old default, not a choice.
    if (!done.has("free-allowance-2026-11")) {
      const row = await prisma.appSetting.findUnique({ where: { key: "planLimits" } });
      const v = row?.value as Json | undefined;
      const free = v?.free as Json | undefined;
      if (v && free && free.jd === 0 && free.packet === 0 && free.roleFit === 0) {
        await write("planLimits", { ...v, free: { jd: 2, packet: 0, roleFit: 1 } });
      }
      applied.push("free-allowance-2026-11");
    }

    // 2. Move tools still on the old default model to Claude Haiku, once a Claude key exists.
    //    Without a key this waits for a later deploy. Failed Claude calls fall back to OpenAI.
    if (!done.has("claude-haiku-2026-11")) {
      const hasKey =
        !!process.env.ANTHROPIC_API_KEY ||
        (await prisma.integrationSecret.count({ where: { provider: "anthropic", field: "apiKey" } })) > 0;
      if (hasKey) {
        const row = await prisma.appSetting.findUnique({ where: { key: "models" } });
        const next: Json = { ...((row?.value as Json | undefined) ?? {}) };
        for (const tool of TOOLS) if (!next[tool] || next[tool] === OLD_DEFAULT_MODEL) next[tool] = CLAUDE_MODEL;
        if (!next.freeTierModel) next.freeTierModel = CLAUDE_MODEL;
        await write("models", next);
        applied.push("claude-haiku-2026-11");
      }
    }

    if (applied.length) await write(MARKER_KEY, { done: [...done, ...applied] });
    console.log(`[settings-fixes] applied: ${applied.join(", ") || "none"}`);
  } catch (e) {
    console.warn("[settings-fixes] skipped:", e instanceof Error ? e.message : e);
  } finally {
    await prisma.$disconnect();
  }
}

void main();
