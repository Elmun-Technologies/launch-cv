type Bucket = { count: number; resetAt: number };

const store = new Map<string, Bucket>();
const MAX_KEYS = 20_000;

function prune() {
  if (store.size <= MAX_KEYS) return;
  const now = Date.now();
  for (const [k, v] of store) {
    if (v.resetAt < now) store.delete(k);
    if (store.size < MAX_KEYS / 2) break;
  }
}

/** true = ruxsat, false = limit oshib ketgan */
export function consumeRateLimit(key: string, limit: number, windowMs: number): boolean {
  prune();
  const now = Date.now();
  let b = store.get(key);
  if (!b || now > b.resetAt) {
    b = { count: 0, resetAt: now + windowMs };
    store.set(key, b);
  }
  if (b.count >= limit) return false;
  b.count += 1;
  return true;
}
