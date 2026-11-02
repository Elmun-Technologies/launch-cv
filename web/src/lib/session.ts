import { cache } from "react";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { COOKIE_NAME, verifySessionToken, type SessionPayload } from "./auth-token";

/**
 * The signed-in user for this request, or null.
 *
 * Every page, API route and the admin guard go through here, so this is where
 * account state is enforced: a valid cookie only counts while the user still
 * exists and isn't suspended (User.suspendedAt). It fails closed — if the
 * lookup errors, the request is treated as signed out. `cache` keeps it to one
 * query per request however many callers ask.
 */
export const getSession = cache(async (): Promise<SessionPayload | null> => {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifySessionToken(token);
  if (!payload) return null;
  try {
    const user = await prisma.user.findUnique({ where: { id: payload.sub }, select: { suspendedAt: true } });
    if (!user || user.suspendedAt) return null;
  } catch {
    return null;
  }
  return payload;
});
