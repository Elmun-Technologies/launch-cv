export type ChecklistItem = { id: string; label: string; done: boolean };

export function defaultApplicationChecklist(): ChecklistItem[] {
  return [
    { id: "tailor", label: "Resume tailored to the job post", done: false },
    { id: "cover", label: "Cover letter written", done: false },
    { id: "packet", label: "Interview questions practiced", done: false },
    { id: "links", label: "LinkedIn and portfolio links checked", done: false },
    { id: "submit", label: "Application submitted", done: false },
  ];
}

/** Stored checklists are JSON; drop malformed items and fall back to the default list. */
export function normalizeChecklist(raw: unknown): ChecklistItem[] {
  if (!Array.isArray(raw)) return defaultApplicationChecklist();
  const out: ChecklistItem[] = [];
  for (const x of raw) {
    if (!x || typeof x !== "object") continue;
    const o = x as Record<string, unknown>;
    if (typeof o.id !== "string" || typeof o.label !== "string" || typeof o.done !== "boolean") continue;
    out.push({ id: o.id, label: o.label, done: o.done });
  }
  return out.length ? out : defaultApplicationChecklist();
}
