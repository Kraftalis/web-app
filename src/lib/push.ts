import webPush from "web-push";
import {
  findPushSubscriptionsByUser,
  deletePushSubscription,
} from "@/repositories/push";

/**
 * Lazily initialise VAPID credentials.
 * web-push validates keys eagerly, which blows up at build time when
 * env vars are empty. A one-time guard keeps things safe.
 */
let vapidReady = false;

function ensureVapid() {
  if (vapidReady) return;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";
  const privateKey = process.env.VAPID_PRIVATE_KEY ?? "";
  const subject = process.env.VAPID_SUBJECT ?? "mailto:noreply@kraftalis.com";

  if (!publicKey || !privateKey) {
    console.warn(
      "[Push] VAPID keys not configured — push notifications disabled.",
    );
    return;
  }

  webPush.setVapidDetails(subject, publicKey, privateKey);
  vapidReady = true;
}

export interface PushPayload {
  title: string;
  body: string;
  icon?: string;
  badge?: string;
  url?: string;
  tag?: string;
}

/**
 * Send a push notification to all devices of a user.
 * Automatically cleans up expired/invalid subscriptions.
 */
export async function sendPushToUser(userId: string, payload: PushPayload) {
  ensureVapid();
  if (!vapidReady) return { sent: 0, total: 0 };

  const subscriptions = await findPushSubscriptionsByUser(userId);

  const results = await Promise.allSettled(
    subscriptions.map(async (sub) => {
      try {
        await webPush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.p256dh, auth: sub.auth },
          },
          JSON.stringify(payload),
        );
      } catch (err: unknown) {
        // If subscription is expired/invalid, clean it up
        const statusCode = (err as { statusCode?: number })?.statusCode;
        if (statusCode === 404 || statusCode === 410) {
          await deletePushSubscription(sub.endpoint);
        }
        throw err;
      }
    }),
  );

  const sent = results.filter((r) => r.status === "fulfilled").length;
  return { sent, total: subscriptions.length };
}
