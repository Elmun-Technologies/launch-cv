import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { billingOf, payingSubscriptionWhere, planResolver } from "@/lib/admin-billing";

/** Admin → Users list and its CSV export share these filters. Server only. */

export const USER_FILTERS = ["all", "paying", "free", "past_due"] as const;
export type UserFilter = (typeof USER_FILTERS)[number];

export function userListWhere(q: string | undefined, filter: UserFilter, now = new Date()): Prisma.UserWhereInput {
  const and: Prisma.UserWhereInput[] = [];
  if (q) {
    and.push({
      OR: [
        { email: { contains: q, mode: "insensitive" } },
        { name: { contains: q, mode: "insensitive" } },
      ],
    });
  }
  // "Paying" means a billing-provider subscription or order that grants access
  // (lib/entitlements.ts); staff-granted plans count as free here.
  if (filter === "paying") and.push({ subscription: { is: payingSubscriptionWhere(now) } });
  if (filter === "free") and.push({ NOT: { subscription: { is: payingSubscriptionWhere(now) } } });
  if (filter === "past_due") and.push({ subscription: { is: { status: "past_due" } } });
  return and.length ? { AND: and } : {};
}

export const userListSelect = {
  id: true,
  email: true,
  name: true,
  role: true,
  createdAt: true,
  suspendedAt: true,
  googleId: true,
  grantedPlan: true,
  grantedPlanUntil: true,
  subscription: {
    select: { status: true, currentPeriodEnd: true, cancelAtPeriodEnd: true, stripePriceId: true, stripeSubscriptionId: true },
  },
  _count: { select: { resumes: true, jobApplications: true } },
} satisfies Prisma.UserSelect;

type Listed = Prisma.UserGetPayload<{ select: typeof userListSelect }>;

export type AdminUserRow = {
  id: string;
  email: string;
  name: string | null;
  role: string;
  createdAt: string;
  suspended: boolean;
  plan: string;
  status: string;
  granted: boolean;
  resumeCount: number;
  appCount: number;
};

export async function toUserRows(users: Listed[]): Promise<AdminUserRow[]> {
  const planOf = await planResolver(users.map((u) => u.subscription?.stripePriceId));
  return users.map((u) => {
    const b = billingOf(u.subscription, u, planOf);
    return {
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      createdAt: u.createdAt.toISOString(),
      suspended: !!u.suspendedAt,
      plan: b.plan,
      status: b.status,
      granted: b.granted,
      resumeCount: u._count.resumes,
      appCount: u._count.jobApplications,
    };
  });
}

export async function loadUserPage(opts: { q?: string; filter: UserFilter; page: number; pageSize: number }) {
  const where = userListWhere(opts.q, opts.filter);
  const [total, users] = await Promise.all([
    prisma.user.count({ where }),
    prisma.user.findMany({
      where,
      skip: (opts.page - 1) * opts.pageSize,
      take: opts.pageSize,
      orderBy: { createdAt: "desc" },
      select: userListSelect,
    }),
  ]);
  return { total, rows: await toUserRows(users) };
}
