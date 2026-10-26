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
    select: { role: true, email: true, emailVerifiedAt: true },
  });
  if (!user) return null;

  return isAdminUser(user) ? session : null;
}

/**
 * Returns true if a freshly-loaded user row qualifies for admin access.
 * The ADMIN_EMAILS allow-list only applies once the address is verified —
 * otherwise anyone could register an allow-listed email that has no account
 * yet and get admin access, since registration signs the user in immediately.
 */
export function isAdminUser(user: {
  role: string;
  email: string;
  emailVerifiedAt: Date | null;
}): boolean {
  if (user.role === "admin") return true;
  return user.emailVerifiedAt !== null && ADMIN_EMAILS.includes(user.email.toLowerCase());
}

