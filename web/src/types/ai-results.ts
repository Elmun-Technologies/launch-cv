export type JdGapRow = { requirement: string; status: "met" | "partial" | "missing"; evidence?: string };

export type JdRewrittenBullet = {
  experienceId: string;
  bulletId: string;
  new_text: string;
  reason: string;
};

export type JdRemoveSuggestion = { bulletId: string; reason: string };

export type JdSkillGap = {
  skill: string;
  status: "strong" | "partial" | "missing";
  recommendation: string;
};

export type JdAlignResult = {
  match_score: number;
  keyword_coverage: string[];
  skill_gaps: JdSkillGap[];
  gap_map: JdGapRow[];
  rewritten_bullets: JdRewrittenBullet[];
  remove_suggestions: JdRemoveSuggestion[];
  explanations: string[];
};

export type RoleFitResult = {
  scores: { name: string; score: number; max: number; comment: string }[];
  overall: number;
  prioritized_fixes: string[];
};

/** Public, gated result returned by the anonymous free ATS check. The
 *  aha-moment data (score + breakdown + issue counts) is exposed; the actual
 *  fix text is intentionally withheld and unlocked behind registration. */
export type FreeAtsFix = {
  priority: "High" | "Medium" | "Low";
  title: string;
  /** One or two sentences on how to fix it. */
  fix: string;
  /** Why it matters, in one sentence, when the checker gave a reason. Older reports don't have it. */
  detail?: string;
};

/**
 * What a parser could read from the resume text, found without AI (regexes plus
 * the same section detection the free check uses). Shown as "What the software read".
 */
export type FreeAtsParsed = {
  /** The first line of the text, which parsers take as the name. Null when the text is empty. */
  name: string | null;
  /** True when that line looks like a person's name (2–4 words, letters only). */
  nameLooksRight: boolean;
  email: boolean;
  phone: boolean;
  /** Dated roles in the experience part, and how many have a job-title line next to them. */
  jobTitles: { found: number; total: number };
  /** Date ranges (or single dates when there are no ranges) and how many use a standard format. */
  dates: { readable: number; total: number };
  /** Null when there is no skills heading; [] when the heading has nothing under it. */
  skills: string[] | null;
  /** First line under the education heading (degree line when there is one); null when not found. */
  education: string | null;
};

export type FreeAtsResult = {
  overall: number;
  dimensions: { name: string; score: number }[];
  issueCounts: { high: number; medium: number; low: number };
  totalFixes: number;
  /** The highest-priority fixes, shown in full before sign-up. */
  preview: FreeAtsFix[];
  /** Deterministic parse of the text. Reports from before it existed don't have it. */
  parsed?: FreeAtsParsed;
  /** Uploaded file name, when the resume came from a file. */
  fileName?: string;
};

/** What we store and show once the report is claimed. */
export type FreeAtsReport = Omit<FreeAtsResult, "preview"> & { fixes: FreeAtsFix[] };

export type PacketResult = {
  cover_letter: string;
  interview_questions: { question: string; answer_outline: string }[];
  elevator_pitch: string;
};

export function parseJdResult(raw: unknown): JdAlignResult | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.gap_map)) return null;
  return {
    match_score: typeof o.match_score === "number" ? o.match_score : 0,
    keyword_coverage: Array.isArray(o.keyword_coverage) ? (o.keyword_coverage as string[]) : [],
    skill_gaps: Array.isArray(o.skill_gaps) ? (o.skill_gaps as JdSkillGap[]) : [],
    gap_map: o.gap_map as JdGapRow[],
    rewritten_bullets: Array.isArray(o.rewritten_bullets) ? (o.rewritten_bullets as JdRewrittenBullet[]) : [],
    remove_suggestions: Array.isArray(o.remove_suggestions) ? (o.remove_suggestions as JdRemoveSuggestion[]) : [],
    explanations: Array.isArray(o.explanations) ? (o.explanations as string[]) : [],
  };
}

export function parseRoleFitResult(raw: unknown): RoleFitResult | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (!Array.isArray(o.scores) || typeof o.overall !== "number") return null;
  return {
    scores: o.scores as RoleFitResult["scores"],
    overall: o.overall,
    prioritized_fixes: Array.isArray(o.prioritized_fixes) ? (o.prioritized_fixes as string[]) : [],
  };
}

export function parsePacketResult(raw: unknown): PacketResult | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  if (typeof o.cover_letter !== "string") return null;
  return {
    cover_letter: o.cover_letter,
    interview_questions: Array.isArray(o.interview_questions)
      ? (o.interview_questions as PacketResult["interview_questions"])
      : [],
    elevator_pitch: typeof o.elevator_pitch === "string" ? o.elevator_pitch : "",
  };
}
