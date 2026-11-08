import { prisma } from "@/lib/prisma";
import { subscriptionRowGrantsPaid } from "@/lib/entitlement-rules";

export {
  subscriptionRowGrantsPaid,
  isOneTimeRow,
  isLifetimeRow,
  isUnexpiredPassRow,
  passPeriodEnd,
  PAID_STATUSES,
  type SubscriptionGrantInput,
} from "@/lib/entitlement-rules";

/** @deprecated Use `subscriptionRowGrantsPaid` — name kept for older call sites. */
export const subscriptionRowGrantsPro = subscriptionRowGrantsPaid;

export async function userHasProSubscription(userId: string): Promise<boolean> {
  const sub = await prisma.subscription.findUnique({
    where: { userId },
    select: { status: true, currentPeriodEnd: true, stripeSubscriptionId: true },
  });
  return subscriptionRowGrantsPaid(sub);
}
