import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { redact } from "@/lib/redact";

export type AuditAction =
  // CMS content
  | "blog.create"
  | "blog.update"
  | "blog.autosave"
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
  | "faq.reorder"
  | "page-copy.update"
  | "page-copy.restore"
  | "media.upload"
  | "media.delete"
  // Operations
  | "user.role.change"
  | "user.delete"
  | "user.plan.grant"
  | "user.plan.revoke"
  | "user.usage.reset"
  | "user.suspend"
  | "user.unsuspend"
  | "user.export"
  | "audit.export"
  | "resume.delete"
  | "subscription.cancel"
  | "subscription.refund"
  | "discount.create"
  | "discount.delete"
  | "winback.test"
  | "ai-usage.limit.override"
  // Platform configuration and admin security
  | "integration.update"
  | "integration.test"
  | "settings.update"
  | "admin.2fa.enable"
  | "admin.2fa.reset"
  | "admin.2fa.failed"
  | "admin.reauth"
  | "admin.reauth.failed"
  | "integration.disconnect"
  | "admin.denied"
  | "admin.ip.blocked"
  | "admin.origin.blocked"
  | "admin.2fa.recovery.generate"
  | "admin.2fa.recovery.used"
  | "admin.notify.key-change";

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
        // Secrets never reach the audit log, whatever the caller passed.
        diff: payload.diff == null ? undefined : (redact(payload.diff) as Prisma.InputJsonValue),
        ip: payload.ip ?? null,
      },
    });
  } catch (err) {
    console.error("[audit] failed to record", payload.action, redact(err));
  }
}
