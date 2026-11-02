import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { providerDef } from "@/lib/integrations";
import { planLabel, roleLabel } from "@/lib/admin-labels";

/**
 * Admin → Audit log: filters, readable targets and a one-line "Change" for the
 * stored diff. Shared by the page and its CSV export. Server only.
 */

export const AUDIT_GROUPS = [
  { id: "all", label: "All", prefixes: [] },
  { id: "content", label: "Content", prefixes: ["blog.", "testimonial.", "faq.", "page-copy.", "media."] },
  { id: "users", label: "Users", prefixes: ["user.plan.", "user.usage.", "user.suspend", "user.unsuspend", "user.delete", "resume.", "subscription."] },
  { id: "roles", label: "Roles", prefixes: ["user.role."] },
  { id: "secrets", label: "Secrets", prefixes: ["integration."] },
  { id: "settings", label: "Settings", prefixes: ["settings.", "ai-usage."] },
  { id: "security", label: "Security", prefixes: ["admin."] },
  { id: "data", label: "Exports", prefixes: ["user.export", "audit.export"] },
] as const;
export type AuditGroup = (typeof AUDIT_GROUPS)[number]["id"];

export async function auditWhere(opts: { q?: string; entity?: string; group?: AuditGroup; action?: string }): Promise<Prisma.AuditLogWhereInput> {
  const and: Prisma.AuditLogWhereInput[] = [];
  if (opts.entity) and.push({ entity: opts.entity });
  if (opts.action) and.push({ action: opts.action });
  const group = AUDIT_GROUPS.find((g) => g.id === opts.group);
  if (group && group.prefixes.length) and.push({ OR: group.prefixes.map((p) => ({ action: { startsWith: p } })) });
  const q = opts.q?.trim();
  if (q) {
    // Targets are stored as ids; match people by email too.
    const users = await prisma.user.findMany({ where: { email: { contains: q, mode: "insensitive" } }, select: { id: true }, take: 200 });
    and.push({
      OR: [
        { action: { contains: q, mode: "insensitive" } },
        { entity: { contains: q, mode: "insensitive" } },
        { entityId: { contains: q, mode: "insensitive" } },
        { actor: { is: { email: { contains: q, mode: "insensitive" } } } },
        ...(users.length ? [{ entity: "User", entityId: { in: users.map((u) => u.id) } }] : []),
      ],
    });
  }
  return and.length ? { AND: and } : {};
}

type Row = { entity: string; entityId: string | null; diff: unknown };

const short = (s: string, n = 48) => (s.length > n ? `${s.slice(0, n - 1)}…` : s);

/** Human label for what an entry touched: an email for a user, a post's title, a provider's name. */
export async function resolveTargets(rows: Row[]): Promise<Map<string, string>> {
  const ids = (entity: string) => [...new Set(rows.filter((r) => r.entity === entity && r.entityId).map((r) => r.entityId!))];
  const [users, posts, faqs, testimonials, resumes, pages, media] = await Promise.all([
    prisma.user.findMany({ where: { id: { in: ids("User") } }, select: { id: true, email: true } }),
    prisma.blogPost.findMany({ where: { id: { in: ids("BlogPost") } }, select: { id: true, title: true } }),
    prisma.faq.findMany({ where: { id: { in: ids("Faq") } }, select: { id: true, question: true } }),
    prisma.testimonial.findMany({ where: { id: { in: ids("Testimonial") } }, select: { id: true, authorName: true } }),
    prisma.resume.findMany({ where: { id: { in: ids("Resume") } }, select: { id: true, title: true } }),
    prisma.pageCopy.findMany({ where: { OR: [{ id: { in: ids("PageCopy") } }, { key: { in: ids("PageCopy") } }] }, select: { id: true, key: true } }),
    prisma.mediaAsset.findMany({ where: { id: { in: ids("MediaAsset") } }, select: { id: true, alt: true, url: true } }),
  ]);
  const out = new Map<string, string>();
  const k = (entity: string, id: string) => `${entity}:${id}`;
  for (const u of users) out.set(k("User", u.id), u.email);
  for (const p of posts) out.set(k("BlogPost", p.id), short(p.title));
  for (const f of faqs) out.set(k("Faq", f.id), short(f.question));
  for (const t of testimonials) out.set(k("Testimonial", t.id), `Testimonial · ${t.authorName}`);
  for (const r of resumes) out.set(k("Resume", r.id), short(r.title));
  for (const p of pages) {
    out.set(k("PageCopy", p.id), p.key);
    out.set(k("PageCopy", p.key), p.key);
  }
  for (const m of media) out.set(k("MediaAsset", m.id), short(m.alt || m.url.split("/").pop() || m.id));
  for (const r of rows) {
    if (!r.entityId || out.has(k(r.entity, r.entityId))) continue;
    if (r.entity === "Integration") out.set(k(r.entity, r.entityId), providerDef(r.entityId)?.name ?? r.entityId);
    else if (r.entity === "AppSetting") out.set(k(r.entity, r.entityId), `Settings · ${r.entityId}`);
    else {
      // Gone since (or not looked up): fall back to what the diff remembered.
      const d = (r.diff ?? {}) as { deleted?: Record<string, unknown>; created?: Record<string, unknown>; key?: unknown };
      const gone = d.deleted;
      const name = gone && (gone.title ?? gone.question ?? gone.authorName ?? gone.slug);
      const kept = typeof d.key === "string" ? d.key : d.created && (d.created.title ?? d.created.question ?? d.created.authorName ?? d.created.slug);
      out.set(
        k(r.entity, r.entityId),
        typeof name === "string" ? `${short(name)} (deleted)` : typeof kept === "string" ? short(kept) : `${r.entity} ${r.entityId.slice(0, 8)}…`,
      );
    }
  }
  return out;
}

export function targetLabel(targets: Map<string, string>, r: { entity: string; entityId: string | null }): string {
  if (!r.entityId) return "—";
  return targets.get(`${r.entity}:${r.entityId}`) ?? r.entityId;
}

/* ───────────────────────────── Change column ───────────────────────────── */

/** Field names whose values are never shown, only that they changed. */
const SECRET_KEY = /secret|token|password|passcode|apikey|api_key|key$|hash|totp|cipher|credential|private/i;

function fmtVal(v: unknown, key = ""): string {
  if (SECRET_KEY.test(key)) return "••••";
  if (v === null || v === undefined || v === "") return "—";
  if (typeof v === "boolean") return v ? "on" : "off";
  if (typeof v === "number") return v.toLocaleString("en-US");
  if (typeof v === "string") {
    if (/^\d{4}-\d{2}-\d{2}T/.test(v)) return v.slice(0, 10);
    if (key === "role") return roleLabel(v);
    if (key === "plan") return planLabel(v);
    return short(v, 32);
  }
  if (Array.isArray(v)) return `${v.length} item${v.length === 1 ? "" : "s"}`;
  return "…";
}

/** Flatten an object into dot paths → leaf values (depth-limited). */
function flatten(o: unknown, prefix = "", depth = 0, out = new Map<string, unknown>()): Map<string, unknown> {
  if (o && typeof o === "object" && !Array.isArray(o) && depth < 4) {
    for (const [k, v] of Object.entries(o as Record<string, unknown>)) flatten(v, prefix ? `${prefix}.${k}` : k, depth + 1, out);
  } else {
    out.set(prefix, o);
  }
  return out;
}

function changes(before: unknown, after: unknown): string {
  const a = flatten(before);
  const b = flatten(after);
  const keys = [...new Set([...a.keys(), ...b.keys()])].filter((k) => JSON.stringify(a.get(k)) !== JSON.stringify(b.get(k)));
  if (!keys.length) return "No changes";
  const shown = keys.slice(0, 3).map((k) => {
    const leaf = k.split(".").pop() ?? k;
    if (SECRET_KEY.test(leaf)) return `${k} changed`;
    return `${k}: ${fmtVal(a.get(k), leaf)} → ${fmtVal(b.get(k), leaf)}`;
  });
  return `${shown.join("; ")}${keys.length > 3 ? `; +${keys.length - 3} more` : ""}`;
}

function nameOf(o: unknown): string | null {
  if (!o || typeof o !== "object") return null;
  const r = o as Record<string, unknown>;
  const v = r.title ?? r.question ?? r.authorName ?? r.slug ?? r.url;
  return typeof v === "string" ? short(v, 40) : null;
}

/** One line describing a stored diff. Secret fields show by name only. */
export function describeDiff(action: string, diff: unknown): string {
  if (diff === null || diff === undefined) return "—";
  if (typeof diff !== "object" || Array.isArray(diff)) return fmtVal(diff);
  const d = diff as Record<string, unknown>;

  // Integrations: field names only, never values.
  if (action.startsWith("integration.")) {
    if (Array.isArray(d.fields)) return d.fields.length ? `Updated ${d.fields.map(String).join(", ")}${d.tested ? " · tested" : ""}` : "No fields changed";
    if ("ok" in d) return d.ok ? "Test passed" : "Test failed";
  }
  if ("from" in d || "to" in d) {
    const from = d.from;
    const to = d.to;
    if ((from && typeof from === "object") || (to && typeof to === "object")) return changes(from ?? {}, to ?? {});
    const key = action.includes("role") ? "role" : "";
    return `${fmtVal(from, key)} → ${fmtVal(to, key)}`;
  }
  if ("before" in d || "after" in d) return changes(d.before ?? {}, d.after ?? {});
  if ("created" in d) return `Created${nameOf(d.created) ? ` “${nameOf(d.created)}”` : ""}`;
  if ("deleted" in d) return `Deleted${nameOf(d.deleted) ? ` “${nameOf(d.deleted)}”` : ""}`;
  const parts = Object.entries(d)
    .slice(0, 4)
    .map(([k, v]) => `${k}: ${fmtVal(v, k)}`);
  return parts.length ? parts.join(" · ") : "—";
}
