"use client";

import { useEffect, useState, useCallback } from "react";
import api from "@/services/api-client";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

/**
 * Convert a base64 VAPID public key to a Uint8Array for the Push API.
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function usePushNotifications() {
  const supported =
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window;

  const [isSubscribed, setIsSubscribed] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>(
    supported ? Notification.permission : "default",
  );

  useEffect(() => {
    if (!supported) return;

    // Check existing subscription
    navigator.serviceWorker.ready.then((reg) => {
      reg.pushManager.getSubscription().then((sub) => {
        setIsSubscribed(!!sub);
      });
    });
  }, [supported]);

  const subscribe = useCallback(async () => {
    if (!supported) return false;

    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") return false;

      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          VAPID_PUBLIC_KEY,
        ) as BufferSource,
      });

      const json = sub.toJSON();
      await api.post("/push/subscribe", {
        endpoint: json.endpoint,
        keys: json.keys,
        userAgent: navigator.userAgent,
      });

      setIsSubscribed(true);
      return true;
    } catch (err) {
      console.error("[Push] Subscribe error:", err);
      return false;
    }
  }, [supported]);

  const unsubscribe = useCallback(async () => {
    try {
      const reg = await navigator.serviceWorker.ready;
      const sub = await reg.pushManager.getSubscription();
      if (sub) {
        await api.delete("/push/subscribe", {
          data: { endpoint: sub.endpoint },
        });
        await sub.unsubscribe();
      }
      setIsSubscribed(false);
      return true;
    } catch (err) {
      console.error("[Push] Unsubscribe error:", err);
      return false;
    }
  }, []);

  return {
    isSupported: supported,
    isSubscribed,
    permission,
    subscribe,
    unsubscribe,
  };
}
