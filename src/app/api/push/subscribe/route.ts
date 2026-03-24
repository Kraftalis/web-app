import { NextRequest } from "next/server";
import {
  successResponse,
  validationError,
  internalError,
  requireAuth,
} from "@/lib/api";
import {
  upsertPushSubscription,
  deletePushSubscription,
} from "@/repositories/push";

/**
 * POST /api/push/subscribe
 * Save a push subscription for the authenticated user.
 */
export async function POST(request: NextRequest) {
  const { userId, error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { endpoint, keys, userAgent } = body;

    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return validationError("Missing subscription data.");
    }

    await upsertPushSubscription(userId, {
      endpoint,
      p256dh: keys.p256dh,
      auth: keys.auth,
      userAgent: userAgent ?? null,
    });

    return successResponse({ subscribed: true });
  } catch (err) {
    console.error("[API] POST /api/push/subscribe error:", err);
    return internalError();
  }
}

/**
 * DELETE /api/push/subscribe
 * Remove a push subscription.
 */
export async function DELETE(request: NextRequest) {
  const { error } = await requireAuth();
  if (error) return error;

  try {
    const body = await request.json();
    const { endpoint } = body;

    if (!endpoint) {
      return validationError("Missing endpoint.");
    }

    await deletePushSubscription(endpoint);
    return successResponse({ unsubscribed: true });
  } catch (err) {
    console.error("[API] DELETE /api/push/subscribe error:", err);
    return internalError();
  }
}
