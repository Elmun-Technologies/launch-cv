import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "")
  .split(",")
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean);

export async function requireAdmin(): Promise<{ sub: string; email: string } | null> {
  const session = await getSession();
  if (!session) return null;

  const user = await prisma.user.findUnique({
    where: { id: session.sub },
    select: { role: true, email: true },
  });
  if (!user) return null;

  if (user.role === "admin" || ADMIN_EMAILS.includes(user.email.toLowerCase())) {
    return session;
  }

  return null;
}

/**
 * Returns true if a freshly-loaded user row qualifies for admin access.
 * Used by the login endpoint to decide where to redirect right after sign-in.
 */
export function isAdminUser(user: { role: string; email: string }): boolean {
  return user.role === "admin" || ADMIN_EMAILS.includes(user.email.toLowerCase());
}

