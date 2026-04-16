export const VERTICALS = [
  { id: "software", label: "Software / Backend / Frontend" },
  { id: "data", label: "Data / ML / Analytics" },
  { id: "sales", label: "Sales / GTM" },
  { id: "marketing", label: "Marketing / Growth" },
  { id: "product", label: "Product / PM" },
  { id: "design", label: "Design / UX" },
  { id: "finance", label: "Finance / Accounting" },
  { id: "operations", label: "Operations / Supply chain" },
  { id: "healthcare_ops", label: "Healthcare (non-clinical)" },
  { id: "education", label: "Education / Admin" },
  { id: "legal", label: "Legal / Paralegal" },
  { id: "engineering_non_swe", label: "Engineering (non-SWE)" },
] as const;

export type VerticalId = (typeof VERTICALS)[number]["id"];

export const REGION_MODES = [
  { id: "us", label: "US / compact (1-page tone)" },
  { id: "eu", label: "EU / detailed structure" },
] as const;
