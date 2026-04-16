const KEY = "launchcv_satisfaction_v1";

type SurveyMeta = {
  submitted?: boolean;
  skipUntil?: string;
  lastPromptDate?: string;
};

function read(): SurveyMeta {
  try {
    const raw = typeof localStorage !== "undefined" ? localStorage.getItem(KEY) : null;
    if (!raw) return {};
    return JSON.parse(raw) as SurveyMeta;
  } catch {
    return {};
  }
}

function write(meta: SurveyMeta) {
  try {
    localStorage.setItem(KEY, JSON.stringify(meta));
  } catch {
    /* ignore */
  }
}

/** Whether we may auto-open the survey (not submitted, skip window passed, max once per local day). */
export function shouldOfferSatisfactionSurvey(): boolean {
  if (typeof window === "undefined") return false;
  const m = read();
  if (m.submitted) return false;
  if (m.skipUntil && new Date(m.skipUntil).getTime() > Date.now()) return false;
  const today = new Date().toISOString().slice(0, 10);
  if (m.lastPromptDate === today) return false;
  return true;
}

export function markSatisfactionSurveyPromptedToday() {
  const m = read();
  write({ ...m, lastPromptDate: new Date().toISOString().slice(0, 10) });
}

export function markSatisfactionSurveySubmitted() {
  const m = read();
  write({ ...m, submitted: true, skipUntil: undefined });
}

/** User closed the modal without finishing — ask again after 14 days. */
export function markSatisfactionSurveySkipped() {
  const m = read();
  const skipUntil = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  write({ ...m, skipUntil });
}
