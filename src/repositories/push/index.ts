import { prisma } from "@/lib/prisma";

/**
 * Save or update a push subscription for a user/device.
 * Uses endpoint as unique key — if the same browser re-subscribes, update the keys.
 */
export async function upsertPushSubscription(
  userId: string,
  data: {
    endpoint: string;
    p256dh: string;
    auth: string;
    userAgent?: string | null;
  },
) {
  return prisma.pushSubscription.upsert({
    where: { endpoint: data.endpoint },
    create: {
      userId,
      endpoint: data.endpoint,
      p256dh: data.p256dh,
      auth: data.auth,
      userAgent: data.userAgent ?? null,
    },
    update: {
      userId,
      p256dh: data.p256dh,
      auth: data.auth,
      userAgent: data.userAgent ?? null,
    },
  });
}

/**
 * Remove a push subscription (user unsubscribed or endpoint expired).
 */
export async function deletePushSubscription(endpoint: string) {
  return prisma.pushSubscription.deleteMany({
    where: { endpoint },
  });
}

/**
 * Get all push subscriptions for a user (all their devices).
 */
export async function findPushSubscriptionsByUser(userId: string) {
  return prisma.pushSubscription.findMany({
    where: { userId },
  });
}
