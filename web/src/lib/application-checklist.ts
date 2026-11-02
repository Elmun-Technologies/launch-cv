export type ChecklistItem = { id: string; label: string; done: boolean };

/** Board columns the checklist follows (older status spellings fold into these). */
export type ChecklistStage = "saved" | "applied" | "interviewing" | "offer" | "accepted" | "closed";

const STAGE_OF_STATUS: Record<string, ChecklistStage> = {
  bookmarked: "saved",
  draft: "saved",
  saved: "saved",
  applying: "applied",
  applied: "applied",
  interviewing: "interviewing",
  interview: "interviewing",
  negotiating: "offer",
  offer: "offer",
  accepted: "accepted",
  rejected: "closed",
  closed: "closed",
};

export function checklistStageOf(status: string): ChecklistStage {
  return STAGE_OF_STATUS[status] ?? "saved";
}

const LABELS: Record<string, string> = {
  tailor: "Tailor resume to the post",
  cover: "Write a cover letter",
  send: "Send application",
  follow_up: "Follow up with recruiter",
  research: "Research the team",
  stories: "Prepare 3 stories",
  thanks: "Send thank-you note",
  offer_writing: "Get the offer in writing",
  offer_compare: "Compare it with your other options",
  offer_negotiate: "Negotiate salary and start date",
  accept_sign: "Sign the offer",
  accept_withdraw: "Withdraw your other applications",
  accept_thank: "Thank the people who helped",
  closed_feedback: "Ask for feedback",
  closed_notes: "Note what to change next time",
};

/** What to do at each stage; items carry over as a job moves along. */
const STAGE_ITEMS: Record<ChecklistStage, string[]> = {
  saved: ["tailor", "cover", "send"],
  applied: ["tailor", "send", "follow_up"],
  interviewing: ["tailor", "send", "follow_up", "research", "stories", "thanks"],
  offer: ["thanks", "offer_writing", "offer_compare", "offer_negotiate"],
  accepted: ["accept_sign", "accept_withdraw", "accept_thank"],
  closed: ["closed_feedback", "closed_notes"],
};

/** Ids from the first, single-list checklist that mean the same thing as a current item. */
const LEGACY_ID: Record<string, string> = { submit: "send", packet: "stories" };

/** The checklist stored on a new application: the Saved stage's items, none done. */
export function defaultApplicationChecklist(): ChecklistItem[] {
  return STAGE_ITEMS.saved.map((id) => ({ id, label: LABELS[id], done: false }));
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

/** Done state by current id, reading legacy ids too. */
function doneMap(stored: ChecklistItem[]): Map<string, boolean> {
  const m = new Map<string, boolean>();
  for (const i of stored) {
    const id = LEGACY_ID[i.id] ?? i.id;
    m.set(id, (m.get(id) ?? false) || i.done);
  }
  return m;
}

/** The items shown for a stage, ticked from what the user saved (at any stage). */
export function checklistForStage(status: string, stored: ChecklistItem[]): ChecklistItem[] {
  const done = doneMap(stored);
  return STAGE_ITEMS[checklistStageOf(status)].map((id) => ({ id, label: LABELS[id] ?? id, done: done.get(id) ?? false }));
}

/**
 * The stored list after ticking or unticking one item. Items from other stages
 * (and legacy ones) are kept, so moving a job back and forth loses nothing.
 */
export function setChecklistItem(stored: ChecklistItem[], id: string, done: boolean): ChecklistItem[] {
  let hit = false;
  const next = stored.map((i) => {
    if ((LEGACY_ID[i.id] ?? i.id) !== id) return i;
    hit = true;
    return { ...i, done };
  });
  return hit ? next : [...next, { id, label: LABELS[id] ?? id, done }];
}
