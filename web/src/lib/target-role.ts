/**
 * The role and experience level a user picks during onboarding (User.targetRole / User.experienceLevel),
 * and how a role maps to a resume "vertical".
 *
 * A vertical picks the rubric the AI tools grade against (lib/rubrics.ts, rubricForVertical) and is
 * shown as-is in the admin panel, so only keys that rubricForVertical knows are returned here.
 * Kept free of the example texts so client components can import it.
 */

export const EXPERIENCE_LEVELS = [
  { key: "entry", label: "Entry level" },
  { key: "mid", label: "Mid level" },
  { key: "senior", label: "Senior" },
  { key: "career_change", label: "Changing careers" },
] as const;
export type ExperienceLevel = (typeof EXPERIENCE_LEVELS)[number]["key"];

export function isExperienceLevel(v: unknown): v is ExperienceLevel {
  return typeof v === "string" && EXPERIENCE_LEVELS.some((l) => l.key === v);
}

/** Rubric keys in lib/rubrics.ts. */
export type Vertical =
  | "software"
  | "data"
  | "sales"
  | "marketing"
  | "product"
  | "design"
  | "finance"
  | "operations"
  | "healthcare_ops"
  | "education"
  | "legal"
  | "engineering_non_swe";

/** Example roles whose vertical differs from their group's default. */
const BY_SLUG: Record<string, Vertical> = {
  "product-manager": "product",
  "data-analyst": "data",
  "data-engineer": "data",
  "data-scientist": "data",
  "business-analyst": "data",
  "supply-chain-analyst": "data",
  "account-manager": "sales",
  "customer-success-manager": "sales",
  "insurance-agent": "sales",
  "real-estate-agent": "sales",
  "sales-representative": "sales",
  "retail-sales-associate": "sales",
  "marketing-coordinator": "marketing",
  "marketing-manager": "marketing",
  "social-media-manager": "marketing",
  "content-writer": "marketing",
  "graphic-designer": "design",
  "ux-designer": "design",
  paralegal: "legal",
  "medical-billing-specialist": "finance",
  "construction-project-manager": "engineering_non_swe",
  "automotive-technician": "engineering_non_swe",
  carpenter: "engineering_non_swe",
  electrician: "engineering_non_swe",
  "hvac-technician": "engineering_non_swe",
  "maintenance-technician": "engineering_non_swe",
  plumber: "engineering_non_swe",
  welder: "engineering_non_swe",
};

/** Default vertical per example group (lib/resume-examples.ts RESUME_GROUPS). */
const BY_GROUP: Record<string, Vertical> = {
  "Tech & product": "software",
  Business: "operations",
  Finance: "finance",
  Creative: "marketing",
  Healthcare: "healthcare_ops",
  Education: "education",
  "Trades & logistics": "operations",
  "Retail & hospitality": "operations",
  "People & service": "operations",
};

/** The vertical for an example role; "software" (the rubric fallback) when the role is unknown. */
export function verticalForRole(slug: string | null | undefined, group?: string | null): Vertical {
  if (slug && BY_SLUG[slug]) return BY_SLUG[slug];
  if (group && BY_GROUP[group]) return BY_GROUP[group];
  return "software";
}
