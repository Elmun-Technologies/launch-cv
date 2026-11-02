/**
 * Export templates shared by the on-screen preview and the PDF renderer, so
 * what the editor shows is what the PDF contains. All of them are one column
 * with plain-text headings — the layout ATS parsers read reliably.
 */
export type TemplateStyle = "classic" | "modern" | "minimal" | "executive";

export const TEMPLATE_STYLES: TemplateStyle[] = ["classic", "modern", "minimal", "executive"];

export type TemplateSpec = {
  label: string;
  /** Name and section heading colour. */
  accent: string;
  /** Rule under section headings (null = none). */
  rule: string | null;
  serif: boolean;
  centered: boolean;
  /** Section headings in small caps style. */
  upper: boolean;
};

export const TEMPLATE_SPECS: Record<TemplateStyle, TemplateSpec> = {
  classic: { label: "Classic", accent: "#111111", rule: "#111111", serif: false, centered: false, upper: true },
  modern: { label: "Modern", accent: "#1D4ED8", rule: "#BFD0F5", serif: false, centered: false, upper: false },
  minimal: { label: "Minimal", accent: "#111111", rule: null, serif: false, centered: false, upper: true },
  executive: { label: "Executive", accent: "#111111", rule: "#8A8A86", serif: true, centered: true, upper: true },
};

export function parseTemplate(v: string | null | undefined): TemplateStyle {
  return TEMPLATE_STYLES.includes(v as TemplateStyle) ? (v as TemplateStyle) : "classic";
}

/** Section titles, matching the region conventions the PDF already used. */
export function sectionTitles(regionMode: string | undefined) {
  const eu = regionMode === "eu";
  return {
    summary: eu ? "Professional summary" : "Summary",
    experience: eu ? "Work experience" : "Experience",
    education: eu ? "Education and training" : "Education",
    certifications: "Certifications",
    achievements: "Achievements",
    skills: "Skills",
  };
}

/**
 * Paper size per region: US Letter for the US (the default — US recruiters and
 * printers expect 8.5×11 in), A4 for "eu". Sizes in PDF points.
 */
export function pageSizeFor(regionMode: string | undefined): { name: "LETTER" | "A4"; width: number; height: number } {
  return regionMode === "eu" ? { name: "A4", width: 595, height: 842 } : { name: "LETTER", width: 612, height: 792 };
}
