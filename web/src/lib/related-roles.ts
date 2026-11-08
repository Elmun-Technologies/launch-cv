import { RESUME_EXAMPLES } from "@/lib/resume-examples";

/**
 * Related-role links shown on the role pages (/resume-examples, /resume-keywords,
 * /cover-letter-examples). The hand-picked `related` list on each example is
 * kept first; then every role links back to the roles that picked it; then
 * each list is topped up from the same group, preferring the roles that have
 * the fewest links so far. Without this, 14 roles had no links from any other
 * role page and most had 3 — Google finds and ranks pages partly through
 * links from related pages, so the gaps left good pages hard to reach.
 *
 * Built once per server process, deterministic for a given data set.
 */
const TARGET = 6;

function build(): Map<string, string[]> {
  const order = new Map(RESUME_EXAMPLES.map((e, i) => [e.slug, i]));
  const lists = new Map<string, string[]>();
  const inbound = new Map<string, number>(RESUME_EXAMPLES.map((e) => [e.slug, 0]));
  const add = (from: string, to: string) => {
    const list = lists.get(from)!;
    if (to === from || list.includes(to) || !order.has(to)) return false;
    list.push(to);
    inbound.set(to, (inbound.get(to) ?? 0) + 1);
    return true;
  };

  // 1. Editorial picks, unchanged and first.
  for (const e of RESUME_EXAMPLES) {
    lists.set(e.slug, []);
  }
  for (const e of RESUME_EXAMPLES) for (const r of e.related) add(e.slug, r);

  // 2. Link back to every role that picked this one.
  for (const e of RESUME_EXAMPLES) {
    for (const r of e.related) {
      if ((lists.get(r)?.length ?? TARGET) < TARGET) add(r, e.slug);
    }
  }

  // 3. Top up from the same group, then anywhere, least-linked first.
  const byLeastLinked = (a: string, b: string) => (inbound.get(a)! - inbound.get(b)!) || order.get(a)! - order.get(b)!;
  for (const e of RESUME_EXAMPLES) {
    const list = lists.get(e.slug)!;
    const sameGroup = RESUME_EXAMPLES.filter((x) => x.group === e.group).map((x) => x.slug);
    while (list.length < TARGET) {
      const pool = sameGroup.filter((s) => s !== e.slug && !list.includes(s));
      const from = pool.length ? pool : RESUME_EXAMPLES.map((x) => x.slug).filter((s) => s !== e.slug && !list.includes(s));
      if (!from.length) break;
      add(e.slug, [...from].sort(byLeastLinked)[0]);
    }
  }
  return lists;
}

let cache: Map<string, string[]> | null = null;

/** Up to six related role slugs for a role page; hand-picked ones first. */
export function relatedRoleSlugs(slug: string): string[] {
  cache ??= build();
  return cache.get(slug) ?? [];
}
