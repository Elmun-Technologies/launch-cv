import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export type AuditAction =
  // CMS content
  | "blog.create"
  | "blog.update"
  | "blog.publish"
  | "blog.unpublish"
  | "blog.schedule"
  | "blog.archive"
  | "blog.delete"
  | "testimonial.create"
  | "testimonial.update"
  | "testimonial.delete"
  | "faq.create"
  | "faq.update"
  | "faq.delete"
  | "page-copy.update"
  | "media.upload"
  | "media.delete"
  // Operations
  | "user.role.change"
  | "user.delete"
  | "subscription.cancel"
  | "subscription.refund"
  | "ai-usage.limit.override";

export type AuditPayload = {
  actorId: string | null;
  action: AuditAction;
  entity: string;
  entityId?: string | null;
  diff?: Prisma.InputJsonValue | null;
  ip?: string | null;
};

/**
 * Records an admin action to the AuditLog table. Never throws —
 * a failed audit write should not block the actual mutation.
 */
export async function recordAudit(payload: AuditPayload): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: payload.actorId,
        action: payload.action,
        entity: payload.entity,
        entityId: payload.entityId ?? null,
        diff: payload.diff ?? undefined,
        ip: payload.ip ?? null,
      },
    });
  } catch (err) {
    console.error("[audit] failed to record", payload.action, err);
  }
}
