import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { recordAudit } from "@/lib/cms/audit";
import { bustPageCopyCache } from "@/lib/cms/revalidate";
import { PAGE_COPY, type PageCopyKey } from "@/lib/cms/page-copy";

/** How many published versions are kept per page-copy key. */
export const PAGE_COPY_HISTORY = 20;

export type PageCopyVersionRow = {
  id: string;
  createdAt: Date;
  savedByEmail: string | null;
  data: unknown;
};

/** The newest saved versions of a key, newest first. */
export async function listPageCopyVersions(key: string): Promise<PageCopyVersionRow[]> {
  return prisma.pageCopyVersion.findMany({
    where: { key },
    orderBy: { createdAt: "desc" },
    take: PAGE_COPY_HISTORY,
    select: { id: true, createdAt: true, savedByEmail: true, data: true },
  });
}

/**
 * Publishes already-cleaned copy for a key: upserts the PageCopy row, records
 * the new state in the version history (pruned to the last PAGE_COPY_HISTORY),
 * writes the audit log and refreshes the public pages.
 *
 * The first save of a key that already had copy but no history also stores
 * that earlier copy, so it can be restored.
 */
export async function publishPageCopy(opts: {
  key: PageCopyKey;
  clean: Record<string, unknown>;
  actor: { sub: string; email: string };
  action: "page-copy.update" | "page-copy.restore";
  extraDiff?: Record<string, unknown>;
}) {
  const { key, clean, actor, action } = opts;
  const data = clean as Prisma.InputJsonObject;

  const result = await prisma.$transaction(async (tx) => {
    const before = await tx.pageCopy.findUnique({ where: { key } });
    if (before) {
      const hasHistory = await tx.pageCopyVersion.count({ where: { key } });
      if (!hasHistory) {
        await tx.pageCopyVersion.create({
          data: {
            key,
            data: before.data as Prisma.InputJsonValue,
            savedById: before.updatedById,
            savedByEmail: null,
            createdAt: before.updatedAt,
          },
        });
      }
    }
    const updated = await tx.pageCopy.upsert({
      where: { key },
      create: { key, data, updatedById: actor.sub },
      update: { data, updatedById: actor.sub },
    });
    const version = await tx.pageCopyVersion.create({
      data: { key, data, savedById: actor.sub, savedByEmail: actor.email },
      select: { id: true },
    });
    const stale = await tx.pageCopyVersion.findMany({
      where: { key },
      orderBy: { createdAt: "desc" },
      skip: PAGE_COPY_HISTORY,
      select: { id: true },
    });
    if (stale.length) await tx.pageCopyVersion.deleteMany({ where: { id: { in: stale.map((v) => v.id) } } });
    return { before, updated, versionId: version.id };
  });

  await recordAudit({
    actorId: actor.sub,
    action,
    entity: "PageCopy",
    entityId: result.updated.id,
    diff: {
      key,
      before: (result.before?.data as Prisma.InputJsonValue | undefined) ?? null,
      after: data,
      versionId: result.versionId,
      ...(opts.extraDiff ?? {}),
    } as Prisma.InputJsonObject,
  });

  bustPageCopyCache(key);
  return result.updated;
}

/** The public URL to preview a key: its first refreshed path ("layout:/" means every page, so "/"). */
export function pageCopyPreviewPath(key: PageCopyKey): string {
  const first = (PAGE_COPY[key].paths as string[])[0] ?? "/";
  return first.startsWith("layout:") ? first.slice("layout:".length) || "/" : first;
}
