import { prisma } from "@/lib/prisma";
import { recordAudit, type AuditAction } from "./audit";
import type { Prisma } from "@prisma/client";

/**
 * Generic CRUD helpers that automatically emit audit-log entries.
 * Use these from /api/admin/cms/* routes — never call prisma directly there.
 */

type Actor = { id: string };

export type CreateOpts<TData> = {
  actor: Actor;
  data: TData;
  action: AuditAction;
  entity: string;
  ip?: string | null;
};

export type UpdateOpts<TData> = {
  actor: Actor;
  id: string;
  before: Record<string, unknown>;
  data: TData;
  action: AuditAction;
  entity: string;
  ip?: string | null;
};

export type DeleteOpts = {
  actor: Actor;
  id: string;
  before: Record<string, unknown>;
  action: AuditAction;
  entity: string;
  ip?: string | null;
};

export async function auditedCreate<T>(
  create: () => Promise<T>,
  opts: Omit<CreateOpts<unknown>, "data"> & { entityIdGetter?: (created: T) => string },
): Promise<T> {
  const created = await create();
  const entityId = opts.entityIdGetter ? opts.entityIdGetter(created) : (created as { id?: string }).id ?? null;
  await recordAudit({
    actorId: opts.actor.id,
    action: opts.action,
    entity: opts.entity,
    entityId,
    diff: { created } as unknown as Prisma.InputJsonValue,
    ip: opts.ip ?? null,
  });
  return created;
}

export async function auditedUpdate<T>(
  update: () => Promise<T>,
  opts: UpdateOpts<unknown>,
): Promise<T> {
  const updated = await update();
  // Naive diff: store before+after; downstream tooling can compute field-level deltas.
  await recordAudit({
    actorId: opts.actor.id,
    action: opts.action,
    entity: opts.entity,
    entityId: opts.id,
    diff: { before: opts.before, after: updated } as unknown as Prisma.InputJsonValue,
    ip: opts.ip ?? null,
  });
  return updated;
}

export async function auditedDelete<T>(
  remove: () => Promise<T>,
  opts: DeleteOpts,
): Promise<T> {
  const removed = await remove();
  await recordAudit({
    actorId: opts.actor.id,
    action: opts.action,
    entity: opts.entity,
    entityId: opts.id,
    diff: { deleted: opts.before } as unknown as Prisma.InputJsonValue,
    ip: opts.ip ?? null,
  });
  return removed;
}

/** Re-export prisma for convenience inside admin route handlers. */
export { prisma };
