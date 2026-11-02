import { RESUME_EXAMPLES } from "@/lib/resume-examples";
import { NewResumeClient } from "./new-resume-client";

/** Roles offered as one-tap starting points, in this order (only ones that exist are shown). */
const QUICK_ROLES = [
  "software-engineer",
  "product-manager",
  "registered-nurse",
  "data-analyst",
  "teacher",
  "marketing-manager",
  "accountant",
  "sales-representative",
  "project-manager",
  "ux-designer",
];

export default function NewResumePage() {
  // Only slugs and role names reach the client, not the full example texts.
  const examples = RESUME_EXAMPLES.map((e) => ({ slug: e.slug, role: e.role }));
  const quick = QUICK_ROLES.map((s) => examples.find((e) => e.slug === s)).filter((e): e is { slug: string; role: string } => !!e);
  return <NewResumeClient examples={examples} quick={quick} />;
}
