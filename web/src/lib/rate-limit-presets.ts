import { getClientIp } from "@/lib/request-ip";
import { consumeRateLimit } from "@/lib/rate-limit";

export function allowRegisterIp(req: Request) {
  return consumeRateLimit(`register:${getClientIp(req)}`, 8, 3_600_000);
}

/** Per IP+email pair (on localhost IP is often "unknown" — prevents all users sharing a single rate limit). */
export function allowLoginAttempt(req: Request, normalizedEmail: string) {
  const ip = getClientIp(req);
  return consumeRateLimit(`login:${ip}:${normalizedEmail.toLowerCase()}`, 40, 900_000);
}

export function allowAiJd(userId: string) {
  return consumeRateLimit(`ai:jd:${userId}`, 24, 3_600_000);
}

export function allowAiRoleFit(userId: string) {
  return consumeRateLimit(`ai:fit:${userId}`, 24, 3_600_000);
}

export function allowAiPacket(userId: string) {
  return consumeRateLimit(`ai:packet:${userId}`, 16, 3_600_000);
}

export function allowAiEvidence(userId: string) {
  return consumeRateLimit(`ai:evidence:${userId}`, 48, 3_600_000);
}

export function allowPdfUser(userId: string) {
  return consumeRateLimit(`pdf:user:${userId}`, 60, 3_600_000);
}

export function allowForgotPasswordIp(req: Request) {
  return consumeRateLimit(`forgot:${getClientIp(req)}`, 6, 3_600_000);
}
