import { prisma } from "@/lib/prisma";

export async function trackEvent(
  name: string,
  opts?: { userId?: string | null; meta?: Record<string, unknown> },
) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        name,
        userId: opts?.userId ?? undefined,
        meta: opts?.meta ? (opts.meta as object) : undefined,
      },
    });
  } catch {
    // analytics errors should not break the main request
  }
}
