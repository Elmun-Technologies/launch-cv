import { prisma } from "@/lib/prisma";
import { normalizeAllowlist } from "@/lib/ip-allowlist";
import { NONE_LIMITS, PLAN_MONTHLY_LIMITS, type CheckoutPlan, type PlanId } from "@/lib/plan-config";

/**
 * Admin-editable runtime settings (Admin → Limits & budgets, Integrations).
 * Each group is stored as one AppSetting row and merged over the defaults
 * below, so a missing or partial row never breaks the app. Cached for 30 s.
 */

export type PlanLimits = { jd: number; packet: number; roleFit: number };

export type AiTool =
  | "free_ats"
  | "jd_align"
  | "impact_rewrite"
  | "role_fit"
  | "packet"
  | "company_match"
  | "evidence"
  | "email"
  | "import"
  | "free_bullets"
  | "free_summary";

export const AI_TOOL_LABELS: Record<AiTool, string> = {
  free_ats: "Free ATS check",
  jd_align: "Job match",
  impact_rewrite: "Bullet rewrites",
  role_fit: "Role fit",
  packet: "Cover letter & interview",
  company_match: "Company matcher",
  evidence: "Consistency check",
  email: "Email drafts",
  import: "Resume import",
  free_bullets: "Free bullet generator",
  free_summary: "Free summary generator",
};

export const AI_MODELS = ["gpt-4o-mini", "gpt-4o", "gpt-4.1-mini", "gpt-4.1"] as const;

/** Plans with editable monthly quotas: every checkout plan plus "free" (no paid plan). */
export type QuotaPlan = CheckoutPlan | "free";

/** Budget alert thresholds (% of the monthly cap) the admin can pick from. */
export const ALERT_LEVEL_CHOICES = [25, 50, 75, 80, 90, 100] as const;

export type Settings = {
  planLimits: Record<QuotaPlan, PlanLimits>;
  budget: {
    /** USD; 0 = no cap. */
    monthlyCapUsd: number;
    dailyCapUsd: number;
    /** What happens when a cap is reached. */
    onCap: "pause_free" | "pause_all" | "alert_only";
    /** Per-user safety caps. */
    perUserDailyUsd: number;
    alertEmail: string;
    /** Percent of the monthly cap at which an alert email is sent, ascending. */
    alertLevels: number[];
  };
  rateLimits: {
    aiPerUserPerHour: number;
    importPerUserPerHour: number;
    registerPerIpPerHour: number;
    loginPer15Min: number;
    freeAtsPerIpPerHour: number;
    forgotPerIpPerHour: number;
    pdfPerUserPerHour: number;
    /** Shared daily quota for the public AI writing tools (bullet + summary generators). */
    freeToolsPerIpPerDay: number;
  };
  switches: {
    aiTools: boolean;
    freeAtsCheck: boolean;
    signups: boolean;
    checkout: boolean;
    /** Public AI writing tools under /tools (bullet + summary generators). */
    freeTools: boolean;
    /** "Continue with Google" on login and register, and the Google OAuth routes. */
    googleSignIn: boolean;
  };
  /** Product toggles from Admin → Settings that aren't emergency switches. */
  product: {
    maintenanceBanner: boolean;
    /** Shown in the site-wide banner while it's on. Plain text. */
    maintenanceMessage: string;
  };
  models: Record<AiTool, string>;
  security: {
    requireAdmin2fa: boolean;
    adminIdleMinutes: number;
    /** Addresses / CIDR ranges allowed to open the admin panel. Empty = any network. */
    ipAllowlist: string[];
    /** Email every owner when an integration key is changed or disconnected. */
    emailOwnerOnKeyChange: boolean;
  };
};

export const DEFAULT_SETTINGS: Settings = {
  planLimits: {
    free: { ...NONE_LIMITS },
    starter: { ...PLAN_MONTHLY_LIMITS.starter },
    professional: { ...PLAN_MONTHLY_LIMITS.professional },
    elite: { ...PLAN_MONTHLY_LIMITS.elite },
    lifetime: { ...PLAN_MONTHLY_LIMITS.lifetime },
  },
  budget: { monthlyCapUsd: 0, dailyCapUsd: 0, onCap: "pause_free", perUserDailyUsd: 2, alertEmail: "", alertLevels: [50, 80, 100] },
  rateLimits: {
    aiPerUserPerHour: 24,
    importPerUserPerHour: 10,
    registerPerIpPerHour: 8,
    loginPer15Min: 40,
    freeAtsPerIpPerHour: 5,
    forgotPerIpPerHour: 6,
    pdfPerUserPerHour: 60,
    freeToolsPerIpPerDay: 10,
  },
  switches: { aiTools: true, freeAtsCheck: true, signups: true, checkout: true, freeTools: true, googleSignIn: true },
  product: { maintenanceBanner: false, maintenanceMessage: "" },
  models: {
    free_ats: "gpt-4o-mini",
    jd_align: "gpt-4o-mini",
    impact_rewrite: "gpt-4o-mini",
    role_fit: "gpt-4o-mini",
    packet: "gpt-4o-mini",
    company_match: "gpt-4o-mini",
    evidence: "gpt-4o-mini",
    email: "gpt-4o-mini",
    import: "gpt-4o-mini",
    free_bullets: "gpt-4o-mini",
    free_summary: "gpt-4o-mini",
  },
  security: { requireAdmin2fa: true, adminIdleMinutes: 30, ipAllowlist: [], emailOwnerOnKeyChange: true },
};

export type SettingsGroup = keyof Settings;
const GROUPS = Object.keys(DEFAULT_SETTINGS) as SettingsGroup[];

const TTL_MS = 30_000;
let cache: { at: number; value: Settings } | null = null;

function merge<T>(base: T, patch: unknown): T {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) return base;
  const out: Record<string, unknown> = { ...(base as Record<string, unknown>) };
  for (const [key, b] of Object.entries(base as Record<string, unknown>)) {
    const p = (patch as Record<string, unknown>)[key];
    if (p === undefined) continue;
    if (b && typeof b === "object" && !Array.isArray(b)) out[key] = merge(b, p);
    else if (typeof p === typeof b) out[key] = p;
  }
  return out as T;
}

export async function getSettings(): Promise<Settings> {
  if (cache && Date.now() - cache.at < TTL_MS) return cache.value;
  let value = DEFAULT_SETTINGS;
  try {
    const rows = await prisma.appSetting.findMany({ where: { key: { in: GROUPS } } });
    const patch: Record<string, unknown> = {};
    for (const r of rows) patch[r.key] = r.value;
    value = merge(DEFAULT_SETTINGS, patch);
  } catch {
    // Database unreachable — run on defaults.
  }
  cache = { at: Date.now(), value };
  return value;
}

export function invalidateSettingsCache() {
  cache = null;
}

/** Validate and store one settings group. Unknown keys and wrong types are dropped. */
export async function saveSettingsGroup<G extends SettingsGroup>(group: G, value: unknown, actorId: string): Promise<Settings[G]> {
  const merged = merge(DEFAULT_SETTINGS[group], value) as Settings[G];
  const clean = sanitize(group, merged);
  await prisma.appSetting.upsert({
    where: { key: group },
    create: { key: group, value: clean as object, updatedById: actorId },
    update: { value: clean as object, updatedById: actorId },
  });
  invalidateSettingsCache();
  return clean;
}

function clampInt(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, Math.round(Number.isFinite(n) ? n : min)));
}
function clampMoney(n: number) {
  return Math.min(100_000, Math.max(0, Math.round((Number.isFinite(n) ? n : 0) * 100) / 100));
}

function sanitize<G extends SettingsGroup>(group: G, v: Settings[G]): Settings[G] {
  if (group === "planLimits") {
    const pl = v as Settings["planLimits"];
    for (const plan of Object.keys(pl) as QuotaPlan[]) {
      pl[plan] = { jd: clampInt(pl[plan].jd, 0, 100_000), packet: clampInt(pl[plan].packet, 0, 100_000), roleFit: clampInt(pl[plan].roleFit, 0, 100_000) };
    }
  } else if (group === "budget") {
    const b = v as Settings["budget"];
    b.monthlyCapUsd = clampMoney(b.monthlyCapUsd);
    b.dailyCapUsd = clampMoney(b.dailyCapUsd);
    b.perUserDailyUsd = clampMoney(b.perUserDailyUsd);
    if (!["pause_free", "pause_all", "alert_only"].includes(b.onCap)) b.onCap = "pause_free";
    b.alertEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.alertEmail.trim()) ? b.alertEmail.trim() : "";
    const levels = Array.isArray(b.alertLevels) ? b.alertLevels : DEFAULT_SETTINGS.budget.alertLevels;
    b.alertLevels = [...new Set(levels.filter((l) => typeof l === "number" && Number.isFinite(l)).map((l) => clampInt(l, 1, 100)))]
      .sort((x, y) => x - y)
      .slice(0, 6);
  } else if (group === "rateLimits") {
    const r = v as Record<string, number>;
    for (const key of Object.keys(r)) r[key] = clampInt(r[key], 1, 10_000);
    r.freeToolsPerIpPerDay = clampInt(r.freeToolsPerIpPerDay, 1, 1_000);
  } else if (group === "models") {
    const m = v as Record<string, string>;
    for (const key of Object.keys(m)) if (!(AI_MODELS as readonly string[]).includes(m[key])) m[key] = "gpt-4o-mini";
  } else if (group === "security") {
    const s = v as Settings["security"];
    s.adminIdleMinutes = clampInt(s.adminIdleMinutes, 5, 720);
    s.ipAllowlist = normalizeAllowlist(s.ipAllowlist).valid;
  } else if (group === "product") {
    const p = v as Settings["product"];
    p.maintenanceMessage = p.maintenanceMessage.replace(/[\u0000-\u001f\u007f]+/g, " ").trim().slice(0, 240);
  }
  return v;
}

export async function planLimits(plan: PlanId): Promise<PlanLimits> {
  if (plan === "none") return (await getSettings()).planLimits.free;
  return (await getSettings()).planLimits[plan];
}
