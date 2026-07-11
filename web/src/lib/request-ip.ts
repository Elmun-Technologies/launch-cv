/** Xalqaro deployda xavfsizlik uchun IP ni xabar qiluvchi sarlavhalardan olish (cheklangan ishonch). */
export function getClientIp(req: Request): string {
  const xf = req.headers.get("x-forwarded-for");
  if (xf) return xf.split(",")[0]?.trim() || "unknown";
  const real = req.headers.get("x-real-ip");
  if (real) return real.trim();
  return "unknown";
}

/** Salted, non-reversible hash of the client IP. Used to enforce anonymous
 *  per-IP quotas (e.g. the free ATS trial) without persisting raw IPs. */
export async function hashClientIp(req: Request): Promise<string> {
  const ip = getClientIp(req);
  const salt = process.env.AUTH_SECRET ?? "launch-cv-fallback-salt";
  const { createHash } = await import("crypto");
  return createHash("sha256").update(`${salt}:${ip}`).digest("hex");
}
