import { providerDef } from "@/lib/integrations";

/**
 * Plain-English lines for audit events on Admin → Security ("OpenAI cap
 * $80 → $100"), instead of action codes and ids. Values that could be secret
 * are never in the audit log, so nothing here can leak one.
 */

export type ActivityEvent = {
  id: string;
  action: string;
  entity: string;
  entityId: string | null;
  diff: unknown;
  ip: string | null;
  createdAt: Date;
  actorId: string | null;
  actorName: string;
};

export type ActivityLine = { id: string; text: string; who: string; when: Date; tone: "default" | "warn"; count: number };

const GROUP_LABELS: Record<string, string> = {
  planLimits: "Plan limits",
  budget: "Budget",
  rateLimits: "Rate limits",
  switches: "Switches",
  models: "Models",
  product: "Product settings",
  security: "Sign-in rules",
};

const FIELD_LABELS: Record<string, string> = {
  monthlyCapUsd: "OpenAI monthly cap",
  dailyCapUsd: "OpenAI daily cap",
  perUserDailyUsd: "per-user daily cap",
  onCap: "cap behavior",
  alertEmail: "alert email",
  alertLevels: "alert thresholds",
  aiTools: "AI tools",
  freeAtsCheck: "free ATS check",
  signups: "new sign-ups",
  checkout: "checkout",
  freeTools: "free writing tools",
  googleSignIn: "Google sign-in",
  maintenanceBanner: "maintenance banner",
  maintenanceMessage: "maintenance message",
  requireAdmin2fa: "required 2FA",
  adminIdleMinutes: "admin idle timeout",
  ipAllowlist: "IP allow-list",
  emailOwnerOnKeyChange: "owner emails on key changes",
};

const MONEY = new Set(["monthlyCapUsd", "dailyCapUsd", "perUserDailyUsd"]);

function fmt(key: string, v: unknown): string {
  if (typeof v === "boolean") return v ? "on" : "off";
  if (typeof v === "number") return MONEY.has(key) ? `$${v.toLocaleString("en-US")}` : v.toLocaleString("en-US");
  if (Array.isArray(v)) return v.length ? `${v.length} entr${v.length === 1 ? "y" : "ies"}` : "empty";
  if (typeof v === "string") return v ? `“${v.length > 24 ? `${v.slice(0, 24)}…` : v}”` : "empty";
  return "changed";
}

/** Flat list of [path, before, after] for leaves that differ. */
function changes(before: unknown, after: unknown, path: string[] = []): [string[], unknown, unknown][] {
  if (before && after && typeof before === "object" && typeof after === "object" && !Array.isArray(before) && !Array.isArray(after)) {
    const keys = new Set([...Object.keys(before), ...Object.keys(after)]);
    return [...keys].flatMap((k) => changes((before as Record<string, unknown>)[k], (after as Record<string, unknown>)[k], [...path, k]));
  }
  return JSON.stringify(before) === JSON.stringify(after) ? [] : [[path, before, after]];
}

function settingsLine(group: string, diff: unknown): string {
  const d = (diff ?? {}) as { before?: unknown; after?: unknown };
  const list = changes(d.before, d.after);
  const label = GROUP_LABELS[group] ?? group;
  if (!list.length) return `${label} saved (no change)`;
  const [path, b, a] = list[0];
  const key = path[path.length - 1] ?? "";
  let first: string;
  if (group === "switches" && typeof a === "boolean") first = `${FIELD_LABELS[key] ?? key} turned ${a ? "on" : "off"}`;
  else if (group === "planLimits") first = `${path[0]} plan ${key === "roleFit" ? "role-fit" : key === "jd" ? "job-post" : "packet"} limit ${fmt(key, b)} → ${fmt(key, a)}`;
  else if (group === "models" && path[0] === "freeTierModel") first = `model for free users → ${String(a) || "same as each tool"}`;
  else if (group === "models") first = `model for ${path[0].replace(/_/g, " ")} → ${String(a)}`;
  else first = `${FIELD_LABELS[key] ?? key} ${fmt(key, b)} → ${fmt(key, a)}`;
  first = first.charAt(0).toUpperCase() + first.slice(1);
  return list.length > 1 ? `${first} (+${list.length - 1} more)` : first;
}

function providerName(id: string | null) {
  return (id && providerDef(id)?.name) || id || "Integration";
}

export function describe(e: ActivityEvent, targets: Map<string, string>): { text: string; tone: "default" | "warn" } {
  const d = (e.diff ?? {}) as Record<string, unknown>;
  const target = (e.entityId && targets.get(e.entityId)) || "a team member";
  switch (e.action) {
    case "integration.update": {
      const def = e.entityId ? providerDef(e.entityId) : undefined;
      const fields = Array.isArray(d.fields) ? (d.fields as string[]) : [];
      const secret = fields.some((f) => def?.fields.find((x) => x.key === f)?.secret);
      return { text: `${providerName(e.entityId)} ${secret ? "key replaced" : "settings changed"}`, tone: "default" };
    }
    case "integration.disconnect":
      return { text: `${providerName(e.entityId)} disconnected`, tone: "warn" };
    case "integration.test":
      return { text: `${providerName(e.entityId)} connection test ${d.ok ? "passed" : "failed"}`, tone: d.ok ? "default" : "warn" };
    case "settings.update":
      return { text: settingsLine(e.entityId ?? "", e.diff), tone: "default" };
    case "user.role.change": {
      const to = String(d.to ?? "");
      if (to === "user") return { text: `${target} removed from the team`, tone: "default" };
      if (!d.from || d.from === "user") return { text: `${target} added as ${to}`, tone: "default" };
      return { text: `${target}: ${String(d.from)} → ${to}`, tone: "default" };
    }
    case "user.delete":
      return { text: `Account deleted: ${target}`, tone: "warn" };
    case "admin.2fa.enable":
      return { text: "Turned on two-factor sign-in", tone: "default" };
    case "admin.2fa.reset":
      return { text: `Two-factor reset for ${target}`, tone: "warn" };
    case "admin.2fa.failed":
      return { text: "Wrong two-factor code", tone: "warn" };
    case "admin.reauth.failed":
      return { text: "Failed re-confirm (password or code)", tone: "warn" };
    case "admin.2fa.recovery.used":
      return { text: `Recovery code used${typeof d.remaining === "number" ? ` (${d.remaining} left)` : ""}`, tone: "warn" };
    case "admin.2fa.recovery.generate":
      return { text: "New recovery codes generated", tone: "default" };
    case "admin.denied":
      return { text: `Non-admin tried to open ${typeof d.path === "string" ? d.path : "the admin panel"}`, tone: "warn" };
    case "admin.ip.blocked":
      return { text: "Staff sign-in blocked: network not on the IP allow-list", tone: "warn" };
    case "admin.origin.blocked":
      return { text: "Blocked a request from another site", tone: "warn" };
    default:
      return { text: e.action.replace(/[._-]/g, " "), tone: "default" };
  }
}

/** Describe and collapse back-to-back repeats ("Wrong two-factor code ×3"). */
export function activityLines(events: ActivityEvent[], targets: Map<string, string>): ActivityLine[] {
  const out: ActivityLine[] = [];
  for (const e of events) {
    const { text, tone } = describe(e, targets);
    const prev = out[out.length - 1];
    if (prev && prev.text === text && prev.who === e.actorName) {
      prev.count++;
      continue;
    }
    out.push({ id: e.id, text, who: e.actorName, when: e.createdAt, tone, count: 1 });
  }
  return out;
}
