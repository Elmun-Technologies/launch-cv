type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();
const MAX_KEYS = 20_000;

function pruneExpired(now: number) {
  for (const [k, v] of store) {
    if (v.resetAt < now) store.delete(k);
  }
}

function evictIfOverCapacity(now: number) {
  if (store.size <= MAX_KEYS) return;
  pruneExpired(now);
  if (store.size <= MAX_KEYS) return;
  /** Still over capacity after pruning expired entries — evict oldest by
   *  reset time. Map iteration is insertion order, so this is close to LRU. */
  const target = Math.floor(MAX_KEYS * 0.8);
  for (const k of store.keys()) {
    if (store.size <= target) break;
    store.delete(k);
  }
}

/** true = allowed, false = limit exceeded */
export function consumeRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  evictIfOverCapacity(now);
  let b = store.get(key);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    store.set(key, b);
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}

/**
 * Fixed-window limit shared by every server instance (RateLimitBucket table),
 * so it survives deploys and cold starts. One atomic upsert per call. Falls
 * back to the in-memory limiter if the database is unreachable.
 */
export async function consumeRateLimitShared(key: string, limit: number, windowMs: number): Promise<boolean> {
  const { prisma } = await import("@/lib/prisma");
  const resetAt = new Date(Date.now() + windowMs);
  try {
    const rows = await prisma.$queryRaw<{ count: number }[]>`
      INSERT INTO "RateLimitBucket" ("key", "count", "resetAt")
      VALUES (${key}, 1, ${resetAt})
      ON CONFLICT ("key") DO UPDATE SET
        "count" = CASE WHEN "RateLimitBucket"."resetAt" < NOW() THEN 1 ELSE "RateLimitBucket"."count" + 1 END,
        "resetAt" = CASE WHEN "RateLimitBucket"."resetAt" < NOW() THEN ${resetAt} ELSE "RateLimitBucket"."resetAt" END
      RETURNING "count"`;
    const count = Number(rows[0]?.count ?? 1);
    // Occasionally clear long-expired buckets so the table stays small.
    if (Math.random() < 0.01) {
      await prisma.rateLimitBucket.deleteMany({ where: { resetAt: { lt: new Date(Date.now() - 86_400_000) } } }).catch(() => undefined);
    }
    return count <= limit;
  } catch {
    return consumeRateLimit(key, limit, windowMs);
  }
}
