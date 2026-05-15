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
