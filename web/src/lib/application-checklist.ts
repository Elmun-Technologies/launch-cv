export type ChecklistItem = { id: string; label: string; done: boolean };

export function defaultApplicationChecklist(): ChecklistItem[] {
  return [
    { id: "tailor", label: "Resume tailored to JD", done: false },
    { id: "cover", label: "Cover letter prepared / sent", done: false },
    { id: "packet", label: "Interview questions and pitch reviewed", done: false },
    { id: "links", label: "Portfolio / LinkedIn links checked", done: false },
    { id: "submit", label: "Application submitted", done: false },
  ];
}
