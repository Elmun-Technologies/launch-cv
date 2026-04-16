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
