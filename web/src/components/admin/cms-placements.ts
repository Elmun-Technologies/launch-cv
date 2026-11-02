/**
 * Where FAQs and testimonials can appear on the public site. Shared by the CMS
 * editors (pickers) and list pages (human labels). Plain module — safe to import
 * from both server and client components.
 */

export const FAQ_PLACEMENTS = [
  { value: "pricing", label: "Pricing page" },
  { value: "home", label: "Home FAQ section" },
  { value: "features/jd-alignment", label: "Features · JD Alignment" },
  { value: "features/resume-builder", label: "Features · Resume Builder" },
  { value: "features/cover-letter", label: "Features · Cover Letter" },
  { value: "features/interview-prep", label: "Features · Interview Prep" },
  { value: "features/ats-score", label: "Free ATS check page" },
  { value: "features/voice-input", label: "Features · Voice Input" },
];

export const TESTIMONIAL_PLACEMENTS = [
  { value: "home", label: "Home page" },
  { value: "features/jd-alignment", label: "Features · JD Alignment" },
  { value: "features/resume-builder", label: "Features · Resume Builder" },
  { value: "features/cover-letter", label: "Features · Cover Letter" },
  { value: "features/interview-prep", label: "Features · Interview Prep" },
  { value: "features/ats-score", label: "Free ATS check page" },
  { value: "features/voice-input", label: "Features · Voice Input" },
];

/** Human label for a placement value (falls back to the raw value). */
export function placementLabel(list: { value: string; label: string }[], value: string): string {
  return list.find((p) => p.value === value)?.label ?? value;
}
