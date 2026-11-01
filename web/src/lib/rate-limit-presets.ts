import { getClientIp } from "@/lib/request-ip";
import { consumeRateLimitShared } from "@/lib/rate-limit";
import { getSettings } from "@/lib/app-settings";

/** Limits are edited in Admin → Limits & budgets and shared across servers. */
const HOUR = 3_600_000;

async function limits() {
  return (await getSettings()).rateLimits;
}

export async function allowRegisterIp(req: Request) {
  return consumeRateLimitShared(`register:${getClientIp(req)}`, (await limits()).registerPerIpPerHour, HOUR);
}

/** Per IP+email pair (on localhost IP is often "unknown" — prevents all users sharing a single rate limit). */
export async function allowLoginAttempt(req: Request, normalizedEmail: string) {
  const ip = getClientIp(req);
  return consumeRateLimitShared(`login:${ip}:${normalizedEmail.toLowerCase()}`, (await limits()).loginPer15Min, 900_000);
}

async function ai(kind: string, userId: string) {
  return consumeRateLimitShared(`ai:${kind}:${userId}`, (await limits()).aiPerUserPerHour, HOUR);
}
export const allowAiJd = (userId: string) => ai("jd", userId);
export const allowAiRoleFit = (userId: string) => ai("fit", userId);
export const allowAiPacket = (userId: string) => ai("packet", userId);
export const allowAiEvidence = (userId: string) => ai("evidence", userId);

/** Resume import (file / LinkedIn text) calls the model on every request and
 *  is open to unpaid accounts, so it needs its own cap. */
export async function allowImport(userId: string) {
  return consumeRateLimitShared(`import:${userId}`, (await limits()).importPerUserPerHour, HOUR);
}

export async function allowPdfUser(userId: string) {
  return consumeRateLimitShared(`pdf:user:${userId}`, (await limits()).pdfPerUserPerHour, HOUR);
}

export async function allowForgotPasswordIp(req: Request) {
  return consumeRateLimitShared(`forgot:${getClientIp(req)}`, (await limits()).forgotPerIpPerHour, HOUR);
}

/** Burst guard for the public free ATS check, in front of the per-IP monthly quota. */
export async function allowFreeAtsBurst(req: Request) {
  return consumeRateLimitShared(`free-ats:${getClientIp(req)}`, (await limits()).freeAtsPerIpPerHour, HOUR);
}
