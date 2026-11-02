/**
 * Builds the skills dictionary from the resume examples. Server/script side only: it imports
 * all 88 examples. The browser uses the generated copy in lib/skills-dictionary.ts.
 */
import { RESUME_EXAMPLES } from "@/lib/resume-examples";

/** tool: software and named systems · hard: job skills · credential: licences and certifications · soft: soft skills. */
export type SkillKind = "tool" | "hard" | "credential" | "soft";

/** Kind precedence when two examples sort the same keyword differently. */
const RANK: Record<SkillKind, number> = { credential: 3, tool: 2, soft: 1, hard: 0 };

/** Every distinct keyword (first spelling wins, case-insensitive), sorted, with its kind. */
export function buildSkillsDictionary(): [string, SkillKind][] {
  const map = new Map<string, { term: string; kind: SkillKind }>();
  for (const e of RESUME_EXAMPLES) {
    const sort = e.keywordSort ?? {};
    for (const term of e.keywords) {
      const kind: SkillKind = sort.credentials?.includes(term)
        ? "credential"
        : sort.tools?.includes(term)
          ? "tool"
          : sort.soft?.includes(term)
            ? "soft"
            : "hard";
      const key = term.toLowerCase();
      const prev = map.get(key);
      if (!prev) map.set(key, { term, kind });
      else if (RANK[kind] > RANK[prev.kind]) prev.kind = kind;
    }
  }
  return [...map.values()]
    .sort((a, b) => a.term.toLowerCase().localeCompare(b.term.toLowerCase()))
    .map((x) => [x.term, x.kind]);
}
