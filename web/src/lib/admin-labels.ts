/**
 * Display labels and masking for admin data pages. Pure, client-safe.
 */
import { VERTICALS } from "@/lib/constants";
import type { PlanId } from "@/lib/plan-config";

/** "jane.doe@gmail.com" → "j•••@gmail.com". Keeps the domain, hides the person. */
export function maskEmail(email: string | null | undefined): string {
  if (!email) return "—";
  const at = email.lastIndexOf("@");
  if (at <= 0) return `${email.slice(0, 1)}•••`;
  return `${email.slice(0, 1)}•••${email.slice(at)}`;
}

/** Drop the last part of an IP: "188.113.42.7" → "188.113.42.x", IPv6 keeps the first 4 groups. */
export function maskIp(ip: string | null | undefined): string {
  if (!ip || ip === "unknown") return "—";
  const v = ip.trim();
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(v)) return v.replace(/\.\d{1,3}$/, ".x");
  if (v.includes(":")) {
    const mapped = v.match(/::ffff:(\d{1,3}(?:\.\d{1,3}){3})$/i);
    if (mapped) return mapped[1].replace(/\.\d{1,3}$/, ".x");
    return `${v.split(":").filter(Boolean).slice(0, 4).join(":")}:x`;
  }
  return "—";
}

const ROLE_LABELS: Record<string, string> = {
  owner: "Owner",
  admin: "Admin",
  editor: "Editor",
  support: "Support",
  user: "User",
};
export function roleLabel(role: string): string {
  return ROLE_LABELS[role] ?? role.charAt(0).toUpperCase() + role.slice(1);
}
export const isStaffRole = (role: string) => role !== "user" && role in ROLE_LABELS;

/** "software" → "Software", "healthcare_ops" → "Healthcare (non-clinical)". */
export function verticalLabel(id: string): string {
  const v = VERTICALS.find((x) => x.id === id);
  if (!v) return id ? id.charAt(0).toUpperCase() + id.slice(1).replace(/_/g, " ") : "—";
  return v.label.split(" / ")[0];
}
/** Filter chips on Admin → Resumes: the 12 verticals in three families. */
export const VERTICAL_GROUPS = [
  { id: "tech", label: "Tech & product", verticals: ["software", "data", "product", "design", "engineering_non_swe"] },
  { id: "business", label: "Business", verticals: ["sales", "marketing", "finance", "operations"] },
  { id: "people", label: "People & service", verticals: ["healthcare_ops", "education", "legal"] },
] as const;

export function regionLabel(mode: string): string {
  if (mode === "us") return "US";
  if (mode === "eu") return "EU";
  return mode ? mode.toUpperCase() : "—";
}

const PLAN_LABELS: Record<PlanId, string> = {
  none: "Free",
  starter: "Starter",
  professional: "Professional",
  elite: "Elite",
  lifetime: "Lifetime",
};
export function planLabel(plan: PlanId | string | null | undefined): string {
  return PLAN_LABELS[(plan ?? "none") as PlanId] ?? String(plan);
}

type Tone = "green" | "amber" | "red" | "default" | "blue" | "violet";

/** Admin billing status (lib/admin-billing.ts `billingOf().status`) → label and badge tone. */
const BILLING_STATUS: Record<string, { label: string; tone: Tone }> = {
  active: { label: "Active", tone: "green" },
  trial: { label: "Trial", tone: "blue" },
  cancelling: { label: "Cancelling", tone: "amber" },
  past_due: { label: "Past due", tone: "red" },
  cancelled: { label: "Cancelled", tone: "default" },
  granted: { label: "Granted", tone: "violet" },
  none: { label: "—", tone: "default" },
};
export function billingStatusDisplay(status: string): { label: string; tone: Tone } {
  return BILLING_STATUS[status] ?? { label: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, " "), tone: "default" };
}

/** Raw subscription row status → label and badge tone. */
export function subscriptionStatusLabel(status: string, cancelAtPeriodEnd = false): { label: string; tone: Tone } {
  const s = status.toLowerCase();
  if ((s === "active" || s === "trialing" || s === "on_trial") && cancelAtPeriodEnd) return { label: "Cancelling", tone: "amber" };
  if (s === "active") return { label: "Active", tone: "green" };
  if (s === "trialing" || s === "on_trial") return { label: "Trial", tone: "blue" };
  if (s === "past_due") return { label: "Past due", tone: "red" };
  if (s === "canceled" || s === "cancelled") return { label: "Cancelled", tone: "default" };
  if (s === "revoked" || s === "expired" || s === "unpaid") return { label: s.charAt(0).toUpperCase() + s.slice(1), tone: "default" };
  return { label: status, tone: "default" };
}

/**
 * Job-application stages, named as on the user's job tracker. Older rows used
 * other spellings; they fold into the same stages. "draft" rows (created by a
 * job-match run) show in Saved on the tracker and get their own chip here.
 */
export const APP_STAGES = [
  { key: "bookmarked", label: "Saved", statuses: ["bookmarked", "draft"] },
  { key: "applying", label: "Applied", statuses: ["applying", "applied"] },
  { key: "interviewing", label: "Interviewing", statuses: ["interviewing", "interview"] },
  { key: "negotiating", label: "Offer", statuses: ["negotiating", "offer"] },
  { key: "accepted", label: "Accepted", statuses: ["accepted"] },
  { key: "rejected", label: "Closed", statuses: ["rejected", "closed"] },
] as const;
export type AppStageKey = (typeof APP_STAGES)[number]["key"];

export function appStageOf(status: string): AppStageKey {
  return APP_STAGES.find((s) => (s.statuses as readonly string[]).includes(status))?.key ?? "bookmarked";
}

/** Badge label and tone for a raw application status. */
export function appStatusBadge(status: string): { label: string; tone: "default" | "blue" | "green" | "amber" | "red" } {
  if (status === "draft") return { label: "Draft", tone: "amber" };
  const st = appStageOf(status);
  const label = APP_STAGES.find((s) => s.key === st)!.label;
  const tone = st === "interviewing" ? "blue" : st === "negotiating" || st === "accepted" ? "green" : st === "rejected" ? "red" : "default";
  return { label, tone };
}
