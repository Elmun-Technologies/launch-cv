import { prisma } from "@/lib/prisma";
import { getSettings } from "@/lib/app-settings";
import { bootstrapEmails } from "@/lib/admin-guard";
import { getIntegrationValue, providerDef } from "@/lib/integrations";
import { sendTransactionalEmail, appBaseUrl } from "@/lib/email";
import { recordAudit } from "@/lib/cms/audit";
import { maskIp } from "@/lib/ip-allowlist";
import { redactString } from "@/lib/redact";

/**
 * "Email the owner on every key change" (Admin → Security → sign-in rules).
 * Sends a short notice — provider and field names, never values — to every
 * owner. Each attempt is written to the audit log, including when email
 * isn't configured, so the Security page can say so.
 */

/** Resend key and sender are both set (panel or hosting env). */
export async function emailConfigured(): Promise<boolean> {
  const [key, from] = await Promise.all([getIntegrationValue("resend", "apiKey"), getIntegrationValue("resend", "fromEmail")]);
  return !!key && !!from;
}

async function ownerEmails(): Promise<string[]> {
  const owners = await prisma.user.findMany({ where: { role: "owner", emailVerifiedAt: { not: null } }, select: { email: true } });
  return [...new Set([...owners.map((o) => o.email.toLowerCase()), ...bootstrapEmails()])].slice(0, 20);
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

export async function notifyOwnersOfKeyChange(args: {
  actorId: string;
  actorEmail: string;
  provider: string;
  change: "updated" | "disconnected";
  fields: string[];
  ip: string | null;
}): Promise<{ sent: number; skipped?: string }> {
  const { security } = await getSettings();
  if (!security.emailOwnerOnKeyChange) return { sent: 0, skipped: "off" };
  const def = providerDef(args.provider);
  const name = def?.name ?? args.provider;
  const labels = args.fields.map((f) => def?.fields.find((x) => x.key === f)?.label ?? f);
  const audit = (diff: Record<string, string | number | boolean>) =>
    recordAudit({ actorId: args.actorId, action: "admin.notify.key-change", entity: "Integration", entityId: args.provider, diff });

  if (!(await emailConfigured())) {
    await audit({ ok: false, reason: "email not configured" });
    return { sent: 0, skipped: "email not configured" };
  }
  const to = await ownerEmails();
  if (!to.length) {
    await audit({ ok: false, reason: "no owner email" });
    return { sent: 0, skipped: "no owner email" };
  }
  const when = new Date().toISOString().replace("T", " ").slice(0, 16) + " UTC";
  const what = args.change === "disconnected" ? `${name} was disconnected` : `${name} settings changed (${labels.join(", ") || "no fields"})`;
  const link = `${appBaseUrl()}/admin-panel/integrations/${encodeURIComponent(args.provider)}`;
  const text = `${what} by ${args.actorEmail} at ${when} from ${maskIp(args.ip)}.\n\nIf this wasn't expected, open ${link} and check the audit log.`;
  const html = `<p><b>${esc(what)}</b> by ${esc(args.actorEmail)} at ${esc(when)} from ${esc(maskIp(args.ip))}.</p><p>If this wasn't expected, open <a href="${esc(link)}">Admin → Integrations</a> and check the audit log.</p>`;
  let sent = 0;
  let lastError = "";
  for (const addr of to) {
    const r = await sendTransactionalEmail({ to: addr, subject: `LaunchCV: ${what}`, text, html }).catch((e: unknown) => ({ ok: false as const, error: e instanceof Error ? e.message : "send failed" }));
    if (r.ok) sent++;
    else lastError = r.error;
  }
  await audit({ ok: sent > 0, sent, recipients: to.length, ...(lastError ? { error: redactString(lastError).slice(0, 200) } : {}) });
  return { sent };
}
